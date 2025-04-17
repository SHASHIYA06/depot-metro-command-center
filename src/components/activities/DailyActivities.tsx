import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, Filter, PlusCircle, Search, FileText, Cloud } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { users } from '@/lib/mockData';
import { UserRole, ExportFormat } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { exportData, exportToExcel, exportToPDF, createPdfColumns, formatDataForExport } from '@/utils/exportUtils';
import { syncDailyActivitiesToSheets, backupToGoogleCloud } from '@/utils/googleSheetsIntegration';

const mockActivities = [
  {
    id: '1',
    date: new Date(2025, 3, 14),
    trainSet: 'TS15',
    activity: 'Train inspection and testing',
    status: 'Completed',
    assignedTo: '1',
    priority: 'High',
    remarks: 'All systems operational'
  },
  {
    id: '2',
    date: new Date(2025, 3, 14),
    trainSet: 'TS16',
    activity: 'Brake system maintenance',
    status: 'In Progress',
    assignedTo: '2',
    priority: 'Medium',
    remarks: 'Parts replacement in progress'
  },
  {
    id: '3',
    date: new Date(2025, 3, 13),
    trainSet: 'TS17',
    activity: 'Door mechanism repair',
    status: 'Pending',
    assignedTo: '3',
    priority: 'Low',
    remarks: 'Waiting for replacement parts'
  },
  {
    id: '4',
    date: new Date(2025, 3, 13),
    trainSet: 'TS15',
    activity: 'HVAC system check',
    status: 'Completed',
    assignedTo: '1',
    priority: 'Medium',
    remarks: 'Cooling system optimized'
  },
  {
    id: '5',
    date: new Date(2025, 3, 12),
    trainSet: 'TS16',
    activity: 'Propulsion system test',
    status: 'Completed',
    assignedTo: '2',
    priority: 'High',
    remarks: 'All parameters within acceptable range'
  },
];

interface ActivityRecord {
  id: string;
  date: Date;
  trainSet: string;
  activity: string;
  status: string;
  assignedTo: string;
  priority: string;
  remarks: string;
}

