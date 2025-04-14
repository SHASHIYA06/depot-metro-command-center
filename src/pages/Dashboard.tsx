
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { TasksChart } from '@/components/dashboard/TasksChart';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
import { TrainStatusCard } from '@/components/dashboard/TrainStatusCard';
import { TaskList } from '@/components/dashboard/TaskList';
import { PriorityChart } from '@/components/dashboard/PriorityChart';
import { ClipboardList, AlertTriangle, Clock, CheckCircle, Train, Users } from 'lucide-react';
import { 
  dashboardStats, 
  trains, 
  tasks, 
  activityLogs, 
  getTasksByStatus 
} from '@/lib/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Filter tasks based on user role
  const relevantTasks = user?.role === 'depot_incharge' 
    ? tasks.filter(t => t.status !== 'completed').slice(0, 5)
    : tasks.filter(t => t.assignedTo === user?.id && t.status !== 'completed');

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
        <StatCard
          title="Total Tasks"
          value={dashboardStats.totalTasks}
          icon={<ClipboardList className="h-5 w-5 text-primary" />}
          description={`${dashboardStats.completedTasks} completed`}
        />
        <StatCard
          title="Pending Tasks"
          value={dashboardStats.pendingTasks}
          icon={<Clock className="h-5 w-5 text-metro-warning" />}
          change={{ value: 5, type: 'decrease' }}
        />
        <StatCard
          title="Active Trains"
          value={`${dashboardStats.activeTrains}/${trains.length}`}
          icon={<Train className="h-5 w-5 text-metro-info" />}
        />
        <StatCard
          title="Open Issues"
          value={dashboardStats.issuesByPriority.high + dashboardStats.issuesByPriority.critical}
          icon={<AlertTriangle className="h-5 w-5 text-metro-danger" />}
          description="High + Critical priority"
        />
      </div>

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
            title={user?.role === 'depot_incharge' ? "High Priority Tasks" : "Your Tasks"} 
            description={user?.role === 'depot_incharge' ? "Tasks requiring attention" : "Tasks assigned to you"} 
          />
        </div>
        <PriorityChart />
      </div>
    </div>
  );
};

export default Dashboard;
