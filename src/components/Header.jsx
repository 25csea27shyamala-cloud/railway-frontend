import React from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, Shield, Cpu, RotateCcw, Bell, User, LogOut, CheckCircle2, FileText, Globe } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const Header = ({
  timeString,
  isPlaying,
  setIsPlaying,
  timeSpeed,
  setTimeSpeed,
  isMuted,
  toggleSound,
  onResetSimulation,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenLogin,
  onOpenReport,
  onOpenPitchDeck,
  onOpenTour,
  onOpenLanding,
  onLogout,
  conflictsCount = 0,
}) => {
  return (
    <header className="header-master-command-bar">
      {/* 1. Topmost Official Command Center Bar */}
      <div className="top-banner-row">
        <div className="brand-logo-area">
          <div className="command-center-logo-box">
            <Sparkles className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="command-center-title">
                AI RAILWAY TRAFFIC COMMAND CENTER
              </h1>
              <span className="live-pulse-badge">
                <span className="pulse-dot green" />
                <span>LIVE System Operational</span>
              </span>
            </div>
            <p className="command-center-subtitle">
              Real-time AI Powered Railway Traffic Management System • SIH25022 (Ministry of Railways)
            </p>
          </div>
        </div>

        {/* Right Status Block (Live Time + Report Download + Operator Profile) */}
        <div className="top-status-right">
          {/* Product Landing Page Switcher */}
          <button
            onClick={() => {
              soundEngine.playRelayClick();
              if (onOpenLanding) onOpenLanding();
            }}
            className="btn-product-landing-header"
            title="Switch to Public Enterprise SaaS Product Landing Page"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>🚀 Product Landing</span>
          </button>

          {/* Guided Demo & Pitch Deck Buttons */}
          <button
            onClick={() => {
              soundEngine.playRelayClick();
              if (onOpenTour) onOpenTour();
            }}
            className="btn-guided-demo-header"
            title="Launch 6-Step Interactive Showcase for Judges"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
            <span>▶ Guided Demo</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playRelayClick();
              if (onOpenPitchDeck) onOpenPitchDeck();
            }}
            className="btn-pitch-deck-header"
            title="Open SIH25022 Interactive Presentation Pitch Deck"
          >
            <span>📊 Pitch Deck</span>
          </button>

          {/* Executive PDF Report Button */}
          <button
            onClick={() => {
              soundEngine.playRelayClick();
              if (onOpenReport) onOpenReport();
            }}
            className="btn-download-report-header"
            title="Download / Print Formal Ministry Evaluation Scorecard"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>📄 Executive SIH Report</span>
          </button>

          {/* Digital Master Clock */}
          <div className="top-clock-chip">
            <span className="time-val">{timeString} IST</span>
            <span className="date-val">20 May 2026, Section 4</span>
          </div>

          {/* Conflict Alert Bell */}
          <div
            className={`top-bell-btn ${conflictsCount > 0 ? 'has-alerts' : ''}`}
            onClick={() => {
              soundEngine.playAlertChime();
              setActiveTab('DASHBOARD');
            }}
            title={conflictsCount > 0 ? `${conflictsCount} Active Conflict Warnings` : 'All Signals Clear'}
          >
            <Bell className="w-4 h-4 text-amber-300" />
            {conflictsCount > 0 && <span className="bell-badge">{conflictsCount}</span>}
          </div>

          {/* Operator Profile Badge */}
          {currentUser ? (
            <div className="operator-profile-card">
              <div className="avatar-ring" onClick={onOpenLogin}>
                <User className="w-3.5 h-3.5 text-sky-200" />
              </div>
              <div className="operator-details" onClick={onOpenLogin}>
                <span className="op-title">Operator</span>
                <span className="op-name">{currentUser.name || 'Control Room'}</span>
                <span className="op-role">{currentUser.roleLabel || 'Chief Controller'}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playRelayClick();
                  if (onLogout) onLogout();
                }}
                className="btn-header-logout"
                title="Logout / Switch Operator Desk"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
              </button>
            </div>
          ) : (
            <button onClick={onOpenLogin} className="btn-login-header">
              <User className="w-3.5 h-3.5" />
              <span>Controller Login</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Secondary Interactive Navigation & Simulation Control Bar */}
      <div className="sub-header-bar">
        {/* Navigation Tabs */}
        <div className="command-nav-tabs">
          {[
            { id: 'DASHBOARD', label: '🖥️ DASHBOARD & JUNCTION NETWORK' },
            { id: 'STRING_CHART', label: '📉 MASTER STRING CHART (TSV)' },
            { id: 'DRAWBACKS', label: '🚨 7 DRAWBACKS OVER PAST AI' },
            { id: 'ARCHITECTURE', label: '🏛️ 6-LAYER ARCHITECTURE' },
            { id: 'ROI', label: '💰 ZONAL ROI & ECONOMIC ENGINE' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playRelayClick();
                setActiveTab(tab.id);
              }}
              className={`command-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Live Simulation Controls */}
        <div className="simulation-toolbar">
          <div className="sim-status-pills">
            <div className="pill-kavach">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>KAVACH: ACTIVE</span>
            </div>
            <div className="pill-ctc">
              <Cpu className="w-3 h-3 text-sky-400" />
              <span>CTC: SYNC</span>
            </div>
          </div>

          <div className="sim-buttons-group">
            <button
              onClick={() => {
                soundEngine.playRelayClick();
                setIsPlaying(!isPlaying);
              }}
              className={`btn-sim-play ${isPlaying ? 'pause' : 'play'}`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'RUN'}</span>
            </button>

            {[1, 2, 5, 10].map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  soundEngine.playRelayClick();
                  setTimeSpeed(spd);
                }}
                className={`btn-sim-speed ${timeSpeed === spd ? 'active' : ''}`}
              >
                {spd}x
              </button>
            ))}

            <button
              onClick={() => {
                soundEngine.playRelayClick();
                onResetSimulation();
              }}
              className="btn-sim-reset"
              title="Reset Simulation Clock"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleSound}
              className={`btn-sim-sound ${isMuted ? 'muted' : ''}`}
              title={isMuted ? 'Unmute Audio & Announcements' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
