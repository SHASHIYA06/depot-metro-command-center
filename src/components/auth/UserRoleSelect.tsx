
import React from 'react';
import { UserRole } from '@/types';
import { staffUsers } from '@/lib/mockDataStaff';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserRoleSelectProps {
  role: UserRole | null;
  onSelectUser: (email: string) => void;
}

export const UserRoleSelect = ({ role, onSelectUser }: UserRoleSelectProps) => {
  // Filter users by role
  const users = role ? staffUsers.filter(user => user.role === role) : [];

  if (!role || users.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Select a role first" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select onValueChange={onSelectUser}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${role.toLowerCase().replace('_', ' ')}`} />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.email}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
