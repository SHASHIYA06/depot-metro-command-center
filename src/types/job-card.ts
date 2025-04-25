
export interface JobCard {
  id: string;
  jcNo: string;
  issuedTo: string;
  failureOccurredDate: string;
  failureOccurredTime: string;
  depotArrivingDate: string;
  depotArrivingTime: string;
  jobCardIssuedTime: string;
  jobCardIssuedDate: string;
  expectedCompleteDate: string;
  expectedCompleteTime: string;
  reportingLocation: string;
  maintenanceType: 'CM' | 'PM' | 'OPM';
  odometerReading: number;
  trainNo: string;
  carNo: string;
  failureDescription: string;
  workPending: boolean;
  canBeEnergized?: boolean;
  canBeMoved?: boolean;
  withdraw: boolean;
  delay: boolean;
  delayTime?: string;
  reportedBy: string;
  inspector: string;
  jobOperatingConditions?: 'Normal' | 'Abnormal' | 'Emergency';
  effectsOnTrainService: boolean;
  serviceDistinction?: 'No effect Service' | 'Changeover' | 'Push Out' | 'Fail to Dispath' | 'Deboarding' | 'Delay';
  delayDuration?: 'Less than 1 Minute' | '1 Minute' | '2 Minutes' | '3 Minutes' | '4 Minutes' | '5 Minutes' | 'More than 5 Minutes';
  serviceChecks?: 'A Service Check' | 'B1 Service Check' | 'B4 Service Check' | 'B8 Service Check' | 'C1 Service Check' | 'C2 Service Check' | 'C5 Service Check';
  system: string;
  subSystem: string;
  equipment: string;
  component: string;
  parts: string;
  ncrNo?: string;
  serialNo?: string;
  failureLocation?: string;
  failureName: string;
  failureDetails: string;
  workflowState: string;
  actionsTaken: string;
  replaceChange: boolean;
  componentsTakenOutDate?: string;
  componentsTakenOutSerialNo?: string;
  componentsTakenInDate?: string;
  componentsTakenInSerialNo?: string;
  carLiftingRequired: boolean;
  noOfMen?: number;
  durationOfRepair?: number;
  rootCause: string;
  jobCardCloseDate?: string;
  jobCardCloseTime?: string;
  nameOfActionEndorsement?: string;
  dateOfActionEndorsement?: string;
  failureCategory?: 'System Design' | 'Software Error' | 'Equipment/component failure--Itself' | 
    'Equipment/component failure--NFF' | 'Poor Workmanship' | 'Loose Wire and Connector' | 
    'NFF(MCB tripped)' | 'NFF(System hang-up)' | 'NFF(Others)' | 
    'Incorrect Operation & Main\'t of equip' | 'Failure due to external factor' | 
    'Others(Service Check & Unschduled Maintenance)';
  fracasId?: string; // Auto-generated unique FRACAS identifier
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
}

export interface SystemOption {
  id: string;
  name: string;
  subSystems: SubSystemOption[];
}

export interface SubSystemOption {
  id: string;
  name: string;
  equipments: EquipmentOption[];
}

export interface EquipmentOption {
  id: string;
  name: string;
  components: ComponentOption[];
}

export interface ComponentOption {
  id: string;
  name: string;
  parts: PartOption[];
}

export interface PartOption {
  id: string;
  name: string;
}

