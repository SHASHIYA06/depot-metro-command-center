
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { TasksChart } from '@/components/dashboard/TasksChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { TrainStatusCard } from '@/components/dashboard/TrainStatusCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { Dashboard3DChart } from '@/components/dashboard/Dashboard3DChart';
import { ClipboardList, AlertTriangle, Clock, CheckCircle, Train, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  dashboardStats, 
  trains, 
  tasks, 
  activityLogs, 
  getTasksByStatus,
  getIssuesByStatus,
  getIssuesBySeverity
} from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole, Task } from '@/types';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  
  // Filter tasks based on user role
  const relevantTasks = user?.role === UserRole.DEPOT_INCHARGE 
    ? tasks.filter(t => t.status !== 'completed').slice(0, 5)
    : tasks.filter(t => t.assignedTo === user?.id && t.status !== 'completed');

  const handleStatCardClick = (metricType: string) => {
    if (user?.role === UserRole.DEPOT_INCHARGE) {
      setSelectedMetric(metricType);
    } else {
      // For non-depot incharge, navigate to issues page
      navigate('/issues');
    }
  };

  // Get data for the selected metric detail view
  const getMetricDetailData = () => {
    switch (selectedMetric) {
      case 'total-tasks':
        return tasks as Task[];
      case 'pending-tasks':
        return tasks.filter(t => t.status === 'pending' || t.status === 'in_progress') as Task[];
      case 'active-trains':
        return trains.filter(t => t.status === 'active');
      case 'open-issues':
        return [
          ...getIssuesBySeverity('high'),
          ...getIssuesBySeverity('critical')
        ];
      default:
        return [];
    }
  };

  const handleViewIssuesClick = () => {
    navigate('/issues');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's an overview of depot operations.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div onClick={() => handleStatCardClick('total-tasks')} className={user?.role === UserRole.DEPOT_INCHARGE ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''}>
          <StatCard
            title="Total Tasks"
            value={dashboardStats.totalTasks}
            icon={<ClipboardList className="h-5 w-5 text-primary" />}
            description={`${dashboardStats.completedTasks} completed`}
          />
        </div>
        
        <div onClick={() => handleStatCardClick('pending-tasks')} className={user?.role === UserRole.DEPOT_INCHARGE ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''}>
          <StatCard
            title="Pending Tasks"
            value={dashboardStats.pendingTasks}
            icon={<Clock className="h-5 w-5 text-metro-warning" />}
            change={{ value: 5, type: 'decrease' }}
          />
        </div>
        
        <div onClick={() => handleStatCardClick('active-trains')} className={user?.role === UserRole.DEPOT_INCHARGE ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''}>
          <StatCard
            title="Active Trains"
            value={`${dashboardStats.activeTrains}/${trains.length}`}
            icon={<Train className="h-5 w-5 text-metro-info" />}
          />
        </div>
        
        <div onClick={() => handleStatCardClick('open-issues')} className={user?.role === UserRole.DEPOT_INCHARGE ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''}>
          <StatCard
            title="Open Issues"
            value={dashboardStats.issuesByPriority.high + dashboardStats.issuesByPriority.critical}
            icon={<AlertTriangle className="h-5 w-5 text-metro-danger" />}
            description="High + Critical priority"
          />
        </div>
      </div>

      {/* Detail View for Selected Metric (only visible for depot incharge) */}
      {selectedMetric && user?.role === UserRole.DEPOT_INCHARGE && (
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                {selectedMetric === 'total-tasks' && 'All Tasks'}
                {selectedMetric === 'pending-tasks' && 'Pending Tasks'}
                {selectedMetric === 'active-trains' && 'Active Trains'}
                {selectedMetric === 'open-issues' && 'High Priority Issues'}
              </CardTitle>
              <CardDescription>
                {selectedMetric === 'total-tasks' && 'All scheduled and ongoing tasks'}
                {selectedMetric === 'pending-tasks' && 'Tasks that require attention'}
                {selectedMetric === 'active-trains' && 'Trains currently in operation'}
                {selectedMetric === 'open-issues' && 'Critical and high priority issues'}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setSelectedMetric(null)}>Close</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getMetricDetailData().map((item, index) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2">
                  <div>
                    <p className="font-medium">{item.title || item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {'status' in item ? `Status: ${(item.status as string).replace('_', ' ')}` : ''}
                      {'severity' in item ? ` • Priority: ${item.severity}` : ''}
                      {'dueDate' in item ? ` • Due: ${new Date(item.dueDate).toLocaleDateString()}` : ''}
                    </p>
                  </div>
                  {'assignedTo' in item && (
                    <div className="text-sm text-muted-foreground">
                      Assigned to: {item.assignedTo ? item.assignedTo : 'Unassigned'}
                    </div>
                  )}
                </div>
              ))}
              <Button 
                className="w-full mt-4" 
                variant="outline" 
                onClick={handleViewIssuesClick}
              >
                View All in Issues
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rest of dashboard components */}
      {!selectedMetric && (
        <>
          {/* 3D Chart */}
          <Dashboard3DChart />
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TasksChart />
            <RecentActivities activities={activityLogs.slice(0, 5)} />
          </div>

          {/* Train Status Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {trains.map(train => (
              <TrainStatusCard key={train.id} train={train} />
            ))}
          </div>

          {/* Tasks and Priority Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <TaskList 
                tasks={relevantTasks} 
                title={user?.role === UserRole.DEPOT_INCHARGE ? "High Priority Tasks" : "Your Tasks"} 
                description={user?.role === UserRole.DEPOT_INCHARGE ? "Tasks requiring attention" : "Tasks assigned to you"} 
              />
            </div>
            <PriorityChart />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
