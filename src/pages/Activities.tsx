import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, Filter, PlusCircle, Search, FileText } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, isWithinInterval } from 'date-fns';
import { exportData, formatDataForExport, createPdfColumns } from '@/utils/exportUtils';
import { ExportFormat } from '@/types';

// Mock activity log data
const mockActivityLog = [
  {
    id: '1',
    userId: '1',
    action: 'Login',
    details: 'User logged in successfully',
    timestamp: new Date(2025, 3, 14, 8, 30, 0).toISOString(),
    taskId: 'task123',
  },
  {
    id: '2',
    userId: '2',
    action: 'Task Assigned',
    details: 'Task "Inspect Brakes" assigned to user',
    timestamp: new Date(2025, 3, 14, 9, 15, 0).toISOString(),
    taskId: 'task124',
  },
  {
    id: '3',
    userId: '1',
    action: 'Task Completed',
    details: 'Task "Inspect Brakes" marked as completed',
    timestamp: new Date(2025, 3, 14, 14, 45, 0).toISOString(),
    taskId: 'task124',
  },
  {
    id: '4',
    userId: '3',
    action: 'Issue Reported',
    details: 'New issue reported: "HVAC Failure"',
    timestamp: new Date(2025, 3, 13, 10, 0, 0).toISOString(),
  },
  {
    id: '5',
    userId: '2',
    action: 'Maintenance Scheduled',
    details: 'Scheduled maintenance for Train Set 15',
    timestamp: new Date(2025, 3, 13, 16, 20, 0).toISOString(),
    trainId: 'train15',
  },
];

const Activities = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [activityLog, setActivityLog] = useState(mockActivityLog);

  const filteredActivityLog = activityLog.filter(log => {
    const logDate = new Date(log.timestamp);
    const isAfterStart = !startDate || logDate >= startDate;
    const isBeforeEnd = !endDate || logDate <= endDate;
    const matchesSearch = searchTerm === '' || log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = activityType === 'all' || log.action === activityType;
    return isAfterStart && isBeforeEnd && matchesSearch && matchesType;
  });

  const handleExport = (format: ExportFormat) => {
    const formattedData = formatDataForExport(filteredActivityLog);
    const headers = ['User ID', 'Action', 'Details', 'Timestamp', 'Task ID', 'Train ID'];
    const keys = ['userId', 'action', 'details', 'timestamp', 'taskId', 'trainId'];
    const pdfColumns = createPdfColumns(headers, keys);
    
    exportData(
      formattedData,
      format,
      'Activity_Log',
      'Metro Depot Activity Log',
      pdfColumns
    );
    
    toast({
      title: 'Export Successful',
      description: `Data has been exported to ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Track and manage user activities and system events
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
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
        </CardHeader>
        
        <CardContent>
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
              <Select value={activityType} onValueChange={setActivityType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="Login">Login</SelectItem>
                  <SelectItem value="Task Assigned">Task Assigned</SelectItem>
                  <SelectItem value="Task Completed">Task Completed</SelectItem>
                  <SelectItem value="Issue Reported">Issue Reported</SelectItem>
                  <SelectItem value="Maintenance Scheduled">Maintenance Scheduled</SelectItem>
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
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Task ID</TableHead>
                  <TableHead>Train ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivityLog.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{log.userId}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.details}</TableCell>
                    <TableCell>{format(new Date(log.timestamp), 'dd MMM yyyy, HH:mm')}</TableCell>
                    <TableCell>{log.taskId || '-'}</TableCell>
                    <TableCell>{log.trainId || '-'}</TableCell>
                  </TableRow>
                ))}
                
                {filteredActivityLog.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No activity logs found for the selected criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Activities;
