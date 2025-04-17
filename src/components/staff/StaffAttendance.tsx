
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Download, Filter, Search, UserCheck, UserX, FileText } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, subDays, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { users } from '@/lib/mockData';
import { UserRole } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { syncStaffAttendanceToSheets, backupToGoogleCloud } from '@/utils/googleSheetsIntegration';
import { exportToExcel, exportToPDF, formatDataForExport, createPdfColumns } from '@/utils/exportUtils';

// Mock attendance data
const mockAttendance = [
  {
    id: '1',
    userId: '1',
    date: new Date(2025, 3, 14),
    checkIn: '08:45',
    checkOut: '17:30',
    status: 'present',
    remarks: ''
  },
  {
    id: '2',
    userId: '2',
    date: new Date(2025, 3, 14),
    checkIn: '09:15',
    checkOut: '18:00',
    status: 'present',
    remarks: 'Late arrival'
  },
  {
    id: '3',
    userId: '3',
    date: new Date(2025, 3, 14),
    checkIn: '',
    checkOut: '',
    status: 'absent',
    remarks: 'Sick leave'
  },
  {
    id: '4',
    userId: '1',
    date: new Date(2025, 3, 13),
    checkIn: '08:30',
    checkOut: '17:15',
    status: 'present',
    remarks: ''
  },
  {
    id: '5',
    userId: '2',
    date: new Date(2025, 3, 13),
    checkIn: '08:50',
    checkOut: '17:45',
    status: 'present',
    remarks: ''
  },
  {
    id: '6',
    userId: '3',
    date: new Date(2025, 3, 13),
    checkIn: '08:45',
    checkOut: '17:30',
    status: 'present',
    remarks: ''
  },
];

interface AttendanceRecord {
  id: string;
  userId: string;
  date: Date;
  checkIn: string;
  checkOut: string;
  status: string;
  remarks: string;
}

interface AttendanceDetailsProps {
  record: AttendanceRecord;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AttendanceDetails: React.FC<AttendanceDetailsProps> = ({ record, open, onOpenChange }) => {
  const user = users.find(u => u.id === record.userId);
  
