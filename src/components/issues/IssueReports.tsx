
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { FileDown, FileCog, Calendar, Printer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getIssuesByStatus, getIssuesBySeverity, getIssuesByAssignee, users, trains } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { UserRole } from '@/types';

export const IssueReports: React.FC = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('activity');
  const [reportFilter, setReportFilter] = useState('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');

  // Filter staff to only engineers and technicians
  const assignableStaff = users.filter(u => 
    u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN
  );

  const handleGenerateReport = () => {
    toast({
      title: 'Report Generated',
      description: 'Your report has been generated and is ready to download.',
    });
    // In a real application, this would generate an actual report file
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Sample report data - in a real app this would come from filtered API calls
  const getReportData = () => {
    if (reportType === 'activity') {
      if (reportFilter === 'status') {
        return [
          { category: 'Open', count: getIssuesByStatus('open').length },
          { category: 'In Progress', count: getIssuesByStatus('in_progress').length },
          { category: 'Resolved', count: getIssuesByStatus('resolved').length },
        ];
      } else if (reportFilter === 'priority') {
        return [
          { category: 'Low', count: getIssuesBySeverity('low').length },
          { category: 'Medium', count: getIssuesBySeverity('medium').length },
          { category: 'High', count: getIssuesBySeverity('high').length },
          { category: 'Critical', count: getIssuesBySeverity('critical').length },
        ];
      }
    } else if (reportType === 'staff') {
      return assignableStaff.map(staff => {
        const assignedIssues = getIssuesByAssignee(staff.id);
        return {
          category: staff.name,
          role: staff.role,
          assigned: assignedIssues.length,
          completed: assignedIssues.filter(i => i.status === 'resolved').length,
          pending: assignedIssues.filter(i => i.status !== 'resolved').length,
        };
      });
    } else if (reportType === 'train') {
      return trains.map(train => {
        // In a real app, you'd get issues related to each train
        const issueCount = Math.floor(Math.random() * 20); // Mock data
        return {
          category: train.name,
          status: train.status,
          issueCount,
          lastMaintenance: train.lastMaintenance,
          nextMaintenance: train.nextMaintenance,
        };
      });
    }
    
    return [];
  };

  const reportData = getReportData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>
            Create reports for work activities, staff performance, and train maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" className="space-y-4">
            <TabsList>
              <TabsTrigger value="generate">Report Settings</TabsTrigger>
              <TabsTrigger value="preview">Report Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select 
                    value={reportType} 
                    onValueChange={setReportType}
                  >
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Work Activities Report</SelectItem>
                      <SelectItem value="staff">Staff Performance Report</SelectItem>
                      <SelectItem value="train">Train Maintenance Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="report-filter">Filter By</Label>
                  <Select 
                    value={reportFilter} 
                    onValueChange={setReportFilter}
                  >
                    <SelectTrigger id="report-filter">
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Records</SelectItem>
                      {reportType === 'activity' && (
                        <>
                          <SelectItem value="status">Status</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                        </>
                      )}
                      {reportType === 'staff' && (
                        <SelectItem value="staff_member">Staff Member</SelectItem>
                      )}
                      {reportType === 'train' && (
                        <SelectItem value="train_id">Train</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <DatePicker 
                    date={startDate} 
                    setDate={setStartDate} 
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <DatePicker 
                    date={endDate} 
                    setDate={setEndDate} 
                    className="w-full"
                  />
                </div>
              </div>
              
              {reportFilter === 'staff_member' && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="staff-select">Select Staff Member</Label>
                  <Select 
                    value={selectedStaff} 
                    onValueChange={setSelectedStaff}
                  >
                    <SelectTrigger id="staff-select">
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_staff">All Staff Members</SelectItem>
                      {assignableStaff.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} ({staff.role.replace('_', ' ')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {reportFilter === 'train_id' && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="train-select">Select Train</Label>
                  <Select 
                    value={selectedTrain} 
                    onValueChange={setSelectedTrain}
                  >
                    <SelectTrigger id="train-select">
                      <SelectValue placeholder="Select train" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_trains">All Trains</SelectItem>
                      {trains.map(train => (
                        <SelectItem key={train.id} value={train.id}>
                          {train.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button onClick={handleGenerateReport}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Metro Depot Report</h2>
                    <p className="text-muted-foreground">
                      {reportType === 'activity' && 'Work Activities Report'}
                      {reportType === 'staff' && 'Staff Performance Report'}
                      {reportType === 'train' && 'Train Maintenance Report'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Generated on {format(new Date(), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <Button variant="outline" onClick={handlePrintReport}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
                
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {reportType === 'activity' && (
                          <>
                            <TableHead>Category</TableHead>
                            <TableHead>Count</TableHead>
                            <TableHead>Percentage</TableHead>
                          </>
                        )}
                        {reportType === 'staff' && (
                          <>
                            <TableHead>Staff Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Assigned</TableHead>
                            <TableHead>Completed</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead>Completion Rate</TableHead>
                          </>
                        )}
                        {reportType === 'train' && (
                          <>
                            <TableHead>Train Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Issues</TableHead>
                            <TableHead>Last Maintenance</TableHead>
                            <TableHead>Next Maintenance</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportType === 'activity' && reportData.map((item: any, index) => {
                        const total = reportData.reduce((sum, i: any) => sum + i.count, 0);
                        const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.count}</TableCell>
                            <TableCell>{percentage}%</TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {reportType === 'staff' && reportData.map((item: any, index) => {
                        const completionRate = item.assigned > 0 
                          ? ((item.completed / item.assigned) * 100).toFixed(1) 
                          : '0';
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.role.replace('_', ' ')}</TableCell>
                            <TableCell>{item.assigned}</TableCell>
                            <TableCell>{item.completed}</TableCell>
                            <TableCell>{item.pending}</TableCell>
                            <TableCell>{completionRate}%</TableCell>
                          </TableRow>
                        );
                      })}
                      
                      {reportType === 'train' && reportData.map((item: any, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <span className={
                              item.status === 'active' 
                                ? 'text-metro-success' 
                                : item.status === 'maintenance' 
                                  ? 'text-metro-warning' 
                                  : 'text-metro-danger'
                            }>
                              {item.status.replace('_', ' ')}
                            </span>
                          </TableCell>
                          <TableCell>{item.issueCount}</TableCell>
                          <TableCell>{format(new Date(item.lastMaintenance), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{format(new Date(item.nextMaintenance), 'MMM dd, yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
