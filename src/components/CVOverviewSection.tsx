import React, { useState } from 'react';
import {
  Download,
  FileText,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Globe2,
  CheckCircle,
  Copy,
  ExternalLink,
  Award,
  Sparkles,
  ChevronRight,
  Printer,
  Car,
  PhoneCall
} from 'lucide-react';
import { GIULIO_CV } from '../data/cvData.ts';
import { generateCVPdf, downloadMarkdownSummary } from '../utils/pdfGenerator.ts';

interface Props {
  onAskAboutTopic?: (topic: string) => void;
}

export const CVOverviewSection: React.FC<Props> = ({ onAskAboutTopic }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'education' | 'experience' | 'skills'>('all');

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Download CV Call-To-Action */}
      <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Warm ambient corner */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Candidate Profile & Verified Resume
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              {GIULIO_CV.name}
            </h1>
            <p className="text-base sm:text-lg text-amber-800 font-semibold mt-1">
              {GIULIO_CV.title}
            </p>
            <p className="text-sm text-stone-600 max-w-2xl mt-3 leading-relaxed">
              {GIULIO_CV.summary}
            </p>

            {/* Contact quick strip */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-xs text-stone-600">
              <a
                href={`tel:${GIULIO_CV.contact.phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold transition-colors cursor-pointer shadow-2xs"
                title="Direct call"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                <span>{GIULIO_CV.contact.phone}</span>
              </a>

              <button
                onClick={() => copyToClipboard(GIULIO_CV.contact.phone, 'phone')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#E2D8C9] transition-colors cursor-pointer group shadow-2xs"
                title="Copy phone"
              >
                {copiedPhone ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-400 group-hover:text-stone-700" />
                )}
                <span>Copy</span>
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 shadow-2xs text-emerald-900 font-medium">
                <Car className="w-3.5 h-3.5 text-emerald-700" />
                <span>Permis B (Clean License &bull; Mobile)</span>
              </div>

              <button
                onClick={() => copyToClipboard(GIULIO_CV.contact.email, 'email')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-[#E2D8C9] transition-colors cursor-pointer group shadow-2xs"
              >
                <Mail className="w-3.5 h-3.5 text-amber-700" />
                <span className="font-medium text-stone-800">{GIULIO_CV.contact.email}</span>
                {copiedEmail ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-400 group-hover:text-stone-700" />
                )}
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E2D8C9] shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span className="font-medium text-stone-800">{GIULIO_CV.contact.locations.join(' & ')}</span>
              </div>
            </div>
          </div>

          {/* Download Action Cluster */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto min-w-[220px]">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-md shadow-amber-700/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download CV (PDF)</span>
            </button>

            <button
              onClick={() => downloadMarkdownSummary()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] text-stone-800 font-semibold text-xs border border-[#E2D8C9] transition-colors shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-700" />
              <span>Download Markdown</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 text-xs border border-stone-200 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print View</span>
            </button>
          </div>
        </div>

        {/* Highlighted Key Mission Accomplishment Card */}
        <div className="mt-6 bg-[#FAF7F2] border border-[#E4D9CA] rounded-2xl p-5 relative shadow-2xs">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-700" />
              Major Accomplishment: 6-Month Mission at Century 21
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold">
              Mission Validated with High-Level Responsibility
            </span>
          </div>

          <h3 className="text-lg font-bold text-stone-900">
            {GIULIO_CV.internshipGoal.role}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            <strong>Scope:</strong> {GIULIO_CV.internshipGoal.timeframe} &bull;{' '}
            <strong>Location:</strong> {GIULIO_CV.internshipGoal.location}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E8DFD3]">
            {GIULIO_CV.internshipGoal.tasks.map((task, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-stone-700">
                <CheckCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6DDD2] pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'all'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE3]'
          }`}
        >
          Complete View
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'education'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE3]'
          }`}
        >
          Education & Master's
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'experience'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE3]'
          }`}
        >
          Experience & Century 21
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE3]'
          }`}
        >
          Skills & Languages
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Education & Experience (2 cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Education */}
          {(activeTab === 'all' || activeTab === 'education') && (
            <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Education & Degrees</h2>
                    <p className="text-xs text-stone-500">Master in Entrepreneurship & Consulting &bull; Corporate Finance background</p>
                  </div>
                </div>
                {onAskAboutTopic && (
                  <button
                    onClick={() => onAskAboutTopic("Tell me about Giulio's Master in Entrepreneurship and Consulting, as well as his corporate finance background")}
                    className="text-xs text-amber-800 hover:text-amber-900 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>Ask Aria</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {GIULIO_CV.education.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] hover:border-[#DACDBD] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-sm font-bold text-stone-900">{item.degree}</h3>
                      <span className="text-xs font-mono font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        {item.period}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-2 mb-2">
                      <span className="font-semibold text-stone-700">{item.institution}</span>
                      <span>&bull;</span>
                      <span>{item.location}</span>
                    </div>
                    <ul className="space-y-1">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {(activeTab === 'all' || activeTab === 'experience') && (
            <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">Experience & Leadership</h2>
                    <p className="text-xs text-stone-500">6-Month Century 21 Mission &bull; AI Implementation &bull; Student Council Treasurer</p>
                  </div>
                </div>
                {onAskAboutTopic && (
                  <button
                    onClick={() => onAskAboutTopic("Tell me about Giulio's 6-month mission at Century 21, the legal file management, and his AI implementation (chatbot and QR codes)")}
                    className="text-xs text-amber-800 hover:text-amber-900 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>Ask Aria</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {GIULIO_CV.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3] hover:border-[#DACDBD] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-stone-900">{exp.role}</h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">
                          {exp.type}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mb-2">
                      <span className="font-semibold text-stone-700">{exp.organization}</span>
                      {exp.location && <span> &bull; {exp.location}</span>}
                    </div>
                    <ul className="space-y-1.5">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-xs text-stone-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Languages, Skills, Tools & Passions */}
        <div className="space-y-6">
          {/* Languages */}
          <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Languages (Trilingual)</h3>
                <p className="text-xs text-stone-500">Native French + C2 Bilingual English & Italian</p>
              </div>
            </div>

            <div className="space-y-3">
              {GIULIO_CV.languages.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-900">{lang.language}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                      {lang.level}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">{lang.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hard Skills & Tools */}
          <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700" />
              Core Competencies & Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {GIULIO_CV.hardSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#E2D8C9] text-stone-800 font-medium hover:border-amber-500 transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>

            <h4 className="text-xs uppercase font-bold text-stone-500 tracking-wider mt-5 mb-2">
              Tools & Systems
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {GIULIO_CV.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Personal Interests */}
          <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-stone-900 mb-3">Interests & Passions</h3>
            <div className="space-y-3">
              {GIULIO_CV.interests.map((interest, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-stone-900">{interest.title}</span>
                    <span className="text-amber-800 font-mono font-semibold">{interest.duration}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{interest.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
