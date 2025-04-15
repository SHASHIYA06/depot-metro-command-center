import { User, UserRole, Train, Car, Issue, Task, ActivityLog, MaintenanceSchedule, WorkCategory, DailyWorkLog, AttendanceRecord, Project, ProjectUpdate } from '@/types';
import { addDays, subDays, format } from 'date-fns';

// Dashboard stats
export const dashboardStats = {
  totalTasks: 26,
  completedTasks: 18,
  pendingTasks: 8,
  delayedTasks: 4,
  activeTrains: 3,
  trainsInMaintenance: 1,
  issuesByPriority: {
    low: 2,
    medium: 3,
    high: 4,
    critical: 1
  },
  upcomingMaintenance: []
};

// Mock users data
export const users: User[] = [
  {
    id: 'u1',
    name: 'SHASHI SHEKHAR MISHRA',
    email: 'shashi.mishra@metro.com',
    role: UserRole.DEPOT_INCHARGE,
    department: 'Operations',
    avatar: '/placeholder.svg',
    phone: '9799494321',
    address: 'Metro Colony, New Delhi',
    joiningDate: '2020-01-15',
    skills: ['Management', 'Operations', 'Team Leadership'],
    education: 'B.Tech in Mechanical Engineering',
    emergencyContact: '9799494322',
    badgeNo: '28529',
    aadharNo: '3273 4243 3126',
    vehicleNo: 'RJ14QD3250'
  },
  {
    id: 'u2',
    name: 'SHILPA SAHU',
    email: 'shilpa.sahu@metro.com',
    role: UserRole.ENGINEER,
    department: 'Electrical Systems',
    avatar: '/placeholder.svg',
    phone: '8088114265',
    address: 'Metro Staff Quarters, Block A, New Delhi',
    joiningDate: '2021-03-10',
    skills: ['Electrical Systems', 'PLC Programming', 'Troubleshooting'],
    education: 'B.Tech in Electrical Engineering',
    emergencyContact: '8088114266',
    badgeNo: '28463',
    aadharNo: '9696 3676 8427',
    vehicleNo: 'NA'
  },
  {
    id: 'u3',
    name: 'SUNIL KUMAR RAJAN',
    email: 'sunil.rajan@metro.com',
    role: UserRole.ENGINEER,
    department: 'Mechanical Systems',
    avatar: '/placeholder.svg',
    phone: '9743809617',
    address: 'Sector 45, Gurgaon',
    joiningDate: '2021-05-20',
    skills: ['Mechanical Systems', 'HVAC', 'Preventive Maintenance'],
    education: 'B.Tech in Mechanical Engineering',
    emergencyContact: '9743809618',
    badgeNo: '28481',
    aadharNo: '5157 5618 0505',
    vehicleNo: 'WB08F9720'
  },
  {
    id: 'u4',
    name: 'ARGHYA KAR',
    email: 'arghya.kar@metro.com',
    role: UserRole.ENGINEER,
    department: 'Maintenance',
    avatar: '/placeholder.svg',
    phone: '9887200225',
    address: 'Mayur Vihar, Delhi',
    joiningDate: '2022-02-15',
    skills: ['Electrical Maintenance', 'Basic Electronics', 'Tool Handling'],
    education: 'B.Tech in Electrical Engineering',
    emergencyContact: '9887200226',
    badgeNo: '28584',
    aadharNo: '3298 7682 6260',
    vehicleNo: 'NA'
  },
  {
    id: 'u5',
    name: 'SHIRSHENDU MAJUMDAR',
    email: 'shirshendu.majumdar@metro.com',
    role: UserRole.ENGINEER,
    department: 'Electrical Systems',
    avatar: '/placeholder.svg',
    phone: '8882008820',
    address: 'Dwarka, New Delhi',
    joiningDate: '2022-06-10',
    skills: ['Wiring', 'AC/DC Systems', 'Circuit Testing'],
    education: 'B.Tech in Electrical',
    emergencyContact: '8882008821',
    badgeNo: '28592',
    aadharNo: '7670 8754 5492',
    vehicleNo: 'KA09EW7514'
  },
  {
    id: 'u6',
    name: 'RITESH ANAND',
    email: 'ritesh.anand@metro.com',
    role: UserRole.ENGINEER,
    department: 'Signal Systems',
    avatar: '/placeholder.svg',
    phone: '6289039307',
    address: 'Noida, UP',
    joiningDate: '2022-07-15',
    skills: ['Signal Systems', 'Control Systems', 'Automated Testing'],
    education: 'B.Tech in Electronics',
    emergencyContact: '6289039308',
    badgeNo: '29657',
    aadharNo: '4303 4619 3795',
    vehicleNo: '23BH3124F'
  },
  {
    id: 'u7',
    name: 'AKHILESH YADAV',
    email: 'akhilesh.yadav@metro.com',
    role: UserRole.ENGINEER,
    department: 'Track Systems',
    avatar: '/placeholder.svg',
    phone: '7363015472',
    address: 'Ghaziabad, UP',
    joiningDate: '2022-08-20',
    skills: ['Track Inspection', 'Survey Equipment', 'Alignment Techniques'],
    education: 'B.Tech in Civil Engineering',
    emergencyContact: '7363015473',
    badgeNo: '70147',
    aadharNo: '7678 0043 0294',
    vehicleNo: 'NA'
  },
  {
    id: 'u8',
    name: 'CHANDAN KUMAR',
    email: 'chandan.kumar@metro.com',
    role: UserRole.ENGINEER,
    department: 'Power Systems',
    avatar: '/placeholder.svg',
    phone: '7827196830',
    address: 'Vaishali, Ghaziabad',
    joiningDate: '2022-09-10',
    skills: ['Power Distribution', 'Substation Maintenance', 'Protection Systems'],
    education: 'B.Tech in Electrical Engineering',
    emergencyContact: '7827196831',
    badgeNo: '70153',
    aadharNo: '5735 8890 3931',
    vehicleNo: 'NA'
  },
  {
    id: 'u9',
    name: 'RAHUL YADAV',
    email: 'rahul.yadav@metro.com',
    role: UserRole.ENGINEER,
    department: 'Communication Systems',
    avatar: '/placeholder.svg',
    phone: '8250870410',
    address: 'Rohini, Delhi',
    joiningDate: '2022-10-15',
    skills: ['RF Systems', 'Network Management', 'CCTV Systems'],
    education: 'B.Tech in Electronics & Communication',
    emergencyContact: '8250870411',
    badgeNo: '70157',
    aadharNo: '3526 2708 5671',
    vehicleNo: 'NA'
  },
  {
    id: 'u10',
    name: 'MANIDIP BAISYA',
    email: 'manidip.baisya@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    avatar: '/placeholder.svg',
    phone: '7003839458',
    address: 'Karol Bagh, Delhi',
    joiningDate: '2023-01-10',
    skills: ['Mechanical Repairs', 'Preventive Maintenance', 'Tool Handling'],
    education: 'Diploma in Mechanical Engineering',
    emergencyContact: '7003839459',
    badgeNo: 'RIS/BEML/001',
    aadharNo: '4285 5282 1806',
    vehicleNo: 'NA'
  },
  {
    id: 'u11',
    name: 'MD ASLAM',
    email: 'md.aslam@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    avatar: '/placeholder.svg',
    phone: '8017550486',
    address: 'Saket, Delhi',
    joiningDate: '2023-01-15',
    skills: ['Electrical Repairs', 'Wiring', 'Troubleshooting'],
    education: 'ITI Electrical',
    emergencyContact: '8017550487',
    badgeNo: 'RIS/BEML/002',
    aadharNo: '9409 1790 6974',
    vehicleNo: 'NA'
  },
  {
    id: 'u12',
    name: 'ABOOZAR SHAIKH',
    email: 'aboozar.shaikh@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    avatar: '/placeholder.svg',
    phone: '9007836804',
    address: 'Lajpat Nagar, Delhi',
    joiningDate: '2023-01-20',
    skills: ['HVAC Systems', 'Cooling Systems', 'Air Conditioning'],
    education: 'Diploma in HVAC',
    emergencyContact: '9007836805',
    badgeNo: 'RIS/BEML/003',
    aadharNo: '2499 9698 5170',
    vehicleNo: 'NA'
  },
  {
    id: 'u13',
    name: 'RAJDEEP ROY',
    email: 'rajdeep.roy@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Track Maintenance',
    avatar: '/placeholder.svg',
    phone: '8637827142',
    address: 'Connaught Place, Delhi',
    joiningDate: '2023-02-05',
    skills: ['Track Inspection', 'Rail Maintenance', 'Welding'],
    education: 'ITI Mechanical',
    emergencyContact: '8637827143',
    badgeNo: 'RIS/BEML/005',
    aadharNo: '4675 3368 8407',
    vehicleNo: 'NA'
  },
  {
    id: 'u14',
    name: 'SIDDHARTHA SAHA',
    email: 'siddhartha.saha@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Maintenance',
    avatar: '/placeholder.svg',
    phone: '9046964432',
    address: 'Rajouri Garden, Delhi',
    joiningDate: '2023-02-10',
    skills: ['Electronics Repair', 'PCB Troubleshooting', 'Soldering'],
    education: 'Diploma in Electronics',
    emergencyContact: '9046964433',
    badgeNo: 'RIS/BEML/006',
    aadharNo: '5271 1948 1475',
    vehicleNo: 'NA'
  },
  {
    id: 'u15',
    name: 'CHITTARANJAN RAY CHOUDHURI',
    email: 'chittaranjan.choudhuri@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Electrical Maintenance',
    avatar: '/placeholder.svg',
    phone: '9641236618',
    address: 'Janakpuri, Delhi',
    joiningDate: '2023-02-15',
    skills: ['Power Systems', 'UPS Maintenance', 'Battery Systems'],
    education: 'ITI Electrical',
    emergencyContact: '9641236619',
    badgeNo: 'RIS/BEML/007',
    aadharNo: '2305 1629 0407',
    vehicleNo: 'NA'
  },
  {
    id: 'u16',
    name: 'HARAGOBINDA ADHIKARY',
    email: 'haragobinda.adhikary@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Signal Maintenance',
    avatar: '/placeholder.svg',
    phone: '9382820621',
    address: 'Tilak Nagar, Delhi',
    joiningDate: '2023-02-25',
    skills: ['Signal Repair', 'Control Systems', 'Circuit Testing'],
    education: 'Diploma in Electronics',
    emergencyContact: '9382820622',
    badgeNo: 'RIS/BEML/009',
    aadharNo: '4863 2085 0089',
    vehicleNo: 'NA'
  },
  {
    id: 'u17',
    name: 'SANJAY KHARWAR',
    email: 'sanjay.kharwar@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Mechanical Maintenance',
    avatar: '/placeholder.svg',
    phone: '7980544767',
    address: 'Dwarka Sector 14, Delhi',
    joiningDate: '2023-03-01',
    skills: ['Mechanical Repair', 'Lubrication Systems', 'Bearing Replacement'],
    education: 'ITI Mechanical',
    emergencyContact: '7980544768',
    badgeNo: 'RIS/BEML/010',
    aadharNo: '6185 2514 9450',
    vehicleNo: 'NA'
  },
  {
    id: 'u18',
    name: 'KOUSHIK KUNDU',
    email: 'koushik.kundu@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Communication Systems',
    avatar: '/placeholder.svg',
    phone: '9007120799',
    address: 'Mayur Vihar Phase 1, Delhi',
    joiningDate: '2023-03-05',
    skills: ['Network Troubleshooting', 'CCTV Maintenance', 'Radio Systems'],
    education: 'Diploma in Communication',
    emergencyContact: '9007120800',
    badgeNo: 'RIS/BEML/011',
    aadharNo: '9659 4811 7620',
    vehicleNo: 'NA'
  },
  {
    id: 'u19',
    name: 'MOHAMMAD ZAINUL HAQUE',
    email: 'mohammad.haque@metro.com',
    role: UserRole.TECHNICIAN,
    department: 'Transportation',
    avatar: '/placeholder.svg',
    phone: '8013236486',
    address: 'Dilshad Garden, Delhi',
    joiningDate: '2023-03-10',
    skills: ['Vehicle Operation', 'Route Planning', 'Safe Driving'],
    education: 'Driver License',
    emergencyContact: '8013236487',
    badgeNo: 'RIS/BEML/012',
    aadharNo: '7758 3239 3570',
    vehicleNo: 'WB02AK6274'
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

// Tasks data for dashboard
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Inspect and replace brake pads on Train C',
    description: 'Complete inspection of all brake systems and replace worn pads',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'u3',
    assignedBy: 'u1',
    createdAt: subDays(new Date(), 5).toISOString(),
    dueDate: addDays(new Date(), 2).toISOString(),
    trainId: 't3',
    category: 'maintenance'
  },
  {
    id: 't2',
    title: 'AC system repair in Car 3',
    description: 'Replace compressor and check refrigerant levels',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'u4',
    assignedBy: 'u1',
    createdAt: subDays(new Date(), 3).toISOString(),
    dueDate: addDays(new Date(), 4).toISOString(),
    trainId: 't1',
    carId: 'c3-t1',
    category: 'repair'
  },
  {
    id: 't3',
    title: 'Monthly safety inspection for Train A',
    description: 'Conduct comprehensive safety checks as per protocol',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'u2',
    assignedBy: 'u1',
    createdAt: subDays(new Date(), 10).toISOString(),
    dueDate: subDays(new Date(), 5).toISOString(),
    completedAt: subDays(new Date(), 6).toISOString(),
    trainId: 't1',
    category: 'inspection'
  },
  {
    id: 't4',
    title: 'Signal system firmware update',
    description: 'Apply latest firmware patch to fix intermittent issues',
    priority: 'urgent',
    status: 'pending',
    assignedTo: 'u2',
    assignedBy: 'u1',
    createdAt: subDays(new Date(), 1).toISOString(),
    dueDate: addDays(new Date(), 1).toISOString(),
    trainId: 't2',
    category: 'maintenance'
  },
  {
    id: 't5',
    title: 'Deep clean Car 4 after vandalism repairs',
    description: 'Clean seats, floors, and surfaces thoroughly',
    priority: 'low',
    status: 'completed',
    assignedTo: 'u5',
    assignedBy: 'u1',
    createdAt: subDays(new Date(), 8).toISOString(),
    dueDate: subDays(new Date(), 6).toISOString(),
    completedAt: subDays(new Date(), 7).toISOString(),
    trainId: 't1',
    carId: 'c4-t1',
    category: 'cleaning'
  }
];

