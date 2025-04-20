import { User, UserRole, Task, Project, Train, Issue, ActivityLog, Car, MaintenanceSchedule, WorkCategory, DailyWorkLog, AttendanceRecord, ProjectUpdate } from '@/types';

// Start of users mock data
export const users: User[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@metrodepot.com',
    role: UserRole.DEPOT_INCHARGE, // Changed from ADMIN to DEPOT_INCHARGE
    department: 'Administration',
    phone: '+91 9876543210',
    photoUrl: '/avatars/admin.jpg',
    avatar: '/avatars/admin.jpg',
    joiningDate: '2020-01-15',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@metrodepot.com',
    role: UserRole.DEPOT_INCHARGE,
    department: 'Operations',
    phone: '+91 9876543211',
    photoUrl: '/avatars/depot-incharge.jpg',
    avatar: '/avatars/depot-incharge.jpg',
    joiningDate: '2020-02-10',
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit.patel@metrodepot.com',
    role: UserRole.ENGINEER,
    department: 'Maintenance',
    phone: '+91 9876543212',
    photoUrl: '/avatars/engineer1.jpg',
    avatar: '/avatars/engineer1.jpg',
    joiningDate: '2020-03-15',
    skills: ['Electrical Systems', 'HVAC', 'Propulsion'],
    education: 'B.Tech in Electrical Engineering',
  },
  {
    id: '4',
    name: 'Deepak Singh',
    email: 'deepak.singh@metrodepot.com',
    role: UserRole.ENGINEER,
    department: 'Maintenance',
    phone: '+91 9876543213',
    photoUrl: '/avatars/engineer2.jpg',
    avatar: '/avatars/engineer2.jpg',
    joiningDate: '2020-04-20',
    skills: ['Mechanical Systems', 'Braking', 'Suspension'],
    education: 'B.Tech in Mechanical Engineering',
  },
  {
    id: '5',
    name: 'Rahul Verma',
    email: 'rahul.verma@metrodepot.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    phone: '+91 9876543214',
    photoUrl: '/avatars/technician1.jpg',
    avatar: '/avatars/technician1.jpg',
    joiningDate: '2020-05-25',
    skills: ['Electrical Repairs', 'Diagnostics'],
    badgeNo: 'T1001',
  },
  {
    id: '6',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@metrodepot.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    phone: '+91 9876543215',
    photoUrl: '/avatars/technician2.jpg',
    avatar: '/avatars/technician2.jpg',
    joiningDate: '2020-06-30',
    skills: ['Mechanical Repairs', 'Welding'],
    badgeNo: 'T1002',
  },
  {
    id: '7',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@metrodepot.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    phone: '+91 9876543216',
    photoUrl: '/avatars/technician3.jpg',
    avatar: '/avatars/technician3.jpg',
    joiningDate: '2020-07-05',
    skills: ['Electronics', 'Control Systems'],
    badgeNo: 'T1003',
  }
];

// Start of tasks mock data
export const tasks: Task[] = [
  {
    id: 't1',
    title: 'Inspect brake systems on Train Set 15',
    description: 'Perform routine inspection of brake systems on all cars of Train Set 15.',
    priority: 'high',
    status: 'in_progress',
    assignedTo: '5',
    assignedBy: '2',
    createdAt: '2025-04-13T09:00:00',
    dueDate: '2025-04-15T17:00:00',
    category: 'inspection',
    trainId: 't1'
  },
  {
    id: 't2',
    title: 'Replace HVAC filters on Train Set 16',
    description: 'Replace all HVAC filters on Train Set 16 as part of scheduled maintenance.',
    priority: 'medium',
    status: 'pending',
    assignedTo: '6',
    assignedBy: '2',
    createdAt: '2025-04-13T10:30:00',
    dueDate: '2025-04-16T17:00:00',
    category: 'maintenance',
    trainId: 't2'
  },
  {
    id: 't3',
    title: 'Repair door mechanism on Car 2 of Train Set 16',
    description: 'Fix door closing issue on Car 2 of Train Set 16. Door not sealing properly.',
    priority: 'high',
    status: 'pending',
    assignedTo: '7',
    assignedBy: '3',
    createdAt: '2025-04-13T11:45:00',
    dueDate: '2025-04-14T17:00:00',
    category: 'repair',
    trainId: 't2',
    carId: 'c2-t2'
  },
  {
    id: 't4',
    title: 'Clean interior of Train Set 17',
    description: 'Perform deep cleaning of all interior surfaces of Train Set 17.',
    priority: 'low',
    status: 'completed',
    assignedTo: '5',
    assignedBy: '2',
    createdAt: '2025-04-12T09:15:00',
    dueDate: '2025-04-13T17:00:00',
    completedAt: '2025-04-13T15:30:00',
    category: 'cleaning',
    trainId: 't3'
  },
  {
    id: 't5',
    title: 'Update maintenance logs for Train Set 15',
    description: 'Update all maintenance logs and documentation for Train Set 15 for the past month.',
    priority: 'medium',
    status: 'delayed',
    assignedTo: '4',
    assignedBy: '2',
    createdAt: '2025-04-10T14:00:00',
    dueDate: '2025-04-12T17:00:00',
    category: 'administrative',
    trainId: 't1'
  },
  {
    id: 't6',
    title: 'Inspect pantograph on Train Set 18',
    description: 'Perform detailed inspection of pantograph system on Train Set 18.',
    priority: 'urgent',
    status: 'in_progress',
    assignedTo: '3',
    assignedBy: '2',
    createdAt: '2025-04-13T08:30:00',
    dueDate: '2025-04-14T12:00:00',
    category: 'inspection',
    trainId: 't4'
  }
];

