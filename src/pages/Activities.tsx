import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, MoreHorizontal, X, FileType } from 'lucide-react';
import { format } from 'date-fns';
import { ActivityLog, UserRole, ExportFormat } from '@/types';
import { activityLogs, users } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { handleExport } from '@/utils/exportUtils';

const Activities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Load activities from mockData
    setActivities(activityLogs);
  }, []);

  const filteredActivities = activities.filter(activity => {
    const matchesSearch =
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = selectedDate
      ? format(new Date(activity.timestamp), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      : true;

    // Filter based on user role
    if (user?.role === UserRole.TECHNICIAN) {
      // Technicians can only see activities related to their tasks
      return matchesSearch && matchesDate && activity.userId === user.id;
    } else if (user?.role === UserRole.ENGINEER) {
      // Engineers can see activities they created or assigned
      return matchesSearch && matchesDate; // Adjust logic as needed
    }

    return matchesSearch && matchesDate;
  });

  const getUserName = (userId: string): string => {
    const userObj = users.find(u => u.id === userId);
    return userObj ? userObj.name : 'Unknown';
  };

  // Update handleExport usage to use the correct parameters
  const handleExportActivities = (format: ExportFormat) => {
    const exportData = filteredActivities.map(activity => ({
      id: activity.id,
      user: getUserName(activity.userId),
      action: activity.action,
      details: activity.details,
      timestamp: new Date(activity.timestamp).toLocaleString(),
      task: activity.taskId || 'N/A',
      train: activity.trainId || 'N/A',
      car: activity.carId || 'N/A'
    }));

    handleExport(format, exportData, 'Activities_Report');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activities</h1>
          <p className="text-muted-foreground">
            Track and monitor all activities within the depot
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="max-w-[150px]"
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            All activities are listed in the table below.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Train</TableHead>
                <TableHead className="text-right">Car</TableHead>
                <TableHead className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-2">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Export</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleExportActivities('excel')}>
                        <FileType className="mr-2 h-4 w-4" />
                        Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportActivities('pdf')}>
                        <FileType className="mr-2 h-4 w-4" />
                        PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.id}</TableCell>
                    <TableCell>{getUserName(activity.userId)}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.details}</TableCell>
                    <TableCell>{format(new Date(activity.timestamp), 'MMM dd, yyyy hh:mm a')}</TableCell>
                    <TableCell>{activity.taskId || 'N/A'}</TableCell>
                    <TableCell>{activity.trainId || 'N/A'}</TableCell>
                    <TableCell className="text-right">{activity.carId || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <span className="text-red-500">
                              <X className="mr-2 h-4 w-4" />
                              Delete
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No activities found.
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

export default Activities;
