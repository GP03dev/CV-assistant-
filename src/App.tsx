/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { AgentPersonaCard } from './components/AgentPersonaCard.tsx';
import { ChatAssistant } from './components/ChatAssistant.tsx';
import { CVOverviewSection } from './components/CVOverviewSection.tsx';
import { VoiceCallModal } from './components/VoiceCallModal.tsx';
import { CVSummaryModal } from './components/CVSummaryModal.tsx';
import { AGENT_PROFILE, GIULIO_CV } from './data/cvData.ts';
import { generateCVPdf, downloadMarkdownSummary } from './utils/pdfGenerator.ts';
import {
  MessageSquare,
  FileText,
  Briefcase,
  PhoneCall,
  Download,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  Globe2
} from 'lucide-react';

export default function App() {
  const [selectedVoice, setSelectedVoice] = useState(AGENT_PROFILE.voiceName);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'assistant' | 'cv' | 'internship'>('assistant');
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);

  const handleAskAbout = (topic: string) => {
    setActiveMainTab('assistant');
    setChatPrompt(topic);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
        onOpenCVModal={() => setIsCVModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Agent Specification Card: Role, Voice/Personality, Name, Start Script */}
        <AgentPersonaCard
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          onOpenVoiceMode={() => setIsVoiceCallOpen(true)}
          onOpenCVModal={() => setIsCVModalOpen(true)}
        />

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMainTab('assistant')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeMainTab === 'assistant'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Voice & Chat Assistant</span>
            </button>

            <button
              onClick={() => setActiveMainTab('cv')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeMainTab === 'cv'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CV Summary & Download</span>
            </button>

            <button
              onClick={() => setActiveMainTab('internship')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeMainTab === 'internship'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Internship 2026 Details</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF Summary</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeMainTab === 'assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Chat & Voice Interface */}
            <div className="lg:col-span-2">
              <ChatAssistant
                selectedVoice={selectedVoice}
                onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
                onOpenCVModal={() => setIsCVModalOpen(true)}
                initialPrompt={chatPrompt}
                onClearInitialPrompt={() => setChatPrompt(undefined)}
              />
            </div>

            {/* Right Column: Quick Candidate Snapshot & Direct Download Card */}
            <div className="space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Executive Quick Snapshot
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{GIULIO_CV.name}</h3>
                  <p className="text-xs text-amber-300 font-medium">
                    Corporate Finance & International Management
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ESCE Paris • BA3 Corporate Finance • 21 years old
                  </p>
                </div>

                {/* Key Points */}
                <div className="space-y-2.5 text-xs text-slate-300 border-t border-b border-slate-800/80 py-4">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>
                      <strong>Target Role:</strong> Responsable de gestion / Contrôle financier (6-month stage)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>
                      <strong>Availability:</strong> 20 March - August/Sept 2026
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>
                      <strong>Languages:</strong> Français (Native), Anglais (C2), Italien (C2)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>
                      <strong>Locations:</strong> Paris, Île-de-France & Brussels
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => generateCVPdf()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01]"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV Summary (PDF)</span>
                  </button>

                  <button
                    onClick={() => setIsVoiceCallOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Launch Voice Call (Live)</span>
                  </button>

                  <button
                    onClick={() => setIsCVModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Full Resume Card</span>
                  </button>
                </div>
              </div>

              {/* Sample recruiter questions card */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Popular Recruiter Questions
                </h4>
                <div className="space-y-1.5">
                  {[
                    "Why is Giulio passionate about corporate finance?",
                    "What were his key responsibilities as BDE Treasurer?",
                    "How does his Century 21 commercial experience help?",
                    "What did he study during his Erasmus in Munich?",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskAbout(q)}
                      className="w-full text-left p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/60"
                    >
                      &bull; {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMainTab === 'cv' && (
          <CVOverviewSection onAskAboutTopic={handleAskAbout} />
        )}

        {activeMainTab === 'internship' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/20 rounded-2xl p-8">
              <div className="max-w-3xl">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Internship Profile 2026
                </span>
                <h2 className="text-3xl font-extrabold text-white mt-4">
                  {GIULIO_CV.internshipGoal.role}
                </h2>
                <p className="text-slate-300 mt-3 text-base leading-relaxed">
                  After 4 years of rigorous university studies in business management and corporate finance (ICHEC Brussels, ESCE Paris, EU Business School Munich), Giulio is eager to commit to a 6-month mission where he can contribute to financial oversight, data audit, and management control.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase font-bold">Duration</span>
                    <p className="text-base font-bold text-white mt-0.5">{GIULIO_CV.internshipGoal.duration}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase font-bold">Timeframe</span>
                    <p className="text-base font-bold text-amber-300 mt-0.5">20 March - Sept 2026</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-xs text-slate-400 uppercase font-bold">Location</span>
                    <p className="text-base font-bold text-white mt-0.5">{GIULIO_CV.internshipGoal.location}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-base font-bold text-white mb-3">Key Target Contributions:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {GIULIO_CV.internshipGoal.tasks.map((task, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                        <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-200 font-medium">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-slate-800">
                  <button
                    onClick={() => generateCVPdf()}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV Summary (PDF)</span>
                  </button>

                  <a
                    href={`mailto:${GIULIO_CV.contact.email}?subject=Opportunité%20Stage%20Responsable%20de%20gestion%20-%20Giulio%20Pintus`}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Contact Giulio directly ({GIULIO_CV.contact.email})</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{GIULIO_CV.name}</span>
            <span>&bull;</span>
            <span>Represented by <strong>{AGENT_PROFILE.name}</strong></span>
            <span>&bull;</span>
            <span>ESCE Paris (BA3 Corporate Finance)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => generateCVPdf()}
              className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download CV (PDF)
            </button>
            <span>&bull;</span>
            <button
              onClick={() => downloadMarkdownSummary()}
              className="text-slate-400 hover:text-white"
            >
              Markdown CV
            </button>
            <span>&bull;</span>
            <a
              href={`mailto:${GIULIO_CV.contact.email}`}
              className="text-slate-400 hover:text-white"
            >
              {GIULIO_CV.contact.email}
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VoiceCallModal
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        selectedVoice={selectedVoice}
      />

      <CVSummaryModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />
    </div>
  );
}
