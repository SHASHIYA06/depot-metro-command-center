
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportFormat } from '@/types';

/**
 * Generic function to export data to Excel
 * @param data The data to export
 * @param filename The filename to save as
 */
export const exportToExcel = (data: any[], filename: string): void => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Generic function to export data to PDF
 * @param data The data to export
 * @param filename The filename to save as
 * @param title Optional title for the PDF
 * @param columns Optional column definitions for the table
 */
export const exportToPDF = (
  data: any[], 
  filename: string, 
  title: string = 'Report', 
  columns?: string[]
): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  // Add date
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Create table
  if (columns) {
    autoTable(doc, {
      head: [columns],
      body: data.map(item => columns.map(col => item[col])),
      startY: 40,
    });
  } else {
    // If no columns provided, use Object.keys from first item
    if (data.length > 0) {
      const cols = Object.keys(data[0]);
      autoTable(doc, {
        head: [cols],
        body: data.map(item => cols.map(col => item[col])),
        startY: 40,
      });
    }
  }
  
  doc.save(`${filename}.pdf`);
};

/**
 * Function to handle exporting based on the requested format
 * @param format The export format (excel or pdf)
 * @param data The data to export
 * @param filename The filename to save as
 * @param title Optional title for PDF export
 * @param columns Optional column definitions for PDF export
 */
export const handleExport = (
  format: ExportFormat,
  data: any[],
  filename: string,
  title?: string,
  columns?: string[]
): void => {
  if (format === 'excel') {
    exportToExcel(data, filename);
  } else if (format === 'pdf') {
    exportToPDF(data, filename, title || filename, columns);
  }
};
