
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { users } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('metroDepotUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email - make case insensitive comparison
      const normalizedEmail = email.toLowerCase().trim();
      
      // Log all available emails for debugging
      console.log('Available emails:', users.map(u => u.email.toLowerCase()));
      console.log('Trying to login with:', normalizedEmail);
      
      const foundUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (!foundUser) {
        console.error('User not found with email:', normalizedEmail);
        throw new Error('Invalid credentials. User not found.');
      }
      
      // For demo purposes, simplify password checking
      // Allow any password for demo, or check for firstName@4321 format
      const firstName = foundUser.name.split(' ')[0].toLowerCase();
      const expectedPassword = `${firstName}@4321`;
      
      console.log('Expected password format:', expectedPassword);
      
      // Either allow any password for demo or validate correct one
      if (process.env.NODE_ENV !== 'production' && password === 'demo') {
        console.log('Demo mode - accepting any password');
      } else if (password !== expectedPassword) {
        console.error('Invalid password');
        throw new Error('Invalid credentials. Incorrect password.');
      }
      
      // Successful login
      setUser(foundUser);
      localStorage.setItem('metroDepotUser', JSON.stringify(foundUser));
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return;
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('metroDepotUser');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