// Start of projects mock data
export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Delhi Metro Phase IV',
    description: 'Extension of Delhi Metro network with three new corridors spanning 61.68 km.',
    status: 'Under Construction',
    location: 'Delhi',
    networkLength: 61.68,
    stations: 45,
    startDate: '2022-01-15',
    completionDate: '2025-12-31',
    completionPercentage: 65,
    budget: 250000000000,
    implementingAgency: 'Delhi Metro Rail Corporation',
    keyFeatures: ['Driverless train operation', 'Platform screen doors', 'Advanced CBTC signaling']
  },
  {
    id: 'p2',
    name: 'Mumbai Metro Line 3',
    description: 'Underground metro line connecting Cuffe Parade to SEEPZ.',
    status: 'Under Construction',
    location: 'Mumbai',
    networkLength: 33.5,
    stations: 27,
    startDate: '2021-06-20',
    completionDate: '2025-06-30',
    completionPercentage: 72,
    budget: 230000000000,
    implementingAgency: 'Mumbai Metro Rail Corporation',
    keyFeatures: ['Fully underground', 'Integrated with existing transport systems']
  },
  {
    id: 'p3',
    name: 'Bangalore Metro Phase 2',
    description: 'Extension of Bangalore Metro with new lines and extensions of existing lines.',
    status: 'Under Construction',
    location: 'Bangalore',
    networkLength: 72.1,
    stations: 62,
    startDate: '2020-11-10',
    completionDate: '2025-03-31',
    completionPercentage: 80,
    budget: 300000000000,
    implementingAgency: 'Bangalore Metro Rail Corporation',
    keyFeatures: ['Elevated and underground sections', 'Multi-modal integration']
  },
  {
    id: 'p4',
    name: 'Chennai Metro Phase 2',
    description: 'Three new corridors with 118.9 km of metro lines in Chennai.',
    status: 'Under Construction',
    location: 'Chennai',
    networkLength: 118.9,
    stations: 128,
    startDate: '2021-12-05',
    completionDate: '2026-12-31',
    completionPercentage: 45,
    budget: 630000000000,
    implementingAgency: 'Chennai Metro Rail Limited',
    keyFeatures: ['Largest metro expansion in South India', 'Advanced signaling system']
  },
  {
    id: 'p5',
    name: 'Kolkata East-West Metro',
    description: 'Connecting Howrah and Salt Lake via underwater tunnel beneath Hooghly River.',
    status: 'Under Construction',
    location: 'Kolkata',
    networkLength: 16.6,
    stations: 12,
    startDate: '2019-02-13',
    completionDate: '2023-12-31',
    completionPercentage: 90,
    budget: 85000000000,
    implementingAgency: 'Kolkata Metro Rail Corporation',
    keyFeatures: ['Underwater tunnel', 'First underwater metro in India']
  },
  {
    id: 'p6',
    name: 'Ahmedabad Metro Phase 1',
    description: 'Two corridors connecting eastern and western parts of Ahmedabad.',
    status: 'Operational',
    location: 'Ahmedabad',
    networkLength: 40.03,
    stations: 32,
    startDate: '2019-03-04',
    completionDate: '2023-09-30',
    completionPercentage: 100,
    budget: 126000000000,
    implementingAgency: 'Gujarat Metro Rail Corporation',
    keyFeatures: ['Energy-efficient design', 'Integration with BRTS']
  }
];

