
import { exportData } from '@/utils/dataExport';
import { ExportFormat, ExportColumnDefinition } from '@/types';

// Re-export the dataExport functions
export { exportData };

// Add any additional utility functions for exporting if needed
export const handleExport = (
  format: ExportFormat,
  data: any[],
  filename: string,
  title?: string,
  columns?: ExportColumnDefinition[]
): void => {
  exportData(data, filename, format, title, columns);
};
