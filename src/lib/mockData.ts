
import { User, Train, Task, ActivityLog, DashboardStats, MaintenanceSchedule, Issue, Car, UserRole } from '@/types';
import { addDays, subDays, format, addHours } from 'date-fns';

// Mock Users
export const users: User[] = [
  {
    id: 'u1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@metrodepot.com',
    role: UserRole.DEPOT_INCHARGE,
    avatar: '/placeholder.svg'
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'priya.sharma@metrodepot.com',
    role: UserRole.ENGINEER,
    department: 'Electrical',
    avatar: '/placeholder.svg'
  },
  {
    id: 'u3',
    name: 'Vikram Singh',
    email: 'vikram.singh@metrodepot.com',
    role: UserRole.ENGINEER,
    department: 'Mechanical',
    avatar: '/placeholder.svg'
  },
  {
    id: 'u4',
    name: 'Ananya Patel',
    email: 'ananya.patel@metrodepot.com',
    role: UserRole.TECHNICIAN,
    department: 'Electrical',
    avatar: '/placeholder.svg'
  },
  {
    id: 'u5',
    name: 'Suresh Gupta',
    email: 'suresh.gupta@metrodepot.com',
    role: UserRole.TECHNICIAN,
    department: 'Mechanical',
    avatar: '/placeholder.svg'
  }
];

// Mock Cars
export const generateCars = (trainId: string): Car[] => {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `${trainId}-car-${i + 1}`,
    position: i + 1,
    status: i === 3 && trainId === 't1' ? 'maintenance' : 'operational',
    lastInspection: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
    issues: i === 3 && trainId === 't1' ? [
      {
        id: `issue-${trainId}-${i}-1`,
        title: 'HVAC Malfunction',
        description: 'Air conditioning system not functioning properly in car 4',
        severity: 'medium',
        status: 'in_progress',
        reportedAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
        assignedTo: 'u2'
      }
    ] : []
  }));
};

