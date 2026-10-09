import React, { useState } from 'react';
import {
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Car,
  Globe2,
  Download,
  Copy,
  Check,
  Building2,
  GraduationCap
} from 'lucide-react';
import { GIULIO_CV, AGENT_PROFILE } from '../data/cvData.ts';
import { generateCVPdf } from '../utils/pdfGenerator.ts';

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
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(GIULIO_CV.contact.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(GIULIO_CV.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="bg-white border border-[#E7E5E0] rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Top Header: Identity & Bio */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#F0EFEB]">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center flex-wrap gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-900 tracking-wide uppercase text-[11px]">
              Dossier Exécutif
            </span>
            <span aria-hidden="true">&bull;</span>
            <span>ESCE International Business School (Paris)</span>
            <span aria-hidden="true">&bull;</span>
            <span className="text-emerald-700 font-medium">
              Mission Century 21 validée (6 mois)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-stone-900 tracking-tight">
            {GIULIO_CV.name}
          </h1>

          <p className="text-sm sm:text-base text-stone-700 font-medium">
            Master en Entrepreneuriat & Conseil (2025–2027) &bull; Conseil Immobilier & Transformation IA
          </p>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-1">
            {GIULIO_CV.summary}
          </p>
        </div>

        {/* Executive Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenVoiceMode}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-stone-300" />
            <span>Appel Vocal Direct</span>
          </button>

          <button
            onClick={() => generateCVPdf()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs sm:text-sm transition-colors border border-stone-200 cursor-pointer"
          >
            <Download className="w-4 h-4 text-stone-600" />
            <span>Télécharger CV (PDF)</span>
          </button>
        </div>
      </div>

      {/* Practical Options & Contact Bar (Clean, Sunk into Quiet Neutral) */}
      <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Item 1: Direct Phone */}
        <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              Téléphone Direct
            </span>
            <button
              onClick={handleCopyPhone}
              className="text-stone-400 hover:text-stone-700 transition-colors p-0.5"
              title="Copier le numéro"
            >
              {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <a
            href={`tel:${GIULIO_CV.contact.phone.replace(/\s+/g, '')}`}
            className="text-sm font-semibold font-mono text-stone-900 hover:text-stone-700 block transition-colors"
          >
            {GIULIO_CV.contact.phone}
          </a>
          <p className="text-[11px] text-stone-500">Disponible pour entretiens et opportunités</p>
        </div>

        {/* Item 2: Permis B & Mobility */}
        <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-stone-500" />
              Permis B & Mobilité
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Véhiculé
            </span>
          </div>
          <div className="text-sm font-semibold text-stone-900">
            Permis B (Sans infraction)
          </div>
          <p className="text-[11px] text-stone-500">
            Mobilité complète : Paris Île-de-France & Bruxelles
          </p>
        </div>

        {/* Item 3: Languages & Email */}
        <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-stone-500" />
              Langues & Email
            </span>
            <button
              onClick={handleCopyEmail}
              className="text-stone-400 hover:text-stone-700 transition-colors p-0.5"
              title="Copier l'email"
            >
              {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <a
            href={`mailto:${GIULIO_CV.contact.email}`}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 block truncate"
          >
            {GIULIO_CV.contact.email}
          </a>
          <p className="text-[11px] text-stone-500 font-mono">
            EN (C2 Bilingue) &bull; FR (Natif) &bull; IT (Natif)
          </p>
        </div>

        {/* Item 4: Assistant Aria & Voice Selector */}
        <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-stone-500">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Assistante Aria
            </span>
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <span>Voix:</span>
              <select
                value={selectedVoice}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="bg-white border border-stone-200 rounded px-1.5 py-0.5 text-[11px] text-stone-800 focus:outline-hidden"
              >
                {AGENT_PROFILE.alternateVoices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-xs font-medium text-stone-900">
            Représentation IA Certifiée
          </div>
          <p className="text-[11px] text-stone-500">
            Répond en temps réel sur la mission et les acquis
          </p>
        </div>
      </div>
    </section>
  );
};
