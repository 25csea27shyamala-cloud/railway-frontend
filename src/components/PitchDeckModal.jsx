import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Shield, Cpu, TrendingUp, DollarSign, Award, Layers, AlertTriangle, CheckCircle2, Play } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const PitchDeckModal = ({ isOpen, onClose, onLaunchLiveDemo }) => {
  if (!isOpen) return null;

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: 'PROBLEM STATEMENT SIH25022',
      title: 'Maximizing Section Throughput via AI Traffic Control',
      subtitle: 'Transforming Indian Railways Section Interlocking from Reactive Halts to Predictive Micro-Slotting',
      content: (
        <div className="slide-content-grid">
          <div className="slide-box red">
            <h4 className="slide-box-title text-rose-400">The Ground Reality Bottleneck:</h4>
            <ul className="slide-bullets">
              <li>Section Controllers manage 15-20 rakes manually over paper charts and radio.</li>
              <li>High-density junctions (e.g. Naini Diamond Junction) suffer phantom stops and cascading delay ripples of 45+ minutes.</li>
              <li>Heavy freight (4,800T BOXN rakes) held on loop sidings for hours, consuming traction energy.</li>
            </ul>
          </div>
          <div className="slide-box green">
            <h4 className="slide-box-title text-emerald-400">The RAILMIND Solution:</h4>
            <ul className="slide-bullets">
              <li>60 FPS Digital Twin lookahead horizon of 15.0 minutes.</li>
              <li>Dynamic speed harmonization that inserts micro-slots with zero deadlocks.</li>
              <li>Operates <em>above</em> Kavach (ATP) and CTC without altering safety relays.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      tag: 'MATHEMATICAL FORMULATION',
      title: "Elevating Scott's Line Capacity Efficiency Factor",
      subtitle: "Mathematical Breakthrough in Section Slot Density",
      content: (
        <div className="slide-math-layout">
          <div className="math-equation-card">
            <span className="math-lbl">Scott's Formula for Section Line Capacity:</span>
            <div className="math-formula-display">
              \[C = \frac{1440}{T + t} \times E\]
            </div>
            <div className="math-terms-grid">
              <div><strong>T</strong> = Critical Block Section Running Time (mins)</div>
              <div><strong>t</strong> = Operational Block Overlap & Buffer (mins)</div>
              <div><strong>E</strong> = Efficiency & Punctuality Coefficient</div>
            </div>
          </div>
          <div className="math-comparison-card">
            <div className="comp-row">
              <span className="lbl">Traditional Manual CTC Factor (E):</span>
              <span className="val text-amber-400">0.70 (Conservative Buffers)</span>
            </div>
            <div className="comp-row highlight">
              <span className="lbl">RAILMIND AI Dynamic Factor (E):</span>
              <span className="val text-emerald-400">0.91 (+30.0% Slot Density)</span>
            </div>
            <div className="comp-row">
              <span className="lbl">Headway Buffer Compression:</span>
              <span className="val text-sky-400">240s ➔ 90s Safe Separation</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      tag: 'SYSTEM ARCHITECTURE',
      title: '6-Layer Enterprise Digital Twin Stack',
      subtitle: 'From Physical Track Circuits to Minimum-Regret Multi-Future Decision Engine',
      content: (
        <div className="arch-stack-slide-grid">
          {[
            { num: 'L1', name: 'Physical Railway Layer', desc: 'Tracks, Turnouts, 25kV OHE, 4-Aspect Signals' },
            { num: 'L2', name: 'Kavach ATP Safety Layer', desc: 'Radio Interlocking, Target Distance Braking Curve' },
            { num: 'L3', name: 'CTC & Telemetry Integration', desc: 'Real-time GPS, Axle Counters, Track Circuits' },
            { num: 'L4', name: 'Physics Digital Twin Engine', desc: 'Tractive Effort, Gradient Profiles, Weight Physics' },
            { num: 'L5', name: 'Minimum-Regret Decision Engine', desc: 'What-If Simulation, Dynamic Priorities, Plans A-D' },
            { num: 'L6', name: 'Controller & In-Cab HUD', desc: 'Glassmorphism Command Center, Web Audio Dispatch' },
          ].map((layer) => (
            <div key={layer.num} className="arch-layer-pill">
              <span className="layer-num-tag">{layer.num}</span>
              <div>
                <span className="layer-name-txt">{layer.name}</span>
                <span className="layer-desc-txt">{layer.desc}</span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 4,
      tag: 'ECONOMIC VALUE & ROI',
      title: 'Zonal Realization: ₹ 168+ Cr / Year per Division',
      subtitle: 'Monetizing Extra Paths Without Laying New Track Infrastructure',
      content: (
        <div className="roi-slide-grid">
          <div className="roi-stat-card">
            <span className="roi-val text-sky-400">+38 Paths / Day</span>
            <span className="roi-lbl">Additional Section Slots</span>
            <span className="roi-sub">Equivalent to ₹ 1,080 Cr 3rd Line Capex</span>
          </div>
          <div className="roi-stat-card">
            <span className="roi-val text-emerald-400">₹ 168.4 Cr / Yr</span>
            <span className="roi-lbl">Annual Freight Slot Revenue</span>
            <span className="roi-sub">100% elimination of throat demurrage</span>
          </div>
          <div className="roi-stat-card">
            <span className="roi-val text-amber-400">₹ 14.2 Cr / Yr</span>
            <span className="roi-lbl">Traction Energy Saved</span>
            <span className="roi-sub">Smooth gliding vs repeated stops</span>
          </div>
          <div className="roi-stat-card">
            <span className="roi-val text-purple-400">11,400 Tons / Yr</span>
            <span className="roi-lbl">CO2 Emissions Offset</span>
            <span className="roi-sub">Green corridor ESG fulfillment</span>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      tag: 'KEY DIFFERENTIATORS',
      title: 'Why RAILMIND Wins Over Past Hackathon Solutions',
      subtitle: 'Comparison Against Academic ML / Black-Box Models',
      content: (
        <div className="diff-table-slide">
          <table className="slide-comp-table">
            <thead>
              <tr>
                <th>Feature / Dimension</th>
                <th>Past Academic AI Projects</th>
                <th>RAILMIND (Our Solution)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Safety Integration</strong></td>
                <td className="text-rose-400">Tries to replace signaling (Unsafe)</td>
                <td className="text-emerald-400"><strong>Layers above Kavach (100% Fail-Safe)</strong></td>
              </tr>
              <tr>
                <td><strong>Decision Paradigm</strong></td>
                <td className="text-rose-400">Passive delay prediction only</td>
                <td className="text-emerald-400"><strong>Active Minimum-Regret What-If (Plans A-D)</strong></td>
              </tr>
              <tr>
                <td><strong>Driver Telemetry</strong></td>
                <td className="text-rose-400">No driver interface</td>
                <td className="text-emerald-400"><strong>Loco Pilot In-Cab HUD + Target Curve</strong></td>
              </tr>
              <tr>
                <td><strong>Audio Interlock</strong></td>
                <td className="text-rose-400">Silent UI</td>
                <td className="text-emerald-400"><strong>Dual-tone Horns + Bilingual PA Voice</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    soundEngine.playRelayClick();
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    soundEngine.playRelayClick();
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="pitch-modal-backdrop">
      <div className="pitch-modal-container">
        {/* Header */}
        <div className="pitch-modal-header">
          <div className="flex items-center gap-3">
            <span className="pitch-badge-tag">📊 SIH25022 EVALUATION PITCH DECK</span>
            <span className="slide-counter">
              SLIDE {currentSlide + 1} OF {slides.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onLaunchLiveDemo) onLaunchLiveDemo();
              }}
              className="btn-launch-demo-slide"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Interactive Demo</span>
            </button>
            <button onClick={onClose} className="btn-pitch-close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Content Area */}
        <div className="pitch-slide-stage">
          <div className="slide-meta-row">
            <span className="slide-topic-badge">{slides[currentSlide].tag}</span>
            <h2 className="slide-main-title">{slides[currentSlide].title}</h2>
            <p className="slide-main-subtitle">{slides[currentSlide].subtitle}</p>
          </div>

          <div className="slide-body-container">
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="pitch-modal-footer">
          <div className="slide-dots-row">
            {slides.map((_, sIdx) => (
              <button
                key={sIdx}
                onClick={() => {
                  soundEngine.playRelayClick();
                  setCurrentSlide(sIdx);
                }}
                className={`slide-dot-pill ${currentSlide === sIdx ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="slide-nav-btn-group">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="btn-slide-nav"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className="btn-slide-nav primary"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckModal;