// Mock Trains
export const trains: Train[] = [
  {
    id: 't1',
    name: 'Metro Train 01',
    status: 'active',
    lastMaintenance: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    nextMaintenance: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
    totalKilometers: 12568,
    cars: generateCars('t1')
  },
  {
    id: 't2',
    name: 'Metro Train 02',
    status: 'maintenance',
    lastMaintenance: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    nextMaintenance: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    totalKilometers: 15783,
    cars: generateCars('t2')
  }
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: 'task1',
    title: 'Routine Inspection of Train 01',
    description: 'Conduct the regular inspection of all systems on Train 01',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'u3',
    assignedBy: 'u1',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    completedAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    trainId: 't1',
    category: 'inspection'
  },
  {
    id: 'task2',
    title: 'HVAC Repair in Train 01 Car 4',
    description: 'Fix the air conditioning system in car 4 of Train 01',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'u2',
    assignedBy: 'u1',
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(addDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    trainId: 't1',
    carId: 't1-car-4',
    category: 'repair'
  },
  {
    id: 'task3',
    title: 'Brake System Maintenance in Train 02',
    description: 'Complete maintenance of the brake system in Train 02',
    priority: 'high',
    status: 'pending',
    assignedTo: 'u5',
    assignedBy: 'u1',
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(addDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    trainId: 't2',
    category: 'maintenance'
  },
  {
    id: 'task4',
    title: 'Quarterly Electrical Systems Audit',
    description: 'Conduct quarterly audit of all electrical systems in both trains',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'u2',
    assignedBy: 'u1',
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(addDays(new Date(), 7), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    category: 'inspection'
  },
  {
    id: 'task5',
    title: 'Clean Train 01 Exterior',
    description: 'Complete exterior cleaning of Train 01',
    priority: 'low',
    status: 'pending',
    assignedTo: 'u4',
    assignedBy: 'u1',
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(addDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    trainId: 't1',
    category: 'cleaning'
  },
  {
    id: 'task6',
    title: 'Update Maintenance Records',
    description: 'Update all maintenance records for the past month',
    priority: 'medium',
    status: 'delayed',
    assignedTo: 'u3',
    assignedBy: 'u1',
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    dueDate: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    category: 'administrative'
  }
];

// Mock Activity Logs
export const activityLogs: ActivityLog[] = [
  {
    id: 'log1',
    userId: 'u1',
    action: 'Task Assignment',
    details: 'Assigned HVAC repair task to Priya Sharma',
    timestamp: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    taskId: 'task2',
    trainId: 't1',
    carId: 't1-car-4'
  },
  {
    id: 'log2',
    userId: 'u3',
    action: 'Task Completion',
    details: 'Completed routine inspection of Train 01',
    timestamp: format(subDays(new Date(), 1), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    taskId: 'task1',
    trainId: 't1'
  },
  {
    id: 'log3',
    userId: 'u2',
    action: 'Issue Reported',
    details: 'Reported HVAC malfunction in Car 4 of Train 01',
    timestamp: format(subDays(new Date(), 3), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    trainId: 't1',
    carId: 't1-car-4'
  },
  {
    id: 'log4',
    userId: 'u2',
    action: 'Task Started',
    details: 'Started HVAC repair in Car 4 of Train 01',
    timestamp: format(subDays(new Date(), 2), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    taskId: 'task2',
    trainId: 't1',
    carId: 't1-car-4'
  },
  {
    id: 'log5',
    userId: 'u1',
    action: 'Maintenance Schedule',
    details: 'Scheduled monthly maintenance for Train 02',
    timestamp: format(subDays(new Date(), 5), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    trainId: 't2'
  }
];

// Mock Maintenance Schedules
export const maintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: 'ms1',
    trainId: 't2',
    type: 'monthly',
    description: 'Monthly complete system check and maintenance for Train 02',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
    status: 'scheduled',
    assignedTo: ['u2', 'u3', 'u5']
  },
  {
    id: 'ms2',
    trainId: 't1',
    type: 'weekly',
    description: 'Weekly brake inspection for Train 01',
    startDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
    status: 'scheduled',
    assignedTo: ['u3', 'u5']
  },
  {
    id: 'ms3',
    trainId: 't1',
    type: 'daily',
    description: 'Daily safety checks for Train 01',
    startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    status: 'scheduled',
    assignedTo: ['u4']
  }
];

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalTasks: tasks.length,
  completedTasks: tasks.filter(t => t.status === 'completed').length,
  pendingTasks: tasks.filter(t => t.status === 'pending').length,
  delayedTasks: tasks.filter(t => t.status === 'delayed').length,
  activeTrains: trains.filter(t => t.status === 'active').length,
  trainsInMaintenance: trains.filter(t => t.status === 'maintenance').length,
  issuesByPriority: {
    low: tasks.filter(t => t.priority === 'low').length,
    medium: tasks.filter(t => t.priority === 'medium').length,
    high: tasks.filter(t => t.priority === 'high').length,
    critical: tasks.filter(t => t.priority === 'urgent').length
  },
  upcomingMaintenance: maintenanceSchedules.filter(ms => new Date(ms.startDate) > new Date()),
  recentActivities: activityLogs.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5)
};

// Generate tasks data for charts
export const generateTasksChartData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const formattedDate = format(date, 'MMM dd');
    
    // Random data for demo purposes
    data.push({
      date: formattedDate,
      completed: Math.floor(Math.random() * 8) + 1,
      assigned: Math.floor(Math.random() * 5) + 3,
      delayed: Math.floor(Math.random() * 3)
    });
  }
  
  return data;
};

// Generate maintenance progress data for charts
export const generateMaintenanceProgressData = () => {
  return [
    { name: 'Train 01', completed: 85, total: 100 },
    { name: 'Train 02', completed: 65, total: 100 }
  ];
};

// Generate train usage data for charts
export const generateTrainUsageData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < 12; i++) {
    const date = addDays(today, i);
    data.push({
      date: format(date, 'MMM dd'),
      'Train 01': Math.floor(Math.random() * 300) + 200,
      'Train 02': Math.floor(Math.random() * 300) + 150
    });
  }
  
  return data;
};

// Get user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Get train by ID
export const getTrainById = (id: string): Train | undefined => {
  return trains.find(train => train.id === id);
};

// Get tasks for user
export const getTasksForUser = (userId: string): Task[] => {
  return tasks.filter(task => task.assignedTo === userId);
};

// Get tasks by status
export const getTasksByStatus = (status: Task['status']): Task[] => {
  return tasks.filter(task => task.status === status);
};

// Get all issues
export const getAllIssues = (): Issue[] => {
  const issues: Issue[] = [];
  
  for (const train of trains) {
    for (const car of train.cars) {
      if (car.issues && car.issues.length > 0) {
        issues.push(...car.issues);
      }
    }
  }
  
  return issues;
};

// Generate activity chart data
export const generateActivityChartData = () => {
  const categories = ['Maintenance', 'Inspection', 'Repair', 'Cleaning', 'Administrative'];
  return categories.map(category => {
    return {
      category,
      completed: Math.floor(Math.random() * 20) + 5,
      pending: Math.floor(Math.random() * 15) + 1
    };
  });
};

// Generate maintenance history
export const generateMaintenanceHistory = () => {
  const history = [];
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const date = subDays(today, i * 10);
    history.push({
      id: `hist-${i}`,
      title: i % 2 === 0 ? 'Routine Maintenance' : 'Emergency Repair',
      train: i % 3 === 0 ? 'Train 02' : 'Train 01',
      date: format(date, 'yyyy-MM-dd'),
      status: 'completed',
      performedBy: i % 2 === 0 ? 'Vikram Singh' : 'Priya Sharma',
      details: i % 2 === 0 
        ? 'Performed routine maintenance on all systems' 
        : 'Emergency repair of critical component'
    });
  }
  
  return history;
};

