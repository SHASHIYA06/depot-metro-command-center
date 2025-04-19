import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Hammer } from 'lucide-react';  // Replaced 'Tool' with 'Hammer'
import { useToast } from '@/hooks/use-toast';
import { exportData } from '@/utils/dataExport';

// Mock data for M&P tools
const mpToolsData = [
  { id: 'MPT001', name: 'Torque Wrench', category: 'Hand Tools', location: 'Tool Room A', status: 'Available', lastCalibration: '2023-10-15', nextCalibration: '2024-04-15' },
  { id: 'MPT002', name: 'Digital Multimeter', category: 'Electrical', location: 'Electrical Shop', status: 'In Use', lastCalibration: '2023-11-20', nextCalibration: '2024-05-20' },
  { id: 'MPT003', name: 'Hydraulic Press', category: 'Heavy Equipment', location: 'Workshop B', status: 'Maintenance', lastCalibration: '2023-09-05', nextCalibration: '2024-03-05' },
  { id: 'MPT004', name: 'Laser Alignment Tool', category: 'Precision Tools', location: 'Tool Room A', status: 'Available', lastCalibration: '2023-12-10', nextCalibration: '2024-06-10' },
  { id: 'MPT005', name: 'Pneumatic Drill', category: 'Power Tools', location: 'Workshop A', status: 'Available', lastCalibration: '2023-10-25', nextCalibration: '2024-04-25' },
  { id: 'MPT006', name: 'Oscilloscope', category: 'Electrical', location: 'Electrical Shop', status: 'In Use', lastCalibration: '2023-11-15', nextCalibration: '2024-05-15' },
  { id: 'MPT007', name: 'Welding Machine', category: 'Heavy Equipment', location: 'Workshop B', status: 'Available', lastCalibration: '2023-09-20', nextCalibration: '2024-03-20' },
  { id: 'MPT008', name: 'Pressure Gauge', category: 'Precision Tools', location: 'Tool Room B', status: 'Maintenance', lastCalibration: '2023-08-15', nextCalibration: '2024-02-15' },
];

// Mock data for tool categories
const toolCategories = [
  'Hand Tools',
  'Power Tools',
  'Electrical',
  'Precision Tools',
  'Heavy Equipment',
  'Measuring Instruments',
  'Safety Equipment',
  'Specialized Tools',
];

// Mock data for tool locations
const toolLocations = [
  'Tool Room A',
  'Tool Room B',
  'Workshop A',
  'Workshop B',
  'Electrical Shop',
  'Mechanical Shop',
  'Calibration Lab',
  'Storage Area',
];

