
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, Calendar, Clock, Download, Search, Train, Wrench } from 'lucide-react';
import { 
  calculateNextDueDate, 
  getMaintenanceStatus, 
  formatMaintenanceStatus, 
  maintenanceSchedules, 
  MaintenanceType 
} from '@/utils/maintenanceSchedule';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { exportData } from '@/utils/dataExport';

// Mock train data - in a real app would come from API/database
const trainSets = Array.from({ length: 25 }, (_, i) => ({
  id: `TS${(i + 1).toString().padStart(2, '0')}`,
  name: `Train Set ${i + 1}`,
  lastMaintenanceDate: {
    'Daily': addDays(new Date(), -1),
    'A1': addDays(new Date(), -10),
    'B1': addDays(new Date(), -30),
    'B4': addDays(new Date(), -170),
    'B8': addDays(new Date(), -350),
    'IOH': addDays(new Date(), -1000),
  },
  totalKilometers: 50000 + (i * 5000)
}));

interface MaintenanceRecord {
  trainId: string;
  type: MaintenanceType;
  lastDate: Date;
  nextDate: Date;
  status: 'overdue' | 'upcoming' | 'ok';
  duration: string;
  totalKilometers: number;
}

const TrainMaintenanceSchedule: React.FC = () => {
  const { toast } = useToast();
  const [selectedTrain, setSelectedTrain] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState<Date | undefined>(new Date());
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // Generate maintenance records
  useEffect(() => {
    const records: MaintenanceRecord[] = [];
    
    trainSets.forEach(train => {
      Object.entries(maintenanceSchedules).forEach(([type, schedule]) => {
        const maintenanceType = type as MaintenanceType;
        const lastDate = train.lastMaintenanceDate[maintenanceType];
        const nextDate = calculateNextDueDate(lastDate, maintenanceType);
        const status = getMaintenanceStatus(nextDate);
        
        records.push({
          trainId: train.id,
          type: maintenanceType,
          lastDate,
          nextDate,
          status,
          duration: schedule.duration,
          totalKilometers: train.totalKilometers
        });
      });
    });
    
    setMaintenanceRecords(records);
  }, []);
  
  // Filter records based on search and filters
  const filteredRecords = maintenanceRecords.filter(record => {
    // Filter by train
    if (selectedTrain !== 'all' && record.trainId !== selectedTrain) {
      return false;
    }
    
    // Filter by maintenance type
    if (selectedType !== 'all' && record.type !== selectedType) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !record.trainId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort records by status priority (overdue -> upcoming -> ok) then by date
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    // First sort by status priority
    const statusPriority = { overdue: 0, upcoming: 1, ok: 2 };
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    
    if (statusDiff !== 0) {
      return statusDiff;
    }
    
    // Then sort by next due date
    return a.nextDate.getTime() - b.nextDate.getTime();
  });
  
  // Handle export
  const handleExport = (type: 'excel' | 'pdf') => {
    // Format data for export
    const exportData = sortedRecords.map(record => ({
      'Train ID': record.trainId,
      'Maintenance Type': record.type,
      'Last Maintenance': format(record.lastDate, 'PPP'),
      'Next Due Date': format(record.nextDate, 'PPP'),
      'Status': formatMaintenanceStatus(record.status).text,
      'Duration': record.duration,
      'Total Kilometers': record.totalKilometers.toLocaleString()
    }));
    
    // Export data
    if (type === 'excel') {
      exportToExcel(exportData);
    } else {
      exportToPDF(exportData);
    }
  };
  
  const exportToExcel = (data: any[]) => {
    try {
      exportData(data, 'Maintenance_Schedule', 'excel');
      toast({
        title: 'Export Successful',
        description: 'Maintenance schedule has been exported to Excel',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data',
        variant: 'destructive',
      });
      console.error('Excel export error:', error);
    }
  };
  
  const exportToPDF = (data: any[]) => {
    try {
      exportData(
        data,
        'Maintenance_Schedule',
        'pdf',
        'Train Maintenance Schedule',
        ['Train ID', 'Maintenance Type', 'Last Maintenance', 'Next Due Date', 'Status', 'Duration', 'Total Kilometers']
      );
      toast({
        title: 'Export Successful',
        description: 'Maintenance schedule has been exported to PDF',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data',
        variant: 'destructive',
      });
      console.error('PDF export error:', error);
    }
  };
  
  // Handle maintenance update
  const handleUpdateMaintenance = () => {
    if (!selectedTrain || selectedTrain === 'all' || !selectedType || selectedType === 'all' || !maintenanceDate) {
      toast({
        title: 'Missing Information',
        description: 'Please select a train, maintenance type, and date',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real application, this would update the database
    toast({
      title: 'Maintenance Updated',
      description: `Maintenance for ${selectedTrain} (${selectedType}) has been scheduled for ${format(maintenanceDate, 'PPP')}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Train Maintenance Schedule</h1>
          <p className="text-muted-foreground">
            Track and manage maintenance for train sets TS01-TS25
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Update Maintenance</CardTitle>
            <CardDescription>Record completed maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="train-select">Train Set</Label>
              <Select value={selectedTrain === 'all' ? undefined : selectedTrain} onValueChange={setSelectedTrain}>
                <SelectTrigger id="train-select">
                  <SelectValue placeholder="Select train set" />
                </SelectTrigger>
                <SelectContent>
                  {trainSets.map(train => (
                    <SelectItem key={train.id} value={train.id}>
                      {train.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maintenance-type">Maintenance Type</Label>
              <Select value={selectedType === 'all' ? undefined : selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="maintenance-type">
                  <SelectValue placeholder="Select maintenance type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(maintenanceSchedules).map(([type, schedule]) => (
                    <SelectItem key={type} value={type}>
                      {type} ({schedule.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Maintenance Date</Label>
              <DatePicker date={maintenanceDate} setDate={setMaintenanceDate} />
            </div>
            
            <Button className="w-full mt-4" onClick={handleUpdateMaintenance}>
              <Wrench className="mr-2 h-4 w-4" />
              Update Maintenance
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Maintenance Stats</CardTitle>
            <CardDescription>Overview of train maintenance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {maintenanceRecords.filter(r => r.status === 'overdue').length}
                </div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {maintenanceRecords.filter(r => r.status === 'upcoming').length}
                </div>
                <div className="text-sm text-muted-foreground">Due Soon</div>
              </div>
              
              <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {maintenanceRecords.filter(r => r.status === 'ok').length}
                </div>
                <div className="text-sm text-muted-foreground">On Schedule</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Maintenance Schedule</CardTitle>
            <CardDescription>View and manage upcoming maintenance</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search train set..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedTrain} onValueChange={setSelectedTrain}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Trains" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trains</SelectItem>
                {trainSets.map(train => (
                  <SelectItem key={train.id} value={train.id}>{train.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.keys(maintenanceSchedules).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Schedule for {trainSets.length} train sets</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Train ID</TableHead>
                <TableHead>Maintenance</TableHead>
                <TableHead>Last Performed</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Total KM</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.length > 0 ? (
                sortedRecords.map((record, index) => {
                  const { text: statusText, color: statusColor } = formatMaintenanceStatus(record.status);
                  
                  return (
                    <TableRow key={`${record.trainId}-${record.type}-${index}`}>
                      <TableCell className="font-medium">{record.trainId}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{format(record.lastDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(record.nextDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge className={statusColor}>{statusText}</Badge>
                      </TableCell>
                      <TableCell>{record.duration}</TableCell>
                      <TableCell>{record.totalKilometers.toLocaleString()} km</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Wrench className="mr-2 h-3 w-3" />
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No maintenance records found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainMaintenanceSchedule;
