
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
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/types';
import { addNewTask, updateTask } from '@/lib/mockData';
import { TaskPrioritySelect } from './form/TaskPrioritySelect';
import { TaskStatusSelect } from './form/TaskStatusSelect';
import { TaskCategorySelect } from './form/TaskCategorySelect';
import { TaskDatePicker } from './form/TaskDatePicker';
import { TaskTrainSelect } from './form/TaskTrainSelect';
import { TaskCarSelect } from './form/TaskCarSelect';
import { format } from 'date-fns';

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
      updateTask(issue.id, formData as Task);
      toast({
        title: 'Success',
        description: 'Task updated successfully.',
      });
    } else {
      const newTask = {
        id: `task-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedBy: 'user-depot-incharge',
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

          <TaskPrioritySelect
            value={formData.priority || ''}
            onValueChange={(value) => handleFormChange('priority', value)}
          />

          <TaskStatusSelect
            value={formData.status || ''}
            onValueChange={(value) => handleFormChange('status', value)}
          />

          <TaskCategorySelect
            value={formData.category || ''}
            onValueChange={(value) => handleFormChange('category', value)}
          />

          <TaskDatePicker
            value={formData.dueDate || ''}
            onChange={(value) => handleFormChange('dueDate', value)}
          />

          <TaskTrainSelect
            value={formData.trainId || ''}
            onValueChange={(value) => handleFormChange('trainId', value)}
          />

          <TaskCarSelect
            value={formData.carId || ''}
            onValueChange={(value) => handleFormChange('carId', value)}
          />
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