// For backward compatibility
export const tasks = mockTasks;

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

export const getIssuesByAssigner = (userId: string): Issue[] => {
  return issues.filter(issue => issue.assignedBy === userId);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Helper functions for tasks
export const getTasksByStatus = (status: string): Task[] => {
  return mockTasks.filter(task => task.status === status);
};

export const getTasksByAssignee = (assigneeId: string): Task[] => {
  return mockTasks.filter(task => task.assignedTo === assigneeId);
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
    ...issue,
    id: `i${issues.length + 1}`, // Generate a new unique ID
    reportedAt: new Date().toISOString(), // Set current timestamp
    lastUpdated: new Date().toISOString(), // Set current timestamp
    status: issue.status || 'open', // Default to 'open' if not provided
  };

  issues.push(newIssue);
  return newIssue;
};

// Add a delete issue function as well
export const deleteIssue = (issueId: string): boolean => {
  const initialLength = issues.length;
  const filteredIssues = issues.filter(issue => issue.id !== issueId);
  
  if (filteredIssues.length < initialLength) {
    // Clear the original array and repopulate
    issues.length = 0;
    issues.push(...filteredIssues);
    return true;
  }
  
  return false;
};

// Add an update issue function
export const updateIssue = (issueId: string, updatedFields: Partial<Omit<Issue, 'id'>>): Issue | null => {
  const issueIndex = issues.findIndex(issue => issue.id === issueId);
  
  if (issueIndex !== -1) {
    issues[issueIndex] = {
      ...issues[issueIndex],
      ...updatedFields,
      lastUpdated: new Date().toISOString()
    };
    
    return issues[issueIndex];
  }
  
  return null;
};

