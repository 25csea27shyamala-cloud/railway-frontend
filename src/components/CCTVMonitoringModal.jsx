import React, { useState } from 'react';
import { X, Video, ShieldCheck, Eye, Sparkles, RefreshCw, AlertTriangle, CheckCircle2, Camera, Radio, ZoomIn, Sun, Moon } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const CCTVMonitoringModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeCamId, setActiveCamId] = useState('CAM_01');
  const [filterMode, setFilterMode] = useState('COLOR'); // 'COLOR', 'INFRARED', 'NIGHT_VISION'

  const cameras = [
    {
      id: 'CAM_01',
      title: 'Prayagraj Jn (PRYJ) - Platform 1 & 2 Throat',
      tag: 'OPTICAL HD',
      aiStatus: '🟢 Crowd Density: 18% (Safe) • 0 Edge Violations',
      description: 'AI Optical Platform Edge & Passenger Safety Monitoring',
      target: 'PRYJ_PF1_THROAT',
      feedType: 'STATION_PLATFORM',
    },
    {
      id: 'CAM_02',
      title: 'Naini Diamond Crossing - Km 15.0 Point 102A',
      tag: 'AI HAZARD SCAN',
      aiStatus: '🟢 Track Clear • 0 Foreign Objects / Cattle Debris',
      description: 'High-Resolution Turnout Obstacle & Clearance Detection',
      target: 'NAINI_DIAMOND_102A',
      feedType: 'TRACK_CROSSING',
    },
    {
      id: 'CAM_03',
      title: 'Subedarganj (SFG) - 25kV OHE Catenary Drone',
      tag: 'DRONE THERMAL',
      aiStatus: '🟢 Pantograph Contact Temp: 48.2°C (Optimal)',
      description: 'Autonomous Aerial OHE Thermal Infrared Inspection',
      target: 'SFG_OHE_DRONE',
      feedType: 'CATENARY_DRONE',
    },
    {
      id: 'CAM_04',
      title: 'Chheoki Yard - Hot Axle Box & Dragging Detector',
      tag: 'INFRARED SENSOR',
      aiStatus: '🟢 BOXN-782 Axle Bearing Temp: 34.5°C (Normal)',
      description: 'Wayside Rolling Stock Acoustic & Bearing Heat Scanner',
      target: 'CHHEOKI_WILD_SENSOR',
      feedType: 'ROLLING_STOCK',
    },
  ];

  const currentCam = cameras.find((c) => c.id === activeCamId) || cameras[0];

  return (
    <div className="cctv-modal-backdrop">
      <div className="cctv-modal-container">
        {/* Header */}
        <div className="cctv-modal-header">
          <div className="flex items-center gap-3">
            <div className="cctv-icon-avatar">
              <Camera className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="cctv-modal-title">AI VISION & CCTV SURVEILLANCE MATRIX</h2>
                <span className="cctv-live-tag">
                  <span className="live-rec-dot" />
                  REC LIVE (4 NODES)
                </span>
              </div>
              <p className="cctv-sub-desc">Corridor Optical Edge Detection, Drone Thermal Scans & Hot Axle Detectors</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Vision Mode Filter Chips */}
            <div className="cctv-filter-chips">
              <button
                onClick={() => setFilterMode('COLOR')}
                className={`cctv-filter-btn ${filterMode === 'COLOR' ? 'active' : ''}`}
              >
                RGB HD
              </button>
              <button
                onClick={() => setFilterMode('NIGHT_VISION')}
                className={`cctv-filter-btn ${filterMode === 'NIGHT_VISION' ? 'active' : ''}`}
              >
                Night Vision
              </button>
              <button
                onClick={() => setFilterMode('INFRARED')}
                className={`cctv-filter-btn ${filterMode === 'INFRARED' ? 'active' : ''}`}
              >
                Thermal IR
              </button>
            </div>

            <button onClick={onClose} className="btn-cctv-close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Camera Multi-View Grid */}
        <div className="cctv-grid-layout">
          {cameras.map((cam) => {
            const isSelected = activeCamId === cam.id;
            return (
              <div
                key={cam.id}
                onClick={() => {
                  soundEngine.playRelayClick();
                  setActiveCamId(cam.id);
                }}
                className={`cctv-cam-card ${isSelected ? 'selected' : ''}`}
              >
                {/* Video Stage Frame */}
                <div className={`cctv-viewport-screen ${filterMode.toLowerCase()}`}>
                  {/* Scanline Grid */}
                  <div className="cctv-scanline-overlay" />

                  {/* Top Feed OSD */}
                  <div className="cctv-osd-top">
                    <span className="cctv-osd-id font-mono">{cam.id} • {cam.tag}</span>
                    <span className="cctv-osd-time font-mono">1080p 60FPS</span>
                  </div>

                  {/* Visual Scene Simulation Graphics */}
                  <div className="cctv-scene-graphic">
                    {cam.feedType === 'STATION_PLATFORM' && (
                      <div className="cctv-scene-platform">
                        <div className="ai-bounding-box box-1">
                          <span className="box-tag font-mono">PERSON #104 [SAFE]</span>
                        </div>
                        <div className="ai-bounding-box box-2">
                          <span className="box-tag font-mono">TRAIN #22436 [DOCKED]</span>
                        </div>
                        <div className="track-guidelines" />
                      </div>
                    )}

                    {cam.feedType === 'TRACK_CROSSING' && (
                      <div className="cctv-scene-crossing">
                        <div className="ai-diamond-grid" />
                        <div className="ai-bounding-box box-crossing">
                          <span className="box-tag font-mono">TURNOUT 102A [LOCKED]</span>
                        </div>
                      </div>
                    )}

                    {cam.feedType === 'CATENARY_DRONE' && (
                      <div className="cctv-scene-drone">
                        <div className="drone-crosshair" />
                        <div className="thermal-wire-glow" />
                        <span className="drone-alt-tag font-mono">ALT: 18.4m • PANTOGRAPH #1</span>
                      </div>
                    )}

                    {cam.feedType === 'ROLLING_STOCK' && (
                      <div className="cctv-scene-wild">
                        <div className="wheel-thermal-target" />
                        <span className="wild-tag font-mono">AXLE #8 • 34.5°C [NORMAL]</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom AI Status Bar */}
                  <div className="cctv-osd-bottom">
                    <span className="cctv-ai-status-txt font-mono">{cam.aiStatus}</span>
                  </div>
                </div>

                {/* Card Title & Desc */}
                <div className="cctv-card-info">
                  <div className="flex items-center justify-between">
                    <span className="cctv-title-txt">{cam.title}</span>
                    <span className="cctv-badge-pill">{cam.tag}</span>
                  </div>
                  <p className="cctv-desc-txt">{cam.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="cctv-modal-footer">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Computer Vision Feed • 0 Hazards Detected Across 35.0 km Quad-Track Corridor</span>
          </div>
          <span className="font-mono text-slate-400">CRIS Video Analytics Standard v2.4</span>
        </div>
      </div>
    </div>
  );
};

export default CCTVMonitoringModal;
