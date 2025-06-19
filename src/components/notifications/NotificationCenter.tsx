
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertTriangle, Clock, X, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  isRead: boolean;
  actionRequired: boolean;
  relatedEntity?: {
    type: 'job_card' | 'maintenance_schedule' | 'task' | 'issue';
    id: string;
    url?: string;
  };
  assignedBy?: string;
  dueDate?: Date;
}

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'priority'>('all');

  // Mock notifications - In real app, this would come from API/WebSocket
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Job Card Assignment',
        message: 'Job Card JC-2025-001 has been assigned to you for Train TS15 propulsion system maintenance.',
        type: 'info',
        priority: 'high',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        isRead: false,
        actionRequired: true,
        relatedEntity: { type: 'job_card', id: 'JC-2025-001', url: '/job-cards/JC-2025-001' },
        assignedBy: 'Depot Incharge',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Due tomorrow
      },
      {
        id: '2',
        title: 'Critical Maintenance Schedule',
        message: 'Service Check B4 for Train TS12 is overdue by 2 days. Immediate attention required.',
        type: 'error',
        priority: 'critical',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        actionRequired: true,
        relatedEntity: { type: 'maintenance_schedule', id: 'MS-B4-TS12', url: '/maintenance-schedule' }
      },
      {
        id: '3',
        title: 'Task Completion Reminder',
        message: 'Task "HVAC Filter Replacement" is due today. Please update the progress.',
        type: 'warning',
        priority: 'medium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: false,
        actionRequired: true,
        relatedEntity: { type: 'task', id: 'T-HVAC-001', url: '/tasks' },
        dueDate: new Date()
      },
      {
        id: '4',
        title: 'New Issue Reported',
        message: 'Door malfunction reported in Train TS18 Car DMC1. Requires immediate investigation.',
        type: 'warning',
        priority: 'high',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        isRead: true,
        actionRequired: false,
        relatedEntity: { type: 'issue', id: 'ISS-DOOR-001', url: '/issues' }
      },
      {
        id: '5',
        title: 'Maintenance Completed',
        message: 'Pantograph maintenance for Train TS03 has been completed successfully.',
        type: 'success',
        priority: 'low',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        isRead: true,
        actionRequired: false
      }
    ];

    setNotifications(mockNotifications);

    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 5 seconds
        const newNotification: Notification = {
          id: `new-${Date.now()}`,
          title: 'New Work Assignment',
          message: `New maintenance task has been assigned to you.`,
          type: 'info',
          priority: 'medium',
          timestamp: new Date(),
          isRead: false,
          actionRequired: true,
          relatedEntity: { type: 'task', id: `T-${Date.now()}`, url: '/tasks' }
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Show toast for high priority notifications
        if (newNotification.priority === 'high' || newNotification.priority === 'critical') {
          toast({
            title: newNotification.title,
            description: newNotification.message,
            variant: newNotification.type === 'error' ? 'destructive' : 'default'
          });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const priorityCount = notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length;

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'priority':
        return notifications.filter(n => n.priority === 'high' || n.priority === 'critical');
      default:
        return notifications;
    }
  };

  const sortedNotifications = getFilteredNotifications().sort((a, b) => {
    // Sort by priority first (critical > high > medium > low)
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    // Then by timestamp (newest first)
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Center
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Stay updated with work assignments and priority alerts
          </CardDescription>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All Read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === 'priority' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('priority')}
          >
            Priority ({priorityCount})
          </Button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sortedNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications found</p>
            </div>
          ) : (
            sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                  !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                } ${notification.priority === 'critical' ? 'border-l-4 border-l-red-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!notification.isRead ? 'text-blue-900' : ''}`}>
                          {notification.title}
                        </h4>
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                        {notification.actionRequired && (
                          <Badge variant="secondary" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        {notification.assignedBy && (
                          <span>Assigned by: {notification.assignedBy}</span>
                        )}
                        {notification.dueDate && (
                          <span className="text-orange-600">
                            Due: {notification.dueDate.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      
                      {notification.relatedEntity && (
                        <div className="mt-2">
                          <Button
                            variant="link"
                            size="sm"
                            className="p-0 h-auto text-blue-600"
                            onClick={() => {
                              markAsRead(notification.id);
                              if (notification.relatedEntity?.url) {
                                window.location.href = notification.relatedEntity.url;
                              }
                            }}
                          >
                            View Details →
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
