
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { TasksChart } from '@/components/dashboard/TasksChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { TrainStatusCard } from '@/components/dashboard/TrainStatusCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { Dashboard3DChart } from '@/components/dashboard/Dashboard3DChart';
import { ClipboardList, AlertTriangle, Clock, CheckCircle, Train, Users, Building, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  dashboardStats, 
  trains, 
  tasks, 
  activityLogs, 
  getTasksByStatus,
  getIssuesByStatus,
  getIssuesBySeverity,
  getProjects
} from '@/lib/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole, Task, Project } from '@/types';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  
  // Get metro projects data
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
  
  // Filter tasks based on user role
  const relevantTasks = user?.role === UserRole.DEPOT_INCHARGE 
    ? tasks.filter(t => t.status !== 'completed').slice(0, 5) as Task[]
    : tasks.filter(t => t.assignedTo === user?.id && t.status !== 'completed') as Task[];

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

  const handleViewProjectsClick = () => {
    navigate('/projects');
  };

  // Get top 3 ongoing metro projects
  const ongoingProjects = projects
    ? projects
        .filter(project => project.status === 'Under Construction' || project.completionPercentage !== 100)
        .slice(0, 3)
    : [];

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

          {/* Metro Projects Overview (new section) */}
          {(user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER) && (
            <Card className="col-span-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Metro Project Review</CardTitle>
                  <CardDescription>Latest updates from metro projects across India</CardDescription>
                </div>
                <Button variant="outline" onClick={handleViewProjectsClick}>View All Projects</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ongoingProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {project.description}
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Length: {project.networkLength} km</span>
                          <span>Stations: {project.stations || 'N/A'}</span>
                        </div>
                        {project.completionPercentage && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Completion:</span>
                              <span>{project.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${project.completionPercentage}%` }} 
                              />
                            </div>
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => navigate(`/projects`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
