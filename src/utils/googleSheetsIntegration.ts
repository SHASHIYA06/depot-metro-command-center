
import { Task, Issue } from '@/types';

/**
 * Utility to handle Google Sheets integration
 * 
 * In a real application, this would use the Google Sheets API to sync data
 * For simplicity, this mock implementation logs what would be sent to Google Sheets
 */

// Mock Google Sheets webhook URL 
const SHEETS_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/your-webhook-id/';

// Mock Google Sheets webhook URL for train commissioning
const TRAIN_COMMISSIONING_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxeH9ZJrtnSDIelz6l7DHCcNkqn73M3bv2bJwm7Fy9SeIjPmY2SB_wpCzEPUl756Ypuqw/exec';

/**
 * Sync a task to Google Sheets
 */
export const syncTaskToSheets = async (task: Task): Promise<boolean> => {
  console.log('[Google Sheets] Syncing task:', task);
  
  try {
    // In a real implementation, this would make an API call to Google Sheets
    // For now, we'll just simulate a successful sync
    console.log('[Google Sheets] Task data would be sent to Google Sheets');
    
    // Prepare the data for Google Sheets
    const taskData = {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo,
      assignedBy: task.assignedBy,
      createdAt: task.createdAt,
      dueDate: task.dueDate,
      completedAt: task.completedAt || '',
      category: task.category,
      workDetails: task.workDetails || '',
      lastUpdated: new Date().toISOString(),
    };
    
    // Log the data that would be sent
    console.log('[Google Sheets] Data to be synced:', taskData);
    
    // In a real implementation, this would be an API call to Google Sheets
    /*
    const response = await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`Google Sheets sync failed with status: ${response.status}`);
    }
    */
    
    return true;
  } catch (error) {
    console.error('[Google Sheets] Error syncing task:', error);
    return false;
  }
};

/**
 * Sync an issue to Google Sheets
 */
export const syncIssueToSheets = async (issue: Issue): Promise<boolean> => {
  console.log('[Google Sheets] Syncing issue:', issue);
  
  try {
    // In a real implementation, this would make an API call to Google Sheets
    // For now, we'll just simulate a successful sync
    console.log('[Google Sheets] Issue data would be sent to Google Sheets');
    
    // Prepare the data for Google Sheets
    const issueData = {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      severity: issue.severity,
      status: issue.status,
      reportedAt: issue.reportedAt,
      assignedTo: issue.assignedTo || '',
      assignedBy: issue.assignedBy || '',
      resolvedAt: issue.resolvedAt || '',
      trainId: issue.trainId || '',
      carId: issue.carId || '',
      workDetails: issue.workDetails || '',
      lastUpdated: issue.lastUpdated || new Date().toISOString(),
      workCategory: issue.workCategory || '',
    };
    
    // Log the data that would be sent
    console.log('[Google Sheets] Data to be synced:', issueData);
    
    // In a real implementation, this would be an API call to Google Sheets
    /*
    const response = await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(issueData),
    });
    
    if (!response.ok) {
      throw new Error(`Google Sheets sync failed with status: ${response.status}`);
    }
    */
    
    return true;
  } catch (error) {
    console.error('[Google Sheets] Error syncing issue:', error);
    return false;
  }
};

/**
 * Sync train commissioning activity to Google Sheets
 */
export const syncTrainCommissioningToSheets = async (activity: any): Promise<boolean> => {
  console.log('[Google Sheets] Syncing train commissioning activity:', activity);
  
  try {
    // In a real implementation, this would make an API call to Google Sheets
    // For now, we'll just simulate a successful sync
    console.log('[Google Sheets] Train commissioning data would be sent to Google Sheets');
    
    // Prepare the data for Google Sheets
    const formData = new URLSearchParams({
      trainSet: activity.trainSet,
      carNo: activity.carNo,
      system: activity.system,
      activity: activity.activity,
      status: activity.status,
      remarks: activity.remarks || '',
      officer: activity.officer,
      date: new Date(activity.date).toLocaleString(),
      photoUrls: activity.photoUrls.join(', ')
    });
    
    // Log the data that would be sent
    console.log('[Google Sheets] Data to be synced:', Object.fromEntries(formData));
    
    // In a real implementation, this would be an API call to Google Sheets
    /*
    const response = await fetch(TRAIN_COMMISSIONING_WEBHOOK_URL, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Google Sheets sync failed with status: ${response.status}`);
    }
    */
    
    return true;
  } catch (error) {
    console.error('[Google Sheets] Error syncing train commissioning activity:', error);
    return false;
  }
};

/**
 * Get a webhook URL for Google Sheets integration
 * In a real app, this would be stored in a database or environment variable
 */
export const getGoogleSheetsWebhookUrl = (): string => {
  return SHEETS_WEBHOOK_URL;
};

/**
 * Set a webhook URL for Google Sheets integration
 * In a real app, this would update a database or environment variable
 */
export const setGoogleSheetsWebhookUrl = (url: string): void => {
  console.log('[Google Sheets] Setting webhook URL:', url);
  // In a real app, this would store the URL
};

/**
 * Get the train commissioning webhook URL
 */
export const getTrainCommissioningWebhookUrl = (): string => {
  return TRAIN_COMMISSIONING_WEBHOOK_URL;
};

/**
 * Set the train commissioning webhook URL
 */
export const setTrainCommissioningWebhookUrl = (url: string): void => {
  console.log('[Google Sheets] Setting train commissioning webhook URL:', url);
  // In a real app, this would store the URL
};
