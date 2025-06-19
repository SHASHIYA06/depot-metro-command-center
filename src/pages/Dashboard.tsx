
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ClickableStatCard } from '@/components/dashboard/ClickableStatCard';
import { TasksChart } from '@/components/dashboard/TasksChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { TrainStatusCard } from '@/components/dashboard/TrainStatusCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { Dashboard3DChart } from '@/components/dashboard/Dashboard3DChart';
import { MetroNewsWidget } from '@/components/dashboard/MetroNewsWidget';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ClipboardList, AlertTriangle, Clock, CheckCircle, Train, Users, Building, MapPin, Bell, Calendar, Wrench } from 'lucide-react';
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
import { fetchMetroNews } from '@/lib/metroNewsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRole, Task, Project } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { getJobCards, getJobCardStatistics } from '@/lib/mockDataJobCards';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get job cards data for RAMS metrics
  const jobCards = getJobCards();
  const jobCardStats = getJobCardStatistics(jobCards);
  
  // Get metro projects data
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
  
  // Get metro news data
  const { data: metroNews, isLoading: newsLoading } = useQuery({
    queryKey: ['metroNews'],
    queryFn: fetchMetroNews,
  });
  
  // Filter tasks based on user role
  const relevantTasks = user?.role === UserRole.DEPOT_INCHARGE 
    ? tasks.filter(t => t.status !== 'completed').slice(0, 5) as Task[]
    : tasks.filter(t => t.assignedTo === user?.id && t.status !== 'completed') as Task[];

  const handleStatCardClick = (metricType: string, filterValue?: string) => {
    if (user?.role === UserRole.DEPOT_INCHARGE) {
      setSelectedMetric(metricType);
    } else {
      // For non-depot incharge, navigate to specific pages with filters
      switch (metricType) {
        case 'job-cards':
          navigate('/job-cards');
          break;
        case 'maintenance-types':
          navigate('/job-cards?filter=maintenanceType&value=' + (filterValue || 'CM'));
          break;
        case 'service-failures':
          navigate('/job-cards?filter=serviceFailure&value=true');
          break;
        case 'issues':
          navigate('/issues');
          break;
        default:
          navigate('/issues');
      }
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
      case 'job-cards':
        return jobCards;
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

  const handleViewCommissioningClick = () => {
    navigate('/train-commissioning');
  };

  const handleViewActivitiesClick = () => {
    navigate('/activities');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  // Get top 3 ongoing metro projects
  const ongoingProjects = projects
    ? projects
        .filter(project => project.status === 'Under Construction' || project.completionPercentage !== 100)
        .slice(0, 3)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of depot operations.
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={handleNotificationClick}>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" onClick={handleViewActivitiesClick}>
            <Calendar className="h-4 w-4 mr-2" />
            Daily Activities
          </Button>
        </div>
      </div>

      {/* Notification Center */}
      {showNotifications && (
        <div className="mb-6">
          <NotificationCenter />
        </div>
      )}

      {/* Job Card RAMS Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ClickableStatCard
          title="Total Job Cards"
          value={jobCardStats.totalCards.toString()}
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
          description={`${jobCardStats.closedCards} closed, ${jobCardStats.openCards + jobCardStats.inProgressCards} active`}
          onClick={() => handleStatCardClick('job-cards')}
          link="/job-cards"
        />
        
        <ClickableStatCard
          title="Maintenance Types"
          value={`${jobCardStats.cmCards} CM`}
          icon={<Wrench className="h-5 w-5 text-metro-warning" />}
          description={`${jobCardStats.pmCards} PM, ${jobCardStats.opmCards} OPM`}
          onClick={() => handleStatCardClick('maintenance-types', 'CM')}
          link="/job-cards"
          linkParams={{ filter: 'maintenanceType' }}
        />
        
        <ClickableStatCard
          title="Service Failures"
          value={jobCardStats.serviceFailures.toString()}
          icon={<AlertTriangle className="h-5 w-5 text-metro-danger" />}
          description={`${jobCardStats.withWithdraw} withdrawals, ${jobCardStats.withDelay} delays`}
          onClick={() => handleStatCardClick('service-failures')}
          link="/job-cards"
          linkParams={{ filter: 'serviceFailure', value: 'true' }}
        />
        
        <ClickableStatCard
          title="MTTR"
          value={`${jobCardStats.mttr.toFixed(1)} hrs`}
          icon={<Clock className="h-5 w-5 text-metro-info" />}
          description={`MDBF: ${Math.round(jobCardStats.mdbf)} km`}
          onClick={() => handleStatCardClick('rams-metrics')}
          link="/fracas-report"
        />
      </div>

      {/* Original Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ClickableStatCard
          title="Total Tasks"
          value={dashboardStats.totalTasks.toString()}
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
          description={`${dashboardStats.completedTasks} completed`}
          onClick={() => handleStatCardClick('total-tasks')}
          link="/tasks"
        />
        
        <ClickableStatCard
          title="Pending Tasks"
          value={dashboardStats.pendingTasks.toString()}
          icon={<Clock className="h-5 w-5 text-metro-warning" />}
          change={{ value: 5, type: 'decrease' }}
          onClick={() => handleStatCardClick('pending-tasks')}
          link="/tasks"
          linkParams={{ filter: 'status', value: 'pending' }}
        />
        
        <ClickableStatCard
          title="Active Trains"
          value={`${dashboardStats.activeTrains}/${trains.length}`}
          icon={<Train className="h-5 w-5 text-metro-info" />}
          onClick={() => handleStatCardClick('active-trains')}
          link="/train-location"
        />
        
        <ClickableStatCard
          title="Open Issues"
          value={(dashboardStats.issuesByPriority.high + dashboardStats.issuesByPriority.critical).toString()}
          icon={<AlertTriangle className="h-5 w-5 text-metro-danger" />}
          description="High + Critical priority"
          onClick={() => handleStatCardClick('open-issues')}
          link="/issues"
          linkParams={{ filter: 'priority', value: 'high,critical' }}
        />
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
                {selectedMetric === 'job-cards' && 'All Job Cards'}
              </CardTitle>
              <CardDescription>
                {selectedMetric === 'total-tasks' && 'All scheduled and ongoing tasks'}
                {selectedMetric === 'pending-tasks' && 'Tasks that require attention'}
                {selectedMetric === 'active-trains' && 'Trains currently in operation'}
                {selectedMetric === 'open-issues' && 'Critical and high priority issues'}
                {selectedMetric === 'job-cards' && 'Complete job card listing with details'}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setSelectedMetric(null)}>Close</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getMetricDetailData().map((item, index) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2 hover:bg-gray-50 rounded px-2">
                  <div>
                    <p className="font-medium">{item.title || item.name || item.jcNo}</p>
                    <p className="text-sm text-muted-foreground">
                      {'status' in item ? `Status: ${(item.status as string).replace('_', ' ')}` : ''}
                      {'severity' in item ? ` • Priority: ${item.severity}` : ''}
                      {'dueDate' in item ? ` • Due: ${new Date(item.dueDate).toLocaleDateString()}` : ''}
                      {'trainNo' in item ? ` • Train: ${item.trainNo}` : ''}
                      {'maintenanceType' in item ? ` • Type: ${item.maintenanceType}` : ''}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {'assignedTo' in item && item.assignedTo ? `Assigned to: ${item.assignedTo}` : ''}
                    {'issuedTo' in item && item.issuedTo ? `Issued to: ${item.issuedTo}` : ''}
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1" 
                  variant="outline" 
                  onClick={() => {
                    switch (selectedMetric) {
                      case 'job-cards':
                        navigate('/job-cards');
                        break;
                      case 'total-tasks':
                      case 'pending-tasks':
                        navigate('/tasks');
                        break;
                      case 'active-trains':
                        navigate('/train-location');
                        break;
                      default:
                        navigate('/issues');
                    }
                  }}
                >
                  View All Details
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => {
                    if (selectedMetric === 'job-cards') {
                      navigate('/job-cards/create');
                    } else {
                      navigate('/tasks/create');
                    }
                  }}
                >
                  Create New
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rest of dashboard components */}
      {!selectedMetric && (
        <>
          {/* 3D Chart */}
          <Dashboard3DChart />
          
          {/* Metro News Widget */}
          {metroNews && metroNews.length > 0 && (
            <MetroNewsWidget news={metroNews} isLoading={newsLoading} />
          )}
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TasksChart />
            <RecentActivities activities={activityLogs.slice(0, 5)} />
          </div>

          {/* Train Commissioning Overview */}
          {(user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER) && (
            <Card className="col-span-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Train Commissioning Progress</CardTitle>
                  <CardDescription>Track the commissioning progress of new train sets TS15-TS17</CardDescription>
                </div>
                <Button variant="outline" onClick={handleViewCommissioningClick}>View Commissioning</Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['TS15', 'TS16', 'TS17'].map((trainSet, index) => (
                    <Card key={trainSet} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewCommissioningClick}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Train Set {trainSet}</CardTitle>
                        <CardDescription className="flex items-center">
                          {index === 0 ? '85% complete' : index === 1 ? '40% complete' : '10% complete'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: index === 0 ? '85%' : index === 1 ? '40%' : '10%' }} 
                            />
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {index === 0 
                            ? 'Ongoing dynamic tests, 22 activities completed' 
                            : index === 1 
                              ? 'System checks in progress, 12 activities completed' 
                              : 'Initial inspections started, 3 activities completed'}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={handleViewCommissioningClick}
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

          {/* Metro Projects Overview */}
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
                    <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/projects')}>
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
