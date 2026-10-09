import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, CheckCircle2, UserCheck, ShieldCheck, Play } from 'lucide-react';
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
        // Fallback browser speech if TTS has issue
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-2xl shadow-lg shadow-amber-500/20">
              A
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                Official Agent
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Grounded on Verified CV
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              {AGENT_PROFILE.name}
              <span className="text-sm font-normal text-slate-400">({AGENT_PROFILE.role})</span>
            </h2>
          </div>
        </div>

        {/* Quick Launch Voice & CV Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onOpenVoiceMode}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            Launch Voice Call (Live)
          </button>
          <button
            onClick={onOpenCVModal}
            className="flex-1 lg:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all border border-slate-700 hover:border-slate-600"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            Download CV Summary
          </button>
        </div>
      </div>

      {/* Required Specifications Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* 1. Name of Agent */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Agent Name
          </div>
          <div className="text-lg font-bold text-white flex items-center justify-between">
            <span>{AGENT_PROFILE.name}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
              Executive AI
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Designated career representative for Giulio Pintus.
          </p>
        </div>

        {/* 2. Role */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Role
          </div>
          <div className="text-sm font-semibold text-white leading-tight">
            Executive AI Career Assistant
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Answers recruiter queries, details finance experience & internship goals.
          </p>
        </div>

        {/* 3. Voice & Personality */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Voice & Personality</span>
            <span className="text-[10px] text-emerald-400 font-mono">Gemini TTS</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <select
              value={selectedVoice}
              onChange={(e) => onSelectVoice(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-amber-500 outline-none w-full"
            >
              {AGENT_PROFILE.alternateVoices.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tone: Professional, warm, articulate, polite, and confident.
          </p>
        </div>

        {/* 4. Opening Script */}
        <div className="bg-slate-950/60 border border-amber-500/30 rounded-xl p-4 relative group">
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Script at Start</span>
            <button
              onClick={handlePlayGreeting}
              disabled={loadingAudio}
              className="text-xs flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
              title="Audition Opening Script"
            >
              {loadingAudio ? (
                <span className="animate-spin text-xs">⏳</span>
              ) : isPlayingGreeting ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
              {isPlayingGreeting ? 'Stop' : 'Listen'}
            </button>
          </div>
          <div className="text-xs italic text-amber-200/90 font-serif leading-relaxed bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
            “{AGENT_PROFILE.scriptAtStart}”
          </div>
        </div>
      </div>
    </div>
  );
};
