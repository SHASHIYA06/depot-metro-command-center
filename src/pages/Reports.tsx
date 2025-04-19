
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Download,
  FileUp,
  BarChart2,
  FileText,
  ClipboardList,
  CircleCheck,
  AlertTriangle,
  Clock,
  FileQuestion,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IssueReports } from '@/components/issues/IssueReports';

const Reports = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('rsoi');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for RSOI (Return of Stores/Items)
  const rsoiData = [
    { id: 'RS001', title: 'Damaged Signaling Equipment', status: 'open', date: '2025-04-15', submittedBy: 'Rajesh Kumar' },
    { id: 'RS002', title: 'Surplus Track Components', status: 'in_progress', date: '2025-04-10', submittedBy: 'Priya Singh' },
    { id: 'RS003', title: 'Obsolete Communication Devices', status: 'closed', date: '2025-04-01', submittedBy: 'Deepak Sharma' },
    { id: 'RS004', title: 'Faulty Power Supply Units', status: 'open', date: '2025-04-12', submittedBy: 'Anjali Patel' },
    { id: 'RS005', title: 'Unused Tools and Equipment', status: 'closed', date: '2025-03-28', submittedBy: 'Vikram Singh' },
  ];

  // Mock data for EIR (Equipment Inspection Reports)
  const eirData = [
    { id: 'EIR001', title: 'Monthly Inspection - Train Set TS01', status: 'closed', date: '2025-04-05', submittedBy: 'Manoj Kumar' },
    { id: 'EIR002', title: 'Brake System Check - Train Set TS05', status: 'in_progress', date: '2025-04-14', submittedBy: 'Ritu Sharma' },
    { id: 'EIR003', title: 'HVAC System Inspection - Station A', status: 'open', date: '2025-04-16', submittedBy: 'Anil Verma' },
    { id: 'EIR004', title: 'Door Mechanism Inspection - TS08', status: 'closed', date: '2025-04-02', submittedBy: 'Kavita Gupta' },
    { id: 'EIR005', title: 'Pantograph Inspection - Train Set TS12', status: 'in_progress', date: '2025-04-11', submittedBy: 'Rahul Singh' },
  ];

  // Mock data for NCR (Non-Conformance Reports)
  const ncrData = [
    { id: 'NCR001', title: 'Quality Control Failure - Track Alignment', status: 'open', date: '2025-04-16', submittedBy: 'Vijay Kumar' },
    { id: 'NCR002', title: 'Safety Protocol Breach - Station B', status: 'in_progress', date: '2025-04-13', submittedBy: 'Neha Patel' },
    { id: 'NCR003', title: 'SOP Violation - Maintenance Schedule', status: 'closed', date: '2025-04-03', submittedBy: 'Sunil Sharma' },
    { id: 'NCR004', title: 'Specification Deviation - Signal System', status: 'open', date: '2025-04-09', submittedBy: 'Meena Gupta' },
    { id: 'NCR005', title: 'Documentation Error - Train Set TS15', status: 'in_progress', date: '2025-04-08', submittedBy: 'Harish Singh' },
  ];

  // Combined filtered data based on active tab
  const getFilteredData = () => {
    let data;
    switch (activeTab) {
      case 'rsoi':
        data = rsoiData;
        break;
      case 'eir':
        data = eirData;
        break;
      case 'ncr':
        data = ncrData;
        break;
      default:
        data = [];
    }

    return data.filter(item => 
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === 'all' || item.status === filterStatus)
    );
  };

  const filteredData = getFilteredData();

  const handleExport = (format: string) => {
    toast({
      title: "Export Successful",
      description: `${activeTab.toUpperCase()} data has been exported to ${format} format.`
    });
  };

  const handleNewReport = () => {
    toast({
      title: "New Report",
      description: `Create a new ${activeTab.toUpperCase()} report.`
    });
  };

  // Chart data for report stats
  const getStatusChartData = () => {
    let data;
    switch (activeTab) {
      case 'rsoi':
        data = rsoiData;
        break;
      case 'eir':
        data = eirData;
        break;
      case 'ncr':
        data = ncrData;
        break;
      default:
        data = [];
    }

    const open = data.filter(item => item.status === 'open').length;
    const inProgress = data.filter(item => item.status === 'in_progress').length;
    const closed = data.filter(item => item.status === 'closed').length;

    return [
      { name: 'Open', value: open, fill: '#f97316' },
      { name: 'In Progress', value: inProgress, fill: '#0ea5e9' },
      { name: 'Closed', value: closed, fill: '#22c55e' },
    ];
  };

  const statusChartData = getStatusChartData();
  
  // Getting the correct title for each report type
  const getReportTitle = () => {
    switch (activeTab) {
      case 'rsoi':
        return 'Return of Stores/Items';
      case 'eir':
        return 'Equipment Inspection Reports';
      case 'ncr':
        return 'Non-Conformance Reports';
      default:
        return 'Reports';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metro Reports</h1>
          <p className="text-muted-foreground">
            Manage RSOI, EIR, and NCR reports for depot operations
          </p>
        </div>
        <Button onClick={handleNewReport}>
          <FileText className="mr-2 h-4 w-4" />
          New Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="rsoi">RSOI</TabsTrigger>
          <TabsTrigger value="eir">EIR</TabsTrigger>
          <TabsTrigger value="ncr">NCR</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* RSOI, EIR, NCR Tabs - Similar Layout */}
        {['rsoi', 'eir', 'ncr'].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold">{getReportTitle()}</h2>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Report List</CardTitle>
                  <CardDescription>Recent {activeTab.toUpperCase()} submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredData.length > 0 ? (
                    <div className="space-y-2">
                      {filteredData.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-3 border rounded-md hover:bg-secondary/20 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>ID: {item.id}</span>
                                <span>•</span>
                                <span>By: {item.submittedBy}</span>
                                <span>•</span>
                                <span>Date: {format(new Date(item.date), 'MMM dd, yyyy')}</span>
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === 'open' ? 'bg-orange-100 text-orange-800' :
                              item.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No reports found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Report Status</CardTitle>
                  <CardDescription>Current status of {activeTab.toUpperCase()} reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statusChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex flex-col items-center p-2 rounded-md bg-orange-50">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mb-1" />
                      <p className="text-lg font-semibold">{statusChartData[0].value}</p>
                      <p className="text-xs text-muted-foreground">Open</p>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-md bg-blue-50">
                      <Clock className="h-5 w-5 text-blue-500 mb-1" />
                      <p className="text-lg font-semibold">{statusChartData[1].value}</p>
                      <p className="text-xs text-muted-foreground">In Progress</p>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-md bg-green-50">
                      <CircleCheck className="h-5 w-5 text-green-500 mb-1" />
                      <p className="text-lg font-semibold">{statusChartData[2].value}</p>
                      <p className="text-xs text-muted-foreground">Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Create New {activeTab.toUpperCase()} Report</CardTitle>
                <CardDescription>Submit a new report for processing</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Report Title</Label>
                      <Input id="title" placeholder="Enter a descriptive title" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Report</SelectItem>
                          <SelectItem value="urgent">Urgent Report</SelectItem>
                          <SelectItem value="follow-up">Follow-up Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="related-item">Related Item/Equipment</Label>
                      <Input id="related-item" placeholder="Specify the related item or equipment" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <DatePicker />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Provide detailed information about the report" 
                      rows={4}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Attachments</Label>
                    <div className="border border-dashed rounded-md p-4 text-center">
                      <FileUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop files here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button type="submit">Submit Report</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <IssueReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
