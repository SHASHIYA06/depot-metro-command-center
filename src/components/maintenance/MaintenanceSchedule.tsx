
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Download, PlusCircle, Search, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, differenceInDays, isBefore } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { trains } from '@/lib/mockData';

// Mock maintenance schedule data
const mockMaintenanceSchedule = [
  {
    id: '1',
    trainId: '1', // TS15
    maintenanceType: 'Regular Inspection',
    lastDate: new Date(2025, 2, 15),
    nextDate: new Date(2025, 3, 15),
    frequency: 30, // days
    status: 'Scheduled',
    assignedTo: 'Araghya',
    notes: 'Check brake systems and HVAC'
  },
  {
    id: '2',
    trainId: '2', // TS16
    maintenanceType: 'Major Overhaul',
    lastDate: new Date(2025, 0, 10),
    nextDate: new Date(2025, 6, 10),
    frequency: 180, // days
    status: 'Scheduled',
    assignedTo: 'Shashi',
    notes: 'Full systems check and critical component replacement'
  },
  {
    id: '3',
    trainId: '3', // TS17
    maintenanceType: 'Regular Inspection',
    lastDate: new Date(2025, 3, 1),
    nextDate: new Date(2025, 4, 1),
    frequency: 30, // days
    status: 'Scheduled',
    assignedTo: 'Araghya',
    notes: 'Focus on electrical systems and doors'
  },
  {
    id: '4',
    trainId: '1', // TS15
    maintenanceType: 'Battery Check',
    lastDate: new Date(2025, 2, 20),
    nextDate: new Date(2025, 3, 20),
    frequency: 30, // days
    status: 'Scheduled',
    assignedTo: 'Shashi',
    notes: 'Check battery condition and charging systems'
  },
  {
    id: '5',
    trainId: '2', // TS16
    maintenanceType: 'Safety Systems',
    lastDate: new Date(2025, 2, 25),
    nextDate: new Date(2025, 3, 25),
    frequency: 30, // days
    status: 'Scheduled',
    assignedTo: 'Araghya',
    notes: 'Validate all safety systems and emergency protocols'
  },
];

export const MaintenanceSchedule: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trainFilter, setTrainFilter] = useState('all');
  const [schedule, setSchedule] = useState(mockMaintenanceSchedule);
  
  // Check and update maintenance status based on current date
  const today = new Date();
  const updatedSchedule = schedule.map(item => {
    const daysRemaining = differenceInDays(new Date(item.nextDate), today);
    
    let updatedStatus = item.status;
    
    if (daysRemaining < 0) {
      updatedStatus = 'Overdue';
    } else if (daysRemaining <= 7) {
      updatedStatus = 'Due Soon';
    }
    
    return { ...item, status: updatedStatus };
  });
  
  // Filter schedule data based on search and filters
  const filteredSchedule = updatedSchedule.filter(item => {
    // Apply train filter
    const matchesTrain = trainFilter === 'all' || 
      trains.find(t => t.id === item.trainId)?.name === trainFilter;
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      item.maintenanceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTrain && matchesStatus && matchesSearch;
  });

  const completeMaintenanceTask = (id: string) => {
    setSchedule(prev => 
      prev.map(item => {
        if (item.id === id) {
          const nextDate = addDays(new Date(), item.frequency);
          return {
            ...item,
            lastDate: new Date(),
            nextDate: nextDate,
            status: 'Scheduled'
          };
        }
        return item;
      })
    );
    
    toast({
      title: 'Maintenance Completed',
      description: 'Maintenance task has been marked as completed and next date updated',
    });
  };

  const exportSchedule = (format: 'excel' | 'pdf') => {
    // In a real app, this would create a file export
    toast({
      title: 'Export Successful',
      description: `Maintenance schedule has been exported as ${format.toUpperCase()}`,
    });
  };

  // Calculate schedule statistics
  const totalTasks = filteredSchedule.length;
  const overdueTasks = filteredSchedule.filter(s => s.status === 'Overdue').length;
  const dueSoonTasks = filteredSchedule.filter(s => s.status === 'Due Soon').length;
  const scheduledTasks = filteredSchedule.filter(s => s.status === 'Scheduled').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                Track and manage train maintenance schedules
              </CardDescription>
            </div>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <Button variant="outline" onClick={() => exportSchedule('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => exportSchedule('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search maintenance tasks..."
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
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Due Soon">Due Soon</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
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
          
          {/* Maintenance Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
                <div className="text-sm text-muted-foreground">Overdue</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-amber-600">{dueSoonTasks}</div>
                <div className="text-sm text-muted-foreground">Due Soon (7 days)</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{scheduledTasks}</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Maintenance Table */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Train</TableHead>
                  <TableHead>Maintenance Type</TableHead>
                  {!isMobile && <TableHead>Last Date</TableHead>}
                  <TableHead>Next Date</TableHead>
                  {!isMobile && (
                    <>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Notes</TableHead>
                    </>
                  )}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedule.map(item => {
                  const train = trains.find(t => t.id === item.trainId);
                  const daysRemaining = differenceInDays(new Date(item.nextDate), today);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{train?.name || '-'}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.maintenanceType}</div>
                        {isMobile && (
                          <div className="text-xs text-muted-foreground">
                            Last: {format(new Date(item.lastDate), 'dd MMM yyyy')} •
                            Assigned: {item.assignedTo}
                          </div>
                        )}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {format(new Date(item.lastDate), 'dd MMM yyyy')}
                        </TableCell>
                      )}
                      <TableCell>
                        <div>{format(new Date(item.nextDate), 'dd MMM yyyy')}</div>
                        <div className="text-xs text-muted-foreground">
                          {daysRemaining < 0 
                            ? `${Math.abs(daysRemaining)} days overdue` 
                            : `${daysRemaining} days remaining`}
                        </div>
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>{item.assignedTo}</TableCell>
                          <TableCell>{item.notes}</TableCell>
                        </>
                      )}
                      <TableCell>
                        <Badge variant={
                          item.status === 'Overdue' ? 'destructive' : 
                          item.status === 'Due Soon' ? 'warning' : 
                          'success'
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={item.status === 'Overdue' ? 'default' : 'outline'}
                          onClick={() => completeMaintenanceTask(item.id)}
                        >
                          Complete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {filteredSchedule.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 5 : 7} className="text-center py-8">
                      No maintenance tasks found for the selected criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Note: All maintenance records are backed up to Google Cloud monthly. To set up Google Cloud backup, the following information is required:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Google Cloud Storage bucket name</li>
              <li>Service account credentials (JSON key file)</li>
              <li>Backup frequency settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
