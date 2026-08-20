import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_TRAINS,
  INITIAL_TRACKS,
  INITIAL_SIGNALS,
  INITIAL_SWITCHES,
  INITIAL_STATIONS,
} from './data/railwayLayout';
import { SCENARIOS } from './data/scenarios';
import { updateSimulationStep } from './engine/digitalTwinEngine';
import { predictConflicts } from './engine/conflictPredictor';
import { generateWhatIfPlans } from './engine/whatIfSimulator';
import { soundEngine } from './engine/soundEngine';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StatCards from './components/StatCards';
import RailwayMap from './components/RailwayMap';
import AIRecommendations from './components/AIRecommendations';
import WhatIfSimulation from './components/WhatIfSimulation';
import TrainStatus from './components/TrainStatus';
import DrawbacksModal from './components/DrawbacksModal';
import ArchitectureModal from './components/ArchitectureModal';
import ROICalculatorModal from './components/ROICalculatorModal';
import TimeDistanceModal from './components/TimeDistanceModal';
import CabViewModal from './components/CabViewModal';
import AuthLoginModal from './components/AuthLoginModal';
import ExportReportModal from './components/ExportReportModal';
import LoginPage from './components/LoginPage';
import PitchDeckModal from './components/PitchDeckModal';
import GuidedTourModal from './components/GuidedTourModal';

import './App.css';

