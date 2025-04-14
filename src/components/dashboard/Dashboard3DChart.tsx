
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { getIssuesByStatus } from '@/lib/mockData';

interface Dashboard3DChartProps {
  className?: string;
}

export const Dashboard3DChart: React.FC<Dashboard3DChartProps> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Process data for the chart
  const openIssues = getIssuesByStatus('open');
  const inProgressIssues = getIssuesByStatus('in_progress');
  const resolvedIssues = getIssuesByStatus('resolved');
  
  const data = [
    { name: 'Week 1', open: openIssues.length, inProgress: inProgressIssues.length, resolved: resolvedIssues.length },
    { name: 'Week 2', open: Math.floor(openIssues.length * 0.9), inProgress: Math.floor(inProgressIssues.length * 1.2), resolved: Math.floor(resolvedIssues.length * 0.8) },
    { name: 'Week 3', open: Math.floor(openIssues.length * 0.8), inProgress: Math.floor(inProgressIssues.length * 1.1), resolved: Math.floor(resolvedIssues.length * 1.2) },
    { name: 'Week 4', open: Math.floor(openIssues.length * 0.7), inProgress: Math.floor(inProgressIssues.length * 0.9), resolved: Math.floor(resolvedIssues.length * 1.5) },
  ];

  // Add 3D effect to the chart
  useEffect(() => {
    const addShadow = () => {
      if (chartRef.current) {
        const bars = chartRef.current.querySelectorAll('.recharts-bar-rectangle');
        
        bars.forEach((bar: Element) => {
          // Add shadow and 3D effect
          (bar as HTMLElement).style.filter = 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.3))';
          (bar as HTMLElement).style.transition = 'transform 0.3s ease, filter 0.3s ease';
          
          // Add hover effect
          bar.addEventListener('mouseenter', () => {
            (bar as HTMLElement).style.transform = 'translateY(-5px) scale(1.03)';
            (bar as HTMLElement).style.filter = 'drop-shadow(5px 5px 4px rgba(0, 0, 0, 0.4))';
          });
          
          bar.addEventListener('mouseleave', () => {
            (bar as HTMLElement).style.transform = '';
            (bar as HTMLElement).style.filter = 'drop-shadow(3px 3px 2px rgba(0, 0, 0, 0.3))';
          });
        });
      }
    };
    
    // Add a small delay to ensure the chart is rendered
    const timer = setTimeout(() => {
      addShadow();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className={cn("col-span-full", className)}>
      <CardHeader>
        <CardTitle>Activities Trend</CardTitle>
        <CardDescription>Monthly trend of work activities by status</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]" ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend 
              iconSize={10}
              iconType="circle"
              wrapperStyle={{ paddingTop: '10px' }}
            />
            <Bar 
              dataKey="open" 
              name="Open" 
              fill="#94a3b8" 
              radius={[4, 4, 0, 0]} 
              className="hover:opacity-80 transition-opacity"
            />
            <Bar 
              dataKey="inProgress" 
              name="In Progress" 
              fill="#60a5fa" 
              radius={[4, 4, 0, 0]} 
              className="hover:opacity-80 transition-opacity"
            />
            <Bar 
              dataKey="resolved" 
              name="Resolved" 
              fill="#4ade80" 
              radius={[4, 4, 0, 0]} 
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
