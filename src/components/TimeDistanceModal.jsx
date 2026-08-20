import React from 'react';
import { Activity } from 'lucide-react';

export const TimeDistanceModal = ({
  trains,
  conflicts,
  stations,
  timeHours,
}) => {
  const SVG_WIDTH = 900;
  const SVG_HEIGHT = 320;
  const PAD_LEFT = 80;
  const PAD_RIGHT = 30;
  const PAD_TOP = 25;
  const PAD_BOTTOM = 30;

  const GRAPH_WIDTH = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
  const GRAPH_HEIGHT = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

  const windowStartHours = Math.floor(timeHours * 2) / 2 - 0.25;
  const windowEndHours = windowStartHours + 1.0;

  const timeToX = (tHours) => {
    const progress = (tHours - windowStartHours) / (windowEndHours - windowStartHours);
    return PAD_LEFT + Math.max(0, Math.min(1, progress)) * GRAPH_WIDTH;
  };

  const kmToY = (km) => {
    const progress = km / 35.0;
    return PAD_TOP + progress * GRAPH_HEIGHT;
  };

  const currentX = timeToX(timeHours);

  return (
    <div className="tsv-chart-container">
      <div className="tsv-header">
        <div className="title-left">
          <Activity className="w-5 h-5 text-sky-400" />
          <h3 className="tsv-title">AUTHENTIC MASTER TIME-DISTANCE STRING CHART (TSV / CONTROL GRAPH)</h3>
        </div>

        <div className="legend-row">
          <div className="leg-item"><span className="line-solid" /><span>Actual Run</span></div>
          <div className="leg-item"><span className="line-dashed" /><span>AI Projected</span></div>
          <div className="leg-item text-red"><span className="dot-red" /><span>Conflict Intersection</span></div>
        </div>
      </div>

      <div className="svg-scroll-box">
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="tsv-svg">
          <rect x={PAD_LEFT} y={PAD_TOP} width={GRAPH_WIDTH} height={GRAPH_HEIGHT} fill="#070a14" />

          {stations.map((stn) => {
            const y = kmToY(stn.km);
            return (
              <g key={`stn-grid-${stn.id}`}>
                <line x1={PAD_LEFT} y1={y} x2={SVG_WIDTH - PAD_RIGHT} y2={y} stroke="#1f3056" strokeWidth={1} strokeDasharray="2,2" />
                <text x={PAD_LEFT - 8} y={y + 3} fill="#94a3b8" fontSize={8.5} fontFamily="monospace" textAnchor="end" fontWeight="bold">
                  {stn.code} ({stn.km.toFixed(0)}k)
                </text>
              </g>
            );
          })}

          {Array.from({ length: 7 }).map((_, idx) => {
            const t = windowStartHours + (idx * 10) / 60;
            const x = timeToX(t);
            const minutes = Math.round((t % 1) * 60);
            const hours = Math.floor(t) % 24;
            const timeLabel = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

            return (
              <g key={`time-tick-${idx}`}>
                <line x1={x} y1={PAD_TOP} x2={x} y2={SVG_HEIGHT - PAD_BOTTOM} stroke="#17233f" strokeWidth={1} />
                <text x={x} y={SVG_HEIGHT - PAD_BOTTOM + 14} fill="#64748b" fontSize={8} fontFamily="monospace" textAnchor="middle">
                  {timeLabel}
                </text>
              </g>
            );
          })}

          {trains.map((train) => {
            const isUp = train.direction === 'UP';
            const speedKmh = Math.max(20, train.speedKmh);

            const pastX = timeToX(timeHours - 0.25);
            const pastY = kmToY(
              isUp
                ? Math.max(0, train.positionKm - speedKmh * 0.25)
                : Math.min(35, train.positionKm + speedKmh * 0.25)
            );

            const currX = timeToX(timeHours);
            const currY = kmToY(train.positionKm);

            const futureX = timeToX(timeHours + 0.4);
            const futureY = kmToY(
              isUp
                ? Math.min(35, train.positionKm + speedKmh * 0.4)
                : Math.max(0, train.positionKm - speedKmh * 0.4)
            );

            return (
              <g key={`string-${train.id}`}>
                <line x1={pastX} y1={pastY} x2={currX} y2={currY} stroke={train.color} strokeWidth={2.2} opacity={0.85} />
                <line x1={currX} y1={currY} x2={futureX} y2={futureY} stroke={train.color} strokeWidth={2.2} strokeDasharray="4,3" opacity={0.7} />
                <circle cx={currX} cy={currY} r={3.5} fill={train.color} stroke="#ffffff" strokeWidth={1} />
                <text x={currX + 6} y={currY - 4} fill={train.color} fontSize={8} fontWeight="bold" fontFamily="monospace">
                  #{train.number}
                </text>
              </g>
            );
          })}

          {conflicts.map((conf) => {
            const confX = timeToX(timeHours + conf.timeToConflictSec / 3600);
            const confY = kmToY(conf.km);

            return (
              <g key={`conf-chart-${conf.id}`} transform={`translate(${confX}, ${confY})`}>
                <circle cx={0} cy={0} r={9} fill="none" stroke="#ef4444" strokeWidth={1.5} className="pulse-ping" />
                <circle cx={0} cy={0} r={4.5} fill="#ef4444" />
                <text x={12} y={3} fill="#fca5a5" fontSize={8} fontFamily="monospace" fontWeight="bold">
                  CONFLICT ({Math.round(conf.timeToConflictSec / 60)}m)
                </text>
              </g>
            );
          })}

          <line x1={currentX} y1={PAD_TOP} x2={currentX} y2={SVG_HEIGHT - PAD_BOTTOM} stroke="#38bdf8" strokeWidth={2} opacity={0.9} />
          <polygon points={`${currentX - 5},${PAD_TOP} ${currentX + 5},${PAD_TOP} ${currentX},${PAD_TOP + 8}`} fill="#38bdf8" />
        </svg>
      </div>
    </div>
  );
};

export default TimeDistanceModal;