// Start of trains mock data
export const trains: Train[] = [
  {
    id: 't1',
    name: 'Train Set 15',
    status: 'active',
    lastMaintenance: '2025-03-25',
    nextMaintenance: '2025-04-25',
    totalTrips: 12050,
    totalDistance: 45890,
    totalKilometers: 45890,
    cars: [
      { id: 'c1-t1', position: 1, status: 'operational', lastInspection: '2025-03-25' },
      { id: 'c2-t1', position: 2, status: 'operational', lastInspection: '2025-03-25' },
      { id: 'c3-t1', position: 3, status: 'operational', lastInspection: '2025-03-25' },
      { id: 'c4-t1', position: 4, status: 'needs_maintenance', lastInspection: '2025-03-25' }
    ],
    manufacturer: 'Bombardier',
    commissionedDate: '2020-06-15',
  },
  {
    id: 't2',
    name: 'Train Set 16',
    status: 'maintenance',
    lastMaintenance: '2025-03-15',
    nextMaintenance: '2025-04-15',
    totalTrips: 11870,
    totalDistance: 43560,
    totalKilometers: 43560,
    cars: [
      { id: 'c1-t2', position: 1, status: 'operational', lastInspection: '2025-03-15' },
      { id: 'c2-t2', position: 2, status: 'under_maintenance', lastInspection: '2025-03-15' },
      { id: 'c3-t2', position: 3, status: 'operational', lastInspection: '2025-03-15' },
      { id: 'c4-t2', position: 4, status: 'operational', lastInspection: '2025-03-15' }
    ],
    manufacturer: 'Alstom',
    commissionedDate: '2020-07-22',
  },
  {
    id: 't3',
    name: 'Train Set 17',
    status: 'active',
    lastMaintenance: '2025-03-20',
    nextMaintenance: '2025-04-20',
    totalTrips: 12310,
    totalDistance: 46780,
    totalKilometers: 46780,
    cars: [
      { id: 'c1-t3', position: 1, status: 'operational', lastInspection: '2025-03-20' },
      { id: 'c2-t3', position: 2, status: 'operational', lastInspection: '2025-03-20' },
      { id: 'c3-t3', position: 3, status: 'operational', lastInspection: '2025-03-20' },
      { id: 'c4-t3', position: 4, status: 'operational', lastInspection: '2025-03-20' }
    ],
    manufacturer: 'Siemens',
    commissionedDate: '2020-08-05',
  },
  {
    id: 't4',
    name: 'Train Set 18',
    status: 'out_of_service',
    lastMaintenance: '2025-03-10',
    nextMaintenance: '2025-04-10',
    totalTrips: 11590,
    totalDistance: 42340,
    totalKilometers: 42340,
    cars: [
      { id: 'c1-t4', position: 1, status: 'under_maintenance', lastInspection: '2025-03-10' },
      { id: 'c2-t4', position: 2, status: 'under_maintenance', lastInspection: '2025-03-10' },
      { id: 'c3-t4', position: 3, status: 'needs_maintenance', lastInspection: '2025-03-10' },
      { id: 'c4-t4', position: 4, status: 'operational', lastInspection: '2025-03-10' }
    ],
    manufacturer: 'BEML',
    commissionedDate: '2020-09-12',
  }
];

// Start of issues mock data
export const issues: Issue[] = [
  {
    id: 'i1',
    title: 'Brake system failure in Car 2',
    description: 'Reports of unusual sounds during braking and longer stopping distance.',
    severity: 'high',
    status: 'open',
    reportedAt: '2025-04-14T08:30:00',
    reportedBy: '3',
    assignedTo: '5',
    trainId: 't1',
    carId: 'c2-t1',
    workCategory: 'Brake Systems',
    lastUpdated: '2025-04-14T09:15:00'
  },
  {
    id: 'i2',
    title: 'Door malfunction in Car 1',
    description: 'Door not closing properly and showing error code E045.',
    severity: 'medium',
    status: 'in_progress',
    reportedAt: '2025-04-13T14:20:00',
    reportedBy: '4',
    assignedTo: '6',
    trainId: 't2',
    carId: 'c1-t2',
    workCategory: 'Door Systems',
    workDetails: 'Investigating sensor issues and door alignment problems.',
    lastUpdated: '2025-04-14T10:30:00'
  },
  {
    id: 'i3',
    title: 'HVAC system not cooling properly',
    description: 'Temperature regulation issue in Car 3. Passengers complaining about heat.',
    severity: 'medium',
    status: 'in_progress',
    reportedAt: '2025-04-12T11:45:00',
    reportedBy: '3',
    assignedTo: '7',
    trainId: 't3',
    workCategory: 'HVAC Systems',
    workDetails: 'Checking refrigerant levels and condenser function.',
    lastUpdated: '2025-04-13T16:20:00'
  },
  {
    id: 'i4',
    title: 'Flickering lights in Car 2',
    description: 'Intermittent lighting issues in passenger area.',
    severity: 'low',
    status: 'open',
    reportedAt: '2025-04-11T09:15:00',
    reportedBy: '4',
    trainId: 't1',
    carId: 'c2-t1',
    workCategory: 'Electrical Systems',
    lastUpdated: '2025-04-11T10:00:00'
  },
  {
    id: 'i5',
    title: 'Propulsion system warning',
    description: 'Train control system showing warning code P078. Power limitations observed.',
    severity: 'critical',
    status: 'in_progress',
    reportedAt: '2025-04-10T16:30:00',
    reportedBy: '5',
    assignedTo: '5',
    trainId: 't4',
    workCategory: 'Propulsion Systems',
    workDetails: 'Diagnostic tests running. Possible inverter issue.',
    lastUpdated: '2025-04-14T08:00:00'
  },
  {
    id: 'i6',
    title: 'Passenger information display failure',
    description: 'Information displays in Car 1 and 2 not functioning.',
    severity: 'low',
    status: 'resolved',
    reportedAt: '2025-04-09T13:20:00',
    reportedBy: '3',
    assignedTo: '7',
    resolvedAt: '2025-04-10T15:45:00',
    trainId: 't2',
    carId: 'c1-t2',
    workCategory: 'Passenger Information Systems',
    workDetails: 'Rebooted system and replaced faulty display controller.',
    lastUpdated: '2025-04-10T15:45:00'
  }
];

