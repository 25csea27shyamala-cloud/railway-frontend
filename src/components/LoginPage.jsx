import React, { useState } from 'react';
import { Shield, Lock, User, KeyRound, Sparkles, CheckCircle2, ArrowRight, Eye, EyeOff, Radio, Train, Cpu, ShieldCheck, Zap, Globe, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';

export const LoginPage = ({ onLoginSuccess }) => {
  const [role, setRole] = useState('CHIEF_CONTROLLER');
  const [username, setUsername] = useState('controller.pryj@railnet.gov.in');
  const [password, setPassword] = useState('RailMind#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('849201');
  const [useOtp, setUseOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'CHIEF_CONTROLLER',
      title: 'Chief Section Controller',
      icon: '👑',
      badge: 'Full Interlock Authority',
      desc: 'Controls mainline routes, dynamic speeds & conflict resolution',
      defaultEmail: 'controller.pryj@railnet.gov.in',
      name: 'Shri R. K. Sharma',
      zone: 'North Central Railway (NCR)',
      division: 'Prayagraj Control Office (PRYJ)',
    },
    {
      id: 'STATION_MASTER',
      title: 'Station Master / Yard Master',
      icon: '🏢',
      badge: 'Platform Interlocking',
      desc: 'Manages station platform dwells, loops & siding crossovers',
      defaultEmail: 'sm.naini@railnet.gov.in',
      name: 'A. K. Verma',
      zone: 'North Central Railway (NCR)',
      division: 'Naini Diamond Junction',
    },
    {
      id: 'LOCO_PILOT',
      title: 'Loco Pilot (Driver HUD)',
      icon: '🚂',
      badge: 'Kavach In-Cab Telemetry',
      desc: 'Accesses real-time target distance braking curve & throttle',
      defaultEmail: 'locopilot.vande@railnet.gov.in',
      name: 'S. K. Yadav (LP / PRYJ)',
      zone: 'Northern Railway',
      division: 'High-Speed Express Division',
    },
    {
      id: 'SIH_JUDGE',
      title: 'SIH Evaluator / Jury',
      icon: '⭐',
      badge: 'Evaluation Mission Control',
      desc: 'Instant full-access inspection of all 6 layers & ROI models',
      defaultEmail: 'evaluator.sih2026@gov.in',
      name: 'Honorable Evaluation Jury',
      zone: 'Ministry of Railways (MoR)',
      division: 'Smart India Hackathon 2026',
    },
  ];

  const handleRoleChange = (selectedRole) => {
    soundEngine.playRelayClick();
    setRole(selectedRole.id);
    setUsername(selectedRole.defaultEmail);
    setPassword('RailMind#2026');
    setError('');
  };

  const handleFormSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter your official Railnet ID and security password.');
      return;
    }

    setIsLoading(true);
    soundEngine.playRelayClick();

    setTimeout(() => {
      setIsLoading(false);
      soundEngine.playSuccessTone();

      const currentRoleObj = roles.find((r) => r.id === role) || roles[0];
      soundEngine.speakDispatch(`Access granted. Welcome, ${currentRoleObj.title}. Initializing Digital Twin.`);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#10b981', '#f59e0b', '#a855f7'],
      });

      onLoginSuccess({
        id: 'OP_' + Math.floor(1000 + Math.random() * 9000),
        name: currentRoleObj.name,
        role: currentRoleObj.id,
        roleLabel: currentRoleObj.title,
        zone: currentRoleObj.zone,
        division: currentRoleObj.division,
        email: username,
        loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        securityClearance: 'LEVEL-4 CRIS CERTIFIED',
      });
    }, 700);
  };

  const handleInstantJudgeLogin = () => {
    const judgeRole = roles.find((r) => r.id === 'SIH_JUDGE');
    handleRoleChange(judgeRole);
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
      email: 'evaluator.sih2026@gov.in',
      loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      securityClearance: 'CHIEF EVALUATION ACCESS',
    });
  };

  return (
    <div className="login-portal-root">
      {/* Background Animated Railway Glowing Network */}
      <div className="portal-bg-canvas">
        <div className="bg-gradient-orb top-left" />
        <div className="bg-gradient-orb bottom-right" />
        <div className="portal-rail-lines">
          <div className="portal-line line-1" />
          <div className="portal-line line-2" />
          <div className="portal-line line-3" />
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="login-master-card shadow-2xl">
        {/* Top Official Header */}
        <div className="portal-card-header">
          <div className="brand-badge-row">
            <div className="emblem-box">
              <Train className="w-6 h-6 text-sky-300" />
            </div>
            <div className="brand-text-col">
              <span className="gov-title">GOVERNMENT OF INDIA • MINISTRY OF RAILWAYS</span>
              <h1 className="system-title">RAILMIND AI COMMAND CENTER</h1>
              <span className="sih-tag">SIH25022 • REAL-TIME DIGITAL TWIN & MINIMUM-REGRET DECISION PORTAL</span>
            </div>
          </div>

          {/* 1-Click Instant Evaluator Demo Button */}
          <button
            type="button"
            onClick={handleInstantJudgeLogin}
            className="btn-instant-judge"
            title="Instant 1-Click Access for Evaluation Judges"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>⚡ 1-Click Evaluator Auto-Login</span>
          </button>
        </div>

        {/* Card Body */}
        <div className="portal-card-body">
          {/* Left Column: Role Selector Grid */}
          <div className="role-selector-column">
            <div className="column-title-row">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>SELECT OPERATIONAL DESK / ROLE:</span>
            </div>

            <div className="roles-grid">
              {roles.map((r) => {
                const isSelected = role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleRoleChange(r)}
                    className={`role-option-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="role-card-top">
                      <span className="role-icon">{r.icon}</span>
                      <span className="role-badge-tag">{r.badge}</span>
                    </div>
                    <h3 className="role-name">{r.title}</h3>
                    <p className="role-desc">{r.desc}</p>
                    <div className="role-footer-user">
                      <span>{r.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Security Feature Tags */}
            <div className="security-badges-row">
              <div className="sec-tag"><Shield className="w-3 h-3 text-emerald-400" /><span>256-Bit CRIS Encryption</span></div>
              <div className="sec-tag"><Cpu className="w-3 h-3 text-sky-400" /><span>Kavach 2.0 ATP Paired</span></div>
              <div className="sec-tag"><Globe className="w-3 h-3 text-purple-400" /><span>COA / TMS Synchronized</span></div>
            </div>
          </div>

          {/* Right Column: Authentication Form */}
          <div className="auth-form-column">
            <div className="form-column-header">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">CRIS SECTION CONTROLLER LOGIN</span>
            </div>

            {error && (
              <div className="auth-alert-box">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="portal-login-form">
              {/* Railnet Official ID */}
              <div className="portal-input-group">
                <label>OFFICIAL RAILNET ID / USERNAME:</label>
                <div className="input-box-wrapper">
                  <User className="input-icon-left" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="controller@railnet.gov.in"
                    className="portal-input"
                    required
                  />
                </div>
              </div>

              {/* Security Password */}
              <div className="portal-input-group">
                <label>SECURITY PASSCODE / CRIS TOKEN:</label>
                <div className="input-box-wrapper">
                  <KeyRound className="input-icon-left" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="portal-input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-toggle-eye"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 2FA Security Token Toggle */}
              <div className="two-factor-row">
                <label className="toggle-label" onClick={() => setUseOtp(!useOtp)}>
                  <input
                    type="checkbox"
                    checked={useOtp}
                    onChange={(e) => setUseOtp(e.target.checked)}
                  />
                  <span>Verify with 2FA Station Interlock Token (OTP)</span>
                </label>

                {useOtp && (
                  <div className="otp-input-row">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-Digit OTP"
                      maxLength={6}
                      className="portal-input otp"
                    />
                    <span className="otp-countdown">⏱️ Auto-Generated</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-portal-submit"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-orbit animate-spin" />
                    <span>Verifying CRIS Interlocking Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>AUTHORIZE & LAUNCH COMMAND CENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="form-footer-note">
              <span>Section 4: Prayagraj Division (NCR) • Interlocked with Northern & North Eastern Railway Grids</span>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="portal-card-footer">
          <span>MINISTRY OF RAILWAYS • CENTRE FOR RAILWAY INFORMATION SYSTEMS (CRIS) • SMART INDIA HACKATHON 2026</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