  const exportRecord = (format: 'excel' | 'pdf') => {
    const recordData = [{
      Date: format(new Date(record.date), 'PPP'),
      Staff: user?.name || 'Unknown',
      Role: user?.role || 'Unknown',
      Status: record.status,
      CheckIn: record.checkIn || 'N/A',
      CheckOut: record.checkOut || 'N/A',
      Remarks: record.remarks || 'N/A'
    }];
    
    if (format === 'excel') {
      exportToExcel(recordData, `Attendance_${record.id}`);
    } else {
      exportToPDF(
        recordData,
        `Attendance_${record.id}`,
        'Staff Attendance Record',
        [
          { header: 'Property', dataKey: 'property' },
          { header: 'Value', dataKey: 'value' }
        ]
      );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Attendance Record Details
          </DialogTitle>
          <DialogDescription>
            Complete attendance information
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-between items-center my-4">
          <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
            {record.status}
          </Badge>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportRecord('excel')}
            >
              <Download className="mr-1 h-4 w-4" />
              Export Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => exportRecord('pdf')}
            >
              <Download className="mr-1 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Staff Name:</dt>
                <dd className="text-base">{user?.name || 'Unknown'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Role:</dt>
                <dd className="text-base">{user?.role?.replace('_', ' ') || 'Unknown'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Date:</dt>
                <dd className="text-base">{format(new Date(record.date), 'PPP')}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Status:</dt>
                <dd className="text-base">{record.status}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Check In:</dt>
                <dd className="text-base">{record.checkIn || 'N/A'}</dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">Check Out:</dt>
                <dd className="text-base">{record.checkOut || 'N/A'}</dd>
              </div>
              <div className="space-y-1 col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Remarks:</dt>
                <dd className="text-base">{record.remarks || 'No remarks'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <div className="flex flex-col space-y-2 mt-4">
          <h3 className="text-lg font-medium">Attendance History</h3>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-sm">
                Staff attendance history for the last 5 working days:
              </p>
              <div className="mt-4 space-y-2">
                {mockAttendance
                  .filter(a => a.userId === record.userId)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((a, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-2">
                      <div className="text-sm">{format(new Date(a.date), 'EEE, MMM d')}</div>
                      <div className="flex items-center">
                        <Badge variant={a.status === 'present' ? 'outline' : 'destructive'} className="text-xs">
                          {a.status}
                        </Badge>
                        {a.checkIn && (
                          <span className="text-xs ml-2 text-muted-foreground">
                            {a.checkIn} - {a.checkOut || 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const StaffAttendance: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [attendanceData, setAttendanceData] = useState(mockAttendance);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Get staff list (filter out admin roles)
  const staffList = users.filter(user => 
    user.role === UserRole.ENGINEER || 
    user.role === UserRole.TECHNICIAN || 
    user.role === UserRole.DEPOT_INCHARGE
  );

  // Filter attendance data based on search and filters
  const filteredAttendance = attendanceData.filter(record => {
    // Get user details
    const user = users.find(u => u.id === record.userId);
    if (!user) return false;
    
    // Apply date filter
    const recordDate = new Date(record.date);
    const isAfterStart = !startDate || recordDate >= startDate;
    const isBeforeEnd = !endDate || recordDate <= endDate;
    
    // Check if record is in the selected month
    const isInSelectedMonth = selectedMonth === 'all' || 
      (format(recordDate, 'yyyy-MM') === selectedMonth);
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isAfterStart && isBeforeEnd && matchesStatus && matchesSearch && isInSelectedMonth;
  });

  const markAttendance = (userId: string, status: 'present' | 'absent') => {
    const now = new Date();
    const checkInTime = format(now, 'HH:mm');
    
    const newAttendance = {
      id: Math.random().toString(),
      userId,
      date: now,
      checkIn: status === 'present' ? checkInTime : '',
      checkOut: '',
      status,
      remarks: ''
    };
    
    setAttendanceData(prev => [newAttendance, ...prev]);
    
    toast({
      title: 'Attendance Recorded',
      description: `Staff marked as ${status} at ${checkInTime}`,
    });
  };

  const handleCheckOut = (id: string) => {
    const now = new Date();
    const checkOutTime = format(now, 'HH:mm');
    
    setAttendanceData(prev => 
      prev.map(record => 
        record.id === id 
          ? { ...record, checkOut: checkOutTime } 
          : record
      )
    );
    
    toast({
      title: 'Check Out Recorded',
      description: `Staff checked out at ${checkOutTime}`,
    });
  };

  const exportAttendance = (format: 'excel' | 'pdf') => {
    // Prepare data for export
    const exportData = filteredAttendance.map(record => {
      const user = users.find(u => u.id === record.userId);
      return {
        Date: format === 'excel' ? format(new Date(record.date), 'yyyy-MM-dd') : format(new Date(record.date), 'PPP'),
        Staff: user?.name || 'Unknown',
        Role: user?.role?.replace('_', ' ') || 'Unknown',
        CheckIn: record.checkIn || 'N/A',
        CheckOut: record.checkOut || 'N/A',
        Status: record.status,
        Remarks: record.remarks || ''
      };
    });
    
    if (format === 'excel') {
      exportToExcel(exportData, 'Staff_Attendance');
    } else {
      exportToPDF(
        exportData,
        'Staff_Attendance',
        'Metro Depot Staff Attendance Report',
        [
          { header: 'Date', dataKey: 'Date' },
          { header: 'Staff', dataKey: 'Staff' },
          { header: 'Status', dataKey: 'Status' },
          { header: 'Check In', dataKey: 'CheckIn' },
          { header: 'Check Out', dataKey: 'CheckOut' },
          { header: 'Remarks', dataKey: 'Remarks' }
        ]
      );
    }
  };

  // Calculate attendance statistics
  const totalRecords = filteredAttendance.length;
  const presentCount = filteredAttendance.filter(r => r.status === 'present').length;
  const absentCount = filteredAttendance.filter(r => r.status === 'absent').length;
  const presentPercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

  // Generate month options for the last 12 months
  const getMonthOptions = () => {
    const options = [{ value: 'all', label: 'All Months' }];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthValue = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMMM yyyy');
      options.push({ value: monthValue, label: monthLabel });
    }
    
    return options;
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    
    if (month !== 'all') {
      // Parse the month string (yyyy-MM) to get the start and end of that month
      const [year, monthNum] = month.split('-').map(Number);
      const monthStart = startOfMonth(new Date(year, monthNum - 1));
      const monthEnd = endOfMonth(new Date(year, monthNum - 1));
      
      setStartDate(monthStart);
      setEndDate(monthEnd);
    } else {
      // If 'All Months' is selected, reset to the last 7 days
      setStartDate(subDays(new Date(), 7));
      setEndDate(new Date());
    }
  };

  const viewAttendanceDetails = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailsOpen(true);
  };

  const backupAttendanceData = async () => {
    toast({
      title: 'Backup Started',
      description: 'Backing up attendance data to Google Cloud...',
    });
    
    // Prepare data for backup with user names
    const dataWithNames = attendanceData.map(record => {
      const user = users.find(u => u.id === record.userId);
      return {
        ...record,
        userName: user?.name || 'Unknown',
        userRole: user?.role || 'Unknown'
      };
    });
    
    // Sync with Google Sheets
    const sheetsSyncResult = await syncStaffAttendanceToSheets(dataWithNames);
    
    // Backup to Google Cloud
    const cloudBackupResult = await backupToGoogleCloud(dataWithNames, 'attendance');
    
    if (sheetsSyncResult && cloudBackupResult) {
      toast({
        title: 'Backup Successful',
        description: 'Attendance data has been backed up to Google Cloud and synced with Google Sheets',
      });
    } else {
      toast({
        title: 'Backup Partially Completed',
        description: 'There was an issue with the backup process. Please check the logs for details.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>Staff Attendance</CardTitle>
              <CardDescription>
                Track and manage staff attendance records
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
              <Button variant="outline" onClick={() => exportAttendance('excel')}>
                <Download className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" onClick={() => exportAttendance('pdf')}>
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button onClick={backupAttendanceData}>
                Backup Data
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff or remarks..."
                className="pl-8"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {getMonthOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Date Range Picker */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <Label>Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} className="w-full" />
            </div>
            
            <div className="flex-1 space-y-2">
              <Label>End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} className="w-full" />
            </div>
          </div>
          
          {/* Attendance Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold">{totalRecords}</div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Mark Attendance */}
          <div className="mb-6 border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Quick Mark Attendance</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {staffList.slice(0, 3).map(staff => (
                <Card key={staff.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{staff.name}</div>
                      <Badge>{staff.role.replace('_', ' ')}</Badge>
                    </div>
                    
                    <div className="flex mt-3 gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => markAttendance(staff.id, 'present')}
                      >
                        <UserCheck className="mr-1 h-4 w-4" /> Present
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => markAttendance(staff.id, 'absent')}
                      >
                        <UserX className="mr-1 h-4 w-4" /> Absent
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Attendance Records Table */}
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  {!isMobile && (
                    <>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                    </>
                  )}
                  <TableHead>Status</TableHead>
                  {!isMobile && <TableHead>Remarks</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map(record => {
                  const staff = users.find(u => u.id === record.userId);
                  if (!staff) return null;
                  
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        {format(new Date(record.date), 'dd MMM yyyy')}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{staff.name}</div>
                        {isMobile && (
                          <div className="text-sm text-muted-foreground">
                            {record.checkIn && `In: ${record.checkIn}`}
                            {record.checkIn && record.checkOut && ' - '}
                            {record.checkOut && `Out: ${record.checkOut}`}
                          </div>
                        )}
                      </TableCell>
                      {!isMobile && (
                        <>
                          <TableCell>
                            {record.checkIn ? (
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {record.checkIn}
                              </div>
                            ) : '-'}
                          </TableCell>
                          <TableCell>
                            {record.checkOut ? (
                              <div className="flex items-center">
                                <Clock className="mr-1 h-3 w-3" />
                                {record.checkOut}
                              </div>
                            ) : '-'}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <Badge 
                          variant={record.status === 'present' ? 'default' : 'destructive'}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          {record.remarks || '-'}
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex gap-2">
                          {record.status === 'present' && !record.checkOut && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleCheckOut(record.id)}
                            >
                              Check Out
                            </Button>
                          )}
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => viewAttendanceDetails(record)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {filteredAttendance.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 4 : 6} className="text-center py-8">
                      No attendance records found for the selected criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Attendance Details Dialog */}
      {selectedRecord && (
        <AttendanceDetails 
          record={selectedRecord} 
          open={isDetailsOpen} 
          onOpenChange={setIsDetailsOpen} 
        />
      )}
    </div>
  );
};
