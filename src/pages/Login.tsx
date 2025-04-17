
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Train, AlertCircle } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
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
    setLoginError(null);
    
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.log('Login error:', error);
      setLoginError(error instanceof Error ? error.message : 'An unknown error occurred');
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
                {loginError && (
                  <Alert variant="destructive" className="my-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{loginError}</AlertDescription>
                  </Alert>
                )}
                
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
                  <div className="text-xs mt-1 space-y-1 border rounded-md p-2 bg-slate-50">
                    <p>shashi.mishra@metro.com (Depot Incharge)</p>
                    <p>shilpa.sahu@metro.com (Engineer)</p>
                    <p>sunil.rajan@metro.com (Engineer)</p>
                    <p>manidip.baisya@metro.com (Technician)</p>
                    <p>md.aslam@metro.com (Technician)</p>
                    <p><strong>Password Format:</strong> firstname@4321 (e.g., shashi@4321)</p>
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
      
      <div className="fixed bottom-4 right-4 text-xs text-white/50 text-right">
        <p>Depot Incharge: Shashi Shekhar Mishra</p>
        <p>Email: shashiaaidu@gmail.com</p>
      </div>
    </div>
  );
};

export default Login;
