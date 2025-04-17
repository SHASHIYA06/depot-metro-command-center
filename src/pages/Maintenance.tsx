import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, PlusCircle, Search, Calendar as CalendarIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { MaintenanceSchedule, Train, UserRole } from '@/types';
import { trains, users } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

// Mock maintenance schedules
const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: 'm1',
    trainId: 't1',
    type: 'routine',
    description: 'Daily inspection of braking systems',
    startDate: new Date().toISOString(),
    endDate: addDays(new Date(), 1).toISOString(),
    status: 'scheduled',
    assignedTo: 'u2,u4'
  },
  {
    id: 'm2',
    trainId: 't2',
    type: 'preventive',
    description: 'Weekly maintenance of electrical systems',
    startDate: startOfWeek(new Date()).toISOString(),
    endDate: addDays(startOfWeek(new Date()), 2).toISOString(),
    status: 'in_progress',
    assignedTo: 'u3'
  },
  {
    id: 'm3',
    trainId: 't3',
    type: 'corrective',
    description: 'Monthly overhaul of engine components',
    startDate: addWeeks(new Date(), 1).toISOString(),
    endDate: addWeeks(addDays(new Date(), 3), 1).toISOString(),
    status: 'scheduled',
    assignedTo: 'u2,u5'
  },
  {
    id: 'm4',
    trainId: 't1',
    type: 'preventive',
    description: 'Quarterly safety inspection',
    startDate: addDays(new Date(), -5).toISOString(),
    endDate: addDays(new Date(), -3).toISOString(),
    status: 'completed',
    assignedTo: 'u3,u4'
  }
];

const Maintenance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showForm, setShowForm] = useState(false);
  
  const isDepotIncharge = user?.role === UserRole.DEPOT_INCHARGE;

  // Filter maintenance schedules based on active tab and search term
  const filteredSchedules = mockMaintenanceSchedules.filter(schedule => {
    const matchesSearch = schedule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getTrainName(schedule.trainId).toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'upcoming') {
      return matchesSearch && (schedule.status === 'scheduled');
    } else if (activeTab === 'in-progress') {
      return matchesSearch && (schedule.status === 'in_progress');
    } else if (activeTab === 'completed') {
      return matchesSearch && (schedule.status === 'completed');
    } else if (activeTab === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch;
  });

  const getTrainName = (trainId: string): string => {
    const train = trains.find(t => t.id === trainId);
    return train ? train.name : 'Unknown Train';
  };

  const getAssignedStaffNames = (assignedIds: string | string[]): string => {
    const idsArray = typeof assignedIds === 'string' ? assignedIds.split(',') : assignedIds;
    
    return idsArray.map(id => {
      const staff = users.find(u => u.id === id);
      return staff ? staff.name : 'Unknown';
    }).join(', ');
  };

  const getStatusBadgeClass = (status: MaintenanceSchedule['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-600 hover:bg-red-200';
      default:
        return '';
    }
  };

  const getTypeBadgeClass = (type: MaintenanceSchedule['type']) => {
    switch (type) {
      case 'routine':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
      case 'preventive':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'corrective':
        return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
      default:
        return '';
    }
  };

  const handleCreateSchedule = () => {
    toast({
      title: 'Maintenance Schedule Created',
      description: 'The new maintenance schedule has been created successfully.',
    });
    setShowForm(false);
  };

  const MaintenanceForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create Maintenance Schedule</CardTitle>
        <CardDescription>Schedule new maintenance for trains</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateSchedule(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="train" className="text-sm font-medium">Train</label>
              <select id="train" className="w-full px-3 py-2 border rounded-md">
                {trains.map(train => (
                  <option key={train.id} value={train.id}>{train.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Maintenance Type</label>
              <select id="type" className="w-full px-3 py-2 border rounded-md">
                <option value="routine">Routine</option>
                <option value="preventive">Preventive</option>
                <option value="corrective">Corrective</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
              <Input id="startDate" type="date" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">End Date</label>
              <Input id="endDate" type="date" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="assignTo" className="text-sm font-medium">Assign To</label>
              <select id="assignTo" multiple className="w-full px-3 py-2 border rounded-md">
                {users.filter(u => u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN).map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name} ({staff.role === UserRole.ENGINEER ? 'Engineer' : 'Technician'})</option>
                ))}
              </select>
              <p className="text-sm text-muted-foreground mt-1">Hold Ctrl/Cmd to select multiple staff members</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea 
                id="description" 
                className="w-full px-3 py-2 border rounded-md min-h-32" 
                placeholder="Provide details of the maintenance activities"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Create Schedule</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Schedules</h1>
          <p className="text-muted-foreground">
            Plan and track maintenance activities for all metro trains
          </p>
        </div>
        
        {(isDepotIncharge || user?.role === UserRole.ENGINEER) && (
          <Button onClick={() => setShowForm(!showForm)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        )}
      </div>

      {showForm && <MaintenanceForm />}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search maintenance schedules..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{getTrainName(schedule.trainId)}</h3>
                      <p className="text-muted-foreground">{schedule.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      <Badge className={getStatusBadgeClass(schedule.status)}>
                        {schedule.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getTypeBadgeClass(schedule.type)}>
                        {schedule.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Start Date</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(schedule.startDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">End Date</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(schedule.endDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Assigned To</div>
                        <div className="text-sm text-muted-foreground">
                          {getAssignedStaffNames(schedule.assignedTo)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" size="sm">View Details</Button>
                    {schedule.status !== 'completed' && (isDepotIncharge || user?.role === UserRole.ENGINEER) && (
                      <Button variant="outline" size="sm">Update Status</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No maintenance schedules found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try using different keywords or filters' : 'No maintenance schedules have been created yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
