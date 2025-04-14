
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Mail, Phone, Building, UserPlus, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/lib/mockData';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Staff = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  
  // Only depot incharge can access this page
  const isDepotIncharge = user?.role === UserRole.DEPOT_INCHARGE;
  
  // Filter staff members based on search term and active tab
  const filteredStaff = users.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'engineers') return matchesSearch && staff.role === UserRole.ENGINEER;
    if (activeTab === 'technicians') return matchesSearch && staff.role === UserRole.TECHNICIAN;
    
    return matchesSearch;
  });
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.DEPOT_INCHARGE:
        return 'Depot Incharge';
      case UserRole.ENGINEER:
        return 'Engineer';
      case UserRole.TECHNICIAN:
        return 'Technician';
      default:
        return 'Staff';
    }
  };

  const handleAddNewStaff = () => {
    toast({
      title: "Staff Member Added",
      description: "The new staff member has been added successfully.",
    });
    setShowAddStaffForm(false);
  };

  // Add staff form component
  const AddStaffForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add New Staff Member</CardTitle>
        <CardDescription>Fill in the details to add a new staff member to the system</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleAddNewStaff(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input id="name" placeholder="Enter full name" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email Address</label>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
              <Input id="phone" placeholder="Enter phone number" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <select id="role" className="w-full px-3 py-2 border rounded-md">
                <option value={UserRole.ENGINEER}>Engineer</option>
                <option value={UserRole.TECHNICIAN}>Technician</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">Department</label>
              <Input id="department" placeholder="Enter department" />
            </div>
            <div className="space-y-2">
              <label htmlFor="joiningDate" className="text-sm font-medium">Joining Date</label>
              <Input id="joiningDate" type="date" required />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowAddStaffForm(false)}>Cancel</Button>
            <Button type="submit">Add Staff Member</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            View and manage staff members in the metro depot
          </p>
        </div>
        
        {isDepotIncharge && (
          <Button onClick={() => setShowAddStaffForm(!showAddStaffForm)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Staff
          </Button>
        )}
      </div>

      {showAddStaffForm && <AddStaffForm />}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff members..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="engineers">Engineers</TabsTrigger>
              <TabsTrigger value="technicians">Technicians</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-primary/10 p-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={staff.avatar} />
                  <AvatarFallback className="text-2xl">{getInitials(staff.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{staff.name}</h3>
                <p className="text-muted-foreground">{getRoleName(staff.role)}</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${staff.email}`} className="text-sm hover:underline">
                    {staff.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:123-456-7890`} className="text-sm hover:underline">
                    123-456-7890
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {staff.department || 'Engineering Department'}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={`mailto:${staff.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={`tel:123-456-7890`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Staff;
