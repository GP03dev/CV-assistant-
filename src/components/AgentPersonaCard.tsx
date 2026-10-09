import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  PhoneCall,
  UserCheck,
  ShieldCheck,
  Mic,
  ArrowUpRight
} from 'lucide-react';
import { AGENT_PROFILE } from '../data/cvData.ts';
import { audioService } from '../utils/audioPlayer.ts';

interface Props {
  selectedVoice: string;
  onSelectVoice: (voice: string) => void;
  onOpenVoiceMode: () => void;
  onOpenCVModal: () => void;
}

export const AgentPersonaCard: React.FC<Props> = ({
  selectedVoice,
  onSelectVoice,
  onOpenVoiceMode,
  onOpenCVModal,
}) => {
  const [isPlayingGreeting, setIsPlayingGreeting] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const handlePlayGreeting = async () => {
    if (isPlayingGreeting) {
      audioService.stop();
      setIsPlayingGreeting(false);
      return;
    }

    try {
      setLoadingAudio(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: AGENT_PROFILE.scriptAtStart,
          voiceName: selectedVoice,
        }),
      });

      const data = await res.json();
      setLoadingAudio(false);

      if (data.audio) {
        setIsPlayingGreeting(true);
        await audioService.playBase64Audio(data.audio);
        setIsPlayingGreeting(false);
      } else {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(AGENT_PROFILE.scriptAtStart);
          utterance.onend = () => setIsPlayingGreeting(false);
          setIsPlayingGreeting(true);
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch (err) {
      console.error('Greeting audio error:', err);
      setLoadingAudio(false);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(AGENT_PROFILE.scriptAtStart);
        utterance.onend = () => setIsPlayingGreeting(false);
        setIsPlayingGreeting(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E6DDD2] p-6 sm:p-8 shadow-xs transition-all">
      {/* Soft warm ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-orange-100/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#EFE8DE]">
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Avatar with speaking wave rings */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 p-[1px] shadow-sm">
              <div className="w-full h-full bg-[#FCFBF8] rounded-[15px] flex items-center justify-center text-amber-800 font-extrabold text-2xl">
                A
              </div>
            </div>
            {/* Live Indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
              <span className="text-amber-800 font-bold tracking-wide">Official AI Assistant</span>
              <span aria-hidden="true">&bull;</span>
              <span>Grounded on Verified CV</span>
              <span aria-hidden="true">&bull;</span>
              <span className="text-emerald-700 font-semibold">Gemini Live & Speech</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-0.5">
              {AGENT_PROFILE.name}
              <span className="text-sm font-normal text-stone-500 ml-2.5">
                (Giulio Pintus's Executive Assistant)
              </span>
            </h2>
          </div>
        </div>

        {/* Primary CTA cluster */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onOpenVoiceMode}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Launch Voice Call (Live)</span>
          </button>

          <button
            onClick={onOpenCVModal}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#F5EFE6] hover:bg-[#EDE5DA] text-stone-800 font-semibold text-xs sm:text-sm transition-colors border border-[#E2D7C8] cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-amber-800" />
            <span>View Certified CV</span>
          </button>
        </div>
      </div>

      {/* Specification Row with Opening Script Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6 relative z-10">
        {/* Left Column: Opening Script Callout (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E8DFD3] rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Official Opening Script
              </span>

              {/* Audio Audition Button with Visual Waveform */}
              <button
                onClick={handlePlayGreeting}
                disabled={loadingAudio}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isPlayingGreeting
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white hover:bg-stone-50 text-stone-800 border border-[#DDD3C4]'
                }`}
                title="Listen to opening greeting"
              >
                {loadingAudio ? (
                  <span className="animate-spin text-xs">⏳</span>
                ) : isPlayingGreeting ? (
                  <>
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-1 bg-white rounded-full animate-wave-1 h-3" />
                      <span className="w-1 bg-white rounded-full animate-wave-2 h-2" />
                      <span className="w-1 bg-white rounded-full animate-wave-3 h-3" />
                    </div>
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Audition Aria's Voice</span>
                  </>
                )}
              </button>
            </div>

            <div className="font-serif-luxury text-base sm:text-lg italic text-stone-800 leading-relaxed pt-1">
              “{AGENT_PROFILE.scriptAtStart}”
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-4 pt-3 border-t border-[#E8DFD3]">
            Aria answers your questions in <strong>English</strong>, <strong>French</strong>, or <strong>Italian</strong> with a professional, polite, and confident executive tone.
          </p>
        </div>

        {/* Right Column: Agent Persona & Voice Select (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF7F2] border border-[#E8DFD3] rounded-2xl p-5 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Voice Selection & Personality
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-stone-600 block mb-1">
                  Gemini TTS Voice Model:
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => onSelectVoice(e.target.value)}
                  className="w-full bg-white border border-[#DDD3C4] text-xs text-stone-800 rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500/40 outline-none cursor-pointer"
                >
                  {AGENT_PROFILE.alternateVoices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed">
                <span className="text-stone-800 font-semibold">Agent Persona:</span> Articulate, polite, structured on financial management, real estate contracts, and entrepreneurial strategy.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-[#E8DFD3] mt-2">
            <span>Latency: <strong className="text-emerald-700 font-semibold">Real-time</strong></span>
            <span>Trilingual: <strong className="text-stone-800 font-semibold">EN &bull; FR &bull; IT</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
