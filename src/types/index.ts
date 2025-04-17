
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
  avatar?: string; // This field is needed for the UI components
  phone?: string;
  address?: string;
  joiningDate?: string;
  skills?: string[];
  education?: string;
  emergencyContact?: string;
  badgeNo?: string;
  aadharNo?: string;
  vehicleNo?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent'; // Add 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'; // Add 'delayed'
  assignedTo?: string; // User ID
  assignedBy: string; // User ID
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  category: 'maintenance' | 'inspection' | 'repair' | 'cleaning' | 'administrative' | 'other';
  workDetails?: string;
  trainId?: string; // Add train reference
  carId?: string; // Add car reference
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
  implementingAgency?: string;
  cost?: number;
  keyFeatures?: string[];
  website?: string;
  dailyRidership?: string;
  lines?: number;
  trainSets?: number;
  trackType?: string;
}

export interface Train {
  id: string;
  name: string;
  status: 'active' | 'maintenance' | 'inactive' | 'out_of_service'; // Added out_of_service
  lastMaintenance: string;
  nextMaintenance: string;
  totalTrips: number;
  totalDistance: number;
  cars: Car[]; // Changed from number to array of Car
  manufacturer: string;
  commissionedDate: string;
  totalKilometers?: number;
}

export interface Car {
  id: string;
  position: number;
  status: string;
  lastInspection: string;
}

export interface TrainCar {
  id: string;
  trainId: string;
  carNumber: string;
  status: 'operational' | 'needs_maintenance' | 'under_maintenance';
  lastInspection: string;
  nextInspection: string;
}

// Additional types needed for mockData
export interface WorkCategory {
  id: string;
  name: string;
}

export interface DailyWorkLog {
  id: string;
  userId: string;
  issueId?: string;
  date: string;
  workDescription: string;
  hoursSpent: number;
  status: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  loginTime: string;
  logoutTime?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
  workHours: number;
  notes?: string;
  // Add these fields to match the implementation in StaffAttendance
  checkIn?: string;
  checkOut?: string;
  remarks?: string;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  date: string;
  content: string;
  source: string;
}

export interface MaintenanceSchedule {
  id: string;
  trainId: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'routine' | 'preventive' | 'corrective';
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'delayed';
  assignedTo: string[] | string; // Allow both string[] and string as seen in the code
  startDate: string; // Used in Maintenance.tsx instead of scheduledDate
  endDate: string; // Used in Maintenance.tsx
  notes?: string;
  scheduledDate?: string; // Keep this for backward compatibility
  completedDate?: string;
}

// Define export format type to prevent call errors
export type ExportFormat = 'excel' | 'pdf';

// Define column interface for export functions
export interface ExportColumn {
  header: string;
  dataKey: string;
}
