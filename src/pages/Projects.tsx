
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Search, Building, MapPin, Calendar, ExternalLink, BarChart as BarChartIcon, Map } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { projects, projectUpdates } from '@/lib/mockData';

// Eventually this would be fetched from an API that scrapes metrorailguy.com
const fetchMetroProjects = async () => {
  // In a real implementation, this would fetch data from metrorailguy.com via an API
  return projects;
};

// Mock categories for demonstration
const projectCategories = [
  { id: 'ongoing', name: 'Operational', count: 16, color: '#22c55e' },
  { id: 'construction', name: 'Under Construction', count: 25, color: '#f59e0b' },
  { id: 'upcoming', name: 'Upcoming', count: 12, color: '#3b82f6' },
  { id: 'planned', name: 'Planned', count: 8, color: '#8b5cf6' },
];

// Cities with metro projects
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

const statusColorMap: Record<string, string> = {
  'Operational': 'bg-green-500',
  'Under Construction': 'bg-yellow-500',
  'Upcoming': 'bg-blue-500',
  'Planned': 'bg-purple-500',
};

const ProjectCard = ({ project }: { project: any }) => {
  const statusClass = statusColorMap[project.status] || 'bg-gray-500';
  
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
  
  // Generate data for the dashboard charts
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
  
  // Render map view placeholder
  const renderMapView = () => (
    <div className="border rounded-lg p-4 h-96 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">Map View Coming Soon</h3>
        <p className="text-muted-foreground mt-1">
          Interactive map of metro projects will be available soon.
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setViewMode('grid')}
        >
          Return to Grid View
        </Button>
      </div>
    </div>
  );
  
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
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            onClick={() => setViewMode('grid')}
          >
            <BarChartIcon className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button 
            variant={viewMode === 'map' ? 'default' : 'outline'} 
            onClick={() => setViewMode('map')}
          >
            <Map className="h-4 w-4 mr-2" />
            Map View
          </Button>
        </div>
      </div>
      
      {viewMode === 'map' ? (
        renderMapView()
      ) : (
        <>
          {/* Dashboard overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Projects by Status</CardTitle>
                <CardDescription>Overview of metro projects across different stages</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" name="Number of Projects" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Projects by City</CardTitle>
                <CardDescription>Distribution across major cities</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {cityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={metroCities[index % metroCities.length].color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
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
              <div>
                <h2 className="text-xl font-semibold mb-2">Metro Systems by City</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {metroCities.map(city => (
                    <button
                      key={city.id}
                      className={`p-2 rounded-lg text-sm text-center border transition-colors
                        ${selectedCity === city.name ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => setSelectedCity(selectedCity === city.name ? null : city.name)}
                    >
                      <span className="text-xs block mb-1 text-muted-foreground">{city.projects} projects</span>
                      <span className="font-medium">{city.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
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
          
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold">Recent Project Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectUpdates.map(update => (
                <Card key={update.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{update.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(update.date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{update.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">Source: {update.source}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Projects;
