import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, FileSpreadsheet, Download, Calendar, Filter } from 'lucide-react';
import { format as formatDate, subDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { exportData } from '@/utils/dataExport';
import { trains, tasks, issues, activityLogs, users } from '@/lib/mockData';
import { ExportFormat } from '@/types';

const Exports = () => {
  const { toast } = useToast();
  const [exportType, setExportType] = useState<string>('tasks');
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [exportFormat, setExportFormat] = useState<ExportFormat>('excel');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getExportData = (type: string) => {
    switch (type) {
      case 'tasks':
        return tasks.map(task => ({
          ...task,
          assignedToName: task.assignedTo 
            ? users.find(u => u.id === task.assignedTo)?.name || 'Unassigned'
            : 'Unassigned',
          assignedByName: users.find(u => u.id === task.assignedBy)?.name || 'Unknown',
          trainName: task.trainId 
            ? trains.find(t => t.id === task.trainId)?.name || 'N/A'
            : 'N/A',
        }));
      case 'issues':
        return issues.map(issue => ({
          ...issue,
          assignedToName: issue.assignedTo 
            ? users.find(u => u.id === issue.assignedTo)?.name || 'Unassigned'
            : 'Unassigned',
          reportedByName: users.find(u => u.id === issue.reportedBy)?.name || 'Unknown',
          trainName: issue.trainId 
            ? trains.find(t => t.id === issue.trainId)?.name || 'N/A'
            : 'N/A',
        }));
      case 'trains':
        return trains.map(train => ({
          ...train,
          numCars: train.cars.length,
          status: train.status.replace('_', ' '),
        }));
      case 'activities':
        return activityLogs.map(log => ({
          ...log,
          userName: users.find(u => u.id === log.userId)?.name || 'Unknown',
          trainName: log.trainId 
            ? trains.find(t => t.id === log.trainId)?.name || 'N/A'
            : 'N/A',
        }));
      case 'staff':
        return users.map(user => ({
          ...user,
          roleName: user.role.replace('_', ' '),
        }));
      default:
        return [];
    }
  };

  const getExportColumns = (type: string) => {
    switch (type) {
      case 'tasks':
        return [
          'id', 'title', 'description', 'priority', 'status', 'assignedToName', 
          'assignedByName', 'createdAt', 'dueDate', 'trainName', 'carId', 'category'
        ];
      case 'issues':
        return [
          'id', 'title', 'description', 'severity', 'status', 'reportedByName',
          'assignedToName', 'reportedAt', 'trainName'
        ];
      case 'trains':
        return [
          'id', 'name', 'status', 'lastMaintenance', 'nextMaintenance', 
          'totalTrips', 'numCars', 'manufacturer', 'commissionedDate', 'totalKilometers'
        ];
      case 'activities':
        return [
          'id', 'userName', 'action', 'details', 'timestamp', 'trainName'
        ];
      case 'staff':
        return [
          'id', 'name', 'badgeNo', 'roleName', 'department', 'email',
          'phone', 'aadharNo', 'vehicleNo', 'joiningDate'
        ];
      default:
        return [];
    }
  };

  const getColumnHeaders = (type: string) => {
    switch (type) {
      case 'tasks':
        return [
          { header: 'Task ID', dataKey: 'id' },
          { header: 'Title', dataKey: 'title' },
          { header: 'Description', dataKey: 'description' },
          { header: 'Priority', dataKey: 'priority' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Assigned To', dataKey: 'assignedToName' },
        ];
      case 'issues':
        return [
          { header: 'Issue ID', dataKey: 'id' },
          { header: 'Title', dataKey: 'title' },
          { header: 'Description', dataKey: 'description' },
          { header: 'Severity', dataKey: 'severity' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Reported By', dataKey: 'reportedByName' },
        ];
      case 'trains':
        return [
          { header: 'Train ID', dataKey: 'id' },
          { header: 'Name', dataKey: 'name' },
          { header: 'Status', dataKey: 'status' },
          { header: 'Last Maintenance', dataKey: 'lastMaintenance' },
          { header: 'Next Maintenance', dataKey: 'nextMaintenance' },
          { header: 'Total Trips', dataKey: 'totalTrips' },
        ];
      case 'activities':
        return [
          { header: 'Log ID', dataKey: 'id' },
          { header: 'User', dataKey: 'userName' },
          { header: 'Action', dataKey: 'action' },
          { header: 'Details', dataKey: 'details' },
          { header: 'Timestamp', dataKey: 'timestamp' },
          { header: 'Train', dataKey: 'trainName' },
        ];
      case 'staff':
        return [
          { header: 'Staff ID', dataKey: 'id' },
          { header: 'Name', dataKey: 'name' },
          { header: 'Badge No', dataKey: 'badgeNo' },
          { header: 'Role', dataKey: 'roleName' },
          { header: 'Department', dataKey: 'department' },
          { header: 'Email', dataKey: 'email' },
        ];
      default:
        return [];
    }
  };

  const handleExportClick = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const data = getExportData(exportType);
        const columns = getExportColumns(exportType);
        const fileName = `metro_depot_${exportType}_${formatDate(new Date(), 'yyyy-MM-dd')}`;
        const title = `Metro Depot ${exportType.charAt(0).toUpperCase() + exportType.slice(1)} Report`;
        
        exportData(data, fileName, exportFormat, title, columns);
        
        toast({
          title: "Export Successful",
          description: `Your ${exportType} data has been exported as a ${exportFormat.toUpperCase()} file.`,
        });
      } catch (error) {
        console.error("Export error:", error);
        toast({
          title: "Export Failed",
          description: "There was an error exporting your data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate processing time
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'tasks': return 'Tasks & Work Orders';
      case 'issues': return 'Issues & Reports';
      case 'trains': return 'Train Data';
      case 'activities': return 'Activity Logs';
      case 'staff': return 'Staff Records';
      default: return 'Export Data';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Exports</h1>
          <p className="text-muted-foreground">
            Export and download depot data for reporting and analysis
          </p>
        </div>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
              <CardDescription>Select data type and format for export</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="export-type">Data Type</Label>
                  <Select value={exportType} onValueChange={setExportType}>
                    <SelectTrigger id="export-type">
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tasks">Tasks & Work Orders</SelectItem>
                      <SelectItem value="issues">Issues & Reports</SelectItem>
                      <SelectItem value="trains">Train Data</SelectItem>
                      <SelectItem value="activities">Activity Logs</SelectItem>
                      <SelectItem value="staff">Staff Records</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="export-format">Export Format</Label>
                  <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                    <SelectTrigger id="export-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <div className="flex items-center space-x-2">
                    <DatePicker 
                      date={dateRange.from}
                      setDate={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      className="flex-1"
                    />
                    <span>to</span>
                    <DatePicker
                      date={dateRange.to}
                      setDate={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleExportClick} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export {exportFormat === 'excel' ? 'Excel' : 'PDF'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Preview: {getTitle(exportType)}</CardTitle>
              <CardDescription>Showing sample of data that will be exported</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {getColumnHeaders(exportType).map((column, i) => (
                        <TableHead key={i}>{column.header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getExportData(exportType).slice(0, 5).map((item, i) => (
                      <TableRow key={i}>
                        {getColumnHeaders(exportType).map((column, j) => (
                          <TableCell key={j}>
                            {typeof item[column.dataKey] === 'object' 
                              ? JSON.stringify(item[column.dataKey])
                              : item[column.dataKey]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Note: Only showing first 5 rows and 6 columns for preview
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>Your recent data export activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-4 border rounded-lg bg-accent/50">
                    <div className="mr-4">
                      <FileSpreadsheet className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">Tasks & Work Orders</h4>
                      <p className="text-sm text-muted-foreground">
                        Exported on {formatDate(new Date(), 'PPP')} - Excel Format
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg bg-accent/50">
                    <div className="mr-4">
                      <FileSpreadsheet className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">Issues & Reports</h4>
                      <p className="text-sm text-muted-foreground">
                        Exported on {formatDate(subDays(new Date(), 2), 'PPP')} - PDF Format
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Your complete export history will appear here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Configure automated report exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Scheduled Reports</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Create scheduled reports to automatically export data on a regular basis
                </p>
                <Button>
                  Create Scheduled Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Exports;
