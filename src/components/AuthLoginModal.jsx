import React, { useState } from 'react';
import { X, Lock, User, Shield, KeyRound, CheckCircle2, AlertCircle, Sparkles, LogIn } from 'lucide-react';
import { soundEngine } from '../engine/soundEngine';

export const AuthLoginModal = ({ isOpen, onClose, currentUser, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('controller.pryj@railnet.gov.in');
  const [password, setPassword] = useState('RailMind#2026');
  const [role, setRole] = useState('CHIEF_CONTROLLER');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e) => {
    e?.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both Controller ID and Security Password.');
      return;
    }

    if (password.length < 4) {
      setError('Invalid password. Must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    soundEngine.playRelayClick();

    setTimeout(() => {
      setIsLoading(false);
      soundEngine.playSuccessTone();
      soundEngine.speakDispatch(`Operator Verified. Welcome, ${role.replace('_', ' ')}.`);

      onLoginSuccess({
        id: 'OP_' + Math.floor(1000 + Math.random() * 9000),
        name: role === 'CHIEF_CONTROLLER' ? 'Shri R. K. Sharma' : role === 'STATION_MASTER' ? 'A. K. Verma' : 'P. K. Singh',
        role: role,
        roleLabel: role.replace('_', ' '),
        zone: 'North Central Railway (NCR)',
        division: 'Prayagraj Control Office (PRYJ)',
        desk: 'Section 4 - Main Line & Junctions',
        email: username,
        loginTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        securityClearance: 'LEVEL-4 CRIS CERTIFIED',
      });
      onClose();
    }, 700);
  };

  const handleQuickDemo = (demoRole, demoUser) => {
    setRole(demoRole);
    setUsername(demoUser);
    setPassword('RailMind#2026');
    soundEngine.playRelayClick();
  };

  return (
    <div className="auth-modal-backdrop">
      <div className="auth-modal-container">
        {/* Header */}
        <div className="auth-modal-header">
          <div className="auth-title-col">
            <div className="auth-badge">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>MINISTRY OF RAILWAYS • CRIS & TMS AUTHENTICATION GATEWAY</span>
            </div>
            <h2 className="auth-title">Section Controller Access Verification</h2>
          </div>

          <button onClick={onClose} className="auth-btn-close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="auth-modal-body">
          {/* Quick Demo Pre-sets */}
          <div className="demo-credentials-banner">
            <div className="banner-head">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Demo Profiles (For SIH Evaluators):</span>
            </div>
            <div className="demo-chips-row">
              <button
                type="button"
                onClick={() => handleQuickDemo('CHIEF_CONTROLLER', 'controller.pryj@railnet.gov.in')}
                className={`chip-demo ${role === 'CHIEF_CONTROLLER' ? 'active' : ''}`}
              >
                👑 Chief Section Controller
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('STATION_MASTER', 'sm.naini@railnet.gov.in')}
                className={`chip-demo ${role === 'STATION_MASTER' ? 'active' : ''}`}
              >
                🏢 Naini Station Master
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('LOCO_INSPECTOR', 'inspector.loco@railnet.gov.in')}
                className={`chip-demo ${role === 'LOCO_INSPECTOR' ? 'active' : ''}`}
              >
                🚂 Chief Loco Inspector
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="auth-form">
            {error && (
              <div className="auth-error-box">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Select */}
            <div className="form-group">
              <label>Designated Operational Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="auth-input"
              >
                <option value="CHIEF_CONTROLLER">Chief Section Controller (Full CTC Interlock Authority)</option>
                <option value="DEPUTY_CONTROLLER">Deputy Controller (Punctuality & Freight Despatch)</option>
                <option value="STATION_MASTER">Station Master / Yard Interlocking Master</option>
                <option value="LOCO_INSPECTOR">Chief Loco Inspector (Kavach & In-Cab Telemetry)</option>
                <option value="AI_EVALUATOR">SIH Evaluation Judge (Read-Only Mission Control)</option>
              </select>
            </div>

            {/* Username / Official Railnet ID */}
            <div className="form-group">
              <label>Official Railnet ID / Email:</label>
              <div className="input-with-icon">
                <User className="input-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. controller.pryj@railnet.gov.in"
                  className="auth-input with-icon"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Security Password / Token:</label>
              <div className="input-with-icon">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security password"
                  className="auth-input with-icon"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-toggle-pwd"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Remember Me & 2FA Info */}
            <div className="auth-extras-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember Session on this CTC Terminal</span>
              </label>

              <span className="two-fa-tag">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>2FA Encrypted Token Active</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-auth-submit"
            >
              {isLoading ? (
                <>
                  <span className="spinner-dot animate-spin" />
                  <span>Verifying CRIS Interlocking Credentials...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authorize & Enter Command Center</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="auth-modal-footer">
          <span>Protected by Ministry of Railways CRIS Cyber Interlocking Protocols • 256-Bit SSL</span>
        </div>
      </div>
    </div>
  );
};

export default AuthLoginModal;
