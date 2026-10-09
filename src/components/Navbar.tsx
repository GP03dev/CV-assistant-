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
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Candidate Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center text-amber-400 font-extrabold text-lg">
              GP
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white tracking-tight">
                {GIULIO_CV.name}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 hidden sm:inline-block">
                Stage 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Assistant: <strong>{AGENT_PROFILE.name}</strong></span>
              <span className="text-slate-600">&bull;</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live AI
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Voice Call Launcher */}
          <button
            onClick={onOpenVoiceCall}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Start interactive voice conversation"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voice Call</span>
          </button>

          {/* Download CV Summary Button */}
          <button
            onClick={() => generateCVPdf()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs border border-amber-500/30 hover:border-amber-500/50 transition-colors"
            title="Download formatted CV Summary PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Download CV (PDF)</span>
            <span className="md:hidden">CV</span>
          </button>

          {/* View Full CV Modal */}
          <button
            onClick={onOpenCVModal}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
            title="View full resume details"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Email Link */}
          <a
            href={`mailto:${GIULIO_CV.contact.email}?subject=Entretien%20Stage%20Responsable%20de%20gestion%20-%20Giulio%20Pintus`}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors hidden sm:flex"
            title="Send email to Giulio"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
