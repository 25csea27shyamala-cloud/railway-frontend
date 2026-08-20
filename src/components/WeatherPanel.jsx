import React from 'react';
import { Sun, Moon, CloudRain, CloudFog, Sparkles } from 'lucide-react';

export const WeatherPanel = ({
  timeHours,
  setTimeHours,
  weather,
  setWeather,
}) => {
  return (
    <div className="weather-panel-card">
      <div className="panel-title-row">
        <div className="title-left">
          <Sun className="w-4 h-4 text-amber-400" />
          <h3 className="panel-title">ATMOSPHERIC & CELESTIAL CONTROL DOME</h3>
        </div>
        <span className="live-clock-badge">
          <Sparkles className="w-3 h-3 text-sky-300" />
          <span>Orbital Simulation Active</span>
        </span>
      </div>

      <div className="controls-row">
        {/* Time of Day Scrub Slider */}
        <div className="time-scrub-box">
          <div className="scrub-header">
            <span>Celestial Hour:</span>
            <strong>{String(Math.floor(timeHours)).padStart(2, '0')}:{String(Math.floor((timeHours % 1) * 60)).padStart(2, '0')} IST</strong>
          </div>
          <div className="slider-track">
            <Sun className="w-4 h-4 text-amber-400" />
            <input
              type="range"
              min="0"
              max="24"
              step="0.1"
              value={timeHours}
              onChange={(e) => setTimeHours(Number(e.target.value))}
              className="celestial-range"
            />
            <Moon className="w-4 h-4 text-cyan-300" />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="presets-box">
          <button onClick={() => setTimeHours(6.2)} className="preset-btn dawn">Dawn (06:00)</button>
          <button onClick={() => setTimeHours(12.0)} className="preset-btn noon">Noon (12:00)</button>
          <button onClick={() => setTimeHours(18.0)} className="preset-btn dusk">Dusk (18:00)</button>
          <button onClick={() => setTimeHours(22.5)} className="preset-btn night">Night (22:30)</button>
        </div>

        {/* Weather Selector */}
        <div className="weather-select-box">
          <label>Atmosphere:</label>
          <select
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
            className="weather-select"
          >
            <option value="CLEAR">☀️ Clear Day/Night</option>
            <option value="MONSOON">🌧️ Monsoon Rain (Adhesion 0.72)</option>
            <option value="FOG_NORTH_INDIAN">🌫️ Dense Winter Fog Mode</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default WeatherPanel;
