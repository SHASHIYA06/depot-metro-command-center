
export interface Letter {
  id: string;
  letterType: 'Incoming' | 'Outgoing';
  letterNumber: string;
  date: string;
  subject: string;
  issuedByOrReceivedFrom: string;
  attachments: string[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export const LETTER_TYPE_OPTIONS = [
  { value: 'Incoming', label: 'Incoming (Received)' },
  { value: 'Outgoing', label: 'Outgoing (Sent)' }
];
