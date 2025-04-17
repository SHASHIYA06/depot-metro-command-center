
import { Project } from '@/types';

export interface MetroNews {
  id: string;
  title: string;
  url: string;
  date: string;
  source: string;
  excerpt: string;
  projectIds?: string[];
  imageUrl?: string;
}

// Mock function to fetch news from an API (would be replaced with real API call)
export const fetchMetroNews = async (): Promise<MetroNews[]> => {
  // This simulates data that would be fetched from themetrorailguy.com
  // In a real implementation, this would be an API call or webhook receiver
  console.log('Fetching metro news...');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return [
    {
      id: 'news-1',
      title: 'Delhi Metro Phase 4: 6-km elevated section of Pink Line extension to open next month',
      url: 'https://themetrorailguy.com/delhi-metro-phase-4-pink-line-extension-to-open-next-month/',
      date: '2023-03-19',
      source: 'The Metro Rail Guy',
      excerpt: 'Delhi Metro Rail Corporation (DMRC) will open a 6-km elevated section of Pink Line extension from Majlis Park to Maujpur next month as part of the Phase 4 expansion project.',
      projectIds: ['delhi-metro'],
      imageUrl: 'https://themetrorailguy.com/wp-content/uploads/2023/03/Delhi-Metro-Pink-Line-Extension-1200x675.jpg'
    },
    {
      id: 'news-2',
      title: 'Mumbai Metro Line 3 underground to open partially by end of 2023',
      url: 'https://themetrorailguy.com/mumbai-metro-line-3-to-open-partially-by-end-of-2023/',
      date: '2023-03-15',
      source: 'The Metro Rail Guy',
      excerpt: 'Mumbai Metro Rail Corporation (MMRC) plans to open a section of the 33.5-km Line 3 (Aqua Line) underground metro by the end of 2023, connecting Bandra Kurla Complex to Aarey Colony.',
      projectIds: ['mumbai-metro'],
      imageUrl: 'https://themetrorailguy.com/wp-content/uploads/2023/03/Mumbai-Metro-Line-3-MMRC-1200x675.jpg'
    },
    {
      id: 'news-3',
      title: 'Chennai Metro Phase 2: CMRL begins tunnel boring for Corridor 4',
      url: 'https://themetrorailguy.com/chennai-metro-phase-2-tunnel-boring-corridor-4/',
      date: '2023-03-12',
      source: 'The Metro Rail Guy',
      excerpt: 'Chennai Metro Rail Limited (CMRL) has commenced tunnel boring work for the 26.1-km Corridor 4 of Chennai Metro Phase 2, which will connect Lighthouse to Poonamallee.',
      projectIds: ['chennai-metro'],
      imageUrl: 'https://themetrorailguy.com/wp-content/uploads/2023/03/Chennai-Metro-Phase-2-CMRL-1200x675.jpg'
    },
    {
      id: 'news-4',
      title: 'Kanpur Metro contracts L&T for Phase 1 Corridor 2 construction',
      url: 'https://themetrorailguy.com/kanpur-metro-phase-1-corridor-2-construction/',
      date: '2023-03-08',
      source: 'The Metro Rail Guy',
      excerpt: 'Kanpur Metro has awarded a contract to Larsen & Toubro (L&T) for the construction of Phase 1 Corridor 2, a 8.6-km elevated line from Chandra Shekhar Azad University to Barra-8.',
      projectIds: ['kanpur-metro'],
      imageUrl: 'https://themetrorailguy.com/wp-content/uploads/2023/03/Kanpur-Metro-Phase-1-1200x675.jpg'
    },
    {
      id: 'news-5',
      title: 'Bangalore Metro to introduce WhatsApp e-ticketing service',
      url: 'https://themetrorailguy.com/bangalore-metro-whatsapp-e-ticketing-service/',
      date: '2023-03-05',
      source: 'The Metro Rail Guy',
      excerpt: 'Bangalore Metro Rail Corporation Limited (BMRCL) will launch a WhatsApp-based e-ticketing service for Namma Metro passengers, allowing them to purchase QR code tickets through the messaging platform.',
      projectIds: ['bangalore-metro'],
      imageUrl: 'https://themetrorailguy.com/wp-content/uploads/2023/03/Bangalore-Metro-E-Ticketing-1200x675.jpg'
    }
  ];
};

// Function to associate news with specific metro projects
export const matchNewsToProjects = (news: MetroNews[], projects: Project[]): MetroNews[] => {
  return news.map(newsItem => {
    if (newsItem.projectIds) return newsItem;
    
    // If no project IDs are assigned, try to match based on project name in title
    const matchedProjectIds = projects
      .filter(project => 
        newsItem.title.toLowerCase().includes(project.name.toLowerCase()) || 
        newsItem.excerpt.toLowerCase().includes(project.name.toLowerCase())
      )
      .map(project => project.id);
      
    return {
      ...newsItem,
      projectIds: matchedProjectIds.length > 0 ? matchedProjectIds : undefined
    };
  });
};

// Function to get news for a specific project
export const getNewsForProject = (news: MetroNews[], projectId: string): MetroNews[] => {
  return news.filter(newsItem => 
    newsItem.projectIds?.includes(projectId) || 
    !newsItem.projectIds // Include news that hasn't been categorized
  );
};
