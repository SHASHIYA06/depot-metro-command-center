
export enum UserRole {
  ADMIN = 'ADMIN',
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
  photoUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string; // User ID
  assignedBy: string; // User ID
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  category: string;
  workDetails?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  reportedAt: string;
  reportedBy: string; // User ID
  assignedTo?: string; // User ID
  assignedBy?: string; // User ID
  resolvedAt?: string;
  trainId?: string;
  carId?: string;
  lastUpdated?: string;
  workCategory?: string;
  workDetails?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
  taskId?: string;
  trainId?: string;
  carId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Under Construction' | 'Operational' | 'Planned';
  location: string;
  networkLength: number;
  stations?: number;
  startDate: string;
  completionDate?: string;
  completionPercentage?: number;
  budget?: number;
  teams?: string[];
}

export interface Train {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
  nextMaintenance: string;
  totalTrips: number;
  totalDistance: number;
  cars: number;
  manufacturer: string;
  commissionedDate: string;
}

export interface TrainCar {
  id: string;
  trainId: string;
  carNumber: string;
  status: 'operational' | 'needs_maintenance' | 'under_maintenance';
  lastInspection: string;
  nextInspection: string;
}