// Function to generate data for the tasks chart
export const generateTasksChartData = () => {
  // Generate data for the last 7 days
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'MMM dd');
    
    // Generate some random but realistic numbers
    const completed = Math.floor(Math.random() * 5) + 1;
    const assigned = Math.floor(Math.random() * 8) + 3;
    const delayed = Math.floor(Math.random() * 3);
    
    data.push({
      date: dateStr,
      completed,
      assigned,
      delayed
    });
  }
  
  return data;
};

// Function to add a new task
export const addNewTask = (taskData: Omit<Task, 'id'>): Task => {
  const newTask: Task = {
    ...taskData,
    id: `t${mockTasks.length + 1}`, // Generate a new unique ID
  };

  // Add to mockTasks array
  mockTasks.push(newTask);
  return newTask;
};

// Function to update a task
export const updateTask = (taskId: string, updatedFields: Partial<Omit<Task, 'id'>>): Task | null => {
  const taskIndex = mockTasks.findIndex(task => task.id === taskId);
  
  if (taskIndex !== -1) {
    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      ...updatedFields,
    };
    
    return mockTasks[taskIndex];
  }
  
  return null;
};

// Function to delete a task
export const deleteTask = (taskId: string): boolean => {
  const initialLength = mockTasks.length;
  const filteredTasks = mockTasks.filter(task => task.id !== taskId);
  
  if (filteredTasks.length < initialLength) {
    // Clear the original array and repopulate
    mockTasks.length = 0;
    mockTasks.push(...filteredTasks);
    return true;
  }
  
  return false;
};

