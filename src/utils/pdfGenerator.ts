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
  doc.setFontSize(10.5);
  doc.setTextColor(251, 191, 36); // Amber 400
  doc.text('CORPORATE FINANCE & INTERNATIONAL MANAGEMENT | ESCE PARIS', margin + 6, y + 11);

  // Contact info pill inside header
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  const contactText = `Email: ${GIULIO_CV.contact.email}  |  Tel: ${GIULIO_CV.contact.phone}  |  Paris 8e & Brussels  |  Languages: FR (Natif), EN (C2), IT (C2)`;
  doc.text(contactText, margin + 6, y + 18);

  y += 32;

  // Internship Objective Box (Callout)
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(245, 158, 11); // Amber 500
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(146, 64, 14); // Amber 900
  doc.text('OBJECTIF STAGE : RESPONSABLE DE GESTION / CONTRÔLE FINANCIER (6 MOIS)', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(69, 26, 3);
  const goalDesc = `Disponibilité : 6 mois entre le 20 mars et août-septembre 2026. Localisation : Paris, Île-de-France.`;
  const taskDesc = `Missions ciblées : Études économiques, contrôle des processus financiers, collecte/vérification des informations, gestion de trésorerie.`;
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

  // Section 1: Profil & Synthèse
  renderSectionHeader('Profil & Synthèse Professionnelle');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const profileLines = doc.splitTextToSize(
    "D'un caractère dynamique et sociable, adaptation rapide au travail d'équipe comme autonome. Après quatre années d'études universitaires en commerce et gestion d'entreprise, orientation affirmée vers la finance d'entreprise, l'audit de processus financiers et le contrôle de gestion opérationnel. Bilinguisme complet Français / Anglais (C2) / Italien (C2).",
    contentWidth
  );
  doc.text(profileLines, margin, y);
  y += profileLines.length * 4.2 + 4;

  // Section 2: Formations & Diplômes
  renderSectionHeader('Diplômes & Formations');
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

  // Section 3: Expériences Professionnelles & Engagements
  renderSectionHeader('Expériences Professionnelles & Engagements');
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

  // Section 4: Compétences, Outils & Centres d'intérêt (Two Columns)
  renderSectionHeader("Compétences Clés & Centres d'Intérêt");
  const colWidth = (contentWidth - 6) / 2;

  // Left Column: Skills & Tools
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Compétences Financières & Outils :', margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const skillList = [
    '• Analyses & diagnostics financiers, comptabilité financière',
    '• Gestion de trésorerie & cash management',
    '• Excel pour la finance d’entreprise, MS Office (Word, PPT, Canva)',
    '• Négociation commerciale & plateformes CRM'
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
  doc.text("Langues & Centres d'intérêt :", margin + colWidth + 6, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  const rightList = [
    '• Français (Natif), Anglais (C2 bilingue), Italien (C2 bilingue)',
    '• Escrime : 5 années au Centre Européen d’Escrime (rigueur & stratégie)',
    '• Dessin & Graphisme : 2 années de cours (identité visuelle & Canva)',
    '• Mobilité : Paris & Bruxelles'
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
    'Synthèse de CV certifiée et générée par Aria — Assistant IA Officiel de Giulio Pintus | pintusgiulio03@gmail.com',
    pageWidth / 2,
    290,
    { align: 'center' }
  );

  // Trigger download
  doc.save('Giulio_Pintus_CV_Resume_Summary.pdf');
}

export function downloadMarkdownSummary(): void {
  const md = `# GIULIO PINTUS — CURRICULUM VITAE SUMMARY
**Corporate Finance & International Management Student**
Contact: ${GIULIO_CV.contact.email} | ${GIULIO_CV.contact.phone}
Base: Paris 8e, France & Brussels, Belgium | Born: 27/04/2003 (21 years old)

---

## OBJECTIF PROFESSIONNEL
**Stage Responsable de Gestion / Contrôle Financier (6 mois)**
- **Disponibilité :** 6 mois entre le 20 mars et août-septembre 2026
- **Localisation :** Paris, Île-de-France
- **Missions ciblées :**
  - Études économiques & analyses de rentabilité
  - Contrôle et audit des processus financiers internes
  - Collecte, consolidation et vérification des informations financières
  - Gestion de trésorerie, cash management et suivi des flux

---

## FORMATIONS & DIPLÔMES
- **Bachelor International Management - BA3 Corporate Finance** | ESCE International Business School, Paris (Oct. 2023 - Présent)
  - *Échange académique ERASMUS :* EU Business School, Munich (Sept. 2024 - Janv. 2025)
  - Analyses et diagnostics financiers, Banking & insurance finance, Comptabilité financière, Cash management, Excel d'entreprise.
- **BA1 Gestion d'Entreprise** | ICHEC Brussels (Sept. 2022 - Juin 2023)
  - Cursus bilingue Français - Anglais.
- **Baccalauréat Européen** | École Européenne de Bruxelles II (Juin 2021)
  - Mention Bien — Options Latin & Biologie.

---

## EXPÉRIENCES & ENGAGEMENTS
- **Bénévole — Trésorier & Community Manager** | BDE ESCE Paris (2024 - 2026)
  - Gestion du budget de l'association, validation des flux de trésorerie et notes de frais.
  - Audit des recettes d'événements et billetterie.
  - Stratégie de communication et gestion des réseaux sociaux.
- **Stage Agent Commercial** | Century 21, Bruxelles (Mai 2024 - Juil. 2024)
  - Recherche et qualification de biens immobiliers pour acquéreurs/locataires.
  - Visites clients et négociation de baux et compromis.
  - Gestion des fichiers clients et diffusion sur portails numériques.
- **Projet Micro-Entreprise** | École Européenne de Bruxelles II (2021)
  - Création du logo et de la charte graphique.
  - Conception du site web informatif et marketing digital.

---

## LANGUES & OUTILS
- **Langues :** Français (Natif), Anglais (C2 Bilingue), Italien (C2 Bilingue).
- **Outils :** Excel (modélisation finance), MS Word, PowerPoint, Canva, Portails CRM.

## CENTRES D'INTÉRÊT
- **Escrime :** 5 années au Centre Européen d'Escrime (concentration, stratégie, persévérance).
- **Dessin & Graphisme :** 2 années de cours (sens de l'esthétique et créativité).
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
