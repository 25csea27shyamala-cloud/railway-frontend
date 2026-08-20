import React, { useState } from 'react';
import { Calculator, Sparkles } from 'lucide-react';

export const ROICalculatorModal = () => {
  const [selectedZone, setSelectedZone] = useState('NCR_PRYJ');
  const [sectionKm, setSectionKm] = useState(120);
  const [trainsPerDay, setTrainsPerDay] = useState(160);
  const [freightRatioPercent, setFreightRatioPercent] = useState(55);

  const extraPathsPerDay = Math.round(trainsPerDay * 0.24);
  const freightPathsPerDay = Math.round(extraPathsPerDay * (freightRatioPercent / 100));
  
  const annualFreightRevenueCr = Number(((freightPathsPerDay * 2.2 * 365) / 100).toFixed(1));
  const annualEnergySavedCr = Number(((trainsPerDay * 2450 * 365) / 10000000).toFixed(2));
  const equivalentCapexAvoidedCr = Math.round(sectionKm * 18 * 0.5);

  const totalAnnualSavingsCr = Number((annualFreightRevenueCr + annualEnergySavedCr + 12.5).toFixed(1));

  return (
    <div className="roi-container">
      <div className="roi-header">
        <div className="title-left">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <h3 className="roi-title">INDIAN RAILWAYS ZONAL DIVISION ROI & ECONOMIC ENGINE</h3>
        </div>
        <span className="badge-sih">STARTUP BUSINESS MODEL & IMPACT</span>
      </div>

      <div className="roi-inputs-grid">
        <div className="input-box">
          <label>Target Railway Division:</label>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="roi-select"
          >
            <option value="NCR_PRYJ">North Central (Prayagraj Div)</option>
            <option value="NR_DLI">Northern Railway (Delhi Div)</option>
            <option value="ECR_DDU">East Central (Pt. DDU Div)</option>
            <option value="WR_BRC">Western Railway (Vadodara Div)</option>
            <option value="SCR_BZA">South Central (Vijayawada Div)</option>
          </select>
        </div>

        <div className="input-box">
          <div className="slider-head">
            <span>Corridor Length:</span>
            <strong>{sectionKm} KM</strong>
          </div>
          <input
            type="range"
            min="40"
            max="300"
            step="10"
            value={sectionKm}
            onChange={(e) => setSectionKm(Number(e.target.value))}
            className="roi-slider blue"
          />
        </div>

        <div className="input-box">
          <div className="slider-head">
            <span>Daily Train Density:</span>
            <strong>{trainsPerDay} Trains/Day</strong>
          </div>
          <input
            type="range"
            min="60"
            max="280"
            step="10"
            value={trainsPerDay}
            onChange={(e) => setTrainsPerDay(Number(e.target.value))}
            className="roi-slider green"
          />
        </div>

        <div className="input-box">
          <div className="slider-head">
            <span>Freight Share:</span>
            <strong>{freightRatioPercent}%</strong>
          </div>
          <input
            type="range"
            min="20"
            max="80"
            step="5"
            value={freightRatioPercent}
            onChange={(e) => setFreightRatioPercent(Number(e.target.value))}
            className="roi-slider amber"
          />
        </div>
      </div>

      <div className="roi-cards-grid">
        <div className="roi-stat-card">
          <span className="lbl">Extra Line Capacity Created</span>
          <div className="val-row">
            <span className="val text-green">+{extraPathsPerDay}</span>
            <span className="unit">Slots / Day</span>
          </div>
          <span className="sub-txt">No land acquisition or civil track laying needed</span>
        </div>

        <div className="roi-stat-card">
          <span className="lbl">Annual Freight Revenue Surge</span>
          <div className="val-row">
            <span className="val text-blue">₹ {annualFreightRevenueCr}</span>
            <span className="unit">Cr / Year</span>
          </div>
          <span className="sub-txt">From {freightPathsPerDay} additional freight slots / day</span>
        </div>

        <div className="roi-stat-card">
          <span className="lbl">Traction Power & Demurrage Saved</span>
          <div className="val-row">
            <span className="val text-amber">₹ {annualEnergySavedCr}</span>
            <span className="unit">Cr / Year</span>
          </div>
          <span className="sub-txt">Zero unnecessary phantom braking stops</span>
        </div>

        <div className="roi-stat-card">
          <span className="lbl">Equivalent Capex Avoided</span>
          <div className="val-row">
            <span className="val text-purple">₹ {equivalentCapexAvoidedCr}</span>
            <span className="unit">Crores</span>
          </div>
          <span className="sub-txt">Equivalent to constructing a 3rd line</span>
        </div>
      </div>

      <div className="roi-banner">
        <div>
          <div className="banner-title-row">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h4>TOTAL ESTIMATED ANNUAL VALUE CREATION PER DIVISION:</h4>
          </div>
          <p className="banner-sub">
            For {selectedZone.replace('_', ' ')}: Generates <strong>₹ {totalAnnualSavingsCr} Crores / year</strong> in added freight realization and operational savings.
          </p>
        </div>

        <div className="banner-right">
          <span className="huge-num">₹ {totalAnnualSavingsCr} Cr</span>
          <span className="unit-label">Annual Recurring Value</span>
        </div>
      </div>
    </div>
  );
};

export default ROICalculatorModal;
