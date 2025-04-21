
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectsAutoUpdate = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(
    localStorage.getItem('lastMetroProjectsUpdate')
  );
  
  useEffect(() => {
    // If we don't have a last updated time, set it to now
    if (!lastUpdated) {
      const now = new Date().toISOString();
      localStorage.setItem('lastMetroProjectsUpdate', Date.now().toString());
      setLastUpdated(Date.now().toString());
    }
    
    // Set up a timer to check for updates every minute
    const intervalId = setInterval(() => {
      const storedLastUpdate = localStorage.getItem('lastMetroProjectsUpdate');
      if (storedLastUpdate !== lastUpdated) {
        setLastUpdated(storedLastUpdate);
      }
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [lastUpdated]);
  
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    
    const lastDate = new Date(parseInt(lastUpdated));
    const now = new Date();
    const diffMs = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };
  
  // Update timestamp to simulate fetching data
  const handleUpdateNow = () => {
    // Force a page reload to trigger a fresh data fetch
    window.location.reload();
  };
  
  if (!showNotification) return null;
  
  const isStale = lastUpdated && (Date.now() - parseInt(lastUpdated)) > 7200000; // 2 hours
  
  return (
    <Card className={`${isStale ? 'bg-yellow-50 border-yellow-200' : 'bg-muted/50 border-muted'}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className={`h-5 w-5 ${isStale ? 'text-yellow-500' : 'text-blue-500'}`} />
          <div>
            <p className="text-sm font-medium">
              {isStale 
                ? "Project data might be outdated" 
                : "Project data auto-updates every 2 hours"}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated from metrorailguy.com: {formatLastUpdated()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={handleUpdateNow}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Update Now
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setShowNotification(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectsAutoUpdate;
