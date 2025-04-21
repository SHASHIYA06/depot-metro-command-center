import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Train, AlertCircle, User, Key, Users, Briefcase, Database, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from '@/components/ui/motion';
import { UserRole } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRoleSelect } from '@/components/auth/UserRoleSelect';

const LoginRoleCard = ({ role, icon: Icon, title, description, isActive, onClick }: {
  role: UserRole;
  icon: React.ElementType;
  title: string;
  description: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`cursor-pointer rounded-lg p-4 transition-all ${isActive ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`rounded-full p-3 ${isActive ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
          <Icon className={`h-6 w-6 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
        <h3 className="font-medium">{title}</h3>
        <p className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const UserSelector = ({ role, selectedUser, onSelect }: { 
  role: UserRole | null, 
  selectedUser: string, 
  onSelect: (email: string) => void 
}) => {
  const { getUsersByRole } = useAuth();
  const [open, setOpen] = useState(false);
  
  const users = role ? getUsersByRole(role) : [];
  
  const safeUsers = Array.isArray(users) ? users : [];
  
  const selectedUserDetails = safeUsers.find(user => user?.email === selectedUser);
  
  if (safeUsers.length === 0) {
    return (
      <div className="mt-2">
        <Button
          variant="outline"
          className="w-full justify-between cursor-not-allowed opacity-70"
          disabled
        >
          No users available for this role
          <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>
    );
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between mt-2"
        >
          {selectedUserDetails?.name || 'Select user'}
          <User className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {safeUsers.map((user) => (
              <CommandItem
                key={user.id}
                value={user.name}
                onSelect={() => {
                  onSelect(user.email);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedUser === user.email ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('login');

  const loginRoles = [
    {
      role: UserRole.DEPOT_INCHARGE,
      icon: Briefcase,
      title: 'Depot Incharge',
      description: 'Full access to all systems and administrative controls'
    },
    {
      role: UserRole.ENGINEER,
      icon: Users,
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
      title: 'Data Entry',
      description: 'Enter and update data, generate reports'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail('');
  };
  
  const handleUserSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
      
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeDecimal = hour + (minute / 60);
      
      if (timeDecimal >= 8.83 && timeDecimal <= 9.33) {
        toast({
          title: 'Attendance Recorded',
          description: 'You have been marked as PRESENT for today.',
        });
      } else {
        toast({
          title: 'Login Time Noted',
          description: `Login time: ${now.toLocaleTimeString()}`,
        });
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [trainPosition, setTrainPosition] = useState({ x: 0, y: 0, rotate: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setTrainPosition({ x, y, rotate: x * 0.5 });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderLoginForm = () => (
    <>
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3">Select your role:</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {loginRoles.map((roleInfo) => (
            <LoginRoleCard
              key={roleInfo.role}
              role={roleInfo.role}
              icon={roleInfo.icon}
              title={roleInfo.title}
              description={roleInfo.description}
              isActive={selectedRole === roleInfo.role}
              onClick={() => handleRoleSelect(roleInfo.role)}
            />
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            User
          </Label>
          <UserRoleSelect 
            role={selectedRole} 
            onSelectUser={handleUserSelect}
          />
          <Input
            id="email"
            type="email"
            placeholder="Or enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="bg-background mt-2"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="flex items-center">
              <Key className="h-4 w-4 mr-2" />
              Password
            </Label>
            <Button type="button" variant="link" className="px-0 text-xs">
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="bg-background"
          />
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !selectedRole}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </>
  );

  const renderSystemInfo = () => (
    <div className="space-y-4 py-2">
      <p className="text-sm">The Metro Depot Management System provides comprehensive tools for maintenance, operations, and administration of metro rail facilities.</p>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Key Features:</h4>
        <ul className="text-sm list-disc list-inside space-y-1">
          <li>Maintenance planning and scheduling</li>
          <li>Task assignment and tracking</li>
          <li>Issue management and resolution</li>
          <li>Inventory and store management</li>
          <li>Staff management and attendance</li>
          <li>Analytics and reporting</li>
        </ul>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setActiveTab('login')}
      >
        Return to Login
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/4 w-40 h-40 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-4xl z-10">
        <div className="absolute top-[-100px] left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{
              x: trainPosition.x,
              y: trainPosition.y,
              rotateZ: trainPosition.rotate,
            }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            className="relative"
          >
            <div className="rounded-full bg-primary/10 p-5">
              <Train className="h-20 w-20 text-primary" />
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-40 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded"></div>
          </motion.div>
        </div>
        
        <div className="mt-24 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">Metro Depot Management</h1>
          <p className="text-center text-gray-600 mb-8">Advanced railway maintenance and operations system</p>
          
          <Card className="w-full max-w-xl shadow-lg border-0 shadow-primary/10">
            <CardHeader>
              <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="about">System Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                  <CardDescription className="text-center">
                    Login to access your dashboard and tools
                  </CardDescription>
                </TabsContent>
                
                <TabsContent value="about">
                  <CardTitle className="text-2xl font-bold text-center">System Information</CardTitle>
                  <CardDescription className="text-center">
                    Metro Depot Management System v2.0
                  </CardDescription>
                </TabsContent>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              {activeTab === 'login' ? renderLoginForm() : renderSystemInfo()}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2 border-t pt-4">
              <p className="text-xs text-muted-foreground text-center px-4">
                By signing in, you agree to the terms of service and data policy.
              </p>
              {activeTab === 'login' && (
                <p className="text-xs text-muted-foreground text-center">
                  Default password format: firstname@4321
                </p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
