import React, { useState } from 'react';
import {
  Download,
  FileCheck,
  Bot,
  QrCode,
  Users2,
  Car,
  Phone,
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { GIULIO_CV } from '../data/cvData.ts';
import { generateCVPdf, downloadMarkdownSummary } from '../utils/pdfGenerator.ts';

interface Props {
  onAskAria?: (topic: string) => void;
}

export const CareerDossierSection: React.FC<Props> = ({ onAskAria }) => {
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Century 21 Brussels - 6-Month Mission & AI Case Study */}
      <section className="bg-white border border-[#E7E5E0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EFEB]">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span className="font-semibold text-stone-900 uppercase text-[11px] tracking-wider">
                Expérience Clé Validée
              </span>
              <span aria-hidden="true">&bull;</span>
              <span>Bruxelles (6 mois)</span>
              <span aria-hidden="true">&bull;</span>
              <span className="text-emerald-700 font-medium">Stage de fin d'études validé</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 mt-1">
              Century 21 &bull; Conseil Immobilier & Transformation IA
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Accompagnement transactionnel 360°, conformité notariale et déploiement de solutions d'Intelligence Artificielle en agence.
            </p>
          </div>

          {onAskAria && (
            <button
              onClick={() => onAskAria("Détaille précisément les 4 piliers de la mission de Giulio chez Century 21")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F2EFE8] border border-stone-200 text-stone-800 text-xs font-medium transition-colors cursor-pointer shrink-0"
            >
              <Bot className="w-3.5 h-3.5 text-stone-600" />
              <span>Interroger Aria sur cette mission</span>
            </button>
          )}
        </div>

        {/* 4 Pillars Grid (Sober, Structured, Clear) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pillar 1 */}
          <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-medium text-sm">
              <Users2 className="w-4 h-4 text-stone-600" />
              <h3>1. Conseil & Négociation 360°</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Prise en charge de la relation client de la première découverte jusqu'à l'acte notarié : estimations de biens, visites ciblées, négociation des offres et accompagnement des acquéreurs et vendeurs.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-medium text-sm">
              <FileCheck className="w-4 h-4 text-stone-600" />
              <h3>2. Rigueur Administrative & Notariale</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Constitution intégrale des dossiers de vente juridiques : conformité urbanistique, titres de propriété, certificats énergétiques (PEB), et liaison directe avec les études notariales pour la préparation des compromis.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-medium text-sm">
              <Bot className="w-4 h-4 text-stone-600" />
              <h3>3. Intégration Chatbot IA sur Site Web</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Conception et déploiement d'un agent conversationnel IA pour le site de l'agence : réponse 24/7 aux acquéreurs, qualification automatique des critères de recherche et transmission des leads à l'équipe.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-medium text-sm">
              <QrCode className="w-4 h-4 text-stone-600" />
              <h3>4. QR Code Vitrine & Prise de RDV</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Installation d'un système de QR codes dynamiques sur la vitrine physique de l'agence permettant aux passants de réserver une visite ou recevoir la fiche complète sur leur smartphone à toute heure.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Formation Académique */}
      <section className="bg-white border border-[#E7E5E0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="pb-4 border-b border-[#F0EFEB]">
          <span className="font-semibold text-stone-900 uppercase text-[11px] tracking-wider">
            Formation & Diplômes
          </span>
          <h2 className="text-xl font-semibold text-stone-900 mt-0.5">
            Parcours Universitaire & Écoles
          </h2>
        </div>

        <div className="space-y-4">
          {GIULIO_CV.education.map((edu, idx) => (
            <div
              key={idx}
              className="bg-[#FAF9F6] border border-[#EBE8E1] rounded-xl p-4.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-900">{edu.degree}</span>
                </div>
                <div className="text-xs text-stone-700 font-medium">{edu.institution}</div>
                {edu.highlights && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {edu.highlights.map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className="text-[11px] bg-white border border-stone-200 text-stone-700 px-2 py-0.5 rounded"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-xs text-stone-500 font-mono shrink-0 sm:text-right">
                <div>{edu.period}</div>
                <div className="text-[11px] text-stone-400">{edu.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Compétences & Coordonnées Utiles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Compétences & Langues */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-stone-900 pb-2 border-b border-[#F0EFEB]">
            Compétences Clés & Langues
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-stone-500 block mb-1">Langues maîtrisées :</span>
              <div className="space-y-1 text-stone-800">
                <div className="flex justify-between">
                  <span>Anglais</span>
                  <strong className="font-semibold">C2 (Bilingue)</strong>
                </div>
                <div className="flex justify-between">
                  <span>Français</span>
                  <strong className="font-semibold">Langue Maternelle</strong>
                </div>
                <div className="flex justify-between">
                  <span>Italien</span>
                  <strong className="font-semibold">Langue Maternelle / C2</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#F0EFEB]">
              <span className="text-stone-500 block mb-1">Expertise Finance & Outils :</span>
              <p className="text-stone-700 leading-relaxed">
                Analyse financière d'entreprise, valorisation (DCF, multiples), modélisation de transactions, droit immobilier et contractuel, outils IA (Gemini, prompts structurés).
              </p>
            </div>
          </div>
        </div>

        {/* Coordonnées & Export Direct */}
        <div className="bg-white border border-[#E7E5E0] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 pb-2 border-b border-[#F0EFEB]">
              Coordonnées Directes & Export
            </h3>
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Téléphone :
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${GIULIO_CV.contact.phone.replace(/\s+/g, '')}`}
                    className="font-mono font-semibold text-stone-900 hover:underline"
                  >
                    {GIULIO_CV.contact.phone}
                  </a>
                  <button
                    onClick={handleCopyPhone}
                    className="text-stone-400 hover:text-stone-700 p-0.5"
                    title="Copier"
                  >
                    {copiedPhone ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email :
                </span>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`mailto:${GIULIO_CV.contact.email}`}
                    className="font-mono text-stone-900 hover:underline truncate max-w-[170px]"
                  >
                    {GIULIO_CV.contact.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="text-stone-400 hover:text-stone-700 p-0.5"
                    title="Copier"
                  >
                    {copiedEmail ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" /> Mobilité :
                </span>
                <span className="font-medium text-stone-900">
                  Permis B &bull; Paris & Bruxelles
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-[#F0EFEB]">
            <button
              onClick={() => generateCVPdf()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger CV complet (PDF)</span>
            </button>
            <button
              onClick={() => downloadMarkdownSummary()}
              className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F2EFE8] border border-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
              title="Télécharger résumé Markdown"
            >
              <span>Markdown</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
