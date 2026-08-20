import React, { useState, useEffect } from 'react';
import { X, Shield, Zap, AlertTriangle, Gauge, Volume2, Sparkles, Navigation } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const CabViewModal = ({
  train,
  signals,
  timeHours,
  weather,
  onClose,
  onUpdateSpeed,
}) => {
  if (!train) return null;

  const [notch, setNotch] = useState('P6 (75% Power)');
  const [brakeCylinderPressure, setBrakeCylinderPressure] = useState(0.0);
  const [oheVoltage, setOheVoltage] = useState(25.4);
  const [tractionCurrent, setTractionCurrent] = useState(1480);

  // Identify next signal ahead
  const nextSignal = signals.find((s) => {
    if (s.direction === train.direction) {
      const dist = s.direction === 'UP' ? s.positionKm - train.positionKm : train.positionKm - s.positionKm;
      return dist > 0 && dist < 6.0;
    }
    return false;
  }) || signals[0];

  const distanceToSignalMeters = Math.max(80, Math.round(
    Math.abs((nextSignal?.positionKm || 15.0) - train.positionKm) * 1000
  ));

  const isFreight = train.type.includes('FREIGHT');
  const isVandeBharat = train.type === 'VANDE_BHARAT';

  // Circular gauge needle calculation (0 to 180 km/h mapped to -120 deg to +120 deg)
  const speedDeg = -120 + (Math.min(180, train.speedKmh) / 180) * 240;
  const targetSpeedDeg = -120 + (Math.min(180, train.targetSpeedKmh) / 180) * 240;

  const isDay = timeHours >= 6 && timeHours <= 18;

  return (
    <div className="cab-modal-backdrop">
      <div className="cab-modal-container">
        {/* Cab Header */}
        <div className="cab-header">
          <div className="cab-header-left">
            <div className="cab-badge">
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>LOCO PILOT IN-CAB HEADS-UP DISPLAY (HUD)</span>
            </div>
            <h3 className="cab-title">
              #{train.number} {train.name} • {train.powerType}
            </h3>
          </div>

          <div className="cab-header-right">
            <div className="kavach-status-badge">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>KAVACH: {train.kavachStatus} (ATP ACTIVE)</span>
            </div>

            <button
              onClick={() => {
                soundEngine.playRelayClick();
                onClose();
              }}
              className="btn-cab-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3-Section Cockpit Layout */}
        <div className="cab-cockpit-grid">
          {/* Section 1: Windshield Track Ahead Visualizer */}
          <div className="windshield-frame">
            <div className="windshield-glass" style={{ background: isDay ? 'linear-gradient(to bottom, #0369a1 0%, #0c4a6e 40%, #0f172a 100%)' : 'linear-gradient(to bottom, #020617 0%, #0f172a 60%, #020617 100%)' }}>
              {/* OHE Catenary Wire Overhead */}
              <div className="catenary-wire" />
              <div className="catenary-wire-contact" />

              {/* Rushing Track Rails Perspective */}
              <svg viewBox="0 0 400 200" className="windshield-svg">
                {/* Horizon Line */}
                <line x1="0" y1="80" x2="400" y2="80" stroke="#1e293b" strokeWidth="1" />

                {/* Perspective Track Lines */}
                <polygon points="195,80 205,80 340,200 60,200" fill="rgba(15, 23, 42, 0.7)" />
                <line x1="195" y1="80" x2="60" y2="200" stroke="#38bdf8" strokeWidth="3" />
                <line x1="205" y1="80" x2="340" y2="200" stroke="#38bdf8" strokeWidth="3" />

                {/* Concrete Sleepers Rushing Past */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const y = 90 + i * 20;
                  const spread = (y - 80) * 1.2;
                  return (
                    <line
                      key={i}
                      x1={200 - spread}
                      y1={y}
                      x2={200 + spread}
                      y2={y}
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                  );
                })}

                {/* Upcoming Signal Mast in Sight */}
                <g transform="translate(280, 50)">
                  <line x1="0" y1="0" x2="0" y2="70" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="-8" y="-12" width="16" height="28" rx="3" fill="#090d16" stroke="#334155" strokeWidth="1" />
                  <circle
                    cx="0"
                    cy={nextSignal?.aspect === 'RED' ? -6 : nextSignal?.aspect === 'GREEN' ? 8 : 1}
                    r="4"
                    fill={nextSignal?.aspect === 'RED' ? '#ef4444' : nextSignal?.aspect === 'GREEN' ? '#10b981' : '#f59e0b'}
                    filter="url(#glow-light)"
                  />
                  <text x="14" y="6" fill="#f8fafc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {nextSignal?.name?.split(' ')[0]} ({distanceToSignalMeters}m)
                  </text>
                </g>
              </svg>

              {/* HUD Target Overlay */}
              <div className="hud-overlay-text">
                <div className="hud-advisory-box">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{train.driverAdvisory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Circular Speedometer Gauge & Kavach Braking Distance Curve */}
          <div className="gauges-panel">
            <div className="speedometer-box">
              <svg viewBox="0 0 200 160" className="speedo-svg">
                {/* Speedometer Outer Arc */}
                <path
                  d="M 30 140 A 80 80 0 1 1 170 140"
                  fill="none"
                  stroke="#1f3056"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Active Speed Arc */}
                <path
                  d="M 30 140 A 80 80 0 1 1 170 140"
                  fill="none"
                  stroke={train.speedKmh > train.targetSpeedKmh ? '#f59e0b' : '#38bdf8'}
                  strokeWidth="12"
                  strokeDasharray="335"
                  strokeDashoffset={335 - ((speedDeg + 120) / 240) * 335}
                  strokeLinecap="round"
                />

                {/* Speedo Needle */}
                <g transform={`rotate(${speedDeg}, 100, 100)`}>
                  <line x1="100" y1="100" x2="100" y2="35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="100" cy="100" r="7" fill="#38bdf8" />
                </g>

                {/* Target Speed Ghost Marker */}
                <g transform={`rotate(${targetSpeedDeg}, 100, 100)`}>
                  <polygon points="100,28 96,36 104,36" fill="#10b981" />
                </g>

                {/* Speed Readout */}
                <text x="100" y="115" fill="#f8fafc" fontSize="24" fontWeight="900" fontFamily="monospace" textAnchor="middle">
                  {train.speedKmh}
                </text>
                <text x="100" y="130" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  KM / H (MAX {train.maxSpeedKmh})
                </text>
              </svg>

              <div className="speedo-target-tag">
                <span>Target Speed:</span>
                <strong className="text-green">{train.targetSpeedKmh} km/h</strong>
              </div>
            </div>

            {/* Kavach Target Distance Braking Curve */}
            <div className="kavach-curve-box">
              <div className="curve-header">
                <span className="lbl">KAVACH DYNAMIC BRAKING CURVE</span>
                <span className="safe-badge">SAFE BRAKE BUFFER: +340m</span>
              </div>
              <div className="curve-bars">
                <div className="bar-row">
                  <span>Emergency Brake Dist:</span>
                  <strong>{train.brakingDistanceM} Meters</strong>
                </div>
                <div className="bar-row">
                  <span>Target Signal Distance:</span>
                  <strong className="text-blue">{distanceToSignalMeters} Meters</strong>
                </div>
                <div className="bar-row">
                  <span>Next Aspect:</span>
                  <strong className={nextSignal?.aspect === 'GREEN' ? 'text-green' : 'text-amber'}>
                    {nextSignal?.aspect}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Pilot Controls, OHE Telemetry & Horn */}
          <div className="cockpit-controls-panel">
            <div className="telemetry-readouts-grid">
              <div className="telemetry-chip">
                <span className="lbl">OHE Line Voltage</span>
                <span className="val text-blue">{oheVoltage} kV AC</span>
              </div>
              <div className="telemetry-chip">
                <span className="lbl">Traction Amperage</span>
                <span className="val text-amber">{tractionCurrent} Amps</span>
              </div>
              <div className="telemetry-chip">
                <span className="lbl">Brake Cylinder Pressure</span>
                <span className="val text-green">{brakeCylinderPressure.toFixed(1)} kg/cm²</span>
              </div>
              <div className="telemetry-chip">
                <span className="lbl">Master Controller Notch</span>
                <span className="val text-purple">{notch}</span>
              </div>
            </div>

            <div className="action-buttons-group">
              <button
                onClick={() => {
                  soundEngine.playTrainHorn(isFreight ? 'FREIGHT' : isVandeBharat ? 'VANDE_BHARAT' : 'EXPRESS');
                }}
                className="btn-cockpit horn"
              >
                🎺 Sound Locomotive Horn
              </button>

              <button
                onClick={() => {
                  soundEngine.announceTrain(train);
                }}
                className="btn-cockpit announce"
              >
                📢 Station Public Announcement
              </button>

              <div className="speed-adjust-row">
                <button
                  onClick={() => {
                    soundEngine.playRelayClick();
                    onUpdateSpeed(train.id, Math.max(30, train.targetSpeedKmh - 15));
                  }}
                  className="btn-throttle dec"
                >
                  -15 km/h Caution Brake
                </button>
                <button
                  onClick={() => {
                    soundEngine.playRelayClick();
                    onUpdateSpeed(train.id, Math.min(train.maxSpeedKmh, train.targetSpeedKmh + 15));
                  }}
                  className="btn-throttle inc"
                >
                  +15 km/h Throttle Notch Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabViewModal;
