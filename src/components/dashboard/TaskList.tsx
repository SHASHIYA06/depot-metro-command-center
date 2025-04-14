
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task, User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getUserById } from '@/lib/mockData';
import { ChevronRight } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title?: string;
  description?: string;
  limit?: number;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  title = "Upcoming Tasks", 
  description = "Tasks requiring attention",
  limit = 5
}) => {
  // Function to get priority badge color
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-600 hover:bg-orange-200';
      case 'urgent':
        return 'bg-red-100 text-red-600 hover:bg-red-200';
      default:
        return '';
    }
  };

  // Function to get status badge color
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-600 hover:bg-red-200';
      default:
        return '';
    }
  };

  // Function to get user initials
  const getUserInitials = (userId: string) => {
    const user = getUserById(userId);
    if (!user) return 'U';
    
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Function to get user name
  const getUserName = (userId: string) => {
    const user = getUserById(userId);
    return user ? user.name : 'Unknown User';
  };

  // Get user avatar
  const getUserAvatar = (userId: string) => {
    const user = getUserById(userId);
    return user ? user.avatar : undefined;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.length > 0 ? (
            tasks.slice(0, limit).map((task) => (
              <div key={task.id} className="flex items-start justify-between border-b pb-4 last:border-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getUserAvatar(task.assignedTo)} />
                    <AvatarFallback>{getUserInitials(task.assignedTo)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">{task.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>Due: {format(new Date(task.dueDate), 'MMM dd')}</span>
                      <span className="mx-1">•</span>
                      <span>Assigned to: {getUserName(task.assignedTo)}</span>
                    </div>
                    <div className="flex mt-2 space-x-2">
                      <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <Badge className={cn("text-xs", getStatusColor(task.status))}>
                        {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">No tasks found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
