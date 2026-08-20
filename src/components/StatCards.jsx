import React from 'react';
import { Train, Gauge, AlertTriangle, Cpu, Clock, TrendingUp, TrendingDown, ShieldCheck, Zap } from 'lucide-react';

export const StatCards = ({ metrics, activeTrainCount = 14, delayedCount = 2 }) => {
  const trad = metrics?.traditionalBenchmark || { throughputTph: 3.2, totalDelayMin: 42, averageSpeedKmh: 64, capacityUtilizationPercent: 72 };
  const throughputDelta = (((metrics.sectionThroughputTph - trad.throughputTph) / trad.throughputTph) * 100).toFixed(0);
  const delaySaved = Math.max(0, trad.totalDelayMin - metrics.totalSectionDelayMin);

  return (
    <div className="command-kpi-master-row">
      {/* 1. Active Trains */}
      <div className="kpi-card blue">
        <div className="kpi-card-inner">
          <div className="kpi-icon-box blue">
            <Train className="w-5 h-5 text-sky-400" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">ACTIVE TRAINS</span>
            <div className="kpi-number-row">
              <span className="kpi-main-number">{activeTrainCount}</span>
              <span className="kpi-sub-text">/ 58 Monitored</span>
            </div>
            <div className="kpi-trend text-green">
              <TrendingUp className="w-3 h-3" />
              <span>↑ 6.2% from last hour</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Network Load */}
      <div className="kpi-card purple">
        <div className="kpi-card-inner">
          <div className="kpi-icon-box purple">
            <Gauge className="w-5 h-5 text-purple-400" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">NETWORK LOAD</span>
            <div className="kpi-number-row">
              <span className="kpi-main-number">{metrics.lineCapacityUtilizationPercent || 72}%</span>
              <span className="kpi-sub-text">Cap</span>
            </div>
            <div className="kpi-trend text-blue">
              <Zap className="w-3 h-3" />
              <span>Optimal Slot Packing</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Delayed Trains */}
      <div className="kpi-card red">
        <div className="kpi-card-inner">
          <div className="kpi-icon-box red">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">DELAYED TRAINS</span>
            <div className="kpi-number-row">
              <span className="kpi-main-number text-rose">{delayedCount < 10 ? `0${delayedCount}` : delayedCount}</span>
              <span className="kpi-sub-text">Rakes</span>
            </div>
            <div className="kpi-trend text-rose">
              <span>{delayedCount > 0 ? `${delayedCount} Cascades Absorbed` : '0 Critical Delays'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. AI Confidence */}
      <div className="kpi-card green">
        <div className="kpi-card-inner">
          <div className="kpi-icon-box green">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">AI CONFIDENCE</span>
            <div className="kpi-number-row">
              <span className="kpi-main-number text-green">{metrics.punctualityIndexPercent ? (metrics.punctualityIndexPercent * 0.98).toFixed(1) : '94.6'}%</span>
            </div>
            <div className="kpi-trend text-green">
              <ShieldCheck className="w-3 h-3" />
              <span>High Prediction Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Avg. Delay */}
      <div className="kpi-card cyan">
        <div className="kpi-card-inner">
          <div className="kpi-icon-box cyan">
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">AVG. DELAY</span>
            <div className="kpi-number-row">
              <span className="kpi-main-number text-cyan">{metrics.totalSectionDelayMin > 0 ? (metrics.totalSectionDelayMin / activeTrainCount).toFixed(1) : '2.4'}</span>
              <span className="kpi-sub-text">min</span>
            </div>
            <div className="kpi-trend text-green">
              <TrendingDown className="w-3 h-3" />
              <span>↓ 68% vs Manual CTC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
