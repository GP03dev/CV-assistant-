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
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

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
        msg.audio = data.audio;
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
            content: `I encountered a momentary issue: ${data.error}. Please feel free to ask again or review Giulio's CV summary.`,
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
            "I apologize, the connection to the executive server is temporarily unavailable. Giulio Pintus is currently pursuing his Master in Entrepreneurship and Consulting at ESCE Paris after successfully completing his 6-month mission at Century 21 Brussels. You can download his full CV directly below.",
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
    'How did Giulio implement AI at Century 21?',
    'What was his role with buyers and sellers from A to Z?',
    'Tell me about his Master in Entrepreneurship & Consulting',
    'What were his responsibilities as Student Council Treasurer?',
    'How does his financial and legal rigor make a difference?',
    'What are his language and international skills?',
  ];

  return (
    <div className="bg-white border border-[#E6DDD2] rounded-3xl shadow-xs flex flex-col h-[650px] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#EBE4D8] bg-[#FAF7F2] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-800 shadow-2xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900">{AGENT_PROFILE.name}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Online &bull; Ready
              </span>
            </div>
            <p className="text-xs text-stone-500">Giulio Pintus's Executive Career Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle voice response */}
          <button
            onClick={() => setAutoVoiceReply(!autoVoiceReply)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              autoVoiceReply
                ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
            title="Auto-play voice responses"
          >
            {autoVoiceReply ? <Volume2 className="w-3.5 h-3.5 text-amber-700" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            <span className="hidden sm:inline">{autoVoiceReply ? 'Voice Replies' : 'Silent Mode'}</span>
          </button>

          {/* Switch to Full Voice Call */}
          <button
            onClick={onOpenVoiceCall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Call</span>
          </button>

          {/* Reset chat */}
          <button
            onClick={resetChat}
            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 border border-stone-200 transition-colors cursor-pointer"
            title="Restart conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FCFBF9]">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          const isPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 text-xs font-bold mt-1">
                  A
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 shadow-2xs ${
                  isBot
                    ? 'bg-[#F5EFE6] border border-[#E7DDCE] text-stone-900 rounded-tl-sm'
                    : 'bg-amber-600 text-white font-medium rounded-tr-sm shadow-xs'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                <div
                  className={`flex items-center justify-between gap-3 mt-2 pt-2 border-t text-[11px] ${
                    isBot ? 'border-[#E6DDD0] text-stone-500' : 'border-amber-500/50 text-amber-100'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isBot && (
                    <button
                      onClick={() => handlePlayAudio(msg)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                          : 'hover:bg-[#EAE1D3] text-stone-700 hover:text-amber-900'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <div className="flex items-center gap-0.5 h-3">
                            <span className="w-0.5 bg-white rounded-full animate-wave-1 h-3" />
                            <span className="w-0.5 bg-white rounded-full animate-wave-2 h-2" />
                            <span className="w-0.5 bg-white rounded-full animate-wave-3 h-3" />
                          </div>
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-lg bg-amber-700 border border-amber-800 flex items-center justify-center text-white shrink-0 text-xs font-bold mt-1 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 text-xs font-bold mt-1">
              A
            </div>
            <div className="bg-[#F5EFE6] border border-[#E7DDCE] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2.5 text-xs text-stone-600 shadow-2xs">
              <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
              <span>Aria is formulating a precise, professional reply...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Inquiries */}
      <div className="px-4 py-2.5 border-t border-[#EBE4D8] bg-[#FAF7F2] overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-700" /> Suggestions:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="text-xs px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-[#DED4C5] text-stone-700 hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="p-4 border-t border-[#EBE4D8] bg-[#FAF7F2]">
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
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-100 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-white border-[#DED4C5] text-stone-700 hover:text-stone-900 hover:bg-stone-50 shadow-2xs'
              }`}
              title={isRecording ? 'Stop microphone' : 'Speak into microphone'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aria anything about Giulio (Century 21, AI, Master's, skills)..."
            className="flex-1 bg-white border border-[#DCD2C3] focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-sm text-stone-900 px-4 py-3 rounded-xl outline-none transition-colors placeholder:text-stone-400 shadow-2xs"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold transition-all shadow-md shadow-amber-600/20 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
