// Keep existing code and update the sections that need to be modified
import { User, UserRole, Train, Car, Issue, Task, ActivityLog, MaintenanceSchedule, WorkCategory, DailyWorkLog, AttendanceRecord } from '@/types';
import { addDays, subDays } from 'date-fns';

// Mock users data
export const users: User[] = [
  {
    id: 'u1',
    name: 'Rajiv Kumar',
    email: 'rajiv.kumar@metro.com',
    role: UserRole.DEPOT_INCHARGE,
    department: 'Operations',
    avatar: '/placeholder.svg'
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'priya.sharma@metro.com',
    role: UserRole.ENGINEER,
    department: 'Electrical Systems',
    avatar: '/placeholder.svg'
  },
  {
    id: 'u3',
    name: 'Sunil Verma',
    email: 'sunil.verma@metro.com',
    role: UserRole.ENGINEER,
    department: 'Mechanical Systems',
    avatar: '/placeholder.svg'
  },
  {
    id: 'u4',
    name: 'Arun Singh',
    email: 'arun.singh@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    avatar: '/placeholder.svg'
  },
  {
    id: 'u5',
    name: 'Meera Patel',
    email: 'meera.patel@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Electrical Systems',
    avatar: '/placeholder.svg'
  }
];

// Mock train data
export const trains: Train[] = [
  {
    id: 't1',
    name: 'Metro Train A',
    status: 'active',
    lastMaintenance: subDays(new Date(), 15).toISOString(),
    nextMaintenance: addDays(new Date(), 15).toISOString(),
    totalKilometers: 12500,
    cars: [
      { id: 'c1-t1', position: 1, status: 'operational', lastInspection: subDays(new Date(), 10).toISOString() },
      { id: 'c2-t1', position: 2, status: 'operational', lastInspection: subDays(new Date(), 10).toISOString() },
      { id: 'c3-t1', position: 3, status: 'maintenance', lastInspection: subDays(new Date(), 20).toISOString() },
      { id: 'c4-t1', position: 4, status: 'operational', lastInspection: subDays(new Date(), 10).toISOString() }
    ]
  },
  {
    id: 't2',
    name: 'Metro Train B',
    status: 'maintenance',
    lastMaintenance: subDays(new Date(), 30).toISOString(),
    nextMaintenance: addDays(new Date(), 1).toISOString(),
    totalKilometers: 15000,
    cars: [
      { id: 'c1-t2', position: 1, status: 'operational', lastInspection: subDays(new Date(), 15).toISOString() },
      { id: 'c2-t2', position: 2, status: 'faulty', lastInspection: subDays(new Date(), 15).toISOString() },
      { id: 'c3-t2', position: 3, status: 'maintenance', lastInspection: subDays(new Date(), 15).toISOString() },
      { id: 'c4-t2', position: 4, status: 'operational', lastInspection: subDays(new Date(), 15).toISOString() }
    ]
  },
  {
    id: 't3',
    name: 'Metro Train C',
    status: 'active',
    lastMaintenance: subDays(new Date(), 5).toISOString(),
    nextMaintenance: addDays(new Date(), 25).toISOString(),
    totalKilometers: 8900,
    cars: [
      { id: 'c1-t3', position: 1, status: 'operational', lastInspection: subDays(new Date(), 5).toISOString() },
      { id: 'c2-t3', position: 2, status: 'operational', lastInspection: subDays(new Date(), 5).toISOString() },
      { id: 'c3-t3', position: 3, status: 'operational', lastInspection: subDays(new Date(), 5).toISOString() },
      { id: 'c4-t3', position: 4, status: 'operational', lastInspection: subDays(new Date(), 5).toISOString() }
    ]
  },
  {
    id: 't4',
    name: 'Metro Train D',
    status: 'out_of_service',
    lastMaintenance: subDays(new Date(), 60).toISOString(),
    nextMaintenance: addDays(new Date(), 0).toISOString(),
    totalKilometers: 22000,
    cars: [
      { id: 'c1-t4', position: 1, status: 'faulty', lastInspection: subDays(new Date(), 30).toISOString() },
      { id: 'c2-t4', position: 2, status: 'faulty', lastInspection: subDays(new Date(), 30).toISOString() },
      { id: 'c3-t4', position: 3, status: 'maintenance', lastInspection: subDays(new Date(), 30).toISOString() },
      { id: 'c4-t4', position: 4, status: 'operational', lastInspection: subDays(new Date(), 30).toISOString() }
    ]
  }
];

