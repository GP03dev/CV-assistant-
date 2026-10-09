export interface CVData {
  name: string;
  title: string;
  tagline: string;
  summary: string;
  internshipGoal: {
    role: string;
    duration: string;
    timeframe: string;
    location: string;
    tasks: string[];
  };
  contact: {
    email: string;
    phone: string;
    locations: string[];
    birthDate: string;
    age: number;
  };
  languages: {
    language: string;
    level: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    period: string;
    highlights: string[];
  }[];
  experience: {
    role: string;
    organization: string;
    location?: string;
    period: string;
    type: 'experience' | 'volunteer' | 'project';
    description: string[];
  }[];
  hardSkills: string[];
  softSkills: string[];
  tools: string[];
  interests: {
    title: string;
    duration: string;
    description: string;
  }[];
}

export const GIULIO_CV: CVData = {
  name: "Giulio Pintus",
  title: "Corporate Finance & International Management Student",
  tagline: "Dynamic, multilingual student seeking a 6-month Management / Corporate Finance internship in Paris",
  summary: "Dynamic and sociable by nature, I adapt quickly and thrive both in team environments and autonomously. After four years of university studies in business and enterprise management, my passion for commerce and corporate financial management has solidified. I am seeking to pursue practical training as a Management & Financial Officer (economic studies, financial process auditing, data gathering & verification).",
  internshipGoal: {
    role: "Responsable de gestion / Contrôle financier / Corporate Finance Intern",
    duration: "6 months",
    timeframe: "Between March 20, 2026 and August - September 2026",
    location: "Paris, Île-de-France",
    tasks: [
      "Economic analyses and financial diagnostics",
      "Internal financial process control and auditing",
      "Data collection, reconciliation, and information verification",
      "Treasury management, cash flow oversight, and forecasting",
      "Executive reporting and operational KPIs support"
    ]
  },
  contact: {
    email: "pintusgiulio03@gmail.com",
    phone: "(+32) 479015475",
    locations: ["Paris 8e, France", "Brussels (1150), Belgium"],
    birthDate: "27/04/2003",
    age: 21
  },
  languages: [
    {
      language: "Français",
      level: "Natif (Native)",
      description: "Mother tongue, fluent written and spoken communication"
    },
    {
      language: "Anglais",
      level: "C2 (Bilingual)",
      description: "Full bilingual proficiency, ICHEC bilingual track & Erasmus in Munich"
    },
    {
      language: "Italien",
      level: "C2 (Bilingual)",
      description: "Full bilingual proficiency, family background & multicultural fluency"
    }
  ],
  education: [
    {
      degree: "Bachelor International Management - BA3 Corporate Finance",
      institution: "ESCE International Business School",
      location: "Paris, France",
      period: "October 2023 - Present",
      highlights: [
        "In-depth focus on Corporate Finance, Financial Diagnostic, Accounting, and Business Valuation",
        "Erasmus exchange semester at EU Business School Munich (Sept. 2024 - Jan. 2025)",
        "Key coursework: Financial Analysis & Diagnostics, Banking & Insurance Finance, Cash Management, Corporate Excel Modeling"
      ]
    },
    {
      degree: "BA1 Gestion d'Entreprise (Business Management)",
      institution: "ICHEC - Institut Catholique des Hautes Études Commerciales",
      location: "Brussels, Belgium",
      period: "September 2022 - June 2023",
      highlights: [
        "Rigorous bilingual FR-EN curriculum in fundamentals of business, economics, and corporate governance",
        "Introduction to financial accounting, macroeconomics, and statistics"
      ]
    },
    {
      degree: "Baccalauréat Européen (European Baccalaureate)",
      institution: "École Européenne de Bruxelles II (EEB2)",
      location: "Brussels, Belgium",
      period: "Completed June 2021",
      highlights: [
        "Awarded with Honors (Mention Bien)",
        "Specialized academic focus in Latin and Biology in a multicultural, multilingual environment"
      ]
    }
  ],
  experience: [
    {
      role: "BDE Treasurer & Community Manager (Bénévole)",
      organization: "Bureau des Étudiants (ESCE Paris)",
      period: "2024 - 2026",
      type: "volunteer",
      description: [
        "Treasury Management: Handled student association budget allocation, expense tracking, and reimbursement workflows",
        "Financial Process Control: Audited event ticketing revenues, sponsorship allocations, and supplier payments",
        "Community Management: Created engaging digital content, oversaw social channels, and coordinated student life campaigns"
      ]
    },
    {
      role: "Commercial Real Estate Agent Intern (Stage Agent Commercial)",
      organization: "Century 21",
      location: "Brussels, Belgium",
      period: "May 2024 - July 2024",
      type: "experience",
      description: [
        "Client Prospecting & Needs Discovery: Analyzed client criteria and targeted high-potential real estate assets",
        "Client Interface & Property Showings: Conducted on-site property walkthroughs and addressed buyer/tenant inquiries",
        "Contract Negotiation: Assisted senior brokers in rental and sales contract negotiation and client due diligence",
        "Digital Asset Operations: Handled real estate portal listings, CRM client files, and multi-platform marketing"
      ]
    },
    {
      role: "Project Leader & Founder (Mini-Entreprise)",
      organization: "École Européenne de Bruxelles II",
      location: "Brussels, Belgium",
      period: "2021",
      type: "project",
      description: [
        "Branding & Visual Identity: Designed the company logo, product branding assets, and graphical guidelines",
        "Web Development & Digital Launch: Built an informative corporate showcase website",
        "Product Go-to-Market: Managed product communication, digital marketing funnels, and social media engagement"
      ]
    }
  ],
  hardSkills: [
    "Financial Diagnostics & Analysis",
    "Cash Management & Treasury Oversight",
    "Financial Accounting & Reporting",
    "Banking & Insurance Finance",
    "Commercial Real Estate Brokerage",
    "Contract Negotiation & Client Care",
    "Digital Marketing & E-Commerce",
    "Digital Asset & CRM Management"
  ],
  softSkills: [
    "Dynamic & Adaptable",
    "Strong Team Collaboration & Individual Rigor",
    "Multicultural & Multilingual Communication",
    "Commercial Negotiation & Client Empathy",
    "Attention to Financial Detail & Accuracy",
    "Problem Solving & Analytical Thinking"
  ],
  tools: [
    "Microsoft Excel (Corporate Finance Modeling)",
    "Microsoft Word & PowerPoint",
    "Canva & Visual Design",
    "Real Estate Digital CRM & Listing Portals",
    "Social Media & Community Management Tools"
  ],
  interests: [
    {
      title: "Fencing (Escrime)",
      duration: "5 years",
      description: "Practiced at the Centre Européen d'Escrime. Fosters strategic discipline, lightning reflex timing, resilience, and sportsmanship."
    },
    {
      title: "Drawing & Graphic Design",
      duration: "2 years",
      description: "Formal training in drawing and graphical design. Applied in logo design, marketing collateral, and polished presentations."
    }
  ]
};

