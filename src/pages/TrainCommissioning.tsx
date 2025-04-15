
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { syncTrainCommissioningToSheets } from '@/utils/googleSheetsIntegration';
import { CommissioningForm } from '@/components/commissioning/CommissioningForm';
import { CommissioningTable } from '@/components/commissioning/CommissioningTable';
import { Search } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommissioningActivity {
  id: string;
  trainSet: string;
  carNo: string;
  system: string;
  activity: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks: string;
  officer: string;
  date: string;
  photoUrls: string[];
}

const TrainCommissioning = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<CommissioningActivity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<CommissioningActivity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [trainSetFilter, setTrainSetFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<CommissioningActivity | null>(null);
  const itemsPerPage = 10;

  const canAccessCommissioning = user?.role === UserRole.DEPOT_INCHARGE || user?.role === UserRole.ENGINEER;

  // Load mock data for now - in a real app, this would be fetched from an API
  useEffect(() => {
    // Mock data for now
    const mockActivities: CommissioningActivity[] = [
      {
        id: '1',
        trainSet: 'TS15',
        carNo: 'DMC1, TC1',
        system: 'Traction System',
        activity: 'Propulsion test dynamic',
        status: 'Completed',
        remarks: 'All tests passed successfully',
        officer: 'Araghya',
        date: '2025-03-23T10:30:00',
        photoUrls: ['https://placehold.co/300x200?text=Test+Photo']
      },
      {
        id: '2',
        trainSet: 'TS16',
        carNo: 'All Cars',
        system: 'Air Conditioning System',
        activity: 'VAC internal test and witness',
        status: 'In Progress',
        remarks: 'Temperature tests ongoing',
        officer: 'Shashi',
        date: '2025-03-23T14:15:00',
        photoUrls: ['https://placehold.co/300x200?text=AC+Test']
      },
      {
        id: '3',
        trainSet: 'TS17',
        carNo: 'MC1, MC2',
        system: 'Brake System',
        activity: 'Brake pneumatic test dynamic',
        status: 'Pending',
        remarks: 'Scheduled for tomorrow',
        officer: 'Araghya',
        date: '2025-03-24T09:00:00',
        photoUrls: []
      },
    ];
    
    setActivities(mockActivities);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...activities];

    // Apply train set filter
    if (trainSetFilter && trainSetFilter !== 'all') {
      result = result.filter(item => item.trainSet === trainSetFilter);
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.trainSet.toLowerCase().includes(searchLower) ||
        item.carNo.toLowerCase().includes(searchLower) ||
        item.system.toLowerCase().includes(searchLower) ||
        item.activity.toLowerCase().includes(searchLower) ||
        item.status.toLowerCase().includes(searchLower) ||
        item.remarks.toLowerCase().includes(searchLower) ||
        item.officer.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredActivities(result);
  }, [activities, searchTerm, trainSetFilter, statusFilter]);

  const handleAddActivity = (newActivity: Omit<CommissioningActivity, 'id' | 'date'>) => {
    const activity: CommissioningActivity = {
      ...newActivity,
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
    };

    // Add to local state
    setActivities(prev => [activity, ...prev]);
    
    // Sync to Google Sheets
    syncTrainCommissioningToSheets(activity)
      .then(success => {
        if (success) {
          toast({
            title: "Success",
            description: "Activity has been recorded and synced to Google Sheets",
          });
        } else {
          toast({
            title: "Warning",
            description: "Activity recorded locally but sync to Google Sheets failed",
            variant: "destructive"
          });
        }
      });

    setShowForm(false);
  };

  const handleEditActivity = (activity: CommissioningActivity) => {
    // Only allow editing by the same officer who created the entry
    if (activity.officer !== user?.name) {
      toast({
        title: "Permission Denied",
        description: "You can only edit activities that you created",
        variant: "destructive"
      });
      return;
    }

    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleUpdateActivity = (updatedActivity: CommissioningActivity) => {
    // Update in the activities array
    setActivities(prev => 
      prev.map(item => item.id === updatedActivity.id ? updatedActivity : item)
    );

    // Sync to Google Sheets
    syncTrainCommissioningToSheets(updatedActivity)
      .then(success => {
        if (success) {
          toast({
            title: "Success",
            description: "Activity has been updated and synced to Google Sheets",
          });
        } else {
          toast({
            title: "Warning",
            description: "Activity updated locally but sync to Google Sheets failed",
            variant: "destructive"
          });
        }
      });

    setEditingActivity(null);
    setShowForm(false);
  };

  const handleDeleteActivity = (id: string, officer: string) => {
    // Only allow deletion by the same officer who created the entry
    if (officer !== user?.name) {
      toast({
        title: "Permission Denied",
        description: "You can only delete activities that you created",
        variant: "destructive"
      });
      return;
    }

    // Remove from local state
    setActivities(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Success",
      description: "Activity has been deleted",
    });
  };

  const exportToExcel = () => {
    // In a real application, this would use a library like exceljs
    // For now, we'll just create a simple CSV
    const headers = ['Train Set', 'Car No', 'System', 'Activity', 'Status', 'Remarks', 'Officer', 'Date'];
    const data = filteredActivities.map(a => [
      a.trainSet,
      a.carNo,
      a.system,
      a.activity,
      a.status,
      a.remarks,
      a.officer,
      new Date(a.date).toLocaleString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'train_commissioning_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // In a real application, this would use a library like jspdf
    toast({
      title: "Export to PDF",
      description: "PDF export functionality would be implemented with a library like jsPDF",
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!canAccessCommissioning) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">
          Only Depot Incharge and Engineers can access the Train Commissioning module.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Train Commissioning</h1>
          <p className="text-muted-foreground">
            Track and manage commissioning activities for train sets TS15-TS17
          </p>
        </div>
        
        <Button onClick={() => {
          setEditingActivity(null);
          setShowForm(true);
        }}>
          Add New Activity
        </Button>
      </div>

      {showForm && (
        <CommissioningForm 
          activity={editingActivity}
          onSubmit={editingActivity ? handleUpdateActivity : handleAddActivity}
          onCancel={() => {
            setShowForm(false);
            setEditingActivity(null);
          }}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select value={trainSetFilter} onValueChange={setTrainSetFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Train Set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Train Sets</SelectItem>
              <SelectItem value="TS15">TS15</SelectItem>
              <SelectItem value="TS16">TS16</SelectItem>
              <SelectItem value="TS17">TS17</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportToExcel}>
            Export to Excel
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            Export to PDF
          </Button>
        </div>
      </div>

      <CommissioningTable 
        activities={currentActivities}
        currentUser={user?.name || ''}
        onEdit={handleEditActivity}
        onDelete={handleDeleteActivity}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="flex items-center px-3">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TrainCommissioning;
