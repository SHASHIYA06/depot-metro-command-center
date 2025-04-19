
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { users } from '@/lib/mockData';
import { UserRole } from '@/types';
import StaffAttendance from '@/components/staff/StaffAttendance';

const Staff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');

  // Define all users with proper classifications
  const allStaff = users;
  const depotIncharge = allStaff.filter(u => u.role === UserRole.DEPOT_INCHARGE);
  const engineers = allStaff.filter(u => u.role === UserRole.ENGINEER);
  const technicians = allStaff.filter(u => u.role === UserRole.TECHNICIAN);

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
    // In a real application, this would open a form to add a new staff member
    console.log("Add staff functionality would be implemented here");
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
              <h2 className="text-lg font-semibold">Technicians</h2>
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
    </div>
  );
};

// Staff Card Component
const StaffCard = ({ staff }: { staff: any }) => {
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
          
          {staff.vehicleNo && (
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
