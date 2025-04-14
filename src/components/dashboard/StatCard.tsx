
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  change,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
            
            {change && (
              <div className="flex items-center mt-2">
                <span 
                  className={cn(
                    "text-sm font-medium",
                    change.type === 'increase' ? 'text-metro-success' : 'text-metro-danger'
                  )}
                >
                  {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last week</span>
              </div>
            )}
          </div>
          
          <div className="rounded-full p-2 bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
