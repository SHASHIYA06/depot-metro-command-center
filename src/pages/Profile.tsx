
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, BadgeCheck, Building, Award, Calendar, Shield, Key } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PasswordChange from '@/components/profile/PasswordChange';
import { Badge } from '@/components/ui/badge';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>Please log in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account details
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center gap-4">
                <Avatar className="h-24 w-24 border-2 border-primary">
                  <AvatarImage src={user.photoUrl || user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-xl">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.role.replace('_', ' ')}</p>
                  {user.department && (
                    <p className="text-xs text-muted-foreground">{user.department}</p>
                  )}
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{user.phone}</p>
                    </div>
                  </div>
                )}
                
                {user.badgeNo && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Badge Number</p>
                      <p className="text-sm font-medium">{user.badgeNo}</p>
                    </div>
                  </div>
                )}
                
                {user.department && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{user.department}</p>
                    </div>
                  </div>
                )}
                
                {user.role && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">{user.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                )}
                
                {user.joiningDate && (
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium">{new Date(user.joiningDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Key className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>
                    View and update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <p className="font-medium">{user.phone || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Badge Number</p>
                      <p className="font-medium">{user.badgeNo || 'Not provided'}</p>
                    </div>
                    
                    {user.aadharNo && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Aadhar Number</p>
                        <p className="font-medium">{user.aadharNo}</p>
                      </div>
                    )}
                    
                    {user.vehicleNo && user.vehicleNo !== 'NA' && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Vehicle Number</p>
                        <p className="font-medium">{user.vehicleNo}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="outline">Request Information Update</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Work Information</CardTitle>
                  <CardDescription>
                    Your employment details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Department</p>
                      <p className="font-medium">{user.department || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Role</p>
                      <p className="font-medium">{user.role.replace('_', ' ')}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Joining Date</p>
                      <p className="font-medium">{user.joiningDate ? new Date(user.joiningDate).toLocaleDateString() : 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <PasswordChange />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Login History</CardTitle>
                  <CardDescription>
                    Recent account activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">Current Session</p>
                          <p className="text-sm text-muted-foreground">Web Browser - {navigator.userAgent.split(' ').slice(-1)}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-500">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date().toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground py-2">
                      Detailed login history is available upon request.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">System Preferences</CardTitle>
                  <CardDescription>
                    Customize your system experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    User preference settings will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
