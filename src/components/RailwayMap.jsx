import React, { useRef, useState } from 'react';
import { Sun, Moon, CloudRain, CloudFog, ShieldCheck, AlertOctagon, Sparkles, Navigation, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Layers, Train, Info, ArrowRight, Zap, GitCommit } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const RailwayMap = ({
  trains,
  tracks,
  signals,
  switches,
  stations,
  conflicts,
  selectedTrainId,
  onSelectTrain,
  onToggleSwitch,
  timeHours,
  weather,
  onApplyAIRecommendation,
}) => {
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showConflictHighlight, setShowConflictHighlight] = useState(true);

  // SVG dimensions: Crisp, wide widescreen ratio
  const SVG_WIDTH = 1400;
  const SVG_HEIGHT = 480;
  const TOTAL_KM = 35.0;

  const kmToX = (km) => {
    const padding = 70;
    const usableWidth = SVG_WIDTH - padding * 2;
    return padding + (Math.max(0, Math.min(TOTAL_KM, km)) / TOTAL_KM) * usableWidth;
  };

  // Clean, perfectly spaced Y track lines (No overlap, crystal clear rail layout)
  const Y_UP_LOOP = 90;      // Naini UP Loop Line (Overtake siding)
  const Y_UP_FAST = 145;     // UP Fast Line (160 km/h Vande Bharat corridor)
  const Y_UP_SLOW = 200;     // UP Slow / Passenger Line (130 km/h MEMU & Freight)
  const Y_DN_FAST = 280;     // DN Fast Line (160 km/h Rajdhani corridor)
  const Y_DN_SLOW = 335;     // DN Slow / Express Line (130 km/h)
  const Y_DN_LOOP = 390;     // Naini DN Loop Line & Chheoki Siding
  const Y_BRANCH_END = 440;  // Mirzapur Industrial Spur

  // Celestial lighting
  const normTime = Math.max(0, Math.min(24, timeHours));
  const isDay = normTime >= 5.5 && normTime <= 18.5;
  const isDawn = normTime >= 5.0 && normTime < 7.0;
  const isDusk = normTime > 17.5 && normTime <= 19.5;
  const isNoon = normTime >= 11.0 && normTime <= 14.0;
  const isNight = !isDay;

  let sunX = 50;
  let sunY = 50;
  if (isDay) {
    const dayProgress = (normTime - 5.5) / 13.0;
    sunX = 5 + dayProgress * 90;
    sunY = 85 - Math.sin(dayProgress * Math.PI) * 70;
  }

  let moonX = 50;
  let moonY = 50;
  if (!isDay) {
    const nightProgress = normTime > 18.5 ? (normTime - 18.5) / 11.0 : (normTime + 5.5) / 11.0;
    moonX = 5 + nightProgress * 90;
    moonY = 85 - Math.sin(nightProgress * Math.PI) * 65;
  }

  let skyGradient = 'linear-gradient(to bottom, #060913 0%, #0a1124 50%, #05070d 100%)';
  if (isDawn) {
    skyGradient = 'linear-gradient(to bottom, #1e1b4b 0%, #4c1d95 30%, #831843 60%, #f97316 100%)';
  } else if (isNoon) {
    skyGradient = 'linear-gradient(to bottom, #0369a1 0%, #0284c7 60%, #38bdf8 100%)';
  } else if (isDay && !isDusk) {
    skyGradient = 'linear-gradient(to bottom, #0c4a6e 0%, #075985 60%, #0284c7 100%)';
  } else if (isDusk) {
    skyGradient = 'linear-gradient(to bottom, #1e1b4b 0%, #701a75 40%, #9f1239 70%, #fb923c 100%)';
  }

  return (
    <div className="railway-map-container shadow-2xl">
      {/* 1. Celestial Sky Bar with Day/Night Orbit */}
      <div className="celestial-sky-dome" style={{ background: skyGradient }}>
        {!isDay && (
          <div className="stars-layer">
            <div className="star star-1" />
            <div className="star star-2" />
            <div className="star star-3" />
            <div className="star star-4" />
            <div className="star star-5" />
            <div className="star star-6" />
          </div>
        )}

        {isDay && (
          <div className="sun-orb" style={{ left: `${sunX}%`, top: `${sunY}%` }}>
            <div className="sun-corona" />
            <Sun className="w-5 h-5 text-amber-900" />
          </div>
        )}

        {!isDay && (
          <div className="moon-orb" style={{ left: `${moonX}%`, top: `${moonY}%` }}>
            <div className="moon-corona" />
            <Moon className="w-4 h-4 text-slate-800" />
          </div>
        )}

        {weather === 'MONSOON' && (
          <div className="weather-overlay monsoon">
            <CloudRain className="w-4 h-4 text-sky-400 animate-bounce" />
            <span>Monsoon Rain Active • Track Adhesion Factor 0.72 • Braking Buffers Auto-Adjusted</span>
          </div>
        )}

        {weather === 'FOG_NORTH_INDIAN' && (
          <div className="weather-overlay fog">
            <CloudFog className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Dense Fog Safety Mode: Automatic Multi-Aspect Signal Headway Buffer Expanded</span>
          </div>
        )}

        <div className="sky-status-bar">
          <div className="sky-badge">
            <span className="pulse-dot green" />
            <span>35.0 KM ELECTRIFIED QUAD-TRACK CORRIDOR: PRAYAGRAJ ── SUBEDARGANJ ── NAINI ── CHHEOKI ── MIRZAPUR</span>
          </div>
          <div className="sky-badge">
            <Sparkles className="w-3 h-3 text-sky-300" />
            <span>CELESTIAL TIME: {String(Math.floor(normTime)).padStart(2, '0')}:{String(Math.floor((normTime % 1) * 60)).padStart(2, '0')} IST</span>
          </div>
        </div>
      </div>

      {/* 2. Clear Problem Explainer Banner Above Tracks */}
      <div className="problem-explainer-banner">
        <div className="problem-banner-left">
          <div className="problem-badge-pill">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH25022 BOTTLENECK VISUALIZER</span>
          </div>
          <p className="problem-text">
            <strong>The Problem:</strong> 4 high-density train paths converge at <strong>Naini Diamond Throat (Km 15.0)</strong>. Traditional CTC halts freight on loops for 40+ mins.
          </p>
        </div>

        <div className="problem-banner-right">
          <div className="solution-badge-pill">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI SOLUTION</span>
          </div>
          <span className="solution-text">
            Rolling-Horizon Slot Packing clears section with <strong>0 dead-stops (+28% Throughput)</strong>.
          </span>
        </div>
      </div>

      {/* 3. Interactive Toolbar & Legend */}
      <div className="map-toolbar">
        <div className="toolbar-left">
          <div className="map-status-legend">
            <div className="legend-dot-item">
              <span className="track-line-indicator cyan" />
              <span>UP Fast (160k)</span>
            </div>
            <div className="legend-dot-item">
              <span className="track-line-indicator indigo" />
              <span>UP Slow (130k)</span>
            </div>
            <div className="legend-dot-item">
              <span className="track-line-indicator red" />
              <span>DN Fast (160k)</span>
            </div>
            <div className="legend-dot-item">
              <span className="track-line-indicator purple" />
              <span>DN Slow (130k)</span>
            </div>
            <div className="legend-dot-item">
              <span className="track-line-indicator amber" />
              <span>Loop Sidings (50k)</span>
            </div>
          </div>

          <button
            onClick={() => setShowConflictHighlight(!showConflictHighlight)}
            className={`btn-conflict-toggle ${showConflictHighlight ? 'active' : ''}`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{showConflictHighlight ? 'Hide Conflict Zones' : 'Show Conflict Zones'}</span>
          </button>
        </div>

        <div className="toolbar-right">
          <button onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))} className="btn-zoom" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.1))} className="btn-zoom" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoomLevel(1)} className="btn-zoom" title="Reset Zoom">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="zoom-badge">{(zoomLevel * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* 4. Crystal-Clear SVG Track Schematic */}
      <div className="track-canvas-wrapper" ref={containerRef} style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="track-svg">
          <defs>
            {/* Clean Sleepers Grid */}
            <pattern id="clean-sleepers" width="9" height="20" patternUnits="userSpaceOnUse">
              <rect x="2" y="1" width="3.5" height="18" fill="#1e293b" rx="0.5" />
              <circle cx="3.7" cy="4" r="0.6" fill="#475569" />
              <circle cx="3.7" cy="16" r="0.6" fill="#475569" />
            </pattern>

            {/* Glowing Signal Filters */}
            <filter id="signal-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Conflict Zone Pulsing Pattern */}
            <linearGradient id="conflict-zone-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Canvas Background */}
          <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="#070b16" />

          {/* Kilometer Grid Lines */}
          {Array.from({ length: 8 }).map((_, idx) => {
            const km = idx * 5;
            const x = kmToX(km);
            return (
              <g key={`km-${km}`} opacity={0.35}>
                <line x1={x} y1={40} x2={x} y2={SVG_HEIGHT - 20} stroke="#1e2947" strokeWidth={1} strokeDasharray="4,4" />
                <text x={x} y={SVG_HEIGHT - 6} fill="#64748b" fontSize={9.5} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  Km {km}.0
                </text>
              </g>
            );
          })}

          {/* ========================================================================= */}
          {/* CONFLICT ZONE SPOTLIGHT (EXACTLY HIGHLIGHTS THE SIH BOTTLENECK AREA) */}
          {/* ========================================================================= */}
          {showConflictHighlight && (
            <g id="conflict-zone-spotlight" opacity={0.95}>
              {/* Highlight Box over Naini Diamond Junction (Km 13.0 - 17.0) */}
              <rect
                x={kmToX(13.0)}
                y={Y_UP_LOOP - 16}
                width={kmToX(17.0) - kmToX(13.0)}
                height={Y_DN_LOOP - Y_UP_LOOP + 32}
                rx={12}
                fill="url(#conflict-zone-grad)"
                stroke="#ef4444"
                strokeWidth={1.5}
                strokeDasharray="6,4"
                className="animate-pulse"
              />
              {/* Floating Conflict Callout */}
              <g transform={`translate(${(kmToX(13.0) + kmToX(17.0)) / 2}, ${Y_UP_LOOP - 24})`}>
                <rect x="-105" y="-12" width="210" height="24" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1.2" className="shadow-lg" />
                <text x="0" y="4" fill="#fca5a5" fontSize="9.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                  ⚠️ BOTTLENECK CHOKEPOINT (Km 15.0)
                </text>
              </g>
            </g>
          )}

          {/* ========================================================================= */}
          {/* 1. RAIL TRACK LINES (CLEAN, BOLD, CRYSTAL-CLEAR RIBBONS) */}
          {/* ========================================================================= */}

          {/* Track 1: Naini UP Loop (Km 13.5 to 16.8) */}
          <rect x={kmToX(13.5)} y={Y_UP_LOOP - 8} width={kmToX(16.8) - kmToX(13.5)} height={16} fill="url(#clean-sleepers)" rx={2} />
          <line x1={kmToX(13.5)} y1={Y_UP_LOOP - 3} x2={kmToX(16.8)} y2={Y_UP_LOOP - 3} stroke="#f59e0b" strokeWidth={2.2} />
          <line x1={kmToX(13.5)} y1={Y_UP_LOOP + 3} x2={kmToX(16.8)} y2={Y_UP_LOOP + 3} stroke="#f59e0b" strokeWidth={2.2} />
          <text x={kmToX(15.1)} y={Y_UP_LOOP - 12} fill="#f59e0b" fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            NAINI LOOP 1 (OVERTAKE SIDING)
          </text>

          {/* Track 2: UP Fast Main Line (Km 0.0 to 35.0 - 160 km/h) */}
          <rect x={kmToX(0)} y={Y_UP_FAST - 8} width={kmToX(35) - kmToX(0)} height={16} fill="url(#clean-sleepers)" rx={2} />
          <line x1={kmToX(0)} y1={Y_UP_FAST - 3.5} x2={kmToX(35)} y2={Y_UP_FAST - 3.5} stroke="#38bdf8" strokeWidth={2.8} />
          <line x1={kmToX(0)} y1={Y_UP_FAST + 3.5} x2={kmToX(35)} y2={Y_UP_FAST + 3.5} stroke="#38bdf8" strokeWidth={2.8} />
          <text x={kmToX(2.5)} y={Y_UP_FAST - 12} fill="#38bdf8" fontSize={8.5} fontFamily="monospace" fontWeight="bold">
            UP FAST (160 KM/H CORRIDOR ──►)
          </text>

          {/* Track 3: UP Slow / Commuter Line (Km 0.0 to 35.0 - 130 km/h) */}
          <rect x={kmToX(0)} y={Y_UP_SLOW - 8} width={kmToX(35) - kmToX(0)} height={16} fill="url(#clean-sleepers)" rx={2} />
          <line x1={kmToX(0)} y1={Y_UP_SLOW - 3} x2={kmToX(35)} y2={Y_UP_SLOW - 3} stroke="#6366f1" strokeWidth={2.4} />
          <line x1={kmToX(0)} y1={Y_UP_SLOW + 3} x2={kmToX(35)} y2={Y_UP_SLOW + 3} stroke="#6366f1" strokeWidth={2.4} />
          <text x={kmToX(2.5)} y={Y_UP_SLOW - 12} fill="#818cf8" fontSize={8.5} fontFamily="monospace" fontWeight="bold">
            UP SLOW (130 KM/H PASSENGER & FREIGHT ──►)
          </text>

          {/* Track 4: DN Fast Main Line (Km 0.0 to 35.0 - 160 km/h) */}
          <rect x={kmToX(0)} y={Y_DN_FAST - 8} width={kmToX(35) - kmToX(0)} height={16} fill="url(#clean-sleepers)" rx={2} />
          <line x1={kmToX(0)} y1={Y_DN_FAST - 3.5} x2={kmToX(35)} y2={Y_DN_FAST - 3.5} stroke="#f43f5e" strokeWidth={2.8} />
          <line x1={kmToX(0)} y1={Y_DN_FAST + 3.5} x2={kmToX(35)} y2={Y_DN_FAST + 3.5} stroke="#f43f5e" strokeWidth={2.8} />
          <text x={kmToX(32.5)} y={Y_DN_FAST - 12} fill="#f43f5e" fontSize={8.5} fontFamily="monospace" fontWeight="bold" textAnchor="end">
            (◄── 160 KM/H CORRIDOR) DN FAST
          </text>

          {/* Track 5: DN Slow / Passenger Line (Km 0.0 to 35.0 - 130 km/h) */}
          <rect x={kmToX(0)} y={Y_DN_SLOW - 8} width={kmToX(35) - kmToX(0)} height={16} fill="url(#clean-sleepers)" rx={2} />
          <line x1={kmToX(0)} y1={Y_DN_SLOW - 3} x2={kmToX(35)} y2={Y_DN_SLOW - 3} stroke="#a855f7" strokeWidth={2.4} />
          <line x1={kmToX(0)} y1={Y_DN_SLOW + 3} x2={kmToX(35)} y2={Y_DN_SLOW + 3} stroke="#a855f7" strokeWidth={2.4} />
          <text x={kmToX(32.5)} y={Y_DN_SLOW - 12} fill="#c084fc" fontSize={8.5} fontFamily="monospace" fontWeight="bold" textAnchor="end">
            (◄── 130 KM/H PASSENGER & FREIGHT) DN SLOW
          </text>

          {/* Track 6: Naini DN Loop (Km 13.5 to 16.8) & Chheoki Freight Siding (Km 24.0 to 28.5) */}
          <rect x={kmToX(13.5)} y={Y_DN_LOOP - 8} width={kmToX(16.8) - kmToX(13.5)} height={16} fill="url(#clean-sleepers)" rx={2} />
          <line x1={kmToX(13.5)} y1={Y_DN_LOOP - 3} x2={kmToX(16.8)} y2={Y_DN_LOOP - 3} stroke="#f59e0b" strokeWidth={2.2} />
          <line x1={kmToX(13.5)} y1={Y_DN_LOOP + 3} x2={kmToX(16.8)} y2={Y_DN_LOOP + 3} stroke="#f59e0b" strokeWidth={2.2} />
          <text x={kmToX(15.1)} y={Y_DN_LOOP + 22} fill="#f59e0b" fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            NAINI LOOP 2 (DN OVERTAKE)
          </text>

          <rect x={kmToX(24.0)} y={Y_DN_LOOP - 8} width={kmToX(28.5) - kmToX(24.0)} height={16} fill="url(#clean-sleepers)" rx={2} />
          <line x1={kmToX(24.0)} y1={Y_DN_LOOP - 3} x2={kmToX(28.5)} y2={Y_DN_LOOP - 3} stroke="#10b981" strokeWidth={2.2} />
          <line x1={kmToX(24.0)} y1={Y_DN_LOOP + 3} x2={kmToX(28.5)} y2={Y_DN_LOOP + 3} stroke="#10b981" strokeWidth={2.2} />
          <text x={kmToX(26.2)} y={Y_DN_LOOP + 22} fill="#10b981" fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
            CHHEOKI FREIGHT MARSHALLING YARD
          </text>

          {/* ========================================================================= */}
          {/* 2. CRYSTAL-CLEAR CROSSOVERS, TURNOUTS & DIAMONDS */}
          {/* ========================================================================= */}

          {/* Prayagraj West Scissor Crossover (Km 4.5 - 5.5) */}
          <g id="scissor-pryj">
            <path d={`M ${kmToX(4.5)} ${Y_UP_SLOW} L ${kmToX(5.5)} ${Y_UP_FAST}`} stroke="#38bdf8" strokeWidth={2.5} />
            <path d={`M ${kmToX(4.5)} ${Y_UP_FAST} L ${kmToX(5.5)} ${Y_UP_SLOW}`} stroke="#38bdf8" strokeWidth={2.5} />
            <path d={`M ${kmToX(4.6)} ${Y_DN_SLOW} L ${kmToX(5.6)} ${Y_DN_FAST}`} stroke="#f43f5e" strokeWidth={2.5} />
            <path d={`M ${kmToX(4.6)} ${Y_DN_FAST} L ${kmToX(5.6)} ${Y_DN_SLOW}`} stroke="#f43f5e" strokeWidth={2.5} />
          </g>

          {/* Naini Central Diamond Throat & Turnouts (Km 13.5 - 16.8) */}
          <g id="naini-diamond-throat">
            {/* Loop 1 Turnouts */}
            <path d={`M ${kmToX(13.5)} ${Y_UP_FAST} L ${kmToX(14.0)} ${Y_UP_LOOP}`} stroke="#f59e0b" strokeWidth={2.5} />
            <path d={`M ${kmToX(16.3)} ${Y_UP_LOOP} L ${kmToX(16.8)} ${Y_UP_FAST}`} stroke="#f59e0b" strokeWidth={2.5} />

            {/* Loop 2 Turnouts */}
            <path d={`M ${kmToX(13.5)} ${Y_DN_FAST} L ${kmToX(14.0)} ${Y_DN_LOOP}`} stroke="#f59e0b" strokeWidth={2.5} />
            <path d={`M ${kmToX(16.3)} ${Y_DN_LOOP} L ${kmToX(16.8)} ${Y_DN_FAST}`} stroke="#f59e0b" strokeWidth={2.5} />

            {/* Master Central Diamond Crossing (UP Fast <-> DN Fast) */}
            <path d={`M ${kmToX(14.2)} ${Y_UP_FAST} L ${kmToX(15.8)} ${Y_DN_FAST}`} stroke="#facc15" strokeWidth={3.0} />
            <path d={`M ${kmToX(14.2)} ${Y_DN_FAST} L ${kmToX(15.8)} ${Y_UP_FAST}`} stroke="#facc15" strokeWidth={3.0} />

            {/* Central Diamond Box Icon */}
            <rect x={kmToX(15.0) - 7} y={(Y_UP_FAST + Y_DN_FAST) / 2 - 7} width="14" height="14" fill="#facc15" stroke="#070a14" strokeWidth="2" transform={`rotate(45, ${kmToX(15.0)}, ${(Y_UP_FAST + Y_DN_FAST) / 2})`} />
          </g>

          {/* Mirzapur Industrial Spur Turnout (Km 15.1 to 34.0) */}
          <path
            d={`M ${kmToX(15.1)} ${Y_UP_SLOW} C ${kmToX(18.0)} ${Y_UP_SLOW + 40}, ${kmToX(22.0)} ${Y_BRANCH_END}, ${kmToX(34.0)} ${Y_BRANCH_END}`}
            fill="none"
            stroke="#eab308"
            strokeWidth={2.5}
            strokeDasharray="5,2"
          />
          <text x={kmToX(30.0)} y={Y_BRANCH_END + 18} fill="#eab308" fontSize={8} fontFamily="monospace" fontWeight="bold">
            MIRZAPUR INDUSTRIAL SPUR (CEMENT & HEAVY CARGO)
          </text>

          {/* Chheoki Freight Siding Ladder (Km 24.0 - 28.5) */}
          <g id="chheoki-ladder">
            <path d={`M ${kmToX(24.0)} ${Y_DN_FAST} L ${kmToX(24.8)} ${Y_DN_LOOP}`} stroke="#10b981" strokeWidth={2.5} />
            <path d={`M ${kmToX(27.8)} ${Y_DN_LOOP} L ${kmToX(28.5)} ${Y_DN_FAST}`} stroke="#10b981" strokeWidth={2.5} />
          </g>

          {/* ========================================================================= */}
          {/* 3. SWITCH MOTORS & INTERACTIVE TURNOUTS (CLICKABLE) */}
          {/* ========================================================================= */}
          {switches.map((sw) => {
            const x = kmToX(sw.positionKm);
            let y = Y_UP_FAST;
            if (sw.id === 'SW_102B' || sw.id === 'SW_203C') y = Y_DN_FAST;
            else if (sw.id === 'SW_301A') y = Y_DN_LOOP;
            else if (sw.id === 'SW_302B') y = Y_UP_SLOW;

            const isReverse = sw.state === 'REVERSE';

            return (
              <g
                key={sw.id}
                className="cursor-pointer group"
                onClick={() => onToggleSwitch(sw.id)}
              >
                <rect x={x - 9} y={y - 9} width={18} height={18} rx={4} fill="#090d18" stroke={isReverse ? '#f59e0b' : '#10b981'} strokeWidth={1.5} className="shadow-lg" />
                <circle cx={x} cy={y} r={4.5} fill={isReverse ? '#f59e0b' : '#10b981'} />
                <text x={x} y={y - 13} fill="#94a3b8" fontSize={8} fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                  {sw.id} [{sw.state}]
                </text>
              </g>
            );
          })}

          {/* ========================================================================= */}
          {/* 4. CLEAR STATION BUILDINGS & PASSENGER PLATFORMS */}
          {/* ========================================================================= */}
          {stations.map((stn) => {
            const x = kmToX(stn.km);
            return (
              <g key={stn.id} transform={`translate(${x}, 0)`}>
                {/* Station Pillar Guide */}
                <line x1={0} y1={40} x2={0} y2={Y_BRANCH_END + 15} stroke="#1e2947" strokeWidth={1.2} strokeDasharray="3,3" />

                {/* Station Name Plate Card */}
                <rect x={-70} y={26} width={140} height={26} rx={6} fill="#0f172a" stroke="#38bdf8" strokeWidth={1.5} className="shadow-xl" />
                <text x={0} y={40} fill="#ffffff" fontSize={10} fontWeight="900" fontFamily="monospace" textAnchor="middle">
                  {stn.name.toUpperCase()}
                </text>
                <text x={0} y={49} fill="#38bdf8" fontSize={7.5} fontFamily="monospace" textAnchor="middle">
                  [{stn.code}] • Km {stn.km.toFixed(1)}
                </text>

                {/* Clear Platform Decks */}
                {stn.platforms.map((plt, pIdx) => {
                  const pltY = plt.trackId.includes('FAST') ? Y_UP_FAST + 14 : Y_DN_FAST + 14;
                  return (
                    <g key={`plt-${stn.id}-${pIdx}`}>
                      <rect x={-45} y={pltY + pIdx * 5} width={90} height={3.5} fill="#475569" rx={1} />
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* ========================================================================= */}
          {/* 5. 4-ASPECT SIGNALS (GREEN, DOUBLE YELLOW, YELLOW, RED) */}
          {/* ========================================================================= */}
          {signals.map((sig) => {
            const x = kmToX(sig.positionKm);
            const isUp = sig.direction === 'UP';
            const y = isUp ? Y_UP_FAST - 25 : Y_DN_SLOW + 22;

            let activeLedColor = '#10b981';
            if (sig.aspect === 'RED') activeLedColor = '#ef4444';
            else if (sig.aspect === 'YELLOW') activeLedColor = '#eab308';
            else if (sig.aspect === 'DOUBLE_YELLOW') activeLedColor = '#f59e0b';

            return (
              <g key={sig.id} transform={`translate(${x}, ${y})`}>
                <line x1={0} y1={0} x2={0} y2={isUp ? 22 : -18} stroke="#64748b" strokeWidth={2} />
                <rect x={-5} y={-10} width={10} height={20} rx={2} fill="#090d16" stroke="#1e293b" strokeWidth={1} />
                <circle cx={0} cy={sig.aspect === 'RED' ? -5 : sig.aspect === 'GREEN' ? 5 : 0} r={3.5} fill={activeLedColor} filter="url(#signal-glow)" />
                {sig.aspect === 'DOUBLE_YELLOW' && (
                  <circle cx={0} cy={-5} r={3.5} fill="#f59e0b" filter="url(#signal-glow)" />
                )}
                <text x={0} y={isUp ? -14 : 22} fill="#94a3b8" fontSize={7.5} fontFamily="monospace" textAnchor="middle">
                  {sig.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* ========================================================================= */}
          {/* 6. TRAIN RAKES (CRISP, GLOWING BODIES WITH DIRECTION VECTORS) */}
          {/* ========================================================================= */}
          {trains.map((train) => {
            const x = kmToX(train.positionKm);
            const isUp = train.direction === 'UP';

            // Snap Y strictly to designated track level (Zero confusion, ultra-clean)
            let y = Y_UP_FAST;
            if (train.currentTrackId === 'TRK_UP_SLOW_1' || train.currentTrackId === 'TRK_UP_SLOW_2') y = Y_UP_SLOW;
            else if (train.currentTrackId === 'TRK_DN_FAST_1' || train.currentTrackId === 'TRK_DN_FAST_2') y = Y_DN_FAST;
            else if (train.currentTrackId === 'TRK_DN_SLOW_1' || train.currentTrackId === 'TRK_DN_SLOW_2') y = Y_DN_SLOW;
            else if (train.currentTrackId === 'TRK_LOOP_UP_NAINI') y = Y_UP_LOOP;
            else if (train.currentTrackId === 'TRK_LOOP_DN_NAINI' || train.currentTrackId === 'TRK_LOOP_PCOI_SIDING') y = Y_DN_LOOP;
            else if (train.currentTrackId === 'TRK_BRANCH_MZP') y = Y_BRANCH_END;

            const isSelected = selectedTrainId === train.id;
            const isFreight = train.type.includes('FREIGHT');
            const isVandeBharat = train.type === 'VANDE_BHARAT';
            const trainLengthPx = isFreight ? 75 : isVandeBharat ? 55 : 62;

            return (
              <g
                key={train.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer"
                onClick={() => onSelectTrain(train.id)}
              >
                {/* Selection Ring */}
                {isSelected && (
                  <ellipse cx={0} cy={0} rx={trainLengthPx / 2 + 10} ry={18} fill="none" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4,3" className="animate-spin-slow" />
                )}

                {/* Train Carriage Rake */}
                <g transform={`translate(${isUp ? -trainLengthPx : 0}, -7)`}>
                  <rect
                    x={0}
                    y={0}
                    width={trainLengthPx}
                    height={14}
                    rx={isVandeBharat ? 6 : 3}
                    fill={train.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1}
                    className="shadow-lg"
                  />
                  {/* Driver Windshield */}
                  <rect x={isUp ? trainLengthPx - 10 : 2} y={3} width={8} height={8} rx={2} fill="#070a14" />

                  {/* Window Segments */}
                  {Array.from({ length: isFreight ? 5 : 3 }).map((_, cIdx) => (
                    <line
                      key={`c-${cIdx}`}
                      x1={(trainLengthPx / (isFreight ? 6 : 4)) * (cIdx + 1)}
                      y1={1}
                      x2={(trainLengthPx / (isFreight ? 6 : 4)) * (cIdx + 1)}
                      y2={13}
                      stroke="#070a14"
                      strokeWidth={1.5}
                    />
                  ))}
                </g>

                {/* Floating Telemetry Badge Above/Below Train */}
                <g transform={`translate(0, ${isUp ? -22 : 26})`}>
                  <rect
                    x={-50}
                    y={-9}
                    width={100}
                    height={18}
                    rx={4}
                    fill="#090d18"
                    stroke={isSelected ? '#38bdf8' : '#1f3056'}
                    strokeWidth={1.5}
                    className="shadow-lg"
                  />
                  <text x={-44} y={4} fill="#facc15" fontSize={8} fontWeight="bold" fontFamily="monospace">★{train.dynamicPriority}</text>
                  <text x={-18} y={4} fill="#ffffff" fontSize={8.5} fontWeight="bold" fontFamily="monospace">#{train.number}</text>
                  <text x={22} y={4} fill={train.speedKmh > 0 ? '#38bdf8' : '#ef4444'} fontSize={7.5} fontFamily="monospace">{train.speedKmh}k</text>
                </g>

                {/* Kavach Active Status Pulse Dot */}
                <circle cx={isUp ? 4 : -4} cy={0} r={3} fill={train.kavachStatus === 'INTERVENING' ? '#ef4444' : '#10b981'} className="pulse-ping" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default RailwayMap;