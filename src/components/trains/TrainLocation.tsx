
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Search, Train, MapPin, Download, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { exportData } from '@/utils/dataExport';

// Train location interface
interface TrainLocation {
  id: string;
  trainId: string;
  location: string;
  yard: string;
  status: 'active' | 'maintenance' | 'inactive' | 'out_of_service';
  lastUpdated: Date;
  updatedBy: string;
  notes?: string;
}

// Yard/Location interface
interface Yard {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
}

// Mock data for train locations
const mockTrainLocations: TrainLocation[] = Array.from({ length: 25 }, (_, i) => {
  const trainId = `TS${(i + 1).toString().padStart(2, '0')}`;
  const randomYard = Math.floor(Math.random() * 5) + 1;
  const statuses: TrainLocation['status'][] = ['active', 'maintenance', 'inactive', 'out_of_service'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `TL${(i + 1).toString().padStart(3, '0')}`,
    trainId,
    location: randomStatus === 'maintenance' ? 'Workshop' : `Depot ${String.fromCharCode(65 + (i % 3))}`,
    yard: randomStatus === 'maintenance' ? 'Maintenance Bay' : `Yard ${randomYard}`,
    status: randomStatus,
    lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 8640000)),
    updatedBy: 'Rajesh Kumar',
    notes: randomStatus === 'maintenance' ? 'Undergoing scheduled maintenance' : undefined,
  };
});

// Mock data for yards
const mockYards: Yard[] = [
  { id: 'Y1', name: 'Yard 1', capacity: 8, currentOccupancy: 5 },
  { id: 'Y2', name: 'Yard 2', capacity: 6, currentOccupancy: 4 },
  { id: 'Y3', name: 'Yard 3', capacity: 10, currentOccupancy: 7 },
  { id: 'Y4', name: 'Yard 4', capacity: 5, currentOccupancy: 2 },
  { id: 'Y5', name: 'Yard 5', capacity: 8, currentOccupancy: 6 },
  { id: 'MB', name: 'Maintenance Bay', capacity: 4, currentOccupancy: 1 },
];

// Format train status for display
const formatTrainStatus = (status: TrainLocation['status']): { text: string; color: string } => {
  switch (status) {
    case 'active':
      return { text: 'Active', color: 'text-green-600 bg-green-100' };
    case 'maintenance':
      return { text: 'Maintenance', color: 'text-amber-600 bg-amber-100' };
    case 'inactive':
      return { text: 'Inactive', color: 'text-blue-600 bg-blue-100' };
    case 'out_of_service':
      return { text: 'Out of Service', color: 'text-red-600 bg-red-100' };
  }
};

