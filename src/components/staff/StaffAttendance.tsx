import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Calendar as CalendarIcon,
  Download,
  User,
  Clock,
  Phone,
  Mail,
  BarChart2,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { AttendanceRecord, User as UserType, UserRole, ExportFormat } from '@/types';
import { users, attendanceRecords } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const StaffAttendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [activeTab, setActiveTab] = useState('records');

  useEffect(() => {
    setAttendance(attendanceRecords);
  }, []);

  const getUserName = (userId: string): string => {
    const staffMember = users.find(u => u.id === userId);
    return staffMember ? staffMember.name : 'Unknown';
  };

  const getUserDepartment = (userId: string): string => {
    const staffMember = users.find(u => u.id === userId);
    return staffMember?.department || 'N/A';
  };

  const getUserRole = (userId: string): UserRole | undefined => {
    const staffMember = users.find(u => u.id === userId);
    return staffMember?.role;
  };

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = getUserName(record.userId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = date ? format(date, 'yyyy-MM-dd') === record.date : true;
    const matchesStatus = selectedStatus === 'all' ? true : record.status === selectedStatus;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const handleExport = (format: ExportFormat) => {
    const exportData = filteredAttendance.map(record => ({
      id: record.id,
      user: getUserName(record.userId),
      department: getUserDepartment(record.userId),
      role: getUserRole(record.userId),
      date: new Date(record.date).toLocaleDateString(),
      checkIn: record.checkIn || record.loginTime,
      checkOut: record.checkOut || record.logoutTime || '-',
      status: record.status,
      workHours: record.workHours.toFixed(2),
      remarks: record.remarks || record.notes || '-'
    }));

    if (format === 'excel') {
      exportToExcel(exportData, 'Attendance_Report');
      toast({
        title: "Export Successful",
        description: "Attendance data has been exported to Excel format.",
      });
    } else if (format === 'pdf') {
      exportToPDF(exportData, 'Attendance_Report', 'Staff Attendance Report');
      toast({
        title: "Export Successful",
        description: "Attendance data has been exported to PDF format.",
      });
    }
  };

  const calculateStatusStats = () => {
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    const todayRecords = attendance.filter(record => record.date === todayStr);
    
    const present = todayRecords.filter(record => record.status === 'present').length;
    const late = todayRecords.filter(record => record.status === 'late').length;
    const absent = todayRecords.filter(record => record.status === 'absent').length;
    const halfDay = todayRecords.filter(record => record.status === 'half-day').length;
    
    return [
      { name: 'Present', value: present },
      { name: 'Late', value: late },
      { name: 'Absent', value: absent },
      { name: 'Half-day', value: halfDay },
    ];
  };

  const calculateDepartmentStats = () => {
    const departments: Record<string, string[]> = {};
    users.forEach(staffMember => {
      const dept = staffMember.department || 'Other';
      if (!departments[dept]) {
        departments[dept] = [];
      }
      departments[dept].push(staffMember.id);
    });
    
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    
    return Object.entries(departments).map(([department, userIds]) => {
      const total = userIds.length;
      const present = attendance.filter(
        record => record.date === todayStr && 
                  userIds.includes(record.userId) && 
                  (record.status === 'present' || record.status === 'late')
      ).length;
      
      return {
        name: department,
        present,
        absent: total - present,
        total
      };
    });
  };

  const statusStats = calculateStatusStats();
  const departmentStats = calculateDepartmentStats();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="stats">Attendance Stats</TabsTrigger>
          <TabsTrigger value="trends">Attendance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Staff Attendance</h1>
              <p className="text-muted-foreground">
                Track and manage staff attendance records
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={date ? format(date, 'PPP') : "Select date"}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{date ? format(date, 'PPP') : 'Pick a date'}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="half-day">Half-day</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleExport('excel')}>
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4" />
                Export to PDF
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAttendance.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAttendance.map((record) => (
                  <Card key={record.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <div className="text-lg font-semibold">{getUserName(record.userId)}</div>
                        <div className="text-sm text-muted-foreground">
                          <User className="mr-2 inline-block h-4 w-4" />
                          {getUserDepartment(record.userId)} • {getUserRole(record.userId)?.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <CalendarIcon className="mr-2 inline-block h-4 w-4" />
                          {record.date}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="mr-2 inline-block h-4 w-4" />
                          Check-in: {record.checkIn || record.loginTime}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <Clock className="mr-2 inline-block h-4 w-4" />
                          Check-out: {record.checkOut || record.logoutTime || '-'}
                        </div>
                        <div className="text-sm">
                          Status: 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            record.status === 'absent' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Work Hours: {record.workHours.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Remarks: {record.remarks || record.notes || '-'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <h3 className="text-lg font-medium">No attendance records found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm ? 'Try using different keywords or filters' : 'No attendance records have been created yet'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance Status</CardTitle>
                <CardDescription>Overview of staff attendance for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4f46e5" name="Staff Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department-wise Attendance</CardTitle>
                <CardDescription>Attendance distribution by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" stackId="a" fill="#22c55e" name="Present" />
                      <Bar dataKey="absent" stackId="a" fill="#ef4444" name="Absent" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Attendance Report Summary</CardTitle>
                <CardDescription>Key statistics for attendance monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <User className="h-8 w-8 text-primary" />
                        <p className="text-xl font-bold">{users.length}</p>
                        <p className="text-sm text-muted-foreground">Total Staff</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <BarChart2 className="h-8 w-8 text-green-500" />
                        <p className="text-xl font-bold">{statusStats[0].value}</p>
                        <p className="text-sm text-muted-foreground">Present Today</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Clock className="h-8 w-8 text-yellow-500" />
                        <p className="text-xl font-bold">{statusStats[1].value}</p>
                        <p className="text-sm text-muted-foreground">Late Today</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <FileText className="h-8 w-8 text-red-500" />
                        <p className="text-xl font-bold">{statusStats[2].value}</p>
                        <p className="text-sm text-muted-foreground">Absent Today</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends Over Time</CardTitle>
              <CardDescription>Analyze staff attendance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <Button variant="outline" onClick={() => handleExport('excel')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export Trend Data
                  </Button>
                </div>

                <div className="h-[400px]">
                  <p className="text-center text-muted-foreground py-10">
                    Select a date range to view attendance trends over time.
                    <br />
                    Data will update based on the selected time period.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffAttendance;
