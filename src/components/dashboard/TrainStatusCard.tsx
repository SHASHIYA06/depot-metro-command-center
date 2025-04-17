
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Train } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TrainStatusCardProps {
  train: Train;
}

export const TrainStatusCard: React.FC<TrainStatusCardProps> = ({ train }) => {
  // Calculate the number of days until the next maintenance
  const daysUntilMaintenance = () => {
    const nextDate = new Date(train.nextMaintenance);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate the percentage of operational cars
  const operationalCarsPercentage = () => {
    const operationalCars = train.cars.filter(car => car.status === 'operational').length;
    return (operationalCars / train.cars.length) * 100;
  };

  // Get status badge color
  const getStatusColor = (status: Train['status']) => {
    switch (status) {
      case 'active':
        return 'bg-metro-success/20 text-metro-success hover:bg-metro-success/30';
      case 'maintenance':
        return 'bg-metro-warning/20 text-metro-warning hover:bg-metro-warning/30';
      case 'out_of_service':
      case 'inactive':
        return 'bg-metro-danger/20 text-metro-danger hover:bg-metro-danger/30';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{train.name}</CardTitle>
          <Badge className={cn(getStatusColor(train.status))}>
            {train.status === 'active' ? 'Active' : 
             train.status === 'maintenance' ? 'In Maintenance' : 
             train.status === 'out_of_service' ? 'Out of Service' : 'Inactive'}
          </Badge>
        </div>
        <CardDescription>
          Total: {(train.totalKilometers || train.totalDistance).toLocaleString()} km
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Operational Status</span>
            <span className="font-medium">{Math.round(operationalCarsPercentage())}%</span>
          </div>
          <Progress value={operationalCarsPercentage()} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Last Maintenance</p>
            <p className="font-medium">{format(new Date(train.lastMaintenance), 'MMM dd, yyyy')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Next Maintenance</p>
            <p className="font-medium">{format(new Date(train.nextMaintenance), 'MMM dd, yyyy')}</p>
          </div>
        </div>
        
        <div className="text-sm">
          <p className="text-muted-foreground">Cars Status</p>
          <div className="flex mt-1 space-x-1">
            {train.cars.map((car) => (
              <div 
                key={car.id} 
                className={cn(
                  "flex-1 h-4 rounded",
                  car.status === 'operational' ? 'bg-metro-success/60' : 
                  car.status === 'maintenance' ? 'bg-metro-warning/60' : 
                  'bg-metro-danger/60'
                )}
                title={`Car ${car.position} - ${car.status}`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-sm">
          <p className="text-muted-foreground">Time Until Next Maintenance</p>
          <p className="font-medium">
            {daysUntilMaintenance()} days
            {daysUntilMaintenance() <= 3 && (
              <span className="text-metro-warning ml-1">(Soon)</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
