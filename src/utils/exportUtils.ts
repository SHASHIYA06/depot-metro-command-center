import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import { toast } from '@/hooks/use-toast';
import { ExportFormat } from '@/types';

/**
 * Export data to Excel file
 * @param data Array of objects to export
 * @param fileName Name of the file to download
 */
export const exportToExcel = (data: any[], fileName: string = 'export'): void => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    toast({
      title: 'Export Successful',
      description: `Data has been exported to ${fileName}.xlsx`,
    });
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    toast({
      title: 'Export Failed',
      description: 'Failed to export data to Excel. Please try again.',
      variant: 'destructive',
    });
  }
};

/**
 * Export data to PDF file with auto-table
 * @param data Array of objects to export
 * @param fileName Name of the file to download
 * @param title Title to display at the top of the PDF
 * @param columns Array of column definitions for the table
 */
export const exportToPDF = (
  data: any[], 
  fileName: string = 'export',
  title: string = 'Exported Data',
  columns?: { header: string, dataKey: string }[]
): void => {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Add timestamp
    doc.setFontSize(10);
    const timestamp = `Generated on: ${new Date().toLocaleString()}`;
    doc.text(timestamp, 14, 22);

    // Define columns if not provided
    if (!columns) {
      if (data.length > 0) {
        columns = Object.keys(data[0]).map(key => ({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          dataKey: key
        }));
      } else {
        columns = [];
      }
    }
    
    // Generate table
    autoTable(doc, {
      startY: 30,
      head: [columns.map(col => col.header)],
      body: data.map(row => columns!.map(col => row[col.dataKey] !== undefined ? row[col.dataKey].toString() : '')),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [66, 66, 66], textColor: [255, 255, 255] }
    });
    
    // Add page numbers if multiple pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    }
    
    // Generate PDF file and trigger download
    doc.save(`${fileName}.pdf`);
    
    toast({
      title: 'Export Successful',
      description: `Data has been exported to ${fileName}.pdf`,
    });
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    toast({
      title: 'Export Failed',
      description: 'Failed to export data to PDF. Please try again.',
      variant: 'destructive',
    });
  }
};

/**
 * Export data in the specified format
 * @param data Data to export
 * @param format Export format (excel or pdf)
 * @param fileName Name of the file
 * @param title Title for PDF
 * @param columns Columns for PDF
 */
export const exportData = (
  data: any[],
  format: ExportFormat,
  fileName: string = 'export',
  title: string = 'Exported Data',
  columns?: { header: string, dataKey: string }[]
): void => {
  if (format === 'excel') {
    exportToExcel(data, fileName);
  } else if (format === 'pdf') {
    exportToPDF(data, fileName, title, columns);
  }
};

/**
 * Format data for export by cleaning up objects and ensuring string values
 * @param data Array of objects to format
 * @returns Formatted data ready for export
 */
export const formatDataForExport = (data: any[]): any[] => {
  return data.map(item => {
    const formattedItem: Record<string, any> = {};
    
    // Process each field in the item
    Object.entries(item).forEach(([key, value]) => {
      // Skip functions, complex objects, and internal fields
      if (
        typeof value === 'function' || 
        key.startsWith('_') ||
        value === null ||
        value === undefined
      ) {
        return;
      }
      
      // Format dates
      if (value instanceof Date) {
        formattedItem[key] = value.toLocaleString();
        return;
      }
      
      // Convert nested objects to string representation
      if (typeof value === 'object') {
        formattedItem[key] = JSON.stringify(value);
        return;
      }
      
      // Keep primitive values as is
      formattedItem[key] = value;
    });
    
    return formattedItem;
  });
};

/**
 * Create column definitions for PDF export
 * @param headers Array of header names
 * @param keys Array of corresponding object keys
 * @returns Array of column definitions
 */
export const createPdfColumns = (
  headers: string[], 
  keys: string[]
): { header: string, dataKey: string }[] => {
  return headers.map((header, index) => ({
    header,
    dataKey: keys[index]
  }));
};