// Additional helper functions for filtering issues
export const getIssuesByStatus = (status: string): Issue[] => {
  return issues.filter(issue => issue.status === status);
};

export const getIssuesBySeverity = (severity: string): Issue[] => {
  return issues.filter(issue => issue.severity === severity);
};

export const getIssuesByAssignee = (userId: string): Issue[] => {
  return issues.filter(issue => issue.assignedTo === userId);
};

// Mock issues data
export const issues: Issue[] = [
  {
    id: "issue-001",
    title: "HVAC Malfunction in Car 3",
    description: "Air conditioning unit in car 3 of Train A1 is not functioning properly. Temperature readings show inconsistent cooling.",
    severity: "high",
    status: "in_progress",
    reportedAt: "2025-04-10T08:30:00Z",
    assignedTo: "user-002",
    trainId: "train-001",
    carId: "car-003",
    resolvedAt: undefined
  },
  {
    id: "issue-002",
    title: "Brake Inspection Required",
    description: "Routine brake inspection needed for Train B2 before next service cycle.",
    severity: "medium",
    status: "open",
    reportedAt: "2025-04-11T09:15:00Z",
    assignedTo: undefined,
    trainId: "train-002",
    carId: undefined,
    resolvedAt: undefined
  },
  {
    id: "issue-003",
    title: "Door Sensor Calibration",
    description: "Door sensors on car 2 of Train A1 need calibration. Occasional false readings detected during operation.",
    severity: "low",
    status: "open",
    reportedAt: "2025-04-12T14:20:00Z",
    assignedTo: "user-003",
    trainId: "train-001",
    carId: "car-002",
    resolvedAt: undefined
  },
  {
    id: "issue-004",
    title: "Track Circuit Failure",
    description: "Track circuit 23B reporting intermittent failures. Requires immediate investigation.",
    severity: "critical",
    status: "in_progress",
    reportedAt: "2025-04-09T11:45:00Z",
    assignedTo: "user-002",
    trainId: undefined,
    carId: undefined,
    resolvedAt: undefined
  },
  {
    id: "issue-005",
    title: "Battery Replacement",
    description: "Auxiliary batteries in Train B2 showing reduced capacity. Scheduled replacement recommended.",
    severity: "medium",
    status: "resolved",
    reportedAt: "2025-04-08T10:30:00Z",
    assignedTo: "user-003",
    trainId: "train-002",
    carId: undefined,
    resolvedAt: "2025-04-13T15:20:00Z"
  },
  {
    id: "issue-006",
    title: "Wheel Profiling Required",
    description: "Wheels on car 4 of Train A1 showing uneven wear pattern. Profiling needed during next maintenance cycle.",
    severity: "medium",
    status: "open",
    reportedAt: "2025-04-13T08:15:00Z",
    assignedTo: undefined,
    trainId: "train-001",
    carId: "car-004",
    resolvedAt: undefined
  },
  {
    id: "issue-007",
    title: "Signal Relay Replacement",
    description: "Signal relay at junction 5 needs replacement. Intermittent failures observed during peak hours.",
    severity: "high",
    status: "resolved",
    reportedAt: "2025-04-07T09:10:00Z",
    assignedTo: "user-002",
    trainId: undefined,
    carId: undefined,
    resolvedAt: "2025-04-12T11:30:00Z"
  },
  {
    id: "issue-008",
    title: "Pantograph Inspection",
    description: "Routine inspection of pantograph on Train B2 required before next deployment.",
    severity: "low",
    status: "resolved",
    reportedAt: "2025-04-06T14:45:00Z",
    assignedTo: "user-003",
    trainId: "train-002",
    carId: undefined,
    resolvedAt: "2025-04-10T17:20:00Z"
  },
  {
    id: "issue-009",
    title: "Coupling Mechanism Adjustment",
    description: "Coupling mechanism between cars 1 and 2 of Train A1 requires adjustment. Slight misalignment detected.",
    severity: "medium",
    status: "in_progress",
    reportedAt: "2025-04-12T11:30:00Z",
    assignedTo: "user-003",
    trainId: "train-001",
    carId: undefined,
    resolvedAt: undefined
  },
  {
    id: "issue-010",
    title: "Emergency Lighting Test",
    description: "Scheduled test of emergency lighting systems in all trains.",
    severity: "low",
    status: "open",
    reportedAt: "2025-04-13T10:00:00Z",
    assignedTo: undefined,
    trainId: undefined,
    carId: undefined,
    resolvedAt: undefined
  }
];