interface ActivityDetailsProps {
  activity: ActivityRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity, open, onOpenChange }) => {
  const staff = users.find(u => u.id === activity.assignedTo);
  
  const exportRecord = (format: ExportFormat) => {
    const activityData = [{
      Date: format(new Date(activity.date), 'PPP'),
      TrainSet: activity.trainSet,
      Activity: activity.activity,
      Status: activity.status,
      AssignedTo: staff?.name || 'Unassigned',
      Priority: activity.priority,
      Remarks: activity.remarks || 'N/A'
    }];
    
    exportData(
      activityData, 
      format, 
      `Activity_${activity.id}`,
      'Daily Activity Record',
      format === 'pdf' ? [
        { header: 'Property', dataKey: 'property' },
        { header: 'Value', dataKey: 'value' }
      ] : undefined
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Activity Details
          </DialogTitle>
          <DialogDescription>
            Complete activity information
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center my-4">
          <Badge 
            variant={
              activity.status === 'Completed' ? 'default' : 
              activity.status === 'In Progress' ? 'secondary' : 
              'outline'
            }
          >
            {activity.status}
          </Badge>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportRecord('excel')}
            >
              <Download className="mr-1 h-4 w-4" />
              Export Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportRecord('pdf')}
            >
              <Download className="mr-1 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Train Set:</dt>
                <dd className="text-base">{activity.trainSet}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Date:</dt>
                <dd className="text-base">{format(new Date(activity.date), 'PPP')}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Activity:</dt>
                <dd className="text-base">{activity.activity}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Priority:</dt>
                <dd className="text-base">{activity.priority}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Status:</dt>
                <dd className="text-base">{activity.status}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Assigned To:</dt>
                <dd className="text-base">{staff?.name || 'Unassigned'}</dd>
              </div>
              <div className="space-y-1 col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Remarks:</dt>
                <dd className="text-base">{activity.remarks || 'No remarks'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <div className="flex flex-col space-y-2 mt-4">
          <h3 className="text-lg font-medium">Activity History</h3>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">
                Related activities for train set {activity.trainSet}:
              </p>
              <div className="mt-4 space-y-2">
                {mockActivities
                  .filter(a => a.trainSet === activity.trainSet && a.id !== activity.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((a, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-2">
                      <div className="text-sm">{format(new Date(a.date), 'EEE, MMM d')}: {a.activity}</div>
                      <Badge 
                        variant={
                          a.status === 'Completed' ? 'default' : 
                          a.status === 'In Progress' ? 'secondary' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {a.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const DailyActivities: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trainFilter, setTrainFilter] = useState('all');
  const [activities, setActivities] = useState(mockActivities);
  const [currentMonth, setCurrentMonth] = useState(format(new Date(), 'MMMM yyyy'));
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedActivity, setSelectedActivity] = useState<ActivityRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const filteredActivities = activities.filter(record => {
    const recordDate = new Date(record.date);
    const isAfterStart = !startDate || recordDate >= startDate;
    const isBeforeEnd = !endDate || recordDate <= endDate;
    
    const isInSelectedMonth = selectedMonth === 'all' || 
      (format(recordDate, 'yyyy-MM') === selectedMonth);
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    const matchesTrain = trainFilter === 'all' || record.trainSet === trainFilter;
    
    const matchesSearch = searchTerm === '' || 
      record.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isAfterStart && isBeforeEnd && matchesStatus && matchesTrain && matchesSearch && isInSelectedMonth;
  });

  const exportActivities = (format: ExportFormat) => {
    const exportData = filteredActivities.map(record => {
      const staff = users.find(u => u.id === record.assignedTo);
      return {
        Date: format === 'excel' ? format(new Date(record.date), 'yyyy-MM-dd') : format(new Date(record.date), 'PPP'),
        TrainSet: record.trainSet,
        Activity: record.activity,
        Status: record.status,
        Priority: record.priority,
        AssignedTo: staff?.name || 'Unassigned',
        Remarks: record.remarks || ''
      };
    });
    
    if (format === 'excel') {
      exportToExcel(exportData, 'Daily_Activities');
    } else {
      exportToPDF(
        exportData,
        'Daily_Activities',
        'Metro Depot Daily Activities Report',
        [
          { header: 'Date', dataKey: 'Date' },
          { header: 'Train Set', dataKey: 'TrainSet' },
          { header: 'Activity', dataKey: 'Activity' },
          { header: 'Status', dataKey: 'Status' },
          { header: 'Priority', dataKey: 'Priority' },
          { header: 'Assigned To', dataKey: 'AssignedTo' },
          { header: 'Remarks', dataKey: 'Remarks' }
        ]
      );
    }
    
    toast({
      title: 'Export Successful',
      description: `Activities data has been exported as ${format.toUpperCase()}`,
    });
  };

  const totalActivities = filteredActivities.length;
  const completedActivities = filteredActivities.filter(a => a.status === 'Completed').length;
  const inProgressActivities = filteredActivities.filter(a => a.status === 'In Progress').length;
  const pendingActivities = filteredActivities.filter(a => a.status === 'Pending').length;
  
  const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  const backupToCloud = async () => {
    toast({
      title: 'Backup Initiated',
      description: 'Data is being backed up to Google Cloud',
    });
    
    const dataWithNames = activities.map(activity => {
      const staff = users.find(u => u.id === activity.assignedTo);
      return {
        ...activity,
        assignedToName: staff?.name || 'Unassigned',
        syncTimestamp: new Date().toISOString()
      };
    });
    
    const sheetsSyncResult = await syncDailyActivitiesToSheets(dataWithNames);
    
    const cloudBackupResult = await backupToGoogleCloud(dataWithNames, 'daily-activities');
    
    if (sheetsSyncResult && cloudBackupResult) {
      toast({
        title: 'Backup Completed',
        description: 'All data has been successfully backed up to Google Cloud and synced with Google Sheets',
      });
    } else {
      toast({
        title: 'Backup Partially Completed',
        description: 'There was an issue with the backup process. Please check the logs for details.',
        variant: 'destructive',
      });
    }
  };

  const getMonthOptions = () => {
    const options = [{ value: 'all', label: 'All Months' }];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthValue = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMMM yyyy');
      options.push({ value: monthValue, label: monthLabel });
    }
    
    return options;
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    
    if (month !== 'all') {
      const [year, monthNum] = month.split('-').map(Number);
      const monthStart = startOfMonth(new Date(year, monthNum - 1));
      const monthEnd = endOfMonth(new Date(year, monthNum - 1));
      
      setStartDate(monthStart);
      setEndDate(monthEnd);
    } else {
      setStartDate(subDays(new Date(), 7));
      setEndDate(new Date());
    }
  };

  const viewActivityDetails = (activity: ActivityRecord) => {
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Daily Work Activities</CardTitle>
              <CardDescription>
                Track and manage daily maintenance activities
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={() => exportActivities('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => exportActivities('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={backupToCloud}>
                <Cloud className="mr-2 h-4 w-4" />
                Backup to Cloud
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span className="text-lg font-medium">{currentMonth}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setCurrentMonth(format(new Date(), 'MMMM yyyy'))}>
                Current Month
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={trainFilter} onValueChange={setTrainFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Train Set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trains</SelectItem>
                  <SelectItem value="TS15">TS15</SelectItem>
                  <SelectItem value="TS16">TS16</SelectItem>
                  <SelectItem value="TS17">TS17</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {getMonthOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <Label>From Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} className="w-full" />
            </div>
            
            <div className="flex-1 space-y-2">
              <Label>To Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} className="w-full" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{totalActivities}</div>
                <div className="text-sm text-muted-foreground">Total Activities</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{completedActivities}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-blue-600">{inProgressActivities}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-amber-600">{pendingActivities}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Train</TableHead>
                  <TableHead>Activity</TableHead>
                  {!isMobile && (
                    <>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                    </>
                  )}
                  <TableHead>Status</TableHead>
                  {!isMobile && <TableHead>Remarks</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map(activity => {
                  const assignedStaff = users.find(u => u.id === activity.assignedTo);
                  
                  return (
                    <TableRow key={activity.id}>
                      <TableCell>
                        {format(new Date(activity.date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>{activity.trainSet}</TableCell>
                      <TableCell>
                        <div className="font-medium">{activity.activity}</div>
                        {isMobile && (
                          <div className="text-xs text-muted-foreground">
                            {assignedStaff?.name} • {activity.priority} Priority
                          </div>
                        )}
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            {assignedStaff?.name || '-'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              activity.priority === 'High' ? 'destructive' : 
                              activity.priority === 'Medium' ? 'default' : 
                              'secondary'
                            }>
                              {activity.priority}
                            </Badge>
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Badge variant={
                          activity.status === 'Completed' ? 'secondary' : 
                          activity.status === 'In Progress' ? 'default' : 
                          'outline'
                        }>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {activity.remarks || '-'}
                        </TableCell>
                      )}
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => viewActivityDetails(activity)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 5 : 7} className="text-center py-8">
                      No activity records found for the selected criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Note: All data is retained permanently for historical records and backed up to Google Cloud monthly.</p>
          </div>
        </CardContent>
      </Card>
      
      {selectedActivity && (
        <ActivityDetails 
          activity={selectedActivity} 
          open={isDetailsOpen} 
          onOpenChange={setIsDetailsOpen} 
        />
      )}
    </div>
  );
};
