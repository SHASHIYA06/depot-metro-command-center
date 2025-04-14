import { User, UserRole, Train, Car, Issue, Task, ActivityLog, MaintenanceSchedule, WorkCategory, DailyWorkLog, AttendanceRecord } from '@/types';
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
  // Generate data for the last 7 days
  const data = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'MMM dd');
    
    // Generate some random but realistic numbers
    const efficiency = Math.floor(Math.random() * 30) + 70; // 70-100%
    const target = 90;
    
    data.push({
      date: dateStr,
      efficiency,
      target
    });
  }
  
  return data;
};

// Function to get working hours for users
export const getUserWorkingHours = () => {
  // Generate data for each user role
  return [
    { name: 'Engineers', value: 42.5 },
    { name: 'Technicians', value: 45.8 },
    { name: 'Support Staff', value: 40.2 },
    { name: 'Management', value: 38.5 }
  ];
};
