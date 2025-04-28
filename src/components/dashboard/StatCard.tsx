
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  link?: string;
  linkParams?: Record<string, string>;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  link,
  linkParams,
  onClick,
  className,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      if (linkParams) {
        const queryParams = new URLSearchParams(linkParams);
        navigate(`${link}?${queryParams}`);
      } else {
        navigate(link);
      }
    }
  };

  return (
    <Card 
      className={`${className || ''} ${(onClick || link) ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={(onClick || link) ? handleClick : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
      {trend !== undefined && (
        <CardFooter className={trend >= 0 ? "text-emerald-500 text-sm" : "text-rose-500 text-sm"}>
          {trend >= 0 ? `↗ ${trend}%` : `↘ ${Math.abs(trend)}%`} from last month
        </CardFooter>
      )}
    </Card>
  );
};
