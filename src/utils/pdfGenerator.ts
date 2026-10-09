import jsPDF from 'jspdf';
import { GIULIO_CV } from '../data/cvData.ts';

export function generateCVPdf(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [180, 83, 9]; // Amber 700 / gold
  const secondaryColor = [71, 85, 105]; // Slate 600
  const darkTextColor = [30, 41, 59];

  let y = 18;
  const margin = 16;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;

  // Header Background accent bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(margin, y - 6, contentWidth, 30, 'F');

  // Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text(GIULIO_CV.name.toUpperCase(), margin + 6, y + 4);

  // Subtitle / Title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(251, 191, 36); // Amber 400
  doc.text('MASTER IN ENTREPRENEURSHIP & CONSULTING | CORPORATE FINANCE | ESCE PARIS', margin + 6, y + 11);

  // Contact info pill inside header
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  const contactText = `Email: ${GIULIO_CV.contact.email}  |  Tel: ${GIULIO_CV.contact.phone}  |  Permis B  |  Paris 8e & Brussels  |  Languages: EN (C2), FR (Native), IT (C2)`;
  doc.text(contactText, margin + 6, y + 18);

  y += 32;

  // Key Achievement Box (Callout)
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14); // Amber 900
  doc.text('VALIDATED 6-MONTH MISSION: CENTURY 21 BRUSSELS — REAL ESTATE, LEGAL & AI LEAD', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(69, 26, 3);
  const goalDesc = `Mission Completed: 360° buyer & seller advisory (from search to notarial closing deed).`;
  const taskDesc = `Legal File Management & AI Implementation: Integrated agency website AI chatbot and dynamic QR-code viewing reservation system.`;
  doc.text(goalDesc, margin + 4, y + 11);
  doc.text(taskDesc, margin + 4, y + 16);

  y += 26;

  // Function to print Section Header
  const renderSectionHeader = (title: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text(title.toUpperCase(), margin, y);

    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.setLineWidth(0.3);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 7;
  };

  // Section 1: Profile & Executive Summary
  renderSectionHeader('Executive Profile & Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const profileLines = doc.splitTextToSize(
    "Dynamic, entrepreneurial, and highly adaptable professional currently pursuing a Master in Entrepreneurship & Consulting at ESCE Paris, following a Bachelor in International Management (BA3 Corporate Finance) and 4 years of rigorous business education. Combines high-level strategic advisory, organizational diagnostics, and corporate financial modeling with hands-on commercial negotiation and AI systems implementation. Trilingual in English (C2), French (Native), and Italian (C2).",
    contentWidth
  );
  doc.text(profileLines, margin, y);
  y += profileLines.length * 4.2 + 4;

  // Section 2: Education & Degrees
  renderSectionHeader('Education & Academic Background');
  GIULIO_CV.education.forEach((edu) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(edu.degree, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const rightInfo = `${edu.institution} (${edu.location}) — ${edu.period}`;
    doc.text(rightInfo, margin + contentWidth, y, { align: 'right' });

    y += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    edu.highlights.forEach((h) => {
      doc.text(`• ${h}`, margin + 3, y);
      y += 3.7;
    });
    y += 1.5;
  });

  y += 2;

  // Section 3: Professional Experience & Leadership
  renderSectionHeader('Professional Experience & Leadership');
  GIULIO_CV.experience.forEach((exp) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(exp.role, margin, y);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const rightExp = `${exp.organization}${exp.location ? ` (${exp.location})` : ''} — ${exp.period}`;
    doc.text(rightExp, margin + contentWidth, y, { align: 'right' });

    y += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
    exp.description.forEach((d) => {
      doc.text(`• ${d}`, margin + 3, y);
      y += 3.7;
    });
    y += 1.5;
  });

  y += 2;

  // Section 4: Skills, Tools & Passions (Two Columns)
  renderSectionHeader("Key Competencies & Passions");
  const colWidth = (contentWidth - 6) / 2;

  // Left Column: Skills & Tools
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Financial & Digital Competencies:', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const skillList = [
    '• Financial analysis & diagnostics, corporate accounting',
    '• Treasury oversight & cash management',
    '• Excel modeling for corporate finance, MS Office suite',
    '• Commercial negotiation, CRM platforms & AI chatbots'
  ];
  let leftY = y + 4;
  skillList.forEach((s) => {
    doc.text(s, margin + 2, leftY);
    leftY += 3.8;
  });

  // Right Column: Languages & Hobbies
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Languages & Interests:", margin + colWidth + 6, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const rightList = [
    '• English (C2 Bilingual), French (Native), Italian (C2 Bilingual)',
    '• Fencing: 5 years at European Fencing Centre (discipline & strategy)',
    '• Drawing & Graphic Design: 2 years formal training (visual branding)',
    '• Mobility: Paris (8e) & Brussels'
  ];
  let rightY = y + 4;
  rightList.forEach((r) => {
    doc.text(r, margin + colWidth + 8, rightY);
    rightY += 3.8;
  });

  // Footer note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(
    'Certified CV Resume Summary generated by Aria — Giulio Pintus\'s Official AI Career Assistant | pintusgiulio03@gmail.com',
    pageWidth / 2,
    290,
    { align: 'center' }
  );

  // Trigger download
  doc.save('Giulio_Pintus_CV_Resume_Summary.pdf');
}

