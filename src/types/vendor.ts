
export interface Vendor {
  id: string;
  vendorName: string;
  vendorCode: string;
  address: string;
  contactPerson: string;
  contactNumber: string;
  emailAddress: string;
  gstNumber: string;
  relatedSystemsSubsystems: string[];
  contractStatus: 'Active' | 'Inactive';
  specializationArea?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const CONTRACT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
];