// Start of activity logs mock data
export const activityLogs: ActivityLog[] = [
  {
    id: 'al1',
    userId: '5',
    action: 'Started task',
    details: 'Started inspection of brake systems on Train Set 15',
    timestamp: '2025-04-14T09:15:00',
    taskId: 't1',
    trainId: 't1'
  },
  {
    id: 'al2',
    userId: '3',
    action: 'Created issue',
    details: 'Reported brake system failure in Car 2 of Train Set 15',
    timestamp: '2025-04-14T08:30:00',
    trainId: 't1',
    carId: 'c2-t1'
  },
  {
    id: 'al3',
    userId: '2',
    action: 'Assigned task',
    details: 'Assigned HVAC filter replacement task to Suresh Kumar',
    timestamp: '2025-04-13T10:30:00',
    taskId: 't2',
    trainId: 't2'
  },
  {
    id: 'al4',
    userId: '7',
    action: 'Updated issue',
    details: 'Updated status of HVAC system issue to in-progress',
    timestamp: '2025-04-13T12:00:00',
    trainId: 't3'
  },
  {
    id: 'al5',
    userId: '5',
    action: 'Completed task',
    details: 'Completed interior cleaning of Train Set 17',
    timestamp: '2025-04-13T15:30:00',
    taskId: 't4',
    trainId: 't3'
  },
  {
    id: 'al6',
    userId: '3',
    action: 'Started task',
    details: 'Started inspection of pantograph on Train Set 18',
    timestamp: '2025-04-14T08:45:00',
    taskId: 't6',
    trainId: 't4'
  }
];

// Start of work categories mock data
export const workCategories: WorkCategory[] = [
  { id: 'wc1', name: 'Brake Systems' },
  { id: 'wc2', name: 'Door Systems' },
  { id: 'wc3', name: 'HVAC Systems' },
  { id: 'wc4', name: 'Electrical Systems' },
  { id: 'wc5', name: 'Propulsion Systems' },
  { id: 'wc6', name: 'Passenger Information Systems' },
  { id: 'wc7', name: 'Bogies and Suspension' },
  { id: 'wc8', name: 'Pantograph and Power Collection' },
  { id: 'wc9', name: 'Train Control Systems' },
  { id: 'wc10', name: 'Interior Components' }
];

// Start of daily work logs mock data
export const dailyWorkLogs: DailyWorkLog[] = [
  {
    id: 'dwl1',
    userId: '5',
    issueId: 'i1',
    date: '2025-04-14',
    workDescription: 'Inspected brake system on Car 2 of Train Set 15. Found worn brake pads and possible caliper issue.',
    hoursSpent: 3,
    status: 'in_progress'
  },
  {
    id: 'dwl2',
    userId: '6',
    issueId: 'i2',
    date: '2025-04-14',
    workDescription: 'Diagnosed door sensor issue on Car 1 of Train Set 16. Ordered replacement parts.',
    hoursSpent: 2.5,
    status: 'in_progress'
  },
  {
    id: 'dwl3',
    userId: '7',
    issueId: 'i3',
    date: '2025-04-14',
    workDescription: 'Checked HVAC system on Train Set 17. Found low refrigerant level. Refilled and testing.',
    hoursSpent: 4,
    status: 'in_progress'
  },
  {
    id: 'dwl4',
    userId: '5',
    date: '2025-04-13',
    workDescription: 'Completed routine inspection of Train Set 15 doors and windows.',
    hoursSpent: 6,
    status: 'completed'
  },
  {
    id: 'dwl5',
    userId: '3',
    issueId: 'i5',
    date: '2025-04-14',
    workDescription: 'Analyzed propulsion system warning on Train Set 18. Running diagnostic tests.',
    hoursSpent: 5,
    status: 'in_progress'
  },
  {
    id: 'dwl6',
    userId: '4',
    date: '2025-04-14',
    workDescription: 'Updated maintenance documentation for Train Set 15.',
    hoursSpent: 3,
    status: 'in_progress'
  }
];

