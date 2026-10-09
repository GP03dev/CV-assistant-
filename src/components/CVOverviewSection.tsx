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
  Printer
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Official Candidate Profile & Verified CV
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {GIULIO_CV.name}
            </h1>
            <p className="text-base sm:text-lg text-amber-200/90 font-medium mt-1">
              {GIULIO_CV.title}
            </p>
            <p className="text-sm text-slate-300 max-w-2xl mt-3 leading-relaxed">
              {GIULIO_CV.summary}
            </p>

            {/* Contact quick strip */}
            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-300">
              <button
                onClick={() => copyToClipboard(GIULIO_CV.contact.email, 'email')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer group"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{GIULIO_CV.contact.email}</span>
                {copiedEmail ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-white" />
                )}
              </button>

              <button
                onClick={() => copyToClipboard(GIULIO_CV.contact.phone, 'phone')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer group"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{GIULIO_CV.contact.phone}</span>
                {copiedPhone ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-white" />
                )}
              </button>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{GIULIO_CV.contact.locations.join(' & ')}</span>
              </div>
            </div>
          </div>

          {/* Download Action Cluster */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto min-w-[220px]">
            <button
              onClick={() => generateCVPdf()}
              className="flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download CV Summary (PDF)</span>
            </button>

            <button
              onClick={() => downloadMarkdownSummary()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Markdown CV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-800 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save View</span>
            </button>
          </div>
        </div>

        {/* Highlighted Internship Search Card */}
        <div className="mt-6 bg-slate-950/70 border border-amber-500/30 rounded-xl p-5 relative">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-amber-400" />
              Target Internship Objective & Availability
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold">
              Available 20 March - Sept 2026
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">
            {GIULIO_CV.internshipGoal.role} ({GIULIO_CV.internshipGoal.duration})
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            <strong>Timing:</strong> {GIULIO_CV.internshipGoal.timeframe} &bull;{' '}
            <strong>Location:</strong> {GIULIO_CV.internshipGoal.location}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80">
            {GIULIO_CV.internshipGoal.tasks.map((task, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Complete Overview
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'education'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Education & Exchange
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'experience'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Experience & Leadership
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'skills'
              ? 'bg-amber-500 text-slate-950'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Education & Formations</h2>
                    <p className="text-xs text-slate-400">4 years of university business & corporate finance studies</p>
                  </div>
                </div>
                {onAskAboutTopic && (
                  <button
                    onClick={() => onAskAboutTopic("Tell me about Giulio's education at ESCE and his Erasmus semester in Munich")}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
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
                    className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="text-sm font-bold text-white">{item.degree}</h3>
                      <span className="text-xs font-mono text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded">
                        {item.period}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mb-2">
                      <span className="font-semibold text-slate-300">{item.institution}</span>
                      <span>&bull;</span>
                      <span>{item.location}</span>
                    </div>
                    <ul className="space-y-1">
                      {item.highlights.map((h, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
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
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Experience & Leadership</h2>
                    <p className="text-xs text-slate-400">Financial association treasury, commercial negotiation & digital</p>
                  </div>
                </div>
                {onAskAboutTopic && (
                  <button
                    onClick={() => onAskAboutTopic("Tell me about Giulio's work at Century 21 and as Treasurer of the ESCE Student Bureau")}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
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
                    className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {exp.type}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mb-2">
                      <span className="font-semibold text-slate-300">{exp.organization}</span>
                      {exp.location && <span> &bull; {exp.location}</span>}
                    </div>
                    <ul className="space-y-1.5">
                      {exp.description.map((desc, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
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
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Languages (Trilingual)</h3>
                <p className="text-xs text-slate-400">Native French + C2 English & Italian</p>
              </div>
            </div>

            <div className="space-y-3">
              {GIULIO_CV.languages.map((lang, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{lang.language}</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {lang.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{lang.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hard Skills & Tools */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Finance & Management Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {GIULIO_CV.hardSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium hover:border-amber-500/40 transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>

            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mt-5 mb-2">
              Software & Digital Tools
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {GIULIO_CV.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Personal Interests / Centered Traits */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-3">Centres d'Intérêt & Mindset</h3>
            <div className="space-y-3">
              {GIULIO_CV.interests.map((interest, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{interest.title}</span>
                    <span className="text-amber-400 font-mono">{interest.duration}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{interest.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
