
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { dashboardStats } from '@/lib/mockData';

export const PriorityChart = () => {
  const data = [
    { name: 'Low', value: dashboardStats.issuesByPriority.low, color: '#3B82F6' },
    { name: 'Medium', value: dashboardStats.issuesByPriority.medium, color: '#FBBF24' },
    { name: 'High', value: dashboardStats.issuesByPriority.high, color: '#F97316' },
    { name: 'Critical', value: dashboardStats.issuesByPriority.critical, color: '#EF4444' },
  ];

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
  
    if (percent < 0.05) return null;
    
    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Issues by Priority</CardTitle>
        <CardDescription>Distribution of issues by priority level</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
