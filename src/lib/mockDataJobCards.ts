
import { JobCard } from '@/types/job-card';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays, addHours, subDays } from 'date-fns';

// Generate a random job card number
const generateJobCardNo = (): string => {
  const prefix = 'JC';
  const date = format(new Date(), 'yyMMdd');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${date}-${random}`;
};

// Generate a FRACAS ID based on the current date and time
const generateFracasId = (): string => {
  const prefix = 'FRACAS';
  const date = format(new Date(), 'yyMMddHHmm');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}-${date}-${random}`;
};

// Generate mock job cards
export const generateMockJobCards = (count: number): JobCard[] => {
  const jobCards: JobCard[] = [];
  
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const failureOccurredDate = format(subDays(today, Math.floor(Math.random() * 30)), 'yyyy-MM-dd');
    const failureOccurredTime = format(new Date(), 'HH:mm');
    const depotArrivingDate = failureOccurredDate;
    const depotArrivingTime = format(addHours(new Date(failureOccurredDate + 'T' + failureOccurredTime), 1), 'HH:mm');
    
    const jobCardIssuedDate = depotArrivingDate;
    const jobCardIssuedTime = format(addHours(new Date(depotArrivingDate + 'T' + depotArrivingTime), 1), 'HH:mm');
    
    const expectedCompleteDate = format(addDays(new Date(jobCardIssuedDate), Math.floor(Math.random() * 5) + 1), 'yyyy-MM-dd');
    const expectedCompleteTime = format(new Date(), 'HH:mm');
    
    const workPending = Math.random() > 0.5;
    const canBeEnergized = workPending ? Math.random() > 0.3 : undefined;
    const canBeMoved = workPending ? Math.random() > 0.3 : undefined;
    
    const withdraw = Math.random() > 0.7;
    const delay = Math.random() > 0.6;
    const delayTime = delay ? `${Math.floor(Math.random() * 24)}/${Math.floor(Math.random() * 60)}/${Math.floor(Math.random() * 60)}` : undefined;
    
    const maintenanceType = ['CM', 'PM', 'OPM'][Math.floor(Math.random() * 3)] as 'CM' | 'PM' | 'OPM';
    
    const jobOperatingConditions = maintenanceType === 'CM' ? 
      ['Normal', 'Abnormal', 'Emergency'][Math.floor(Math.random() * 3)] as 'Normal' | 'Abnormal' | 'Emergency' : 
      undefined;
    
    const effectsOnTrainService = Math.random() > 0.5;
    
    const serviceDistinction = maintenanceType === 'CM' && effectsOnTrainService ? 
      ['No effect Service', 'Changeover', 'Push Out', 'Fail to Dispath', 'Deboarding', 'Delay'][Math.floor(Math.random() * 6)] as 
        'No effect Service' | 'Changeover' | 'Push Out' | 'Fail to Dispath' | 'Deboarding' | 'Delay' : 
      undefined;
    
    const delayDuration = maintenanceType === 'CM' && serviceDistinction === 'Delay' ?
      ['Less than 1 Minute', '1 Minute', '2 Minutes', '3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'][Math.floor(Math.random() * 7)] as
        'Less than 1 Minute' | '1 Minute' | '2 Minutes' | '3 Minutes' | '4 Minutes' | '5 Minutes' | 'More than 5 Minutes' :
      undefined;
    
    const serviceChecks = maintenanceType === 'PM' ?
      ['A Service Check', 'B1 Service Check', 'B4 Service Check', 'B8 Service Check', 'C1 Service Check', 'C2 Service Check', 'C5 Service Check'][Math.floor(Math.random() * 7)] as
        'A Service Check' | 'B1 Service Check' | 'B4 Service Check' | 'B8 Service Check' | 'C1 Service Check' | 'C2 Service Check' | 'C5 Service Check' :
      undefined;
    
    const status = ['open', 'in_progress', 'completed', 'closed'][Math.floor(Math.random() * 4)] as 'open' | 'in_progress' | 'completed' | 'closed';
    
    const replaceChange = Math.random() > 0.6;
    
    const componentsTakenOutDate = replaceChange ? format(new Date(jobCardIssuedDate), 'yyyy-MM-dd') : undefined;
    const componentsTakenOutSerialNo = replaceChange ? `SN-${Math.floor(Math.random() * 10000)}` : undefined;
    const componentsTakenInDate = replaceChange ? format(addDays(new Date(componentsTakenOutDate || ''), Math.floor(Math.random() * 3) + 1), 'yyyy-MM-dd') : undefined;
    const componentsTakenInSerialNo = replaceChange ? `SN-${Math.floor(Math.random() * 10000)}` : undefined;
    
    const jobCardCloseDate = status === 'closed' ? format(addDays(new Date(jobCardIssuedDate), Math.floor(Math.random() * 10) + 1), 'yyyy-MM-dd') : undefined;
    const jobCardCloseTime = status === 'closed' ? format(new Date(), 'HH:mm') : undefined;
    
    const failureCategory = [
      'System Design', 'Software Error', 'Equipment/component failure--Itself',
      'Equipment/component failure--NFF', 'Poor Workmanship', 'Loose Wire and Connector',
      'NFF(MCB tripped)', 'NFF(System hang-up)', 'NFF(Others)',
      'Incorrect Operation & Main\'t of equip', 'Failure due to external factor',
      'Others(Service Check & Unschduled Maintenance)'
    ][Math.floor(Math.random() * 12)] as JobCard['failureCategory'];
    
    jobCards.push({
      id: uuidv4(),
      jcNo: generateJobCardNo(),
      issuedTo: ['Rajesh Kumar', 'Sunil Patil', 'Deepak Sharma', 'Priyanka Singh', 'Amit Desai'][Math.floor(Math.random() * 5)],
      failureOccurredDate,
      failureOccurredTime,
      depotArrivingDate,
      depotArrivingTime,
      jobCardIssuedDate,
      jobCardIssuedTime,
      expectedCompleteDate,
      expectedCompleteTime,
      reportingLocation: ['Charkop Depot', 'Mandala Depot', 'Line 1', 'Line 2'][Math.floor(Math.random() * 4)],
      maintenanceType,
      odometerReading: Math.floor(Math.random() * 50000) + 10000,
      trainNo: `TS${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`,
      carNo: ['DMC1', 'TC1', 'MC1', 'MC2', 'TC2', 'DMC2'][Math.floor(Math.random() * 6)],
      failureDescription: [
        'Pantograph not raising',
        'Door not closing properly',
        'HVAC failure in Car 3',
        'Braking system issue',
        'Traction motor overheating',
        'TCMS fault code F123',
        'Auxiliary converter tripping',
        'PIS system not working',
        'Battery charger failure'
      ][Math.floor(Math.random() * 9)],
      workPending,
      canBeEnergized,
      canBeMoved,
      withdraw,
      delay,
      delayTime,
      reportedBy: ['Vikram Joshi', 'Sanjay Mehta', 'Neha Gupta'][Math.floor(Math.random() * 3)],
      inspector: ['Deepak Sharma', 'Sanjay Mehta'][Math.floor(Math.random() * 2)],
      jobOperatingConditions,
      effectsOnTrainService,
      serviceDistinction,
      delayDuration,
      serviceChecks,
      system: ['Propulsion', 'Door System', 'HVAC', 'TCMS'][Math.floor(Math.random() * 4)],
      subSystem: ['Traction Control Unit', 'Door Control System', 'Cooling System', 'Central Control Unit'][Math.floor(Math.random() * 4)],
      equipment: ['Inverter', 'Door Controller', 'Compressor', 'CPU Module'][Math.floor(Math.random() * 4)],
      component: ['TRC Card', 'Control PCB', 'Motor', 'Processor Board'][Math.floor(Math.random() * 4)],
      parts: ['Processor', 'Microcontroller', 'Winding', 'CPU'][Math.floor(Math.random() * 4)],
      ncrNo: `NCR-${Math.floor(Math.random() * 10000)}`,
      serialNo: `S${Math.floor(Math.random() * 100000)}`,
      failureLocation: ['RH1', 'RH2', 'LH1', 'LH2', '1st', '2nd', '3rd', '4th'][Math.floor(Math.random() * 8)],
      failureName: [
        'Power Supply Failure',
        'Sensor Error',
        'Communication Loss',
        'Software Hang',
        'Mechanical Jam',
        'Circuit Breaker Trip',
        'Overheating',
        'Signal Loss'
      ][Math.floor(Math.random() * 8)],
      failureDetails: [
        'Component failed during normal operation',
        'Intermittent fault detected during testing',
        'Complete failure after power cycle',
        'Degraded performance observed',
        'Error codes displayed on HMI'
      ][Math.floor(Math.random() * 5)],
      workflowState: ['Investigation', 'Repair', 'Testing', 'Verification', 'Closed'][Math.floor(Math.random() * 5)],
      actionsTaken: [
        'Replaced faulty component',
        'Cleaned and restored connections',
        'Updated software version',
        'Adjusted mechanical settings',
        'Performed system reset',
        'Lubricated moving parts',
        'Tightened loose connections'
      ][Math.floor(Math.random() * 7)],
      replaceChange,
      componentsTakenOutDate,
      componentsTakenOutSerialNo,
      componentsTakenInDate,
      componentsTakenInSerialNo,
      carLiftingRequired: Math.random() > 0.7,
      noOfMen: Math.floor(Math.random() * 5) + 1,
      durationOfRepair: Math.floor(Math.random() * 24) + 1,
      rootCause: [
        'Manufacturing defect',
        'Design limitation',
        'Wear and tear',
        'Environmental factors',
        'Improper maintenance',
        'Overloading',
        'Foreign object damage',
        'Software bug'
      ][Math.floor(Math.random() * 8)],
      jobCardCloseDate,
      jobCardCloseTime,
      nameOfActionEndorsement: status === 'closed' ? ['Vikram Joshi', 'Rajesh Kumar', 'Sanjay Mehta'][Math.floor(Math.random() * 3)] : undefined,
      dateOfActionEndorsement: status === 'closed' ? jobCardCloseDate : undefined,
      failureCategory,
      fracasId: generateFracasId(),
      createdAt: format(new Date(jobCardIssuedDate + 'T' + jobCardIssuedTime), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      updatedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
      status
    });
  }
  
  return jobCards;
};

