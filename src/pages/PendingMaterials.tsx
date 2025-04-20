
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, Truck, Wrench, X, ShoppingCart, Package, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// Mock data for pending materials
const mockPendingMaterials = [
  {
    id: 'mat1',
    materialName: 'Brake Pads Type-A',
    quantity: 10,
    priority: 'high',
    requestedBy: 'Sunil Kumar Rajan',
    requestedFor: 'Train TS04 Car DMC1',
    requestDate: '2025-04-15',
    status: 'pending',
    taskId: 'task123',
    remarks: 'Essential for scheduled maintenance, current stock depleted'
  },
  {
    id: 'mat2',
    materialName: 'Electrical Connector XYZ-1242',
    quantity: 5,
    priority: 'medium',
    requestedBy: 'Shilpa Sahu',
    requestedFor: 'Train TS06 Car MC2',
    requestDate: '2025-04-10',
    status: 'ordered',
    taskId: 'task124',
    remarks: 'Required for electrical system repair, ordered from supplier ABC'
  },
  {
    id: 'mat3',
    materialName: 'Door Mechanism Repair Kit',
    quantity: 2,
    priority: 'urgent',
    requestedBy: 'Arghya Kar',
    requestedFor: 'Train TS03 Car DMC2',
    requestDate: '2025-04-18',
    status: 'pending',
    taskId: 'task125',
    remarks: 'Door mechanism failing intermittently, causing service disruptions'
  },
  {
    id: 'mat4',
    materialName: 'Air Filter Set',
    quantity: 15,
    priority: 'low',
    requestedBy: 'Ritesh Anand',
    requestedFor: 'Train TS08 All Cars',
    requestDate: '2025-04-05',
    status: 'received',
    taskId: 'task126',
    remarks: 'Regular maintenance item, received on April 18th'
  },
  {
    id: 'mat5',
    materialName: 'HVAC Compressor Unit',
    quantity: 1,
    priority: 'high',
    requestedBy: 'Shirshendu Majumdar',
    requestedFor: 'Train TS12 Car TC2',
    requestDate: '2025-04-12',
    status: 'pending',
    taskId: 'task127',
    remarks: 'HVAC system non-operational, passengers complaining about temperature'
  },
  {
    id: 'mat6',
    materialName: 'Train Control Module SW-3456',
    quantity: 1,
    priority: 'urgent',
    requestedBy: 'Shashi Shekhar Mishra',
    requestedFor: 'Train TS15 Car MC1',
    requestDate: '2025-04-17',
    status: 'ordered',
    taskId: 'task128',
    remarks: 'Control module failed diagnostics, replacement ordered from OEM'
  },
];

const PendingMaterials = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Filter materials based on search, tab and priority
  const filteredMaterials = mockPendingMaterials.filter(material => {
    const matchesSearch = 
      material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.requestedFor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'pending' && material.status === 'pending') ||
      (activeTab === 'ordered' && material.status === 'ordered') ||
      (activeTab === 'received' && material.status === 'received');
    
    const matchesPriority = 
      priorityFilter === 'all' || material.priority === priorityFilter;
    
    return matchesSearch && matchesTab && matchesPriority;
  });
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-600">Pending</Badge>;
      case 'ordered':
        return <Badge variant="outline" className="bg-blue-100 text-blue-600">Ordered</Badge>;
      case 'received':
        return <Badge variant="outline" className="bg-green-100 text-green-600">Received</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-600">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-100 text-blue-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-600">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pending Materials</h1>
          <p className="text-muted-foreground">
            Track material shortages and pending requests for maintenance tasks
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filter
          </Button>
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" />
            New Material Request
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="w-full md:w-3/4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search materials, trains, or requesters..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <Label htmlFor="priority-filter" className="mr-2">Priority</Label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger id="priority-filter" className="w-[130px]">
                        <SelectValue placeholder="All Priorities" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-3">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="ordered">Ordered</TabsTrigger>
                  <TabsTrigger value="received">Received</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>For</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.length > 0 ? (
                      filteredMaterials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell className="font-medium">{material.materialName}</TableCell>
                          <TableCell>{material.quantity}</TableCell>
                          <TableCell>{getPriorityBadge(material.priority)}</TableCell>
                          <TableCell>{material.requestedBy}</TableCell>
                          <TableCell>{material.requestedFor}</TableCell>
                          <TableCell>{new Date(material.requestDate).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(material.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Wrench className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center py-4">
                            <Package className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-lg font-medium mb-1">No materials found</p>
                            <p className="text-muted-foreground mb-4">
                              {searchTerm ? 'Try a different search term or filter' : 'No pending material requests match your criteria'}
                            </p>
                            <Button>Create New Request</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Material Summary</CardTitle>
              <CardDescription>Current material request status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <span>Pending</span>
                  </div>
                  <Badge variant="outline">{mockPendingMaterials.filter(m => m.status === 'pending').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                    <span>Ordered</span>
                  </div>
                  <Badge variant="outline">{mockPendingMaterials.filter(m => m.status === 'ordered').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                    <span>Received</span>
                  </div>
                  <Badge variant="outline">{mockPendingMaterials.filter(m => m.status === 'received').length}</Badge>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center font-medium mb-2">
                    <span>Total Requests</span>
                    <span>{mockPendingMaterials.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Urgent Priority</span>
                    <span>{mockPendingMaterials.filter(m => m.priority === 'urgent').length}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Material Report
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Procurement Status</CardTitle>
              <CardDescription>Recent material order updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <p className="font-medium text-sm">Material Shipment Update</p>
                  </div>
                  <p className="text-sm text-muted-foreground">HVAC parts arriving April 22, 2025</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <p className="font-medium text-sm">Order Approved</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Electrical components order #45678 approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PendingMaterials;
