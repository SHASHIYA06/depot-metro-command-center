
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { 
  getIssuesByStatus, 
  getIssuesBySeverity, 
  getIssuesByAssignee,
  users 
} from '@/lib/mockData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '../dashboard/StatCard';
import { UserRole } from '@/types';

export const IssueStats: React.FC = () => {
  const { user } = useAuth();

  // Get issue counts by status
  const openIssues = getIssuesByStatus('open');
  const inProgressIssues = getIssuesByStatus('in_progress');
  const resolvedIssues = getIssuesByStatus('resolved');

  // Get issue counts by severity
  const lowIssues = getIssuesBySeverity('low');
  const mediumIssues = getIssuesBySeverity('medium');
  const highIssues = getIssuesBySeverity('high');
  const criticalIssues = getIssuesBySeverity('critical');

  // User-specific stats
  const userAssignedIssues = user?.id 
    ? getIssuesByAssignee(user.id) 
    : [];
  
  // Staff performance data (for depot incharge)
  const staffData = users
    .filter(u => u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN)
    .map(staff => {
      const assignedIssues = getIssuesByAssignee(staff.id);
      const completedIssues = assignedIssues.filter(issue => issue.status === 'resolved');
      return {
        name: staff.name.split(' ')[0],
        assigned: assignedIssues.length,
        completed: completedIssues.length,
      };
    })
    .filter(staff => staff.assigned > 0)
    .sort((a, b) => b.completed - a.completed);

  const totalIssues = openIssues.length + inProgressIssues.length + resolvedIssues.length;
  const completionRate = totalIssues ? Math.round((resolvedIssues.length / totalIssues) * 100) : 0;

  const statusData = [
    { name: 'Open', value: openIssues.length, color: '#94a3b8' },
    { name: 'In Progress', value: inProgressIssues.length, color: '#60a5fa' },
    { name: 'Resolved', value: resolvedIssues.length, color: '#4ade80' },
  ];

  const severityData = [
    { name: 'Low', value: lowIssues.length, color: '#93c5fd' },
    { name: 'Medium', value: mediumIssues.length, color: '#fcd34d' },
    { name: 'High', value: highIssues.length, color: '#fb923c' },
    { name: 'Critical', value: criticalIssues.length, color: '#f87171' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Activities"
          value={totalIssues.toString()}
          icon={<AlertCircle className="h-5 w-5 text-primary" />}
          description={`${completionRate}% completion rate`}
        />
        <StatCard
          title="Open"
          value={openIssues.length.toString()}
          icon={<AlertCircle className="h-5 w-5 text-metro-warning" />}
          description="Awaiting assignment"
        />
        <StatCard
          title="In Progress"
          value={inProgressIssues.length.toString()}
          icon={<Clock className="h-5 w-5 text-metro-info" />}
          description="Currently being worked on"
        />
        <StatCard
          title="Resolved"
          value={resolvedIssues.length.toString()}
          icon={<CheckCircle className="h-5 w-5 text-metro-success" />}
          description="Successfully completed"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Activities by Status</CardTitle>
            <CardDescription>Distribution of work activities by current status</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activities by Priority</CardTitle>
            <CardDescription>Distribution of work activities by priority level</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Staff Performance Chart (Depot Incharge Only) */}
      {user?.role === UserRole.DEPOT_INCHARGE && staffData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Activities assigned vs. completed by staff</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={staffData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="assigned" fill="#94a3b8" name="Assigned" />
                <Bar dataKey="completed" fill="#4ade80" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Personal Performance (Engineers and Technicians Only) */}
      {(user?.role === UserRole.ENGINEER || user?.role === UserRole.TECHNICIAN) && (
        <Card>
          <CardHeader>
            <CardTitle>Your Performance</CardTitle>
            <CardDescription>Your assigned work activities and completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-md bg-muted/10">
                <h3 className="text-lg font-medium">Assigned</h3>
                <p className="text-3xl font-bold mt-2">{userAssignedIssues.length}</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md bg-muted/10">
                <h3 className="text-lg font-medium">Completed</h3>
                <p className="text-3xl font-bold mt-2">
                  {userAssignedIssues.filter(i => i.status === 'resolved').length}
                </p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-md bg-muted/10">
                <h3 className="text-lg font-medium">Completion Rate</h3>
                <p className="text-3xl font-bold mt-2">
                  {userAssignedIssues.length ? 
                    Math.round((userAssignedIssues.filter(i => i.status === 'resolved').length / userAssignedIssues.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