// Start of attendance records mock data
export const attendanceRecords: AttendanceRecord[] = [
  {
    id: 'ar1',
    userId: '3',
    date: '2025-04-14',
    loginTime: '08:45',
    logoutTime: '17:30',
    status: 'present',
    workHours: 8.75,
    notes: '',
    checkIn: '08:45',
    checkOut: '17:30',
    remarks: ''
  },
  {
    id: 'ar2',
    userId: '4',
    date: '2025-04-14',
    loginTime: '08:30',
    logoutTime: '17:15',
    status: 'present',
    workHours: 8.75,
    notes: '',
    checkIn: '08:30',
    checkOut: '17:15',
    remarks: ''
  },
  {
    id: 'ar3',
    userId: '5',
    date: '2025-04-14',
    loginTime: '08:50',
    logoutTime: '17:45',
    status: 'present',
    workHours: 8.92,
    notes: '',
    checkIn: '08:50',
    checkOut: '17:45',
    remarks: ''
  },
  {
    id: 'ar4',
    userId: '6',
    date: '2025-04-14',
    loginTime: '09:15',
    logoutTime: '18:00',
    status: 'present',
    workHours: 8.75,
    notes: 'Late arrival',
    checkIn: '09:15',
    checkOut: '18:00',
    remarks: 'Late arrival'
  },
  {
    id: 'ar5',
    userId: '7',
    date: '2025-04-14',
    loginTime: '08:40',
    logoutTime: '17:30',
    status: 'present',
    workHours: 8.83,
    notes: '',
    checkIn: '08:40',
    checkOut: '17:30',
    remarks: ''
  },
  {
    id: 'ar6',
    userId: '3',
    date: '2025-04-13',
    loginTime: '08:30',
    logoutTime: '17:15',
    status: 'present',
    workHours: 8.75,
    notes: '',
    checkIn: '08:30',
    checkOut: '17:15',
    remarks: ''
  }
];

// Start of project updates mock data
export const projectUpdates: ProjectUpdate[] = [
  {
    id: 'pu1',
    projectId: 'p1',
    title: 'Tunneling work completed for Corridor 1',
    date: '2025-04-10',
    content: 'The tunneling work for Corridor 1 of Delhi Metro Phase IV has been completed ahead of schedule. This marks a significant milestone in the project.',
    source: 'Project Manager Report'
  },
  {
    id: 'pu2',
    projectId: 'p2',
    title: 'Station construction at 75% completion',
    date: '2025-04-08',
    content: 'Construction of all 27 stations on Mumbai Metro Line 3 has reached 75% completion. Interior work and systems installation has begun at several stations.',
    source: 'Weekly Progress Report'
  },
  {
    id: 'pu3',
    projectId: 'p3',
    title: 'Track laying begins on Purple Line extension',
    date: '2025-04-12',
    content: 'Track laying work has commenced on the Purple Line extension of Bangalore Metro Phase 2. This 15.5 km stretch will connect Baiyappanahalli to Whitefield.',
    source: 'Project Update Bulletin'
  },
  {
    id: 'pu4',
    projectId: 'p4',
    title: 'Land acquisition completed for Corridor 3',
    date: '2025-04-05',
    content: 'The land acquisition process for Corridor 3 of Chennai Metro Phase 2 has been completed. Construction work is expected to begin next month.',
    source: 'Official Press Release'
  },
  {
    id: 'pu5',
    projectId: 'p5',
    title: 'Underwater tunnel reaches final stage',
    date: '2025-04-14',
    content: 'The underwater tunnel beneath Hooghly River has reached its final construction stage. Systems installation and safety testing will begin next week.',
    source: 'Engineering Team Report'
  }
];

// Start of maintenance schedules mock data
export const maintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: 'ms1',
    trainId: 't1',
    type: 'routine',
    description: 'Monthly inspection of all systems',
    scheduledDate: '2025-04-25',
    status: 'scheduled',
    assignedTo: '3,5',
    startDate: '2025-04-25T09:00:00',
    endDate: '2025-04-25T17:00:00',
    notes: 'Focus on brake system inspection'
  },
  {
    id: 'ms2',
    trainId: 't2',
    type: 'corrective',
    description: 'Door mechanism repair on Car 2',
    scheduledDate: '2025-04-16',
    status: 'scheduled',
    assignedTo: '6',
    startDate: '2025-04-16T09:00:00',
    endDate: '2025-04-16T15:00:00',
    notes: 'Replacement parts have been ordered'
  },
  {
    id: 'ms3',
    trainId: 't3',
    type: 'preventive',
    description: 'HVAC system maintenance',
    scheduledDate: '2025-04-20',
    status: 'scheduled',
    assignedTo: '7',
    startDate: '2025-04-20T09:00:00',
    endDate: '2025-04-20T16:00:00',
    notes: 'Check refrigerant levels and clean filters'
  },
  {
    id: 'ms4',
    trainId: 't4',
    type: 'corrective',
    description: 'Propulsion system troubleshooting',
    scheduledDate: '2025-04-15',
    status: 'in_progress',
    assignedTo: '3,4',
    startDate: '2025-04-15T08:00:00',
    endDate: '2025-04-17T17:00:00',
    notes: 'Extended maintenance period due to complexity'
  },
  {
    id: 'ms5',
    trainId: 't1',
    type: 'routine',
    description: 'Quarterly safety inspection',
    scheduledDate: '2025-05-10',
    status: 'scheduled',
    assignedTo: '2,3,4',
    startDate: '2025-05-10T08:00:00',
    endDate: '2025-05-12T17:00:00',
    notes: 'Comprehensive safety check of all systems'
  }
];

