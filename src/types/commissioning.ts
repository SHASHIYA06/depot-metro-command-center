
/**
 * Types for Train Commissioning module
 */

export interface CommissioningActivity {
  id: string;
  trainSet: string;
  carNo: string;
  system: string;
  activity: string;
  status: CommissioningStatus;
  remarks?: string;
  officer: string;
  date: string;
  photoUrls: string[];
}

export type CommissioningStatus = 'Pending' | 'In Progress' | 'Completed';

export interface TrainSet {
  id: string;
  name: string; // e.g., "TS15"
  completionPercentage: number;
  activities: CommissioningActivity[];
}

export interface CommissioningSystem {
  id: string;
  name: string;
  description?: string;
}

export interface CommissioningActivityType {
  id: string;
  name: string;
  description?: string;
  systemId: string;
}

export interface CarType {
  id: string;
  name: string; // e.g., "DMC1"
  description?: string;
}
