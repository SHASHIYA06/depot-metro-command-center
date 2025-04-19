
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Train, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      
      // Track login for attendance
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeDecimal = hour + (minute / 60);
      
      // Check if login is between 8:50 AM and 9:20 AM (8.83 to 9.33 in decimal)
      if (timeDecimal >= 8.83 && timeDecimal <= 9.33) {
        // In a real app, this would be recorded to a database
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-primary/10 p-3">
            <Train className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Metro Depot Management</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
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
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 border-t pt-4">
            <p className="text-xs text-muted-foreground text-center px-4">
              By signing in, you agree to the terms of service and data policy.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Default password format: firstname@4321
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
