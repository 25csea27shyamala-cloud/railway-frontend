import React, { useState } from 'react';
import { X, Train, Gauge, Zap, Shield, Radio, Volume2, AlertOctagon, CheckCircle2, ArrowRight, UserCheck, Flame, Cpu, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';

export const TrainInspectorModal = ({
  train,
  isOpen,
  onClose,
  onOpenCabView,
  onUpdateSpeed,
}) => {
  if (!isOpen || !train) return null;

  const [boostActive, setBoostActive] = useState(false);

  const handleBoostSpeed = () => {
    setBoostActive(true);
    soundEngine.playSuccessTone();
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    if (onUpdateSpeed) onUpdateSpeed(train.id, Math.min(160, train.speedKmh + 20));
    soundEngine.speakDispatch(`Speed notch advanced for Train ${train.number}. Accelerating to ${Math.min(160, train.speedKmh + 20)} km/h.`);
    setTimeout(() => setBoostActive(false), 1200);
  };

  const handleEmergencyStop = () => {
    soundEngine.playBuzzerAlert();
    if (onUpdateSpeed) onUpdateSpeed(train.id, 0);
    soundEngine.speakDispatch(`Emergency brake application initiated on Train ${train.number}. Dynamic traction cutoff.`);
  };

  const handleSoundHorn = () => {
    if (train.type === 'HIGH_SPEED_PASSENGER') {
      soundEngine.playTrainHorn('VANDE_BHARAT');
    } else {
      soundEngine.playTrainHorn('WAP7_DUAL_TONE');
    }
  };

  return (
    <div className="inspector-modal-backdrop">
      <div className="inspector-modal-container">
        {/* Header */}
        <div className="inspector-modal-header" style={{ borderBottomColor: train.color }}>
          <div className="flex items-center gap-3">
            <div className="inspector-avatar" style={{ backgroundColor: `${train.color}25`, borderColor: train.color }}>
              <Train className="w-6 h-6" style={{ color: train.color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="inspector-title">#{train.number} - {train.name.toUpperCase()}</h2>
                <span className="inspector-type-pill" style={{ borderColor: train.color, color: train.color }}>
                  {train.type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="inspector-sub">
                {train.originStation} ➔ {train.destinationStation} • Km {train.positionKm.toFixed(2)} on {train.currentTrackId}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn-inspector-close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Train Visual Hologram / Telemetry Canopy */}
        <div className="inspector-hologram-stage" style={{ background: `radial-gradient(ellipse at center, ${train.color}15 0%, #060913 70%)` }}>
          <div className="hologram-engine-box">
            <div className="engine-headlamp-glow" style={{ boxShadow: `0 0 40px ${train.color}` }} />
            <Train className="w-16 h-16 animate-pulse" style={{ color: train.color }} />
            <div className="engine-sparks" />
          </div>

          <div className="hologram-stats-row">
            <div className="holo-stat-pill">
              <span className="lbl">Speed</span>
              <span className="val text-sky-400 font-mono">{train.speedKmh} km/h</span>
            </div>
            <div className="holo-stat-pill">
              <span className="lbl">Traction Effort</span>
              <span className="val text-amber-400 font-mono">{(train.speedKmh * 38.5).toFixed(0)} kW</span>
            </div>
            <div className="holo-stat-pill">
              <span className="lbl">Kavach OBU</span>
              <span className="val text-emerald-400 font-mono">SIL-4 LOCKED</span>
            </div>
            <div className="holo-stat-pill">
              <span className="lbl">OHE Voltage</span>
              <span className="val text-purple-400 font-mono">25.4 kV AC</span>
            </div>
          </div>
        </div>

        {/* Telemetry Deep-Dive Grid */}
        <div className="inspector-grid">
          {/* Box 1: Loco & Pilot Details */}
          <div className="inspector-card">
            <div className="card-top-title">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Loco Pilot & Engine Consist</span>
            </div>
            <div className="telemetry-rows-list">
              <div className="t-row">
                <span className="lbl">Loco Class:</span>
                <span className="val">{train.locoType || 'WAP-7 Twin-Bo'}</span>
              </div>
              <div className="t-row">
                <span className="lbl">Rake Length:</span>
                <span className="val">{train.lengthMeters} Meters ({train.coachesCount || 22} Coaches)</span>
              </div>
              <div className="t-row">
                <span className="lbl">Gross Weight:</span>
                <span className="val">{train.grossWeightTons || 1450} Metric Tons</span>
              </div>
              <div className="t-row">
                <span className="lbl">Vigilance Device (VCD):</span>
                <span className="val text-emerald-400">ACTIVE (Reset OK)</span>
              </div>
            </div>
          </div>

          {/* Box 2: Braking & Target Curve */}
          <div className="inspector-card">
            <div className="card-top-title">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Kavach Dynamic Braking Distance</span>
            </div>
            <div className="telemetry-rows-list">
              <div className="t-row">
                <span className="lbl">Emergency Braking Distance (EBD):</span>
                <span className="val text-amber-400">{Math.round((train.speedKmh ** 2) / 28)} Meters</span>
              </div>
              <div className="t-row">
                <span className="lbl">Service Target Speed:</span>
                <span className="val text-sky-400">{train.targetSpeedKmh || train.speedKmh} km/h</span>
              </div>
              <div className="t-row">
                <span className="lbl">Track Adhesion:</span>
                <span className="val text-emerald-400">0.88 (Dry Optimal)</span>
              </div>
              <div className="t-row">
                <span className="lbl">Radio Telemetry RSSI:</span>
                <span className="val text-sky-400">-64 dBm (UHF 433MHz)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Operational Dispatch Controls */}
        <div className="inspector-actions-bar">
          <button onClick={handleSoundHorn} className="btn-insp-action sound">
            <Volume2 className="w-4 h-4" />
            <span>Sound Horn</span>
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOpenCabView) onOpenCabView(train.id);
            }}
            className="btn-insp-action cab"
          >
            <Compass className="w-4 h-4" />
            <span>Enter In-Cab HUD</span>
          </button>

          <button onClick={handleBoostSpeed} className="btn-insp-action boost">
            <Zap className="w-4 h-4" />
            <span>Accelerate (+20k)</span>
          </button>

          <button onClick={handleEmergencyStop} className="btn-insp-action e-stop">
            <AlertOctagon className="w-4 h-4" />
            <span>Emergency Halt</span>
          </button>
        </div>

        {/* Footer */}
        <div className="inspector-modal-footer">
          <span>RAILMIND Digital Twin Telemetry Feed • Real-Time GPS & Kavach Transponder Beacon</span>
        </div>
      </div>
    </div>
  );
};

export default TrainInspectorModal;
