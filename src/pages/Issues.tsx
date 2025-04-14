
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { IssuesList } from '@/components/issues/IssuesList';
import { IssueForm } from '@/components/issues/IssueForm';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, FileSearch, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IssueStats } from '@/components/issues/IssueStats';
import { IssueReports } from '@/components/issues/IssueReports';
import { 
  getIssuesByStatus, 
  getIssuesByAssignee,
  getIssuesByAssigner,
  getIssuesBySeverity 
} from '@/lib/mockData';
import { Issue, UserRole } from '@/types';

const Issues = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    // Fetch appropriate issues based on user role
    loadIssues();
  }, [user]);

  const loadIssues = () => {
    // Get issues based on user role
    let roleBasedIssues: Issue[] = [];

    if (user?.role === UserRole.DEPOT_INCHARGE) {
      // Depot Incharge can see all issues
      roleBasedIssues = [
        ...getIssuesByStatus('open'),
        ...getIssuesByStatus('in_progress'),
        ...getIssuesByStatus('resolved')
      ];
    } else if (user?.role === UserRole.ENGINEER) {
      // Engineers can see issues they created and issues assigned to them
      const assignedIssues = getIssuesByAssignee(user.id);
      const createdIssues = getIssuesByAssigner(user.id);
      
      // Combine and deduplicate
      const combinedIssues = [...assignedIssues, ...createdIssues];
      const uniqueIssueIds = new Set(combinedIssues.map(issue => issue.id));
      roleBasedIssues = Array.from(uniqueIssueIds).map(id => 
        combinedIssues.find(issue => issue.id === id)!
      );
    } else {
      // Technicians can only see issues assigned to them
      roleBasedIssues = getIssuesByAssignee(user?.id || '');
    }

    setIssues(roleBasedIssues);
  };

  // Get open issues for all users
  const openIssues = issues.filter(issue => issue.status === 'open');
  const inProgressIssues = issues.filter(issue => issue.status === 'in_progress');
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved');
  
  // Get issues specific to the current user
  const userIssues = user?.role !== UserRole.DEPOT_INCHARGE 
    ? getIssuesByAssignee(user?.id || '')
    : [];

  const handleAddNewIssue = () => {
    setEditingIssue(null);
    setShowForm(true);
  };

  const handleEditIssue = (issue: Issue) => {
    // Check if user has permission to edit
    if (canEditIssue(issue)) {
      setEditingIssue(issue);
      setShowForm(true);
    } else {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to edit this activity.',
        variant: 'destructive'
      });
    }
  };
  
  const handleIssueFormClose = (refreshData: boolean = false) => {
    setShowForm(false);
    setEditingIssue(null);
    
    if (refreshData) {
      toast({
        title: 'Success',
        description: editingIssue ? 'Activity updated successfully' : 'Activity created successfully',
      });
      
      // Reload issues to reflect changes
      loadIssues();
    }
  };

  // Function to determine if user can edit an issue
  const canEditIssue = (issue: Issue): boolean => {
    if (user?.role === UserRole.DEPOT_INCHARGE) {
      // Depot Incharge can edit all issues
      return true;
    } else if (user?.role === UserRole.ENGINEER) {
      // Engineers can edit their own issues and update issues assigned to them
      return issue.assignedTo === user.id;
    } else if (user?.role === UserRole.TECHNICIAN) {
      // Technicians can only update issues assigned to them
      return issue.assignedTo === user.id;
    }
    
    return false;
  };

  // Determine if the current user is an officer (engineer)
  const isOfficer = user?.role === UserRole.ENGINEER;
  const isTechnician = user?.role === UserRole.TECHNICIAN;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Activities</h1>
          <p className="text-muted-foreground">
            {user?.role === UserRole.DEPOT_INCHARGE 
              ? 'Manage and assign work activities for all staff' 
              : isOfficer
                ? 'Assign and monitor work activities for technicians'
                : 'View and update your assigned work activities'}
          </p>
        </div>
        
        {/* Only depot incharge and engineers can create new activities */}
        {(user?.role === UserRole.DEPOT_INCHARGE || isOfficer) && (
          <Button onClick={handleAddNewIssue}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Activity
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="list">
            <FileSearch className="mr-2 h-4 w-4" />
            Activities
          </TabsTrigger>
          {/* Only show stats and reports tabs to depot incharge */}
          {user?.role === UserRole.DEPOT_INCHARGE && (
            <>
              <TabsTrigger value="stats">
                <BarChart3 className="mr-2 h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="reports">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {showForm ? (
            <IssueForm 
              issue={editingIssue} 
              onClose={handleIssueFormClose} 
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {/* For technicians and engineers, show their assigned issues first */}
              {(isOfficer || isTechnician) && userIssues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Assigned Activities</CardTitle>
                    <CardDescription>
                      Work activities assigned to you that require attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IssuesList 
                      issues={userIssues} 
                      onEdit={handleEditIssue}
                      viewOnly={false} 
                    />
                  </CardContent>
                </Card>
              )}

              {/* Show all sections for depot incharge */}
              {user?.role === UserRole.DEPOT_INCHARGE && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Open Activities</CardTitle>
                      <CardDescription>
                        Newly created work activities that need to be assigned
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <IssuesList 
                        issues={openIssues} 
                        onEdit={handleEditIssue}
                        viewOnly={false} 
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>In Progress Activities</CardTitle>
                      <CardDescription>
                        Work activities currently being attended to
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <IssuesList 
                        issues={inProgressIssues} 
                        onEdit={handleEditIssue}
                        viewOnly={false} 
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resolved Activities</CardTitle>
                      <CardDescription>
                        Work activities that have been completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <IssuesList 
                        issues={resolvedIssues} 
                        onEdit={handleEditIssue}
                        viewOnly={false} 
                      />
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* Show relevant sections for engineers (officers) */}
              {isOfficer && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Open Activities</CardTitle>
                      <CardDescription>
                        Activities that need to be assigned to technicians
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <IssuesList 
                        issues={openIssues} 
                        onEdit={handleEditIssue}
                        viewOnly={false} 
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>In Progress Activities</CardTitle>
                      <CardDescription>
                        Activities currently being worked on by technicians
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <IssuesList 
                        issues={inProgressIssues} 
                        onEdit={handleEditIssue}
                        viewOnly={false} 
                      />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}
        </TabsContent>

        {user?.role === UserRole.DEPOT_INCHARGE && (
          <>
            <TabsContent value="stats">
              <IssueStats />
            </TabsContent>

            <TabsContent value="reports">
              <IssueReports />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default Issues;
