
import { exportData } from '@/utils/dataExport';
import { ExportFormat, ExportColumnDefinition } from '@/types';

// Re-export the dataExport functions
export { exportData };

// Add utility functions for exporting
export const handleExport = (
  format: ExportFormat,
  data: any[],
  filename: string,
  title?: string,
  columns?: string[]
): void => {
  exportData(data, filename, format, title, columns);
};

// Helper function for Excel export
export const exportToExcel = (
  data: any[],
  filename: string
): void => {
  exportData(data, filename, 'excel');
};

// Helper function for PDF export
export const exportToPDF = (
  data: any[],
  filename: string,
  title?: string,
  columns?: string[]
): void => {
  exportData(data, filename, 'pdf', title, columns);
};

// Format and transform data function
export const formatDataForExport = (data: any[], transforms?: Record<string, (value: any) => any>) => {
  const formattedData = data.map(item => {
    const formattedItem: Record<string, any> = { ...item };
    
    if (transforms) {
      Object.keys(transforms).forEach(key => {
        if (key in item) {
          formattedItem[key] = transforms[key](item[key]);
        }
      });
    }
    
    return formattedItem;
  });
  
  return formattedData;
};
