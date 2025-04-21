import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { staffUsers } from '@/lib/mockDataStaff';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePassword: (newPassword: string) => Promise<void>;
  getUsersByRole: (role: UserRole) => User[];
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
  
  // Get users by role function - ensure it always returns an array
  const getUsersByRole = (role: UserRole): User[] => {
    const filteredUsers = staffUsers.filter(u => u.role === role);
    return filteredUsers || [];
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by email - make case insensitive comparison
      const normalizedEmail = email.toLowerCase().trim();
      
      // Log all available emails for debugging
      console.log('Available emails:', staffUsers.map(u => u.email.toLowerCase()));
      console.log('Trying to login with:', normalizedEmail);
      
      // Look for user in staff users
      let foundUser = staffUsers.find(u => u.email.toLowerCase() === normalizedEmail);
      
      if (!foundUser) {
        console.error('User not found with email:', normalizedEmail);
        throw new Error('Invalid credentials. User not found.');
      }
      
      // Get stored password or use default password format
      const storedPassword = localStorage.getItem(`password_${foundUser.id}`);
      const firstName = foundUser.name.split(' ')[0].toLowerCase();
      const defaultPassword = `${firstName}@4321`;
      const expectedPassword = storedPassword || defaultPassword;
      
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

  const updatePassword = async (newPassword: string) => {
    try {
      if (!user) {
        throw new Error('No user is logged in');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      // In a real app we would call an API, but here we store in localStorage
      localStorage.setItem(`password_${user.id}`, newPassword);
      
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully updated',
      });
      
      return;
    } catch (error) {
      toast({
        title: 'Failed to update password',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
      throw error;
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
    <AuthContext.Provider value={{ user, isLoading, login, logout, updatePassword, getUsersByRole }}>
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
