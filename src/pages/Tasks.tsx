import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Edit,
  Trash2,
  Filter,
  User,
  Users
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Task, UserRole } from '@/types';
import { users, addNewTask, updateTask, deleteTask, mockTasks } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetail } from '@/components/tasks/TaskDetail';

const Tasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const canCreateTasks = user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER;

  useEffect(() => {
    setTasks(mockTasks);
  }, []);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (user?.role === UserRole.TECHNICIAN) {
      if (task.assignedTo !== user.id) {
        return false;
      }
    } else if (user?.role === UserRole.ENGINEER) {
      const isCreator = task.assignedBy === user.id;
      const isAssignee = task.assignedTo === user.id;
      const assignedToTechnician = task.assignedTo && users.find(u => 
        u.id === task.assignedTo && u.role === UserRole.TECHNICIAN
      );
      
      if (!isCreator && !isAssignee && !assignedToTechnician) {
        return false;
      }
    }
    
    if (activeTab === 'pending') {
      return matchesSearch && (task.status === 'pending');
    } else if (activeTab === 'in-progress') {
      return matchesSearch && (task.status === 'in_progress');
    } else if (activeTab === 'completed') {
      return matchesSearch && (task.status === 'completed');
    } else if (activeTab === 'all') {
      return matchesSearch;
    }
    
    return matchesSearch;
  });

  const getAssigneeName = (userId: string): string => {
    const assignee = users.find(u => u.id === userId);
    return assignee ? assignee.name : 'Unknown';
  };

  const getPriorityBadgeClass = (priority: Task['priority']) => {
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

  const getStatusBadgeClass = (status: Task['status']) => {
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

  const getCategoryBadgeClass = (category: Task['category']) => {
    switch (category) {
      case 'maintenance':
        return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
      case 'inspection':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'repair':
        return 'bg-orange-100 text-orange-600 hover:bg-orange-200';
      case 'cleaning':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      case 'administrative':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
      default:
        return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: Task) => {
    if (canEditTask(task)) {
      setEditingTask(task);
      setShowForm(true);
    } else {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to edit this task.',
        variant: 'destructive'
      });
    }
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
  };

  const handleTaskFormClose = (refreshData: boolean = false) => {
    setShowForm(false);
    setEditingTask(null);
    
    if (refreshData) {
      toast({
        title: "Success",
        description: editingTask ? "Task updated successfully" : "Task created successfully",
      });
      
      setTasks([...mockTasks]);
    }
  };

  const handleTaskViewClose = () => {
    setViewingTask(null);
  };

  const markTaskComplete = (taskId: string) => {
    const updatedTask = updateTask(taskId, { status: 'completed', completedAt: new Date().toISOString() });
    
    if (updatedTask) {
      toast({
        title: 'Task Completed',
        description: 'The task has been marked as completed.',
      });
      
      setTasks([...mockTasks]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const success = deleteTask(taskId);
    
    if (success) {
      toast({
        title: 'Task Deleted',
        description: 'The task has been deleted.',
      });
      
      setTasks([...mockTasks]);
    }
  };

  const canEditTask = (task: Task): boolean => {
    if (user?.role === UserRole.DEPOT_INCHARGE) {
      return true;
    } else if (user?.role === UserRole.ENGINEER) {
      const isCreator = task.assignedBy === user.id;
      const assignedToTechnician = task.assignedTo && users.find(u => 
        u.id === task.assignedTo && u.role === UserRole.TECHNICIAN
      );
      
      return isCreator || !!assignedToTechnician;
    } else if (user?.role === UserRole.TECHNICIAN) {
      return task.assignedTo === user.id;
    }
    
    return false;
  };

  const canDeleteTask = (task: Task): boolean => {
    return user?.role === UserRole.DEPOT_INCHARGE;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            {user?.role === UserRole.DEPOT_INCHARGE 
              ? 'Manage and track daily tasks for the depot staff'
              : user?.role === UserRole.ENGINEER
                ? 'Manage tasks and assign work to technicians'
                : 'View and update your assigned tasks'}
          </p>
        </div>
        
        {canCreateTasks && (
          <Button onClick={handleCreateTask}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        )}
      </div>

      {showForm && (
        <TaskForm 
          task={editingTask} 
          onClose={handleTaskFormClose} 
        />
      )}

      {viewingTask && (
        <TaskDetail 
          task={viewingTask} 
          onClose={handleTaskViewClose}
          onEdit={canEditTask(viewingTask) ? handleEditTask : undefined}
          onComplete={
            (viewingTask.status !== 'completed' && 
             (viewingTask.assignedTo === user?.id || canEditTask(viewingTask)))
              ? () => markTaskComplete(viewingTask.id)
              : undefined
          }
        />
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      <p className="text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      <Badge className={getPriorityBadgeClass(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusBadgeClass(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getCategoryBadgeClass(task.category)}>
                        {task.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Due Date</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Created</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Assigned To</div>
                        <div className="text-sm text-muted-foreground">
                          {getAssigneeName(task.assignedTo)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" size="sm" onClick={() => handleViewTask(task)}>
                      View Details
                    </Button>
                    
                    {task.status !== 'completed' && (
                      <>
                        {canEditTask(task) && (
                          <Button variant="outline" size="sm" onClick={() => handleEditTask(task)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        
                        {(task.assignedTo === user?.id || canEditTask(task)) && (
                          <Button variant="outline" size="sm" onClick={() => markTaskComplete(task.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        
                        {canDeleteTask(task) && (
                          <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm ? 'Try using different keywords or filters' : 'No tasks have been created yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
