
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Train } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      // Error is handled in the AuthContext
      console.log('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-metro-primary to-metro-info/80 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-lg">
              <Train className="h-10 w-10 text-metro-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Metro Depot Command Center</h1>
          <p className="mt-2 text-white/80">Login to access your metro depot dashboard</p>
        </div>
        
        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@metrodepot.com" 
                          type="email"
                          autoComplete="email"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          autoComplete="current-password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-sm text-muted-foreground">
                  <p>For demo purposes, you can use any of these emails:</p>
                  <div className="text-xs mt-1">
                    <p>rajiv.kumar@metro.com</p>
                    <p>priya.sharma@metro.com</p>
                    <p>sunil.verma@metro.com</p>
                    <p>arun.singh@metro.com</p>
                    <p>meera.patel@metro.com</p>
                    <p>(Use any password)</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-metro-primary hover:bg-metro-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      
      {/* Creator Information */}
      <div className="fixed bottom-4 right-4 text-xs text-white/50 text-right">
        <p>Created by Shashi Shekhar Mishra</p>
        <p>Email: shashiaaidu@gmail.com</p>
      </div>
    </div>
  );
};

export default Login;
