
import React, { useState } from 'react';
import { Task } from '@/types';
import { TaskCarSelect } from './form/TaskCarSelect';
import { TaskPrioritySelect } from './form/TaskPrioritySelect';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { users, addNewTask, updateTask } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { TaskCategorySelect } from './form/TaskCategorySelect';
import { TaskStatusSelect } from './form/TaskStatusSelect';
import { TaskDatePicker } from './form/TaskDatePicker';
import { TaskTrainSelect } from './form/TaskTrainSelect';

// Define TaskFormProps interface
export interface TaskFormProps {
  task: Task | null;
  onClose: (refreshData?: boolean) => void;
}

// Export the TaskForm component
export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(task?.priority || 'medium');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'pending');
  const [category, setCategory] = useState<Task['category']>(task?.category || 'maintenance');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || '');
  const [trainId, setTrainId] = useState(task?.trainId || '');
  const [carId, setCarId] = useState(task?.carId || '');
  const [workDetails, setWorkDetails] = useState(task?.workDetails || '');

  // Filter users based on role
  const technicians = users.filter(u => u.role === UserRole.TECHNICIAN);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (!dueDate) {
      alert('Please select a due date');
      return;
    }

    if (!assignedTo) {
      alert('Please assign the task to a technician');
      return;
    }

    const taskData = {
      id: task?.id || crypto.randomUUID(),
      title,
      description,
      priority: priority as Task['priority'],
      status: status as Task['status'],
      category: category as Task['category'],
      assignedTo,
      assignedBy: user?.id || '',
      createdAt: task?.createdAt || new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      trainId,
      carId,
      workDetails
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addNewTask(taskData);
    }

    onClose(true);
  };

  // Type-safe handlers for select components
  const handlePriorityChange = (value: string) => {
    setPriority(value as Task['priority']);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as Task['status']);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as Task['category']);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="title" className="text-right">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <TaskPrioritySelect 
              value={priority} 
              onValueChange={handlePriorityChange} 
            />
            
            <TaskStatusSelect 
              value={status} 
              onValueChange={handleStatusChange} 
            />
            
            <TaskCategorySelect 
              value={category} 
              onValueChange={handleCategoryChange} 
            />
            
            <TaskDatePicker 
              value={dueDate ? dueDate.toISOString() : ''} 
              onChange={(dateString: string) => setDueDate(dateString ? new Date(dateString) : undefined)} 
            />
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="assignedTo" className="text-right">
                Assign To
              </label>
              <select
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="col-span-3 p-2 border rounded"
              >
                <option value="">Select Technician</option>
                {technicians.map(tech => (
                  <option key={tech.id} value={tech.id}>{tech.name}</option>
                ))}
              </select>
            </div>
            
            <TaskTrainSelect 
              value={trainId} 
              onValueChange={setTrainId} 
            />
            
            <TaskCarSelect 
              value={carId} 
              onValueChange={setCarId} 
            />
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="workDetails" className="text-right">
                Work Details
              </label>
              <Textarea
                id="workDetails"
                value={workDetails}
                onChange={(e) => setWorkDetails(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => onClose()}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
