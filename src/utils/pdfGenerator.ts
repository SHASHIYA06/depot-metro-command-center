
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { JobCard } from '@/types/job-card';
import { Issue, AttendanceRecord } from '@/types';

// Helper function to create clean header from camelCase or snake_case
const formatHeader = (header: string): string => {
  return header
    .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
    .trim();
};

// Export a job card to PDF
export const exportJobCardToPDF = (jobCard: JobCard): void => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Job Card', 14, 22);
  
  // Add job card number and date
  doc.setFontSize(12);
  doc.text(`JC No: ${jobCard.jcNo}`, 14, 32);
  doc.text(`Date: ${format(new Date(jobCard.createdAt), 'dd/MM/yyyy')}`, 14, 39);
  
  // Add train and car information
  doc.text(`Train: ${jobCard.trainNo}`, 100, 32);
  doc.text(`Car: ${jobCard.carNo}`, 100, 39);
  
  // Add basic information section
  doc.setFontSize(14);
  doc.setTextColor(70, 102, 198);
  doc.text('Basic Information', 14, 50);
  doc.setDrawColor(70, 102, 198);
  doc.line(14, 52, 196, 52);
  
  // Add basic info as a table
  const basicInfo = [
    ['Maintenance Type', jobCard.maintenanceType],
    ['Issued To', jobCard.issuedTo],
    ['Reporting Location', jobCard.reportingLocation],
    ['Odometer Reading', jobCard.odometerReading.toString()],
    ['Status', jobCard.status.replace('_', ' ')],
    ['System', jobCard.system],
    ['Sub-System', jobCard.subSystem],
  ];
  
  autoTable(doc, {
    startY: 56,
    head: [],
    body: basicInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [70, 102, 198],
    },
    columnStyles: {
      0: {
        cellWidth: 50,
        fontStyle: 'bold',
      }
    }
  });
  
  // Add failure information section
  const currentY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.setTextColor(70, 102, 198);
  doc.text('Failure Information', 14, currentY);
  doc.line(14, currentY + 2, 196, currentY + 2);
  
  // Add failure info as a table
  const failureInfo = [
    ['Failure Description', jobCard.failureDescription],
    ['Failure Name', jobCard.failureName],
    ['Failure Details', jobCard.failureDetails],
    ['Root Cause', jobCard.rootCause],
  ];
  
  if (jobCard.withdraw) {
    failureInfo.push(['Train Withdraw', 'Yes']);
  }
  
  if (jobCard.delay) {
    failureInfo.push(['Delay', 'Yes']);
    if (jobCard.delayTime) {
      failureInfo.push(['Delay Time', jobCard.delayTime]);
    }
  }
  
  autoTable(doc, {
    startY: currentY + 6,
    head: [],
    body: failureInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [70, 102, 198],
    },
    columnStyles: {
      0: {
        cellWidth: 50,
        fontStyle: 'bold',
      }
    }
  });
  
  // Add work details section
  const currentY2 = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.setTextColor(70, 102, 198);
  doc.text('Work Details', 14, currentY2);
  doc.line(14, currentY2 + 2, 196, currentY2 + 2);
  
  // Add work details as a table
  const workInfo = [
    ['Actions Taken', jobCard.actionsTaken],
    ['Components/Parts Changed', jobCard.replaceChange ? 'Yes' : 'No'],
    ['Work Pending', jobCard.workPending ? 'Yes' : 'No'],
  ];
  
  if (jobCard.componentsTakenOutDate) {
    workInfo.push(['Components Taken Out Date', jobCard.componentsTakenOutDate]);
    if (jobCard.componentsTakenOutSerialNo) {
      workInfo.push(['Components Taken Out Serial No', jobCard.componentsTakenOutSerialNo]);
    }
  }
  
  if (jobCard.componentsTakenInDate) {
    workInfo.push(['Components Taken In Date', jobCard.componentsTakenInDate]);
    if (jobCard.componentsTakenInSerialNo) {
      workInfo.push(['Components Taken In Serial No', jobCard.componentsTakenInSerialNo]);
    }
  }
  
  autoTable(doc, {
    startY: currentY2 + 6,
    head: [],
    body: workInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [70, 102, 198],
    },
    columnStyles: {
      0: {
        cellWidth: 50,
        fontStyle: 'bold',
      }
    }
  });
  
  // Add footer with timestamps
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    
    // Add page number
    doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    
    // Add generation timestamp
    const timestamp = `Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`;
    doc.text(timestamp, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
  }
  
  // Save the PDF
  doc.save(`job_card_${jobCard.jcNo.replace(/\s+/g, '_')}.pdf`);
};