const TrainLocationManagement: React.FC = () => {
  const { toast } = useToast();
  const [trainLocations, setTrainLocations] = useState<TrainLocation[]>([]);
  const [yards, setYards] = useState<Yard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterYard, setFilterYard] = useState('all');
  const [activeTab, setActiveTab] = useState('trains');
  
  // Update location dialog state
  const [isUpdateLocationOpen, setIsUpdateLocationOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedYard, setSelectedYard] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TrainLocation['status']>('active');
  const [locationNotes, setLocationNotes] = useState<string>('');
  const [updateDate, setUpdateDate] = useState<Date | undefined>(new Date());
  
  // Load mock data
  useEffect(() => {
    setTrainLocations(mockTrainLocations);
    setYards(mockYards);
  }, []);
  
  // Filter train locations based on search and filters
  const filteredTrainLocations = trainLocations.filter(train => {
    // Filter by search term
    const matchesSearch = train.trainId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.yard.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = filterStatus === 'all' || train.status === filterStatus;
    
    // Filter by yard
    const matchesYard = filterYard === 'all' || train.yard === filterYard;
    
    return matchesSearch && matchesStatus && matchesYard;
  });
  
  // Reset update location form
  const resetUpdateLocationForm = () => {
    setSelectedTrain('');
    setSelectedLocation('');
    setSelectedYard('');
    setSelectedStatus('active');
    setLocationNotes('');
    setUpdateDate(new Date());
  };
  
  // Open update location dialog for a specific train
  const openUpdateLocationDialog = (trainId: string) => {
    const train = trainLocations.find(t => t.trainId === trainId);
    
    if (train) {
      setSelectedTrain(train.trainId);
      setSelectedLocation(train.location);
      setSelectedYard(train.yard);
      setSelectedStatus(train.status);
      setLocationNotes(train.notes || '');
      setUpdateDate(new Date());
      setIsUpdateLocationOpen(true);
    }
  };
  
  // Handle update location
  const handleUpdateLocation = () => {
    if (!selectedTrain || !selectedLocation || !selectedYard || !selectedStatus || !updateDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    // Update train location
    const updatedLocations = trainLocations.map(train => 
      train.trainId === selectedTrain
        ? {
            ...train,
            location: selectedLocation,
            yard: selectedYard,
            status: selectedStatus,
            lastUpdated: updateDate,
            updatedBy: 'Current User', // In a real app, this would come from the authenticated user
            notes: locationNotes,
          }
        : train
    );
    
    setTrainLocations(updatedLocations);
    toast({
      title: 'Location Updated',
      description: `${selectedTrain} location has been updated successfully`,
    });
    
    setIsUpdateLocationOpen(false);
    resetUpdateLocationForm();
  };
  
  // Handle export
  const handleExport = (type: 'excel' | 'pdf') => {
    // Format data for export
    const exportData = filteredTrainLocations.map(train => ({
      'Train ID': train.trainId,
      'Location': train.location,
      'Yard': train.yard,
      'Status': formatTrainStatus(train.status).text,
      'Last Updated': format(train.lastUpdated, 'PPP'),
      'Updated By': train.updatedBy,
      'Notes': train.notes || '',
    }));
    
    // Export data
    if (type === 'excel') {
      exportToExcel(exportData);
    } else {
      exportToPDF(exportData);
    }
  };
  
  const exportToExcel = (data: any[]) => {
    try {
      exportData(data, 'Train_Locations', 'excel');
      toast({
        title: 'Export Successful',
        description: 'Train locations have been exported to Excel',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data',
        variant: 'destructive',
      });
      console.error('Excel export error:', error);
    }
  };
  
  const exportToPDF = (data: any[]) => {
    try {
      exportData(
        data,
        'Train_Locations',
        'pdf',
        'Train Location Status',
        ['Train ID', 'Location', 'Yard', 'Status', 'Last Updated', 'Updated By', 'Notes']
      );
      toast({
        title: 'Export Successful',
        description: 'Train locations have been exported to PDF',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting the data',
        variant: 'destructive',
      });
      console.error('PDF export error:', error);
    }
  };
  
  // Calculate statistics
  const trainStats = {
    total: trainLocations.length,
    active: trainLocations.filter(train => train.status === 'active').length,
    maintenance: trainLocations.filter(train => train.status === 'maintenance').length,
    inactive: trainLocations.filter(train => train.status === 'inactive').length,
    outOfService: trainLocations.filter(train => train.status === 'out_of_service').length,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Train Location Management</h1>
          <p className="text-muted-foreground">
            Track and manage train locations and yard assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="trains">Train Locations</TabsTrigger>
          <TabsTrigger value="yards">Yard Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trains" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Trains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{trainStats.total}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{trainStats.active}</div>
                  <Badge className="bg-green-100 text-green-600">
                    {Math.round((trainStats.active / trainStats.total) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">In Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{trainStats.maintenance}</div>
                  <Badge className="bg-amber-100 text-amber-600">
                    {Math.round((trainStats.maintenance / trainStats.total) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Out of Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{trainStats.outOfService}</div>
                  <Badge className="bg-red-100 text-red-600">
                    {Math.round((trainStats.outOfService / trainStats.total) * 100)}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
              <div>
                <CardTitle>Train Locations</CardTitle>
                <CardDescription>Current location and status of all trains</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full sm:w-[280px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search trains..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="out_of_service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterYard} onValueChange={setFilterYard}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter Yard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Yards</SelectItem>
                    {yards.map((yard) => (
                      <SelectItem key={yard.id} value={yard.name}>{yard.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Current location of {filteredTrainLocations.length} trains</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Train ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Yard</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Updated By</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainLocations.length > 0 ? (
                    filteredTrainLocations.map((train) => {
                      const { text: statusText, color: statusColor } = formatTrainStatus(train.status);
                      
                      return (
                        <TableRow key={train.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Train className="h-4 w-4 text-primary" />
                              {train.trainId}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusColor}>{statusText}</Badge>
                          </TableCell>
                          <TableCell>{train.location}</TableCell>
                          <TableCell>{train.yard}</TableCell>
                          <TableCell>{format(train.lastUpdated, 'MMM dd, yyyy HH:mm')}</TableCell>
                          <TableCell>{train.updatedBy}</TableCell>
                          <TableCell className="max-w-xs truncate">{train.notes || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => openUpdateLocationDialog(train.trainId)}>
                              <MapPin className="h-3 w-3 mr-1" />
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <AlertCircle className="h-8 w-8 mb-2" />
                          <p>No trains found</p>
                          <p className="text-sm">Try adjusting your filters</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="yards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Yard Occupancy</CardTitle>
              <CardDescription>Current status and capacity of stabling yards</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Stabling yard capacity and current occupancy</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Yard Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Current Occupancy</TableHead>
                    <TableHead>Available Space</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {yards.map((yard) => {
                    const availableSpace = yard.capacity - yard.currentOccupancy;
                    const utilization = (yard.currentOccupancy / yard.capacity) * 100;
                    
                    let statusColor = 'text-green-600 bg-green-100';
                    if (utilization >= 90) {
                      statusColor = 'text-red-600 bg-red-100';
                    } else if (utilization >= 75) {
                      statusColor = 'text-amber-600 bg-amber-100';
                    }
                    
                    return (
                      <TableRow key={yard.id}>
                        <TableCell className="font-medium">{yard.name}</TableCell>
                        <TableCell>{yard.capacity}</TableCell>
                        <TableCell>{yard.currentOccupancy}</TableCell>
                        <TableCell>{availableSpace}</TableCell>
                        <TableCell>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${
                                utilization >= 90 ? 'bg-red-500' : utilization >= 75 ? 'bg-amber-500' : 'bg-green-500'
                              } h-2 rounded-full`} 
                              style={{ width: `${utilization}%` }} 
                            />
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {Math.round(utilization)}% full
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor}>
                            {utilization >= 90 ? 'Critical' : utilization >= 75 ? 'High' : 'Normal'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trains by Yard</CardTitle>
              <CardDescription>List of trains currently in each yard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {yards.map((yard) => {
                  const trainsInYard = trainLocations.filter(train => train.yard === yard.name);
                  
                  return (
                    <Card key={yard.id} className="overflow-hidden">
                      <CardHeader className="bg-muted">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{yard.name}</CardTitle>
                          <Badge variant="outline">
                            {trainsInYard.length} / {yard.capacity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {trainsInYard.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            {trainsInYard.map((train) => {
                              const { text: statusText, color: statusColor } = formatTrainStatus(train.status);
                              
                              return (
                                <div key={train.id} className="flex justify-between items-center border-b pb-2">
                                  <div className="flex items-center gap-2">
                                    <Train className="h-4 w-4 text-primary" />
                                    <span className="font-medium">{train.trainId}</span>
                                  </div>
                                  <Badge className={statusColor}>{statusText}</Badge>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            <p>No trains in this yard</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Update Location Dialog */}
      <Dialog open={isUpdateLocationOpen} onOpenChange={setIsUpdateLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Train Location</DialogTitle>
            <DialogDescription>
              Update the location and status for {selectedTrain}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Train ID</Label>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted">
                <Train className="h-4 w-4 text-primary" />
                <span>{selectedTrain}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="train-status">Status</Label>
              <Select value={selectedStatus} onValueChange={(value: TrainLocation['status']) => setSelectedStatus(value)}>
                <SelectTrigger id="train-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="train-location">Location</Label>
              <Input
                id="train-location"
                placeholder="Enter location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="train-yard">Yard</Label>
              <Select value={selectedYard} onValueChange={setSelectedYard}>
                <SelectTrigger id="train-yard">
                  <SelectValue placeholder="Select yard" />
                </SelectTrigger>
                <SelectContent>
                  {yards.map((yard) => (
                    <SelectItem key={yard.id} value={yard.name}>{yard.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Update Date/Time</Label>
              <DatePicker date={updateDate} setDate={setUpdateDate} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location-notes">Notes</Label>
              <Textarea
                id="location-notes"
                placeholder="Enter additional notes"
                rows={3}
                value={locationNotes}
                onChange={(e) => setLocationNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateLocationOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateLocation}>Update Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainLocationManagement;
