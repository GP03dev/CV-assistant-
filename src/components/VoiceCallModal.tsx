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
  const [statusMessage, setStatusMessage] = useState('Connecting to secure voice line...');

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
    setStatusMessage('Connecting to Aria (Giulio Pintus\'s Assistant)...');

    setTranscriptHistory([
      { role: 'assistant', text: AGENT_PROFILE.scriptAtStart },
    ]);

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

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

      ws.onerror = () => {
        console.warn('Fallback to standard audio conversation');
      };
    } catch (_) {}

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
      setStatusMessage('Voice line connected • Aria is listening');

      if (ttsData.audio) {
        setIsSpeaking(true);
        await audioService.playBase64Audio(ttsData.audio);
        setIsSpeaking(false);
      }
    } catch (e) {
      setCallState('connected');
      setStatusMessage('Voice line connected');
    }

    startVoiceRecognition();
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('Speech recognition not supported in this browser. Please use text inquiries below.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

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

    rec.onend = () => {
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
      console.warn('Mic start notice:', err);
    }
  };

  const handleUserSpoke = async (spokenText: string) => {
    if (!spokenText.trim() || isMuted) return;

    audioService.stop();
    setIsSpeaking(false);

    setTranscriptHistory((prev) => [...prev, { role: 'user', text: spokenText }]);
    setStatusMessage('Aria is thinking and preparing her spoken reply...');

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
          setStatusMessage('Aria is listening to you...');
        } else {
          setStatusMessage('Aria is listening to you...');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] border border-[#DDD3C4] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col relative text-stone-900">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#F5EFE6] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 font-bold">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-stone-900">{AGENT_PROFILE.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Direct Voice Line
                </span>
              </div>
              <p className="text-xs text-stone-500">Interview & Career Q&A with Giulio Pintus</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold border border-[#DDD3C4] transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>Download CV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-800 border border-[#DDD3C4] transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Central Audio & Visualizer Display */}
        <div className="p-8 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#F5EFE6] to-[#FAF7F2] relative min-h-[260px]">
          {/* Animated Waveform / Pulse Indicator */}
          <div className="relative flex items-center justify-center mb-6">
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                isSpeaking
                  ? 'bg-amber-100/90 border-2 border-amber-500 shadow-[0_0_40px_rgba(217,119,6,0.25)] scale-110'
                  : isUserTalking
                  ? 'bg-emerald-100/90 border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.25)] scale-105'
                  : 'bg-white border border-[#DDD3C4] shadow-xs'
              }`}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-1.5 h-10">
                  {[...Array(9)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-amber-600 to-amber-400 rounded-full animate-wave-1"
                      style={{
                        height: `${Math.sin(i * 0.8) * 22 + 16}px`,
                        animationDelay: `${(i % 5) * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : isUserTalking ? (
                <div className="flex items-center gap-1.5 h-10">
                  {[...Array(9)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-full animate-bounce"
                      style={{
                        height: `${Math.cos(i * 0.7) * 20 + 14}px`,
                        animationDelay: `${(i % 4) * 100}ms`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Volume2 className="w-9 h-9 text-amber-700 animate-pulse" />
                </div>
              )}
            </div>

            {/* Ripple rings */}
            {isSpeaking && (
              <>
                <div className="absolute inset-0 rounded-full border border-amber-400/50 animate-ping pointer-events-none" />
                <div className="absolute -inset-4 rounded-full border border-amber-300/30 animate-pulse pointer-events-none" />
              </>
            )}
          </div>

          {/* Status Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#DDD3C4] text-xs font-semibold text-stone-800 mb-2 shadow-2xs">
            <span
              className={`w-2 h-2 rounded-full ${
                isSpeaking
                  ? 'bg-amber-600 animate-ping'
                  : isUserTalking
                  ? 'bg-emerald-600 animate-ping'
                  : 'bg-emerald-600'
              }`}
            />
            {statusMessage}
          </div>

          <p className="text-xs text-stone-500 max-w-md leading-relaxed">
            Speak naturally into your microphone. Aria is trained on Giulio's Master's in Entrepreneurship, his 6-month Century 21 mission, and his AI implementation track record.
          </p>
        </div>

        {/* Live Subtitles & Transcript Box */}
        <div className="px-6 py-4 bg-white border-t border-b border-[#E8DFD3] max-h-48 overflow-y-auto space-y-3">
          {transcriptHistory.slice(-4).map((item, idx) => (
            <div
              key={idx}
              className={`text-xs flex gap-2 ${
                item.role === 'assistant' ? 'text-stone-800' : 'text-amber-900 font-medium'
              }`}
            >
              <strong className="shrink-0 text-stone-500">
                {item.role === 'assistant' ? 'Aria:' : 'You:'}
              </strong>
              <span className="leading-relaxed">{item.text}</span>
            </div>
          ))}

          {currentTranscript && (
            <div className="text-xs text-stone-400 italic">
              {currentTranscript}
            </div>
          )}
        </div>

        {/* Spoken Prompt Shortcuts */}
        <div className="px-6 py-3 bg-[#FAF7F2] flex items-center gap-2 overflow-x-auto text-xs border-b border-[#E8DFD3]">
          <span className="text-stone-500 font-bold uppercase text-[10px] shrink-0">
            Ask aloud:
          </span>
          {[
            'How did Giulio deploy AI at Century 21?',
            'How did he guide buyers and sellers?',
            'Tell me about his Master in Entrepreneurship',
            'What are his financial and legal strengths?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleUserSpoke(prompt)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 shrink-0 border border-[#DDD3C4] transition-colors shadow-2xs cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Bottom Call Controls */}
        <div className="p-6 bg-[#F5EFE6] flex items-center justify-center gap-6">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-2xs'
                : 'bg-white border-[#DDD3C4] text-stone-700 hover:bg-stone-50 shadow-2xs'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="End voice call"
          >
            <PhoneOff className="w-6 h-6" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
