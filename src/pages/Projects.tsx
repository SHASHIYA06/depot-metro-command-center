
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Building, MapPin, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { projects as mockProjects, projectUpdates } from '@/lib/mockData';
import { fetchMetroNews, matchNewsToProjects } from '@/lib/metroNewsService';
import { useQuery } from '@tanstack/react-query';
// Component imports
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectStatsDashboard from '@/components/projects/ProjectStatsDashboard';
import MetroCityGrid from '@/components/projects/MetroCityGrid';
import RecentProjectUpdates from '@/components/projects/RecentProjectUpdates';
import MapView from '@/components/projects/MapView';
import ProjectsAutoUpdate from '@/components/projects/ProjectsAutoUpdate';
import MetroCitySidebar from '@/components/projects/MetroCitySidebar';

// Enhanced with additional data like coordinates for map view
const metroCities = [
  { id: 'delhi', name: 'Delhi Metro', projects: 14, color: '#ef4444', coordinates: [77.2090, 28.6139] },
  { id: 'mumbai', name: 'Mumbai Metro', projects: 8, color: '#3b82f6', coordinates: [72.8777, 19.0760] },
  { id: 'chennai', name: 'Chennai Metro', projects: 5, color: '#22c55e', coordinates: [80.2707, 13.0827] },
  { id: 'kolkata', name: 'Kolkata Metro', projects: 7, color: '#8b5cf6', coordinates: [88.3639, 22.5726] },
  { id: 'bangalore', name: 'Bangalore Metro', projects: 6, color: '#f59e0b', coordinates: [77.5946, 12.9716] },
  { id: 'hyderabad', name: 'Hyderabad Metro', projects: 4, color: '#06b6d4', coordinates: [78.4867, 17.3850] },
  { id: 'kochi', name: 'Kochi Metro', projects: 2, color: '#ec4899', coordinates: [76.2673, 9.9312] },
  { id: 'jaipur', name: 'Jaipur Metro', projects: 2, color: '#f43f5e', coordinates: [75.7873, 26.9124] },
  { id: 'lucknow', name: 'Lucknow Metro', projects: 2, color: '#14b8a6', coordinates: [80.9462, 26.8467] },
  { id: 'ahmedabad', name: 'Ahmedabad Metro', projects: 2, color: '#f97316', coordinates: [72.5714, 23.0225] },
  { id: 'nagpur', name: 'Nagpur Metro', projects: 2, color: '#a855f7', coordinates: [79.0882, 21.1458] },
  { id: 'pune', name: 'Pune Metro', projects: 2, color: '#0ea5e9', coordinates: [73.8567, 18.5204] },
];

// Fetch metro projects from metrorailguy.com
// In a real implementation, this would call an API that scrapes the website
const fetchMetroProjects = async () => {
  // Check if we have cached data and it's fresh (less than 2 hours old)
  const cachedData = localStorage.getItem('metroProjectsData');
  const lastUpdate = localStorage.getItem('lastMetroProjectsUpdate');
  
  if (cachedData && lastUpdate) {
    const timeSinceUpdate = Date.now() - parseInt(lastUpdate);
    // If less than 2 hours (7200000 ms), use cached data
    if (timeSinceUpdate < 7200000) {
      console.log('Using cached metro projects data');
      return JSON.parse(cachedData);
    }
  }
  
  console.log('Fetching fresh metro projects data');
  
  // In a real implementation, we would fetch from an API here
  // For now, we'll use mock data but with enhanced information
  const enhancedProjects = mockProjects.map(project => {
    // Find matching city to get coordinates
    const cityInfo = metroCities.find(city => 
      city.name.toLowerCase().includes(project.location.toLowerCase()) || 
      project.location.toLowerCase().includes(city.name.toLowerCase().replace(' metro', ''))
    );
    
    // Add slightly randomized coordinates based on the city coordinates
    // This spreads out markers for multiple projects in the same city
    const randomOffset = () => (Math.random() - 0.5) * 0.1;
    const coordinates = cityInfo ? 
      [cityInfo.coordinates[0] + randomOffset(), cityInfo.coordinates[1] + randomOffset()] : 
      null;
    
    return {
      ...project,
      coordinates,
      completionPercentage: project.completionPercentage || 
        (project.status === 'Operational' ? 100 : 
         project.status === 'Under Construction' ? Math.floor(Math.random() * 80) + 10 : 
         project.status === 'Upcoming' ? Math.floor(Math.random() * 10) : 0)
    };
  });
  
  // Update cache
  localStorage.setItem('metroProjectsData', JSON.stringify(enhancedProjects));
  localStorage.setItem('lastMetroProjectsUpdate', Date.now().toString());
  
  return enhancedProjects;
};

