export enum UserRole {
  DEPOT_INCHARGE = 'DEPOT_INCHARGE',
  ENGINEER = 'ENGINEER',
  TECHNICIAN = 'TECHNICIAN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

export interface Train {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'out_of_service';
  lastMaintenance: string; // ISO date string
  nextMaintenance: string; // ISO date string
  totalKilometers: number;
  cars: Car[];
}

export interface Car {
  id: string;
  position: number; // Position in the train (1-8)
  status: 'operational' | 'maintenance' | 'faulty';
  lastInspection: string; // ISO date string
  issues?: Issue[];
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  reportedAt: string; // ISO date string
  assignedTo?: string; // User ID
  resolvedAt?: string; // ISO date string
  trainId?: string; // Train ID
  carId?: string; // Car ID
  workDetails?: string; // Details of work performed by employees
  lastUpdated?: string; // Last update timestamp
  workCategory?: string; // Category of work
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  assignedTo: string; // User ID
  assignedBy: string; // User ID
  createdAt: string; // ISO date string
  dueDate: string; // ISO date string
  completedAt?: string; // ISO date string
  trainId?: string; // Train ID if applicable
  carId?: string; // Car ID if applicable
  category: 'maintenance' | 'inspection' | 'repair' | 'cleaning' | 'administrative' | 'other';
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string; // ISO date string
  taskId?: string;
  trainId?: string;
  carId?: string;
}

export interface MaintenanceSchedule {
  id: string;
  trainId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  description: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  assignedTo: string[]; // User IDs
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  delayedTasks: number;
  activeTrains: number;
  trainsInMaintenance: number;
  issuesByPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  upcomingMaintenance: MaintenanceSchedule[];
  recentActivities: ActivityLog[];
}

export interface WorkCategory {
  id: string;
  name: string;
  description?: string;
}

export interface DailyWorkLog {
  id: string;
  userId: string;
  issueId: string;
  date: string; // ISO date string
  workDescription: string;
  hoursSpent: number;
  status: 'completed' | 'in_progress' | 'pending';
}
