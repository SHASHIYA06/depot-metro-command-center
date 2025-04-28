
export interface NCRReport {
  id: string;
  ncrReportNo: string;
  dateOfNcr: string;
  dateOfDetection: string;
  itemDescription: string;
  ncrDescription: string;
  partNumber: string;
  modifiedUnmodified: 'Modified' | 'Unmodified';
  fmi?: string; // Fault Mode Identifier
  faultySerialNo: string;
  healthySerialNo?: string;
  issuedBy: string;
  quantity: number;
  subSystem: string;
  trainNo: string;
  carNo: string;
  responsibility: 'Vendor' | 'BEML' | 'Others';
  status: 'Open' | 'Closed' | 'Investigation';
  itemRepairedReplaced?: string;
  itemReplacedDetails?: string;
  dateOfRepairedReplaced?: string;
  source: 'Internal' | 'External';
  dateOfInvestigationReceived?: string;
  ncrClosedByDocument: boolean;
  dateOfNcrClosure?: string;
  gatePassNumber?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  attachments?: string[];
}

export const NCR_STATUS_OPTIONS = [
  { value: 'Open', label: 'Open' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Investigation', label: 'Under Investigation' }
];

export const RESPONSIBILITY_OPTIONS = [
  { value: 'Vendor', label: 'Vendor' },
  { value: 'BEML', label: 'BEML' },
  { value: 'Others', label: 'Others' }
];

export const SOURCE_OPTIONS = [
  { value: 'Internal', label: 'Internal' },
  { value: 'External', label: 'External' }
];

export const MODIFIED_OPTIONS = [
  { value: 'Modified', label: 'Modified' },
  { value: 'Unmodified', label: 'Unmodified' }
];
