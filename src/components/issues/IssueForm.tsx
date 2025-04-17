
import React from 'react';
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
import { Issue, UserRole } from '@/types';
import { X } from 'lucide-react';
import { users, trains, workCategories, addNewIssue, updateIssue } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface IssueFormProps {
  issue?: Issue | null;
  onClose: (refreshData?: boolean) => void;
}

const issueSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  severity: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['open', 'in_progress', 'resolved']),
  assignedTo: z.string().optional(),
  trainId: z.string().optional(),
  carId: z.string().optional(),
  workCategory: z.string().optional(),
  workDetails: z.string().optional(),
});

export const IssueForm: React.FC<IssueFormProps> = ({ issue, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTrain, setSelectedTrain] = React.useState<string | undefined>(
    issue?.trainId
  );

  const assignableUsers = users.filter(u => 
    u.role === UserRole.ENGINEER || u.role === UserRole.TECHNICIAN
  );

  const form = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: issue?.title || '',
      description: issue?.description || '',
      severity: issue?.severity || 'medium',
      status: issue?.status || 'open',
      assignedTo: issue?.assignedTo || '',
      trainId: issue?.trainId || '',
      carId: issue?.carId || '',
      workCategory: issue?.workCategory || '',
      workDetails: issue?.workDetails || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof issueSchema>) => {
    const formattedData: Omit<Issue, 'id' | 'reportedAt' | 'lastUpdated'> = {
      title: values.title,
      description: values.description,
      severity: values.severity,
      status: values.status,
      assignedTo: values.assignedTo,
      trainId: values.trainId,
      carId: values.carId,
      workCategory: values.workCategory,
      workDetails: values.workDetails,
      resolvedAt: values.status === 'resolved' ? new Date().toISOString() : undefined,
      reportedBy: user?.id || '',
    };

    if (issue) {
      updateIssue(issue.id, formattedData);
    } else {
      addNewIssue(formattedData);
    }

    onClose(true);
  };

  const getTrainCars = () => {
    if (!selectedTrain) return [];
    const train = trains.find(t => t.id === selectedTrain);
    return train?.cars || [];
  };

  const trainCars = getTrainCars();

  const handleTrainChange = (trainId: string) => {
    setSelectedTrain(trainId);
    form.setValue('trainId', trainId);
    form.setValue('carId', '');
  };

  const canAssignWork = user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER;
  const isEmployeeView = user?.role === UserRole.TECHNICIAN;

  return (
    <Card className="border-primary/20">
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-center">
          <CardTitle>
            {issue ? 'Edit Work Activity' : 'Create New Work Activity'}
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
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter activity title" 
                      {...field} 
                      disabled={isEmployeeView && issue?.status !== 'in_progress'} 
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
                      placeholder="Provide detailed instructions for this activity" 
                      className="min-h-32" 
                      {...field} 
                      disabled={isEmployeeView && issue?.status !== 'in_progress'} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="workCategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Category</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isEmployeeView && issue?.status !== 'in_progress'}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select work category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workCategories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isEmployeeView}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
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
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {canAssignWork && (
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
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trainId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train</FormLabel>
                    <Select 
                      onValueChange={(value) => handleTrainChange(value)} 
                      defaultValue={field.value}
                      disabled={isEmployeeView}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select train" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="not_applicable">Not applicable</SelectItem>
                        {trains.map(train => (
                          <SelectItem key={train.id} value={train.id}>
                            {train.name}
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
                name="carId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Car</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!selectedTrain || isEmployeeView}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={selectedTrain ? "Select car" : "Select a train first"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="entire_train">Entire train</SelectItem>
                        {trainCars.map(car => (
                          <SelectItem key={car.id} value={car.id}>
                            Car {car.position} ({car.status})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Work Details/Daily Log</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter details of work performed or daily progress update" 
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
              {issue ? 'Update Activity' : 'Create Activity'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
