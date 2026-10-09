import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Volume2,
  VolumeX,
  Bot,
  RotateCcw,
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
      content: "Bonjour, je suis Aria, l'assistante exécutive de Giulio Pintus. Je suis à votre disposition pour vous détailler son parcours, sa mission de 6 mois chez Century 21 (conseil 360°, dossiers notariaux et intégration IA), ou organiser un échange direct. Comment puis-je vous renseigner ?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [autoVoiceReply, setAutoVoiceReply] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'fr-FR';

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
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
        console.error('Mic error:', err);
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
            content: `Désolée, une erreur est survenue : ${data.error}. N'hésitez pas à télécharger directement le CV complet.`,
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
          content: "Giulio Pintus poursuit actuellement son Master en Entrepreneuriat & Conseil à l'ESCE Paris après sa mission de 6 mois chez Century 21 Bruxelles. Vous pouvez joindre directement Giulio au +32 479 01 54 75.",
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
        content: "Bonjour, je suis Aria, l'assistante exécutive de Giulio Pintus. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const samplePrompts = [
    "Comment Giulio a-t-il déployé l'IA et les QR codes chez Century 21 ?",
    "Détaillez son accompagnement de A à Z avec les acheteurs et vendeurs",
    "Quels sont son numéro, son permis B et sa mobilité ?",
    "Présentez son Master à l'ESCE Paris et ses compétences financières",
  ];

  return (
    <div className="bg-white border border-[#E7E5E0] rounded-2xl shadow-xs flex flex-col h-[600px] overflow-hidden">
      {/* Sober Header */}
      <div className="px-5 py-3.5 border-b border-[#F0EFEB] bg-[#FAF9F6] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-800 text-xs font-semibold">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-900">{AGENT_PROFILE.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-[11px] text-stone-500">Assistante Exécutive &bull; Réponse immédiate</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoVoiceReply(!autoVoiceReply)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              autoVoiceReply
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
            title="Lecture audio automatique"
          >
            {autoVoiceReply ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3 text-stone-400" />}
            <span className="hidden sm:inline">{autoVoiceReply ? 'Audio activé' : 'Audio désactivé'}</span>
          </button>

          <button
            onClick={onOpenVoiceCall}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <PhoneCall className="w-3 h-3" />
            <span className="hidden sm:inline">Passer en vocal</span>
          </button>

          <button
            onClick={resetChat}
            className="p-1 rounded-lg bg-white hover:bg-stone-100 text-stone-500 border border-stone-200 transition-colors cursor-pointer"
            title="Réinitialiser la discussion"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-white">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          const isPlaying = playingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              {isBot && (
                <div className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0 text-xs font-medium mt-0.5">
                  A
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  isBot
                    ? 'bg-[#FAF9F6] border border-[#EBE8E1] text-stone-800 rounded-tl-xs'
                    : 'bg-stone-900 text-white rounded-tr-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`flex items-center justify-between gap-3 mt-2 pt-1.5 border-t text-[10px] ${
                    isBot ? 'border-[#EBE8E1] text-stone-400' : 'border-stone-800 text-stone-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isBot && (
                    <button
                      onClick={() => handlePlayAudio(msg)}
                      className="text-stone-500 hover:text-stone-800 font-medium cursor-pointer flex items-center gap-1"
                    >
                      {isPlaying ? (
                        <span className="text-stone-900 font-semibold">Lecture en cours...</span>
                      ) : (
                        <span>Écouter</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-stone-400 text-xs py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Aria rédige sa réponse...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Prompt Suggestions */}
      <div className="px-4 py-2 bg-[#FAF9F6] border-t border-[#F0EFEB] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] text-stone-400 font-medium shrink-0">Suggestions :</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-[#F0EFEB]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {recognitionRef.current && (
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isRecording
                  ? 'bg-red-500 text-white border-red-500 animate-pulse'
                  : 'bg-white hover:bg-stone-50 text-stone-600 border-stone-200'
              }`}
              title={isRecording ? 'Arrêter dictée' : 'Dicter votre question'}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question sur son parcours, Century 21, sa mobilité..."
            disabled={loading}
            className="flex-1 bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-400 transition-colors"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-200 text-white disabled:text-stone-400 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
