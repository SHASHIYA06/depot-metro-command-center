
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  users, 
  getIssuesByStatus, 
  workCategories, 
  getIssuesByAssignee, 
  getIssuesBySeverity,
  generateEfficiencyData,
  getUserWorkingHours,
  attendanceRecords
} from '@/lib/mockData';
import { UserRole } from '@/types';
import { 
  ActivitySquare, 
  BarChart2, 
  Clock, 
  UserCheck, 
  Users,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, subDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Analytics = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEngineer, setSelectedEngineer] = useState<string | null>(null);
  
  const isDepotIncharge = user?.role === UserRole.DEPOT_INCHARGE;
  
  // Count issues by status
  const openIssues = getIssuesByStatus('open').length;
  const inProgressIssues = getIssuesByStatus('in_progress').length;
  const resolvedIssues = getIssuesByStatus('resolved').length;
  
  // Count issues by severity
  const lowSeverity = getIssuesBySeverity('low').length;
  const mediumSeverity = getIssuesBySeverity('medium').length;
  const highSeverity = getIssuesBySeverity('high').length;
  const criticalSeverity = getIssuesBySeverity('critical').length;
  
  // Staff data
  const engineers = users.filter(u => u.role === UserRole.ENGINEER).length;
  const technicians = users.filter(u => u.role === UserRole.TECHNICIAN).length;
  
  // Issue data by category
  const issuesByCategory = workCategories.map(category => {
    const count = getIssuesByStatus('open')
      .concat(getIssuesByStatus('in_progress'))
      .filter(issue => issue.workCategory === category.id).length;
    
    return {
      name: category.name,
      value: count
    };
  }).filter(item => item.value > 0);
  
  // Efficiency data
  const efficiencyData = generateEfficiencyData();
  
  // Format for all Pie Charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  // Attendance data
  const getAttendanceData = () => {
    const lastFiveDays = Array.from({ length: 5 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, 'yyyy-MM-dd');
    });
    
    const data = lastFiveDays.map(dateStr => {
      const dayRecords = attendanceRecords.filter(record => 
        format(parseISO(record.date), 'yyyy-MM-dd') === dateStr
      );
      
      const present = dayRecords.filter(r => r.status === 'present').length;
      const late = dayRecords.filter(r => r.status === 'late').length;
      const absent = dayRecords.filter(r => r.status === 'absent').length;
      const halfDay = dayRecords.filter(r => r.status === 'half-day').length;
      
      return {
        date: format(new Date(dateStr), 'dd MMM'),
        present,
        late,
        absent,
        'half-day': halfDay,
        total: present + late + absent + halfDay
      };
    });
    
    return data.reverse(); // Show earliest date first
  };
  
  // Working hours data for engineers
  const getEngineerHoursData = () => {
    return users
      .filter(u => u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN)
      .map(u => {
        const hours = getUserWorkingHours(u.id);
        return {
          name: u.name,
          hours: hours,
          average: hours // Use the hours value directly
        };
      })
      .sort((a, b) => b.hours - a.hours); // Sort by most hours
  };
  
  // Individual engineer performance data
  const getEngineerPerformance = (userId?: string) => {
    if (!userId) return [];
    
    // Create data for last 7 days
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateString = format(date, 'dd MMM');
      
      // Random values for demo purposes - in a real app, this would use actual data
      data.push({
        date: dateString,
        assigned: Math.floor(Math.random() * 5) + 1,
        completed: Math.floor(Math.random() * 3) + 1,
        inProgress: Math.floor(Math.random() * 2),
        efficiency: Math.floor(Math.random() * 30) + 70 // 70-100%
      });
    }
    
    return data;
  };
  
  const engineerOptions = users
    .filter(u => u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN)
    .map(u => ({
      value: u.id,
      label: `${u.name} (${u.role === UserRole.ENGINEER ? 'Engineer' : 'Technician'})`
    }));
  
  // Metrics for current user if they're an engineer
  const userMetrics = !isDepotIncharge && user ? {
    assigned: getIssuesByAssignee(user.id).length,
    completed: getIssuesByAssignee(user.id).filter(i => i.status === 'resolved').length,
    inProgress: getIssuesByAssignee(user.id).filter(i => i.status === 'in_progress').length,
    efficiency: efficiencyData.find(d => d.name === user.name)?.efficiency || 0
  } : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          {isDepotIncharge 
            ? 'Performance metrics and operational analytics' 
            : 'Your performance metrics and statistics'}
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden md:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <ActivitySquare className="h-4 w-4" />
            <span className="hidden md:inline">Activities</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            <span className="hidden md:inline">Attendance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Issue Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Open', value: openIssues },
                        { name: 'In Progress', value: inProgressIssues },
                        { name: 'Resolved', value: resolvedIssues }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Open', value: openIssues },
                        { name: 'In Progress', value: inProgressIssues },
                        { name: 'Resolved', value: resolvedIssues }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Issue Severity</CardTitle>
              </CardHeader>
              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Low', value: lowSeverity },
                        { name: 'Medium', value: mediumSeverity },
                        { name: 'High', value: highSeverity },
                        { name: 'Critical', value: criticalSeverity }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Low', value: lowSeverity },
                        { name: 'Medium', value: mediumSeverity },
                        { name: 'High', value: highSeverity },
                        { name: 'Critical', value: criticalSeverity }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Work Categories</CardTitle>
              </CardHeader>
              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issuesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issuesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Staff Overview */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Staff Composition</CardTitle>
              <CardDescription>Distribution of staff roles in the depot</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Depot Incharge', count: 1 },
                    { name: 'Engineers', count: engineers },
                    { name: 'Technicians', count: technicians },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Number of Staff" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="staff" className="space-y-4">
          {isDepotIncharge ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Staff Efficiency</CardTitle>
                  <CardDescription>Performance metrics for engineers and technicians</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={efficiencyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="assignedTasks" fill="#8884d8" name="Assigned" />
                      <Bar yAxisId="left" dataKey="completedTasks" fill="#82ca9d" name="Completed" />
                      <Bar yAxisId="left" dataKey="resolvedIssues" fill="#ffc658" name="Resolved Issues" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Staff Working Hours</CardTitle>
                      <CardDescription>Hours logged by staff members</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getEngineerHoursData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" fill="#8884d8" name="Total Hours" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Individual Performance</CardTitle>
                      <CardDescription>Detailed view of staff member performance</CardDescription>
                    </div>
                    <Select 
                      value={selectedEngineer || ''}
                      onValueChange={setSelectedEngineer}
                    >
                      <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                      <SelectContent>
                        {engineerOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="h-80">
                  {selectedEngineer ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getEngineerPerformance(selectedEngineer)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="assigned" stroke="#8884d8" name="Assigned" />
                        <Line yAxisId="left" type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                        <Line yAxisId="left" type="monotone" dataKey="inProgress" stroke="#ffc658" name="In Progress" />
                        <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#ff7300" name="Efficiency %" />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">Select a staff member to view their performance</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            // Engineer/Technician view
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userMetrics && (
                  <>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <ActivitySquare className="h-4 w-4 text-primary" />
                            Assigned Tasks
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.assigned}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Total tasks assigned to you
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <CheckSquare className="h-4 w-4 text-green-500" />
                            Completed
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.completed}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tasks successfully completed
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            In Progress
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.inProgress}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tasks currently in progress
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-orange-500" />
                            Efficiency
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{userMetrics.efficiency}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Your task completion rate
                        </p>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
              
              {/* Individual performance chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Performance</CardTitle>
                  <CardDescription>Task assignment and completion over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getEngineerPerformance(user?.id)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="assigned" stroke="#8884d8" name="Assigned" />
                      <Line yAxisId="left" type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
                      <Line yAxisId="left" type="monotone" dataKey="inProgress" stroke="#ffc658" name="In Progress" />
                      <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#ff7300" name="Efficiency %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activities by Category</CardTitle>
              <CardDescription>Distribution of work activities by category</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={issuesByCategory}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Number of Activities" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Activities by Status</CardTitle>
                <CardDescription>Current status of all activities</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Open', value: openIssues },
                        { name: 'In Progress', value: inProgressIssues },
                        { name: 'Resolved', value: resolvedIssues }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Open', value: openIssues },
                        { name: 'In Progress', value: inProgressIssues },
                        { name: 'Resolved', value: resolvedIssues }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
                <CardTitle>Activities by Severity</CardTitle>
                <CardDescription>Priority of open and in-progress activities</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Low', value: lowSeverity },
                        { name: 'Medium', value: mediumSeverity },
                        { name: 'High', value: highSeverity },
                        { name: 'Critical', value: criticalSeverity }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Low', value: lowSeverity },
                        { name: 'Medium', value: mediumSeverity },
                        { name: 'High', value: highSeverity },
                        { name: 'Critical', value: criticalSeverity }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Staff attendance for the last 5 days</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getAttendanceData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" stackId="a" fill="#82ca9d" name="Present" />
                  <Bar dataKey="late" stackId="a" fill="#ffc658" name="Late" />
                  <Bar dataKey="half-day" stackId="a" fill="#8884d8" name="Half Day" />
                  <Bar dataKey="absent" stackId="a" fill="#ff8042" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance By Staff Category</CardTitle>
              <CardDescription>Comparing attendance between engineers and technicians</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: "Engineers",
                      present: Math.floor(engineers * 0.8),
                      late: Math.floor(engineers * 0.1),
                      absent: Math.floor(engineers * 0.1)
                    },
                    {
                      name: "Technicians",
                      present: Math.floor(technicians * 0.7),
                      late: Math.floor(technicians * 0.15),
                      absent: Math.floor(technicians * 0.15)
                    }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="present" fill="#82ca9d" name="Present" />
                  <Bar dataKey="late" fill="#ffc658" name="Late" />
                  <Bar dataKey="absent" fill="#ff8042" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

// The CheckSquare component was missing from the imports
function CheckSquare(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
