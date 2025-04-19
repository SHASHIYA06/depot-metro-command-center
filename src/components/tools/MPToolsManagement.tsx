
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertCircle,
  Calendar,
  Download,
  Search,
  Tool,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { format, addDays, isAfter, isBefore, differenceInDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { exportData } from '@/utils/dataExport';

// Tool status types
type ToolStatus = 'available' | 'in_use' | 'maintenance' | 'out_of_service';

// AMC status types
type AMCStatus = 'active' | 'expiring_soon' | 'expired';

// Tool interface
interface Tool {
  id: string;
  name: string;
  category: string;
  location: string;
  status: ToolStatus;
  amcStartDate: Date;
  amcExpiryDate: Date;
  amcStatus: AMCStatus;
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
  model: string;
  serialNumber: string;
  manufacturer: string;
  purchaseDate: Date;
  notes?: string;
}

// Mock data for tools
const mockTools: Tool[] = [
  {
    id: 'T001',
    name: 'Torque Wrench',
    category: 'Hand Tools',
    location: 'Tool Room A',
    status: 'available',
    amcStartDate: new Date(2024, 1, 15),
    amcExpiryDate: addDays(new Date(), 45),
    amcStatus: 'active',
    lastMaintenanceDate: new Date(2024, 2, 10),
    nextMaintenanceDate: addDays(new Date(), 60),
    model: 'TW-500',
    serialNumber: 'TW12345',
    manufacturer: 'ToolCraft',
    purchaseDate: new Date(2022, 5, 10),
    notes: 'Range: 10-150 Nm',
  },
  {
    id: 'T002',
    name: 'Hydraulic Press',
    category: 'Heavy Equipment',
    location: 'Workshop B',
    status: 'in_use',
    amcStartDate: new Date(2024, 0, 5),
    amcExpiryDate: addDays(new Date(), 15),
    amcStatus: 'expiring_soon',
    lastMaintenanceDate: new Date(2024, 3, 5),
    nextMaintenanceDate: addDays(new Date(), 20),
    model: 'HP-2000',
    serialNumber: 'HP78901',
    manufacturer: 'HydroTech',
    purchaseDate: new Date(2021, 8, 22),
  },
  {
    id: 'T003',
    name: 'Digital Multimeter',
    category: 'Electrical Tools',
    location: 'Electronics Lab',
    status: 'available',
    amcStartDate: new Date(2023, 11, 10),
    amcExpiryDate: addDays(new Date(), -15),
    amcStatus: 'expired',
    lastMaintenanceDate: new Date(2024, 2, 20),
    nextMaintenanceDate: addDays(new Date(), 90),
    model: 'DM-350',
    serialNumber: 'DM45678',
    manufacturer: 'ElectroMeasure',
    purchaseDate: new Date(2023, 2, 8),
    notes: 'Calibration required annually',
  },
  {
    id: 'T004',
    name: 'Air Compressor',
    category: 'Power Tools',
    location: 'Workshop A',
    status: 'maintenance',
    amcStartDate: new Date(2023, 9, 20),
    amcExpiryDate: addDays(new Date(), -5),
    amcStatus: 'expired',
    lastMaintenanceDate: new Date(2024, 2, 28),
    nextMaintenanceDate: addDays(new Date(), -10),
    model: 'AC-1500',
    serialNumber: 'AC23456',
    manufacturer: 'AirPower',
    purchaseDate: new Date(2022, 1, 15),
  },
  {
    id: 'T005',
    name: 'Wheel Alignment Machine',
    category: 'Diagnostic Equipment',
    location: 'Maintenance Bay 3',
    status: 'available',
    amcStartDate: new Date(2024, 2, 1),
    amcExpiryDate: addDays(new Date(), 320),
    amcStatus: 'active',
    lastMaintenanceDate: new Date(2024, 3, 1),
    nextMaintenanceDate: addDays(new Date(), 5),
    model: 'WA-600',
    serialNumber: 'WA89012',
    manufacturer: 'AlignTech',
    purchaseDate: new Date(2022, 7, 3),
  },
];

// Calculate AMC status
const calculateAMCStatus = (expiryDate: Date): AMCStatus => {
  const today = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, today);
  
  if (daysUntilExpiry < 0) {
    return 'expired';
  } else if (daysUntilExpiry <= 30) {
    return 'expiring_soon';
  } else {
    return 'active';
  }
};

