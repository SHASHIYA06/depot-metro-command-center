
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
import { syncToGoogleSheets } from '@/utils/googleSheetsIntegration';

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
    const formattedData: Omit<Task, 'id'> = {
      title: values.title,
      description: values.description,
      priority: values.priority,
      status: values.status,
      assignedTo: values.assignedTo,
      assignedBy: user?.id || '',
      createdAt: task?.createdAt || new Date().toISOString(),
      dueDate: new Date(values.dueDate).toISOString(),
      category: values.category,
      workDetails: values.workDetails,
      trainId: values.trainId,
      carId: values.carId,
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
    await syncToGoogleSheets(formattedData);

    // Close the form
    onClose(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{task ? 'Edit Task' : 'Create New Task'}</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => onClose(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
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
                      placeholder="Describe the task in detail" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
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

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assignableUsers.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
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

              <FormField
                control={form.control}
                name="trainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter train ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="carId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter car ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="workDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Details (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter additional work details or progress notes" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onClose(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