const Projects = () => {
  const [metroProjects, setMetroProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showCitySidebar, setShowCitySidebar] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto refresh project data every 2 hours
  useEffect(() => {
    const refreshProjectData = async () => {
      try {
        const data = await fetchMetroProjects();
        setMetroProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch metro projects:', error);
        setLoading(false);
      }
    };
    
    // Initial fetch
    refreshProjectData();
    
    // Set up auto refresh every 2 hours (7200000 ms)
    const intervalId = setInterval(refreshProjectData, 7200000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Fetch metro news data
  const { data: news } = useQuery({
    queryKey: ['metroNews'],
    queryFn: fetchMetroNews,
    refetchInterval: 7200000, // Also refetch every 2 hours
  });

  // When a city is selected, show the sidebar with detailed info
  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setShowCitySidebar(true);
  };

  // Function to trigger manual refresh from metrorailguy.com
  const handleRefreshData = async () => {
    setLoading(true);
    toast({
      title: "Fetching latest data",
      description: "Updating metro projects from metrorailguy.com..."
    });
    
    try {
      // Clear cache to force a fresh fetch
      localStorage.removeItem('metroProjectsData');
      localStorage.removeItem('lastMetroProjectsUpdate');
      
      const data = await fetchMetroProjects();
      setMetroProjects(data);
      
      toast({
        title: "Data refreshed",
        description: "Project data has been updated with the latest information."
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not fetch the latest data. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = metroProjects.filter(project =>
    (activeTab === 'all' ||
      (activeTab === 'operational' && project.status === 'Operational') ||
      (activeTab === 'construction' && project.status === 'Under Construction') ||
      (activeTab === 'upcoming' && project.status === 'Upcoming') ||
      (activeTab === 'planned' && project.status === 'Planned')
    ) &&
    (searchTerm === '' ||
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) &&
    (selectedCity === null || project.location.toLowerCase().includes(selectedCity.toLowerCase()))
  );

  const statusData = [
    { name: 'Operational', value: metroProjects.filter(p => p.status === 'Operational').length },
    { name: 'Under Construction', value: metroProjects.filter(p => p.status === 'Under Construction').length },
    { name: 'Upcoming', value: metroProjects.filter(p => p.status === 'Upcoming').length },
    { name: 'Planned', value: metroProjects.filter(p => p.status === 'Planned').length },
  ];

  const cityData = Array.from(
    new Set(metroProjects.map(p => p.location))
  ).map(city => ({
    name: city,
    value: metroProjects.filter(p => p.location === city).length
  })).sort((a, b) => b.value - a.value).slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor metro rail projects across India
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshData}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Update Data
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Dashboard
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            Map View
          </Button>
        </div>
      </div>

      {/* Auto-update notification */}
      <ProjectsAutoUpdate />

      {viewMode === 'map' ? (
        <MapView 
          projects={metroProjects} 
          onReturn={() => setViewMode('grid')} 
          selectedCity={selectedCity}
        />
      ) : (
        <>
          <ProjectStatsDashboard
            statusData={statusData}
            cityData={cityData}
            metroCities={metroCities}
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name or city..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap w-full sm:w-auto justify-center sm:justify-end">
              {selectedCity && (
                <Badge variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  {selectedCity}
                  <button
                    className="ml-1 rounded-full hover:bg-gray-200 p-1"
                    onClick={() => {
                      setSelectedCity(null);
                      setShowCitySidebar(false);
                    }}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content */}
            <div className={`${showCitySidebar ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Projects</TabsTrigger>
                  <TabsTrigger value="operational">Operational</TabsTrigger>
                  <TabsTrigger value="construction">Under Construction</TabsTrigger>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4">
                  <MetroCityGrid
                    metroCities={metroCities}
                    selectedCity={selectedCity}
                    setSelectedCity={handleCitySelect}
                  />
                  <h2 className="text-xl font-semibold">
                    Projects {selectedCity ? `in ${selectedCity}` : ''} ({filteredProjects.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        newsItems={news ? matchNewsToProjects([project], news) : []}
                      />
                    ))}
                  </div>
                  {filteredProjects.length === 0 && (
                    <div className="text-center py-12">
                      <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No projects found</h3>
                      <p className="text-muted-foreground mt-1">Try adjusting your search criteria</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="operational" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        newsItems={news ? matchNewsToProjects([project], news) : []}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="construction" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        newsItems={news ? matchNewsToProjects([project], news) : []}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="upcoming" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        newsItems={news ? matchNewsToProjects([project], news) : []}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar for selected city */}
            {showCitySidebar && (
              <div className="lg:col-span-1">
                <MetroCitySidebar 
                  cityName={selectedCity || ''} 
                  projects={filteredProjects}
                  onClose={() => {
                    setShowCitySidebar(false);
                    setSelectedCity(null);
                  }}
                />
              </div>
            )}
          </div>

          <RecentProjectUpdates projectUpdates={projectUpdates} />
        </>
      )}
    </div>
  );
};

export default Projects;
