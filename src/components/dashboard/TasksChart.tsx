
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { generateTasksChartData } from '@/lib/mockData';

export const TasksChart = () => {
  const data = generateTasksChartData();

  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle>Tasks Overview</CardTitle>
        <CardDescription>Weekly task completion analytics</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="date" 
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
              dataKey="completed" 
              name="Completed" 
              fill="#2A9D8F" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="assigned" 
              name="Assigned" 
              fill="#1A365D" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="delayed" 
              name="Delayed" 
              fill="#E76F51" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
