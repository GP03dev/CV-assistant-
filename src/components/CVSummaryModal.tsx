import React from 'react';
import {
  Download,
  FileText,
  Printer,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Globe2,
  Award,
  CheckCircle2,
  X,
  ExternalLink
} from 'lucide-react';
import { GIULIO_CV } from '../data/cvData.ts';
import { generateCVPdf, downloadMarkdownSummary } from '../utils/pdfGenerator.ts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CVSummaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Giulio Pintus — CV Summary & Portfolio</h2>
              <p className="text-xs text-slate-400">
                Official verified resume overview • Ready for direct export
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-6 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">{GIULIO_CV.name}</h1>
                <p className="text-sm font-semibold text-amber-400 mt-0.5">
                  Corporate Finance & International Management | ESCE Paris
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-3">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    {GIULIO_CV.contact.email}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    {GIULIO_CV.contact.phone}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Paris 8e & Brussels
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2">
                <button
                  onClick={() => downloadMarkdownSummary()}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  Markdown
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Internship Objective Banner */}
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Target Stage: Responsable de gestion / Contrôle financier (6 mois)
            </h3>
            <p className="text-xs text-slate-200 mt-1">
              <strong>Période :</strong> 6 mois entre le 20 mars et août-septembre 2026. <strong>Lieu :</strong> Paris, Île-de-France.
            </p>
            <p className="text-xs text-slate-300 mt-1">
              <strong>Missions ciblées :</strong> Études économiques, contrôle des processus financiers, collecte et vérification des informations financières, gestion de trésorerie et cash management.
            </p>
          </div>

          {/* Education & Experience in 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                Diplômes & Formations
              </h3>

              {GIULIO_CV.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between items-start text-xs gap-2">
                    <span className="font-bold text-white text-sm">{edu.degree}</span>
                    <span className="text-amber-400 font-mono shrink-0">{edu.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {edu.institution} ({edu.location})
                  </p>
                  <ul className="mt-2 space-y-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-amber-400" />
                Expérience Professionnelle
              </h3>

              {GIULIO_CV.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between items-start text-xs gap-2">
                    <span className="font-bold text-white text-sm">{exp.role}</span>
                    <span className="text-amber-400 font-mono shrink-0">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    {exp.organization} {exp.location ? `(${exp.location})` : ''}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.description.map((d, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Skills, Languages & Passions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" /> Langues (Trilingue)
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-white">Français :</span>{' '}
                  <span className="text-slate-300">Natif</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Anglais :</span>{' '}
                  <span className="text-slate-300">C2 (Bilingue)</span>
                </div>
                <div>
                  <span className="font-semibold text-white">Italien :</span>{' '}
                  <span className="text-slate-300">C2 (Bilingue)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Compétences Clés
              </h4>
              <div className="space-y-1 text-xs text-slate-300">
                <p>&bull; Analyses & diagnostics financiers</p>
                <p>&bull; Cash management & trésorerie</p>
                <p>&bull; Excel modélisation d'entreprise</p>
                <p>&bull; Négociation commerciale</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Centres d'Intérêt
              </h4>
              <div className="space-y-1 text-xs text-slate-300">
                <p>
                  <strong>Escrime :</strong> 5 ans au Centre Européen d'Escrime
                </p>
                <p>
                  <strong>Dessin & Graphisme :</strong> 2 ans de cours (Canva, identités)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Contact direct : pintusgiulio03@gmail.com | (+32) 479015475
          </span>
          <button
            onClick={() => generateCVPdf()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Resume</span>
          </button>
        </div>
      </div>
    </div>
  );
};
