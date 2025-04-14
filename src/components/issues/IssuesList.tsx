
import React, { useState, useEffect } from 'react';
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
  Search,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Issue, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { getUserById, updateIssue, deleteIssue } from '@/lib/mockData';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { syncIssueToSheets } from '@/utils/googleSheetsIntegration';

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
  const [detailIssue, setDetailIssue] = useState<Issue | null>(null);
  const [showWorkDetails, setShowWorkDetails] = useState(false);

  useEffect(() => {
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
    if (issueToDelete) {
      // Delete the issue
      const success = deleteIssue(issueToDelete.id);
      
      if (success) {
        toast({
          title: 'Activity Deleted',
          description: `The work activity "${issueToDelete.title}" has been deleted.`,
        });
        
        // Remove the deleted issue from the filtered list
        setFilteredIssues(filteredIssues.filter(issue => issue.id !== issueToDelete.id));
      }
    }
    
    setIsDeleteDialogOpen(false);
    setIssueToDelete(null);
  };

  const getAssigneeName = (assigneeId?: string) => {
    if (!assigneeId) return 'Unassigned';
    const assignee = getUserById(assigneeId);
    return assignee ? assignee.name : 'Unknown';
  };

  const handleViewDetails = (issue: Issue) => {
    setDetailIssue(issue);
    setShowWorkDetails(false);
  };

  const handleViewWorkLog = (issue: Issue) => {
    setDetailIssue(issue);
    setShowWorkDetails(true);
  };

  const handleCompleteTask = (issue: Issue) => {
    // Update the issue status to resolved
    const updatedIssue = updateIssue(issue.id, { 
      status: 'resolved',
      resolvedAt: new Date().toISOString()
    });
    
    if (updatedIssue) {
      toast({
        title: 'Activity Completed',
        description: 'The work activity has been marked as completed.',
        variant: 'default',
      });
      
      // Sync to Google Sheets
      syncIssueToSheets(updatedIssue);
      
      // Refresh the issues list
      const updatedIssues = filteredIssues.map(i => 
        i.id === issue.id ? updatedIssue : i
      );
      setFilteredIssues(updatedIssues);
    }
  };

  const canUpdateIssueStatus = (issue: Issue) => {
    // Depot incharge can update any issue
    if (user?.role === UserRole.DEPOT_INCHARGE) return true;
    
    // Engineers can update issues assigned to them
    if (user?.role === UserRole.ENGINEER && issue.assignedTo === user.id) return true;
    
    // Technicians can only update issues assigned to them
    if (user?.role === UserRole.TECHNICIAN && issue.assignedTo === user.id) return true;
    
    return false;
  };

  const canEditIssue = (issue: Issue) => {
    // Depot incharge can edit any issue
    if (user?.role === UserRole.DEPOT_INCHARGE) return true;
    
    // Engineers can edit their own issues and update issues assigned to them
    if (user?.role === UserRole.ENGINEER) {
      return issue.assignedTo === user.id;
    }
    
    // Technicians can only update issues assigned to them
    if (user?.role === UserRole.TECHNICIAN && issue.assignedTo === user.id) return true;
    
    return false;
  };

  const canDeleteIssue = (issue: Issue) => {
    // Only depot incharge can delete issues
    return user?.role === UserRole.DEPOT_INCHARGE;
  };

  const canViewWorkLog = (issue: Issue) => {
    // Depot incharge and engineers can view work logs
    return user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER;
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
              <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  {format(new Date(issue.lastUpdated || issue.reportedAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {/* View details button - available to all */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleViewDetails(issue)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* View work log - mainly for supervisors */}
                    {canViewWorkLog(issue) && issue.workDetails && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleViewWorkLog(issue)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Edit button - based on user role and permissions */}
                    {canEditIssue(issue) && !viewOnly && (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => onEdit(issue)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Delete button - only for depot incharge */}
                    {canDeleteIssue(issue) && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteClick(issue)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* Mark as complete - for assigned users */}
                    {canUpdateIssueStatus(issue) && issue.status !== 'resolved' && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="text-metro-success"
                        onClick={() => handleCompleteTask(issue)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
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

      {/* Issue details dialog */}
      <Dialog open={!!detailIssue && !showWorkDetails} onOpenChange={(open) => !open && setDetailIssue(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailIssue?.title}</DialogTitle>
            <DialogDescription>
              Work activity details and information
            </DialogDescription>
          </DialogHeader>
          
          {detailIssue && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <Badge className={getSeverityBadgeClass(detailIssue.severity)}>
                  {detailIssue.severity} priority
                </Badge>
                <Badge className={getStatusBadgeClass(detailIssue.status)}>
                  {detailIssue.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{detailIssue.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">Assigned To</h4>
                  <p className="text-sm">{getAssigneeName(detailIssue.assignedTo)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">Reported On</h4>
                  <p className="text-sm">{format(new Date(detailIssue.reportedAt), 'MMM dd, yyyy')}</p>
                </div>
                
                {detailIssue.trainId && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Train</h4>
                    <p className="text-sm">{detailIssue.trainId}</p>
                  </div>
                )}
                
                {detailIssue.carId && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Car</h4>
                    <p className="text-sm">{detailIssue.carId}</p>
                  </div>
                )}
              </div>
              
              {detailIssue.workDetails && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Work Details</h4>
                  <p className="text-sm text-muted-foreground">{detailIssue.workDetails}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            {canEditIssue(detailIssue!) && (
              <Button onClick={() => {
                setDetailIssue(null);
                onEdit(detailIssue!);
              }}>
                Edit Activity
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Work details dialog */}
      <Dialog open={!!detailIssue && showWorkDetails} onOpenChange={(open) => {
        if (!open) {
          setDetailIssue(null);
          setShowWorkDetails(false);
        }
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Work Log</DialogTitle>
            <DialogDescription>
              {detailIssue?.title} - Work progress and updates
            </DialogDescription>
          </DialogHeader>
          
          {detailIssue && (
            <div className="space-y-4 py-4">
              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-semibold mb-2">Latest Update</h4>
                <p className="text-sm">{detailIssue.workDetails || "No work details available"}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated: {format(new Date(detailIssue.lastUpdated || detailIssue.reportedAt), 'MMM dd, yyyy')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Assigned To</h4>
                <p className="text-sm">{getAssigneeName(detailIssue.assignedTo)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Status</h4>
                <Badge className={getStatusBadgeClass(detailIssue.status)}>
                  {detailIssue.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            {canEditIssue(detailIssue!) && (
              <Button onClick={() => {
                setDetailIssue(null);
                setShowWorkDetails(false);
                onEdit(detailIssue!);
              }}>
                Edit Activity
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
