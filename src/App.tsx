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
import { CaseStudyCentury21 } from './components/CaseStudyCentury21.tsx';
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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
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
        <div className="flex items-center justify-between border-b border-[#E6DDD2] pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMainTab('assistant')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'assistant'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-white/90 text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE3] border border-[#E6DDD2]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Voice & Chat Assistant</span>
            </button>

            <button
              onClick={() => setActiveMainTab('cv')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'cv'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-white/90 text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE3] border border-[#E6DDD2]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>CV Summary & Download</span>
            </button>

            <button
              onClick={() => setActiveMainTab('internship')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                activeMainTab === 'internship'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'bg-white/90 text-stone-700 hover:text-stone-900 hover:bg-[#F2ECE3] border border-[#E6DDD2]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Century 21 & AI (6-Month Mission)</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#E2D7C8] text-amber-800 font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>Download CV (PDF)</span>
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
              <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    Executive Snapshot
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800">
                    Verified CV
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-stone-900">{GIULIO_CV.name}</h3>
                  <p className="text-xs text-amber-800 font-semibold mt-0.5">
                    Master in Entrepreneurship & Consulting &bull; ESCE Paris
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Trilingual EN / FR / IT &bull; 21 years old &bull; Paris / Brussels
                  </p>
                </div>

                {/* Key Points */}
                <div className="space-y-2.5 text-xs text-stone-700 border-t border-b border-[#EBE4D8] py-4">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>Completed Mission:</strong> 6 Months at Century 21 (Client Care, Legal Admin & AI)
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>AI Implementation:</strong> Agency website AI chatbot & dynamic QR code visit scheduling
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>360° Client Guidance:</strong> End-to-end guidance for buyers and sellers from search to closing
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>Current Education:</strong> Master in Entrepreneurship & Consulting (ESCE Paris)
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => generateCVPdf()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV Summary (PDF)</span>
                  </button>

                  <button
                    onClick={() => setIsVoiceCallOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5EFE6] hover:bg-[#EDE5DA] text-stone-800 font-semibold text-xs border border-[#E2D7C8] transition-colors cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                    <span>Launch Voice Call (Live)</span>
                  </button>

                  <button
                    onClick={() => setIsCVModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs border border-[#E2D7C8] transition-colors cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Full Resume Card</span>
                  </button>
                </div>
              </div>

              {/* Sample recruiter questions card */}
              <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 shadow-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  Popular Recruiter Questions for Aria
                </h4>
                <div className="space-y-2">
                  {[
                    "How did Giulio implement AI (Chatbot & QR codes) at Century 21?",
                    "What was his role with buyers and sellers from search to closing?",
                    "How did he manage sales contracts and legal administration?",
                    "Tell me about his Master in Entrepreneurship & Consulting at ESCE Paris.",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskAbout(q)}
                      className="w-full text-left p-2.5 rounded-xl text-xs text-stone-700 hover:text-stone-900 bg-[#FAF7F2] hover:bg-[#F3EDE2] transition-colors border border-[#E8DFD3] hover:border-[#DACDBD] cursor-pointer"
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
          <CaseStudyCentury21 onAskAria={handleAskAbout} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6DDD2] bg-[#FAF7F2] py-8 mt-12 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-stone-900">{GIULIO_CV.name}</span>
            <span>&bull;</span>
            <span>Represented by <strong>{AGENT_PROFILE.name}</strong></span>
            <span>&bull;</span>
            <span>ESCE Paris (Master in Entrepreneurship & Consulting)</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => generateCVPdf()}
              className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download CV (PDF)
            </button>
            <span>&bull;</span>
            <button
              onClick={() => downloadMarkdownSummary()}
              className="text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Markdown CV
            </button>
            <span>&bull;</span>
            <a
              href={`mailto:${GIULIO_CV.contact.email}`}
              className="text-stone-600 hover:text-stone-900 cursor-pointer"
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
