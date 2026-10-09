import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Download,
  Mail,
  Car,
  Check,
  Copy
} from 'lucide-react';
import { GIULIO_CV, AGENT_PROFILE } from '../data/cvData.ts';
import { generateCVPdf } from '../utils/pdfGenerator.ts';

interface Props {
  onOpenVoiceCall: () => void;
  onOpenCVModal: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenVoiceCall, onOpenCVModal }) => {
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(GIULIO_CV.contact.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E7E5E0]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Candidate Identification */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-stone-300 bg-white flex items-center justify-center text-stone-900 font-semibold text-xs tracking-tight shadow-2xs shrink-0">
            GP
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-stone-900 tracking-tight">
                {GIULIO_CV.name}
              </span>
              <span className="text-stone-300 hidden sm:inline">&bull;</span>
              <span className="text-xs text-stone-500 hidden sm:inline">
                Master's ESCE Paris &bull; Real Estate & AI
              </span>
            </div>
            <p className="text-[11px] text-stone-500 flex items-center gap-2">
              <span>Assistant: <strong className="text-stone-700 font-medium">{AGENT_PROFILE.name}</strong></span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-stone-600 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Voice Ready
              </span>
            </p>
          </div>
        </div>

        {/* Right: Direct Actions & Contact */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Direct Phone Link */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-2xs">
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            <a
              href={`tel:${GIULIO_CV.contact.phone.replace(/\s+/g, '')}`}
              className="font-mono font-medium hover:text-stone-900 transition-colors"
              title="Call Giulio"
            >
              {GIULIO_CV.contact.phone}
            </a>
            <button
              onClick={handleCopyPhone}
              className="text-stone-400 hover:text-stone-600 ml-1 p-0.5 rounded cursor-pointer"
              title="Copy phone number"
            >
              {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* Download PDF button */}
          <button
            onClick={() => generateCVPdf()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-medium text-xs transition-colors shadow-2xs cursor-pointer"
            title="Download full CV in PDF"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">CV PDF</span>
          </button>

          {/* Voice Call Launcher (Sober dark button) */}
          <button
            onClick={onOpenVoiceCall}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors shadow-2xs cursor-pointer"
            title="Start voice conversation with Aria"
          >
            <PhoneCall className="w-3.5 h-3.5 text-stone-300" />
            <span>Voice Call</span>
          </button>
        </div>
      </div>
    </header>
  );
};
