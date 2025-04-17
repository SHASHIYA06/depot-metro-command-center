import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, FileText, User, Calendar, Train, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ActivityLog, ExportColumnDefinition } from '@/types';
import { users, trains } from '@/lib/mockData';
import { exportToExcel, exportToPDF, formatDataForExport } from '@/utils/exportUtils';

interface ActivityDetailsProps {
  activity: ActivityLog;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({ 
  activity, 
  open, 
  onOpenChange 
}) => {
  const user = users.find(u => u.id === activity.userId);
  const train = activity.trainId ? trains.find(t => t.id === activity.trainId) : undefined;
  
  const exportActivityData = (format: 'excel' | 'pdf') => {
    const activityData = [{
      Action: activity.action,
      Details: activity.details,
      User: user?.name || 'Unknown',
      Train: train?.name || 'N/A',
      Timestamp: new Date(activity.timestamp).toLocaleString(),
      TaskID: activity.taskId || 'N/A',
      CarID: activity.carId || 'N/A'
    }];
    
    if (format === 'excel') {
      exportToExcel(activityData, `Activity_${activity.id}`);
    } else {
      const columns: ExportColumnDefinition[] = [
        { header: 'Property', dataKey: 'property' },
        { header: 'Value', dataKey: 'value' }
      ];
      
      exportToPDF(
        activityData,
        `Activity_${activity.id}`,
        'Activity Details',
        columns
      );
    }
  };
  
  const activityDetailsList = [
    { label: 'Activity Type', value: activity.action },
    { label: 'Details', value: activity.details },
    { label: 'Date & Time', value: format(new Date(activity.timestamp), 'PPpp') },
    { label: 'Performed By', value: user?.name || 'Unknown' },
    { label: 'Train Set', value: train?.name || 'N/A' },
    { label: 'Car ID', value: activity.carId || 'N/A' },
    { label: 'Task ID', value: activity.taskId || 'N/A' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Activity Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this activity
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="related">Related Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge className="px-3 py-1 text-sm">
                {activity.action}
              </Badge>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportActivityData('excel')}
                >
                  <Download className="mr-1 h-4 w-4" />
                  Export Excel
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportActivityData('pdf')}
                >
                  <Download className="mr-1 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  {activityDetailsList.map((detail, index) => (
                    <div key={index} className="space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">{detail.label}:</dt>
                      <dd className="text-base">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-2 mt-4">
              <h3 className="text-lg font-medium">Activity Description</h3>
              <p className="text-muted-foreground">
                {activity.details}
                {activity.action.includes('Maintenance') && 
                  ' This activity was part of scheduled maintenance operations to ensure optimal functioning of the train.'}
                {activity.action.includes('Inspection') && 
                  ' Regular inspections are critical for maintaining safety standards and operational readiness.'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="space-y-4">
            <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
              <div className="relative">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-primary"></div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(activity.timestamp), 'PPpp')}
                  </span>
                  <span className="font-medium">{activity.action}</span>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-gray-300"></div>
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(new Date(activity.timestamp).getTime() - 1000 * 60 * 30), 'PPpp')}
                  </span>
                  <span className="font-medium">Preparation</span>
                  <p className="text-sm text-muted-foreground">Activity preparation was initiated</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="related" className="space-y-4">
            {activity.trainId && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Related Train</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Train className="h-4 w-4 mr-2 text-primary" />
                    <span>{train?.name || 'Unknown Train'}</span>
                  </div>
                  {train && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Status: {train.status} | Last Maintenance: {train.lastMaintenance}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {activity.taskId && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Related Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Task ID: {activity.taskId}</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    View Task Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