// Dashboard statistics data
export const dashboardStats = {
  totalTasks: tasks.length,
  completedTasks: tasks.filter(t => t.status === 'completed').length,
  pendingTasks: tasks.filter(t => t.status === 'pending' || t.status === 'in_progress' || t.status === 'delayed').length,
  activeTrains: trains.filter(t => t.status === 'active').length,
  issuesByPriority: {
    low: issues.filter(i => i.severity === 'low').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    high: issues.filter(i => i.severity === 'high').length,
    critical: issues.filter(i => i.severity === 'critical').length,
  },
  issuesByStatus: {
    open: issues.filter(i => i.status === 'open').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  }
};

// Helper functions to get data in different formats
export const getUserById = (userId: string): User | undefined => {
  return users.find(user => user.id === userId);
};

export const getTasksByStatus = (status: Task['status']): Task[] => {
  return tasks.filter(task => task.status === status);
};

export const getIssuesByStatus = (status: Issue['status']): Issue[] => {
  return issues.filter(issue => issue.status === status);
};

export const getIssuesBySeverity = (severity: Issue['severity']): Issue[] => {
  return issues.filter(issue => issue.severity === severity);
};

export const getIssuesByAssignee = (userId: string): Issue[] => {
  return issues.filter(issue => issue.assignedTo === userId);
};

export const getIssuesByAssigner = (userId: string): Issue[] => {
  return issues.filter(issue => issue.assignedBy === userId);
};

export const getProjects = () => {
  return projects;
};

export const getProjectUpdates = () => {
  return projectUpdates;
};

// Mock tasks for the tasks page
export const mockTasks = tasks;

// CRUD functions for tasks
export const addNewTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const newTask: Task = {
    id: `t${tasks.length + 1}`,
    createdAt: new Date().toISOString(),
    ...task,
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Task>): Task | null => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return null;
  
  tasks[index] = { ...tasks[index], ...updates };
  return tasks[index];
};

export const deleteTask = (id: string): boolean => {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasks.splice(index, 1);
  return true;
};

// CRUD functions for issues
export const addNewIssue = (issue: Omit<Issue, 'id' | 'reportedAt' | 'lastUpdated'>): Issue => {
  const newIssue: Issue = {
    id: `i${issues.length + 1}`,
    reportedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    ...issue,
  };
  issues.push(newIssue);
  return newIssue;
};

export const updateIssue = (id: string, updates: Partial<Issue>): Issue | null => {
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return null;
  
  issues[index] = { 
    ...issues[index], 
    ...updates, 
    lastUpdated: new Date().toISOString() 
  };
  return issues[index];
};

export const deleteIssue = (id: string): boolean => {
  const index = issues.findIndex(i => i.id === id);
  if (index === -1) return false;
  
  issues.splice(index, 1);
  return true;
};

// Generate data for TasksChart
export const generateTasksChartData = () => {
  const today = new Date();
  
  return [
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assigned: 12,
      completed: 8,
      delayed: 1
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assigned: 15,
      completed: 10,
      delayed: 2
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assigned: 13,
      completed: 11,
      delayed: 0
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assigned: 10,
      completed: 8,
      delayed: 1
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assigned: 14,
      completed: 9,
      delayed: 2
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assigned: 11,
      completed: 7,
      delayed: 0
    },
    {
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assigned: 9,
      completed: 5,
      delayed: 1
    }
  ];
};

// Generate data for efficiency analysis
export const generateEfficiencyData = () => {
  return [
    { name: 'Jan', efficiency: 82 },
    { name: 'Feb', efficiency: 85 },
    { name: 'Mar', efficiency: 83 },
    { name: 'Apr', efficiency: 87 },
    { name: 'May', efficiency: 89 },
    { name: 'Jun', efficiency: 86 },
    { name: 'Jul', efficiency: 90 },
    { name: 'Aug', efficiency: 92 },
    { name: 'Sep', efficiency: 88 },
    { name: 'Oct', efficiency: 91 },
    { name: 'Nov', efficiency: 86 },
    { name: 'Dec', efficiency: 84 }
  ];
};