// Function to generate efficiency data for analytics
export const generateEfficiencyData = () => {
  // Generate efficiency data for all engineers and technicians
  return users
    .filter(user => user.role === UserRole.ENGINEER || user.role === UserRole.TECHNICIAN)
    .map(user => {
      // Generate random values for demonstration
      const assignedTasks = Math.floor(Math.random() * 10) + 2;
      const completedTasks = Math.floor(Math.random() * assignedTasks);
      const resolvedIssues = Math.floor(Math.random() * 5);
      const efficiency = Math.floor((completedTasks / assignedTasks) * 100);
      
      return {
        id: user.id,
        name: user.name,
        role: user.role,
        assignedTasks,
        completedTasks,
        resolvedIssues,
        efficiency
      };
    });
};

// Function to get user working hours (used in Analytics page)
export const getUserWorkingHours = (userId: string) => {
  // This function should return working hours data for a specific user
  // Simulate some data for demonstration purposes
  return {
    totalHours: Math.floor(Math.random() * 40) + 20,
    averageDaily: Math.floor(Math.random() * 5) + 4
  };
};

// Mock metro projects data
export const metroProjects: Project[] = [
  {
    id: 'p1',
    name: 'Delhi Metro',
    location: 'Delhi NCR',
    description: 'The Delhi Metro is a mass rapid transit system serving Delhi and its satellite cities. It is the largest and busiest metro in India, and one of the largest in the world.',
    status: 'Operational',
    implementingAgency: 'Delhi Metro Rail Corporation (DMRC)',
    startDate: 'October 1998',
    completionDate: 'Ongoing expansions',
    cost: 70632,
    networkLength: 389.87,
    keyFeatures: [
      'First modern metro system in India',
      'Extensive network covering Delhi NCR with multiple color-coded lines',
      'Fully integrated with other transport systems',
      'Mix of underground, at-grade, and elevated stations',
      'Uses 25 kV AC traction on standard gauge tracks'
    ],
    website: 'https://www.delhimetrorail.com',
    stations: 285,
    dailyRidership: '6.5 million',
    lines: 12,
    trainSets: 336,
    completionPercentage: 95,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p2',
    name: 'Mumbai Metro',
    location: 'Mumbai, Maharashtra',
    description: 'The Mumbai Metro is a mass rapid transit system serving the city of Mumbai and the wider Metropolitan Region. The system is designed to reduce traffic congestion and supplement the overcrowded Mumbai Suburban Railway network.',
    status: 'Operational',
    implementingAgency: 'Mumbai Metro Rail Corporation (MMRC)',
    startDate: 'February 2008',
    completionDate: 'Ongoing expansions',
    cost: 40000,
    networkLength: 11.4,
    keyFeatures: [
      'Multiple lines under construction to create comprehensive network',
      'Line 1 (Versova-Andheri-Ghatkopar) was first operational line',
      'Line 3 will be Mumbai\'s first underground metro line',
      'Will connect previously unserved parts of the city',
      'Designed to reduce travel time across the city'
    ],
    website: 'https://www.mumbaimetrorail.com',
    stations: 12,
    dailyRidership: '450,000',
    lines: 1,
    trainSets: 16,
    completionPercentage: 15,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p3',
    name: 'Kolkata Metro',
    location: 'Kolkata, West Bengal',
    description: 'The Kolkata Metro is the first metro railway in India, operating since 1984. It is an essential part of the city\'s urban transportation infrastructure and continues to expand.',
    status: 'Operational',
    implementingAgency: 'Kolkata Metro Rail Corporation (KMRC)',
    startDate: 'June 1972',
    completionDate: 'Ongoing expansions',
    cost: 8900,
    networkLength: 33.02,
    keyFeatures: [
      'India\'s first metro system',
      'Line 2 (East-West) features underwater tunnel beneath Hooghly River',
      'Combination of underground and elevated sections',
      'Air-conditioned rakes with regenerative braking',
      'Both broad gauge and standard gauge lines'
    ],
    website: 'https://mtp.indianrailways.gov.in',
    stations: 29,
    dailyRidership: '700,000',
    lines: 2,
    trainSets: 27,
    completionPercentage: 40,
    trackType: 'Broad Gauge & Standard Gauge'
  },
  {
    id: 'p4',
    name: 'Chennai Metro',
    location: 'Chennai, Tamil Nadu',
    description: 'The Chennai Metro is a rapid transit system serving the city of Chennai, designed to provide seamless travel to commuters and reduce traffic congestion.',
    status: 'Operational',
    implementingAgency: 'Chennai Metro Rail Limited (CMRL)',
    startDate: 'June 2009',
    completionDate: 'Ongoing expansions',
    cost: 14600,
    networkLength: 54.05,
    keyFeatures: [
      'First metro in India to connect airport with direct service',
      'Uses both underground and elevated stations',
      'Features driverless train operations',
      'Intermodal integration with MRTS and suburban rail',
      'Four-car train sets with capacity of 2000 passengers'
    ],
    website: 'https://chennaimetrorail.org',
    stations: 41,
    dailyRidership: '226,000',
    lines: 2,
    trainSets: 32,
    completionPercentage: 65,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p5',
    name: 'Bangalore Metro (Namma Metro)',
    location: 'Bengaluru, Karnataka',
    description: 'The Bangalore Metro, also known as Namma Metro, is a rapid transit system serving the city of Bengaluru. It is the second longest operational metro network in India.',
    status: 'Operational',
    implementingAgency: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
    startDate: 'April 2007',
    completionDate: 'Ongoing expansions',
    cost: 16800,
    networkLength: 56,
    keyFeatures: [
      'First metro in South India',
      'Third-rail electric power supply',
      'Purple and Green lines form complete phase I',
      'Extensive phase II under construction',
      'Features six-car trains with capacity of 2000 passengers'
    ],
    website: 'https://www.bmrc.co.in',
    stations: 51,
    dailyRidership: '600,000',
    lines: 2,
    trainSets: 50,
    completionPercentage: 60,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p6',
    name: 'Hyderabad Metro',
    location: 'Hyderabad, Telangana',
    description: 'The Hyderabad Metro is a rapid transit system serving the city of Hyderabad. It is the second largest operational metro network in India after the Delhi Metro.',
    status: 'Operational',
    implementingAgency: 'Hyderabad Metro Rail Limited (HMRL)',
    startDate: 'May 2012',
    completionDate: 'November 2019',
    cost: 16375,
    networkLength: 69.2,
    keyFeatures: [
      'Developed under PPP model with L&T',
      'Elevated metro with advanced signaling system',
      'Transit-oriented development with integrated malls',
      'Uses CBTC signaling for driverless operations',
      'Features energy-efficient regenerative braking'
    ],
    website: 'https://hmrl.co.in',
    stations: 57,
    dailyRidership: '500,000',
    lines: 3,
    trainSets: 56,
    completionPercentage: 90,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p7',
    name: 'Ahmedabad Metro',
    location: 'Ahmedabad, Gujarat',
    description: 'The Ahmedabad Metro is a mass rapid transit system serving the city of Ahmedabad and Gandhinagar in Gujarat. The first phase was inaugurated in March 2019.',
    status: 'Operational',
    implementingAgency: 'Gujarat Metro Rail Corporation (GMRC)',
    startDate: 'March 2015',
    completionDate: 'Ongoing expansions',
    cost: 10773,
    networkLength: 40.03,
    keyFeatures: [
      'Connects Ahmedabad with Gandhinagar capital',
      'Integrated with BRTS and other transit systems',
      'Modern three-car trains with third rail power supply',
      'Phase II will connect newer areas of the city',
      'Energy-efficient system with solar power integration'
    ],
    website: 'https://www.gujaratmetrorail.com',
    stations: 32,
    dailyRidership: '150,000',
    lines: 2,
    trainSets: 20,
    completionPercentage: 70,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p8',
    name: 'Lucknow Metro',
    location: 'Lucknow, Uttar Pradesh',
    description: 'The Lucknow Metro is a rapid transit system serving the city of Lucknow, Uttar Pradesh. It was inaugurated in September 2017 and is one of the fastest completed metro projects in India.',
    status: 'Operational',
    implementingAgency: 'Uttar Pradesh Metro Rail Corporation (UPMRC)',
    startDate: 'September 2014',
    completionDate: 'March 2019',
    cost: 6928,
    networkLength: 22.87,
    keyFeatures: [
      'One of the fastest completed metro projects in India',
      'Features driverless train capability',
      'Integrated with other public transportation',
      'Uses advanced CBTC signaling system',
      'Energy-efficient with regenerative braking system'
    ],
    website: 'https://www.upmetrorail.com',
    stations: 21,
    dailyRidership: '80,000',
    lines: 1,
    trainSets: 20,
    completionPercentage: 100,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p9',
    name: 'Kochi Metro',
    location: 'Kochi, Kerala',
    description: 'The Kochi Metro is a rapid transit system serving the city of Kochi, Kerala. It was inaugurated in June 2017 and is notable for its environmentally friendly initiatives.',
    status: 'Operational',
    implementingAgency: 'Kochi Metro Rail Limited (KMRL)',
    startDate: 'June 2013',
    completionDate: 'Ongoing expansions',
    cost: 5181,
    networkLength: 25.2,
    keyFeatures: [
      'First metro system to integrate with water transport (Water Metro)',
      'First metro agency to employ transgender persons',
      'Extensive vertical gardens on pillars',
      'Solar panels at stations for energy generation',
      'Extensive use of communication-based train control'
    ],
    website: 'https://kochimetro.org',
    stations: 22,
    dailyRidership: '65,000',
    lines: 1,
    trainSets: 22,
    completionPercentage: 85,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p10',
    name: 'Jaipur Metro',
    location: 'Jaipur, Rajasthan',
    description: 'The Jaipur Metro is a rapid transit system serving the city of Jaipur, Rajasthan. The first line was inaugurated in June 2015.',
    status: 'Operational',
    implementingAgency: 'Jaipur Metro Rail Corporation (JMRC)',
    startDate: 'November 2010',
    completionDate: 'June 2015',
    cost: 3149,
    networkLength: 9.63,
    keyFeatures: [
      'One of the fastest built metro systems in India',
      'Architecture reflects Jaipur\'s cultural heritage',
      'Elevators and escalators at all stations',
      'Platform screen doors at underground stations',
      'Integration with other public transportation'
    ],
    website: 'https://jaipurmetrorail.in',
    stations: 9,
    dailyRidership: '30,000',
    lines: 1,
    trainSets: 10,
    completionPercentage: 100,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p11',
    name: 'Noida-Greater Noida Metro',
    location: 'Noida, Uttar Pradesh',
    description: 'The Noida-Greater Noida Metro, also known as the Aqua Line, is a rapid transit system connecting the cities of Noida and Greater Noida in Uttar Pradesh. It was inaugurated in January 2019.',
    status: 'Operational',
    implementingAgency: 'Noida Metro Rail Corporation (NMRC)',
    startDate: 'May 2014',
    completionDate: 'January 2019',
    cost: 5503,
    networkLength: 29.7,
    keyFeatures: [
      'Modern four-car trains with capacity of 1,000 passengers',
      'Features platform screen doors at all stations',
      'Dedicated women\'s compartment',
      'WiFi and mobile charging facilities',
      'Integration with Delhi Metro in future expansions'
    ],
    website: 'https://www.nmrcnoida.com',
    stations: 21,
    dailyRidership: '25,000',
    lines: 1,
    trainSets: 19,
    completionPercentage: 100,
    trackType: 'Standard Gauge'
  },
  {
    id: 'p12',
    name: 'Nagpur Metro',
    location: 'Nagpur, Maharashtra',
    description: 'The Nagpur Metro is a rapid transit system serving the city of Nagpur, Maharashtra. The first phase was inaugurated in March 2019.',
    status: 'Operational',
    implementingAgency: 'Maharashtra Metro Rail Corporation (MahaMetro)',
    startDate: 'August 2014',
    completionDate: 'Ongoing expansions',
    cost: 8680,
    networkLength: 24.5,
    keyFeatures: [
      'First metro to use 5 dimensional BIM in India',
      'Extensive use of solar power at stations',
      'Uses third-rail electric power supply',
      'Digital ticketing and smart card system',
      'Metro stations with theme-based designs'
    ],
    website: 'https://www.mahametro.org',
    stations: 24,
    dailyRidership: '60,000',
    lines: 2,
    trainSets: 23,
    completionPercentage: 80,
    trackType: 'Standard Gauge'
  }
];