// Mock data for the dropdowns
export const SYSTEM_OPTIONS: SystemOption[] = [
  {
    id: "1",
    name: "Propulsion",
    subSystems: [
      {
        id: "1-1",
        name: "Traction Control Unit",
        equipments: [
          {
            id: "1-1-1",
            name: "Inverter",
            components: [
              {
                id: "1-1-1-1",
                name: "TRC Card",
                parts: [
                  { id: "1-1-1-1-1", name: "Processor" },
                  { id: "1-1-1-1-2", name: "Memory" }
                ]
              },
              {
                id: "1-1-1-2",
                name: "Power Module",
                parts: [
                  { id: "1-1-1-2-1", name: "IGBT" },
                  { id: "1-1-1-2-2", name: "Heat Sink" }
                ]
              }
            ]
          },
          {
            id: "1-1-2",
            name: "Traction Motor",
            components: [
              {
                id: "1-1-2-1",
                name: "Rotor",
                parts: [
                  { id: "1-1-2-1-1", name: "Shaft" },
                  { id: "1-1-2-1-2", name: "Winding" }
                ]
              },
              {
                id: "1-1-2-2",
                name: "Stator",
                parts: [
                  { id: "1-1-2-2-1", name: "Core" },
                  { id: "1-1-2-2-2", name: "Winding" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "1-2",
        name: "Pantograph",
        equipments: [
          {
            id: "1-2-1",
            name: "Pantograph Assembly",
            components: [
              {
                id: "1-2-1-1",
                name: "Contact Strip",
                parts: [
                  { id: "1-2-1-1-1", name: "Carbon Insert" }
                ]
              },
              {
                id: "1-2-1-2",
                name: "Raising Mechanism",
                parts: [
                  { id: "1-2-1-2-1", name: "Spring" },
                  { id: "1-2-1-2-2", name: "Actuator" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Door System",
    subSystems: [
      {
        id: "2-1",
        name: "Door Control System",
        equipments: [
          {
            id: "2-1-1",
            name: "Door Controller",
            components: [
              {
                id: "2-1-1-1",
                name: "Control PCB",
                parts: [
                  { id: "2-1-1-1-1", name: "Microcontroller" },
                  { id: "2-1-1-1-2", name: "Relay" }
                ]
              }
            ]
          },
          {
            id: "2-1-2",
            name: "Door Motor",
            components: [
              {
                id: "2-1-2-1",
                name: "Motor Assembly",
                parts: [
                  { id: "2-1-2-1-1", name: "Brushes" },
                  { id: "2-1-2-1-2", name: "Commutator" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "HVAC",
    subSystems: [
      {
        id: "3-1",
        name: "Cooling System",
        equipments: [
          {
            id: "3-1-1",
            name: "Compressor",
            components: [
              {
                id: "3-1-1-1",
                name: "Motor",
                parts: [
                  { id: "3-1-1-1-1", name: "Winding" },
                  { id: "3-1-1-1-2", name: "Bearings" }
                ]
              }
            ]
          },
          {
            id: "3-1-2",
            name: "Condenser",
            components: [
              {
                id: "3-1-2-1",
                name: "Coil",
                parts: [
                  { id: "3-1-2-1-1", name: "Copper Tubes" },
                  { id: "3-1-2-1-2", name: "Fins" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "TCMS",
    subSystems: [
      {
        id: "4-1",
        name: "Central Control Unit",
        equipments: [
          {
            id: "4-1-1",
            name: "CPU Module",
            components: [
              {
                id: "4-1-1-1",
                name: "Processor Board",
                parts: [
                  { id: "4-1-1-1-1", name: "CPU" },
                  { id: "4-1-1-1-2", name: "Memory" }
                ]
              }
            ]
          },
          {
            id: "4-1-2",
            name: "Communication Module",
            components: [
              {
                id: "4-1-2-1",
                name: "Network Interface",
                parts: [
                  { id: "4-1-2-1-1", name: "Ethernet Controller" },
                  { id: "4-1-2-1-2", name: "MVB Interface" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const TRAIN_NUMBERS = Array.from({ length: 25 }, (_, i) => `TS${String(i + 1).padStart(2, '0')}`);

export const CAR_NUMBERS = ["DMC1", "TC1", "MC1", "MC2", "TC2", "DMC2"];

export const LOCATIONS = [
  "Charkop Depot",
  "Mandala Depot",
  "Line 1",
  "Line 2",
  "Workshop Area",
  "Testing Facility"
];

export const STAFF_MEMBERS = [
  { id: "1", name: "Rajesh Kumar", role: "Engineer" },
  { id: "2", name: "Sunil Patil", role: "Technician" },
  { id: "3", name: "Deepak Sharma", role: "Inspector" },
  { id: "4", name: "Priyanka Singh", role: "Engineer" },
  { id: "5", name: "Amit Desai", role: "Senior Technician" },
  { id: "6", name: "Vikram Joshi", role: "Depot Incharge" },
  { id: "7", name: "Sanjay Mehta", role: "Inspector" },
  { id: "8", name: "Neha Gupta", role: "Technician" }
];