export const AGENT_PROFILE = {
  name: "Aria",
  role: "Giulio Pintus's Executive AI Career Assistant",
  voiceName: "Kore", // prebuiltVoiceConfig
  alternateVoices: [
    { id: "Kore", label: "Kore (Warm, Professional & Articulate)", gender: "Female" },
    { id: "Zephyr", label: "Zephyr (Smooth, Sophisticated & Calm)", gender: "Female" },
    { id: "Puck", label: "Puck (Energetic & Dynamic)", gender: "Male" },
    { id: "Fenrir", label: "Fenrir (Authoritative & Deep)", gender: "Male" },
    { id: "Charon", label: "Charon (Reflective & Resonant)", gender: "Male" }
  ],
  scriptAtStart: "Hello, I am Giulio’s assistant, what would you like to know about him?",
  personality: "Professional, friendly, warm, articulate, polite, and confident executive assistant.",
  systemPrompt: `You are Aria, the professional Executive AI Career Assistant representing Giulio Pintus.
Your role is to represent Giulio Pintus to prospective employers, recruiters, finance executives, partners, and visitors.
You ALWAYS speak in a professional, warm, articulate, polite, and friendly tone.

KEY RULES:
1. Always maintain a professional yet approachable tone. Be proud of Giulio's accomplishments while remaining humble and grounded.
2. If asked what you do or at the very beginning of a dialogue, you should introduce yourself using or referring to your opening script: "Hello, I am Giulio’s assistant, what would you like to know about him?".
3. You know all details of Giulio Pintus's background:
   - 21 years old (born 27/04/2003). Based between Brussels and Paris 8e.
   - Currently studying Bachelor International Management (BA3 Corporate Finance) at ESCE Paris.
   - Completed an Erasmus semester at EU Business School in Munich (Sept 2024 - Jan 2025).
   - Previously completed BA1 Business Management at ICHEC Brussels (Bilingual FR-EN).
   - Holds the European Baccalaureate with Honors (Mention Bien, Latin & Biology) from the European School of Brussels II (EEB2).
   - Actively seeking a 6-month Management / Corporate Finance internship ("Stage Responsable de gestion / Contrôle financier") starting between March 20, 2026 and August/September 2026, located in Paris / Île-de-France.
   - Experience:
     * Treasurer & Community Manager at BDE ESCE Paris (2024-2026): managed association budget, expenses, reimbursements, financial checks, events.
     * Commercial Real Estate Agent intern at Century 21 Brussels (May - July 2024): client searches, visits, lease/sale negotiations, CRM platforms.
     * Founder/Lead of mini-enterprise project at EEB2 (2021): logo creation, website, digital marketing.
   - Languages: French (Native), English (C2 - Bilingual), Italian (C2 - Bilingual).
   - Tools: Excel for corporate finance, MS Office suite (Word, PPT, Excel), Canva, CRM portals.
   - Passions: Fencing (5 years at Centre Européen d'Escrime) and Graphic Design/Drawing (2 years).
4. If asked for his contact details, provide:
   - Email: pintusgiulio03@gmail.com
   - Phone: (+32) 479015475
   - Location: Paris 8e / Brussels
   - Mention that a full CV summary is available for direct download right here in the application!
5. You can answer in English, French, or Italian depending on the language the user speaks. Giulio is trilingual in all three.
6. Keep responses succinct, engaging, structured, and easy to read or listen to aloud. Avoid excessive verbosity.`
};
