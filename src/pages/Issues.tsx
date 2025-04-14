
import React, { useState } from 'react';
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
  getIssuesBySeverity 
} from '@/lib/mockData';
import { Issue } from '@/types';

const Issues = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Different users see different issues based on their role
  const openIssues = getIssuesByStatus('open');
  const inProgressIssues = getIssuesByStatus('in_progress');
  const resolvedIssues = getIssuesByStatus('resolved');
  
  // For employees/engineers, show only their assigned issues
  const userIssues = user?.role !== 'depot_incharge' 
    ? getIssuesByAssignee(user?.id || '')
    : [];
  
  const handleAddNewIssue = () => {
    setEditingIssue(null);
    setShowForm(true);
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setShowForm(true);
  };
  
  const handleIssueFormClose = (refreshData: boolean = false) => {
    setShowForm(false);
    setEditingIssue(null);
    
    if (refreshData) {
      toast({
        title: 'Success',
        description: editingIssue ? 'Issue updated successfully' : 'Issue created successfully',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issues & Work Activity</h1>
          <p className="text-muted-foreground">
            {user?.role === 'depot_incharge' 
              ? 'Manage and assign work activities for all staff' 
              : 'View and update your assigned work activities'}
          </p>
        </div>
        
        {user?.role === 'depot_incharge' && (
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
          <TabsTrigger value="stats">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {showForm ? (
            <IssueForm 
              issue={editingIssue} 
              onClose={handleIssueFormClose} 
            />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {user?.role !== 'depot_incharge' && userIssues.length > 0 && (
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
                      viewOnly={user?.role !== 'depot_incharge'} 
                    />
                  </CardContent>
                </Card>
              )}

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
                    viewOnly={user?.role !== 'depot_incharge'} 
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
                    viewOnly={user?.role !== 'depot_incharge'} 
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
                    viewOnly={user?.role !== 'depot_incharge'} 
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats">
          <IssueStats />
        </TabsContent>

        <TabsContent value="reports">
          <IssueReports />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Issues;