const MPToolsManagement = () => {
  const { toast } = useToast();
  const [tools, setTools] = useState(mpToolsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Form state for adding new tool
  const [newTool, setNewTool] = useState({
    name: '',
    category: '',
    location: '',
    status: 'Available',
    lastCalibration: '',
    nextCalibration: '',
    description: '',
  });

  // Filter tools based on search term and filters
  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || tool.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || tool.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle adding a new tool
  const handleAddTool = () => {
    // Validate form
    if (!newTool.name || !newTool.category || !newTool.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create new tool with ID
    const newToolWithId = {
      ...newTool,
      id: `MPT${(tools.length + 1).toString().padStart(3, '0')}`,
    };
    
    // Add to tools list
    setTools([...tools, newToolWithId]);
    
    // Reset form
    setNewTool({
      name: '',
      category: '',
      location: '',
      status: 'Available',
      lastCalibration: '',
      nextCalibration: '',
      description: '',
    });
    
    // Show success message
    toast({
      title: "Tool Added",
      description: `${newToolWithId.name} has been added to the inventory.`,
    });
  };

  // Handle exporting data
  const handleExport = (fileType: 'excel' | 'pdf') => {
    exportData(
      filteredTools,
      'MP_Tools_Inventory',
      fileType,
      'M&P Tools Inventory',
      ['id', 'name', 'category', 'location', 'status', 'lastCalibration', 'nextCalibration']
    );
    
    toast({
      title: "Export Successful",
      description: `The data has been exported to ${fileType.toUpperCase()} format.`,
    });
  };

  // Calculate tools statistics
  const totalTools = tools.length;
  const availableTools = tools.filter(tool => tool.status === 'Available').length;
  const inUseTools = tools.filter(tool => tool.status === 'In Use').length;
  const maintenanceTools = tools.filter(tool => tool.status === 'Maintenance').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">M&P Tools Management</h1>
          <p className="text-muted-foreground">
            Manage and track maintenance plant tools and equipment
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
            Export to Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            Export to PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTools}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{availableTools}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">In Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{inUseTools}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{maintenanceTools}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Search tools..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {toolCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Hammer className="mr-2 h-4 w-4" />
                    Add Tool
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Tool</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new tool to add to the inventory.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Tool Name</Label>
                        <Input
                          id="name"
                          value={newTool.name}
                          onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                          placeholder="Enter tool name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newTool.category}
                          onValueChange={(value) => setNewTool({...newTool, category: value})}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {toolCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Select
                          value={newTool.location}
                          onValueChange={(value) => setNewTool({...newTool, location: value})}
                        >
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {toolLocations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={newTool.status}
                          onValueChange={(value) => setNewTool({...newTool, status: value})}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="In Use">In Use</SelectItem>
                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastCalibration">Last Calibration Date</Label>
                        <Input
                          id="lastCalibration"
                          type="date"
                          value={newTool.lastCalibration}
                          onChange={(e) => setNewTool({...newTool, lastCalibration: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nextCalibration">Next Calibration Date</Label>
                        <Input
                          id="nextCalibration"
                          type="date"
                          value={newTool.nextCalibration}
                          onChange={(e) => setNewTool({...newTool, nextCalibration: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTool.description}
                        onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                        placeholder="Enter tool description and specifications"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddTool}>Add Tool</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Tools Inventory</CardTitle>
              <CardDescription>
                Complete list of all M&P tools and equipment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of all M&P tools in the inventory.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Calibration</TableHead>
                    <TableHead>Next Calibration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTools.map((tool) => (
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium">{tool.id}</TableCell>
                      <TableCell>{tool.name}</TableCell>
                      <TableCell>{tool.category}</TableCell>
                      <TableCell>{tool.location}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tool.status === 'Available' ? 'bg-green-100 text-green-800' :
                          tool.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {tool.status}
                        </span>
                      </TableCell>
                      <TableCell>{tool.lastCalibration}</TableCell>
                      <TableCell>{tool.nextCalibration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calibration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calibration Schedule</CardTitle>
              <CardDescription>
                Upcoming and past calibration activities for tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Tools are sorted by next calibration date, with the most urgent ones at the top.
              </p>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Last Calibration</TableHead>
                    <TableHead>Next Calibration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...tools]
                    .sort((a, b) => new Date(a.nextCalibration).getTime() - new Date(b.nextCalibration).getTime())
                    .map((tool) => (
                      <TableRow key={tool.id}>
                        <TableCell className="font-medium">{tool.id}</TableCell>
                        <TableCell>{tool.name}</TableCell>
                        <TableCell>{tool.category}</TableCell>
                        <TableCell>{tool.lastCalibration}</TableCell>
                        <TableCell>{tool.nextCalibration}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            new Date(tool.nextCalibration) < new Date() ? 'bg-red-100 text-red-800' :
                            new Date(tool.nextCalibration) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {new Date(tool.nextCalibration) < new Date() ? 'Overdue' :
                             new Date(tool.nextCalibration) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'Due Soon' :
                             'On Schedule'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Records</CardTitle>
              <CardDescription>
                History of tool maintenance and repairs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                <Hammer className="h-12 w-12 mx-auto mb-2" />
                Maintenance records will be displayed here.
                <br />
                This feature is coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MPToolsManagement;
