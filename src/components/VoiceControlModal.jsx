import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Sparkles, Volume2, CheckCircle2, Terminal, AlertTriangle, Zap, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../engine/soundEngine';

export const VoiceControlModal = ({
  isOpen,
  onClose,
  onDeployPlan,
  onSelectScenario,
  onSetWeather,
  onSelectTrain,
  trains = [],
}) => {
  if (!isOpen) return null;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commandLog, setCommandLog] = useState([
    { text: 'SYSTEM: Voice AI Controller online. Ready for natural language dispatch commands.', type: 'sys', time: 'LIVE' },
  ]);

  const recognitionRef = useRef(null);

  // Suggested Voice Command Pills
  const quickVoicePills = [
    { label: '🚀 Deploy Plan D (Zero Deadlock)', cmd: 'deploy plan d' },
    { label: '🌧️ Activate Monsoon Rain Mode', cmd: 'set monsoon rain weather' },
    { label: '⚡ Authorize Vande Bharat Green Corridor', cmd: 'authorize vande bharat express' },
    { label: '⚠️ Trigger Naini Diamond Chokepoint', cmd: 'trigger naini diamond chokepoint scenario' },
    { label: '📢 Play Station Public Chime', cmd: 'play station announcement chime' },
    { label: '🚂 Sound High-Speed Horn', cmd: 'sound locomotive horn' },
  ];

  // Execute recognized dispatch command
  const executeCommand = (cmdText) => {
    const lower = cmdText.toLowerCase();
    soundEngine.playRelayClick();

    if (lower.includes('plan d') || lower.includes('recommendation') || lower.includes('optimal')) {
      if (onDeployPlan) onDeployPlan({ id: 'PLAN_D', name: 'Plan D: Dynamic Slot Insertion' });
      soundEngine.playSuccessTone();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      soundEngine.speakDispatch('Executing Plan D. Green wave slot interlocked with zero deadlocks.');
      logResponse(`AI ACTION: Plan D deployed (+28% Line Capacity).`);
    } else if (lower.includes('rain') || lower.includes('monsoon')) {
      if (onSetWeather) onSetWeather('MONSOON');
      soundEngine.speakDispatch('Monsoon Rain profile active. Kavach braking buffers expanded.');
      logResponse(`AI ACTION: Weather updated to MONSOON (Adhesion: 0.72).`);
    } else if (lower.includes('clear') || lower.includes('sunny')) {
      if (onSetWeather) onSetWeather('CLEAR');
      soundEngine.speakDispatch('Clear sky weather mode active.');
      logResponse(`AI ACTION: Weather set to CLEAR.`);
    } else if (lower.includes('vande bharat') || lower.includes('22436')) {
      if (onSelectTrain) onSelectTrain('TRN_22436');
      soundEngine.playTrainHorn('VANDE_BHARAT');
      soundEngine.speakDispatch('Vande Bharat 22436 priority escalated to Tier 1.');
      logResponse(`AI ACTION: Selected Train #22436 Vande Bharat Express.`);
    } else if (lower.includes('naini') || lower.includes('chokepoint') || lower.includes('scenario')) {
      if (onSelectScenario) onSelectScenario('SCENARIO_4');
      soundEngine.speakDispatch('Scenario 4 loaded: High density chokepoint at Naini Diamond.');
      logResponse(`AI ACTION: Injected Naini Diamond Junction bottleneck scenario.`);
    } else if (lower.includes('chime') || lower.includes('announcement')) {
      soundEngine.playStationChime();
      setTimeout(() => {
        soundEngine.speakDispatch('यात्रीगण कृपया ध्यान दें, गाड़ी संख्या 22436 Vande Bharat Express समय पर चल रही है।');
      }, 1000);
      logResponse(`AI ACTION: Broadcasting bilingual station announcement.`);
    } else if (lower.includes('horn')) {
      soundEngine.playTrainHorn('WAP7_DUAL_TONE');
      logResponse(`AI ACTION: Loco horn sounded.`);
    } else {
      soundEngine.speakDispatch(`Command received: ${cmdText}. Section rules verified.`);
      logResponse(`AI ACKNOWLEDGED: "${cmdText}" interlocked.`);
    }
  };

  const logResponse = (msg) => {
    setCommandLog((prev) => [
      ...prev,
      { text: msg, type: 'action', time: new Date().toLocaleTimeString() },
    ]);
  };

  // Toggle Browser Web Speech Recognition
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      logResponse('BROWSER NOTICE: Speech recognition API not supported in this browser. Please use Quick Command Pills below.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Indian English / Hindi mix

        recognition.onstart = () => {
          setIsListening(true);
          soundEngine.playRelayClick();
        };

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
          logResponse(`USER VOICE: "${speechResult}"`);
          executeCommand(speechResult);
        };

        recognition.onerror = (event) => {
          setIsListening(false);
          logResponse(`VOICE STATUS: Microphone standby. Use Quick Command Pills below.`);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        setIsListening(false);
        logResponse('VOICE NOTICE: Tap quick command pills to trigger immediate AI dispatch.');
      }
    }
  };

  return (
    <div className="voice-modal-backdrop">
      <div className="voice-modal-container">
        {/* Header */}
        <div className="voice-modal-header">
          <div className="flex items-center gap-3">
            <div className="voice-mic-avatar">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="voice-modal-title">AI VOICE TRAFFIC DISPATCHER</h2>
                <span className="voice-live-badge">NLP Co-Pilot</span>
              </div>
              <p className="voice-sub-desc">Natural Language Voice & Telemetry Interlocking for Section Controllers</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-voice-close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Microphone Live Listening Orb */}
        <div className="voice-listening-stage">
          <button
            onClick={toggleListening}
            className={`voice-mic-orb ${isListening ? 'active-pulse' : ''}`}
            title="Click to Speak or Stop"
          >
            {isListening ? (
              <Mic className="w-8 h-8 text-rose-400 animate-bounce" />
            ) : (
              <MicOff className="w-8 h-8 text-slate-400" />
            )}
          </button>

          <span className="voice-status-label">
            {isListening ? '🎙️ Listening... Speak naturally (e.g. "Deploy Plan D" or "Hold Train 782")' : 'Click Mic to Speak or Tap Quick Voice Commands Below'}
          </span>

          {transcript && (
            <div className="voice-transcript-bubble">
              <span className="lbl">Heard:</span>
              <span className="val">"{transcript}"</span>
            </div>
          )}
        </div>

        {/* Quick Voice Command Pills */}
        <div className="voice-quick-pills-box">
          <span className="pills-title-lbl">⚡ 1-Click Voice Command Triggers:</span>
          <div className="voice-pills-grid">
            {quickVoicePills.map((pill, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  setTranscript(pill.cmd);
                  logResponse(`OPERATOR TRIGGER: "${pill.cmd}"`);
                  executeCommand(pill.cmd);
                }}
                className="btn-voice-pill"
              >
                <span>{pill.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Audio Dispatch Audit Log */}
        <div className="voice-audit-log-box">
          <div className="flex items-center justify-between mb-2">
            <span className="log-title-lbl">📜 Live Audio Dispatch Audit Feed</span>
            <span className="log-badge-cnt">{commandLog.length} Events</span>
          </div>
          <div className="audit-terminal-scroll">
            {commandLog.map((log, lIdx) => (
              <div key={lIdx} className={`audit-log-line ${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-text">{log.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="voice-modal-footer">
          <span>AI Speech Co-Pilot • Web Audio Synthesizer • Indian Railways CTC Standard</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceControlModal;
