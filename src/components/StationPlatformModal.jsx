import React, { useState } from 'react';
import { X, Building2, Train, Clock, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Zap, RefreshCw, Volume2 } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const StationPlatformModal = ({ station, trains, isOpen, onClose, onSelectTrain }) => {
  if (!isOpen || !station) return null;

  const [dwellTimers, setDwellTimers] = useState({
    1: 45,
    2: 120,
    3: 0,
    4: 80,
  });

  const handleClearDeparture = (platformNum, trainNum) => {
    soundEngine.playSuccessTone();
    soundEngine.speakDispatch(`Route interlocked for Platform ${platformNum}. Advanced starter signal cleared for Train ${trainNum || ''}.`);
  };

  const handleAnnouncePlatform = (train) => {
    if (train) {
      soundEngine.announceTrain(train);
    } else {
      soundEngine.playStationChime();
    }
  };

  return (
    <div className="station-modal-backdrop">
      <div className="station-modal-container">
        {/* Header */}
        <div className="station-modal-header">
          <div className="flex items-center gap-3">
            <div className="station-icon-avatar">
              <Building2 className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="station-modal-title">{station.name.toUpperCase()} ({station.code})</h2>
                <span className="station-km-tag">Km {station.km.toFixed(1)}</span>
              </div>
              <p className="station-sub-desc">Station Master Berth & Track Circuit Relay Interlocking Panel</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-station-close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Station Summary Metrics */}
        <div className="station-metrics-row">
          <div className="station-stat-pill">
            <span className="lbl">Total Platforms:</span>
            <span className="val text-sky-400">{station.platforms.length} Berths</span>
          </div>
          <div className="station-stat-pill">
            <span className="lbl">Track Relay Voltage:</span>
            <span className="val text-emerald-400">1.42 V (Normal)</span>
          </div>
          <div className="station-stat-pill">
            <span className="lbl">Route Interlocking:</span>
            <span className="val text-blue">Electronic (EI-Solid State)</span>
          </div>
          <div className="station-stat-pill">
            <span className="lbl">Kavach Station Beacon:</span>
            <span className="val text-emerald-400">ONLINE</span>
          </div>
        </div>

        {/* Platform Berths Grid */}
        <div className="platforms-berth-list">
          {station.platforms.map((plt) => {
            // Find train currently at or near this platform
            const occupyingTrain = trains.find(
              (t) => Math.abs(t.positionKm - station.km) < 1.8 && (t.assignedPlatform === plt.number || t.currentTrackId === plt.trackId)
            );

            const isOccupied = !!occupyingTrain;
            const dwellSec = dwellTimers[plt.number] || 0;

            return (
              <div
                key={plt.number}
                className={`platform-card ${isOccupied ? 'occupied' : 'clear'}`}
              >
                {/* Platform Header */}
                <div className="platform-card-top">
                  <div className="flex items-center gap-2">
                    <span className="platform-num-badge">PF {plt.number}</span>
                    <span className="platform-track-lbl">{plt.trackId}</span>
                  </div>

                  <span className={`platform-status-tag ${isOccupied ? 'occupied' : 'clear'}`}>
                    {isOccupied ? '🔴 BERTH OCCUPIED' : '🟢 CLEAR / BERTH AVAILABLE'}
                  </span>
                </div>

                {/* Occupying Train Info or Clear Status */}
                {isOccupied ? (
                  <div className="platform-train-details">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="train-dot-color" style={{ backgroundColor: occupyingTrain.color }} />
                        <div>
                          <span className="train-id-txt">#{occupyingTrain.number} - {occupyingTrain.name}</span>
                          <span className="train-route-txt">{occupyingTrain.originStation} ➔ {occupyingTrain.destinationStation}</span>
                        </div>
                      </div>
                      <span className="priority-tag">★{occupyingTrain.dynamicPriority} Pri</span>
                    </div>

                    {/* Dwell Timer & Speed */}
                    <div className="platform-dwell-bar">
                      <div className="dwell-stat">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>Dwell Timer: <strong className="text-white">{dwellSec}s remaining</strong></span>
                      </div>
                      <div className="dwell-stat">
                        <span>Speed: <strong className="text-sky-400">{occupyingTrain.speedKmh} km/h</strong></span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="platform-btn-row">
                      <button
                        onClick={() => handleAnnouncePlatform(occupyingTrain)}
                        className="btn-plt-action"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Announce Train</span>
                      </button>

                      <button
                        onClick={() => handleClearDeparture(plt.number, occupyingTrain.number)}
                        className="btn-plt-action primary"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Authorize Departure</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="platform-clear-box">
                    <span className="clear-desc">Berth 680m clear. Ready for train reception from block section.</span>
                    <button
                      onClick={() => handleClearDeparture(plt.number, 'Next Inbound')}
                      className="btn-plt-action secondary"
                    >
                      <span>Set Inbound Reception Route</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="station-modal-footer">
          <span>Electronic Interlocking (EI) • North Central Railway • Station Master Desk</span>
        </div>
      </div>
    </div>
  );
};

export default StationPlatformModal;
