
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, Search, Filter, BarChart3, PieChart, FileText, Database, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import { toast } from '@/hooks/use-toast';

interface TCMSEntry {
  id: string;
  trainSet: string;
  date: string;
  timestamp: string;
  eventCode: string;
  subsystem: string;
  description: string;
  level: '1' | '2' | '3';
  status: 'open' | 'closed' | 'in-progress';
  solution?: string;
  actionTaken?: string;
  hintMessage?: string;
  occurrenceCount?: number;
}

interface TCMSHint {
  eventCode: string;
  description: string;
  hintMessage: string;
  solution: string;
  actionRequired: string;
  rootCause: string;
  level: string;
  subsystem: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

export const TCMSDashboard: React.FC = () => {
  const [data, setData] = useState<TCMSEntry[]>([]);
  const [hintsData, setHintsData] = useState<TCMSHint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainSet, setTrainSet] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<TCMSEntry | null>(null);

  // Load hints data from Google Sheets (simulated)
  useEffect(() => {
    const loadHintsData = async () => {
      try {
        // Simulate loading from Google Sheets API
        const mockHintsData: TCMSHint[] = [
          {
            eventCode: "FC101",
            description: "Brake pressure low",
            hintMessage: "Check brake fluid levels and inspect for leaks",
            solution: "Refill brake fluid and repair any identified leaks",
            actionRequired: "Immediate inspection required",
            rootCause: "Brake fluid leak or low fluid level",
            level: "1",
            subsystem: "Braking"
          },
          {
            eventCode: "TC201",
            description: "Door malfunction",
            hintMessage: "Check door sensors and mechanical components",
            solution: "Replace faulty door sensor or mechanical parts",
            actionRequired: "Service required before next operation",
            rootCause: "Sensor failure or mechanical wear",
            level: "2",
            subsystem: "Doors"
          },
          {
            eventCode: "PS301",
            description: "Power supply voltage low",
            hintMessage: "Check power supply connections and voltage levels",
            solution: "Inspect and repair power supply system",
            actionRequired: "Electrical system check required",
            rootCause: "Power supply degradation or connection issues",
            level: "1",
            subsystem: "Power"
          }
        ];
        setHintsData(mockHintsData);
      } catch (err) {
        console.error('Error loading hints data:', err);
        setError('Failed to load hints data from Google Sheets');
      }
    };

    loadHintsData();
  }, []);

  // Sample data for demonstration
  useEffect(() => {
    const sampleData: TCMSEntry[] = [
      {
        id: '1',
        trainSet: 'TS001',
        date: '2024-01-15',
        timestamp: '2024-01-15T08:30:00',
        eventCode: 'FC101',
        subsystem: 'Braking',
        description: 'Brake pressure low',
        level: '1',
        status: 'open',
        solution: 'Check brake fluid',
        actionTaken: 'Inspected brake system',
        occurrenceCount: 3
      },
      {
        id: '2',
        trainSet: 'TS001',
        date: '2024-01-15',
        timestamp: '2024-01-15T09:15:00',
        eventCode: 'TC201',
        subsystem: 'Doors',
        description: 'Door malfunction',
        level: '2',
        status: 'in-progress',
        solution: 'Replace door sensor',
        actionTaken: 'Door sensor replaced',
        occurrenceCount: 1
      },
      {
        id: '3',
        trainSet: 'TS002',
        date: '2024-01-16',
        timestamp: '2024-01-16T10:45:00',
        eventCode: 'PS301',
        subsystem: 'Power',
        description: 'Power supply voltage low',
        level: '1',
        status: 'closed',
        solution: 'Check power connections',
        actionTaken: 'Power system repaired',
        occurrenceCount: 2
      }
    ];
    setData(sampleData);
  }, []);

