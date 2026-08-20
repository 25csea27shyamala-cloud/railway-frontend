import React from 'react';
import { LayoutDashboard, Radio, Train, Cpu, AlertTriangle, GitPullRequest, GitMerge, FileText, Bell, Settings, CloudRain, Sun, Moon, Wind, Droplets, Eye, Sparkles } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  activeScenarioId,
  onSelectScenario,
  conflictsCount = 2,
  onOpenLogin,
  currentUser,
}) => {
  const navItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'LIVE_NETWORK', label: 'Live Network', icon: Radio },
    { id: 'TRAINS', label: 'Trains Fleet', icon: Train },
    { id: 'AI_PREDICTIONS', label: 'AI Predictions', icon: Cpu },
    { id: 'CONFLICTS', label: 'Conflicts', icon: AlertTriangle, badge: conflictsCount },
    { id: 'WHAT_IF', label: 'What-If Simulator', icon: GitPullRequest },
    { id: 'STRING_CHART', label: 'Route Optimisation', icon: GitMerge },
    { id: 'ROI', label: 'Reports & ROI', icon: FileText },
    { id: 'DRAWBACKS', label: 'SIH Defense Hub', icon: Sparkles },
    { id: 'ARCHITECTURE', label: '6-Layer Stack', icon: Settings },
  ];

  const handleNavClick = (id) => {
    soundEngine.playRelayClick();
    if (id === 'CONFLICTS' || id === 'LIVE_NETWORK' || id === 'TRAINS' || id === 'AI_PREDICTIONS' || id === 'WHAT_IF') {
      setActiveTab('DASHBOARD');
    } else {
      setActiveTab(id);
    }
  };

  return (
    <aside className="sidebar-command-container">
      {/* 1. Main Navigation Menu matching user image */}
      <div className="sidebar-nav-menu">
        {navItems.map((item) => {
          const isActive = activeTab === item.id || (activeTab === 'DASHBOARD' && item.id === 'DASHBOARD');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
            >
              <div className="btn-left">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="sidebar-badge-counter">{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. Weather & Celestial Widget (Exact match to user's uploaded image) */}
      <div className="sidebar-weather-card">
        <div className="weather-card-header">
          <span className="weather-card-title">WEATHER NOW</span>
        </div>

        <div className="weather-temp-row">
          <div className="temp-left">
            <CloudRain className="w-8 h-8 text-sky-400 animate-bounce" />
            <div>
              <span className="temp-val">28°C</span>
              <span className="temp-cond">Light Rain</span>
            </div>
          </div>
        </div>

        {/* 4-Item Weather Stats Grid */}
        <div className="weather-stats-grid">
          <div className="w-stat-col">
            <div className="w-icon-val"><Wind className="w-3 h-3 text-slate-400" /><span>Wind</span></div>
            <strong className="text-white">12 km/h</strong>
          </div>
          <div className="w-stat-col">
            <div className="w-icon-val"><Droplets className="w-3 h-3 text-sky-400" /><span>Humidity</span></div>
            <strong className="text-white">78%</strong>
          </div>
          <div className="w-stat-col">
            <div className="w-icon-val"><Eye className="w-3 h-3 text-amber-400" /><span>Visibility</span></div>
            <strong className="text-white">6 km</strong>
          </div>
          <div className="w-stat-col">
            <div className="w-icon-val"><span>Pressure</span></div>
            <strong className="text-white">1012 hPa</strong>
          </div>
        </div>

        {/* Celestial Astronomical Times */}
        <div className="celestial-times-list">
          <div className="c-time-row">
            <div className="c-left"><Sun className="w-3 h-3 text-amber-400" /><span>Sunrise</span></div>
            <strong>05:45 AM</strong>
          </div>
          <div className="c-time-row">
            <div className="c-left"><Sun className="w-3 h-3 text-amber-600" /><span>Sunset</span></div>
            <strong>06:42 PM</strong>
          </div>
          <div className="c-time-row">
            <div className="c-left"><Moon className="w-3 h-3 text-cyan-300" /><span>Moonset</span></div>
            <strong>02:35 AM</strong>
          </div>
        </div>
      </div>

      {/* 3. Operator Card at Bottom of Sidebar */}
      <div className="sidebar-operator-card" onClick={onOpenLogin}>
        <div className="op-avatar">
          <Settings className="w-3.5 h-3.5 text-sky-300" />
        </div>
        <div className="op-info">
          <span className="op-name">{currentUser?.name || 'Operator: Control Room'}</span>
          <span className="op-role">{currentUser?.roleLabel || 'Click to Login / Auth'}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
