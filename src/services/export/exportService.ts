import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { CvDocument, CoverLetter, JobPosting, InterviewFeedback } from '../../types';

export class ExportService {
  /**
   * Export CV rendered DOM element directly to a high-quality PDF
   */
  public static async exportCvElementToPdf(element: HTMLElement, defaultFilename?: string): Promise<void> {
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 5) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(defaultFilename || `CV_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error('Error rendering HTML to PDF canvas:', err);
    }
  }

  /**
   * Export CV to downloadable PDF file (supports both visual DOM capture & fallback text jsPDF)
   */
  public static async exportCvPdf(cv: CvDocument, targetElement?: HTMLElement | null): Promise<void> {
    const filename = `CV_${(cv.contact.fullName || 'Document').replace(/\s+/g, '_')}_${cv.language || 'sv'}.pdf`;

    // Priority 1: Visual DOM capture if element provided or element found by ID
    const elem = targetElement || document.getElementById('cv-rendered-document');
    if (elem) {
      await ExportService.exportCvElementToPdf(elem, filename);
      return;
    }

    // Priority 2: Structured jsPDF fallback
    const doc = new jsPDF();
    let y = 20;

    // Title / Header
    doc.setFontSize(22);
    doc.text(cv.contact.fullName || 'CURRICULUM VITAE', 105, y, { align: 'center' });
    y += 10;

    doc.setFontSize(10);
    const contactLine = `${cv.contact.email || ''} | ${cv.contact.phone || ''} | ${cv.contact.city || ''}`;
    doc.text(contactLine, 105, y, { align: 'center' });
    y += 12;

    // Divider
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;

    // Summary
    if (cv.summary) {
      doc.setFontSize(14);
      doc.text(cv.language === 'sv' ? 'PROFIL' : cv.language === 'en' ? 'PROFILE' : 'الملخص المهني', 20, y);
      y += 6;
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(cv.summary, 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 6 + 6;
    }

    // Work Experience
    if (cv.experiences && cv.experiences.length > 0) {
      doc.setFontSize(14);
      doc.text(cv.language === 'sv' ? 'ARBETSLIVSERFARENHET' : cv.language === 'en' ? 'WORK EXPERIENCE' : 'الخبرة العملية', 20, y);
      y += 8;

      cv.experiences.forEach(exp => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(11);
        doc.text(`${exp.title} - ${exp.company}`, 20, y);
        doc.setFontSize(9);
        doc.text(`${exp.startDate} - ${exp.isCurrent ? (cv.language === 'sv' ? 'Nutid' : 'Present') : exp.endDate}`, 190, y, { align: 'right' });
        y += 6;

        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, 165);
          doc.text(descLines, 25, y);
          y += descLines.length * 5 + 4;
        }
      });
      y += 4;
    }

    // Education
    if (cv.education && cv.education.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.text(cv.language === 'sv' ? 'UTBILDNING' : cv.language === 'en' ? 'EDUCATION' : 'التعليم والدورات', 20, y);
      y += 8;

      cv.education.forEach(edu => {
        doc.setFontSize(11);
        doc.text(`${edu.degree} - ${edu.institution}`, 20, y);
        doc.setFontSize(9);
        doc.text(edu.year, 190, y, { align: 'right' });
        y += 6;
      });
      y += 4;
    }

    // Skills
    if (cv.skills && cv.skills.length > 0) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.text(cv.language === 'sv' ? 'FÄRDIGHETER' : cv.language === 'en' ? 'SKILLS' : 'المهارات', 20, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(cv.skills.join(' • '), 20, y);
      y += 10;
    }

    // Languages
    if (cv.languages && cv.languages.length > 0) {
      doc.setFontSize(14);
      doc.text(cv.language === 'sv' ? 'SPRÅK' : cv.language === 'en' ? 'LANGUAGES' : 'اللغات', 20, y);
      y += 6;
      doc.setFontSize(10);
      const langStr = (cv.languages || []).map(l => `${l.language} (${l.level})`).join(' • ');
      doc.text(langStr, 20, y);
    }

    doc.save(filename);
  }

  /**
   * Export CV to downloadable DOCX file
   */
  public static async exportCvDocx(cv: CvDocument): Promise<void> {
    const children: Array<Paragraph> = [];

    // Header Name
    children.push(
      new Paragraph({
        text: cv.contact.fullName || 'CURRICULUM VITAE',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      })
    );

    // Contact info
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: `${cv.contact.email || ''}  |  ${cv.contact.phone || ''}  |  ${cv.contact.city || ''}`,
            size: 20
          })
        ]
      })
    );

    children.push(new Paragraph({ text: '' }));

    // Profile Summary
    if (cv.summary) {
      children.push(
        new Paragraph({
          text: cv.language === 'sv' ? 'PROFIL' : cv.language === 'en' ? 'PROFILE' : 'الملخص المهني',
          heading: HeadingLevel.HEADING_1
        })
      );
      children.push(new Paragraph({ text: cv.summary }));
      children.push(new Paragraph({ text: '' }));
    }

    // Experiences
    if (cv.experiences && cv.experiences.length > 0) {
      children.push(
        new Paragraph({
          text: cv.language === 'sv' ? 'ARBETSLIVSERFARENHET' : cv.language === 'en' ? 'WORK EXPERIENCE' : 'الخبرة العملية',
          heading: HeadingLevel.HEADING_1
        })
      );

      cv.experiences.forEach(exp => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${exp.title} - ${exp.company}`, bold: true, size: 22 }),
              new TextRun({ text: `  (${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate})`, italics: true, size: 20 })
            ]
          })
        );
        if (exp.description) {
          children.push(new Paragraph({ text: exp.description }));
        }
        children.push(new Paragraph({ text: '' }));
      });
    }

    // Education
    if (cv.education && cv.education.length > 0) {
      children.push(
        new Paragraph({
          text: cv.language === 'sv' ? 'UTBILDNING' : cv.language === 'en' ? 'EDUCATION' : 'التعليم والدورات',
          heading: HeadingLevel.HEADING_1
        })
      );

      cv.education.forEach(edu => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.degree} - ${edu.institution}`, bold: true, size: 22 }),
              new TextRun({ text: `  (${edu.year})`, italics: true, size: 20 })
            ]
          })
        );
      });
      children.push(new Paragraph({ text: '' }));
    }

    // Skills
    if (cv.skills && cv.skills.length > 0) {
      children.push(
        new Paragraph({
          text: cv.language === 'sv' ? 'FÄRDIGHETER' : cv.language === 'en' ? 'SKILLS' : 'المهارات',
          heading: HeadingLevel.HEADING_1
        })
      );
      children.push(new Paragraph({ text: cv.skills.join(', ') }));
    }

    const doc = new Document({
      sections: [{ properties: {}, children }]
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${cv.contact.fullName.replace(/\s+/g, '_') || 'Document'}_${cv.language}.docx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export Cover Letter to downloadable PDF
   */
  public static exportCoverLetterPdf(letter: CoverLetter): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Personligt Brev - ${letter.jobTitle}`, 20, 20);
    doc.setFontSize(10);
    doc.text(`Företag: ${letter.company}`, 20, 28);

    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    doc.setFontSize(10);
    const lines = doc.splitTextToSize(letter.content, 170);
    doc.text(lines, 20, 40);

    doc.save(`Personligt_Brev_${letter.company.replace(/\s+/g, '_')}.pdf`);
  }

  /**
   * Export Saved Jobs List to CSV
   */
  public static exportJobsCsv(jobs: JobPosting[]): void {
    const headers = ['Title', 'Company', 'Location', 'Employment Type', 'Work Mode', 'Source', 'URL', 'Status'];
    const rows = jobs.map(j => [
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      `"${j.location.replace(/"/g, '""')}"`,
      `"${j.employmentType}"`,
      `"${j.workMode}"`,
      `"${j.sourceName}"`,
      `"${j.sourceUrl}"`,
      `"${j.status}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Saved_Jobs_Sweden_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Export Interview Feedback PDF
   */
  public static exportInterviewReportPdf(sessionTitle: string, feedbackList: InterviewFeedback[]): void {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text('تقرير تقييم المقابلة الشخصية', 105, y, { align: 'center' });
    y += 10;
    doc.setFontSize(11);
    doc.text(`الجلسة: ${sessionTitle}`, 105, y, { align: 'center' });
    y += 12;

    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;

    feedbackList.forEach((fb, idx) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.text(`سؤال ${idx + 1}: ${fb.question}`, 20, y);
      y += 7;

      doc.setFontSize(9);
      doc.text(`درجة الصلة: ${fb.relevance}/100 | الوضوح: ${fb.clarity}/100 | التحديد: ${fb.specificity}/100`, 20, y);
      y += 7;

      if (fb.strengths && fb.strengths.length > 0) {
        doc.text(`نقاط القوة: ${fb.strengths.join(' ، ')}`, 20, y);
        y += 6;
      }

      if (fb.improvements && fb.improvements.length > 0) {
        doc.text(`نقاط التحسين: ${fb.improvements.join(' ، ')}`, 20, y);
        y += 6;
      }

      y += 6;
    });

    doc.save(`Interview_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}
