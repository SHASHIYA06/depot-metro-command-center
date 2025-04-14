
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
  BarChart
} from 'lucide-react';
import { format, subDays, subHours } from 'date-fns';
import { ActivityLog, UserRole } from '@/types';
import { users, trains } from '@/lib/mockData';
import { RecentActivities } from '@/components/dashboard/RecentActivities';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const isDepotIncharge = user?.role === UserRole.DEPOT_INCHARGE;

  // Filter activities based on active tab and search term
  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getUserName(activity.userId).toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'tasks') {
      return matchesSearch && activity.taskId !== undefined;
    } else if (activeTab === 'issues') {
      return matchesSearch && (activity.action === 'Issue Reported' || activity.action === 'Issue Resolved');
    } else if (activeTab === 'maintenance') {
      return matchesSearch && (activity.action === 'Maintenance Scheduled' || activity.action === 'Maintenance Completed');
    } else if (activeTab === 'user') {
      return matchesSearch && activity.userId === user?.id;
    } else if (activeTab === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">
            Track all activities happening in the depot
          </p>
        </div>
        
        {isDepotIncharge && (
          <Button>
            <BarChart className="mr-2 h-4 w-4" />
            Activity Reports
          </Button>
        )}
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
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="user">Your Activities</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
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
                  
                  <Button variant="ghost" size="sm" className="md:self-start">
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
    </div>
  );
};

export default Activities;