// Generate 25 mock job cards
export const mockJobCards = generateMockJobCards(25);

// Helper function to get job cards
export const getJobCards = () => mockJobCards;

// Helper function to get job card by ID
export const getJobCardById = (id: string) => {
  return mockJobCards.find(card => card.id === id);
};

// Helper function to calculate MTTR (Mean Time To Repair)
export const calculateMTTR = (jobCards: JobCard[]): number => {
  const relevantCards = jobCards.filter(card => 
    // We only count completed/closed cards for MTTR calculation
    (card.status === 'completed' || card.status === 'closed') && 
    // Get cards with actual repair time info
    card.durationOfRepair !== undefined
  );
  
  if (relevantCards.length === 0) return 0;
  
  const totalRepairHours = relevantCards.reduce((sum, card) => 
    sum + (card.durationOfRepair || 0), 0);
  
  return totalRepairHours / relevantCards.length;
};

// Helper function to calculate MDBF (Mean Distance Between Failures)
export const calculateMDBF = (totalKilometers: number, serviceFailures: number): number => {
  if (serviceFailures === 0) return 0; // Avoid division by zero
  return totalKilometers / serviceFailures;
};

// Helper function to count service failures
export const countServiceFailures = (jobCards: JobCard[]): number => {
  return jobCards.filter(card => 
    // Service failures include pre-departure withdrawal, withdrawal after departure, or delays >= 3 minutes
    card.withdraw || (card.delay && card.delayDuration && 
      ['3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'].includes(card.delayDuration))
  ).length;
};

