import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, FileText, Cloud } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfMonth, endOfMonth, isWithinInterval, addMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { exportData, exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { backupToGoogleCloud } from '@/utils/googleSheetsIntegration';
import { ExportFormat } from '@/types';

// Mock maintenance schedule data
const mockSchedules = [
  {
    id: '1',
    trainSet: 'TS15',
    type: 'Regular Inspection',
    dueDate: new Date(2025, 4, 15),
    status: 'Scheduled',
    assignedTeam: 'Mechanical Team',
    estimatedDuration: '4 hours',
    notes: 'Standard inspection as per checklist A-101'
  },
  {
    id: '2',
    trainSet: 'TS16',
    type: 'Critical Systems Check',
    dueDate: new Date(2025, 4, 18),
    status: 'Scheduled',
    assignedTeam: 'Electrical Team',
    estimatedDuration: '6 hours',
    notes: 'Verify all safety systems and critical components'
  },
  {
    id: '3',
    trainSet: 'TS17',
    type: 'Wheel Maintenance',
    dueDate: new Date(2025, 4, 10),
    status: 'Completed',
    assignedTeam: 'Mechanical Team',
    estimatedDuration: '8 hours',
    notes: 'Wheel profiling and maintenance completed'
  },
  {
    id: '4',
    trainSet: 'TS15',
    type: 'Brake System Check',
    dueDate: new Date(2025, 4, 25),
    status: 'Scheduled',
    assignedTeam: 'Brake Team',
    estimatedDuration: '5 hours',
    notes: 'Complete brake system inspection and testing'
  },
  {
    id: '5',
    trainSet: 'TS16',
    type: 'Door System Maintenance',
    dueDate: new Date(2025, 5, 5),
    status: 'Scheduled',
    assignedTeam: 'Mechanical Team',
    estimatedDuration: '3 hours',
    notes: 'Door alignment and sensor calibration'
  },
  {
    id: '6',
    trainSet: 'TS17',
    type: 'HVAC System Service',
    dueDate: new Date(2025, 5, 12),
    status: 'Scheduled',
    assignedTeam: 'HVAC Team',
    estimatedDuration: '4 hours',
    notes: 'Check cooling performance and clean filters'
  }
];

export const MaintenanceSchedule: React.FC = () => {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<string>('current');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTrainSet, setSelectedTrainSet] = useState<string>('all');
  
  // Filter schedules based on selected criteria
  const filteredSchedules = mockSchedules.filter(schedule => {
    const scheduleDate = new Date(schedule.dueDate);
    
    // Date filter based on selected view
    let isInDateRange = false;
    if (selectedView === 'current') {
      // Current month view
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      isInDateRange = isWithinInterval(scheduleDate, { start: monthStart, end: monthEnd });
    } else if (selectedView === 'next') {
      // Next month view
      const nextMonth = addMonths(currentMonth, 1);
      const monthStart = startOfMonth(nextMonth);
      const monthEnd = endOfMonth(nextMonth);
      isInDateRange = isWithinInterval(scheduleDate, { start: monthStart, end: monthEnd });
    } else if (selectedView === 'all') {
      // All schedules view
      isInDateRange = true;
    }
    
    // Type filter
    const matchesType = selectedType === 'all' || schedule.type === selectedType;
    
    // Train set filter
    const matchesTrainSet = selectedTrainSet === 'all' || schedule.trainSet === selectedTrainSet;
    
    return isInDateRange && matchesType && matchesTrainSet;
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handleCurrentMonth = () => {
    setCurrentMonth(new Date());
    setSelectedView('current');
  };

  const exportSchedules = (format: ExportFormat) => {
    // Prepare data for export
    const exportData = filteredSchedules.map(schedule => ({
      TrainSet: schedule.trainSet,
      MaintenanceType: schedule.type,
      DueDate: format(new Date(schedule.dueDate), 'PPP'),
      Status: schedule.status,
      AssignedTeam: schedule.assignedTeam,
      EstimatedDuration: schedule.estimatedDuration,
      Notes: schedule.notes
    }));
    
    if (format === 'excel') {
      exportToExcel(exportData, 'Maintenance_Schedule');
      toast({
        title: 'Export Successful',
        description: 'Maintenance schedule has been exported to Excel',
      });
    } else {
      exportToPDF(
        exportData,
        'Maintenance_Schedule',
        'Metro Depot Maintenance Schedule',
        [
          { header: 'Train Set', dataKey: 'TrainSet' },
          { header: 'Type', dataKey: 'MaintenanceType' },
          { header: 'Due Date', dataKey: 'DueDate' },
          { header: 'Status', dataKey: 'Status' },
          { header: 'Team', dataKey: 'AssignedTeam' },
          { header: 'Duration', dataKey: 'EstimatedDuration' }
        ]
      );
      toast({
        title: 'Export Successful',
        description: 'Maintenance schedule has been exported to PDF',
      });
    }
  };

  const backupScheduleData = async () => {
    toast({
      title: 'Backup Started',
      description: 'Backing up maintenance schedule data to Google Cloud...',
    });
    
    // Backup to Google Cloud
    const cloudBackupResult = await backupToGoogleCloud(mockSchedules, 'maintenance-schedule');
    
    if (cloudBackupResult) {
      toast({
        title: 'Backup Completed',
        description: 'Maintenance schedule data has been successfully backed up to Google Cloud',
      });
    } else {
      toast({
        title: 'Backup Failed',
        description: 'There was an issue with the backup process. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getMaintenanceTypes = () => {
    const types = new Set<string>();
    mockSchedules.forEach(schedule => types.add(schedule.type));
    return Array.from(types);
  };

  const getTrainSets = () => {
    const sets = new Set<string>();
    mockSchedules.forEach(schedule => sets.add(schedule.trainSet));
    return Array.from(sets);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Scheduled':
        return 'outline';
      case 'Delayed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                Plan and track scheduled maintenance activities
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={() => exportSchedules('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => exportSchedules('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={backupScheduleData}>
                <Cloud className="mr-2 h-4 w-4" />
                Backup
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span className="text-lg font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={handleCurrentMonth}>
                Current Month
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextMonth}>
                Next
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={selectedView} onValueChange={setSelectedView}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="next">Next Month</SelectItem>
                <SelectItem value="all">All Scheduled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Maintenance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {getMaintenanceTypes().map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTrainSet} onValueChange={setSelectedTrainSet}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Train Set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Trains</SelectItem>
                {getTrainSets().map(set => (
                  <SelectItem key={set} value={set}>{set}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{filteredSchedules.length}</div>
                <div className="text-sm text-muted-foreground">Total Scheduled</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredSchedules.filter(s => s.status === 'Completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredSchedules.filter(s => s.status === 'In Progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {filteredSchedules.filter(s => s.status === 'Scheduled').length}
                </div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Train Set</TableHead>
                  <TableHead>Maintenance Type</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map(schedule => (
                  <TableRow key={schedule.id}>
                    <TableCell className="font-medium">{schedule.trainSet}</TableCell>
                    <TableCell>{schedule.type}</TableCell>
                    <TableCell>{format(new Date(schedule.dueDate), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(schedule.status)}>
                        {schedule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{schedule.assignedTeam}</TableCell>
                    <TableCell>{schedule.estimatedDuration}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredSchedules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No maintenance activities scheduled for the selected criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Note: Maintenance schedules are subject to change based on operational requirements. All maintenance activities are logged and backed up automatically.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
