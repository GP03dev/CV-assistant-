import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Download,
  AlertCircle
} from 'lucide-react';
import { AGENT_PROFILE } from '../data/cvData.ts';
import { audioService } from '../utils/audioPlayer.ts';
import { generateCVPdf } from '../utils/pdfGenerator.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedVoice: string;
}

export const VoiceCallModal: React.FC<Props> = ({ isOpen, onClose, selectedVoice }) => {
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [statusMessage, setStatusMessage] = useState('Initiating executive secure voice line...');

  const wsRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    startCall();

    return () => {
      cleanup();
    };
  }, [isOpen]);

  const cleanup = () => {
    audioService.stop();
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (_) {}
      wsRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsSpeaking(false);
    setIsUserTalking(false);
  };

  const startCall = async () => {
    setCallState('connecting');
    setStatusMessage('Connecting to Aria (Giulio’s Executive Voice Agent)...');

    // Initial greeting in history
    setTranscriptHistory([
      { role: 'assistant', text: AGENT_PROFILE.scriptAtStart },
    ]);

    // Connect to WebSocket /live if available, else standard interactive speech pipeline
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Live voice WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.audio) {
            setIsSpeaking(true);
            audioService.playBase64Audio(data.audio).then(() => {
              setIsSpeaking(false);
            });
          }
          if (data.text) {
            setCurrentTranscript(data.text);
            setTranscriptHistory((prev) => [...prev, { role: 'assistant', text: data.text }]);
          }
        } catch (_) {}
      };

      ws.onerror = (e) => {
        console.warn('Live WebSocket fallback to standard Voice Agent pipeline');
      };
    } catch (_) {
      // WebSocket fallback handled below
    }

    // Play the designated opening greeting script immediately
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: AGENT_PROFILE.scriptAtStart,
          voiceName: selectedVoice,
        }),
      });
      const ttsData = await res.json();
      setCallState('connected');
      setStatusMessage('Voice line connected • Aria is ready to speak');

      if (ttsData.audio) {
        setIsSpeaking(true);
        await audioService.playBase64Audio(ttsData.audio);
        setIsSpeaking(false);
      }
    } catch (e) {
      setCallState('connected');
      setStatusMessage('Voice line connected');
    }

    // Initialize microphone listening loop
    startVoiceRecognition();
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Microphone speech recognition not supported in this browser. Please use text questions below.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US'; // Supports international speech

    rec.onstart = () => {
      setIsUserTalking(false);
    };

    rec.onresult = async (event: any) => {
      const lastIndex = event.results.length - 1;
      const result = event.results[lastIndex];
      const text = result[0].transcript;

      if (!result.isFinal) {
        setIsUserTalking(true);
        setCurrentTranscript(`You: "${text}..."`);
      } else {
        setIsUserTalking(false);
        setCurrentTranscript('');
        await handleUserSpoke(text);
      }
    };

    rec.onerror = (event: any) => {
      if (event.error !== 'no-speech') {
        console.warn('Voice rec notice:', event.error);
      }
    };

    rec.onend = () => {
      // Keep listening if call is still active and not muted
      if (callState === 'connected' && !isMuted && isOpen) {
        try {
          rec.start();
        } catch (_) {}
      }
    };

    try {
      rec.start();
      recognitionRef.current = rec;
    } catch (err) {
      console.warn('Mic start failed:', err);
    }
  };

  const handleUserSpoke = async (spokenText: string) => {
    if (!spokenText.trim() || isMuted) return;

    audioService.stop();
    setIsSpeaking(false);

    setTranscriptHistory((prev) => [...prev, { role: 'user', text: spokenText }]);
    setStatusMessage('Aria is processing and preparing voice reply...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...transcriptHistory.map((t) => ({ role: t.role, content: t.text })),
            { role: 'user', content: spokenText },
          ],
          voiceResponse: true,
          voiceName: selectedVoice,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setTranscriptHistory((prev) => [...prev, { role: 'assistant', text: data.reply }]);
        setStatusMessage('Aria is speaking...');

        if (data.audio) {
          setIsSpeaking(true);
          await audioService.playBase64Audio(data.audio);
          setIsSpeaking(false);
          setStatusMessage('Listening to you...');
        } else {
          setStatusMessage('Listening to you...');
        }
      }
    } catch (err) {
      console.error('Call chat error:', err);
      setStatusMessage('Voice reply error. Please try again.');
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      try {
        recognitionRef.current?.start();
      } catch (_) {}
    } else {
      setIsMuted(true);
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      audioService.stop();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">{AGENT_PROFILE.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Gemini Live Voice
                </span>
              </div>
              <p className="text-xs text-slate-400">Giulio Pintus Executive Career Call</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download CV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Central Audio & Visualizer Display */}
        <div className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-950/80 to-slate-900 relative min-h-[260px]">
          {/* Animated Waveform / Pulse Indicator */}
          <div className="relative flex items-center justify-center mb-6">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? 'bg-amber-500/20 border-2 border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.4)] scale-110'
                  : isUserTalking
                  ? 'bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.3)] scale-105'
                  : 'bg-slate-800/80 border border-slate-700'
              }`}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-1.5 h-8">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-amber-400 rounded-full animate-pulse"
                      style={{
                        height: `${Math.sin(i * 1.5) * 16 + 20}px`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : isUserTalking ? (
                <div className="flex items-center gap-1.5 h-8">
                  {[...Array(6)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-emerald-400 rounded-full animate-bounce"
                      style={{
                        height: `${Math.cos(i * 1.2) * 14 + 18}px`,
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <Volume2 className="w-10 h-10 text-amber-400/80" />
              )}
            </div>

            {/* Ripple rings */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full border border-amber-400/30 animate-ping pointer-events-none" />
                <div className="absolute -inset-4 rounded-full border border-amber-500/20 animate-pulse pointer-events-none" />
              </>
            )}
          </div>

          {/* Status Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 mb-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSpeaking
                  ? 'bg-amber-400 animate-ping'
                  : isUserTalking
                  ? 'bg-emerald-400 animate-ping'
                  : 'bg-emerald-500'
              }`}
            />
            {statusMessage}
          </div>

          <p className="text-xs text-slate-400 max-w-md">
            Speak naturally into your microphone, or choose a prompt below. Aria is trained on
            Giulio's corporate finance background, Century 21 internship, and availability.
          </p>
        </div>

        {/* Live Subtitles & Transcript Box */}
        <div className="px-6 py-4 bg-slate-950/70 border-t border-b border-slate-800 max-h-48 overflow-y-auto space-y-3">
          {transcriptHistory.slice(-4).map((item, idx) => (
            <div
              key={idx}
              className={`text-xs flex gap-2 ${
                item.role === 'assistant' ? 'text-amber-200/90' : 'text-slate-300'
              }`}
            >
              <strong className="shrink-0 text-slate-400">
                {item.role === 'assistant' ? 'Aria:' : 'You:'}
              </strong>
              <span className="leading-relaxed">{item.text}</span>
            </div>
          ))}

          {currentTranscript && (
            <div className="text-xs text-slate-400 italic">
              {currentTranscript}
            </div>
          )}
        </div>

        {/* Spoken Prompt Shortcuts */}
        <div className="px-6 py-3 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-bold uppercase text-[10px] shrink-0">
            Ask aloud:
          </span>
          {[
            'What is Giulio looking for?',
            'Tell me about his ESCE finance degree',
            'What are his languages?',
            'What are his contact details?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleUserSpoke(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 border border-slate-700 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Call Controls */}
        <div className="p-6 bg-slate-950 flex items-center justify-center gap-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-2xl border transition-all ${
              isMuted
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-xl shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
            title="End voice conversation"
          >
            <PhoneOff className="w-6 h-6" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