// Format AMC status for display
const formatAMCStatus = (status: AMCStatus): { text: string; color: string } => {
  switch (status) {
    case 'expired':
      return { text: 'Expired', color: 'text-red-600 bg-red-100' };
    case 'expiring_soon':
      return { text: 'Expiring Soon', color: 'text-amber-600 bg-amber-100' };
    case 'active':
      return { text: 'Active', color: 'text-green-600 bg-green-100' };
  }
};

// Format tool status for display
const formatToolStatus = (status: ToolStatus): { text: string; color: string } => {
  switch (status) {
    case 'available':
      return { text: 'Available', color: 'text-green-600 bg-green-100' };
    case 'in_use':
      return { text: 'In Use', color: 'text-blue-600 bg-blue-100' };
    case 'maintenance':
      return { text: 'Maintenance', color: 'text-amber-600 bg-amber-100' };
    case 'out_of_service':
      return { text: 'Out of Service', color: 'text-red-600 bg-red-100' };
  }
};

const MPToolsManagement: React.FC = () => {
  const { toast } = useToast();
  const [tools, setTools] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAMCStatus, setFilterAMCStatus] = useState('all');
  
  // Tool form state
  const [isAddToolOpen, setIsAddToolOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [toolName, setToolName] = useState('');
  const [toolCategory, setToolCategory] = useState('');
  const [toolLocation, setToolLocation] = useState('');
  const [toolStatus, setToolStatus] = useState<ToolStatus>('available');
  const [toolModel, setToolModel] = useState('');
  const [toolManufacturer, setToolManufacturer] = useState('');
  const [toolSerialNumber, setToolSerialNumber] = useState('');
  const [toolNotes, setToolNotes] = useState('');
  const [amcStartDate, setAmcStartDate] = useState<Date | undefined>(new Date());
  const [amcExpiryDate, setAmcExpiryDate] = useState<Date | undefined>(addDays(new Date(), 365));
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState<Date | undefined>(new Date());
  const [nextMaintenanceDate, setNextMaintenanceDate] = useState<Date | undefined>(addDays(new Date(), 90));
  const [purchaseDate, setPurchaseDate] = useState<Date | undefined>(new Date());
  
  // Load mock data
  useEffect(() => {
    setTools(mockTools);
  }, []);
  
  // Reset form
  const resetForm = () => {
    setToolName('');
    setToolCategory('');
    setToolLocation('');
    setToolStatus('available');
    setToolModel('');
    setToolManufacturer('');
    setToolSerialNumber('');
    setToolNotes('');
    setAmcStartDate(new Date());
    setAmcExpiryDate(addDays(new Date(), 365));
    setLastMaintenanceDate(new Date());
    setNextMaintenanceDate(addDays(new Date(), 90));
    setPurchaseDate(new Date());
    setEditingTool(null);
  };
  
  // Open edit tool dialog
  const openEditToolDialog = (tool: Tool) => {
    setEditingTool(tool);
    setToolName(tool.name);
    setToolCategory(tool.category);
    setToolLocation(tool.location);
    setToolStatus(tool.status);
    setToolModel(tool.model);
    setToolManufacturer(tool.manufacturer);
    setToolSerialNumber(tool.serialNumber);
    setToolNotes(tool.notes || '');
    setAmcStartDate(tool.amcStartDate);
    setAmcExpiryDate(tool.amcExpiryDate);
    setLastMaintenanceDate(tool.lastMaintenanceDate);
    setNextMaintenanceDate(tool.nextMaintenanceDate);
    setPurchaseDate(tool.purchaseDate);
    setIsAddToolOpen(true);
  };
  
  // Handle save tool
  const handleSaveTool = () => {
    if (!toolName || !toolCategory || !toolLocation || !toolStatus || !amcStartDate || !amcExpiryDate || !lastMaintenanceDate || !nextMaintenanceDate || !purchaseDate) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    const amcStatus = calculateAMCStatus(amcExpiryDate);
    
    if (editingTool) {
      // Update existing tool
      const updatedTools = tools.map(tool => 
        tool.id === editingTool.id
          ? {
              ...tool,
              name: toolName,
              category: toolCategory,
              location: toolLocation,
              status: toolStatus,
              model: toolModel,
              manufacturer: toolManufacturer,
              serialNumber: toolSerialNumber,
              notes: toolNotes,
              amcStartDate,
              amcExpiryDate,
              amcStatus,
              lastMaintenanceDate,
              nextMaintenanceDate,
              purchaseDate,
            }
          : tool
      );
      
      setTools(updatedTools);
      toast({
        title: 'Tool Updated',
        description: `${toolName} has been updated successfully`,
      });
    } else {
      // Add new tool
      const newTool: Tool = {
        id: `T${(tools.length + 1).toString().padStart(3, '0')}`,
        name: toolName,
        category: toolCategory,
        location: toolLocation,
        status: toolStatus,
        model: toolModel,
        manufacturer: toolManufacturer,
        serialNumber: toolSerialNumber,
        notes: toolNotes,
        amcStartDate,
        amcExpiryDate,
        amcStatus,
        lastMaintenanceDate,
        nextMaintenanceDate,
        purchaseDate,
      };
      
      setTools([...tools, newTool]);
      toast({
        title: 'Tool Added',
        description: `${toolName} has been added successfully`,
      });
    }
    
    resetForm();
    setIsAddToolOpen(false);
  };
  
  // Handle delete tool
  const handleDeleteTool = (id: string) => {
    setTools(tools.filter(tool => tool.id !== id));
    toast({
      title: 'Tool Deleted',
      description: 'The tool has been deleted successfully',
    });
  };
  
  // Filter tools based on search and filters
  const filteredTools = tools.filter(tool => {
    // Filter by search term
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by tool status
    const matchesStatus = filterStatus === 'all' || tool.status === filterStatus;
    
    // Filter by AMC status
    const matchesAMCStatus = filterAMCStatus === 'all' || tool.amcStatus === filterAMCStatus;
    
    return matchesSearch && matchesStatus && matchesAMCStatus;
  });
  
  // Handle export
  const handleExport = (type: 'excel' | 'pdf') => {
    // Format data for export
    const exportData = filteredTools.map(tool => ({
      'ID': tool.id,
      'Name': tool.name,
      'Category': tool.category,
      'Location': tool.location,
      'Status': formatToolStatus(tool.status).text,
      'Model': tool.model,
      'Manufacturer': tool.manufacturer,
      'Serial Number': tool.serialNumber,
      'Purchase Date': format(tool.purchaseDate, 'PPP'),
      'AMC Start Date': format(tool.amcStartDate, 'PPP'),
      'AMC Expiry Date': format(tool.amcExpiryDate, 'PPP'),
      'AMC Status': formatAMCStatus(tool.amcStatus).text,
      'Last Maintenance': format(tool.lastMaintenanceDate, 'PPP'),
      'Next Maintenance': format(tool.nextMaintenanceDate, 'PPP'),
      'Notes': tool.notes || '',
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
      exportData(data, 'MP_Tools_Inventory', 'excel');
      toast({
        title: 'Export Successful',
        description: 'M&P Tools inventory has been exported to Excel',
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
        'MP_Tools_Inventory',
        'pdf',
        'M&P Tools Inventory',
        ['ID', 'Name', 'Category', 'Location', 'Status', 'Model', 'Manufacturer', 'Serial Number', 'AMC Expiry Date', 'AMC Status', 'Next Maintenance']
      );
      toast({
        title: 'Export Successful',
        description: 'M&P Tools inventory has been exported to PDF',
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
  const toolStats = {
    total: tools.length,
    available: tools.filter(tool => tool.status === 'available').length,
    inUse: tools.filter(tool => tool.status === 'in_use').length,
    maintenance: tools.filter(tool => tool.status === 'maintenance').length,
    outOfService: tools.filter(tool => tool.status === 'out_of_service').length,
    expiredAMC: tools.filter(tool => tool.amcStatus === 'expired').length,
    expiringAMC: tools.filter(tool => tool.amcStatus === 'expiring_soon').length,
    maintenanceDue: tools.filter(tool => isBefore(tool.nextMaintenanceDate, new Date())).length,
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">M&P Tools Management</h1>
          <p className="text-muted-foreground">
            Manage tools, equipment, and AMC contracts
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { setIsAddToolOpen(true); resetForm(); }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Tool
          </Button>
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{toolStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Available Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{toolStats.available}</div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AMC Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{toolStats.expiredAMC}</div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">AMC Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{toolStats.expiringAMC}</div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Tools Inventory</CardTitle>
            <CardDescription>Manage and track M&P tools and equipment</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full sm:w-[280px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in_use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="out_of_service">Out of Service</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterAMCStatus} onValueChange={setFilterAMCStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="AMC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All AMC Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Inventory of {filteredTools.length} tools and equipment</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AMC Expiry</TableHead>
                <TableHead>AMC Status</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTools.length > 0 ? (
                filteredTools.map((tool) => {
                  const { text: toolStatusText, color: toolStatusColor } = formatToolStatus(tool.status);
                  const { text: amcStatusText, color: amcStatusColor } = formatAMCStatus(tool.amcStatus);
                  
                  return (
                    <TableRow key={tool.id}>
                      <TableCell className="font-medium">{tool.id}</TableCell>
                      <TableCell>{tool.name}</TableCell>
                      <TableCell>{tool.category}</TableCell>
                      <TableCell>{tool.location}</TableCell>
                      <TableCell>
                        <Badge className={toolStatusColor}>{toolStatusText}</Badge>
                      </TableCell>
                      <TableCell>{format(tool.amcExpiryDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <Badge className={amcStatusColor}>{amcStatusText}</Badge>
                      </TableCell>
                      <TableCell>{format(tool.nextMaintenanceDate, 'MMM dd, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditToolDialog(tool)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteTool(tool.id)}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mb-2" />
                      <p>No tools found</p>
                      <p className="text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Tool Dialog */}
      <Dialog open={isAddToolOpen} onOpenChange={setIsAddToolOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
            <DialogDescription>
              {editingTool ? 'Update the tool details below' : 'Fill in the tool details below to add it to the inventory'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tool-name">Tool Name</Label>
              <Input
                id="tool-name"
                placeholder="Enter tool name"
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tool-category">Category</Label>
              <Input
                id="tool-category"
                placeholder="Enter category"
                value={toolCategory}
                onChange={(e) => setToolCategory(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tool-location">Location</Label>
              <Input
                id="tool-location"
                placeholder="Enter location"
                value={toolLocation}
                onChange={(e) => setToolLocation(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tool-status">Status</Label>
              <Select value={toolStatus} onValueChange={(value: ToolStatus) => setToolStatus(value)}>
                <SelectTrigger id="tool-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="in_use">In Use</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tool-model">Model</Label>
              <Input
                id="tool-model"
                placeholder="Enter model"
                value={toolModel}
                onChange={(e) => setToolModel(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tool-manufacturer">Manufacturer</Label>
              <Input
                id="tool-manufacturer"
                placeholder="Enter manufacturer"
                value={toolManufacturer}
                onChange={(e) => setToolManufacturer(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tool-serial">Serial Number</Label>
              <Input
                id="tool-serial"
                placeholder="Enter serial number"
                value={toolSerialNumber}
                onChange={(e) => setToolSerialNumber(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Purchase Date</Label>
              <DatePicker date={purchaseDate} setDate={setPurchaseDate} />
            </div>
            
            <div className="space-y-2">
              <Label>AMC Start Date</Label>
              <DatePicker date={amcStartDate} setDate={setAmcStartDate} />
            </div>
            
            <div className="space-y-2">
              <Label>AMC Expiry Date</Label>
              <DatePicker date={amcExpiryDate} setDate={setAmcExpiryDate} />
            </div>
            
            <div className="space-y-2">
              <Label>Last Maintenance Date</Label>
              <DatePicker date={lastMaintenanceDate} setDate={setLastMaintenanceDate} />
            </div>
            
            <div className="space-y-2">
              <Label>Next Maintenance Date</Label>
              <DatePicker date={nextMaintenanceDate} setDate={setNextMaintenanceDate} />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tool-notes">Notes</Label>
              <Textarea
                id="tool-notes"
                placeholder="Enter additional notes"
                rows={3}
                value={toolNotes}
                onChange={(e) => setToolNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToolOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTool}>{editingTool ? 'Update Tool' : 'Add Tool'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MPToolsManagement;
