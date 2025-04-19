
import { addDays, addYears, isAfter, isBefore, format } from 'date-fns';

// Define maintenance types
export type MaintenanceType = 'Daily' | 'A1' | 'B1' | 'B4' | 'B8' | 'IOH';

// Define maintenance schedule
export interface MaintenanceSchedule {
  type: MaintenanceType;
  periodDays: number;
  periodKm?: number;
  duration: string;
}

// Maintenance schedule configuration
export const maintenanceSchedules: Record<MaintenanceType, MaintenanceSchedule> = {
  'Daily': {
    type: 'Daily',
    periodDays: 1,
    duration: '30 mins'
  },
  'A1': {
    type: 'A1',
    periodDays: 15,
    periodKm: 6000,
    duration: '2 hrs'
  },
  'B1': {
    type: 'B1',
    periodDays: 45,
    periodKm: 18000,
    duration: '8 hrs'
  },
  'B4': {
    type: 'B4',
    periodDays: 180,
    periodKm: 72000,
    duration: '14 hrs'
  },
  'B8': {
    type: 'B8',
    periodDays: 360,
    periodKm: 150000,
    duration: '18 hrs'
  },
  'IOH': {
    type: 'IOH',
    periodDays: 365 * 3.5, // 3.5 years
    periodKm: 520000,
    duration: '10 days'
  }
};

// Calculate next due date based on last maintenance date and type
export const calculateNextDueDate = (lastDate: Date, type: MaintenanceType): Date => {
  const schedule = maintenanceSchedules[type];
  
  if (type === 'IOH') {
    return addYears(lastDate, 3.5);
  }
  
  return addDays(lastDate, schedule.periodDays);
};

// Check if maintenance is overdue
export const isMaintenanceOverdue = (nextDueDate: Date): boolean => {
  return isBefore(nextDueDate, new Date());
};

// Check if maintenance is upcoming (within next 7 days)
export const isMaintenanceUpcoming = (nextDueDate: Date): boolean => {
  const today = new Date();
  const inSevenDays = addDays(today, 7);
  
  return isBefore(nextDueDate, inSevenDays) && isAfter(nextDueDate, today);
};

// Get maintenance status
export const getMaintenanceStatus = (nextDueDate: Date): 'overdue' | 'upcoming' | 'ok' => {
  if (isMaintenanceOverdue(nextDueDate)) {
    return 'overdue';
  }
  
  if (isMaintenanceUpcoming(nextDueDate)) {
    return 'upcoming';
  }
  
  return 'ok';
};

// Format the maintenance status for display
export const formatMaintenanceStatus = (status: 'overdue' | 'upcoming' | 'ok'): { text: string; color: string } => {
  switch (status) {
    case 'overdue':
      return { text: 'Overdue', color: 'text-red-600 bg-red-100' };
    case 'upcoming':
      return { text: 'Due Soon', color: 'text-amber-600 bg-amber-100' };
    case 'ok':
      return { text: 'On Schedule', color: 'text-green-600 bg-green-100' };
  }
};
