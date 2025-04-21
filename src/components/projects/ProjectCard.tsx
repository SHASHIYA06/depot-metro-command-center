
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink } from "lucide-react";

const statusColorMap: Record<string, string> = {
  "Operational": "bg-green-500",
  "Under Construction": "bg-yellow-500",
  "Upcoming": "bg-blue-500",
  "Planned": "bg-purple-500",
};

const ProjectCard = ({ project }: { project: any }) => {
  const statusClass = statusColorMap[project.status] || "bg-gray-500";
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
          <Badge className={`${statusClass} text-white`}>{project.status}</Badge>
        </div>
        <CardDescription className="flex items-center mt-1">
          <MapPin className="h-4 w-4 mr-1 inline" /> 
          {project.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{project.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Length</p>
            <p className="font-medium">{project.networkLength} km</p>
          </div>
          <div>
            <p className="text-muted-foreground">Stations</p>
            <p className="font-medium">{project.stations}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Start Date</p>
            <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completion</p>
            <p className="font-medium">{new Date(project.completionDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium">{project.completionPercentage}%</span>
          </div>
          <Progress value={project.completionPercentage} className="h-2" />
        </div>
        <div className="pt-2">
          <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
