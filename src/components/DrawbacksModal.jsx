import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

export const DrawbacksModal = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);

  const drawbacks = [
    {
      id: 1,
      title: '1. Safety ATP ≠ Maximum Section Throughput',
      tag: 'Kavach vs RAILMIND Boundary',
      pastLimitation: 'Kavach is designed primarily as an Automatic Train Protection (ATP) collision-avoidance system. It prevents Signal Passing At Danger (SPAD) and rear-end collisions, but cannot compute global traffic dispatch plans or slot optimization.',
      railmindResolution: 'RAILMIND sits directly ABOVE Kavach. While Kavach enforces physical safety bounds, RAILMIND optimizes traffic speed profiles, slot insertions, and loop overtakes INSIDE those safety bounds to maximize train paths per day.',
      impactMetric: '+28% Section Line Capacity with Zero Safety Compromise',
    },
    {
      id: 2,
      title: '2. Existing CTC/TMS Rely on Human Cognitive Limits',
      tag: 'Operational Decision Bottleneck',
      pastLimitation: 'Centralized Traffic Control (CTC) centralizes interlocking monitoring on a giant screen, but leaves the hard mathematical decisions to human controllers when 4+ trains compete for the same throat track.',
      railmindResolution: 'RAILMIND continuously calculates thousands of possible train permutations per second, presenting ranked, ready-to-execute Minimum-Regret decisions directly to the controller with single-click CTC execution.',
      impactMetric: 'Eliminates 12+ min Controller Deliberation Hesitation',
    },
    {
      id: 3,
      title: '3. Previous AI Solutions Only "Predict" Delays (Passive)',
      tag: 'Passive Prediction vs Active Simulation',
      pastLimitation: 'Most hackathon/AI projects train an ML model on historical logs to show "Train 12952 will be 14 mins late". But displaying a delay doesn’t solve the gridlock or prevent it from cascading downstream.',
      railmindResolution: 'RAILMIND follows the complete cycle: Predict ──► Simulate Future Trajectories ──► Compare Alternatives ──► Optimize Multi-Objective Utility ──► Recommend Precise Speed & Route Actions ──► Re-learn.',
      impactMetric: 'Shifts Indian Railways from Reactive Logging to Preemptive Control',
    },
    {
      id: 4,
      title: '4. Static Optimization Breaks During Real-World Disruptions',
      tag: 'Rolling-Horizon Dynamic Engine',
      pastLimitation: 'Pre-computed master timetables work only in ideal conditions. A single 8-min delay, track defect, or platform hold immediately renders static schedules obsolete.',
      railmindResolution: 'RAILMIND utilizes a Rolling-Horizon AI loop: Every few seconds, new track telemetry triggers a re-simulation of the next 15–20 minutes, dynamically adjusting speed advisories in real time.',
      impactMetric: 'Adapts Dynamically in Under 300 Milliseconds',
    },
    {
      id: 5,
      title: '5. Single-Train Silo Optimization Destroys the Section',
      tag: 'Global Section Optimization',
      pastLimitation: 'Giving unconditional green waves to an Express train can stall a 58-wagon coal rake for 45 minutes, creating a massive bottleneck that blocks trailing local commuter trains.',
      railmindResolution: 'Section-Level Holistic Optimization: RAILMIND evaluates the aggregate delay, network friction, and unblocking value across the ENTIRE corridor before making any routing decision.',
      impactMetric: 'Reduces Total Section Aggregate Delay by 65%',
    },
    {
      id: 6,
      title: '6. Controllers Cannot Evaluate Combinatorial What-If Branches',
      tag: 'What-If Simulation Engine',
      pastLimitation: 'When 4 trains approach a diamond junction, there are 4! = 24 permutations. A human controller cannot manually simulate the ripple consequences of holding Train A vs Train B 15 minutes into the future.',
      railmindResolution: 'RAILMIND generates 4 distinct parallel futures (Plan A, B, C, D) within milliseconds and displays side-by-side delay deltas, energy penalties, and line throughput metrics.',
      impactMetric: 'Instant 4-Future Monte Carlo Decision Matrix',
    },
    {
      id: 7,
      title: '7. Lack of Robust "Minimum-Regret" Optimization Under Uncertainty',
      tag: 'Uncertainty Tolerance',
      pastLimitation: 'Classical optimizers choose plans that work ONLY if a train arrives at the exact second predicted. If actual speed drops by 5 km/h, the plan collapses into red signals.',
      railmindResolution: 'Minimum-Regret Decision Making: RAILMIND selects plans that remain safest, robust, and highly efficient even if predictions have variance, ensuring reliable real-world operations.',
      impactMetric: 'Robust Dispatch Feasibility under ±15% Speed Variance',
    },
  ];

  return (
    <div className="drawbacks-container">
      <div className="drawbacks-header">
        <div className="title-left">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="drawbacks-title">THE 7 CRITICAL GAPS IN PAST SOLUTIONS & HOW RAILMIND SOLVES THEM</h3>
        </div>
        <span className="badge-sih">SIH25022 DEFENSE & EVALUATION MATRIX</span>
      </div>

      <div className="drawbacks-grid">
        <div className="drawbacks-list">
          {drawbacks.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedIdx(idx)}
                className={`drawback-item ${isSelected ? 'selected' : ''}`}
              >
                <span className="item-num">{item.id}</span>
                <div className="item-text">
                  <h4 className="item-title">{item.title}</h4>
                  <span className="item-tag">{item.tag}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="drawback-detail-card">
          <div className="detail-header">
            <span className="detail-tag">{drawbacks[selectedIdx].tag}</span>
            <span className="slide-num">SLIDE #{drawbacks[selectedIdx].id}</span>
          </div>

          <h3 className="detail-title">{drawbacks[selectedIdx].title}</h3>

          <div className="box-past">
            <div className="box-lbl red">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>LIMITATION OF PAST APPROACHES / EXISTING SYSTEMS:</span>
            </div>
            <p className="box-txt">{drawbacks[selectedIdx].pastLimitation}</p>
          </div>

          <div className="box-solution">
            <div className="box-lbl green">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>THE RAILMIND REVOLUTION & ARCHITECTURAL SOLUTION:</span>
            </div>
            <p className="box-txt">{drawbacks[selectedIdx].railmindResolution}</p>
          </div>

          <div className="impact-footer">
            <div className="impact-left">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Measurable Operational Impact:</span>
            </div>
            <span className="impact-val">{drawbacks[selectedIdx].impactMetric}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawbacksModal;
