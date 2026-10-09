import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Download,
  PhoneCall,
  Loader2
} from 'lucide-react';
import { AGENT_PROFILE } from '../data/cvData.ts';
import { audioService } from '../utils/audioPlayer.ts';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  audio?: string | null;
}

interface Props {
  selectedVoice: string;
  onOpenVoiceCall: () => void;
  onOpenCVModal: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const ChatAssistant: React.FC<Props> = ({
  selectedVoice,
  onOpenVoiceCall,
  onOpenCVModal,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: AGENT_PROFILE.scriptAtStart,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [autoVoiceReply, setAutoVoiceReply] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'fr-FR'; // User can switch or speak in French / English

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      rec.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }

    // Audio status subscriber
    audioService.subscribe((isSpeaking) => {
      if (!isSpeaking) {
        setPlayingMessageId(null);
      }
    });

    return () => {
      audioService.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle external prompt passed from CV buttons
  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      onClearInitialPrompt?.();
    }
  }, [initialPrompt]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      audioService.stop();
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Mic start error:', err);
      }
    }
  };

  const handlePlayAudio = async (msg: Message) => {
    if (playingMessageId === msg.id) {
      audioService.stop();
      setPlayingMessageId(null);
      return;
    }

    try {
      setPlayingMessageId(msg.id);
      if (msg.audio) {
        await audioService.playBase64Audio(msg.audio);
        setPlayingMessageId(null);
        return;
      }

      // Fetch on demand from /api/tts
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: msg.content,
          voiceName: selectedVoice,
        }),
      });

      const data = await res.json();
      if (data.audio) {
        msg.audio = data.audio; // Cache
        await audioService.playBase64Audio(data.audio);
      } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(msg.content);
        utterance.onend = () => setPlayingMessageId(null);
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Audio playback error:', err);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(msg.content);
        utterance.onend = () => setPlayingMessageId(null);
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setPlayingMessageId(null);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    audioService.stop();
    setPlayingMessageId(null);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          voiceResponse: autoVoiceReply,
          voiceName: selectedVoice,
        }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I encountered a slight communication error: ${data.error}. Please feel free to ask again or review Giulio's CV summary.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }

      const botMsgId = (Date.now() + 1).toString();
      const botMsg: Message = {
        id: botMsgId,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audio: data.audio || null,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Automatically speak the response if enabled
      if (autoVoiceReply && data.audio) {
        setPlayingMessageId(botMsgId);
        audioService.playBase64Audio(data.audio).then(() => {
          setPlayingMessageId(null);
        });
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            "I apologize, I'm having trouble connecting to the executive server. Giulio Pintus is actively seeking a 6-month corporate finance internship starting around March 20, 2026 in Paris. You can also download his complete CV summary directly below.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const resetChat = () => {
    audioService.stop();
    setPlayingMessageId(null);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: AGENT_PROFILE.scriptAtStart,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const samplePrompts = [
    'What internship is Giulio seeking?',
    'Tell me about his Corporate Finance background',
    'What are his language fluencies?',
    'What was his role at Century 21?',
    'What did he do as BDE Treasurer?',
    'How do I arrange an interview with Giulio?',
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{AGENT_PROFILE.name}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online & Ready
              </span>
            </div>
            <p className="text-xs text-slate-400">Giulio Pintus's Executive AI Career Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle voice response */}
          <button
            onClick={() => setAutoVoiceReply(!autoVoiceReply)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              autoVoiceReply
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400'
            }`}
            title="Auto-read replies with Gemini Voice"
          >
            {autoVoiceReply ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoVoiceReply ? 'Voice Replies On' : 'Voice Muted'}</span>
          </button>

          {/* Switch to Full Voice Call */}
          <button
            onClick={onOpenVoiceCall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Call Mode</span>
          </button>

          {/* Reset chat */}
          <button
            onClick={resetChat}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Restart conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          const isPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 text-xs font-bold mt-1">
                  A
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                  isBot
                    ? 'bg-slate-800/90 border border-slate-700 text-slate-100 rounded-tl-sm'
                    : 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-medium rounded-tr-sm'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                <div
                  className={`flex items-center justify-between gap-3 mt-2 pt-2 border-t text-[11px] ${
                    isBot ? 'border-slate-700/60 text-slate-400' : 'border-amber-700/30 text-amber-950/80'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isBot && (
                    <button
                      onClick={() => handlePlayAudio(msg)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
                        isPlaying
                          ? 'bg-amber-400/20 text-amber-300 font-semibold'
                          : 'hover:bg-slate-700 text-slate-300 hover:text-amber-300'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 text-xs font-bold mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0 text-xs font-bold mt-1">
              A
            </div>
            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2.5 text-xs text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Aria is reviewing Giulio's qualifications and preparing response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/50 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Suggested:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-slate-300 hover:text-white transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {recognitionSupported && (
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-xl border transition-all ${
                isRecording
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title={isRecording ? 'Stop microphone' : 'Speak via microphone'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aria anything about Giulio Pintus (e.g., finance background, internship dates, skills)..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-500 text-sm text-white px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-slate-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
