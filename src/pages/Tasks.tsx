
import React, { useState } from 'react';
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
  Filter
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Task, UserRole } from '@/types';
import { users } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

// Mock tasks
const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Inspect brake systems on Train A',
    description: 'Complete a full inspection of the brake systems on Train A, including testing and documentation.',
    priority: 'high',
    status: 'pending',
    assignedTo: 'u4',
    assignedBy: 'u2',
    createdAt: new Date().toISOString(),
    dueDate: addDays(new Date(), 2).toISOString(),
    trainId: 't1',
    category: 'inspection'
  },
  {
    id: 'task2',
    title: 'Clean passenger cars on Train B',
    description: 'Clean all passenger cars on Train B, including floors, seats, and windows.',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'u5',
    assignedBy: 'u2',
    createdAt: addDays(new Date(), -2).toISOString(),
    dueDate: addDays(new Date(), 1).toISOString(),
    trainId: 't2',
    category: 'cleaning'
  },
  {
    id: 'task3',
    title: 'Replace worn components on Train C',
    description: 'Replace identified worn components on Train C engine system.',
    priority: 'urgent',
    status: 'in_progress',
    assignedTo: 'u3',
    assignedBy: 'u1',
    createdAt: addDays(new Date(), -3).toISOString(),
    dueDate: new Date().toISOString(),
    trainId: 't3',
    category: 'repair'
  },
  {
    id: 'task4',
    title: 'Update maintenance records',
    description: 'Update all maintenance records in the system for the past week.',
    priority: 'low',
    status: 'completed',
    assignedTo: 'u2',
    assignedBy: 'u1',
    createdAt: addDays(new Date(), -7).toISOString(),
    dueDate: addDays(new Date(), -1).toISOString(),
    completedAt: addDays(new Date(), -1).toISOString(),
    category: 'administrative'
  }
];

const Tasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  
  const canCreateTasks = user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER;

  // Filter tasks based on active tab and search term
  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // For normal users, only show their assigned tasks
    if (user?.role === UserRole.TECHNICIAN && task.assignedTo !== user.id) {
      return false;
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
    toast({
      title: 'Task Created',
      description: 'The new task has been created successfully.',
    });
    setShowForm(false);
  };

  const TaskForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Task</CardTitle>
        <CardDescription>Assign tasks to staff members</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateTask(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="text-sm font-medium">Task Title</label>
              <Input id="title" placeholder="Enter task title" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">Priority</label>
              <select id="priority" className="w-full px-3 py-2 border rounded-md">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select id="category" className="w-full px-3 py-2 border rounded-md">
                <option value="maintenance">Maintenance</option>
                <option value="inspection">Inspection</option>
                <option value="repair">Repair</option>
                <option value="cleaning">Cleaning</option>
                <option value="administrative">Administrative</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="assignTo" className="text-sm font-medium">Assign To</label>
              <select id="assignTo" className="w-full px-3 py-2 border rounded-md">
                {users.filter(u => u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN).map(staff => (
                  <option key={staff.id} value={staff.id}>{staff.name} ({staff.role === UserRole.ENGINEER ? 'Engineer' : 'Technician'})</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
              <Input id="dueDate" type="date" required />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea 
                id="description" 
                className="w-full px-3 py-2 border rounded-md min-h-32" 
                placeholder="Provide detailed instructions for this task"
                required
              ></textarea>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const markTaskComplete = (taskId: string) => {
    toast({
      title: 'Task Completed',
      description: 'The task has been marked as completed.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track daily tasks for the depot staff
          </p>
        </div>
        
        {canCreateTasks && (
          <Button onClick={() => setShowForm(!showForm)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        )}
      </div>

      {showForm && <TaskForm />}

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
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Assigned To</div>
                        <div className="text-sm text-muted-foreground">
                          {getAssigneeName(task.assignedTo)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" size="sm">View Details</Button>
                    
                    {task.status !== 'completed' && (
                      <>
                        {canCreateTasks && (
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        
                        {(task.assignedTo === user?.id || canCreateTasks) && (
                          <Button variant="outline" size="sm" onClick={() => markTaskComplete(task.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                        
                        {user?.role === UserRole.DEPOT_INCHARGE && (
                          <Button variant="outline" size="sm" className="text-destructive">
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
