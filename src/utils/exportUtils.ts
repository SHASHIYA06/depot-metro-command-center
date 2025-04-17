
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ExportFormat, ExportColumnDefinition } from '@/types';

/**
 * Format data for export by handling complex objects and nested properties
 * @param data The data to format
 * @param columns Optional column definitions
 */
export const formatDataForExport = (data: any[], columns?: ExportColumnDefinition[]): any[] => {
  return data.map(item => {
    const formattedItem: Record<string, any> = {};
    
    // If columns are provided, use them to extract data
    if (columns && columns.length > 0) {
      columns.forEach(col => {
        if (typeof col === 'string') {
          formattedItem[col] = item[col];
        } else if (typeof col === 'object' && col.dataKey) {
          // Handle column objects with dataKey
          formattedItem[col.header || col.dataKey] = item[col.dataKey];
        }
      });
    } else {
      // Otherwise, use all properties
      Object.keys(item).forEach(key => {
        // Handle Date objects
        if (item[key] instanceof Date) {
          formattedItem[key] = item[key].toLocaleDateString();
        } 
        // Handle arrays by joining them
        else if (Array.isArray(item[key])) {
          formattedItem[key] = item[key].join(', ');
        }
        // Handle nested objects by using their toString or stringify
        else if (typeof item[key] === 'object' && item[key] !== null) {
          formattedItem[key] = JSON.stringify(item[key]);
        }
        // Pass through primitive values
        else {
          formattedItem[key] = item[key];
        }
      });
    }
    
    return formattedItem;
  });
};

/**
 * Generic function to export data to Excel
 * @param data The data to export
 * @param filename The filename to save as
 */
export const exportToExcel = (data: any[], filename: string): void => {
  const formattedData = formatDataForExport(data);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
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
  columns?: ExportColumnDefinition[]
): void => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  
  // Add date
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Format data
  const formattedData = formatDataForExport(data, columns);
  
  // Create table
  if (columns) {
    // Handle column objects or strings
    const columnHeaders = columns.map(col => {
      if (typeof col === 'string') {
        return col;
      } else if (typeof col === 'object' && col.header) {
        return col.header;
      }
      return '';
    });
    
    const columnDataKeys = columns.map(col => {
      if (typeof col === 'string') {
        return col;
      } else if (typeof col === 'object' && col.dataKey) {
        return col.dataKey;
      }
      return '';
    });
    
    autoTable(doc, {
      head: [columnHeaders],
      body: formattedData.map(item => columnDataKeys.map(key => item[key] || '')),
      startY: 40,
    });
  } else {
    // If no columns provided, use Object.keys from first item
    if (formattedData.length > 0) {
      const cols = Object.keys(formattedData[0]);
      autoTable(doc, {
        head: [cols],
        body: formattedData.map(item => cols.map(col => item[col] || '')),
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
  columns?: ExportColumnDefinition[]
): void => {
  if (format === 'excel') {
    exportToExcel(data, filename);
  } else if (format === 'pdf') {
    exportToPDF(data, filename, title || filename, columns);
  }
};