// Export multiple job cards to a single PDF
export const exportMultipleJobCardsToPDF = (jobCards: JobCard[]): void => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Job Cards Report', 14, 22);
  
  // Add date range
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 30);
  doc.text(`Total Job Cards: ${jobCards.length}`, 14, 37);
  
  let currentY = 45;
  
  // Add each job card as a summary
  jobCards.forEach((jobCard, index) => {
    // If not enough space for a new card, add a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Add job card header
    doc.setFontSize(14);
    doc.setTextColor(70, 102, 198);
    doc.text(`Job Card: ${jobCard.jcNo}`, 14, currentY);
    doc.line(14, currentY + 2, 196, currentY + 2);
    
    // Add job card summary as a table
    const jobCardSummary = [
      ['Train', jobCard.trainNo],
      ['Car', jobCard.carNo],
      ['System', jobCard.system],
      ['Issue', jobCard.failureDescription.substring(0, 50) + (jobCard.failureDescription.length > 50 ? '...' : '')],
      ['Status', jobCard.status.replace('_', ' ')],
    ];
    
    autoTable(doc, {
      startY: currentY + 6,
      head: [],
      body: jobCardSummary,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: {
          cellWidth: 30,
          fontStyle: 'bold',
        }
      }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
  });
  
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    
    // Add page number
    doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    
    // Add generation timestamp
    const timestamp = `Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`;
    doc.text(timestamp, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
  }
  
  // Save the PDF
  doc.save(`job_cards_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Generic function to export any data to PDF
export const exportDataToPDF = (
  data: any[], 
  title: string, 
  filename: string, 
  columns?: string[]
): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy')}`, 14, 30);
  doc.text(`Total Records: ${data.length}`, 14, 37);
  
  // Prepare table headers and data
  const headers = columns || Object.keys(data[0] || {});
  const formattedHeaders = headers.map(header => formatHeader(header));
  
  const tableData = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      
      // Format dates
      if (value instanceof Date) {
        return format(value, 'dd/MM/yyyy');
      }
      
      // Format arrays
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
      // Format objects
      if (value !== null && typeof value === 'object') {
        return JSON.stringify(value);
      }
      
      return value !== undefined && value !== null ? String(value) : '';
    });
  });
  
  // Create the table
  autoTable(doc, {
    startY: 45,
    head: [formattedHeaders],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [70, 102, 198],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    }
  });
  
  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    
    // Add page number
    doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    
    // Add generation timestamp
    const timestamp = `Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`;
    doc.text(timestamp, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
  }
  
  // Save the PDF with filename
  doc.save(`${filename}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Export an NCR report to PDF
export const exportNCRReportToPDF = (ncrData: any): void => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Non-Conformance Report (NCR)', 14, 22);
  
  // Add NCR number and date
  doc.setFontSize(12);
  doc.text(`NCR No: ${ncrData.ncrReportNo}`, 14, 32);
  doc.text(`Date: ${format(new Date(ncrData.dateOfNcr), 'dd/MM/yyyy')}`, 14, 39);
  
  // Add detection date and item description
  doc.text(`Detection Date: ${format(new Date(ncrData.dateOfDetection), 'dd/MM/yyyy')}`, 100, 32);
  doc.text(`Item: ${ncrData.itemDescription}`, 100, 39);
  
  // Add basic information section
  doc.setFontSize(14);
  doc.setTextColor(70, 102, 198);
  doc.text('Basic Information', 14, 50);
  doc.setDrawColor(70, 102, 198);
  doc.line(14, 52, 196, 52);
  
  // Add basic info as a table
  const basicInfo = [
    ['Description', ncrData.ncrDescription],
    ['Part Number', ncrData.partNumber],
    ['Modified/Unmodified', ncrData.modifiedUnmodified],
    ['Faulty Serial No', ncrData.faultySerialNo],
    ['Healthy Serial No', ncrData.healthySerialNo],
    ['Issued By', ncrData.issuedBy],
    ['Quantity', ncrData.quantity.toString()],
    ['Sub-System', ncrData.subSystem],
    ['Train No', ncrData.trainNo],
    ['Car No', ncrData.carNo]
  ];
  
  autoTable(doc, {
    startY: 56,
    head: [],
    body: basicInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [70, 102, 198],
    },
    columnStyles: {
      0: {
        cellWidth: 50,
        fontStyle: 'bold',
      }
    }
  });
  
  // Add status information section
  const currentY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(14);
  doc.setTextColor(70, 102, 198);
  doc.text('Status Information', 14, currentY);
  doc.line(14, currentY + 2, 196, currentY + 2);
  
  // Add status info as a table
  const statusInfo = [
    ['Responsibility', ncrData.responsibility],
    ['Status', ncrData.status],
    ['Item Repaired/Replaced', ncrData.itemRepairedReplaced || 'N/A'],
    ['Item Replaced Details', ncrData.itemReplacedDetails || 'N/A'],
    ['Date of Repair/Replace', ncrData.dateOfRepairedReplaced ? format(new Date(ncrData.dateOfRepairedReplaced), 'dd/MM/yyyy') : 'N/A'],
    ['Source', ncrData.source],
    ['Date of Investigation Report', ncrData.dateOfInvestigation ? format(new Date(ncrData.dateOfInvestigation), 'dd/MM/yyyy') : 'N/A'],
    ['NCR Closure Date', ncrData.ncrClosureDate ? format(new Date(ncrData.ncrClosureDate), 'dd/MM/yyyy') : 'N/A'],
    ['Gate Pass Number', ncrData.gatePassNumber || 'N/A'],
    ['Remarks', ncrData.remarks || 'N/A'],
  ];
  
  autoTable(doc, {
    startY: currentY + 6,
    head: [],
    body: statusInfo,
    theme: 'striped',
    headStyles: {
      fillColor: [70, 102, 198],
    },
    columnStyles: {
      0: {
        cellWidth: 50,
        fontStyle: 'bold',
      }
    }
  });
  
  // Add footer with timestamps
  const pageCount = doc.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    
    // Add page number
    doc.text(`Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
    
    // Add generation timestamp
    const timestamp = `Generated on ${format(new Date(), 'dd/MM/yyyy HH:mm:ss')}`;
    doc.text(timestamp, doc.internal.pageSize.width - 14, doc.internal.pageSize.height - 10, { align: 'right' });
  }
  
  // Save the PDF
  doc.save(`ncr_report_${ncrData.ncrReportNo.replace(/\s+/g, '_')}.pdf`);
};
