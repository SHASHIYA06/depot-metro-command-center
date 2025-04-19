
/**
 * Simple utility for saving files using the FileSaver.js functionality
 */

/**
 * Saves a blob as a file with the given filename
 * @param blob - The blob to save
 * @param filename - The name to give the saved file
 */
export const saveAs = (blob: Blob, filename: string): void => {
  // Create a link element
  const link = document.createElement('a');
  
  // Create a URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.href = url;
  link.download = filename;
  
  // Append to document, click, and remove
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Save text content as a file
 * @param content - Text content to save
 * @param filename - The name to give the saved file
 * @param mimeType - MIME type for the file (default: 'text/plain')
 */
export const saveText = (content: string, filename: string, mimeType: string = 'text/plain'): void => {
  const blob = new Blob([content], { type: mimeType });
  saveAs(blob, filename);
};

/**
 * Save JSON data as a file
 * @param data - Object to stringify and save as JSON
 * @param filename - The name to give the saved file
 * @param pretty - Whether to pretty-print the JSON (default: true)
 */
export const saveJSON = (data: any, filename: string, pretty: boolean = true): void => {
  const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  const blob = new Blob([content], { type: 'application/json' });
  saveAs(blob, filename);
};

/**
 * Save CSV data as a file
 * @param headers - Array of column headers
 * @param rows - Array of data rows (arrays)
 * @param filename - The name to give the saved file
 */
export const saveCSV = (headers: string[], rows: any[][], filename: string): void => {
  // Convert headers and rows to CSV format
  const headerRow = headers.join(',');
  const dataRows = rows.map(row => 
    row.map(cell => {
      // Handle special characters and quoting
      if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  );
  
  // Combine all rows
  const csvContent = [headerRow, ...dataRows].join('\n');
  
  // Create and save blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, filename);
};
