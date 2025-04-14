
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Printer, Download, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Cell
} from 'recharts';
import { format, subMonths, addMonths } from 'date-fns';
import { attendanceRecords, dailyWorkLogs, issues, users } from '@/lib/mockData';
import { UserRole } from '@/types';

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#5DADE2'];

const Analytics = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const isDepotIncharge = user?.role === UserRole.DEPOT_INCHARGE;
  
  // Calculate previous month and next month
  const prevMonth = subMonths(currentMonth, 1);
  const nextMonth = addMonths(currentMonth, 1);
  
  // Function to handle month navigation
  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(direction === 'prev' ? prevMonth : nextMonth);
  };
  
  // Format current month for display
  const formattedMonth = format(currentMonth, 'MMMM yyyy');
  
  // Prepare data for performance chart (based on issue resolution by assignee)
  const getPerformanceData = () => {
    const engineerStats = users
      .filter(u => u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN)
      .map(engineer => {
        const assignedIssues = issues.filter(issue => issue.assignedTo === engineer.id);
        const completedIssues = assignedIssues.filter(issue => issue.status === 'resolved');
        
        return {
          name: engineer.name,
          assigned: assignedIssues.length,
          completed: completedIssues.length,
          inProgress: assignedIssues.filter(issue => issue.status === 'in_progress').length,
          efficiency: assignedIssues.length > 0 
            ? Math.round((completedIssues.length / assignedIssues.length) * 100) 
            : 0
        };
      });
      
    return engineerStats;
  };
  
  // Data for issue breakdown by category
  const getIssueCategoryData = () => {
    const categoryCounts: Record<string, number> = {};
    
    issues.forEach(issue => {
      if (issue.workCategory) {
        categoryCounts[issue.workCategory] = (categoryCounts[issue.workCategory] || 0) + 1;
      }
    });
    
    return Object.entries(categoryCounts).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1), // Capitalize first letter
      value: count
    }));
  };
  
  // Data for issue status breakdown
  const getIssueStatusData = () => [
    { name: 'Open', value: issues.filter(i => i.status === 'open').length },
    { name: 'In Progress', value: issues.filter(i => i.status === 'in_progress').length },
    { name: 'Resolved', value: issues.filter(i => i.status === 'resolved').length }
  ];
  
  // Data for attendance overview
  const getAttendanceData = () => {
    const statusCounts: Record<string, number> = {
      present: 0,
      late: 0,
      'half-day': 0,
      absent: 0
    };
    
    attendanceRecords.forEach(record => {
      statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
    });
    
    return [
      { name: 'Present', value: statusCounts.present },
      { name: 'Late', value: statusCounts.late },
      { name: 'Half Day', value: statusCounts['half-day'] },
      { name: 'Absent', value: statusCounts.absent }
    ];
  };
  
  // Data for work hours by staff member
  const getWorkHoursData = () => {
    const staffHours: Record<string, number> = {};
    
    dailyWorkLogs.forEach(log => {
      const staffName = users.find(u => u.id === log.userId)?.name || 'Unknown';
      staffHours[staffName] = (staffHours[staffName] || 0) + log.hoursSpent;
    });
    
    return Object.entries(staffHours).map(([name, hours]) => ({
      name,
      hours: Math.round(hours * 10) / 10 // Round to 1 decimal
    }));
  };
  
  // Data for issue severity breakdown
  const getIssueSeverityData = () => [
    { name: 'Low', value: issues.filter(i => i.severity === 'low').length },
    { name: 'Medium', value: issues.filter(i => i.severity === 'medium').length },
    { name: 'High', value: issues.filter(i => i.severity === 'high').length },
    { name: 'Critical', value: issues.filter(i => i.severity === 'critical').length }
  ];
  
  // Generate mock data for monthly trends
  const getMonthlyTrendsData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      months.push({
        name: format(month, 'MMM'),
        issues: Math.floor(Math.random() * 20) + 10,
        resolved: Math.floor(Math.random() * 15) + 5
      });
    }
    return months;
  };
  
  // Format percentage for display
  const formatPercentage = (value: number) => `${value}%`;
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Prepare data for the charts
  const performanceData = getPerformanceData();
  const issueCategoryData = getIssueCategoryData();
  const issueStatusData = getIssueStatusData();
  const attendanceData = getAttendanceData();
  const workHoursData = getWorkHoursData();
  const issueSeverityData = getIssueSeverityData();
  const monthlyTrendsData = getMonthlyTrendsData();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive metrics and insights for depot operations
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleMonthChange('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{formattedMonth}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleMonthChange('next')}
            disabled={nextMonth > new Date()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.length}</div>
              <p className="text-xs text-muted-foreground">+5 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Open Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.filter(i => i.status === 'open').length}</div>
              <p className="text-xs text-muted-foreground">-2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((issues.filter(i => i.status === 'resolved').length / issues.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Staff Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((attendanceData[0].value / (attendanceData[0].value + attendanceData[1].value + attendanceData[2].value + attendanceData[3].value)) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">+2% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Status Distribution</CardTitle>
              <CardDescription>Breakdown of issues by current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issueStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Issue Categories</CardTitle>
              <CardDescription>Distribution of issues by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issueCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Issue creation and resolution over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="issues" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="New Issues"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="#82ca9d" 
                    name="Resolved Issues"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="activities" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Severity Breakdown</CardTitle>
              <CardDescription>Distribution of issues by severity level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={issueSeverityData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {issueSeverityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Active vs. Resolved Issues</CardTitle>
              <CardDescription>Comparison of active and resolved issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Open', value: issues.filter(i => i.status === 'open').length },
                    { name: 'In Progress', value: issues.filter(i => i.status === 'in_progress').length },
                    { name: 'Resolved', value: issues.filter(i => i.status === 'resolved').length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Number of Issues" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Work Category Analysis</CardTitle>
            <CardDescription>Breakdown of work by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issueCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Issues" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="staff" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Comparison of assigned vs. completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="assigned" name="Assigned Tasks" fill="#8884d8" />
                  <Bar dataKey="completed" name="Completed Tasks" fill="#82ca9d" />
                  <Bar dataKey="inProgress" name="In Progress" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Efficiency</CardTitle>
              <CardDescription>Percentage of tasks completed by staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatPercentage} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="efficiency" name="Efficiency %" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Work Hours Distribution</CardTitle>
              <CardDescription>Hours spent by staff on work activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" name="Hours Worked" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Breakdown of staff attendance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="trends" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Issue Resolution Time Trend</CardTitle>
            <CardDescription>Average time to resolve issues over months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Jan', days: 5.2 },
                  { month: 'Feb', days: 4.8 },
                  { month: 'Mar', days: 3.9 },
                  { month: 'Apr', days: 4.2 },
                  { month: 'May', days: 3.5 },
                  { month: 'Jun', days: 3.2 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="days" 
                    stroke="#8884d8" 
                    activeDot={{ r: 8 }} 
                    name="Average Days to Resolve"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Issue Categories Trend</CardTitle>
              <CardDescription>Changes in issue categories over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', mechanical: 8, electrical: 5, structural: 3 },
                    { month: 'Feb', mechanical: 7, electrical: 6, structural: 4 },
                    { month: 'Mar', mechanical: 9, electrical: 7, structural: 2 },
                    { month: 'Apr', mechanical: 6, electrical: 8, structural: 5 },
                    { month: 'May', mechanical: 8, electrical: 9, structural: 3 },
                    { month: 'Jun', mechanical: 7, electrical: 7, structural: 4 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="mechanical" stroke="#8884d8" name="Mechanical" />
                    <Line type="monotone" dataKey="electrical" stroke="#82ca9d" name="Electrical" />
                    <Line type="monotone" dataKey="structural" stroke="#ffc658" name="Structural" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance Trend</CardTitle>
              <CardDescription>Staff efficiency over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', efficiency: 75 },
                    { month: 'Feb', efficiency: 78 },
                    { month: 'Mar', efficiency: 82 },
                    { month: 'Apr', efficiency: 85 },
                    { month: 'May', efficiency: 87 },
                    { month: 'Jun', efficiency: 90 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatPercentage} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="efficiency" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Average Staff Efficiency"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </div>
  );
};

export default Analytics;
