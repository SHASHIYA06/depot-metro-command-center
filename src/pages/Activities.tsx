
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  FileText, 
  Clock, 
  User,
  Train,
  AlertTriangle,
  Filter,
  BarChart,
  Download,
  Calendar
} from 'lucide-react';
import { format, subDays, subHours, parse, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ActivityLog, UserRole } from '@/types';
import { users, trains } from '@/lib/mockData';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { DatePicker } from '@/components/ui/date-picker';
import { exportToExcel, exportToPDF, formatDataForExport } from '@/utils/exportUtils';
import { ActivityDetails } from '@/components/activities/ActivityDetails';
import { syncDailyActivitiesToSheets, backupToGoogleCloud } from '@/utils/googleSheetsIntegration';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock activity logs
const mockActivities: ActivityLog[] = [
  {
    id: 'a1',
    userId: 'u2',
    action: 'Task Completion',
    details: 'Completed brake inspection on Train A',
    timestamp: new Date().toISOString(),
    taskId: 'task1',
    trainId: 't1'
  },
  {
    id: 'a2',
    userId: 'u3',
    action: 'Issue Reported',
    details: 'Reported electrical issue in Car 2 of Train B',
    timestamp: subHours(new Date(), 3).toISOString(),
    trainId: 't2',
    carId: 'c2-t2'
  },
  {
    id: 'a3',
    userId: 'u4',
    action: 'Task Started',
    details: 'Started cleaning maintenance on Train C',
    timestamp: subHours(new Date(), 5).toISOString(),
    taskId: 'task3',
    trainId: 't3'
  },
  {
    id: 'a4',
    userId: 'u1',
    action: 'Maintenance Scheduled',
    details: 'Scheduled monthly maintenance for Train D',
    timestamp: subDays(new Date(), 1).toISOString(),
    trainId: 't4'
  },
  {
    id: 'a5',
    userId: 'u5',
    action: 'Component Replaced',
    details: 'Replaced faulty brake component on Train A',
    timestamp: subDays(new Date(), 1).toISOString(),
    trainId: 't1'
  },
  {
    id: 'a6',
    userId: 'u2',
    action: 'Inspection Completed',
    details: 'Completed safety inspection for Train E',
    timestamp: subDays(new Date(), 2).toISOString(),
    trainId: 't5'
  },
  {
    id: 'a7',
    userId: 'u3',
    action: 'System Update',
    details: 'Updated train control software on Train B',
    timestamp: subDays(new Date(), 3).toISOString(),
    trainId: 't2'
  },
  {
    id: 'a8',
    userId: 'u4',
    action: 'Emergency Repair',
    details: 'Performed emergency repair on Train C air conditioning',
    timestamp: subDays(new Date(), 4).toISOString(),
    trainId: 't3'
  }
];