// Mock issues data
export const issues: Issue[] = [
  {
    id: 'i1',
    title: 'Faulty door mechanism in Car 2',
    description: 'The door in Car 2 of Train B is not closing properly and needs immediate attention.',
    severity: 'high',
    status: 'open',
    reportedAt: subDays(new Date(), 2).toISOString(),
    assignedTo: 'u3',
    trainId: 't2',
    carId: 'c2-t2',
    workCategory: 'mechanical',
    lastUpdated: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'i2',
    title: 'Air conditioning failure in Car 3',
    description: 'The AC system in Car 3 of Train A is not functioning properly and passengers are complaining about high temperature.',
    severity: 'medium',
    status: 'in_progress',
    reportedAt: subDays(new Date(), 3).toISOString(),
    assignedTo: 'u4',
    trainId: 't1',
    carId: 'c3-t1',
    workCategory: 'electrical',
    workDetails: 'Identified faulty compressor. Ordering replacement parts.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'i3',
    title: 'Unusual noise from braking system',
    description: 'Train C is making unusual noise when braking, especially at higher speeds. This requires inspection.',
    severity: 'medium',
    status: 'in_progress',
    reportedAt: subDays(new Date(), 5).toISOString(),
    assignedTo: 'u5',
    trainId: 't3',
    workCategory: 'mechanical',
    workDetails: 'Initial inspection shows worn brake pads. Will replace all brake pads as preventive maintenance.',
    lastUpdated: subDays(new Date(), 1).toISOString()
  },
  {
    id: 'i4',
    title: 'Lighting failure in Car 1',
    description: 'The lighting system in Car 1 of Train D is completely non-functional.',
    severity: 'low',
    status: 'open',
    reportedAt: subDays(new Date(), 10).toISOString(),
    trainId: 't4',
    carId: 'c1-t4',
    workCategory: 'electrical',
    lastUpdated: subDays(new Date(), 10).toISOString()
  },
  {
    id: 'i5',
    title: 'Signaling system malfunction',
    description: 'Train B is experiencing intermittent issues with the signaling system causing delays.',
    severity: 'critical',
    status: 'in_progress',
    reportedAt: subDays(new Date(), 1).toISOString(),
    assignedTo: 'u2',
    trainId: 't2',
    workCategory: 'signal',
    workDetails: 'Troubleshooting the main signal processor unit. May need firmware update.',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'i6',
    title: 'Seat vandalism in Car 4',
    description: 'Multiple seats in Car 4 of Train A have been vandalized and need repair/replacement.',
    severity: 'low',
    status: 'resolved',
    reportedAt: subDays(new Date(), 15).toISOString(),
    assignedTo: 'u4',
    resolvedAt: subDays(new Date(), 10).toISOString(),
    trainId: 't1',
    carId: 'c4-t1',
    workCategory: 'interior',
    workDetails: 'Replaced all damaged seats and installed anti-vandal covering on seats.',
    lastUpdated: subDays(new Date(), 10).toISOString()
  }
];

// Helper functions to filter issues data
export const getIssuesByStatus = (status: Issue['status']): Issue[] => {
  return issues.filter(issue => issue.status === status);
};

export const getIssuesByAssignee = (assigneeId: string): Issue[] => {
  return issues.filter(issue => issue.assignedTo === assigneeId);
};

export const getIssuesBySeverity = (severity: Issue['severity']): Issue[] => {
  return issues.filter(issue => issue.severity === severity);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Mock work categories
export const workCategories: WorkCategory[] = [
  { id: 'mechanical', name: 'Mechanical' },
  { id: 'electrical', name: 'Electrical' },
  { id: 'electronic', name: 'Electronic' },
  { id: 'structural', name: 'Structural' },
  { id: 'interior', name: 'Interior' },
  { id: 'exterior', name: 'Exterior' },
  { id: 'brake', name: 'Braking System' },
  { id: 'engine', name: 'Engine' },
  { id: 'transmission', name: 'Transmission' },
  { id: 'hvac', name: 'HVAC' },
  { id: 'signal', name: 'Signal System' },
  { id: 'safety', name: 'Safety Equipment' }
];

// Mock daily work logs
export const dailyWorkLogs: DailyWorkLog[] = [
  {
    id: 'wl1',
    userId: 'u4',
    issueId: 'i2',
    date: new Date().toISOString(),
    workDescription: 'Inspected AC system, identified faulty compressor, ordered replacement parts.',
    hoursSpent: 3,
    status: 'in_progress'
  },
  {
    id: 'wl2',
    userId: 'u5',
    issueId: 'i3',
    date: subDays(new Date(), 1).toISOString(),
    workDescription: 'Inspected brake system, confirmed worn brake pads, prepared replacement parts list.',
    hoursSpent: 2.5,
    status: 'in_progress'
  },
  {
    id: 'wl3',
    userId: 'u2',
    issueId: 'i5',
    date: new Date().toISOString(),
    workDescription: 'Troubleshooting signal system, checking firmware versions, coordinating with manufacturer.',
    hoursSpent: 4,
    status: 'in_progress'
  },
  {
    id: 'wl4',
    userId: 'u4',
    issueId: 'i6',
    date: subDays(new Date(), 10).toISOString(),
    workDescription: 'Replaced all damaged seats in Car 4, installed protective coverings on new seats.',
    hoursSpent: 6,
    status: 'completed'
  }
];

// Mock attendance records for a week
const generateAttendanceRecords = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  for (let i = 0; i < 5; i++) { // Last 5 days
    for (const usr of users) {
      const date = subDays(new Date(), i);
      const loginTime = new Date(date);
      loginTime.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
      
      const logoutTime = new Date(date);
      logoutTime.setHours(16 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60), 0);
      
      const workHours = (logoutTime.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
      
      // Randomly mark some as absent or late
      const statuses: AttendanceRecord['status'][] = ['present', 'late', 'half-day', 'absent'];
      const randomStatus = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * statuses.length)] : 'present';
      
      records.push({
        id: `att-${usr.id}-${i}`,
        userId: usr.id,
        date: date.toISOString(),
        loginTime: loginTime.toISOString(),
        logoutTime: randomStatus !== 'absent' ? logoutTime.toISOString() : undefined,
        status: randomStatus,
        workHours: randomStatus !== 'absent' ? parseFloat(workHours.toFixed(2)) : 0,
        notes: randomStatus === 'absent' ? 'On leave' : randomStatus === 'late' ? 'Traffic delay' : ''
      });
    }
  }
  
  return records;
};

