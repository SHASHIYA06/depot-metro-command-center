
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { dashboardStats } from '@/lib/mockData';

export const PriorityChart = () => {
  const data = [
    { name: 'Low', value: dashboardStats.issuesByPriority.low, color: '#74C0FC' },
    { name: 'Medium', value: dashboardStats.issuesByPriority.medium, color: '#FFE066' },
    { name: 'High', value: dashboardStats.issuesByPriority.high, color: '#FA8072' },
    { name: 'Critical', value: dashboardStats.issuesByPriority.critical, color: '#E03131' },
  ];

  // Filter out zero values
  const filteredData = data.filter(item => item.value > 0);
  
  // Custom legend for Pie Chart
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs pt-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex items-center">
            <div 
              className="h-3 w-3 mr-1 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}: {entry.payload.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  // Custom tooltip
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Priority</CardTitle>
        <CardDescription>Distribution of tasks by priority</CardDescription>
      </CardHeader>
      <CardContent className="h-[200px]">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderTooltip} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No task data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
