import React, { useState } from 'react';
import { Layers, Network, Activity, Cpu, Shield, Zap, RefreshCw } from 'lucide-react';

export const ArchitectureModal = () => {
  const [activeLayer, setActiveLayer] = useState(1);

  const layers = [
    {
      num: 1,
      name: 'Real-Time Railway Digital Twin Layer',
      tag: 'Virtual Corridor Mirror',
      icon: Network,
      details: 'Maintains a live 60 FPS model of all physical assets across 35 km (track circuits, gradients, 4-aspect signals, points, platforms). Accepts feeds from Kavach ATP, CTC, and FOIS without replacing them.',
      inputs: ['KAVACH ATP GPS/RFID Telemetry', 'CTC Electronic Interlocking Status', 'Axle Counter / Track Circuit Relays'],
      outputs: ['60 FPS Digital Twin State', 'Kinematic Velocity/Position Vectors', 'Dynamic Track Occupancy Maps'],
    },
    {
      num: 2,
      name: 'AI Spatial-Temporal Conflict Predictor',
      tag: '15-Minute Lookahead',
      icon: Activity,
      details: 'Projects multi-train spatial trajectories 15 to 20 minutes into the future to identify convergence deadlocks before trains reach approach signals.',
      inputs: ['Live Velocity Profiles', 'Block Section Lengths', 'Scheduled vs Actual Delays'],
      outputs: ['Conflict Probability % Matrix', 'Time-to-Impact (Seconds)', 'Bottleneck Severity Index'],
    },
    {
      num: 3,
      name: 'What-If Multi-Future Simulation Engine',
      tag: 'Monte Carlo Trajectory Generator',
      icon: Cpu,
      details: 'Spawns 4 distinct future operational permutations in parallel to test every candidate dispatch option and compute second-by-second traffic propagation.',
      inputs: ['Candidate Dispatch Orders (Permutations)', 'Dynamic Speed Advisory Curves'],
      outputs: ['Plan A (Rigid Hierarchy)', 'Plan B (Greedy Local)', 'Plan C (Loop Overtake)', 'Plan D (Minimum-Regret AI)'],
    },
    {
      num: 4,
      name: 'Minimum-Regret Decision Engine',
      tag: 'Uncertainty-Tolerant Optimizer',
      icon: Shield,
      details: 'Evaluates candidate plans under stochastic variance (±15% train speed variance) to select the decision with lowest downside risk.',
      inputs: ['Simulated Outcome Losses across Scenarios', 'Speed Variance Uncertainty Models'],
      outputs: ['Regret Coefficient (0-100)', 'Robust Dispatch Command Matrix', 'Optimal Driver Speed Advisories'],
    },
    {
      num: 5,
      name: 'Dynamic Priority & Energy Engine',
      tag: 'Multi-Objective Utility',
      icon: Zap,
      details: 'Calculates dynamic utility scores (1-10) based on passenger load, momentum, and throat clearance. Elevates freight priority when unblocking a choke point saves 45 min of downstream passenger delay.',
      inputs: ['Passenger Density (MEMU Commuters)', 'Cargo Economic Value (Coal / Cement)', 'Section Clearance Coefficient'],
      outputs: ['Dynamic Train Priority Weights ★w_i(t)', 'Regenerative Braking & Energy Minimization Plans'],
    },
    {
      num: 6,
      name: 'Rolling-Horizon Timetable Recovery Engine',
      tag: 'Post-Disruption Healing',
      icon: RefreshCw,
      details: 'Continuously recalculates dispatch schedules during heavy disruptions to restore punctuality and normal section headway in under 20 minutes.',
      inputs: ['Real-Time Delay Magnitude', 'Emergency Track Closures / TSRs', 'Station Platform Availability'],
      outputs: ['Dynamic Platform Reassignment', 'Headway Micro-Compression Schedules', 'Recovery Timetable Graph'],
    },
  ];

  const current = layers[activeLayer - 1];
  const Icon = current.icon;

  return (
    <div className="architecture-container">
      <div className="arch-header">
        <div className="title-left">
          <Layers className="w-5 h-5 text-sky-400" />
          <h3 className="arch-title">THE 6-LAYER INTELLIGENT RAILWAY ARCHITECTURE</h3>
        </div>
        <span className="badge-sih">SIH25022 FULL TECHNICAL STACK</span>
      </div>

      <div className="layer-tabs-row">
        {layers.map((l) => (
          <button
            key={l.num}
            onClick={() => setActiveLayer(l.num)}
            className={`layer-tab ${activeLayer === l.num ? 'active' : ''}`}
          >
            <span className="tab-num">L-{l.num}</span>
            <span className="tab-name">{l.tag}</span>
          </button>
        ))}
      </div>

      <div className="layer-detail-card">
        <div className="layer-card-top">
          <div className="title-row">
            <Icon className="w-6 h-6 text-sky-400" />
            <div>
              <h4 className="layer-name">LAYER {current.num}: {current.name}</h4>
              <span className="layer-sub">{current.tag}</span>
            </div>
          </div>
          <span className="refresh-rate">Refresh: <strong>100ms Sync</strong></span>
        </div>

        <p className="layer-desc">{current.details}</p>

        <div className="io-grid">
          <div className="io-box">
            <h5 className="io-title text-blue">INPUT DATA SOURCES:</h5>
            <ul className="io-list">
              {current.inputs.map((inp, i) => (
                <li key={i}>• {inp}</li>
              ))}
            </ul>
          </div>

          <div className="io-box">
            <h5 className="io-title text-green">GENERATED OUTPUTS & DECISIONS:</h5>
            <ul className="io-list">
              {current.outputs.map((out, i) => (
                <li key={i}>• {out}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureModal;
