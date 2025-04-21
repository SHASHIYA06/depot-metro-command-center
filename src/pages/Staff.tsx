
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  BadgeCheck,
  Building,
  Award,
  Briefcase,
  Truck,
  CreditCard,
  UserPlus,
  Save
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { staffUsers } from '@/lib/mockDataStaff';
import { User as UserType, UserRole } from '@/types';
import StaffAttendance from '@/components/staff/StaffAttendance';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Staff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: UserRole.TECHNICIAN as UserRole,
    badgeNo: '',
    aadharNo: '',
    phone: '',
    vehicleNo: '',
    department: ''
  });

  // Define all users with proper classifications
  const allStaff = staffUsers;
  const depotIncharge = allStaff.filter(u => u.role === UserRole.DEPOT_INCHARGE);
  const engineers = allStaff.filter(u => u.role === UserRole.ENGINEER);
  const technicians = allStaff.filter(u => u.role === UserRole.TECHNICIAN);
  const storePersons = allStaff.filter(u => u.role === UserRole.STORE_PERSON);
  const dataEntryOperators = allStaff.filter(u => u.role === UserRole.DATA_ENTRY_OPERATOR);

  const handleNavigateToAttendance = () => {
    navigate('/staff-attendance');
  };

  const filteredStaff = allStaff.filter(staff => 
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (staff.badgeNo && staff.badgeNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (staff.phone && staff.phone.includes(searchTerm))
  );

  const handleAddStaff = () => {
    setIsAddStaffOpen(true);
  };

  const handleNewStaffChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setNewStaff(prev => ({ ...prev, role: value as UserRole }));
  };

  const handleDepartmentChange = (value: string) => {
    setNewStaff(prev => ({ ...prev, department: value }));
  };

  const handleSubmitNewStaff = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newStaff.name || !newStaff.email || !newStaff.badgeNo || !newStaff.phone) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    // In a real app, this would be an API call
    const photoMap = {
      [UserRole.DEPOT_INCHARGE]: '/avatars/depot_incharge.jpg',
      [UserRole.ENGINEER]: '/avatars/engineer.jpg',
      [UserRole.TECHNICIAN]: '/avatars/technician.jpg',
      [UserRole.STORE_PERSON]: '/avatars/store_person.jpg',
      [UserRole.DATA_ENTRY_OPERATOR]: '/avatars/data_entry_operator.jpg',
    };
    
    const newStaffMember: UserType = {
      id: `user-${Date.now()}`,
      ...newStaff,
      photoUrl: photoMap[newStaff.role],
      avatar: photoMap[newStaff.role],
      joiningDate: new Date().toISOString().split('T')[0]
    };
    
    // In a real app, we would add this to the database
    staffUsers.push(newStaffMember);
    
    toast({
      title: 'Staff Added',
      description: `${newStaff.name} has been added successfully`
    });
    
    setIsAddStaffOpen(false);
    setNewStaff({
      name: '',
      email: '',
      role: UserRole.TECHNICIAN,
      badgeNo: '',
      aadharNo: '',
      phone: '',
      vehicleNo: '',
      department: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage depot staff, roles, and attendance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {user?.role === UserRole.DEPOT_INCHARGE && (
            <Button onClick={handleAddStaff}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          )}
          <Button variant="outline" onClick={handleNavigateToAttendance}>
            <Calendar className="mr-2 h-4 w-4" />
            View Attendance
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:w-[400px]">
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="directory" className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name, badge, department..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Depot Incharge */}
          {(searchTerm === '' || depotIncharge.some(staff => 
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
          )) && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Depot Incharge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {depotIncharge
                  .filter(staff => 
                    searchTerm === '' ||
                    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(staff => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))
                }
              </div>
            </div>
          )}

          {/* Engineers */}
          {(searchTerm === '' || engineers.some(staff => 
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
          )) && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Engineers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {engineers
                  .filter(staff => 
                    searchTerm === '' ||
                    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(staff => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))
                }
              </div>
            </div>
          )}

          {/* Technicians/Employees */}
          {(searchTerm === '' || technicians.some(staff => 
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
          )) && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Employees</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {technicians
                  .filter(staff => 
                    searchTerm === '' ||
                    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(staff => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))
                }
              </div>
            </div>
          )}

          {/* Store Persons */}
          {(searchTerm === '' || storePersons.some(staff => 
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
          )) && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Store Persons</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {storePersons
                  .filter(staff => 
                    searchTerm === '' ||
                    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(staff => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))
                }
              </div>
            </div>
          )}

          {/* Data Entry Operators */}
          {(searchTerm === '' || dataEntryOperators.some(staff => 
            staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
          )) && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Data Entry Operators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dataEntryOperators
                  .filter(staff => 
                    searchTerm === '' ||
                    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (staff.department && staff.department.toLowerCase().includes(searchTerm.toLowerCase()))
                  )
                  .map(staff => (
                    <StaffCard key={staff.id} staff={staff} />
                  ))
                }
              </div>
            </div>
          )}

          {/* No results */}
          {filteredStaff.length === 0 && (
            <div className="text-center py-10">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No staff members found</h3>
              <p className="text-muted-foreground mt-1">Try using different search terms</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="attendance">
          <StaffAttendance />
        </TabsContent>
      </Tabs>

      {/* Add Staff Dialog */}
      <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
            <DialogDescription>
              Add a new staff member to the system. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitNewStaff} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={newStaff.name}
                  onChange={handleNewStaffChange}
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newStaff.email}
                  onChange={handleNewStaffChange}
                  placeholder="Enter email address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select 
                  value={newStaff.role} 
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.DEPOT_INCHARGE}>Depot Incharge</SelectItem>
                    <SelectItem value={UserRole.ENGINEER}>Engineer</SelectItem>
                    <SelectItem value={UserRole.TECHNICIAN}>Employee</SelectItem>
                    <SelectItem value={UserRole.STORE_PERSON}>Store Person</SelectItem>
                    <SelectItem value={UserRole.DATA_ENTRY_OPERATOR}>Data Entry Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  onValueChange={handleDepartmentChange}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Stores">Stores</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="badgeNo">Badge Number *</Label>
                <Input
                  id="badgeNo"
                  name="badgeNo"
                  value={newStaff.badgeNo}
                  onChange={handleNewStaffChange}
                  placeholder="Enter badge number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newStaff.phone}
                  onChange={handleNewStaffChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aadharNo">Aadhar Number</Label>
                <Input
                  id="aadharNo"
                  name="aadharNo"
                  value={newStaff.aadharNo}
                  onChange={handleNewStaffChange}
                  placeholder="Enter Aadhar number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleNo">Vehicle Number</Label>
                <Input
                  id="vehicleNo"
                  name="vehicleNo"
                  value={newStaff.vehicleNo}
                  onChange={handleNewStaffChange}
                  placeholder="Enter vehicle number (if any)"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddStaffOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Staff
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Staff Card Component
const StaffCard = ({ staff }: { staff: UserType }) => {
  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          {staff.photoUrl ? (
            <img 
              src={staff.photoUrl} 
              alt={staff.name} 
              className="w-20 h-20 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{staff.name}</h3>
            <p className="text-sm text-muted-foreground">{staff.role.replace('_', ' ')}</p>
            {staff.department && (
              <p className="text-xs text-muted-foreground">{staff.department}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          {staff.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${staff.phone}`} className="text-primary hover:underline">
                {staff.phone}
              </a>
            </div>
          )}
          
          {staff.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a href={`mailto:${staff.email}`} className="text-primary hover:underline truncate">
                {staff.email}
              </a>
            </div>
          )}
          
          {staff.badgeNo && (
            <div className="flex items-center gap-2 text-sm">
              <BadgeCheck className="h-4 w-4 text-muted-foreground" />
              <span>Badge: {staff.badgeNo}</span>
            </div>
          )}
          
          {staff.joiningDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined: {new Date(staff.joiningDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {staff.aadharNo && (
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>Aadhar: {staff.aadharNo}</span>
            </div>
          )}
          
          {staff.vehicleNo && staff.vehicleNo !== 'NA' && (
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span>Vehicle: {staff.vehicleNo}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/10 px-6 py-2">
        <Button variant="ghost" className="w-full text-xs">View Full Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default Staff;