export function downloadMarkdownSummary(): void {
  const md = `# GIULIO PINTUS — CURRICULUM VITAE SUMMARY
**Master's Student in Entrepreneurship & Consulting | Corporate Finance**
Contact: ${GIULIO_CV.contact.email} | ${GIULIO_CV.contact.phone}
Base: Paris 8e, France & Brussels, Belgium | Born: 27/04/2003 (21 years old)
Mobility & License: Permis B (Clean European Driving License - Fully Mobile)

---

## KEY ACCOMPLISHMENT: 6-MONTH VALIDATED MISSION (CENTURY 21)
- **Role:** Real Estate Advisor, Legal & Operations Administrator & AI Lead
- **Organization:** Century 21 Brussels (6 Months Completed with High Responsibilities)
- **Missions & Accomplishments:**
  - **360° Client Advisory:** Comprehensive guidance for buyers (search, visits, purchase offers) and sellers (valuation, mandates, closing) through notarial deed signing.
  - **Legal & Administrative Management:** Drafted sales agreements (compromis de vente), lease contracts, verified financial solvency files, and coordinated with Brussels notaries.
  - **Artificial Intelligence Implementation:** Designed and deployed an intelligent AI chatbot on the agency website for 24/7 lead qualification.
  - **Visit Digitalization (Dynamic QR Codes):** Implemented interactive QR codes on agency vitrines for instant online viewing appointment scheduling.

---

## EDUCATION & DEGREES
- **Master in Entrepreneurship and Consulting** | ESCE International Business School, Paris (Currently Enrolled / 2025 - Present)
  - Strategic consulting, organizational diagnostics, business modeling, and growth strategy.
- **Bachelor International Management - BA3 Corporate Finance** | ESCE International Business School, Paris (Oct. 2023 - 2025)
  - *Erasmus Academic Exchange:* EU Business School, Munich (Sept. 2024 - Jan. 2025)
  - Financial analysis & diagnostics, Banking & insurance finance, Corporate accounting, Cash management, Excel financial modeling.
- **BA1 Business Management (Gestion d'Entreprise)** | ICHEC Brussels (Sept. 2022 - June 2023)
  - Bilingual French-English curriculum in management, economics, and applied statistics.
- **European Baccalaureate (Baccalauréat Européen)** | European School of Brussels II (June 2021)
  - Awarded with Honors (Mention Bien) — Academic focus in Latin & Biology.

---

## EXPERIENCE & LEADERSHIP
- **Real Estate Advisor, Legal & Operations Administrator & AI Lead (6-Month Mission)** | Century 21 Brussels (Validated)
  - 360° buyer/seller guidance, sales contracts, leases, AI website chatbot, dynamic QR code visit scheduling.
- **Volunteer — Treasurer & Community Manager** | Student Council (ESCE Paris, 2024 - 2026)
  - Managed association budget, financial checks, expense reimbursement approvals, and supplier payments.
  - Audited event ticketing revenues and oversaw digital community management.
- **Founder & Project Lead (Mini-Enterprise)** | European School of Brussels II (2021)
  - Created branding assets, designed showcase corporate website, and drove digital marketing campaigns.

---

## LANGUAGES & TOOLS
- **Languages:** English (C2 Bilingual), French (Native), Italian (C2 Bilingual).
- **Tools:** Excel (Corporate Finance Modeling), MS Office Suite (Word, PPT), Canva, Real Estate Portals & CRM Systems.

## PERSONAL INTERESTS
- **Fencing:** 5 years at Centre Européen d'Escrime (strategic discipline, reflexes, perseverance).
- **Drawing & Graphic Design:** 2 years formal training (visual identity, aesthetic sensibility).
`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Giulio_Pintus_CV_Summary.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