const Activities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  
  const isDepotIncharge = user?.role === UserRole.DEPOT_INCHARGE;

  // Filter activities based on active tab, search term and date range
  const filteredActivities = mockActivities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getUserName(activity.userId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const isWithinDateRange = (!startDate || activityDate >= startDate) && 
                             (!endDate || activityDate <= endDate);
    
    // Filter based on selected month if any
    const isInSelectedMonth = selectedMonth === 'all' || 
      (format(activityDate, 'yyyy-MM') === selectedMonth);
    
    if (activeTab === 'tasks') {
      return matchesSearch && activity.taskId !== undefined && isWithinDateRange && isInSelectedMonth;
    } else if (activeTab === 'issues') {
      return matchesSearch && (activity.action === 'Issue Reported' || activity.action === 'Issue Resolved') && 
             isWithinDateRange && isInSelectedMonth;
    } else if (activeTab === 'maintenance') {
      return matchesSearch && (activity.action === 'Maintenance Scheduled' || activity.action === 'Maintenance Completed') && 
             isWithinDateRange && isInSelectedMonth;
    } else if (activeTab === 'user') {
      return matchesSearch && activity.userId === user?.id && isWithinDateRange && isInSelectedMonth;
    } else if (activeTab === 'all') {
      return matchesSearch && isWithinDateRange && isInSelectedMonth;
    }
    
    return matchesSearch && isWithinDateRange && isInSelectedMonth;
  });

  const getUserName = (userId: string): string => {
    const userObj = users.find(u => u.id === userId);
    return userObj ? userObj.name : 'Unknown User';
  };

  const getTrainName = (trainId?: string): string => {
    if (!trainId) return 'N/A';
    const train = trains.find(t => t.id === trainId);
    return train ? train.name : 'Unknown Train';
  };

  const getActionBadgeClass = (action: string) => {
    if (action.includes('Completed') || action.includes('Resolved')) {
      return 'bg-green-100 text-green-600 hover:bg-green-200';
    } else if (action.includes('Started') || action.includes('Scheduled')) {
      return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
    } else if (action.includes('Reported') || action.includes('Emergency')) {
      return 'bg-orange-100 text-orange-600 hover:bg-orange-200';
    } else if (action.includes('Updated') || action.includes('Replaced')) {
      return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
    } else {
      return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };

  const viewActivityDetails = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setIsDetailsOpen(true);
  };

  const exportActivities = (format: 'excel' | 'pdf') => {
    const dataToExport = filteredActivities.map(activity => ({
      Action: activity.action,
      Details: activity.details,
      User: getUserName(activity.userId),
      Train: getTrainName(activity.trainId),
      Timestamp: format(new Date(activity.timestamp), 'PPpp'),
      TaskID: activity.taskId || 'N/A',
      CarID: activity.carId || 'N/A'
    }));
    
    if (format === 'excel') {
      exportToExcel(dataToExport, 'Activities_Export');
      
    } else {
      exportToPDF(
        dataToExport,
        'Activities_Export',
        'Metro Depot Activities Report',
        [
          { header: 'Action', dataKey: 'Action' },
          { header: 'Details', dataKey: 'Details' },
          { header: 'User', dataKey: 'User' },
          { header: 'Train', dataKey: 'Train' },
          { header: 'Timestamp', dataKey: 'Timestamp' }
        ]
      );
    }
  };

  const backupActivities = async () => {
    toast({
      title: 'Backup Started',
      description: 'Backing up activities data to Google Cloud...',
    });
    
    // Sync with Google Sheets first
    const sheetsSyncResult = await syncDailyActivitiesToSheets(
      filteredActivities.map(activity => ({
        ...activity,
        userName: getUserName(activity.userId),
        trainName: getTrainName(activity.trainId),
      }))
    );
    
    // Then backup to Google Cloud
    const cloudBackupResult = await backupToGoogleCloud(filteredActivities, 'activities');
    
    if (sheetsSyncResult && cloudBackupResult) {
      toast({
        title: 'Backup Successful',
        description: 'Activities data has been backed up to Google Cloud and synced with Google Sheets',
      });
    } else {
      toast({
        title: 'Backup Partially Completed',
        description: 'There was an issue with the backup process. Please check the logs for details.',
        variant: 'destructive',
      });
    }
  };

  // Generate month options for the last 12 months
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
      // Parse the month string (yyyy-MM) to get the start and end of that month
      const [year, monthNum] = month.split('-').map(Number);
      const monthStart = startOfMonth(new Date(year, monthNum - 1));
      const monthEnd = endOfMonth(new Date(year, monthNum - 1));
      
      setStartDate(monthStart);
      setEndDate(monthEnd);
    } else {
      // If 'All Months' is selected, reset to the last 30 days
      setStartDate(subDays(new Date(), 30));
      setEndDate(new Date());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">
            Track all activities happening in the depot
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => exportActivities('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => exportActivities('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button onClick={backupActivities}>
            <BarChart className="mr-2 h-4 w-4" />
            Backup Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActivities.length}</div>
            <p className="text-xs text-muted-foreground">+12 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Task Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActivities.filter(a => a.taskId).length}</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Maintenance Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActivities.filter(a => a.action.includes('Maintenance')).length}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Issue Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockActivities.filter(a => a.action.includes('Issue')).length}</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Date and Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter Activities</CardTitle>
          <CardDescription>Narrow down activities by date range, keywords, or type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">Month</label>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger>
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
            
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker 
                date={startDate} 
                setDate={setStartDate} 
              />
            </div>
            
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <DatePicker 
                date={endDate} 
                setDate={setEndDate} 
              />
            </div>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="user">Your Activities</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden hover:bg-muted/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <Badge className={getActionBadgeClass(activity.action)}>
                      {activity.action}
                    </Badge>
                    <div>
                      <p className="font-medium">{activity.details}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{getUserName(activity.userId)}</span>
                        </div>
                        {activity.trainId && (
                          <div className="flex items-center gap-1">
                            <Train className="h-3 w-3" />
                            <span>{getTrainName(activity.trainId)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:self-start"
                    onClick={() => viewActivityDetails(activity)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No activities found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try using different keywords or filters' : 'No activities have been logged yet'}
            </p>
          </div>
        )}
      </div>
      
      {/* Activity Details Dialog */}
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

export default Activities;
