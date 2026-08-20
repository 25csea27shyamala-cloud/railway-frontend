import React, { useState } from 'react';
import { Sparkles, AlertTriangle, Train, GitBranch, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';

export const AIRecommendations = ({
  conflicts = [],
  onApplyRecommendation,
}) => {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    soundEngine.playSuccessTone();
    soundEngine.speakDispatch('AI Decision Applied. Route Optimization interlocked on Line B. Network load reduced.');
    
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
    });

    setApplied(true);
    setTimeout(() => setApplied(false), 4500);

    if (onApplyRecommendation) {
      onApplyRecommendation();
    }
  };

  const primaryConflict = conflicts[0] || {
    trainNames: ['Vande Bharat #22436', 'Freight Coal BOXN-782'],
    location: 'Naini Junction Platform 3 Throat',
    probabilityPercent: 94,
  };

  return (
    <div className="ai-recommendations-master-card">
      {/* 1. Card Header */}
      <div className="ai-rec-header-row">
        <div className="title-left">
          <div className="ai-glow-icon">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="ai-rec-main-title">AI RECOMMENDATIONS</h3>
            <span className="ai-rec-subtitle">Decision Engine Suggestions</span>
          </div>
        </div>
        <span className="badge-ai-pill">AI LIVE</span>
      </div>

      {/* 2. Three Step Recommendation Breakdown (Exact as User's Image) */}
      <div className="rec-steps-container">
        {/* Step 1: Potential Conflict */}
        <div className="rec-step-box conflict">
          <div className="step-icon-col red">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="step-content-col">
            <div className="step-label text-rose">POTENTIAL CONFLICT</div>
            <p className="step-desc">
              Train #12674 / {primaryConflict.trainNames?.[0] || 'Vande Bharat'} approaching Platform 3 throat.
            </p>
            <div className="step-meta">
              <span>Confidence: <strong className="text-green">High ({primaryConflict.probabilityPercent || 94}%)</strong></span>
            </div>
          </div>
        </div>

        {/* Step 2: Suggested Action */}
        <div className="rec-step-box action">
          <div className="step-icon-col blue">
            <Train className="w-4 h-4 text-sky-400" />
          </div>
          <div className="step-content-col">
            <div className="step-label text-blue">SUGGESTED ACTION</div>
            <p className="step-desc">
              Hold Train #12674 for 4 minutes at Outer Signal.
            </p>
            <div className="step-meta">
              <span>Delay reduction: <strong className="text-green">11 minutes</strong></span>
            </div>
          </div>
        </div>

        {/* Step 3: Route Optimization */}
        <div className="rec-step-box route">
          <div className="step-icon-col purple">
            <GitBranch className="w-4 h-4 text-purple-400" />
          </div>
          <div className="step-content-col">
            <div className="step-label text-purple">ROUTE OPTIMIZATION</div>
            <p className="step-desc">
              Alternative green wave route via Line B & Naini Loop 1.
            </p>
            <div className="step-meta">
              <span>Estimated section improvement: <strong className="text-green">8.4%</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Glowing Action Button (Exact as User's Image) */}
      <button
        onClick={handleApply}
        className={`btn-apply-recommendation ${applied ? 'applied' : ''}`}
      >
        {applied ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>RECOMMENDATION INTERLOCKED WITH CTC!</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 text-white fill-current" />
            <span>APPLY RECOMMENDATION</span>
          </>
        )}
      </button>

      {/* 4. Predicted Impact Grid (Exact as User's Image) */}
      <div className="predicted-impact-section">
        <div className="impact-section-header">
          <span>PREDICTED IMPACT</span>
        </div>

        <div className="impact-metrics-grid">
          <div className="impact-chip">
            <span className="lbl">CONFLICTS</span>
            <div className="val-flow">
              <span className="from text-red">2</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="to text-green font-bold">0</span>
            </div>
          </div>

          <div className="impact-chip">
            <span className="lbl">NETWORK LOAD</span>
            <div className="val-flow">
              <span className="from">72%</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="to text-green font-bold">64%</span>
            </div>
          </div>

          <div className="impact-chip">
            <span className="lbl">TOTAL DELAY</span>
            <div className="val-flow">
              <span className="from text-amber">18m</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span className="to text-green font-bold">7m</span>
            </div>
          </div>
        </div>

        {/* 5. Estimated Time Saved Banner (Exact as User's Image) */}
        <div className="time-saved-banner-box">
          <div className="saved-icon-circle">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="saved-small-title">ESTIMATED TIME SAVED</span>
            <span className="saved-huge-text">11 MINUTES</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
