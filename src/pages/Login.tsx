
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Train, User, Key, Briefcase, Users, Database, FileSpreadsheet, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from '@/components/ui/motion';
import { UserRole } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RoleCard = ({ role, icon: Icon, title, description, isActive, onClick }: {
  role: UserRole;
  icon: React.ElementType;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const getCardColor = () => {
    switch (role) {
      case UserRole.DEPOT_INCHARGE: return isActive ? 'bg-blue-500' : 'bg-blue-400 hover:bg-blue-500';
      case UserRole.ENGINEER: return isActive ? 'bg-green-500' : 'bg-green-400 hover:bg-green-500';
      case UserRole.TECHNICIAN: return isActive ? 'bg-yellow-500' : 'bg-yellow-400 hover:bg-yellow-500';
      case UserRole.STORE_PERSON: return isActive ? 'bg-purple-500' : 'bg-purple-400 hover:bg-purple-500';
      case UserRole.DATA_ENTRY_OPERATOR: return isActive ? 'bg-red-500' : 'bg-red-400 hover:bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`cursor-pointer rounded-lg p-6 text-white transition-all ${getCardColor()}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="rounded-full p-4 bg-white/20">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
      </div>
    </motion.div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { login, getUsersByRole } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  const loginRoles = [
    {
      role: UserRole.DEPOT_INCHARGE,
      icon: Briefcase,
      title: 'Depot Incharge',
      description: 'Full access to all systems and administrative controls'
    },
    {
      role: UserRole.ENGINEER,
      icon: Settings,
      title: 'Engineer',
      description: 'Access to maintenance planning and technical operations'
    },
    {
      role: UserRole.TECHNICIAN,
      icon: User,
      title: 'Employee',
      description: 'View assigned tasks and report work progress'
    },
    {
      role: UserRole.STORE_PERSON,
      icon: Database,
      title: 'Store Person',
      description: 'Manage inventory, materials and equipment'
    },
    {
      role: UserRole.DATA_ENTRY_OPERATOR,
      icon: FileSpreadsheet,
      title: 'Data Entry Operator',
      description: 'Enter and update data, generate reports'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowLoginForm(true);
    setEmail('');
    setSelectedStaff('');
  };

  const handleStaffSelect = (staffEmail: string) => {
    setSelectedStaff(staffEmail);
    setEmail(staffEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
      
      toast({
        title: 'Login Successful',
        description: 'Welcome to Metro Depot Management System!',
      });
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowLoginForm(false);
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setSelectedStaff('');
  };

  const getStaffMembers = () => {
    if (!selectedRole) return [];
    return getUsersByRole(selectedRole) || [];
  };

  return (
    <div className="min-h-screen flex items-center justify-center" 
         style={{
           background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
           position: 'relative',
           overflow: 'hidden'
         }}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(100vh) rotate(0deg); }
          100% { transform: translateY(-100vh) rotate(360deg); }
        }
      `}</style>

      <div className="relative w-full max-w-6xl mx-auto p-4 z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-white/10 p-6">
              <Train className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">Metro Depot Management</h1>
          <p className="text-xl text-white/80">Advanced railway maintenance and operations system</p>
        </div>

        {!showLoginForm ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Select Your Role</h2>
            <p className="text-white/80 mb-8">Choose your role to access the appropriate dashboard</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {loginRoles.map((roleInfo) => (
                <RoleCard
                  key={roleInfo.role}
                  role={roleInfo.role}
                  icon={roleInfo.icon}
                  title={roleInfo.title}
                  description={roleInfo.description}
                  isActive={false}
                  onClick={() => handleRoleSelect(roleInfo.role)}
                />
              ))}
            </div>
          </div>
        ) : (
          <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {loginRoles.find(r => r.role === selectedRole)?.title} Login
              </CardTitle>
              <CardDescription>Select your staff profile</CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staff" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Staff Member
                  </Label>
                  <Select value={selectedStaff} onValueChange={handleStaffSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your name" />
                    </SelectTrigger>
                    <SelectContent>
                      {getStaffMembers().map((staff) => (
                        <SelectItem key={staff.id} value={staff.email}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    System Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Auto-generated email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={true}
                    className="bg-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center">
                    <Key className="h-4 w-4 mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Auto-generated password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background"
                  />
                  <div className="text-right">
                    <Button type="button" variant="link" className="px-0 text-xs">
                      Forgot password?
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isLoading || !selectedStaff}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </CardContent>
            
            <CardFooter className="text-center">
              <p className="text-xs text-muted-foreground">
                © 2025 BEML Limited. All rights reserved.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
