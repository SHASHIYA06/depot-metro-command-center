
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, Filter, PlusCircle, Search } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { users } from '@/lib/mockData';
import { UserRole } from '@/types';

// Mock daily activities data
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
  
  // Filter activities data based on search and filters
  const filteredActivities = activities.filter(record => {
    // Apply date filter
    const recordDate = new Date(record.date);
    const isAfterStart = !startDate || recordDate >= startDate;
    const isBeforeEnd = !endDate || recordDate <= endDate;
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    // Apply train filter
    const matchesTrain = trainFilter === 'all' || record.trainSet === trainFilter;
    
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      record.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isAfterStart && isBeforeEnd && matchesStatus && matchesTrain && matchesSearch;
  });

  const exportActivities = (format: 'excel' | 'pdf') => {
    // In a real app, this would create a file export
    toast({
      title: 'Export Successful',
      description: `Activities data has been exported as ${format.toUpperCase()}`,
    });
  };

  // Calculate activity statistics
  const totalActivities = filteredActivities.length;
  const completedActivities = filteredActivities.filter(a => a.status === 'Completed').length;
  const inProgressActivities = filteredActivities.filter(a => a.status === 'In Progress').length;
  const pendingActivities = filteredActivities.filter(a => a.status === 'Pending').length;
  
  const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

  // Mock function to simulate backing up data to Google Cloud
  const backupToCloud = () => {
    toast({
      title: 'Backup Initiated',
      description: 'Data is being backed up to Google Cloud',
    });
    
    // Simulate backup completion after 2 seconds
    setTimeout(() => {
      toast({
        title: 'Backup Completed',
        description: 'All data has been successfully backed up to Google Cloud',
      });
    }, 2000);
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
            <Button onClick={backupToCloud}>
              Backup to Cloud
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Month Selector */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              <span className="text-lg font-medium">{currentMonth}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setCurrentMonth(format(new Date(), 'MMMM yyyy'))}>
                Current Month
              </Button>
              <Button variant="outline" onClick={() => exportActivities('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => exportActivities('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Section */}
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
            </div>
          </div>
          
          {/* Date Range Picker */}
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
          
          {/* Activity Statistics */}
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
          
          {/* Activities Table */}
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
                          activity.status === 'Completed' ? 'success' : 
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
                    </TableRow>
                  );
                })}
                
                {filteredActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 7} className="text-center py-8">
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
    </div>
  );
};
