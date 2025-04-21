
// This file has been refactored to use smaller components in src/components/projects/

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Building } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { projects, projectUpdates } from '@/lib/mockData';
// Component imports
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectStatsDashboard from '@/components/projects/ProjectStatsDashboard';
import MetroCityGrid from '@/components/projects/MetroCityGrid';
import RecentProjectUpdates from '@/components/projects/RecentProjectUpdates';
import MapViewPlaceholder from '@/components/projects/MapViewPlaceholder';

// This would be fetched from an API that scrapes metrorailguy.com
const fetchMetroProjects = async () => {
  return projects;
};

const metroCities = [
  { id: 'delhi', name: 'Delhi Metro', projects: 14, color: '#ef4444' },
  { id: 'mumbai', name: 'Mumbai Metro', projects: 8, color: '#3b82f6' },
  { id: 'chennai', name: 'Chennai Metro', projects: 5, color: '#22c55e' },
  { id: 'kolkata', name: 'Kolkata Metro', projects: 7, color: '#8b5cf6' },
  { id: 'bangalore', name: 'Bangalore Metro', projects: 6, color: '#f59e0b' },
  { id: 'hyderabad', name: 'Hyderabad Metro', projects: 4, color: '#06b6d4' },
  { id: 'kochi', name: 'Kochi Metro', projects: 2, color: '#ec4899' },
  { id: 'jaipur', name: 'Jaipur Metro', projects: 2, color: '#f43f5e' },
  { id: 'lucknow', name: 'Lucknow Metro', projects: 2, color: '#14b8a6' },
  { id: 'ahmedabad', name: 'Ahmedabad Metro', projects: 2, color: '#f97316' },
  { id: 'nagpur', name: 'Nagpur Metro', projects: 2, color: '#a855f7' },
  { id: 'pune', name: 'Pune Metro', projects: 2, color: '#0ea5e9' },
];

const Projects = () => {
  const [metroProjects, setMetroProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    const getProjects = async () => {
      try {
        const data = await fetchMetroProjects();
        setMetroProjects(data);
      } catch (error) {
        console.error('Failed to fetch metro projects:', error);
      } finally {
        setLoading(false);
      }
    };
    getProjects();
  }, []);

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
          <button
            className={`btn ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('grid')}
          >
            Dashboard
          </button>
          <button
            className={`btn ${viewMode === 'map' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={() => setViewMode('map')}
          >
            Map View
          </button>
        </div>
      </div>
      {viewMode === 'map' ? (
        <MapViewPlaceholder onReturn={() => setViewMode('grid')} />
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
                    onClick={() => setSelectedCity(null)}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
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
                setSelectedCity={setSelectedCity}
              />
              <h2 className="text-xl font-semibold">
                Projects {selectedCity ? `in ${selectedCity}` : ''} ({filteredProjects.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
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
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="construction" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <RecentProjectUpdates projectUpdates={projectUpdates} />
        </>
      )}
    </div>
  );
};

export default Projects;
