import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Building, TrendingUp, CalendarDays, Info, ExternalLink, MapPin, Newspaper, RefreshCw } from 'lucide-react';
import { getProjects, getProjectUpdates } from '@/lib/mockData';
import { fetchMetroNews, matchNewsToProjects, MetroNews } from '@/lib/metroNewsService';
import { Project } from '@/types';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const { data: projectUpdates, isLoading: updatesLoading } = useQuery({
    queryKey: ['projectUpdates', selectedProject?.id],
    queryFn: () => selectedProject?.id ? getProjectUpdates() : [],
    enabled: !!selectedProject,
  });

  const { data: metroNews, isLoading: newsLoading, refetch: refetchNews } = useQuery({
    queryKey: ['metroNews'],
    queryFn: fetchMetroNews,
  });

  const processedNews = React.useMemo(() => {
    if (!metroNews || !projects) return [];
    return matchNewsToProjects(metroNews, projects);
  }, [metroNews, projects]);

  const projectNews = React.useMemo(() => {
    if (!processedNews || !selectedProject) return [];
    return processedNews.filter(news => 
      news.projectIds?.includes(selectedProject.id) ||
      news.title.toLowerCase().includes(selectedProject.name.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(selectedProject.name.toLowerCase())
    );
  }, [processedNews, selectedProject]);

  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Metro Project Review</h1>
        <p className="text-muted-foreground">
          Review ongoing and completed metro projects across India
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 overflow-auto max-h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle className="text-xl">Projects</CardTitle>
            <CardDescription>Metro projects across India</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {projectsLoading ? (
                <div className="p-4">Loading projects...</div>
              ) : (
                projects?.map((project) => (
                  <Button
                    key={project.id}
                    variant="ghost"
                    className={`w-full justify-start rounded-none p-3 text-left ${
                      selectedProject?.id === project.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{project.name}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        <span>{project.location}</span>
                      </div>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {!selectedProject || projectsLoading ? (
            <CardContent className="flex h-[500px] items-center justify-center">
              <p>Select a project to view details</p>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedProject.name}</CardTitle>
                    <CardDescription className="text-sm flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {selectedProject.location}
                      {selectedProject.status && (
                        <Badge 
                          className="ml-2" 
                          variant={
                            selectedProject.status === 'Operational' 
                              ? 'secondary'
                              : selectedProject.status === 'Under Construction' 
                                ? 'default' 
                                : 'outline'
                          }
                        >
                          {selectedProject.status}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  {selectedProject.website && (
                    <Button variant="outline" size="sm" onClick={() => window.open(selectedProject.website, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="updates">Updates</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                    <TabsTrigger value="news">Latest News</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg mb-2">About</h3>
                      <p className="text-muted-foreground">{selectedProject.description}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-primary" />
                          <h4 className="font-medium">Implementing Agency</h4>
                        </div>
                        <p className="text-muted-foreground pl-6">{selectedProject.implementingAgency}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                          <h4 className="font-medium">Timeline</h4>
                        </div>
                        <div className="text-muted-foreground pl-6">
                          <div>Started: {selectedProject.startDate}</div>
                          {selectedProject.completionDate && (
                            <div>Completed: {selectedProject.completionDate}</div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                          <h4 className="font-medium">Project Cost</h4>
                        </div>
                        <p className="text-muted-foreground pl-6">₹{selectedProject.cost} crores</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2 text-primary" />
                          <h4 className="font-medium">Network Length</h4>
                        </div>
                        <p className="text-muted-foreground pl-6">{selectedProject.networkLength} km</p>
                      </div>
                    </div>
                    
                    {selectedProject.keyFeatures && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-medium text-lg mb-2">Key Features</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedProject.keyFeatures.map((feature, index) => (
                              <li key={index} className="text-muted-foreground">{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="updates" className="space-y-4">
                    {updatesLoading ? (
                      <div>Loading updates...</div>
                    ) : projectUpdates && projectUpdates.length > 0 ? (
                      <div className="space-y-4">
                        {projectUpdates.map((update) => (
                          <Card key={update.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{update.title}</CardTitle>
                              <CardDescription>
                                {new Date(update.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p>{update.content}</p>
                              {update.source && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  Source: {update.source}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div>No updates available for this project.</div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="stats" className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Stations</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedProject.stations || 'N/A'}</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Ridership</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {selectedProject.dailyRidership ? `${selectedProject.dailyRidership} daily` : 'N/A'}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Lines</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedProject.lines || 'N/A'}</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Train Sets</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedProject.trainSets || 'N/A'}</div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {selectedProject.completionPercentage ? `${selectedProject.completionPercentage}%` : 'N/A'}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Track Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-medium">{selectedProject.trackType || 'N/A'}</div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="news" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">Latest Metro News</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => refetchNews()}
                        disabled={newsLoading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${newsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                    
                    {newsLoading ? (
                      <div className="flex justify-center p-12">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : projectNews.length > 0 ? (
                      <div className="space-y-4">
                        {projectNews.map((news) => (
                          <Card key={news.id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              {news.imageUrl && (
                                <div className="md:w-1/3 h-48 md:h-auto">
                                  <img 
                                    src={news.imageUrl} 
                                    alt={news.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div className={`${news.imageUrl ? 'md:w-2/3' : 'w-full'} p-4`}>
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    {news.source}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(news.date).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <h4 className="text-lg font-medium mb-2">{news.title}</h4>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                  {news.excerpt}
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(news.url, '_blank')}
                                >
                                  <Newspaper className="h-4 w-4 mr-2" />
                                  Read Full Article
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 border rounded-md bg-muted/20">
                        <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <h4 className="text-lg font-medium mb-1">No News Found</h4>
                        <p className="text-sm text-muted-foreground">
                          No recent news articles found for {selectedProject.name}.
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4 p-4 bg-muted/20 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        News data is fetched from <a href="https://themetrorailguy.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">TheMetroRailGuy.com</a> and other metro news sources. Last updated: {new Date().toLocaleString()}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Projects;
