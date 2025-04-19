
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
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { AttendanceRecord, User as UserType, UserRole, ExportFormat } from '@/types';
import { users, attendanceRecords } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

const StaffAttendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    // Load attendance records from mockData
    setAttendance(attendanceRecords);
  }, []);

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown';
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
      date: new Date(record.date).toLocaleDateString(),
      checkIn: record.checkIn || record.loginTime,
      checkOut: record.checkOut || record.logoutTime || '-',
      status: record.status,
      workHours: record.workHours.toFixed(2),
      remarks: record.remarks || record.notes || '-'
    }));

    if (format === 'excel') {
      exportToExcel(exportData, 'Attendance_Report');
    } else if (format === 'pdf') {
      exportToPDF(exportData, 'Attendance_Report', 'Staff Attendance Report');
    }
  };

  return (
    <div className="space-y-6">
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
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={format(date || new Date(), 'PPP')}
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
                    <div className="text-sm text-muted-foreground">
                      Status: {record.status}
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
    </div>
  );
};

export default StaffAttendance;
