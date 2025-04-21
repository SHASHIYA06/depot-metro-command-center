
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map as MapIcon, Building, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This would be a temporary component that would be replaced by a real map
// using services like Mapbox, Google Maps, etc.
const MapView = ({ 
  projects, 
  onReturn, 
  selectedCity = null 
}: { 
  projects: any[]; 
  onReturn: () => void; 
  selectedCity?: string | null;
}) => {
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapApiKey, setMapApiKey] = useState<string>(() => {
    return localStorage.getItem('mapboxApiKey') || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(!mapApiKey);

  const filteredProjects = selectedCity 
    ? projects.filter(p => p.location.toLowerCase().includes(selectedCity.toLowerCase()))
    : projects;
    
  const handleSaveApiKey = () => {
    if (mapApiKey) {
      localStorage.setItem('mapboxApiKey', mapApiKey);
      setShowApiKeyInput(false);
      toast({
        title: "API Key saved",
        description: "Your Mapbox API key has been saved for this session."
      });
    }
  };
  
  useEffect(() => {
    if (!mapContainerRef.current || !mapApiKey || showApiKeyInput) return;
    
    // Instead of importing mapboxgl directly, we can dynamically load it
    const loadMapbox = async () => {
      try {
        const mapboxgl = (await import('mapbox-gl')).default;
        await import('mapbox-gl/dist/mapbox-gl.css');
        
        mapboxgl.accessToken = mapApiKey;
        
        const map = new mapboxgl.Map({
          container: mapContainerRef.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [78.9629, 20.5937], // Center of India
          zoom: 4
        });
        
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add markers for each project
        filteredProjects.forEach(project => {
          try {
            if (project.coordinates) {
              const [lng, lat] = project.coordinates;
              
              // Create color based on project status
              let color = '#3b82f6'; // default blue
              if (project.status === 'Operational') color = '#22c55e'; // green
              if (project.status === 'Under Construction') color = '#f59e0b'; // yellow
              if (project.status === 'Upcoming' || project.status === 'Planned') color = '#8b5cf6'; // purple
              
              // Create a popup
              const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<div style="padding: 8px;">
                  <h3 style="font-weight: bold; margin-bottom: 4px;">${project.name}</h3>
                  <p style="font-size: 12px; margin-bottom: 4px;">Status: ${project.status}</p>
                  <p style="font-size: 12px; margin-bottom: 4px;">Length: ${project.networkLength} km</p>
                  ${project.stations ? `<p style="font-size: 12px;">Stations: ${project.stations}</p>` : ''}
                </div>`
              );
              
              // Create a DOM element for the marker
              const el = document.createElement('div');
              el.className = 'custom-marker';
              el.style.backgroundColor = color;
              el.style.width = '24px';
              el.style.height = '24px';
              el.style.borderRadius = '50%';
              el.style.border = '2px solid white';
              el.style.boxShadow = '0 0 4px rgba(0,0,0,0.3)';
              
              // Add marker to map
              new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map);
            }
          } catch (error) {
            console.error(`Error adding marker for project ${project.name}:`, error);
          }
        });
        
        return () => {
          map.remove();
        };
      } catch (error) {
        console.error('Error loading Mapbox:', error);
        toast({
          title: "Map loading error",
          description: "Could not load the map. Please try again later.",
          variant: "destructive"
        });
      }
    };
    
    loadMapbox();
  }, [mapApiKey, showApiKeyInput, filteredProjects, toast]);
  
  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">
            {selectedCity ? `${selectedCity} Metro Projects Map` : 'Metro Projects Map View'}
          </CardTitle>
        </div>
        <Button
          variant="outline"
          onClick={onReturn}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Button>
      </CardHeader>
      <CardContent>
        {showApiKeyInput ? (
          <div className="flex flex-col items-center justify-center p-6 space-y-4 border rounded-lg bg-gray-50 h-[600px]">
            <MapIcon className="h-12 w-12 text-muted-foreground" />
            <div className="text-center max-w-md">
              <h3 className="text-lg font-medium mb-2">Enter your Mapbox API Key</h3>
              <p className="text-muted-foreground mb-4">
                To view the interactive map, please enter your Mapbox public token. You can get one by signing up at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={mapApiKey}
                  onChange={(e) => setMapApiKey(e.target.value)}
                  placeholder="pk.eyJ1IjoieW91..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <Button onClick={handleSaveApiKey}>Save</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-[600px] rounded-lg border overflow-hidden">
            <div ref={mapContainerRef} className="absolute inset-0"></div>
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs">
              <h4 className="font-medium text-sm mb-2">Legend</h4>
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs">Operational</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs">Under Construction</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-xs">Upcoming/Planned</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapView;
