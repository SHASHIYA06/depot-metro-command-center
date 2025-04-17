
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetroNews } from '@/lib/metroNewsService';
import { Newspaper, CalendarDays, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MetroNewsWidgetProps {
  news: MetroNews[];
  isLoading: boolean;
}

export const MetroNewsWidget: React.FC<MetroNewsWidgetProps> = ({ news, isLoading }) => {
  const navigate = useNavigate();
  
  // Group news by category
  const generalNews = news.slice(0, 3);
  const constructionNews = news.filter(item => 
    item.title.toLowerCase().includes('construction') || 
    item.excerpt.toLowerCase().includes('construction')
  ).slice(0, 3);
  const plannedProjects = news.filter(item =>
    item.title.toLowerCase().includes('planned') ||
    item.title.toLowerCase().includes('phase') ||
    item.excerpt.toLowerCase().includes('planned') ||
    item.excerpt.toLowerCase().includes('phase')
  ).slice(0, 3);

  const renderNewsItem = (item: MetroNews) => (
    <Card key={item.id} className="overflow-hidden mb-3 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            {item.source}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3 mr-1" />
            <span>
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
        <h4 className="font-medium mb-2 line-clamp-2">{item.title}</h4>
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs"
            onClick={() => window.open(item.url, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Read More
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Metro Rail Updates</CardTitle>
          <CardDescription>Latest news from metro projects across India</CardDescription>
        </div>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          <Newspaper className="h-4 w-4 mr-2" />
          View All Projects
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="latest">
            <TabsList className="mb-4">
              <TabsTrigger value="latest">Latest Updates</TabsTrigger>
              <TabsTrigger value="construction">Construction</TabsTrigger>
              <TabsTrigger value="planned">Planned Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="latest" className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {generalNews.length > 0 ? (
                  generalNews.map(renderNewsItem)
                ) : (
                  <div className="col-span-full text-center p-8">
                    <p>No recent metro news available</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="construction" className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {constructionNews.length > 0 ? (
                  constructionNews.map(renderNewsItem)
                ) : (
                  <div className="col-span-full text-center p-8">
                    <p>No construction updates available</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="planned" className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plannedProjects.length > 0 ? (
                  plannedProjects.map(renderNewsItem)
                ) : (
                  <div className="col-span-full text-center p-8">
                    <p>No planned project updates available</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          Data sourced from TheMetroRailGuy.com and updated automatically
        </div>
      </CardContent>
    </Card>
  );
};
