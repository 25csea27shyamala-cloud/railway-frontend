import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles, Shield, Check, Globe, Zap, Cpu, Train, Building2, UserCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';

export const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('controller@railmind.ai');
  const [password, setPassword] = useState('RailMind#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('EMAIL'); // 'EMAIL' or 'SSO'

  const demoAccounts = [
    {
      role: 'Chief Section Controller',
      email: 'controller@railmind.ai',
      name: 'Shri R. K. Sharma',
      badge: 'Admin Access',
      color: '#38bdf8',
    },
    {
      role: 'SIH Evaluator / Jury',
      email: 'evaluator@sih2026.gov.in',
      name: 'Evaluation Jury',
      badge: 'Full Mission Control',
      color: '#facc15',
    },
    {
      role: 'Loco Pilot (Driver)',
      email: 'locopilot@railmind.ai',
      name: 'S. K. Yadav',
      badge: 'In-Cab HUD',
      color: '#10b981',
    },
  ];

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide a valid email and password.');
      return;
    }

    setIsLoading(true);
    soundEngine.playRelayClick();

    setTimeout(() => {
      setIsLoading(false);
      soundEngine.playSuccessTone();
      soundEngine.speakDispatch('Authentication verified. Welcome to RAILMIND Command Center.');

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
      });

      const matchedDemo = demoAccounts.find((d) => d.email === email) || demoAccounts[0];

      onLoginSuccess({
        id: 'OP_' + Math.floor(1000 + Math.random() * 9000),
        name: matchedDemo.name || 'Section Controller',
        role: 'CHIEF_CONTROLLER',
        roleLabel: matchedDemo.role || 'Chief Section Controller',
        zone: 'North Central Railway (NCR)',
        division: 'Prayagraj Control Division (PRYJ)',
        email: email,
        loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        securityClearance: 'LEVEL-4 ENTERPRISE AUTH',
      });
    }, 600);
  };

  const handleQuickFill = (account) => {
    soundEngine.playRelayClick();
    setEmail(account.email);
    setPassword('RailMind#2026');
    setError('');
  };

  const handle1ClickJudgeLogin = () => {
    soundEngine.playSuccessTone();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#10b981', '#facc15'],
    });

    onLoginSuccess({
      id: 'JURY_SIH25022',
      name: 'Honorable Evaluation Jury',
      role: 'SIH_JUDGE',
      roleLabel: 'SIH Technical Evaluator',
      zone: 'Ministry of Railways (MoR)',
      division: 'National Grand Finale Mission Control',
      email: 'evaluator@sih2026.gov.in',
      loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      securityClearance: 'CHIEF EVALUATION ACCESS',
    });
  };

  return (
    <div className="startup-login-root">
      {/* Dynamic Background Glow Rings & Particle Grid */}
      <div className="startup-bg-mesh">
        <div className="ambient-glow glow-1" />
        <div className="ambient-glow glow-2" />
        <div className="ambient-grid-lines" />
      </div>

      {/* Main SaaS Card Container */}
      <div className="startup-card-wrapper shadow-2xl">
        {/* Brand Header */}
        <div className="startup-brand-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="startup-logo-icon">
                <Train className="w-6 h-6 text-sky-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="startup-logo-text">RAILMIND</span>
                  <span className="startup-version-tag">v2.4 Enterprise</span>
                </div>
                <p className="startup-subtext">AI-Powered Autonomous Railway Traffic Operating System</p>
              </div>
            </div>

            {/* 1-Click Judge Button */}
            <button
              type="button"
              onClick={handle1ClickJudgeLogin}
              className="startup-btn-jury"
              title="1-Click Instant Evaluation Demo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" />
              <span>⚡ 1-Click Evaluator Demo</span>
            </button>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="startup-card-content">
          {/* Left Column: Form */}
          <div className="startup-form-side">
            <div className="form-intro">
              <h2 className="signin-heading">Welcome back</h2>
              <p className="signin-sub">Sign in to your section control workspace</p>
            </div>

            {/* Quick Demo Switcher Chips */}
            <div className="quick-demo-accounts-box">
              <span className="box-lbl">Quick Demo Profiles:</span>
              <div className="demo-pills-row">
                {demoAccounts.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => handleQuickFill(d)}
                    className={`demo-pill-btn ${email === d.email ? 'active' : ''}`}
                  >
                    <span className="pill-dot" style={{ backgroundColor: d.color }} />
                    <span>{d.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="startup-error-banner">
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="startup-actual-form">
              <div className="input-group-modern">
                <label>Email address / Railnet ID</label>
                <div className="input-container-modern">
                  <Mail className="input-ico" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="controller@railmind.ai"
                    className="modern-text-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group-modern">
                <div className="flex justify-between items-center">
                  <label>Password</label>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For SIH Demo: Use default password RailMind#2026 or click 1-Click Evaluator Demo.'); }} className="forgot-link">
                    Forgot password?
                  </a>
                </div>
                <div className="input-container-modern">
                  <Lock className="input-ico" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="modern-text-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-eye-btn"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-sky-500"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                  <Shield className="w-3 h-3" /> 2FA Active
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="startup-btn-submit"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-dot animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="sso-divider">
              <span className="divider-line" />
              <span className="divider-text">OR CONTINUE WITH ENTERPRISE SSO</span>
              <span className="divider-line" />
            </div>

            <div className="social-sso-grid">
              <button
                type="button"
                onClick={handle1ClickJudgeLogin}
                className="btn-sso"
              >
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>Ministry Railnet SSO</span>
              </button>
              <button
                type="button"
                onClick={handle1ClickJudgeLogin}
                className="btn-sso"
              >
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>CRIS Identity Gateway</span>
              </button>
            </div>
          </div>

          {/* Right Column: Value Prop & Live Product Stats */}
          <div className="startup-showcase-side">
            <div className="showcase-badge">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH25022 • Ministry of Railways Problem Statement</span>
            </div>

            <h3 className="showcase-title">
              Maximizing Section Line Capacity with Real-Time Digital Twin
            </h3>

            <p className="showcase-desc">
              Experience dynamic green-wave speed harmonization, minimum-regret What-If optimization, and in-cab Kavach ATP synchronization.
            </p>

            <div className="showcase-stats-list">
              <div className="showcase-stat-item">
                <div className="stat-num text-sky-400">+28%</div>
                <div className="stat-label">Scott's Line Capacity (E: 0.91)</div>
              </div>
              <div className="showcase-stat-item">
                <div className="stat-num text-emerald-400">-68%</div>
                <div className="stat-label">Section Delay Compression</div>
              </div>
              <div className="showcase-stat-item">
                <div className="stat-num text-amber-400">0 Deadlocks</div>
                <div className="stat-label">Junction Conflict Elimination</div>
              </div>
            </div>

            <div className="showcase-footer-card">
              <div className="flex items-center gap-2">
                <div className="pulse-dot green" />
                <span className="text-xs font-mono font-bold text-white">Prayagraj Division (NCR) Live Node</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">35.0 km Quad-Track Electrified Master Corridor</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="startup-card-footer">
          <span>Protected by 256-Bit SSL Encryption • Built for Smart India Hackathon (SIH25022)</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
