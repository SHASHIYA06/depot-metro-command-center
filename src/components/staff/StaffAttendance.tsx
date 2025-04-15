
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, Download, Filter, Search, UserCheck, UserX } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { users } from '@/lib/mockData';
import { UserRole } from '@/types';

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

export const StaffAttendance: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [startDate, setStartDate] = useState<Date | undefined>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [attendanceData, setAttendanceData] = useState(mockAttendance);
  
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
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    // Apply search filter
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.remarks.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isAfterStart && isBeforeEnd && matchesStatus && matchesSearch;
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

  const exportAttendance = () => {
    // In a real app, this would create a CSV or Excel file
    // For now, just show a toast
    toast({
      title: 'Export Successful',
      description: 'Attendance data has been exported',
    });
  };

  // Calculate attendance statistics
  const totalRecords = filteredAttendance.length;
  const presentCount = filteredAttendance.filter(r => r.status === 'present').length;
  const absentCount = filteredAttendance.filter(r => r.status === 'absent').length;
  const presentPercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Attendance</CardTitle>
          <CardDescription>
            Track and manage staff attendance records
          </CardDescription>
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

              <Button variant="outline" onClick={exportAttendance}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
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
                        {record.status === 'present' && !record.checkOut && (
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleCheckOut(record.id)}
                          >
                            Check Out
                          </Button>
                        )}
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
    </div>
  );
};
