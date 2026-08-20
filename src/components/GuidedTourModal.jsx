import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, ArrowRight, Sparkles, Shield, Volume2, Gauge, FileText, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';

export const GuidedTourModal = ({
  isOpen,
  onClose,
  onSelectScenario,
  onOpenCabView,
  onDeployPlan,
  onOpenReport,
  setActiveTab,
}) => {
  if (!isOpen) return null;

  const [stepIndex, setStepIndex] = useState(0);
  const [isPlayingStep, setIsPlayingStep] = useState(false);

  const tourSteps = [
    {
      title: 'Step 1: High-Density Chokepoint Convergence',
      badge: 'Chokepoint Bottleneck',
      desc: 'Simulates 4 high-speed and heavy freight trains converging on Naini Central Diamond Junction (Km 15.0). Traditional CTC would force freight into 40+ min delay loops.',
      actionLabel: 'Inject Chokepoint Scenario',
      runAction: () => {
        if (onSelectScenario) onSelectScenario('SCENARIO_4');
        if (setActiveTab) setActiveTab('DASHBOARD');
        soundEngine.speakDispatch('Scenario loaded: High-Density Junction Convergence at Naini Diamond.');
      },
    },
    {
      title: 'Step 2: 4-Future What-If AI Simulation',
      badge: 'Minimum-Regret Engine',
      desc: 'RAILMIND evaluates 4 parallel futures (Plans A-D) with dynamic regret scoring to balance passenger punctuality, freight throughput, and traction energy.',
      actionLabel: 'Evaluate What-If Plans',
      runAction: () => {
        if (setActiveTab) setActiveTab('DASHBOARD');
        soundEngine.speakDispatch('Evaluating 4 parallel dispatch strategies. Plan D selected with zero deadlocks.');
      },
    },
    {
      title: 'Step 3: CTC Route Interlocking & De-Confliction',
      badge: 'Autonomous Interlock',
      desc: 'Interlocks dynamic green-wave slot insertion (+28% Line Capacity) with zero deadlocks and 100% elimination of phantom stops.',
      actionLabel: 'Apply AI Recommendation',
      runAction: () => {
        soundEngine.playSuccessTone();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        soundEngine.speakDispatch('Recommendation deployed. Green corridor established.');
      },
    },
    {
      title: 'Step 4: Loco Pilot Cockpit & Kavach HUD',
      badge: 'Driver In-Cab HUD',
      desc: 'Opens the Loco Pilot Cockpit HUD displaying the 3D windshield, 25kV OHE catenary, speed gauge, and Kavach dynamic target braking curve.',
      actionLabel: 'Enter Driver Cab HUD',
      runAction: () => {
        if (onOpenCabView) onOpenCabView('TRN_22436');
        soundEngine.playTrainHorn('VANDE_BHARAT');
      },
    },
    {
      title: 'Step 5: Bilingual Station Public Announcement',
      badge: 'Bilingual Audio Dispatch',
      desc: 'Triggers the iconic Indian Railways 4-tone station chime (Ding-Dong-Ding-Dong) and bilingual Hindi/English synthesized passenger advisory.',
      actionLabel: 'Play Station Announcement',
      runAction: () => {
        soundEngine.playStationChime();
        setTimeout(() => {
          soundEngine.speakDispatch('यात्रीगण कृपया ध्यान दें, गाड़ी संख्या 22436 Vande Bharat Express Naini Junction Platform 1 पर आ रही है।');
        }, 1200);
      },
    },
    {
      title: 'Step 6: Formal Ministry of Railways Evaluation Report',
      badge: 'Zonal ROI & Scorecard',
      desc: 'Generates the formal printable PDF scorecard with Scott formula line capacity benchmarks, delay elimination, and ₹ 168+ Cr/year Zonal ROI.',
      actionLabel: 'Generate Evaluation Scorecard',
      runAction: () => {
        if (onOpenReport) onOpenReport();
      },
    },
  ];

  const handleRunStep = () => {
    setIsPlayingStep(true);
    soundEngine.playRelayClick();
    tourSteps[stepIndex].runAction();
    setTimeout(() => setIsPlayingStep(false), 800);
  };

  const handleNextStep = () => {
    soundEngine.playRelayClick();
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      onClose();
    }
  };

  const handlePrevStep = () => {
    soundEngine.playRelayClick();
    if (stepIndex > 0) setStepIndex((prev) => prev - 1);
  };

  return (
    <div className="tour-modal-backdrop">
      <div className="tour-modal-container">
        {/* Header */}
        <div className="tour-modal-header">
          <div className="flex items-center gap-2">
            <div className="tour-icon-box">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="tour-tag">SIH25022 EVALUATION DEMO TOUR</span>
              <h3 className="tour-title">Live 6-Step Interactive Guided Showcase</h3>
            </div>
          </div>

          <button onClick={onClose} className="btn-tour-close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tour Progress Bar */}
        <div className="tour-progress-row">
          {tourSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => {
                soundEngine.playRelayClick();
                setStepIndex(idx);
              }}
              className={`tour-step-tab ${stepIndex === idx ? 'active' : stepIndex > idx ? 'completed' : ''}`}
            >
              <span className="step-num">{idx + 1}</span>
              <span className="step-txt">{step.badge}</span>
            </div>
          ))}
        </div>

        {/* Current Step Showcase Card */}
        <div className="tour-step-card">
          <div className="step-card-header">
            <span className="step-badge-pill">{tourSteps[stepIndex].badge}</span>
            <span className="step-counter-txt">STEP {stepIndex + 1} OF {tourSteps.length}</span>
          </div>

          <h4 className="step-main-title">{tourSteps[stepIndex].title}</h4>
          <p className="step-description">{tourSteps[stepIndex].desc}</p>

          {/* Action Trigger Button */}
          <button
            onClick={handleRunStep}
            disabled={isPlayingStep}
            className="btn-tour-action"
          >
            {isPlayingStep ? (
              <>
                <span className="spinner-dot animate-spin" />
                <span>Executing Live Automation...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-amber-300 fill-current" />
                <span>▶ {tourSteps[stepIndex].actionLabel}</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Navigation */}
        <div className="tour-modal-footer">
          <button
            onClick={handlePrevStep}
            disabled={stepIndex === 0}
            className="btn-tour-nav"
          >
            Previous
          </button>

          <button
            onClick={handleNextStep}
            className="btn-tour-nav primary"
          >
            <span>{stepIndex === tourSteps.length - 1 ? 'Finish Showcase 🎉' : 'Next Step ➔'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTourModal;
