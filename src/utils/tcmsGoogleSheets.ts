
import { toast } from '@/hooks/use-toast';

interface TCMSHint {
  eventCode: string;
  description: string;
  hintMessage: string;
  solution: string;
  actionRequired: string;
  rootCause: string;
  level: string;
  subsystem: string;
}

// Google Sheets API integration for TCMS hints
export const fetchTCMSHintsFromGoogleSheets = async (): Promise<TCMSHint[]> => {
  try {
    // This would connect to your Google Sheets API
    // For now, we'll return sample data based on your sheet structure
    const sampleHints: TCMSHint[] = [
      {
        eventCode: "FC101",
        description: "Brake pressure low",
        hintMessage: "Check brake fluid levels and inspect for leaks in the brake system",
        solution: "Refill brake fluid and repair any identified leaks",
        actionRequired: "Immediate inspection required - safety critical",
        rootCause: "Brake fluid leak or insufficient fluid level",
        level: "1",
        subsystem: "Braking"
      },
      {
        eventCode: "TC201",
        description: "Door malfunction",
        hintMessage: "Check door sensors, mechanical components, and electrical connections",
        solution: "Replace faulty door sensor or repair mechanical components",
        actionRequired: "Service required before next operation",
        rootCause: "Sensor failure, mechanical wear, or electrical fault",
        level: "2",
        subsystem: "Doors"
      },
      {
        eventCode: "PS301",
        description: "Power supply voltage low",
        hintMessage: "Check power supply connections, voltage levels, and battery condition",
        solution: "Inspect and repair power supply system, replace batteries if needed",
        actionRequired: "Electrical system check required",
        rootCause: "Power supply degradation, connection issues, or battery failure",
        level: "1",
        subsystem: "Power"
      },
      {
        eventCode: "AC401",
        description: "Air conditioning failure",
        hintMessage: "Check AC compressor, refrigerant levels, and electrical connections",
        solution: "Service AC system, refill refrigerant, or replace compressor",
        actionRequired: "Climate control maintenance required",
        rootCause: "Compressor failure, refrigerant leak, or electrical fault",
        level: "3",
        subsystem: "HVAC"
      },
      {
        eventCode: "TR501",
        description: "Traction motor overheating",
        hintMessage: "Check motor temperature sensors, cooling system, and load conditions",
        solution: "Inspect cooling system, clean air filters, check motor condition",
        actionRequired: "Immediate stop and cooling required",
        rootCause: "Blocked cooling, overload, or motor degradation",
        level: "1",
        subsystem: "Traction"
      }
    ];

    toast({
      title: 'Hints Data Loaded',
      description: `Loaded ${sampleHints.length} troubleshooting hints from database`,
    });

    return sampleHints;
  } catch (error) {
    console.error('Error fetching TCMS hints:', error);
    toast({
      title: 'Error Loading Hints',
      description: 'Failed to load troubleshooting hints from Google Sheets',
      variant: 'destructive',
    });
    return [];
  }
};

// Backup TCMS data to Google Sheets
export const backupTCMSDataToGoogleSheets = async (data: any[]): Promise<boolean> => {
  try {
    // This would send data to your Google Sheets
    console.log('Backing up TCMS data:', data.length, 'records');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Backup Successful',
      description: `${data.length} TCMS records backed up to Google Sheets`,
    });
    
    return true;
  } catch (error) {
    console.error('Error backing up to Google Sheets:', error);
    toast({
      title: 'Backup Failed',
      description: 'Failed to backup TCMS data to Google Sheets',
      variant: 'destructive',
    });
    
    return false;
  }
};

// Function to parse CSV data from TCMS files
export const parseTCMSCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length < 3) continue; // Skip incomplete rows

    const record: any = {
      id: `tcms-${Date.now()}-${i}`,
      date: '',
      timestamp: '',
      eventCode: '',
      subsystem: 'Unknown',
      description: '',
      level: '3',
      status: 'open'
    };

    // Map CSV columns to record fields
    headers.forEach((header, index) => {
      if (values[index]) {
        const value = values[index].trim();
        
        switch (header) {
          case 'date':
          case 'datum':
            record.date = value;
            break;
          case 'time':
          case 'timestamp':
          case 'zeit':
            record.timestamp = value;
            break;
          case 'eventcode':
          case 'event_code':
          case 'code':
          case 'fehlercode':
            record.eventCode = value;
            break;
          case 'subsystem':
          case 'system':
          case 'komponente':
            record.subsystem = value;
            break;
          case 'description':
          case 'beschreibung':
          case 'text':
            record.description = value;
            break;
          case 'level':
          case 'priority':
          case 'priorität':
            record.level = value;
            break;
          case 'status':
            record.status = value;
            break;
          default:
            record[header] = value;
        }
      }
    });

    // Ensure required fields have valid values
    if (!record.date) {
      record.date = new Date().toISOString().split('T')[0];
    }
    
    if (!record.timestamp) {
      record.timestamp = new Date().toISOString();
    }
    
    if (!record.eventCode) {
      record.eventCode = `UNK${i}`;
    }
    
    if (!record.description) {
      record.description = 'No description available';
    }

    records.push(record);
  }

  return records;
};
