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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] border border-[#DDD3C4] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-stone-900">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-[#F5EFE6] border-b border-[#E8DFD3] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Giulio Pintus — CV Resume Summary</h2>
              <p className="text-xs text-stone-500">
                Certified background &bull; Ready for direct export and print
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all shadow-md shadow-amber-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white hover:bg-stone-50 text-stone-500 hover:text-stone-800 border border-[#DDD3C4] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6DDD2] shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-stone-900">{GIULIO_CV.name}</h1>
                <p className="text-sm font-semibold text-amber-800 mt-0.5">
                  Master in Entrepreneurship & Consulting | Corporate Finance | ESCE Paris
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mt-3">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-amber-700" />
                    {GIULIO_CV.contact.email}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-amber-700" />
                    {GIULIO_CV.contact.phone}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    Paris 8e & Brussels
                  </span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2">
                <button
                  onClick={() => downloadMarkdownSummary()}
                  className="px-3 py-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE2] text-stone-800 text-xs border border-[#E2D8C9] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                  Markdown
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-lg bg-white hover:bg-stone-50 text-stone-600 text-xs border border-stone-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-500" />
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Key Achievement Banner */}
          <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E4D8C7] shadow-2xs">
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-800" />
              Key Accomplishment: 6-Month Mission Validated (Century 21 Brussels)
            </h3>
            <p className="text-xs text-stone-700 mt-1">
              <strong>Role & Scope:</strong> Real Estate Advisor, Legal & Operations Administrator & AI Lead (6 Months Completed).
            </p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              <strong>Expanded Responsibilities:</strong> 360° buyer guidance (search to notarial closing deed) and seller advisory (valuations, mandates, closing), rigorous legal file drafting (sales agreements, leases), and AI deployment (website chatbot and dynamic QR codes for visit scheduling).
            </p>
          </div>

          {/* Education & Experience in 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                Education & Degrees
              </h3>

              {GIULIO_CV.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-2xs">
                  <div className="flex justify-between items-start text-xs gap-2">
                    <span className="font-bold text-stone-900 text-sm">{edu.degree}</span>
                    <span className="text-amber-900 font-mono font-semibold shrink-0 bg-amber-50 px-2 py-0.5 rounded">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    {edu.institution} ({edu.location})
                  </p>
                  <ul className="mt-2 space-y-1">
                    {edu.highlights.map((h, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 uppercase tracking-wider">
                <Briefcase className="w-4 h-4 text-amber-700" />
                Professional Experience
              </h3>

              {GIULIO_CV.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-2xs">
                  <div className="flex justify-between items-start text-xs gap-2">
                    <span className="font-bold text-stone-900 text-sm">{exp.role}</span>
                    <span className="text-amber-900 font-mono font-semibold shrink-0 bg-amber-50 px-2 py-0.5 rounded">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 font-medium">
                    {exp.organization} {exp.location ? `(${exp.location})` : ''}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {exp.description.map((d, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-600 mt-1.5 shrink-0" />
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
            <div className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-2xs">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-amber-700" /> Languages (Trilingual)
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-stone-900">French:</span>{' '}
                  <span className="text-stone-600">Native</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900">English:</span>{' '}
                  <span className="text-stone-600">C2 (Bilingual)</span>
                </div>
                <div>
                  <span className="font-semibold text-stone-900">Italian:</span>{' '}
                  <span className="text-stone-600">C2 (Bilingual)</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-2xs">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-700" /> Core Skills
              </h4>
              <div className="space-y-1 text-xs text-stone-600">
                <p>&bull; Strategic advisory & diagnostics</p>
                <p>&bull; Corporate financial modeling & treasury</p>
                <p>&bull; AI implementation & custom chatbots</p>
                <p>&bull; Contract negotiations & legal compliance</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-2xs">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" /> Interests & Passions
              </h4>
              <div className="space-y-1 text-xs text-stone-600">
                <p>
                  <strong>Fencing:</strong> 5 years at Centre Européen d'Escrime
                </p>
                <p>
                  <strong>Graphic Design:</strong> 2 years of formal training (branding & layouts)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#F5EFE6] border-t border-[#E8DFD3] flex items-center justify-between">
          <span className="text-xs text-stone-600">
            Direct Contact: pintusgiulio03@gmail.com | (+32) 479015475
          </span>
          <button
            onClick={() => generateCVPdf()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CV (PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
