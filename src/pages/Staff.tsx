
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Mail, 
  Phone, 
  Building, 
  UserPlus, 
  Filter, 
  Calendar, 
  GraduationCap, 
  MapPin,
  BadgeCheck,
  CreditCard,
  Car,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { users } from '@/lib/mockData';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

const Staff = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showAddStaffForm, setShowAddStaffForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<typeof users[0] | null>(null);
  
  // Only depot incharge can access this page
  const isDepotIncharge = user?.role === UserRole.DEPOT_INCHARGE;
  
  // Filter staff members based on search term and active tab
  const filteredStaff = users.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (staff.badgeNo && staff.badgeNo.toLowerCase().includes(searchTerm.toLowerCase()));
    
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

  const viewStaffDetails = (staff: typeof users[0]) => {
    setSelectedStaff(staff);
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
              <label htmlFor="badgeNo" className="text-sm font-medium">Badge Number</label>
              <Input id="badgeNo" placeholder="Enter badge number" required />
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
              <label htmlFor="aadharNo" className="text-sm font-medium">Aadhar Number</label>
              <Input id="aadharNo" placeholder="Enter Aadhar number" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="vehicleNo" className="text-sm font-medium">Vehicle Number</label>
              <Input id="vehicleNo" placeholder="Enter vehicle number (NA if not applicable)" />
            </div>
            <div className="space-y-2">
              <label htmlFor="joiningDate" className="text-sm font-medium">Joining Date</label>
              <Input id="joiningDate" type="date" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input id="address" placeholder="Enter address" />
            </div>
            <div className="space-y-2">
              <label htmlFor="education" className="text-sm font-medium">Education</label>
              <Input id="education" placeholder="Enter education qualifications" />
            </div>
            <div className="space-y-2">
              <label htmlFor="emergency" className="text-sm font-medium">Emergency Contact</label>
              <Input id="emergency" placeholder="Emergency contact number" />
            </div>
            <div className="space-y-2">
              <label htmlFor="skills" className="text-sm font-medium">Skills (comma separated)</label>
              <Input id="skills" placeholder="e.g. Electrical, Mechanical, Programming" />
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
          <Card key={staff.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="bg-primary/10 p-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={staff.avatar} />
                  <AvatarFallback className="text-2xl">{getInitials(staff.name)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{staff.name}</h3>
                <p className="text-muted-foreground">{getRoleName(staff.role)}</p>
                {staff.badgeNo && (
                  <Badge variant="outline" className="mt-2">{staff.badgeNo}</Badge>
                )}
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
                  <a href={`tel:${staff.phone || "9876543210"}`} className="text-sm hover:underline">
                    {staff.phone || "9876543210"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {staff.department || 'Engineering Department'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Aadhar: {staff.aadharNo || 'N/A'}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => viewStaffDetails(staff)}>
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={`tel:${staff.phone || "9876543210"}`}>
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

      {/* Staff Detail Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Staff Profile</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedStaff?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedStaff && (
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedStaff.avatar} alt={selectedStaff.name} />
                  <AvatarFallback>{getInitials(selectedStaff.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedStaff.name}</h3>
                  <p className="text-muted-foreground">{getRoleName(selectedStaff.role)}</p>
                  <Badge variant="outline" className="mt-1">{selectedStaff.badgeNo}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedStaff.email}`} className="text-sm hover:underline">
                      {selectedStaff.email}
                    </a>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedStaff.phone}`} className="text-sm hover:underline">
                      {selectedStaff.phone || "9876543210"}
                    </a>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Badge Number</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedStaff.badgeNo || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Aadhar Number</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedStaff.aadharNo || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Vehicle Number</p>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedStaff.vehicleNo || 'N/A'}</span>
                  </div>
                </div>
                
                {selectedStaff.joiningDate && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Joining Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {format(new Date(selectedStaff.joiningDate), 'dd MMMM yyyy')}
                      </span>
                    </div>
                  </div>
                )}
                
                {selectedStaff.education && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Education</p>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedStaff.education}</span>
                    </div>
                  </div>
                )}
                
                {selectedStaff.department && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Department</p>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedStaff.department}</span>
                    </div>
                  </div>
                )}
                
                {selectedStaff.address && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-sm font-medium">Address</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedStaff.address}</span>
                    </div>
                  </div>
                )}
                
                {selectedStaff.emergencyContact && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Emergency Contact</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${selectedStaff.emergencyContact}`} className="text-sm hover:underline">
                        {selectedStaff.emergencyContact}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {selectedStaff.skills && selectedStaff.skills.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-2">Skills & Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedStaff.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        <BadgeCheck className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex gap-2 justify-end">
                  {isDepotIncharge && (
                    <Button variant="outline">Edit Details</Button>
                  )}
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground text-right">
        <p>Depot Incharge: Shashi Shekhar Mishra</p>
        <p>Email: shashiaaidu@gmail.com</p>
      </div>
    </div>
  );
};

export default Staff;
