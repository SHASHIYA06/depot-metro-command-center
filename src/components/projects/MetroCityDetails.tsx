
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Calendar, Train, Building, X } from 'lucide-react';
import { Project } from '@/types';
import { getMetroWebsiteByCity } from '@/lib/metroWebsites';

interface MetroCityDetailsProps {
  cityId: string;
  cityName: string;
  projects: Project[];
  onClose: () => void;
}

const MetroCityDetails = ({ cityId, cityName, projects, onClose }: MetroCityDetailsProps) => {
  const metroWebsite = getMetroWebsiteByCity(cityId);
  
  const operationalProjects = projects.filter(p => p.status === 'Operational');
  const underConstructionProjects = projects.filter(p => p.status === 'Under Construction');
  const upcomingProjects = projects.filter(p => 
    p.status === 'Upcoming' || p.status === 'Planned'
  );
  
  const totalLength = projects.reduce((sum, project) => sum + project.networkLength, 0);
  const totalStations = projects.reduce((sum, project) => sum + (project.stations || 0), 0);
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle>{cityName}</CardTitle>
          <CardDescription>Metro Rail Network</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground">Total Length</p>
              <p className="font-medium">{totalLength} km</p>
            </div>
            <div className="bg-muted rounded-md p-2">
              <p className="text-xs text-muted-foreground">Total Stations</p>
              <p className="font-medium">{totalStations}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-green-100 rounded-md p-2">
              <p className="text-xs text-green-800">Operational</p>
              <p className="font-medium">{operationalProjects.length}</p>
            </div>
            <div className="bg-yellow-100 rounded-md p-2">
              <p className="text-xs text-yellow-800">Under Construction</p>
              <p className="font-medium">{underConstructionProjects.length}</p>
            </div>
            <div className="bg-blue-100 rounded-md p-2">
              <p className="text-xs text-blue-800">Upcoming</p>
              <p className="font-medium">{upcomingProjects.length}</p>
            </div>
          </div>
        </div>
        
        {metroWebsite && (
          <div className="border rounded-lg p-3">
            <h4 className="text-sm font-medium mb-2">Official Website</h4>
            <a 
              href={metroWebsite.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary text-sm hover:underline"
            >
              {metroWebsite.name}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
        
        <div>
          <h4 className="text-sm font-medium mb-2">Lines Overview</h4>
          <div className="space-y-3">
            {projects.map(project => (
              <div key={project.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <h5 className="font-medium text-sm">{project.name}</h5>
                  <Badge className={`${
                    project.status === 'Operational' ? 'bg-green-500' : 
                    project.status === 'Under Construction' ? 'bg-yellow-500' : 
                    'bg-blue-500'
                  } text-white`}>
                    {project.status}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Length:</span> {project.networkLength} km
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stations:</span> {project.stations || 'N/A'}
                  </div>
                </div>
                
                {project.routeMap && (
                  <div className="mt-2">
                    <button 
                      className="text-xs text-primary flex items-center"
                      onClick={() => window.open(project.routeMap, '_blank')}
                    >
                      <MapPin className="h-3 w-3 mr-1" /> View Route Map
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" onClick={() => window.open('https://www.themetrorailguy.com/', '_blank')}>
          View on The Metro Rail Guy
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MetroCityDetails;
