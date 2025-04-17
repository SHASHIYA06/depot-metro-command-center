import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MaintenanceSchedule, UserRole, ExportFormat } from '@/types';
import { users, trains, maintenanceSchedules } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

const MaintenanceScheduleComponent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Load maintenance schedules from mockData
    setSchedules(maintenanceSchedules);
  }, []);

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? format(parseISO(schedule.startDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') : true;
    const matchesType = selectedType === 'all' || schedule.type === selectedType;

    return matchesSearch && matchesDate && matchesType;
  });

  const getTrainName = (trainId: string): string => {
    const train = trains.find(t => t.id === trainId);
    return train ? train.name : 'Unknown';
  };

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setIsDialogOpen(true);
  };

  const confirmDeleteSchedule = () => {
    if (scheduleToDelete) {
      // Delete schedule from mock data
      const updatedSchedules = schedules.filter(schedule => schedule.id !== scheduleToDelete);
      setSchedules(updatedSchedules);
      
      // Show success toast
      toast({
        title: 'Schedule Deleted',
        description: 'The maintenance schedule has been deleted.',
      });
    }
    
    setIsDialogOpen(false);
    setScheduleToDelete(null);
  };

  const cancelDeleteSchedule = () => {
    setIsDialogOpen(false);
    setScheduleToDelete(null);
  };

  const handleExportSchedule = (format: ExportFormat) => {
    const exportData = schedules.map(schedule => ({
      id: schedule.id,
      train: getTrainName(schedule.trainId),
      type: schedule.type,
      description: schedule.description,
      startDate: new Date(schedule.startDate).toLocaleDateString(),
      endDate: new Date(schedule.endDate).toLocaleDateString(),
      status: schedule.status,
      assignedTo: typeof schedule.assignedTo === 'string' 
        ? getUserName(schedule.assignedTo)
        : schedule.assignedTo.map(id => getUserName(id)).join(', '),
      notes: schedule.notes || '-'
    }));

    if (format === 'excel') {
      exportToExcel(exportData, 'Maintenance_Schedule');
    } else if (format === 'pdf') {
      exportToPDF(exportData, 'Maintenance_Schedule', 'Maintenance Schedule Report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Schedule</h1>
          <p className="text-muted-foreground">
            Manage and track scheduled maintenance for all trains
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExportSchedule('excel')}>
            Export to Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExportSchedule('pdf')}>
            Export to PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search schedules..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={selectedDate ? format(selectedDate, 'PPP') : ""}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>{selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
              />
            </PopoverContent>
          </Popover>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="routine">Routine</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Schedules</CardTitle>
          <CardDescription>List of all scheduled maintenance activities</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableCaption>A list of your scheduled maintenance.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Train</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Notes</TableHead>
                {user?.role === UserRole.ADMIN && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">{schedule.id}</TableCell>
                  <TableCell>{getTrainName(schedule.trainId)}</TableCell>
                  <TableCell>{schedule.type}</TableCell>
                  <TableCell>{schedule.description}</TableCell>
                  <TableCell>{format(parseISO(schedule.startDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{format(parseISO(schedule.endDate), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{schedule.status}</TableCell>
                  <TableCell>
                    {typeof schedule.assignedTo === 'string' 
                      ? getUserName(schedule.assignedTo)
                      : schedule.assignedTo.map(id => getUserName(id)).join(', ')}
                  </TableCell>
                  <TableCell>{schedule.notes || '-'}</TableCell>
                  {user?.role === UserRole.ADMIN && (
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. Are you sure you want to delete this schedule?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={cancelDeleteSchedule}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDeleteSchedule}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceScheduleComponent;