export const attendanceRecords = generateAttendanceRecords();

// Mock activity logs
export const activityLogs: ActivityLog[] = [
  {
    id: 'act1',
    userId: 'u2',
    action: 'Task Completion',
    details: 'Completed electrical inspection on Train A',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'act2',
    userId: 'u3',
    action: 'Issue Reported',
    details: 'Reported brake system issue on Train B',
    timestamp: subDays(new Date(), 1).toISOString(),
    trainId: 't2'
  },
  {
    id: 'act3',
    userId: 'u4',
    action: 'Task Started',
    details: 'Started AC repair on Train C',
    timestamp: subDays(new Date(), 2).toISOString(),
    trainId: 't3'
  },
  {
    id: 'act4',
    userId: 'u1',
    action: 'New Schedule',
    details: 'Created new maintenance schedule for Train D',
    timestamp: subDays(new Date(), 3).toISOString(),
  }
];

// Helper function to get recent activities
export const getRecentActivities = (limit: number = 5): ActivityLog[] => {
  // Sort activities by timestamp (most recent first) and return limited number
  return [...activityLogs].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, limit);
};

// Function to add a new issue
export const addNewIssue = (issue: Omit<Issue, 'id' | 'reportedAt' | 'lastUpdated'>): Issue => {
  const newIssue: Issue = {
    id: `i${issues.length + 1}`,
    reportedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    ...issue
  };
  
  issues.push(newIssue);
  
  // Create an activity log for the new issue
  activityLogs.push({
    id: `act${activityLogs.length + 1}`,
    userId: newIssue.assignedTo || 'u1', // Default to depot incharge if unassigned
    action: 'Issue Created',
    details: `Created new issue: ${newIssue.title}`,
    timestamp: new Date().toISOString(),
    trainId: newIssue.trainId
  });
  
  return newIssue;
};

// Function to update an existing issue
export const updateIssue = (id: string, updates: Partial<Issue>): Issue | undefined => {
  const issueIndex = issues.findIndex(issue => issue.id === id);
  if (issueIndex === -1) return undefined;
  
  const updatedIssue = {
    ...issues[issueIndex],
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  
  // If status changed to resolved, add resolvedAt
  if (updates.status === 'resolved' && !updatedIssue.resolvedAt) {
    updatedIssue.resolvedAt = new Date().toISOString();
  }
  
  issues[issueIndex] = updatedIssue;
  
  // Create an activity log for the updated issue
  activityLogs.push({
    id: `act${activityLogs.length + 1}`,
    userId: updatedIssue.assignedTo || 'u1',
    action: 'Issue Updated',
    details: `Updated issue: ${updatedIssue.title}`,
    timestamp: new Date().toISOString(),
    trainId: updatedIssue.trainId
  });
  
  return updatedIssue;
};

export const addDailyWorkLog = (workLog: Omit<DailyWorkLog, 'id'>): DailyWorkLog => {
  const newWorkLog: DailyWorkLog = {
    id: `wl${dailyWorkLogs.length + 1}`,
    ...workLog
  };
  
  dailyWorkLogs.push(newWorkLog);
  
  // Update the corresponding issue with work details
  if (workLog.issueId) {
    const issueIndex = issues.findIndex(issue => issue.id === workLog.issueId);
    if (issueIndex !== -1) {
      issues[issueIndex] = {
        ...issues[issueIndex],
        workDetails: workLog.workDescription,
        lastUpdated: new Date().toISOString()
      };
    }
  }
  
  // Create an activity log
  activityLogs.push({
    id: `act${activityLogs.length + 1}`,
    userId: workLog.userId,
    action: 'Work Log Added',
    details: `Added work log for issue #${workLog.issueId}`,
    timestamp: new Date().toISOString()
  });
  
  return newWorkLog;
};

// Function to add attendance record
export const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>): AttendanceRecord => {
  const newRecord: AttendanceRecord = {
    id: `att-${record.userId}-${new Date().getTime()}`,
    ...record
  };
  
  attendanceRecords.push(newRecord);
  
  // Create activity log for attendance
  activityLogs.push({
    id: `act${activityLogs.length + 1}`,
    userId: record.userId,
    action: 'Attendance',
    details: `${record.status === 'present' ? 'Logged in' : record.status === 'absent' ? 'Marked absent' : 'Logged in (late)'}`,
    timestamp: new Date().toISOString()
  });
  
  return newRecord;
};
