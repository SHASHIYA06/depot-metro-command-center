
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Search
} from 'lucide-react';
import { Issue } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getUserById } from '@/lib/mockData';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface IssuesListProps {
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  viewOnly?: boolean;
}

export const IssuesList: React.FC<IssuesListProps> = ({ 
  issues, 
  onEdit,
  viewOnly = false
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>(issues);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<Issue | null>(null);

  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredIssues(issues);
    } else {
      const filtered = issues.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredIssues(filtered);
    }
  }, [searchTerm, issues]);

  const getSeverityBadgeClass = (severity: Issue['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-600 hover:bg-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-600 hover:bg-red-200';
      default:
        return '';
    }
  };

  const getStatusBadgeClass = (status: Issue['status']) => {
    switch (status) {
      case 'open':
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-600 hover:bg-green-200';
      default:
        return '';
    }
  };

  const handleDeleteClick = (issue: Issue) => {
    setIssueToDelete(issue);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the issue
    toast({
      title: 'Activity Deleted',
      description: `The work activity "${issueToDelete?.title}" has been deleted.`,
    });
    setIsDeleteDialogOpen(false);
    setIssueToDelete(null);
  };

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Unassigned';
    const assignee = getUserById(assigneeId);
    return assignee ? assignee.name : 'Unknown';
  };

  if (filteredIssues.length === 0) {
    return (
      <div>
        <div className="relative w-full mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center justify-center py-10">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No activities found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm ? 'Try using different keywords or filters' : 'No activities have been created yet'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Severity</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
              <TableHead className="hidden lg:table-cell">Reported</TableHead>
              {!viewOnly && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{issue.title}</div>
                    <div className="text-sm text-muted-foreground mt-1 md:hidden">
                      <Badge className={cn("mr-1", getSeverityBadgeClass(issue.severity))}>
                        {issue.severity}
                      </Badge>
                      <Badge className={getStatusBadgeClass(issue.status)}>
                        {issue.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={getSeverityBadgeClass(issue.severity)}>
                    {issue.severity}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge className={getStatusBadgeClass(issue.status)}>
                    {issue.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {getAssigneeName(issue.assignedTo)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(issue.reportedAt), 'MMM dd, yyyy')}
                </TableCell>
                {!viewOnly && (
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onEdit(issue)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user?.role === 'depot_incharge' && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteClick(issue)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      {user?.id === issue.assignedTo && issue.status !== 'resolved' && (
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="text-metro-success"
                          onClick={() => onEdit({...issue, status: 'resolved'})}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the work activity "{issueToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
