import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

// Generic export function that handles both Excel and PDF
export const exportData = (
  data: any[],
  fileName: string,
  fileType: 'excel' | 'pdf',
  title?: string,
  columns?: string[]
) => {
  if (fileType === 'excel') {
    exportToExcel(data, fileName);
  } else {
    exportToPDF(data, fileName, title, columns);
  }
};

// Excel export function
const exportToExcel = (data: any[], fileName: string) => {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(blob, `${fileName}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};

// PDF export function
const exportToPDF = (data: any[], fileName: string, title?: string, columns?: string[]) => {
  const doc = new jsPDF();
  
  // Add title
  if (title) {
    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
  }
  
  // Add date
  doc.setTextColor(100);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 14, title ? 32 : 22);
  
  // Determine column headers - either use provided columns or extract from first data item
  let headers: string[] = [];
  if (columns && columns.length > 0) {
    headers = columns;
  } else if (data.length > 0) {
    headers = Object.keys(data[0]);
  }
  
  // Format data for the table
  const tableData = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      
      // Handle date formatting
      if (value instanceof Date) {
        return format(value, 'PPP');
      }
      
      // Handle arrays
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
      // Handle objects
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      
      return value;
    });
  });
  
  // Create the table
  autoTable(doc, {
    head: [headers.map(h => h.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()))],
    body: tableData,
    startY: title ? 38 : 28,
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });
  
  // Save file
  doc.save(`${fileName}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

// Format and transform data function
export const formatDataForExport = (data: any[], transforms?: Record<string, (value: any) => any>) => {
  return data.map(item => {
    const formattedItem: Record<string, any> = { ...item };
    
    if (transforms) {
      Object.keys(transforms).forEach(key => {
        if (key in item) {
          formattedItem[key] = transforms[key](item[key]);
        }
      });
    }
    
    // Format dates
    Object.keys(formattedItem).forEach(key => {
      const value = formattedItem[key];
      if (value instanceof Date) {
        formattedItem[key] = format(value, 'PPP');
      }
    });
    
    return formattedItem;
  });
};
