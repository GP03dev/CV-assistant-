/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { AgentPersonaCard } from './components/AgentPersonaCard.tsx';
import { ChatAssistant } from './components/ChatAssistant.tsx';
import { CareerDossierSection } from './components/CareerDossierSection.tsx';
import { VoiceCallModal } from './components/VoiceCallModal.tsx';
import { CVSummaryModal } from './components/CVSummaryModal.tsx';
import { AGENT_PROFILE } from './data/cvData.ts';
import { MessageSquare, FileText } from 'lucide-react';

export default function App() {
  const [selectedVoice, setSelectedVoice] = useState(AGENT_PROFILE.voiceName);
  const [isVoiceCallOpen, setIsVoiceCallOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'assistant' | 'dossier'>('assistant');
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);

  const handleAskAria = (topic: string) => {
    setActiveTab('assistant');
    setChatPrompt(topic);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col font-sans selection:bg-stone-200">
      {/* Sober Navbar */}
      <Navbar
        onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
        onOpenCVModal={() => setIsCVModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Executive Profile Header Card */}
        <AgentPersonaCard
          selectedVoice={selectedVoice}
          onSelectVoice={setSelectedVoice}
          onOpenVoiceMode={() => setIsVoiceCallOpen(true)}
          onOpenCVModal={() => setIsCVModalOpen(true)}
        />

        {/* Clean, Intuitive 2-View Switcher */}
        <div className="flex items-center justify-center pt-2">
          <div className="bg-stone-200/70 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'assistant'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Assistante IA (Aria)</span>
            </button>

            <button
              onClick={() => setActiveTab('dossier')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'dossier'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Parcours & Expérience (Century 21 & CV)</span>
            </button>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'assistant' ? (
          <div className="max-w-3xl mx-auto">
            <ChatAssistant
              selectedVoice={selectedVoice}
              onOpenVoiceCall={() => setIsVoiceCallOpen(true)}
              onOpenCVModal={() => setIsCVModalOpen(true)}
              initialPrompt={chatPrompt}
              onClearInitialPrompt={() => setChatPrompt(undefined)}
            />
          </div>
        ) : (
          <CareerDossierSection onAskAria={handleAskAria} />
        )}
      </main>

      {/* Voice Call Modal */}
      <VoiceCallModal
        isOpen={isVoiceCallOpen}
        onClose={() => setIsVoiceCallOpen(false)}
        selectedVoice={selectedVoice}
      />

      {/* CV Summary Modal */}
      <CVSummaryModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />
    </div>
  );
}
