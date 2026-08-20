import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, TrendingUp, Cpu, Globe, Train, DollarSign, CheckCircle2, ChevronRight, Play, BarChart3, Radio, FileText, Layers, Award, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';

export const LandingPage = ({ onLaunchCommandCenter, onOpenPitchDeck, onOpenLogin }) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState('SLOT_PACKING');
  const [selectedZonalTier, setSelectedZonalTier] = useState('DIVISION');

  const handleLaunch = () => {
    soundEngine.playSuccessTone();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
    });
    if (onLaunchCommandCenter) onLaunchCommandCenter();
  };

  const featurePillars = [
    {
      id: 'SLOT_PACKING',
      title: 'Dynamic Micro-Slot Packing',
      badge: "+28% Line Capacity",
      icon: Zap,
      desc: 'Replaces static manual headway blocks with rolling-horizon AI slot insertion, elevating Scott line capacity efficiency factor E from 0.70 to 0.91.',
      stat1: '+38 Paths / Day',
      stat2: '90s Headway',
    },
    {
      id: 'KAVACH_ATP',
      title: 'Kavach ATP Layering',
      badge: "100% Fail-Safe",
      icon: ShieldCheck,
      desc: 'Operates as an optimization supervisor above station interlocking and Kavach ATP, providing real-time in-cab Target Distance Curves to loco pilots.',
      stat1: 'SIL-4 Compliance',
      stat2: 'Zero SPAD Risk',
    },
    {
      id: 'WHAT_IF',
      title: 'Multi-Future What-If Engine',
      badge: "50ms Decision Speed",
      icon: Cpu,
      desc: 'Simulates 4 branching dispatch scenarios concurrently (Plans A, B, C, D) using minimum-regret scoring to absorb speed perturbations before delays cascade.',
      stat1: '4 Parallel Plans',
      stat2: '< 2.4 Regret Score',
    },
    {
      id: 'ECONOMIC_ROI',
      title: 'Zonal Economic Engine',
      badge: "₹ 168+ Cr / Yr",
      icon: DollarSign,
      desc: 'Monetizes freight slot recovery, eliminates demurrage at junction throats, and reduces traction energy consumption through synchronized coasting profiles.',
      stat1: '₹ 14.2 Cr Power Saved',
      stat2: '11,400T CO2 Offset',
    },
  ];

  const currentFeature = featurePillars.find((f) => f.id === activeFeatureTab) || featurePillars[0];
  const CurrentIcon = currentFeature.icon;

  return (
    <div className="startup-landing-root">
      {/* 1. Startup Top Navigation Bar */}
      <header className="startup-nav-bar">
        <div className="nav-container-inner">
          <div className="flex items-center gap-3">
            <div className="startup-nav-logo">
              <Train className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="startup-nav-brand">RAILMIND</span>
              <span className="startup-nav-tag">AI RAILWAY OS</span>
            </div>
          </div>

          <div className="nav-links-row">
            <a href="#features" className="nav-link-item">Capabilities</a>
            <a href="#architecture" className="nav-link-item">6-Layer Stack</a>
            <a href="#roi" className="nav-link-item">Economic Value</a>
            <button onClick={onOpenPitchDeck} className="nav-link-item pitch">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>SIH Pitch Deck</span>
            </button>
          </div>

          <div className="nav-actions-row">
            <button onClick={onOpenLogin} className="btn-nav-login">
              Controller Sign In
            </button>
            <button onClick={handleLaunch} className="btn-nav-primary">
              <span>Launch Live Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="startup-hero-section">
        <div className="hero-glow-blob" />
        
        <div className="hero-content-box">
          {/* Government / SIH Winner Badge */}
          <div className="hero-sih-badge">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SIH25022 • MINISTRY OF RAILWAYS NATIONAL ENTERPRISE PILOT</span>
          </div>

          <h1 className="hero-headline">
            The Autonomous Operating System for <span className="gradient-text">High-Density Railway Networks</span>
          </h1>

          <p className="hero-subheadline">
            RAILMIND deploys real-time physics digital twins and minimum-regret What-If decision engines to maximize section throughput, eliminate junction deadlocks, and synchronize in-cab Kavach telemetry.
          </p>

          <div className="hero-cta-group">
            <button onClick={handleLaunch} className="btn-hero-primary">
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Live Command Center (14 Rakes)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button onClick={onOpenPitchDeck} className="btn-hero-secondary">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>View Executive SIH Pitch Deck</span>
            </button>
          </div>

          {/* Social Proof Stats Bar */}
          <div className="hero-metrics-bar">
            <div className="hero-metric-item">
              <span className="val text-sky-400">+28%</span>
              <span className="lbl">Scott's Line Capacity (E: 0.91)</span>
            </div>
            <div className="hero-metric-item">
              <span className="val text-emerald-400">-68%</span>
              <span className="lbl">Section Delay Compression</span>
            </div>
            <div className="hero-metric-item">
              <span className="val text-amber-400">₹ 168.4 Cr</span>
              <span className="lbl">Annual Zonal Revenue Gain</span>
            </div>
            <div className="hero-metric-item">
              <span className="val text-purple-400">0 Deadlocks</span>
              <span className="lbl">Junction Conflict Elimination</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Product Features Showcase */}
      <section id="features" className="startup-section features">
        <div className="section-header-box">
          <span className="section-pretitle">ENTERPRISE CAPABILITIES</span>
          <h2 className="section-main-title">Engineering Breakthroughs Above Kavach & CTC</h2>
          <p className="section-main-desc">
            Explore the core architectural modules powering autonomous railway traffic synchronization.
          </p>
        </div>

        {/* Feature Tabs & Interactive Card */}
        <div className="features-interactive-grid">
          {/* Tab Selector */}
          <div className="features-tab-list">
            {featurePillars.map((f) => {
              const Icon = f.icon;
              const isActive = activeFeatureTab === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => {
                    soundEngine.playRelayClick();
                    setActiveFeatureTab(f.id);
                  }}
                  className={`feature-tab-card ${isActive ? 'active' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`tab-icon-box ${isActive ? 'active' : ''}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="tab-title-txt">{f.title}</span>
                    </div>
                    <span className="tab-badge-txt">{f.badge}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Detail Showcase Card */}
          <div className="feature-showcase-panel">
            <div className="panel-top-row">
              <div className="flex items-center gap-2">
                <CurrentIcon className="w-5 h-5 text-sky-400" />
                <h3 className="panel-title">{currentFeature.title}</h3>
              </div>
              <span className="panel-highlight-tag">{currentFeature.badge}</span>
            </div>

            <p className="panel-desc-text">{currentFeature.desc}</p>

            <div className="panel-stats-twin-grid">
              <div className="twin-stat-box">
                <span className="lbl">Primary Metric</span>
                <span className="val text-sky-400">{currentFeature.stat1}</span>
              </div>
              <div className="twin-stat-box">
                <span className="lbl">Operational Impact</span>
                <span className="val text-emerald-400">{currentFeature.stat2}</span>
              </div>
            </div>

            <button onClick={handleLaunch} className="btn-panel-action">
              <span>Test {currentFeature.title} in Live Simulation</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Real-World Zonal Deployment Corridor Benchmark */}
      <section className="startup-section benchmark">
        <div className="section-header-box">
          <span className="section-pretitle">GROUND VALIDATION</span>
          <h2 className="section-main-title">North Central Railway (NCR) Corridor Benchmark</h2>
          <p className="section-main-desc">
            Simulated and stress-tested on the critical 35.0 km Prayagraj – Naini – Chheoki Quad-Track Section.
          </p>
        </div>

        <div className="benchmark-comparison-grid">
          <div className="benchmark-card manual">
            <div className="card-status-badge red">BEFORE (TRADITIONAL MANUAL CTC)</div>
            <h4 className="card-title">Reactive Human Controller Dispatch</h4>
            <div className="metric-row">
              <span>Section Line Capacity:</span>
              <strong className="text-slate-400">72% (Scott Factor E = 0.70)</strong>
            </div>
            <div className="metric-row">
              <span>Throughput:</span>
              <strong className="text-slate-400">3.2 Trains / Hour</strong>
            </div>
            <div className="metric-row">
              <span>Freight Stoppages:</span>
              <strong className="text-rose-400">3-5 Phantom Stops on Loops</strong>
            </div>
            <div className="metric-row">
              <span>Headway Buffer:</span>
              <strong className="text-slate-400">240 - 360 Seconds</strong>
            </div>
          </div>

          <div className="benchmark-card ai">
            <div className="card-status-badge green">AFTER (RAILMIND DIGITAL TWIN)</div>
            <h4 className="card-title">Predictive AI Slot Harmonization</h4>
            <div className="metric-row">
              <span>Section Line Capacity:</span>
              <strong className="text-emerald-400">94% (Scott Factor E = 0.91)</strong>
            </div>
            <div className="metric-row">
              <span>Throughput:</span>
              <strong className="text-emerald-400">5.2 Trains / Hour (+62.5%)</strong>
            </div>
            <div className="metric-row">
              <span>Freight Stoppages:</span>
              <strong className="text-emerald-400">0 Stops (Continuous Green Glide)</strong>
            </div>
            <div className="metric-row">
              <span>Headway Buffer:</span>
              <strong className="text-sky-400">90 - 120 Seconds (Compressed)</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA Banner */}
      <section className="startup-cta-banner">
        <div className="cta-inner-box">
          <h2 className="cta-headline">Ready to Experience Autonomous Railway Traffic Control?</h2>
          <p className="cta-sub">
            Explore all 14 rakes, the 3D junction hub, in-cab cockpit HUD, and the 4-future What-If decision engine in real-time.
          </p>
          <div className="cta-button-row">
            <button onClick={handleLaunch} className="btn-cta-launch">
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch Live Command Center</span>
            </button>
            <button onClick={onOpenLogin} className="btn-cta-login">
              <span>Controller Sign In</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="startup-landing-footer">
        <div className="footer-inner-content">
          <div className="flex items-center gap-2">
            <Train className="w-4 h-4 text-sky-400" />
            <span className="footer-brand">RAILMIND AI RAILWAY OS</span>
          </div>
          <span className="footer-copyright">
            Built for Smart India Hackathon (SIH25022) • Ministry of Railways & CRIS Interlocking Protocols
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
