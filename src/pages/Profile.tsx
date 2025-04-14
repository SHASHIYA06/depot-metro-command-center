
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { users } from '@/lib/mockData';
import { Mail, Phone, User, Camera, Building, Calendar, MapPin } from 'lucide-react';
import { UserRole } from '@/types';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '123-456-7890', // Mock data
    department: user?.department || 'Engineering',
    address: '123 Metro St, Railway City',
    bio: 'Experienced professional with expertise in metro maintenance and operations.',
    joiningDate: '2020-05-15'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been updated successfully.'
    });
    setIsEditing(false);
  };

  // For directory tab - show all staff members
  const staffMembers = users.filter(u => 
    u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN
  );

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and view staff directory
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader className="relative">
              <div className="absolute right-6 top-6">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                )}
              </div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-3xl">{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <Button variant="outline" className="flex gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Change Photo</span>
                    </Button>
                  )}
                  
                  <div className="text-center">
                    <h2 className="text-xl font-semibold">{user?.name}</h2>
                    <p className="text-muted-foreground">{getRoleName(user?.role as UserRole)}</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input 
                        id="department" 
                        name="department" 
                        value={formData.department} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input 
                        id="joiningDate" 
                        name="joiningDate" 
                        type="date"
                        value={formData.joiningDate} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      value={formData.bio} 
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Directory Tab */}
        <TabsContent value="directory">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>
                View contact information for all depot staff
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffMembers.map((staff) => (
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Track your attendance and work hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.role === UserRole.DEPOT_INCHARGE ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Staff Attendance Overview</h3>
                    <Button variant="outline">Export Reports</Button>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 font-medium p-3 border-b">
                      <div>Name</div>
                      <div>Role</div>
                      <div>Present Days</div>
                      <div>Avg. Hours</div>
                      <div>Status Today</div>
                    </div>
                    {users.map((staffMember) => (
                      <div key={staffMember.id} className="grid grid-cols-5 p-3 border-b last:border-0">
                        <div className="font-medium">{staffMember.name}</div>
                        <div>{getRoleName(staffMember.role)}</div>
                        <div>{Math.floor(Math.random() * 10) + 18}/22</div>
                        <div>{(Math.random() * 2 + 7).toFixed(1)} hrs</div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Present
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Average Attendance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Average Work Hours</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">7.8 hrs</div>
                        <p className="text-xs text-muted-foreground">-0.3 hrs from last month</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">On Time Arrival</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">88%</div>
                        <p className="text-xs text-muted-foreground">+2.1% from last month</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-medium">Your Attendance</h3>
                      <p className="text-sm text-muted-foreground">April 2025</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" disabled>
                        <Calendar className="h-4 w-4 mr-2" />
                        Log In
                      </Button>
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-muted/20 rounded-lg p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Today's Status</h4>
                        <div className="mt-1 flex items-center">
                          <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                          <span className="font-medium">Present</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Log In Time</h4>
                        <p className="mt-1 font-medium">08:30 AM</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">Work Hours</h4>
                        <p className="mt-1 font-medium">6h 45m</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">This Month</h4>
                        <p className="mt-1 font-medium">21/22 days</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 font-medium p-3 border-b">
                      <div>Date</div>
                      <div>In Time</div>
                      <div>Out Time</div>
                      <div>Total Hours</div>
                    </div>
                    {[...Array(10)].map((_, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() - index);
                      const inTime = `0${Math.floor(Math.random() * 2) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`;
                      const outTime = `0${Math.floor(Math.random() * 2) + 4}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`;
                      const hours = (Math.random() * 2 + 7).toFixed(1);
                      
                      return (
                        <div key={index} className="grid grid-cols-4 p-3 border-b last:border-0">
                          <div>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          <div>{inTime}</div>
                          <div>{outTime}</div>
                          <div>{hours} hrs</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
