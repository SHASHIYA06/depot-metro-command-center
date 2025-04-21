
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, X, Building, CalendarDays, Clock, MapIcon } from "lucide-react";

interface MetroCitySidebarProps {
  cityName: string;
  projects: any[];
  onClose: () => void;
}

const MetroCitySidebar = ({ cityName, projects, onClose }: MetroCitySidebarProps) => {
  const operationalProjects = projects.filter(p => p.status === 'Operational');
  const constructionProjects = projects.filter(p => p.status === 'Under Construction');
  const upcomingProjects = projects.filter(p => p.status === 'Upcoming' || p.status === 'Planned');

  // Calculate total length of network
  const totalLength = projects.reduce((total, p) => total + parseFloat(p.networkLength), 0).toFixed(1);
  
  // Calculate total stations
  const totalStations = projects.reduce((total, p) => total + parseInt(p.stations || 0), 0);

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{cityName}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <CardDescription className="flex flex-col space-y-1 mt-2">
          <div className="flex items-center gap-1">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span>{projects.length} Total Projects</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{totalLength} km Network Length</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{totalStations} Stations</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <Tabs defaultValue="operational">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="operational">
              Running
              <Badge className="ml-1 bg-green-100 text-green-800">{operationalProjects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="construction">
              Construction
              <Badge className="ml-1 bg-yellow-100 text-yellow-800">{constructionProjects.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming
              <Badge className="ml-1 bg-blue-100 text-blue-800">{upcomingProjects.length}</Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="operational" className="space-y-2 mt-2">
            {operationalProjects.length > 0 ? (
              operationalProjects.map(project => (
                <ProjectListItem key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No operational projects found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="construction" className="space-y-2 mt-2">
            {constructionProjects.length > 0 ? (
              constructionProjects.map(project => (
                <ProjectListItem key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No projects under construction
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="space-y-2 mt-2">
            {upcomingProjects.length > 0 ? (
              upcomingProjects.map(project => (
                <ProjectListItem key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No upcoming projects
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" size="sm">
          <MapIcon className="h-4 w-4 mr-2" />
          View on Map
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper component for project list items
const ProjectListItem = ({ project }: { project: any }) => {
  const statusColorMap: Record<string, string> = {
    "Operational": "bg-green-500",
    "Under Construction": "bg-yellow-500",
    "Upcoming": "bg-blue-500",
    "Planned": "bg-purple-500",
  };
  
  return (
    <div className="p-2 border rounded-md hover:bg-slate-50">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-sm">{project.name}</h3>
        <Badge className={`text-[10px] ${statusColorMap[project.status] || "bg-gray-500"} text-white px-1.5 py-0`}>
          {project.status}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
        <span>{project.networkLength} km</span>
        <span>•</span>
        <span>{project.stations} stations</span>
      </div>
      <div className="text-xs flex items-center mt-1">
        <CalendarDays className="h-3 w-3 mr-1 text-muted-foreground" />
        <span>Completion: {new Date(project.completionDate).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default MetroCitySidebar;
