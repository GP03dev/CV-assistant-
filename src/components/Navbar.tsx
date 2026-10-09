import React from 'react';
import {
  Sparkles,
  PhoneCall,
  Download,
  Mail,
  FileText,
  UserCheck
} from 'lucide-react';
import { GIULIO_CV, AGENT_PROFILE } from '../data/cvData.ts';
import { generateCVPdf } from '../utils/pdfGenerator.ts';

interface Props {
  onOpenVoiceCall: () => void;
  onOpenCVModal: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenVoiceCall, onOpenCVModal }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-xl border-b border-stone-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Candidate Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 p-[1px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center text-amber-800 font-extrabold text-base tracking-tight">
              GP
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-stone-900 tracking-tight">
                {GIULIO_CV.name}
              </h1>
              <span className="text-[11px] font-semibold text-stone-500 hidden sm:inline-block">
                &bull; Master's &bull; AI & Real Estate
              </span>
            </div>
            <p className="text-xs text-stone-600 flex items-center gap-2">
              <span>AI Assistant: <strong className="text-stone-800">{AGENT_PROFILE.name}</strong></span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live API & Speech
              </span>
              <span className="text-stone-300 hidden md:inline">&bull;</span>
              <span className="text-amber-800 font-semibold text-[11px] hidden md:inline font-mono">
                EN / FR / IT
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Voice Call Launcher */}
          <button
            onClick={onOpenVoiceCall}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-amber-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Start live voice conversation"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Call</span>
          </button>

          {/* Download CV Summary Button */}
          <button
            onClick={() => generateCVPdf()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs border border-stone-200/90 shadow-xs transition-colors cursor-pointer"
            title="Download CV summary (PDF)"
          >
            <Download className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden md:inline">Download CV (PDF)</span>
            <span className="md:hidden">CV</span>
          </button>

          {/* View Full CV Modal */}
          <button
            onClick={onOpenCVModal}
            className="p-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 shadow-xs transition-colors cursor-pointer"
            title="View complete resume"
          >
            <FileText className="w-4 h-4 text-stone-600" />
          </button>

          {/* Email Link */}
          <a
            href={`mailto:${GIULIO_CV.contact.email}?subject=Professional%20Inquiry%20-%20Giulio%20Pintus`}
            className="p-2 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/90 shadow-xs transition-colors hidden sm:flex cursor-pointer"
            title="Send an email to Giulio"
          >
            <Mail className="w-4 h-4 text-stone-600" />
          </a>
        </div>
      </div>
    </header>
  );
};
