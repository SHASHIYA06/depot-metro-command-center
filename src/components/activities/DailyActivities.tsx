
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ActivityLog, ExportFormat } from '@/types';
import { activityLogs, users, getUserById } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DailyActivities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    setActivities(activityLogs);
  }, []);

  useEffect(() => {
    let results = activityLogs.filter(activity => {
      const matchesSearch =
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    results = results.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredActivities(results);
  }, [searchTerm, sortOrder]);

  const getUserName = (userId: string): string => {
    const user = getUserById(userId);
    return user ? user.name : 'Unknown';
  };

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order);
  };

  const handleExport = (format: ExportFormat) => {
    const exportData = activities.map(activity => ({
      id: activity.id,
      user: getUserName(activity.userId),
      action: activity.action,
      details: activity.details,
      timestamp: new Date(activity.timestamp).toLocaleString(),
      task: activity.taskId || 'N/A',
      train: activity.trainId || 'N/A',
      car: activity.carId || 'N/A'
    }));

    const columnNames = ['id', 'user', 'action', 'details', 'timestamp', 'task', 'train', 'car'];
    
    if (format === 'excel') {
      exportToExcel(exportData, 'Activities_Report');
    } else if (format === 'pdf') {
      exportToPDF(exportData, 'Activities_Report', 'Activity Logs', columnNames);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daily Activities</h1>
          <p className="text-muted-foreground">
            Track and monitor all activities performed by the depot staff
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
          <Select onValueChange={handleSortOrderChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Oldest First</SelectItem>
              <SelectItem value="desc">Newest First</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            Export to Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            Export to PDF
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{activity.action}</h3>
                      <p className="text-muted-foreground">{activity.details}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium">User</div>
                        <div className="text-sm text-muted-foreground">
                          {getUserName(activity.userId)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium">Timestamp</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium">Task</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.taskId || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium">Train</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.trainId || 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-sm font-medium">Car</div>
                        <div className="text-sm text-muted-foreground">
                          {activity.carId || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <h3 className="text-lg font-medium">No activities found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try using different keywords or filters' : 'No activities have been logged yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyActivities;
