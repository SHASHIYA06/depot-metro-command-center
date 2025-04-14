
import React from 'react';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, CheckCircle } from 'lucide-react';
import { Task } from '@/types';
import { users } from '@/lib/mockData';

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onEdit?: (task: Task) => void;
  onComplete?: () => void;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({ 
  task, 
  onClose, 
  onEdit,
  onComplete
}) => {
  const getAssigneeName = (userId: string): string => {
    const assignee = users.find(u => u.id === userId);
    return assignee ? assignee.name : 'Unknown';
  };

  const getAssignerName = (userId: string): string => {
    const assigner = users.find(u => u.id === userId);
    return assigner ? assigner.name : 'Unknown';
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

  return (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            Task details and information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Badge className={getPriorityBadgeClass(task.priority)}>
              {task.priority} priority
            </Badge>
            <Badge className={getStatusBadgeClass(task.status)}>
              {task.status.replace('_', ' ')}
            </Badge>
            <Badge className={getCategoryBadgeClass(task.category)}>
              {task.category}
            </Badge>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{task.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-1">Assigned To</h4>
              <p className="text-sm">{getAssigneeName(task.assignedTo)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Assigned By</h4>
              <p className="text-sm">{getAssignerName(task.assignedBy)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Created On</h4>
              <p className="text-sm">{format(new Date(task.createdAt), 'MMM dd, yyyy')}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-1">Due Date</h4>
              <p className="text-sm">{format(new Date(task.dueDate), 'MMM dd, yyyy')}</p>
            </div>
            
            {task.completedAt && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Completed On</h4>
                <p className="text-sm">{format(new Date(task.completedAt), 'MMM dd, yyyy')}</p>
              </div>
            )}
            
            {task.trainId && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Train</h4>
                <p className="text-sm">{task.trainId}</p>
              </div>
            )}
            
            {task.carId && (
              <div>
                <h4 className="text-sm font-semibold mb-1">Car</h4>
                <p className="text-sm">{task.carId}</p>
              </div>
            )}
          </div>
          
          {task.workDetails && (
            <div>
              <h4 className="text-sm font-semibold mb-1">Work Details/Progress</h4>
              <p className="text-sm text-muted-foreground">{task.workDetails}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          
          {onEdit && (
            <Button onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit Task
            </Button>
          )}
          
          {onComplete && (
            <Button onClick={onComplete}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Mark Complete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
