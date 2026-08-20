import React, { useState } from 'react';
import { ShieldCheck, Zap, Gauge, Volume2, Search, Filter, Train as TrainIcon } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const TrainStatus = ({
  trains,
  selectedTrainId,
  onSelectTrain,
  onOpenCabView,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'EXPRESS', 'FREIGHT', 'MEMU', 'DELAYED'

  const filteredTrains = trains.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.number.includes(searchQuery);
    if (!matchesSearch) return false;

    if (filterType === 'EXPRESS') return t.type === 'VANDE_BHARAT' || t.type === 'RAJDHANI' || t.type === 'EXPRESS';
    if (filterType === 'FREIGHT') return t.type.includes('FREIGHT');
    if (filterType === 'MEMU') return t.type === 'MEMU';
    if (filterType === 'DELAYED') return t.delayMinutes > 0;
    return true;
  });

  return (
    <div className="train-status-container">
      {/* Header & Filter Controls */}
      <div className="status-header">
        <div className="title-left">
          <Zap className="w-4 h-4 text-sky-400" />
          <h3 className="status-title">LIVE TRAIN STATUS TABLE ({filteredTrains.length} / {trains.length} RAKES)</h3>
        </div>

        <div className="fleet-search-bar-row">
          <div className="search-input-box">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search train name / #..."
              className="fleet-search-input"
            />
          </div>

          <div className="filter-chips-row">
            {['ALL', 'EXPRESS', 'FREIGHT', 'MEMU', 'DELAYED'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`btn-filter-chip ${filterType === f ? 'active' : ''}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Train Telemetry Cards */}
      <div className="train-cards-grid">
        {filteredTrains.map((train) => {
          const isSelected = selectedTrainId === train.id;
          const isFreight = train.type.includes('FREIGHT');

          return (
            <div
              key={train.id}
              onClick={() => {
                soundEngine.playRelayClick();
                onSelectTrain(train.id);
              }}
              className={`train-telemetry-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="card-top-row">
                <div className="train-id-col">
                  <span className="train-color-dot" style={{ backgroundColor: train.color }} />
                  <div>
                    <span className="train-num">#{train.number}</span>
                    <span className="train-name-txt">{train.name}</span>
                  </div>
                </div>
                <div className="priority-badge">
                  ★{train.dynamicPriority} Pri
                </div>
              </div>

              <div className="telemetry-stats-row">
                <div className="stat-col">
                  <span className="lbl">Speed</span>
                  <span className="val text-blue">{train.speedKmh} km/h</span>
                </div>
                <div className="stat-col">
                  <span className="lbl">Position</span>
                  <span className="val">Km {train.positionKm.toFixed(1)}</span>
                </div>
                <div className="stat-col">
                  <span className="lbl">Delay</span>
                  <span className={`val ${train.delayMinutes === 0 ? 'text-green' : 'text-amber'}`}>
                    {train.delayMinutes > 0 ? `+${train.delayMinutes}m` : '0m'}
                  </span>
                </div>
              </div>

              <div className="advisory-snippet">
                {train.driverAdvisory}
              </div>

              <div className="card-actions-row">
                <div className="kavach-indicator">
                  <ShieldCheck className="w-3 h-3 text-sky-400" />
                  <span>KAVACH: {train.kavachStatus}</span>
                </div>

                <div className="fleet-btn-group" style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playRelayClick();
                      if (onOpenCabView) onOpenCabView(train.id);
                    }}
                    className="btn-horn"
                    style={{ background: '#0284c7', color: '#ffffff', fontWeight: 'bold' }}
                    title="Open Driver In-Cab Cockpit HUD"
                  >
                    🎮 Cab HUD
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.announceTrain(train);
                    }}
                    className="btn-horn"
                    title="Play Station Public Announcement"
                  >
                    📢 Announce
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playTrainHorn(isFreight ? 'FREIGHT' : train.type === 'VANDE_BHARAT' ? 'VANDE_BHARAT' : 'EXPRESS');
                    }}
                    className="btn-horn"
                  >
                    🎺 Horn
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainStatus;
