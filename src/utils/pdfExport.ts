import { jsPDF } from 'jspdf';
import { CalculatorConfig } from '../data/calculatorsData';
import { SUPPORTED_CURRENCIES } from '../data/currenciesData';

interface PDFExportParams {
  calculator: CalculatorConfig;
  inputs: Record<string, any>;
  results: {
    metrics: Array<{
      label: string;
      value: string | number;
      desc?: string;
      isPrimary?: boolean;
    }>;
    explanationText?: string;
  };
  currency: string;
}

export function generateCalculatorPDF({
  calculator,
  inputs,
  results,
  currency,
}: PDFExportParams) {
  // Create PDF in A4 format (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;
  const contentWidth = pageWidth - marginX * 2; // 170mm

  let currentY = 20;

  // Colors
  const slateColor = [15, 23, 42]; // #0f172a
  const emeraldColor = [5, 150, 105]; // #059669
  const grayColor = [100, 116, 139]; // #64748b
  const lightGrayBg = [248, 250, 252]; // #f8fafc
  const borderColor = [226, 232, 240]; // #e2e8f0

  // Helper: check page space and auto-page
  const checkPageSpace = (heightNeeded: number) => {
    if (currentY + heightNeeded > pageHeight - 20) {
      doc.addPage();
      currentY = 20;
      drawPageDecorations();
    }
  };

  // Helper: draw header and footer decorations on every page
  const drawPageDecorations = () => {
    // Top header band (subtle accent line)
    doc.setDrawColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
    doc.setLineWidth(1);
    doc.line(marginX, 12, pageWidth - marginX, 12);

    // Footer lines and info
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.5);
    doc.line(marginX, pageHeight - 15, pageWidth - marginX, pageHeight - 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    
    // Left-aligned footer
    doc.text('FutureFund | Personal Wealth Modeling Platform', marginX, pageHeight - 10);
    
    // Right-aligned footer
    const dateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(dateStr, pageWidth - marginX - 25, pageHeight - 10);
  };

  // Format Helper
  const getDisplayValue = (val: any, field?: { isCurrency?: boolean; isPercent?: boolean }) => {
    if (val === undefined || val === null) return '';
    if (field?.isCurrency) {
      const symbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
      return `${symbol}${Number(val).toLocaleString()}`;
    }
    if (field?.isPercent) {
      return `${val}%`;
    }
    return String(val);
  };

  const getMetricDisplayValue = (val: string | number) => {
    if (typeof val === 'number') {
      const symbol = SUPPORTED_CURRENCIES[currency]?.symbol || '$';
      return `${symbol}${val.toLocaleString()}`;
    }
    return String(val);
  };

  // --- Start Generation ---
  drawPageDecorations();

  // 1. Brand Logo & Metadata
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
  doc.text('FUTUREFUND', marginX, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  doc.text('FINANCIAL REPORT', pageWidth - marginX - 35, currentY);

  currentY += 10;

  // 2. Title & Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
  doc.text(calculator.name.toUpperCase(), marginX, currentY);
  currentY += 8;

  // Description
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
  const splitDesc = doc.splitTextToSize(calculator.metaDesc, contentWidth);
  doc.text(splitDesc, marginX, currentY);
  currentY += (splitDesc.length * 4.5) + 12;

  // 3. Inputs Section
  checkPageSpace(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
  doc.text('INPUT PARAMETERS', marginX, currentY);
  currentY += 6;

  // Table header
  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setLineWidth(0.5);
  doc.setFillColor(lightGrayBg[0], lightGrayBg[1], lightGrayBg[2]);
  doc.rect(marginX, currentY, contentWidth, 8, 'F');
  doc.line(marginX, currentY, marginX + contentWidth, currentY);
  doc.line(marginX, currentY + 8, marginX + contentWidth, currentY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
  doc.text('Parameter Label', marginX + 4, currentY + 5.5);
  doc.text('Value Entered', marginX + 110, currentY + 5.5);
  
  currentY += 8;

  // Table rows
  calculator.fields.forEach((field, index) => {
    checkPageSpace(10);
    
    // Alternating rows bg
    if (index % 2 === 1) {
      doc.setFillColor(lightGrayBg[0], lightGrayBg[1], lightGrayBg[2]);
      doc.rect(marginX, currentY, contentWidth, 8, 'F');
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
    doc.text(field.label, marginX + 4, currentY + 5.5);
    
    const displayVal = getDisplayValue(inputs[field.key], field);
    doc.text(displayVal, marginX + 110, currentY + 5.5);

    doc.line(marginX, currentY + 8, marginX + contentWidth, currentY + 8);
    currentY += 8;
  });

  currentY += 10;

  // 4. Primary Results & Projections Section
  checkPageSpace(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
  doc.text('CALCULATED OUTCOMES', marginX, currentY);
  currentY += 6;

  // Find primary metrics
  const primaryMetrics = results.metrics.filter(m => m.isPrimary);
  const secondaryMetrics = results.metrics.filter(m => !m.isPrimary);

  if (primaryMetrics.length > 0) {
    // Generate beautiful highlight cards for primary metrics
    checkPageSpace(25);
    const cardWidth = (contentWidth - (primaryMetrics.length - 1) * 6) / primaryMetrics.length;
    
    primaryMetrics.forEach((m, idx) => {
      const cardX = marginX + idx * (cardWidth + 6);
      
      // Card Background
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.setDrawColor(167, 243, 208); // emerald-200
      doc.setLineWidth(0.5);
      doc.rect(cardX, currentY, cardWidth, 20, 'FD');
      
      // Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
      doc.text(m.label.toUpperCase(), cardX + 4, currentY + 5);
      
      // Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
      doc.text(getMetricDisplayValue(m.value), cardX + 4, currentY + 12);

      // Brief Description
      if (m.desc) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        const mDescSplit = doc.splitTextToSize(m.desc, cardWidth - 8);
        doc.text(mDescSplit[0] || '', cardX + 4, currentY + 17);
      }
    });
    
    currentY += 26;
  }

  // Draw remaining metrics list
  if (secondaryMetrics.length > 0) {
    checkPageSpace(15);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
    doc.text('Key Performance Indicators (KPIs)', marginX, currentY);
    currentY += 5;

    // Table header
    doc.setFillColor(lightGrayBg[0], lightGrayBg[1], lightGrayBg[2]);
    doc.rect(marginX, currentY, contentWidth, 7, 'F');
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.5);
    doc.line(marginX, currentY, marginX + contentWidth, currentY);
    doc.line(marginX, currentY + 7, marginX + contentWidth, currentY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
    doc.text('Metric Name', marginX + 4, currentY + 5);
    doc.text('Value', marginX + 110, currentY + 5);
    
    currentY += 7;

    secondaryMetrics.forEach((m, index) => {
      checkPageSpace(12);
      
      // Alternating rows bg
      if (index % 2 === 1) {
        doc.setFillColor(lightGrayBg[0], lightGrayBg[1], lightGrayBg[2]);
        doc.rect(marginX, currentY, contentWidth, 8, 'F');
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
      doc.text(m.label, marginX + 4, currentY + 5.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      if (m.desc) {
        doc.text(`- ${m.desc}`, marginX + 4 + doc.getTextWidth(m.label) + 2, currentY + 5.5);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
      doc.text(getMetricDisplayValue(m.value), marginX + 110, currentY + 5.5);

      doc.line(marginX, currentY + 8, marginX + contentWidth, currentY + 8);
      currentY += 8;
    });
  }

  currentY += 10;

  // 5. Explanation / Analysis Insights Callout
  if (results.explanationText) {
    const formattedExplanation = results.explanationText.replace(/[\n\r]+/g, ' ').trim();
    const splitExplanation = doc.splitTextToSize(formattedExplanation, contentWidth - 10);
    const boxHeight = (splitExplanation.length * 4.5) + 12;

    checkPageSpace(boxHeight + 10);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
    doc.text('STRATEGIC EXPLANATION & NEXT STEPS', marginX, currentY);
    currentY += 6;

    // Draw Callout Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(marginX, currentY, contentWidth, boxHeight, 'F');
    
    // Draw thick emerald accent bar on the left
    doc.setFillColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
    doc.rect(marginX, currentY, 3, boxHeight, 'F');

    // Draw subtle border around the rest
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.5);
    doc.line(marginX + 3, currentY, marginX + contentWidth, currentY);
    doc.line(marginX + contentWidth, currentY, marginX + contentWidth, currentY + boxHeight);
    doc.line(marginX + 3, currentY + boxHeight, marginX + contentWidth, currentY + boxHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(slateColor[0], slateColor[1], slateColor[2]);
    doc.text(splitExplanation, marginX + 8, currentY + 7);
    
    currentY += boxHeight;
  }

  // --- Download ---
  const safeTitle = calculator.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  doc.save(`futurefund-${safeTitle}-report.pdf`);
}