// Sample project updates (news, progress reports, etc.)
export const projectUpdatesList: ProjectUpdate[] = [
  {
    id: 'pu1',
    projectId: 'p1',
    title: 'Delhi Metro completes tunneling work for Phase IV\'s Magenta Line extension',
    date: '2025-03-15',
    content: 'The Delhi Metro Rail Corporation (DMRC) has successfully completed the tunneling work for the Magenta Line extension under Phase IV. This 12.55 km extension will connect Janakpuri West to RK Ashram and is expected to be operational by late 2025.',
    source: 'Delhi Metro Rail Corporation'
  },
  {
    id: 'pu2',
    projectId: 'p1',
    title: 'New metro trains with upgraded features arrive for Delhi Metro',
    date: '2025-02-20',
    content: 'A new fleet of advanced metro trains has arrived for the Delhi Metro. These trains feature improved energy efficiency, enhanced passenger information systems, and increased capacity. The first set of these trains will be deployed on the Blue Line by April 2025.',
    source: 'Transport Daily'
  },
  {
    id: 'pu3',
    projectId: 'p2',
    title: 'Mumbai Metro Line 3 underground section nears completion',
    date: '2025-03-05',
    content: 'The Mumbai Metro Rail Corporation has announced that the tunneling work for the underground Line 3 is now 95% complete. This 33.5 km line connecting Colaba-Bandra-SEEPZ is expected to be partially operational by the end of 2025.',
    source: 'Mumbai Metro Rail Corporation'
  },
  {
    id: 'pu4',
    projectId: 'p2',
    title: 'Mumbai Metro introduces new ticketing system with QR code-based entry',
    date: '2025-01-10',
    content: 'The Mumbai Metro has launched a new digital ticketing system that allows passengers to enter stations using QR codes generated through a mobile app. This contactless system aims to reduce queues and improve efficiency at entry points.',
    source: 'Tech Transit News'
  },
  {
    id: 'pu5',
    projectId: 'p3',
    title: 'Kolkata Metro extends operating hours to serve night shift workers',
    date: '2025-02-15',
    content: 'The Kolkata Metro has extended its operating hours until midnight on weekdays to accommodate night shift workers in the IT and service sectors. This change comes after multiple requests from industry associations in the city.',
    source: 'Eastern Transit Authority'
  },
  {
    id: 'pu6',
    projectId: 'p3',
    title: 'East-West corridor of Kolkata Metro faces technical challenges',
    date: '2025-01-25',
    content: 'The East-West corridor of Kolkata Metro, which features the underwater tunnel beneath the Hooghly River, is facing technical challenges related to water seepage. Officials have reassured that these issues are being addressed with advanced engineering solutions.',
    source: 'Infrastructure Report'
  },
  {
    id: 'pu7',
    projectId: 'p4',
    title: 'Chennai Metro Phase II construction begins on three corridors simultaneously',
    date: '2025-03-12',
    content: 'Construction has begun simultaneously on three corridors of Chennai Metro\'s ambitious Phase II project. This 118.9 km expansion with 128 stations will connect previously unserved parts of the city and is expected to be completed by 2030.',
    source: 'Chennai Metro Rail Limited'
  },
  {
    id: 'pu8',
    projectId: 'p4',
    title: 'Chennai Metro achieves record daily ridership of 300,000 passengers',
    date: '2025-02-05',
    content: 'The Chennai Metro has achieved a record daily ridership of 300,000 passengers, marking a significant increase from its pre-pandemic numbers. Officials attribute this growth to improved last-mile connectivity and integration with bus services.',
    source: 'Urban Mobility Report'
  },
  {
    id: 'pu9',
    projectId: 'p5',
    title: 'Bangalore Metro\'s Purple Line extended to Whitefield',
    date: '2025-01-15',
    content: 'The Bangalore Metro has successfully extended its Purple Line to Whitefield, a major IT hub in the city. This 15.5 km extension with 12 stations is expected to significantly reduce travel time for thousands of IT professionals.',
    source: 'Bangalore Metro Rail Corporation'
  },
  {
    id: 'pu10',
    projectId: 'p5',
    title: 'Bangalore Metro plans to implement AI-based crowd management system',
    date: '2025-03-20',
    content: 'The Bangalore Metro Rail Corporation has announced plans to implement an AI-based crowd management system to optimize train frequency based on real-time passenger density. This system will use camera feeds and sensors to adjust services during peak hours.',
    source: 'Tech Transportation Weekly'
  }
];

// Functions to access project data
export const getProjects = (): Project[] => {
  return metroProjects;
};

export const getProjectById = (projectId: string): Project | undefined => {
  return metroProjects.find(project => project.id === projectId);
};

export const getProjectUpdates = (projectId?: string): ProjectUpdate[] => {
  if (!projectId) return projectUpdatesList;
  return projectUpdatesList.filter(update => update.projectId === projectId);
};
