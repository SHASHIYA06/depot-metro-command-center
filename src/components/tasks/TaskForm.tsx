import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';
import { addNewTask, updateTask } from '@/lib/mockData';

interface TaskFormProps {
  issue?: Task | null;
  onClose: (refreshData: boolean) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ issue, onClose }) => {
  const [open, setOpen] = React.useState(true);
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    category: 'maintenance',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (issue) {
      setFormData({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        status: issue.status,
        dueDate: issue.dueDate,
        category: issue.category,
        assignedTo: issue.assignedTo,
        trainId: issue.trainId,
        carId: issue.carId,
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        category: 'maintenance',
      });
    }
  }, [issue]);

  const handleFormChange = (key: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.priority || !formData.status || !formData.dueDate || !formData.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (issue) {
      // Update existing task
      updateTask(issue.id, formData as Task);
      toast({
        title: 'Success',
        description: 'Task updated successfully.',
      });
    } else {
      // Create new task
      const newTask = {
        id: `task-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedBy: 'user-depot-incharge', // Replace with actual user ID
        createdAt: new Date().toISOString(),
        dueDate: formData.dueDate,
        category: formData.category,
      };
      addNewTask(newTask as Task);
      toast({
        title: 'Success',
        description: 'Task created successfully.',
      });
    }

    onClose(true);
  };

  // Add the train sets and car IDs to the task form
  const trainSets = Array.from({ length: 25 }, (_, i) => `TS${String(i + 1).padStart(2, '0')}`);
  const carIds = ['DMC1', 'TC1', 'MC1', 'MC2', 'TC2', 'DMC2'];

  // Add more task categories
  const taskCategories = [
    'Corrective Maintenance',
    'Preventive Maintenance',
    'Other Preventive Maintenance',
    'Breakdown Maintenance',
    'Condition Based Maintenance',
    'Scheduled Overhaul',
    'Emergency Repair',
    'System Upgrade',
    'Inspection',
    'Testing',
    'Software Update',
    'Hardware Replacement',
    'Cleaning',
    'Lubrication',
    'Calibration'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{issue ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {issue ? "Edit task details" : "Create a new task for depot staff"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Task Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Task Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              type="text"
              id="description"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              className="col-span-3"
            />
          </div>

          {/* Task Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={formData.priority} onValueChange={(value) => handleFormChange('priority', value)}>
              <SelectTrigger id="priority" className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
              <SelectTrigger id="status" className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleFormChange('category', value)}
            >
              <SelectTrigger id="category" className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {taskCategories.map(category => (
                  <SelectItem key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Due Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 pl-3 text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  {formData.dueDate ? (
                    format(new Date(formData.dueDate), "yyyy-MM-dd")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate ? new Date(formData.dueDate) : undefined}
                  onSelect={(date) => handleFormChange('dueDate', format(date!, 'yyyy-MM-dd'))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Train ID selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trainId" className="text-right">
              Train ID
            </Label>
            <Select
              value={formData.trainId || ''}
              onValueChange={(value) => handleFormChange('trainId', value)}
            >
              <SelectTrigger id="trainId" className="col-span-3">
                <SelectValue placeholder="Select train" />
              </SelectTrigger>
              <SelectContent>
                {trainSets.map(train => (
                  <SelectItem key={train} value={train}>
                    {train}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Car ID selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carId" className="text-right">
              Car ID
            </Label>
            <Select
              value={formData.carId || ''}
              onValueChange={(value) => handleFormChange('carId', value)}
            >
              <SelectTrigger id="carId" className="col-span-3">
                <SelectValue placeholder="Select car" />
              </SelectTrigger>
              <SelectContent>
                {carIds.map(car => (
                  <SelectItem key={car} value={car}>
                    {car}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {issue ? "Update Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { TaskForm };