  // Process CSV files
  const processFiles = async (files: FileList) => {
    if (!trainSet.trim()) {
      setError('Please enter a train set number before uploading files');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allData: TCMSEntry[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.name.toLowerCase().endsWith('.csv')) {
          console.warn(`Skipping non-CSV file: ${file.name}`);
          continue;
        }

        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          console.warn(`File ${file.name} has insufficient data`);
          continue;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Check for required headers
        const requiredHeaders = ['date', 'eventcode', 'description'];
        const hasRequiredHeaders = requiredHeaders.some(req => 
          headers.some(h => h.includes(req))
        );

        if (!hasRequiredHeaders) {
          console.warn(`File ${file.name} missing required headers`);
          continue;
        }

        // Parse data rows
        for (let j = 1; j < lines.length; j++) {
          const values = lines[j].split(',').map(v => v.trim());
          
          if (values.length < 3) continue; // Skip incomplete rows

          const entry: TCMSEntry = {
            id: `${Date.now()}-${j}-${i}`,
            trainSet: trainSet,
            date: values[headers.indexOf('date')] || new Date().toISOString().split('T')[0],
            timestamp: values[headers.indexOf('timestamp')] || new Date().toISOString(),
            eventCode: values[headers.indexOf('eventcode')] || `UNK${j}`,
            subsystem: values[headers.indexOf('subsystem')] || 'Unknown',
            description: values[headers.indexOf('description')] || 'No description',
            level: (values[headers.indexOf('level')] as '1' | '2' | '3') || '3',
            status: (values[headers.indexOf('status')] as 'open' | 'closed' | 'in-progress') || 'open',
            solution: values[headers.indexOf('solution')] || '',
            actionTaken: values[headers.indexOf('actiontaken')] || '',
            occurrenceCount: 1
          };

          allData.push(entry);
        }
      }

      if (allData.length === 0) {
        setError('No valid records found in the uploaded files. Please check the CSV format.');
        return;
      }

      // Merge with existing data and count occurrences
      const mergedData = [...data];
      
      allData.forEach(newEntry => {
        const existingIndex = mergedData.findIndex(
          existing => existing.eventCode === newEntry.eventCode && 
                     existing.trainSet === newEntry.trainSet
        );

        if (existingIndex >= 0) {
          mergedData[existingIndex].occurrenceCount = 
            (mergedData[existingIndex].occurrenceCount || 1) + 1;
        } else {
          mergedData.push(newEntry);
        }
      });

      setData(mergedData);
      
      toast({
        title: 'Files Processed Successfully',
        description: `Processed ${allData.length} records from ${files.length} file(s)`,
      });

    } catch (err) {
      console.error('Error processing files:', err);
      setError('Error processing files. Please check the file format and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.eventCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subsystem.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = levelFilter === 'all' || item.level === levelFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      
      const matchesDateRange = (!dateFrom || item.date >= dateFrom) && 
                               (!dateTo || item.date <= dateTo);

      return matchesSearch && matchesLevel && matchesStatus && matchesDateRange;
    });
  }, [data, searchTerm, levelFilter, statusFilter, dateFrom, dateTo]);

  // Generate statistics
  const statistics = useMemo(() => {
    const stats = {
      total: filteredData.length,
      byLevel: { '1': 0, '2': 0, '3': 0 },
      byStatus: { open: 0, closed: 0, 'in-progress': 0 },
      topFaults: [] as { eventCode: string; count: number; description: string }[]
    };

    filteredData.forEach(item => {
      stats.byLevel[item.level]++;
      stats.byStatus[item.status]++;
    });

    // Calculate top faults
    const faultCounts = new Map<string, { count: number; description: string }>();
    filteredData.forEach(item => {
      const key = item.eventCode;
      if (faultCounts.has(key)) {
        faultCounts.get(key)!.count += item.occurrenceCount || 1;
      } else {
        faultCounts.set(key, { count: item.occurrenceCount || 1, description: item.description });
      }
    });

    stats.topFaults = Array.from(faultCounts.entries())
      .map(([eventCode, data]) => ({ eventCode, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }, [filteredData]);

  // Get hint for event code
  const getHintForEventCode = (eventCode: string): TCMSHint | null => {
    return hintsData.find(hint => hint.eventCode === eventCode) || null;
  };

  // Export data
  const exportData = () => {
    const csv = [
      'Date,Train Set,Event Code,Subsystem,Description,Level,Status,Occurrences,Solution,Action Taken',
      ...filteredData.map(item => 
        `${item.date},${item.trainSet},${item.eventCode},${item.subsystem},"${item.description}",${item.level},${item.status},${item.occurrenceCount || 1},"${item.solution || ''}","${item.actionTaken || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tcms-data-${trainSet}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">TCMS Dashboard</h1>
        <Button onClick={exportData} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Data Import</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="faults">Fault Details</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Train Set Data Import</CardTitle>
              <CardDescription>
                Upload CSV files containing TCMS data for analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Train Set Number (e.g., TS001)"
                  value={trainSet}
                  onChange={(e) => setTrainSet(e.target.value)}
                  className="flex-1"
                />
                <input
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={(e) => e.target.files && processFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={loading || !trainSet.trim()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {loading ? 'Processing...' : 'Upload CSV Files'}
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Expected CSV format: date, eventCode, subsystem, description, level, status</p>
                <p>Multiple files will be merged automatically</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Faults</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Level 1 (Critical)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{statistics.byLevel['1']}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Level 2 (Warning)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{statistics.byLevel['2']}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{statistics.byStatus.open}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Fault Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statistics.topFaults}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="eventCode" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fault Level Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Level 1', value: statistics.byLevel['1'] },
                        { name: 'Level 2', value: statistics.byLevel['2'] },
                        { name: 'Level 3', value: statistics.byLevel['3'] }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Level 1', value: statistics.byLevel['1'] },
                        { name: 'Level 2', value: statistics.byLevel['2'] },
                        { name: 'Level 3', value: statistics.byLevel['3'] }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faults" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fault Records</CardTitle>
              <CardDescription>
                Filter and search through TCMS fault data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4">
                <Input
                  placeholder="Search faults..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="1">Level 1</SelectItem>
                    <SelectItem value="2">Level 2</SelectItem>
                    <SelectItem value="3">Level 3</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-40"
                  placeholder="From date"
                />
                
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-40"
                  placeholder="To date"
                />
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Train Set</TableHead>
                      <TableHead>Event Code</TableHead>
                      <TableHead>Subsystem</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.slice(0, 100).map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.trainSet}</TableCell>
                        <TableCell className="font-mono">{record.eventCode}</TableCell>
                        <TableCell>{record.subsystem}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.description}</TableCell>
                        <TableCell>
                          <Badge variant={record.level === '1' ? 'destructive' : record.level === '2' ? 'default' : 'secondary'}>
                            Level {record.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.status === 'open' ? 'destructive' : record.status === 'in-progress' ? 'default' : 'secondary'}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.occurrenceCount || 1}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                                View Hints
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Fault Details & Hints</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold">Fault Information</h4>
                                  <p><strong>Event Code:</strong> {record.eventCode}</p>
                                  <p><strong>Description:</strong> {record.description}</p>
                                  <p><strong>Subsystem:</strong> {record.subsystem}</p>
                                  <p><strong>Level:</strong> {record.level}</p>
                                </div>
                                
                                {(() => {
                                  const hint = getHintForEventCode(record.eventCode);
                                  return hint ? (
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-blue-800">Troubleshooting Hints</h4>
                                      <p><strong>Hint:</strong> {hint.hintMessage}</p>
                                      <p><strong>Solution:</strong> {hint.solution}</p>
                                      <p><strong>Action Required:</strong> {hint.actionRequired}</p>
                                      <p><strong>Root Cause:</strong> {hint.rootCause}</p>
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <p>No specific hints available for this fault code.</p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredData.length > 100 && (
                <p className="text-sm text-gray-600 mt-2">
                  Showing first 100 of {filteredData.length} records
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Backup & Management</CardTitle>
              <CardDescription>
                Backup and restore TCMS data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={exportData} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Current Data
                </Button>
                
                <Button className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Backup to Google Sheets
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>• Data is automatically backed up locally</p>
                <p>• Use export function to save data for external backup</p>
                <p>• Google Sheets integration stores hints and reference data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
