
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  ExternalLink, 
  Calendar, 
  Newspaper,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import { MetroNews } from "@/lib/metroNewsService";

const statusColorMap: Record<string, string> = {
  "Operational": "bg-green-500",
  "Under Construction": "bg-yellow-500",
  "Upcoming": "bg-blue-500",
  "Planned": "bg-purple-500",
};

interface ProjectCardProps {
  project: any;
  newsItems?: MetroNews[];
}

const ProjectCard = ({ project, newsItems = [] }: ProjectCardProps) => {
  const [showNews, setShowNews] = useState(false);
  const statusClass = statusColorMap[project.status] || "bg-gray-500";
  
  return (
    <Card className="h-full flex flex-col">
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
      <CardContent className="space-y-4 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
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
        
        {newsItems.length > 0 && (
          <div className="pt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full flex items-center justify-between gap-2 text-primary"
              onClick={() => setShowNews(!showNews)}
            >
              <span className="flex items-center">
                <Newspaper className="h-4 w-4 mr-1" />
                {newsItems.length} Related News
              </span>
              {showNews ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {showNews && (
              <div className="mt-2 space-y-2">
                {newsItems.slice(0, 2).map(news => (
                  <div key={news.id} className="border rounded p-2 text-xs">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium line-clamp-1">{news.title}</span>
                      <span className="flex items-center text-muted-foreground whitespace-nowrap ml-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(news.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground line-clamp-1">{news.excerpt}</p>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center mt-1"
                    >
                      Read More <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
          <ExternalLink className="h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
