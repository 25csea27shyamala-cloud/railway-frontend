import React, { useState, useMemo } from 'react';
import { CheckCircle2, Zap, Sparkles, Layers, Sliders, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';
import { simulateCustomPerturbation } from '../engine/whatIfSimulator';

export const WhatIfSimulation = ({
  plans,
  activePlanId,
  onSelectPlan,
  onDeployPlan,
  trains,
  onApplySandboxToLive,
}) => {
  const [deployed, setDeployed] = useState(false);
  const [selectedTrainId, setSelectedTrainId] = useState(trains[0]?.id || 'TRN_12952');
  const [delayAddedMin, setDelayAddedMin] = useState(6);
  const [speedCapKmh, setSpeedCapKmh] = useState(100);
  const [closedTrackId, setClosedTrackId] = useState('');

  const selectedTrain = trains.find((t) => t.id === selectedTrainId) || trains[0];

  const handleDeploy = (plan) => {
    soundEngine.playSuccessTone();
    soundEngine.speakDispatch(`Traffic Controller Notice: ${plan.name} interlocked. Section throughput optimized.`);
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#10b981', '#f59e0b'],
    });

    setDeployed(true);
    setTimeout(() => setDeployed(false), 4000);
    onDeployPlan(plan);
  };

  const selectedPlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const sandboxResult = useMemo(() => {
    return simulateCustomPerturbation(
      trains,
      selectedTrainId,
      delayAddedMin,
      speedCapKmh,
      closedTrackId || undefined
    );
  }, [trains, selectedTrainId, delayAddedMin, speedCapKmh, closedTrackId]);

  return (
    <div className="what-if-master-container">
      {/* 1. Future Comparator Section */}
      <div className="future-comparator-card">
        <div className="comparator-header">
          <div>
            <div className="header-title-row">
              <Sparkles className="w-5 h-5 text-sky-400 animate-pulse" />
              <h2 className="section-title">WHAT-IF DECISION ENGINE & MULTI-FUTURE SIMULATOR</h2>
              <span className="badge-usp">CORE USP</span>
            </div>
            <p className="section-desc">
              RAILMIND simulates 4 future traffic branches in parallel to select the highest-throughput, minimum-regret operational plan.
            </p>
          </div>

          <button
            onClick={() => handleDeploy(selectedPlan)}
            className="btn-deploy-main"
          >
            {deployed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>INTERLOCKED WITH CTC!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>DEPLOY [{selectedPlan.id}] TO INTERLOCKING</span>
              </>
            )}
          </button>
        </div>

        {/* 4 Multi-Future Alternative Cards */}
        <div className="plan-cards-grid">
          {plans.map((plan) => {
            const isSelected = activePlanId === plan.id;
            const isRecommended = plan.isRecommended;

            return (
              <div
                key={plan.id}
                onClick={() => {
                  soundEngine.playRelayClick();
                  onSelectPlan(plan.id);
                }}
                className={`plan-card ${isSelected ? 'selected' : ''} ${isRecommended ? 'recommended' : ''}`}
              >
                <div className="plan-card-header">
                  <span className={`plan-tag ${isRecommended ? 'tag-green' : plan.id === 'PLAN_A' ? 'tag-red' : 'tag-gray'}`}>
                    {plan.tag}
                  </span>
                  <span className={`plan-regret ${plan.regretScore < 20 ? 'regret-low' : plan.regretScore < 50 ? 'regret-med' : 'regret-high'}`}>
                    REGRET: {plan.regretScore}/100
                  </span>
                </div>

                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-strategy">{plan.strategy}</p>

                <div className="plan-metrics-row">
                  <div className="metric-box">
                    <span className="lbl">Delay Delta</span>
                    <span className={`val ${plan.totalDelayDeltaMin <= 0 ? 'text-green' : 'text-red'}`}>
                      {plan.totalDelayDeltaMin > 0 ? `+${plan.totalDelayDeltaMin}m` : `${plan.totalDelayDeltaMin}m`}
                    </span>
                  </div>
                  <div className="metric-box">
                    <span className="lbl">Throughput</span>
                    <span className={`val ${plan.throughputGainPercent >= 0 ? 'text-green' : 'text-red'}`}>
                      {plan.throughputGainPercent >= 0 ? `+${plan.throughputGainPercent}%` : `${plan.throughputGainPercent}%`}
                    </span>
                  </div>
                  <div className="metric-box">
                    <span className="lbl">Headway</span>
                    <span className="val text-blue">+{plan.headwayCompressionSec}s</span>
                  </div>
                  <div className="metric-box">
                    <span className="lbl">Friction</span>
                    <span className={`val ${plan.junctionFrictionScore < 3 ? 'text-green' : 'text-amber'}`}>
                      {plan.junctionFrictionScore}/10
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Trajectory Details */}
        <div className="trajectory-panel">
          <div className="trajectory-header">
            <div className="title-left">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>SIMULATED ACTION TRAJECTORY — {selectedPlan.name}</span>
            </div>
            <div className="title-right">
              <span>Energy: <strong>{selectedPlan.energyPenaltyKWh} kWh</strong></span>
              <span>Regret: <strong>{selectedPlan.regretScore} pts</strong></span>
            </div>
          </div>

          <div className="trajectory-cards-grid">
            {selectedPlan.trainActions.map((act) => (
              <div key={act.trainId} className="action-card">
                <div className="action-title-row">
                  <span className="train-name">{act.trainName} (#{act.trainNumber})</span>
                  <span className={`delay-badge ${act.delayChangeMin <= 0 ? 'green' : 'red'}`}>
                    {act.delayChangeMin > 0 ? `+${act.delayChangeMin}m` : `${act.delayChangeMin}m`}
                  </span>
                </div>
                <p className="action-text">{act.action}</p>
                <div className="action-meta">
                  <span>Target: <strong>{act.targetSpeedKmh} km/h</strong></span>
                  <span>Track: <strong>{act.assignedTrack.replace('TRK_', '')}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Operator Perturbation Sandbox */}
      <div className="sandbox-card">
        <div className="sandbox-header">
          <div className="title-left">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h3 className="sandbox-title">OPERATOR "WHAT-IF" PERTURBATION SANDBOX</h3>
          </div>
          <div className="sandbox-actions">
            <button
              onClick={() => {
                soundEngine.playRelayClick();
                setDelayAddedMin(0);
                setSpeedCapKmh(120);
                setClosedTrackId('');
              }}
              className="btn-reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playAlertChime();
                if (onApplySandboxToLive) onApplySandboxToLive(selectedTrainId, delayAddedMin, speedCapKmh);
              }}
              className="btn-inject"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Inject Into Live Simulator</span>
            </button>
          </div>
        </div>

        <div className="sandbox-controls-grid">
          <div className="ctrl-box">
            <label>1. TARGET TRAIN FOR HYPOTHETICAL:</label>
            <select
              value={selectedTrainId}
              onChange={(e) => setSelectedTrainId(e.target.value)}
              className="sandbox-select"
            >
              {trains.map((t) => (
                <option key={t.id} value={t.id}>
                  #{t.number} {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ctrl-box">
            <div className="slider-label">
              <span>2. INJECT DELAY:</span>
              <strong className="text-amber">+{delayAddedMin} Min</strong>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={delayAddedMin}
              onChange={(e) => setDelayAddedMin(Number(e.target.value))}
              className="slider-amber"
            />
          </div>

          <div className="ctrl-box">
            <div className="slider-label">
              <span>3. SPEED RESTRICTION (TSR):</span>
              <strong className="text-blue">{speedCapKmh} km/h</strong>
            </div>
            <input
              type="range"
              min="20"
              max="160"
              step="5"
              value={speedCapKmh}
              onChange={(e) => setSpeedCapKmh(Number(e.target.value))}
              className="slider-blue"
            />
          </div>
        </div>

        {/* Live Sandbox Output */}
        <div className="sandbox-output-panel">
          <div className="output-numbers-row">
            <div className="out-box">
              <span className="lbl">Projected Delay</span>
              <span className="val text-amber">{sandboxResult.projectedSectionDelayMin} min</span>
            </div>
            <div className="out-box">
              <span className="lbl">Throughput Delta</span>
              <span className={`val ${sandboxResult.throughputDeltaPercent <= 0 ? 'text-red' : 'text-green'}`}>
                {sandboxResult.throughputDeltaPercent}%
              </span>
            </div>
            <div className="out-box">
              <span className="lbl">Ripple Rakes</span>
              <span className="val text-blue">{sandboxResult.rippleAffectedTrainCount} / 6 Rakes</span>
            </div>
            <div className="out-box">
              <span className="lbl">Regret Score</span>
              <span className={`val ${sandboxResult.regretScore > 40 ? 'text-red' : 'text-green'}`}>
                {sandboxResult.regretScore}/100
              </span>
            </div>
          </div>

          <div className="ai-quote-box">
            <span className="pulse-dot green" />
            <span className="quote-text">
              <strong>RAILMIND Advisory: </strong>{sandboxResult.recommendation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulation;
