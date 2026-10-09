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
  completedInternship: {
    agency: string;
    duration: string;
    location: string;
    summary: string;
    achievements: string[];
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
  title: "Master in Entrepreneurship & Consulting | Real Estate & AI Transformation",
  tagline: "Master's student with proven 6-month real estate advisory, administrative management & AI implementation track record",
  summary: "Dynamic and adaptable professional currently pursuing a Master in Entrepreneurship and Consulting at ESCE Paris, following a Bachelor in International Management (BA3 Corporate Finance) and an Erasmus semester at EU Business School in Munich. Giulio successfully completed an intensive 6-month mission at Century 21 real estate agency in Brussels with comprehensive responsibilities: 360° client advisory for buyers and sellers from search to final purchase, extensive administrative and legal file management, and leading digital transformation through AI implementation (website AI chatbot and interactive QR-code booking systems for property walkthroughs).",
  internshipGoal: {
    role: "Century 21 Real Estate Advisory & AI Transformation Mission (6 Months Completed)",
    duration: "6 Months (Successfully Validated)",
    timeframe: "Completed mission with expanded high-level responsibilities",
    location: "Century 21 Brussels & Available in Paris / Brussels",
    tasks: [
      "360° advisory for buyers (targeted search, property visits, price negotiations) and sellers (valuation, mandates, closing)",
      "In-depth administrative and legal management: drafting sales agreements, lease contracts, solvency checks, and notary files",
      "AI implementation in the agency: deployed an intelligent chatbot on the website for 24/7 lead qualification",
      "Client experience digitalization: dynamic QR codes on storefronts and listing displays for instant real-time visit bookings",
      "Strategic transaction management and operational tool modernization across real estate portals"
    ]
  },
  completedInternship: {
    agency: "Century 21 (Brussels)",
    duration: "6 Months (Validated)",
    location: "Brussels, Belgium",
    summary: "6-month mission with expanded responsibilities combining high-end commercial advisory, rigorous administrative management, and technological transformation through Artificial Intelligence.",
    achievements: [
      "Comprehensive 360° client care: Guided buyers from initial criteria to final notarial deed signing, and supported sellers through property valuations, mandates, and negotiations",
      "Heavy administrative and legal management: Drafted sales agreements (compromis de vente), verified legal and financial files, prepared lease contracts, and coordinated with notary offices",
      "Artificial Intelligence implementation: Designed and integrated an AI chatbot on the agency website to qualify prospects and provide instant 24/7 criteria matching",
      "Dynamic QR-code booking system: Deployed interactive QR codes on agency vitrines allowing prospective buyers to scan and schedule viewings immediately online",
      "Digital modernization: Optimized internal CRM workflows and managed multi-platform listing syndication across major real estate portals"
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
      language: "French",
      level: "Native",
      description: "Mother tongue, fluent written and spoken communication"
    },
    {
      language: "English",
      level: "C2 (Bilingual)",
      description: "Full bilingual proficiency, ICHEC bilingual track & Erasmus in Munich"
    },
    {
      language: "Italian",
      level: "C2 (Bilingual)",
      description: "Full bilingual proficiency, family background & multicultural fluency"
    }
  ],
  education: [
    {
      degree: "Master in Entrepreneurship and Consulting",
      institution: "ESCE International Business School",
      location: "Paris, France",
      period: "Currently Enrolled (2025 - Present)",
      highlights: [
        "Specialized in strategic consulting, organizational diagnostics, and entrepreneurial advisory",
        "Business modeling, market disruption analysis, and economic feasibility assessments",
        "Synthesis of corporate finance rigor, growth advisory, and client transformation strategy"
      ]
    },
    {
      degree: "Bachelor International Management - BA3 Corporate Finance",
      institution: "ESCE International Business School",
      location: "Paris, France",
      period: "October 2023 - 2025",
      highlights: [
        "In-depth focus on Corporate Finance, Financial Diagnostic, Accounting, and Business Valuation",
        "Erasmus exchange semester at EU Business School Munich (Sept. 2024 - Jan. 2025)",
        "Key coursework: Financial Analysis & Diagnostics, Banking & Insurance Finance, Cash Management, Corporate Excel Modeling"
      ]
    },
    {
      degree: "BA1 Business Management (Gestion d'Entreprise)",
      institution: "ICHEC - Brussels Management School",
      location: "Brussels, Belgium",
      period: "September 2022 - June 2023",
      highlights: [
        "Rigorous bilingual French-English curriculum in business fundamentals, economics, and corporate governance",
        "Introduction to financial accounting, macroeconomics, and applied statistics"
      ]
    },
    {
      degree: "European Baccalaureate (Baccalauréat Européen)",
      institution: "European School of Brussels II (EEB2)",
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
      role: "BDE Treasurer & Community Manager (Volunteer)",
      organization: "Student Council (ESCE Paris)",
      period: "2024 - 2026",
      type: "volunteer",
      description: [
        "Treasury Management: Handled student association budget allocation, expense tracking, and reimbursement workflows",
        "Financial Process Control: Audited event ticketing revenues, sponsorship allocations, and supplier payments",
        "Community Management: Created engaging digital content, oversaw social channels, and coordinated student life campaigns"
      ]
    },
    {
      role: "Real Estate Advisor, Operations & Legal Administrator & AI Lead (6-Month Internship)",
      organization: "Century 21",
      location: "Brussels, Belgium",
      period: "6 Months (Completed with Expanded Responsibilities)",
      type: "experience",
      description: [
        "360° Client Advisory: Personalized guidance for buyers (needs discovery, property matching through final deed signing) and sellers (valuation, mandates, marketing, negotiations, and closing)",
        "In-depth Administrative & Legal Management: Drafted and monitored sales agreements (compromis de vente), lease contracts, financial solvency audits, cadastral verifications, and notary coordination",
        "Agency AI Implementation: Designed, integrated, and trained an AI chatbot on the agency website to qualify incoming leads 24/7 and match property criteria in real time",
        "Innovative Visit Digitalization: Rolled out dynamic QR codes on agency vitrines and property displays enabling clients to scan and instantly book viewing appointments online",
        "Multi-Platform Operations: Managed property listings across major portals and optimized the agency's internal CRM workflows"
      ]
    },
    {
      role: "Project Leader & Founder (Mini-Enterprise)",
      organization: "European School of Brussels II",
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
    "Strategic Consulting & Advisory Diagnostics",
    "Business Modeling & Growth Strategy",
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
    "Strategic & Entrepreneurial Mindset",
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
   - CURRENT STUDIES: Currently pursuing a Master in Entrepreneurship and Consulting (Master en Entrepreneuriat et Conseil) at ESCE Paris.
   - PREVIOUS DEGREES: Completed Bachelor International Management (BA3 Corporate Finance) at ESCE Paris.
   - Completed an Erasmus semester at EU Business School in Munich (Sept 2024 - Jan 2025).
   - Previously completed BA1 Business Management at ICHEC Brussels (Bilingual FR-EN).
   - Holds the European Baccalaureate with Honors (Mention Bien, Latin & Biology) from the European School of Brussels II (EEB2).
   - INTERNSHIP & CAREER STATUS (CRITICAL UPDATE):
     * Giulio is NO LONGER seeking a 6-month internship! He has ALREADY COMPLETED his 6-month internship at Century 21 real estate agency in Brussels with high-level, expanded responsibilities!
     * Full 360° client accompaniment: Advised both buyers (from initial search and property matching to purchase and notarial signing) and sellers (property valuation, marketing, client negotiations, and transaction closing).
     * Extensive administrative and legal management: Drafted and audited sales agreements (compromis de vente), lease contracts, financial solvability files, cadastral compliance, and notary coordination.
     * AI Implementation & Digital Transformation at the agency:
       - Deployed an intelligent AI chatbot on the agency website to qualify incoming leads 24/7 and assist potential buyers/sellers.
       - Designed and rolled out a dynamic QR code system on agency vitrines and property signs, allowing clients to scan and book property walkthrough visits immediately online.
   - Experience:
     * Completed 6-month Real Estate Advisory, Administrative Management & AI Transformation at Century 21 Brussels.
     * Treasurer & Community Manager at BDE ESCE Paris (2024-2026): managed association budget, expenses, reimbursements, financial checks, events.
     * Founder/Lead of mini-enterprise project at EEB2 (2021): logo creation, website, digital marketing.
   - Languages: French (Native), English (C2 - Bilingual), Italian (C2 - Bilingual).
   - Tools: AI Prompting & Chatbot Integration, QR Code scheduling workflows, Excel for corporate finance, MS Office suite (Word, PPT, Excel), Canva, Real Estate CRM portals.
   - Passions: Fencing (5 years at Centre Européen d'Escrime) and Graphic Design/Drawing (2 years).
4. If asked for his contact details, provide:
   - Email: pintusgiulio03@gmail.com
   - Phone: (+32) 479015475
   - Location: Paris 8e / Brussels
   - Mention that a full CV summary is available for direct download right here in the application!
5. DEFAULT LANGUAGE: Speak and respond in ENGLISH by default. All initial introductions, descriptions, and answers must be in polished, natural English. (If a user explicitly initiates conversation or asks a question in French or Italian, you may reply fluently in that language, but unless explicitly asked otherwise, default to English).
6. Keep responses succinct, engaging, structured, and easy to read or listen to aloud. Avoid excessive verbosity.`
};