export function App() {
  const [trains, setTrains] = useState(INITIAL_TRAINS);
  const [tracks, setTracks] = useState(INITIAL_TRACKS);
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [switches, setSwitches] = useState(INITIAL_SWITCHES);
  const [stations] = useState(INITIAL_STATIONS);

  const [timeHours, setTimeHours] = useState(9.41); // 09:24:35 AM IST (matches user image)
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeSpeed, setTimeSpeed] = useState(2);
  const [weather, setWeather] = useState('LIGHT_RAIN');
  const [activeScenarioId, setActiveScenarioId] = useState('SCENARIO_4');
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const [conflicts, setConflicts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState('PLAN_D');
  const [selectedTrainId, setSelectedTrainId] = useState(null);
  const [cabViewTrainId, setCabViewTrainId] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Shows official Login Portal upon entry

  // Authenticated Operator State
  const [currentUser, setCurrentUser] = useState({
    id: 'OP_7841',
    name: 'Shri R. K. Sharma',
    role: 'CHIEF_CONTROLLER',
    roleLabel: 'Chief Section Controller',
    zone: 'North Central Railway (NCR)',
    division: 'Prayagraj Control Room (PRYJ)',
    email: 'controller.pryj@railnet.gov.in',
  });

  const [metrics, setMetrics] = useState({
    lineCapacityUtilizationPercent: 72,
    sectionThroughputTph: 5.2,
    averageSectionSpeedKmh: 94,
    totalSectionDelayMin: 7,
    headwayCompressionSec: 90,
    punctualityIndexPercent: 96.5,
    tractionEnergySavedKWh: 420,
    co2EmissionsOffsetKg: 350,
    activeConflictsCount: 2,
    traditionalBenchmark: {
      throughputTph: 3.2,
      totalDelayMin: 42,
      averageSpeedKmh: 64,
      capacityUtilizationPercent: 72,
    },
  });

  const [logs, setLogs] = useState([
    {
      id: 'LOG_INIT_1',
      timestamp: '09:24:00',
      type: 'KAVACH_HEARTBEAT',
      title: 'Kavach ATP Telemetry Link Established',
      details: 'All 14 active rakes paired with station radio interlocking. Track circuit status verified.',
      severity: 'info',
    },
    {
      id: 'LOG_INIT_2',
      timestamp: '09:24:02',
      type: 'AI_ADVISORY',
      title: 'RAILMIND Digital Twin 2.0 Synchronized',
      details: 'Lookahead horizon 15.0 mins active. Scott capacity efficiency factor elevated to 0.91.',
      severity: 'success',
    },
  ]);

  const addLog = useCallback((type, title, details, severity = 'info') => {
    const hours = Math.floor(timeHours) % 24;
    const mins = Math.floor((timeHours % 1) * 60);
    const secs = Math.floor((((timeHours % 1) * 60) % 1) * 60);
    const ts = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const newLog = {
      id: `LOG_${Date.now()}_${Math.random()}`,
      timestamp: ts,
      type,
      title,
      details,
      severity,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 40)]);
  }, [timeHours]);

  const handleSelectScenario = useCallback((scenarioId) => {
    const sc = SCENARIOS.find((s) => s.id === scenarioId);
    if (!sc) return;

    setActiveScenarioId(scenarioId);

    let newTracks = INITIAL_TRACKS.map((t) => ({ ...t, isBlocked: false, blockageReason: undefined }));
    if (sc.initialTracks) {
      newTracks = newTracks.map((t) => {
        const override = sc.initialTracks.find((ot) => ot.id === t.id);
        return override ? { ...t, ...override } : t;
      });
    }
    setTracks(newTracks);

    setTrains((prevTrains) =>
      prevTrains.map((t) => {
        const override = sc.initialTrains.find((ot) => ot.id === t.id);
        if (override) {
          return {
            ...t,
            ...override,
            targetSpeedKmh: override.speedKmh ?? t.targetSpeedKmh,
          };
        }
        return t;
      })
    );

    addLog('SCENARIO_LOADED', `Loaded Scenario: ${sc.title}`, sc.description, 'warning');
  }, [addLog]);

  // Simulation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const deltaSec = 0.25 * timeSpeed;

      setTimeHours((prev) => {
        const next = prev + (deltaSec / 3600);
        return next > 24 ? 0 : next;
      });

      const { updatedTrains, updatedTracks, updatedSignals, updatedMetrics } = updateSimulationStep(
        trains,
        tracks,
        signals,
        switches,
        deltaSec,
        activeScenarioId
      );

      setTrains(updatedTrains);
      setTracks(updatedTracks);
      setSignals(updatedSignals);
      setMetrics(updatedMetrics);

      const newConflicts = predictConflicts(updatedTrains, updatedTracks);
      setConflicts(newConflicts);

      const newPlans = generateWhatIfPlans(updatedTrains, updatedTracks, newConflicts, activeScenarioId);
      setPlans(newPlans);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, timeSpeed, trains, tracks, signals, switches, activeScenarioId]);

  const handleDeployPlan = (plan) => {
    setTrains((prevTrains) =>
      prevTrains.map((t) => {
        const action = plan.trainActions.find((a) => a.trainId === t.id);
        if (action) {
          return {
            ...t,
            targetSpeedKmh: action.targetSpeedKmh,
            currentTrackId: action.assignedTrack || t.currentTrackId,
            driverAdvisory: action.action,
            delayMinutes: Math.max(0, t.delayMinutes + action.delayChangeMin),
          };
        }
        return t;
      })
    );

    addLog(
      'ROUTE_INTERLOCKED',
      `Interlocked: ${plan.name}`,
      `De-conflict resolution deployed. Throughput elevated by +${plan.throughputGainPercent}%. Regret Score: ${plan.regretScore}/100.`,
      'success'
    );
  };

  const handleToggleSwitch = (switchId) => {
    soundEngine.playRelayClick();
    setSwitches((prevSwitches) =>
      prevSwitches.map((sw) => {
        if (sw.id === switchId) {
          const nextState = sw.state === 'NORMAL' ? 'REVERSE' : 'NORMAL';
          addLog('ROUTE_INTERLOCKED', `Switch ${sw.name} Thrown`, `State transitioned to ${nextState}. Track circuit interlocked.`, 'info');
          return { ...sw, state: nextState };
        }
        return sw;
      })
    );
  };

  const handleUpdateTrainSpeed = (trainId, targetSpeed) => {
    setTrains((prev) =>
      prev.map((t) => (t.id === trainId ? { ...t, targetSpeedKmh: targetSpeed, advisorySpeedKmh: targetSpeed } : t))
    );
    addLog('MANUAL_DISPATCH', `Speed Profile Override for ${trainId}`, `Target speed set to ${targetSpeed} km/h by Controller.`, 'warning');
  };

  const handleApplySandboxToLive = (trainId, delayMin, speedCap) => {
    setTrains((prev) =>
      prev.map((t) => {
        if (t.id === trainId) {
          return {
            ...t,
            delayMinutes: t.delayMinutes + delayMin,
            targetSpeedKmh: Math.min(t.targetSpeedKmh, speedCap),
            driverAdvisory: `PERTURBATION APPLIED: +${delayMin}m delay injected. Speed regulated to ${speedCap} km/h.`,
          };
        }
        return t;
      })
    );
    addLog('MANUAL_DISPATCH', 'Sandbox Perturbation Injected', `Train ${trainId} delayed by +${delayMin}m with TSR ${speedCap} km/h.`, 'danger');
  };

  const handleResetSimulation = () => {
    setTimeHours(9.41);
    setTrains(INITIAL_TRAINS);
    setTracks(INITIAL_TRACKS);
    setSignals(INITIAL_SIGNALS);
    setSwitches(INITIAL_SWITCHES);
    addLog('SCENARIO_LOADED', 'Simulation Reset', 'Corridor state reset to baseline 09:24:35 AM IST.', 'info');
  };

  const normTime = Math.max(0, Math.min(24, timeHours));
  const hours = Math.floor(normTime) % 24;
  const minutes = Math.floor((normTime % 1) * 60);
  const seconds = Math.floor((((normTime % 1) * 60) % 1) * 60);
  const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const toggleSound = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    soundEngine.setMuted(nextMute);
    if (!nextMute) {
      soundEngine.playRelayClick();
    }
  };

  const cabViewTrainObj = trains.find((t) => t.id === cabViewTrainId) || null;

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="command-center-app-root">
      {/* 1. Official Command Center Top Navbar */}
      <Header
        timeString={timeString}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
        isMuted={isMuted}
        toggleSound={toggleSound}
        onResetSimulation={handleResetSimulation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenLogin={() => setIsAuthOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenPitchDeck={() => setIsPitchDeckOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        onLogout={() => setIsAuthenticated(false)}
        conflictsCount={conflicts.length}
      />

      {/* 2. Top 5 Command Center KPI Bar (Active Trains, Network Load, Delayed Trains, AI Confidence, Avg. Delay) */}
      <div className="max-w-[1800px] w-full mx-auto px-4 pt-3">
        <StatCards
          metrics={metrics}
          activeTrainCount={trains.length}
          delayedCount={trains.filter((t) => t.delayMinutes > 0).length}
        />
      </div>

      {/* 3. Three-Column Main Command Body (Sidebar + Central Map/Panels + Right AI Recommendations) */}
      <div className="command-center-body-grid">
        {/* Left Navigation Sidebar + Weather Widget */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeScenarioId={activeScenarioId}
          onSelectScenario={handleSelectScenario}
          conflictsCount={conflicts.length}
          currentUser={currentUser}
          onOpenLogin={() => setIsAuthOpen(true)}
        />

        {/* Central Main Stage (Digital Twin Map + What-If Simulator + Fleet Table) */}
        <main className="central-command-stage">
          {activeTab === 'DASHBOARD' && (
            <>
              {/* 3D Curved Junction Hub Network Canvas */}
              <RailwayMap
                trains={trains}
                tracks={tracks}
                signals={signals}
                switches={switches}
                stations={stations}
                conflicts={conflicts}
                selectedTrainId={selectedTrainId}
                onSelectTrain={setSelectedTrainId}
                onToggleSwitch={handleToggleSwitch}
                timeHours={timeHours}
                setTimeHours={setTimeHours}
                weather={weather}
                setWeather={setWeather}
                onApplyAIRecommendation={() => {
                  const recPlan = plans.find((p) => p.isRecommended) || plans[0];
                  if (recPlan) handleDeployPlan(recPlan);
                }}
              />

              {/* Bottom Twin Panels: Live Train Status Table + What-If Simulation Sandbox */}
              <div className="stage-bottom-panels-grid">
                {/* Live Train Status Fleet Table */}
                <div className="stage-panel-card">
                  <TrainStatus
                    trains={trains}
                    selectedTrainId={selectedTrainId}
                    onSelectTrain={setSelectedTrainId}
                    onOpenCabView={(id) => setCabViewTrainId(id)}
                  />
                </div>

                {/* What-If Simulator Decision Engine */}
                <div className="stage-panel-card">
                  <WhatIfSimulation
                    plans={plans.length > 0 ? plans : generateWhatIfPlans(trains, tracks, conflicts, activeScenarioId)}
                    activePlanId={activePlanId}
                    onSelectPlan={setActivePlanId}
                    onDeployPlan={handleDeployPlan}
                    trains={trains}
                    onApplySandboxToLive={handleApplySandboxToLive}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'STRING_CHART' && (
            <TimeDistanceModal
              trains={trains}
              conflicts={conflicts}
              stations={stations}
              timeHours={timeHours}
            />
          )}

          {activeTab === 'DRAWBACKS' && <DrawbacksModal />}
          {activeTab === 'ARCHITECTURE' && <ArchitectureModal />}
          {activeTab === 'ROI' && <ROICalculatorModal />}
        </main>

        {/* Right Side: AI Recommendations Master Card (Matches User Image) */}
        <aside className="right-command-ai-col">
          <AIRecommendations
            conflicts={conflicts}
            onApplyRecommendation={() => {
              const recPlan = plans.find((p) => p.isRecommended) || plans[0];
              if (recPlan) handleDeployPlan(recPlan);
            }}
          />
        </aside>
      </div>

      {/* Driver In-Cab Cockpit HUD Modal */}
      {cabViewTrainId && (
        <CabViewModal
          train={cabViewTrainObj}
          signals={signals}
          timeHours={timeHours}
          weather={weather}
          onClose={() => setCabViewTrainId(null)}
          onUpdateSpeed={handleUpdateTrainSpeed}
        />
      )}

      {/* Controller CRIS / TMS Auth Modal */}
      <AuthLoginModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* Formal Ministry of Railways Technical Evaluation Scorecard Exporter */}
      <ExportReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        metrics={metrics}
        trains={trains}
        currentUser={currentUser}
      />

      {/* SIH25022 Interactive Presentation Pitch Deck */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
        onLaunchLiveDemo={() => {
          setIsPitchDeckOpen(false);
          setIsTourOpen(true);
        }}
      />

      {/* 6-Step Interactive Guided Showcase Tour for Evaluators */}
      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSelectScenario={handleSelectScenario}
        onOpenCabView={(id) => setCabViewTrainId(id)}
        onDeployPlan={handleDeployPlan}
        onOpenReport={() => setIsReportOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Footer */}
      <footer className="app-footer">
        <span>AI RAILWAY TRAFFIC COMMAND CENTER • SIH25022 (Ministry of Railways) • Real-Time Digital Twin & Minimum-Regret Decision Engine</span>
      </footer>
    </div>
  );
}

export default App;
