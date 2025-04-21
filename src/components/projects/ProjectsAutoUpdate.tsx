
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectsAutoUpdate = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(
    localStorage.getItem('lastProjectDataUpdate')
  );
  
  useEffect(() => {
    // If we don't have a last updated time, set it to now
    if (!lastUpdated) {
      const now = new Date().toISOString();
      localStorage.setItem('lastProjectDataUpdate', now);
      setLastUpdated(now);
    }
  }, [lastUpdated]);
  
  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    
    const lastDate = new Date(lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return "Less than an hour ago";
    }
  };
  
  // Update timestamp to simulate fetching data
  const handleUpdateNow = () => {
    const now = new Date().toISOString();
    localStorage.setItem('lastProjectDataUpdate', now);
    setLastUpdated(now);
    setShowNotification(false);
  };
  
  if (!showNotification) return null;
  
  return (
    <Card className="bg-muted/50 border-muted">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="text-sm font-medium">Project data auto-updates every 24 hours</p>
            <p className="text-xs text-muted-foreground">
              Last updated: {formatLastUpdated()}
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
