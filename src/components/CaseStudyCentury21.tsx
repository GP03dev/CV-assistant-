import React from 'react';
import {
  Building2,
  Bot,
  QrCode,
  FileCheck,
  Users2,
  TrendingUp,
  Sparkles,
  Download,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass
} from 'lucide-react';
import { generateCVPdf } from '../utils/pdfGenerator.ts';

interface Props {
  onAskAria: (prompt: string) => void;
}

export const CaseStudyCentury21: React.FC<Props> = ({ onAskAria }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header for Case Study */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-[#E6DDD2] p-8 sm:p-10 shadow-xs">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-3">
            <Building2 className="w-4 h-4" />
            <span>Completed Mission &bull; Century 21 Brussels</span>
            <span className="text-stone-400">&bull;</span>
            <span className="text-emerald-800 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 6-Month Internship Validated
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
            360° Real Estate Advisory, Legal Rigor & AI Transformation
          </h2>

          <p className="text-stone-600 mt-4 text-base leading-relaxed">
            During his 6-month mission at Century 21 real estate agency in Brussels, Giulio combined high-end client care, rigorous administrative and legal management, and the concrete implementation of Artificial Intelligence solutions to modernize the buyer and seller journey.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-[#EFE8DE]">
            <button
              onClick={() =>
                onAskAria(
                  "Explain in detail how Giulio implemented AI at Century 21 (Chatbot and QR codes) and how he guided clients from search to purchase."
                )
              }
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Aria about this mission</span>
            </button>

            <button
              onClick={() => generateCVPdf()}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] text-stone-800 font-semibold text-xs sm:text-sm border border-[#E2D8C9] transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-amber-700" />
              <span>Download CV Summary (PDF)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Giulio's 6-Month Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Full 360° Client Accompaniment */}
        <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-7 relative group hover:border-amber-400/80 transition-all shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-5">
            <Users2 className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-stone-900 mb-2">
            1. 360° Client Advisory (Buyers & Sellers)
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            End-to-end management of client relations, from initial criteria discovery and property viewings to final deed signing with the notary.
          </p>

          <ul className="space-y-2.5 text-xs text-stone-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>For Buyers:</strong> Deep requirement mapping, curated property matching, guided walkthroughs, financial simulations, and loan feasibility guidance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>For Sellers:</strong> Market valuations, mandate negotiations, visual asset preparation, and strategic property marketing.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Closing & Mediation:</strong> Managing purchase offers, counter-proposals, and resolving conflicting expectations to achieve win-win agreements.
              </span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Heavy Administration & Legal Compliance */}
        <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-7 relative group hover:border-amber-400/80 transition-all shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-5">
            <FileCheck className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-stone-900 mb-2">
            2. In-Depth Administrative & Legal File Management
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            Meticulous oversight of all contractual agreements and legal requirements crucial for flawless transaction closing.
          </p>

          <ul className="space-y-2.5 text-xs text-stone-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Contract Drafting:</strong> Prepared sales agreements (compromis de vente), lease contracts, and regulatory addenda.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Solvency Audits:</strong> Collected, reviewed, and audited buyer financial records and mortgage pre-approvals.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Notary Coordination:</strong> Tracked conditions precedent deadlines and acted as the liaison between buyers, sellers, and Brussels notary offices.
              </span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: AI Website Chatbot */}
        <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-7 relative group hover:border-amber-400/80 transition-all shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-5">
            <Bot className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-stone-900 mb-2">
            3. AI Chatbot Deployment on Agency Website
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            Introduced generative AI to automate prospective buyer and seller reception and lead qualification 24/7 without missing business opportunities.
          </p>

          <ul className="space-y-2.5 text-xs text-stone-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Round-the-Clock Qualification:</strong> Captured criteria, budget ranges, location preferences, and purchase timelines dynamically.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Instant Listing Matching:</strong> Directed qualified inquiries to corresponding properties in the agency's portfolio.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Efficiency Gains:</strong> Provided advisors with synthesized, pre-vetted prospect briefing sheets prior to callbacks.
              </span>
            </li>
          </ul>
        </div>

        {/* Pillar 4: QR Codes for Instant Walkthrough Booking */}
        <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-7 relative group hover:border-amber-400/80 transition-all shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-5">
            <QrCode className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-bold text-stone-900 mb-2">
            4. Digitalized Visit Scheduling via Dynamic QR Codes
          </h3>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            Eliminated friction between physical agency storefront displays and online walkthrough appointment scheduling.
          </p>

          <ul className="space-y-2.5 text-xs text-stone-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>One-Scan Booking:</strong> QR codes on vitrine property displays allowed passersby to pick their viewing slot in under 30 seconds.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Calendar Synchronization:</strong> Connected directly to agent schedules to prevent booking conflicts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
              <span>
                <strong>Conversion Surge:</strong> Significantly boosted the volume of qualified viewings on exclusive listing mandates.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Visual Workflow */}
      <div className="bg-white border border-[#E6DDD2] rounded-3xl p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-stone-900 mb-2">
          The Digitalized Customer Journey Deployed by Giulio
        </h3>
        <p className="text-xs text-stone-500 mb-6">
          Operational workflow uniting high-touch human expertise and automated digital touchpoints.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <div className="text-amber-800 font-mono text-xs font-bold mb-1">STEP 1</div>
            <div className="text-sm font-bold text-stone-900">Discovery & QR Scan</div>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Prospect scans storefront QR code or engages with the AI Chatbot on the Century 21 website.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <div className="text-amber-800 font-mono text-xs font-bold mb-1">STEP 2</div>
            <div className="text-sm font-bold text-stone-900">AI Lead Qualification</div>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              AI captures criteria, preliminary financial qualifications, and suggests immediate visit slots.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <div className="text-amber-800 font-mono text-xs font-bold mb-1">STEP 3</div>
            <div className="text-sm font-bold text-stone-900">Guided Visit & Negotiation</div>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Personalized walkthrough on site guided by Giulio, debriefing both parties and securing the purchase offer.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD3]">
            <div className="text-amber-800 font-mono text-xs font-bold mb-1">STEP 4</div>
            <div className="text-sm font-bold text-stone-900">Legal Drafting & Closing</div>
            <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
              Rigorous drafting of the sales agreement, compliance checks, and smooth transfer to the notary office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
