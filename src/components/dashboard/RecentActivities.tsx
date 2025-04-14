
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { ActivityLog } from '@/types';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

interface RecentActivitiesProps {
  activities: ActivityLog[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  // Function to get icon based on action type
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Task Completion':
        return <CheckCircle className="h-5 w-5 text-metro-success" />;
      case 'Issue Reported':
        return <AlertTriangle className="h-5 w-5 text-metro-warning" />;
      case 'Task Started':
        return <Clock className="h-5 w-5 text-metro-info" />;
      default:
        return <Activity className="h-5 w-5 text-metro-primary" />;
    }
  };

  // Function to generate a time ago string
  const getTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest actions in the depot</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="mr-4 mt-0.5">
                  {getActionIcon(activity.action)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{getTimeAgo(activity.timestamp)}</span>
                    <span className="mx-1">•</span>
                    <span>{format(new Date(activity.timestamp), 'MMM dd, HH:mm')}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">No recent activities</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
