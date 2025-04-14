
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { Task, UserRole } from '@/types';
import { users, addNewTask, updateTask } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

// Define the form schema with Zod
const taskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in_progress', 'completed', 'delayed']),
  assignedTo: z.string(),
  dueDate: z.string(),
  category: z.enum(['maintenance', 'inspection', 'repair', 'cleaning', 'administrative', 'other']),
  workDetails: z.string().optional(),
  trainId: z.string().optional(),
  carId: z.string().optional(),
});

interface TaskFormProps {
  task?: Task | null;
  onClose: (refreshData?: boolean) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { user } = useAuth();
  const [assignableUsers, setAssignableUsers] = useState<typeof users>([]);
  
  useEffect(() => {
    // Determine which users this user can assign tasks to
    if (user?.role === UserRole.DEPOT_INCHARGE) {
      // Depot Incharge can assign to anyone except themselves
      setAssignableUsers(users.filter(u => 
        (u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN) && u.id !== user.id
      ));
    } else if (user?.role === UserRole.ENGINEER) {
      // Engineers can only assign to technicians
      setAssignableUsers(users.filter(u => u.role === UserRole.TECHNICIAN));
    } else {
      // Technicians can't assign to anyone
      setAssignableUsers([]);
    }
  }, [user]);

  // Set default form values
  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'medium',
      status: task?.status || 'pending',
      assignedTo: task?.assignedTo || '',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      category: task?.category || 'maintenance',
      workDetails: task?.workDetails || '',
      trainId: task?.trainId || '',
      carId: task?.carId || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof taskSchema>) => {
    // Format the data for submission
    const formattedData = {
      ...values,
      assignedBy: user?.id || '',
      createdAt: task?.createdAt || new Date().toISOString(),
      // Convert date string to ISO format
      dueDate: new Date(values.dueDate).toISOString(),
    };

    if (task) {
      // Update existing task
      updateTask(task.id, formattedData);
    } else {
      // Create new task
      addNewTask(formattedData);
    }

    // Sync to Google Sheets (mock implementation)
    console.log('Syncing task to Google Sheets:', formattedData);
    syncToGoogleSheets(formattedData);

    // Close the form
    onClose(true);
  };

  // Mock function to sync data to Google Sheets
  const syncToGoogleSheets = (taskData: any) => {
    // In a real implementation, this would use a webhook or API call to Google Sheets
    console.log('Task data would be sent to Google Sheets:', taskData);
    // This would typically call an API endpoint or use a library like googleapis
  };

  // Determine if user is updating an assigned task (technician updating work details)
  const isUpdatingAssignedTask = task && user?.role === UserRole.TECHNICIAN && task.assignedTo === user.id;

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-center">
          <CardTitle>
            {task 
              ? isUpdatingAssignedTask 
                ? 'Update Work Progress' 
                : 'Edit Task' 
              : 'Create New Task'}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => onClose()}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter task title" 
                      {...field} 
                      disabled={isUpdatingAssignedTask} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide detailed instructions for this task" 
                      className="min-h-32" 
                      {...field} 
                      disabled={isUpdatingAssignedTask} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Only show category selection for new tasks or non-technicians */}
            {(!isUpdatingAssignedTask) && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="cleaning">Cleaning</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Only show priority selection for new tasks or non-technicians */}
              {(!isUpdatingAssignedTask) && (
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Status can be updated by anyone */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Only show assignment options for users who can assign tasks */}
            {(user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER) && !isUpdatingAssignedTask && (
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignableUsers.map(staff => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name} ({staff.role === UserRole.ENGINEER ? 'Engineer' : 'Technician'})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Only show due date for new tasks or non-technicians */}
            {(!isUpdatingAssignedTask) && (
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {/* Everyone can update work details */}
            <FormField
              control={form.control}
              name="workDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Details/Progress Update</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter details of work performed or progress update" 
                      className="min-h-28"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button variant="outline" type="button" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit">
              {task 
                ? isUpdatingAssignedTask 
                  ? 'Update Progress' 
                  : 'Update Task' 
                : 'Create Task'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