// Get user working hours data
export const getUserWorkingHours = () => {
  return users.map(user => ({
    name: user.name,
    hours: Math.floor(Math.random() * 40) + 30
  })).slice(0, 6);
};

// Function to get users by role
export const getUsersByRole = (role: UserRole) => {
  return users.filter(user => user.role === role);
};

// Train sets and car configurations
export const trainSets = Array.from({ length: 25 }, (_, i) => ({
  id: `TS${String(i + 1).padStart(2, '0')}`,
  name: `Train Set ${String(i + 1).padStart(2, '0')}`,
  cars: ['DMC1', 'TC1', 'MC1', 'MC2', 'TC2', 'DMC2']
}));

// Categories for maintenance tasks
export const taskCategories = [
  'Corrective Maintenance',
  'Preventive Maintenance',
  'Other Preventive Maintenance',
  'Breakdown Maintenance',
  'Condition Based Maintenance',
  'Scheduled Overhaul',
  'Emergency Repair',
  'System Upgrade',
  'Inspection',
  'Testing',
  'Software Update',
  'Hardware Replacement',
  'Cleaning',
  'Lubrication',
  'Calibration'
];

// Replace users array with updated users (in a real app, this would be a proper database update)
export const updatedUsers = [
  // Depot Incharge
  {
    id: 'user-28529',
    name: 'Shashi Shekhar Mishra',
    email: 'shashi.mishra@metro.com',
    role: UserRole.DEPOT_INCHARGE,
    department: 'Operations',
    phone: '9799494321',
    badgeNo: '28529',
    aadharNo: '3273 4243 3126',
    vehicleNo: 'RJ14QD3250',
    photoUrl: '/avatars/depot_incharge.jpg',
    avatar: '/avatars/depot_incharge.jpg',
    joiningDate: '2021-05-15',
  },
  
  // Engineers
  {
    id: 'user-28463',
    name: 'Shilpa Sahu',
    email: 'shilpa.sahu@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '8088114265',
    badgeNo: '28463',
    aadharNo: '9696 3676 8427',
    vehicleNo: 'NA',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2021-06-10',
  },
  {
    id: 'user-28481',
    name: 'Sunil Kumar Rajan',
    email: 'sunil.rajan@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '9743809617',
    badgeNo: '28481',
    aadharNo: '5157 5618 0505',
    vehicleNo: 'WB08F9720',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2021-06-12',
  },
  {
    id: 'user-28584',
    name: 'Arghya Kar',
    email: 'arghya.kar@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '9887200225',
    badgeNo: '28584',
    aadharNo: '3298 7682 6260',
    vehicleNo: 'NA',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2021-07-05',
  },
  {
    id: 'user-28592',
    name: 'Shirshendu Majumdar',
    email: 'shirshendu.majumdar@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '8882008820',
    badgeNo: '28592',
    aadharNo: '7670 8754 5492',
    vehicleNo: 'KA09EW7514',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2021-07-10',
  },
  {
    id: 'user-29657',
    name: 'Ritesh Anand',
    email: 'ritesh.anand@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '6289039307',
    badgeNo: '29657',
    aadharNo: '4303 4619 3795',
    vehicleNo: '23BH3124F',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2022-01-15',
  },
  {
    id: 'user-70147',
    name: 'Akhilesh Yadav',
    email: 'akhilesh.yadav@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '7363015472',
    badgeNo: '70147',
    aadharNo: '7678 0043 0294',
    vehicleNo: 'NA',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2022-03-20',
  },
  {
    id: 'user-70153',
    name: 'Chandan Kumar',
    email: 'chandan.kumar@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '7827196830',
    badgeNo: '70153',
    aadharNo: '5735 8890 3931',
    vehicleNo: 'NA',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2022-03-25',
  },
  {
    id: 'user-70157',
    name: 'Rahul Yadav',
    email: 'rahul.yadav@metro.com',
    role: UserRole.ENGINEER,
    department: 'Engineering',
    phone: '8250870410',
    badgeNo: '70157',
    aadharNo: '3526 2708 5671',
    vehicleNo: 'NA',
    photoUrl: '/avatars/engineer.jpg',
    avatar: '/avatars/engineer.jpg',
    joiningDate: '2022-04-01',
  },
  
  // Technicians/Employees
  {
    id: 'user-001',
    name: 'Manidip Baisya',
    email: 'manidip.baisya@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '7003839458',
    badgeNo: 'RIS/BEML/001',
    aadharNo: '4285 5282 1806',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-01-10',
  },
  {
    id: 'user-002',
    name: 'Md Aslam',
    email: 'md.aslam@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '8017550486',
    badgeNo: 'RIS/BEML/002',
    aadharNo: '9409 1790 6974',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-01-15',
  },
  {
    id: 'user-003',
    name: 'Aboozar Shaikh',
    email: 'aboozar.shaikh@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '9007836804',
    badgeNo: 'RIS/BEML/003',
    aadharNo: '2499 9698 5170',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-02-01',
  },
  {
    id: 'user-005',
    name: 'Rajdeep Roy',
    email: 'rajdeep.roy@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '8637827142',
    badgeNo: 'RIS/BEML/005',
    aadharNo: '4675 3368 8407',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-02-15',
  },
  {
    id: 'user-006',
    name: 'Siddhartha Saha',
    email: 'siddhartha.saha@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '9046964432',
    badgeNo: 'RIS/BEML/006',
    aadharNo: '5271 1948 1475',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-03-01',
  },
  {
    id: 'user-007',
    name: 'Chittaranjan Ray Choudhuri',
    email: 'chittaranjan.ray@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '9641236618',
    badgeNo: 'RIS/BEML/007',
    aadharNo: '2305 1629 0407',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-03-10',
  },
  {
    id: 'user-009',
    name: 'Haragobinda Adhikary',
    email: 'haragobinda.adhikary@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '9382820621',
    badgeNo: 'RIS/BEML/009',
    aadharNo: '4863 2085 0089',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-04-01',
  },
  {
    id: 'user-010',
    name: 'Sanjay Kharwar',
    email: 'sanjay.kharwar@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '7980544767',
    badgeNo: 'RIS/BEML/010',
    aadharNo: '6185 2514 9450',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-04-15',
  },
  {
    id: 'user-012',
    name: 'Mohammad Zainul Haque',
    email: 'mohammad.zainul@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Transport',
    phone: '8013236486',
    badgeNo: 'RIS/BEML/012',
    aadharNo: '7758 3239 3570',
    vehicleNo: 'WB02AK6274',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-05-10',
    position: 'Driver',
  },
  {
    id: 'user-017',
    name: 'Deep Kumar Ghosh',
    email: 'deep.ghosh@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Technical',
    phone: '7278387958',
    badgeNo: 'RIS/BEML/017',
    aadharNo: '5813 6802 7705',
    vehicleNo: 'NA',
    photoUrl: '/avatars/technician.jpg',
    avatar: '/avatars/technician.jpg',
    joiningDate: '2023-07-01',
  },
  
  // Store Persons
  {
    id: 'user-014',
    name: 'Debtanu Banerjee',
    email: 'debtanu.banerjee@metro.com',
    role: UserRole.STORE_PERSON,
    department: 'Stores',
    phone: '8910183853',
    badgeNo: 'RIS/BEML/014',
    aadharNo: '4604 7620 9910',
    vehicleNo: 'NA',
    photoUrl: '/avatars/store_person.jpg',
    avatar: '/avatars/store_person.jpg',
    joiningDate: '2023-06-01',
  },
  {
    id: 'user-016',
    name: 'Sanjay Kumar Chaudhary',
    email: 'sanjay.chaudhary@metro.com',
    role: UserRole.STORE_PERSON,
    department: 'Stores',
    phone: '7890691445',
    badgeNo: 'RIS/BEML/016',
    aadharNo: '5764 7442 8367',
    vehicleNo: 'NA',
    photoUrl: '/avatars/store_person.jpg',
    avatar: '/avatars/store_person.jpg',
    joiningDate: '2023-06-15',
  },
  {
    id: 'user-019',
    name: 'Sahin Mondal',
    email: 'sahin.mondal@metro.com',
    role: UserRole.STORE_PERSON,
    department: 'Stores',
    phone: '6296140186',
    badgeNo: 'RIS/BEML/019',
    aadharNo: '7837 0808 4223',
    vehicleNo: 'NA',
    photoUrl: '/avatars/store_person.jpg',
    avatar: '/avatars/store_person.jpg',
    joiningDate: '2023-07-15',
  },
  
  // Data Entry Operators
  {
    id: 'user-011',
    name: 'Koushik Kundu',
    email: 'koushik.kundu@metro.com',
    role: UserRole.DATA_ENTRY_OPERATOR,
    department: 'Administration',
    phone: '9007120799',
    badgeNo: 'RIS/BEML/011',
    aadharNo: '9659 4811 7620',
    vehicleNo: 'NA',
    photoUrl: '/avatars/operator.jpg',
    avatar: '/avatars/operator.jpg',
    joiningDate: '2023-05-01',
  },
  {
    id: 'user-018',
    name: 'Mrityunjoy Sarkar',
    email: 'mrityunjoy.sarkar@metro.com',
    role: UserRole.DATA_ENTRY_OPERATOR,
    department: 'Administration',
    phone: '7074878121',
    badgeNo: 'RIS/BEML/018',
    aadharNo: '5284 6996 9386',
    vehicleNo: 'NA',
    photoUrl: '/avatars/operator.jpg',
    avatar: '/avatars/operator.jpg',
    joiningDate: '2023-07-10',
  },
];
