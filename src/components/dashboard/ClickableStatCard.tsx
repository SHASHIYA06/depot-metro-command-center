
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface ClickableStatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  link?: string;
  linkParams?: Record<string, string>;
  onClick?: () => void;
  className?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  clickable?: boolean;
  filterType?: string;
  filterValue?: string;
}

export const ClickableStatCard: React.FC<ClickableStatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  link,
  linkParams,
  onClick,
  className,
  change,
  clickable = true,
  filterType,
  filterValue
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      let queryParams = new URLSearchParams();
      
      // Add linkParams if provided
      if (linkParams) {
        Object.entries(linkParams).forEach(([key, value]) => {
          queryParams.set(key, value);
        });
      }
      
      // Add filter parameters if provided
      if (filterType && filterValue) {
        queryParams.set('filter', filterType);
        queryParams.set('value', filterValue);
      }
      
      const url = queryParams.toString() ? `${link}?${queryParams}` : link;
      navigate(url);
    }
  };

  return (
    <Card 
      className={`${className || ''} ${clickable ? 'cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 hover:border-primary/50' : ''} ${
        clickable ? 'group' : ''
      }`}
      onClick={clickable ? handleClick : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${clickable ? 'group-hover:text-primary' : ''}`}>
          {title}
        </CardTitle>
        {icon && (
          <div className={`${clickable ? 'group-hover:scale-110 transition-transform' : ''}`}>
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${clickable ? 'group-hover:text-primary' : ''}`}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {change && (
          <p className={`text-xs mt-1 ${
            change.type === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change.type === 'increase' ? '↗' : '↘'} {change.value}% from last period
          </p>
        )}
      </CardContent>
      {trend !== undefined && (
        <CardFooter className={`pt-0 ${trend >= 0 ? "text-emerald-500 text-sm" : "text-rose-500 text-sm"}`}>
          {trend >= 0 ? `↗ ${trend}%` : `↘ ${Math.abs(trend)}%`} from last month
        </CardFooter>
      )}
      {clickable && (
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
      )}
    </Card>
  );
};