// Helper function to get Job Card statistics
export const getJobCardStatistics = (jobCards: JobCard[]) => {
  const totalCards = jobCards.length;
  const openCards = jobCards.filter(card => card.status === 'open').length;
  const inProgressCards = jobCards.filter(card => card.status === 'in_progress').length;
  const completedCards = jobCards.filter(card => card.status === 'completed').length;
  const closedCards = jobCards.filter(card => card.status === 'closed').length;
  
  const cmCards = jobCards.filter(card => card.maintenanceType === 'CM').length;
  const pmCards = jobCards.filter(card => card.maintenanceType === 'PM').length;
  const opmCards = jobCards.filter(card => card.maintenanceType === 'OPM').length;
  
  const withWithdraw = jobCards.filter(card => card.withdraw).length;
  const withDelay = jobCards.filter(card => card.delay).length;
  
  // Assuming an average of 5000 km per train per month for MDBF calculation
  const totalKilometers = 5000 * 25; // 25 trains
  const serviceFailures = countServiceFailures(jobCards);
  const mdbf = calculateMDBF(totalKilometers, serviceFailures);
  
  const mttr = calculateMTTR(jobCards);
  
  return {
    totalCards,
    openCards,
    inProgressCards,
    completedCards,
    closedCards,
    cmCards,
    pmCards,
    opmCards,
    withWithdraw,
    withDelay,
    serviceFailures,
    mdbf,
    mttr,
    totalKilometers
  };
};

// Get system-wise failure statistics
export const getSystemFailureStats = (jobCards: JobCard[]) => {
  const systems = [...new Set(jobCards.map(card => card.system))];
  
  return systems.map(system => {
    const systemCards = jobCards.filter(card => card.system === system);
    const count = systemCards.length;
    const serviceFailures = countServiceFailures(systemCards);
    
    return {
      system,
      count,
      serviceFailures
    };
  });
};

// Get failure category statistics
export const getFailureCategoryStats = (jobCards: JobCard[]) => {
  const categories = [...new Set(jobCards.map(card => card.failureCategory).filter(Boolean))];
  
  return categories.map(category => {
    const count = jobCards.filter(card => card.failureCategory === category).length;
    
    return {
      category,
      count
    };
  });
};
