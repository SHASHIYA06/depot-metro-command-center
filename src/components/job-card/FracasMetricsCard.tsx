
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { JobCard } from '@/types/job-card';

interface FracasMetricsCardProps {
  jobCards: JobCard[];
}

// Calculate MTTR (Mean Time to Repair)
const calculateMTTR = (jobCards: JobCard[]): number => {
  const completedCards = jobCards.filter(card => 
    (card.status === 'completed' || card.status === 'closed') && 
    card.durationOfRepair !== undefined
  );
  
  if (completedCards.length === 0) return 0;
  
  const totalRepairTime = completedCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0);
  return totalRepairTime / completedCards.length;
};

// Calculate MDBF (Mean Distance Between Failures)
const calculateMDBF = (totalMileage: number, serviceFailures: number): number => {
  return serviceFailures > 0 ? totalMileage / serviceFailures : 0;
};

// Count service failures
const countServiceFailures = (jobCards: JobCard[]): number => {
  return jobCards.filter(card => 
    card.withdraw || 
    (card.delay && card.delayDuration && 
      ['3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'].includes(card.delayDuration))
  ).length;
};

// Generate MTTR data by system
const getMTTRBySystem = (jobCards: JobCard[]) => {
  const systems = [...new Set(jobCards.map(card => card.system))];
  
  return systems.map(system => {
    const systemCards = jobCards.filter(card => card.system === system);
    const mttr = calculateMTTR(systemCards);
    
    return {
      system,
      mttr: mttr.toFixed(1)
    };
  }).sort((a, b) => parseFloat(b.mttr) - parseFloat(a.mttr));
};

// Generate failure data by system
const getFailuresBySystem = (jobCards: JobCard[]) => {
  const systems = [...new Set(jobCards.map(card => card.system))];
  
  return systems.map(system => {
    const systemCards = jobCards.filter(card => card.system === system);
    const count = systemCards.length;
    const serviceFailures = countServiceFailures(systemCards);
    
    return {
      system,
      total: count,
      serviceFailures
    };
  }).sort((a, b) => b.total - a.total);
};

// Generate monthly statistics
const getMonthlyStats = (jobCards: JobCard[], monthsToShow = 6) => {
  const now = new Date();
  const months = [];
  
  // Generate the past 6 months
  for (let i = monthsToShow - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = monthDate.toLocaleString('default', { month: 'short' });
    const year = monthDate.getFullYear();
    months.push({ month, year, monthDate });
  }
  
  const result = months.map(({ month, year, monthDate }) => {
    const nextMonth = new Date(monthDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const monthCards = jobCards.filter(card => {
      const cardDate = new Date(card.createdAt);
      return cardDate >= monthDate && cardDate < nextMonth;
    });
    
    // Assuming average mileage of 5000 km per month for the fleet
    const totalMileage = 5000 * 25; // 25 trains
    const serviceFailures = countServiceFailures(monthCards);
    const mdbf = calculateMDBF(totalMileage, serviceFailures);
    const mttr = calculateMTTR(monthCards);
    
    // Calculate availability (assuming 720 hours in a month)
    const totalHours = 720 * 25; // 25 trains, 720 hours per month
    const totalDowntime = monthCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0);
    const availability = ((totalHours - totalDowntime) / totalHours) * 100;
    
    return {
      month: `${month} ${year}`,
      total: monthCards.length,
      cm: monthCards.filter(card => card.maintenanceType === 'CM').length,
      pm: monthCards.filter(card => card.maintenanceType === 'PM').length,
      opm: monthCards.filter(card => card.maintenanceType === 'OPM').length,
      serviceFailures,
      mttr,
      mdbf,
      availability: availability.toFixed(2)
    };
  });
  
  return result;
};

export const FracasMetricsCard: React.FC<FracasMetricsCardProps> = ({ jobCards }) => {
  const [period, setPeriod] = React.useState("6m");
  
  const mttrBySystem = getMTTRBySystem(jobCards);
  const failuresBySystem = getFailuresBySystem(jobCards);
  const monthlyStats = getMonthlyStats(jobCards);
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>FRACAS Performance Metrics</CardTitle>
          <CardDescription>Mean Time To Repair (MTTR), MDBF and Availability</CardDescription>
        </div>
        <Select defaultValue={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mttr">MTTR</TabsTrigger>
            <TabsTrigger value="mdbf">MDBF</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Monthly Metrics</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="mttr" name="MTTR (hours)" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="serviceFailures" name="Service Failures" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">System-wise Failures</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={failuresBySystem}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="system" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total" name="Total Failures" fill="#8884d8" />
                        <Bar dataKey="serviceFailures" name="Service Failures" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">MTTR</CardTitle>
                  <CardDescription>Mean Time To Repair</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {calculateMTTR(jobCards).toFixed(1)} <span className="text-base font-normal">hrs</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Average time to repair calculated from {
                      jobCards.filter(card => 
                        (card.status === 'completed' || card.status === 'closed') && 
                        card.durationOfRepair !== undefined
                      ).length
                    } completed jobs
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">MDBF</CardTitle>
                  <CardDescription>Mean Distance Between Failures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {calculateMDBF(5000 * 25, countServiceFailures(jobCards)).toFixed(0)} <span className="text-base font-normal">km</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {countServiceFailures(jobCards)} service failures and estimated total mileage
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Availability</CardTitle>
                  <CardDescription>Fleet Availability Percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100).toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on total operational hours vs. maintenance downtime
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="mttr">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">MTTR by System</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={mttrBySystem}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="system" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="mttr" name="MTTR (hours)" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">MTTR Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="mttr" name="MTTR (hours)" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">MTTR Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Pantograph</div>
                    <div className="flex items-center justify-between">
                      <span>Target: 1.0 hr</span>
                      <Badge variant={calculateMTTR(jobCards.filter(card => card.component === 'Pantograph Assembly')) <= 1.0 ? "success" : "destructive"}>
                        {calculateMTTR(jobCards.filter(card => card.component === 'Pantograph Assembly')).toFixed(1)} hrs
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Door System</div>
                    <div className="flex items-center justify-between">
                      <span>Target: 2.0 hrs</span>
                      <Badge variant={calculateMTTR(jobCards.filter(card => card.system === 'Door System')) <= 2.0 ? "success" : "destructive"}>
                        {calculateMTTR(jobCards.filter(card => card.system === 'Door System')).toFixed(1)} hrs
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">HVAC</div>
                    <div className="flex items-center justify-between">
                      <span>Target: 4.0 hrs</span>
                      <Badge variant={calculateMTTR(jobCards.filter(card => card.system === 'HVAC')) <= 4.0 ? "success" : "destructive"}>
                        {calculateMTTR(jobCards.filter(card => card.system === 'HVAC')).toFixed(1)} hrs
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Traction Motor</div>
                    <div className="flex items-center justify-between">
                      <span>Target: 6.0 hrs</span>
                      <Badge variant={calculateMTTR(jobCards.filter(card => card.component === 'Traction Motor')) <= 6.0 ? "success" : "destructive"}>
                        {calculateMTTR(jobCards.filter(card => card.component === 'Traction Motor')).toFixed(1)} hrs
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mdbf">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">MDBF Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="mdbf" name="MDBF (km)" stroke="#82ca9d" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Service Failures</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="serviceFailures" name="Service Failures" fill="#ffc658" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">MDBF Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Fleet MDBF</div>
                    <div className="text-2xl font-bold">
                      {calculateMDBF(5000 * 25, countServiceFailures(jobCards)).toFixed(0)} km
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Based on entire fleet running mileage and all service failures
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Service Failure Types</div>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Withdrawals: {jobCards.filter(card => card.withdraw).length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span>Delays (≥3 min): {
                        jobCards.filter(card => 
                          card.delay && 
                          card.delayDuration && 
                          ['3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'].includes(card.delayDuration)
                        ).length
                      }</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Total Service Failures: {countServiceFailures(jobCards)}</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">MDBF Target</div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Target: 10,000 km</span>
                      <Badge variant={calculateMDBF(5000 * 25, countServiceFailures(jobCards)) >= 10000 ? "success" : "destructive"}>
                        {calculateMDBF(5000 * 25, countServiceFailures(jobCards)) >= 10000 ? 'Meeting Target' : 'Below Target'}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${calculateMDBF(5000 * 25, countServiceFailures(jobCards)) >= 10000 ? 'bg-green-500' : 'bg-amber-500'}`} 
                        style={{ 
                          width: `${Math.min(calculateMDBF(5000 * 25, countServiceFailures(jobCards)) / 100, 100)}%` 
                        }} 
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="availability">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Fleet Availability Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[95, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="availability" name="Availability (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Maintenance Type Distribution</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyStats}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cm" name="Corrective (CM)" stackId="stack" fill="#ff8042" />
                        <Bar dataKey="pm" name="Preventive (PM)" stackId="stack" fill="#82ca9d" />
                        <Bar dataKey="opm" name="Other Preventive (OPM)" stackId="stack" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Availability Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Current Availability</div>
                    <div className="text-2xl font-bold">
                      {((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100).toFixed(2)}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Based on operational hours vs. maintenance downtime
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Downtime by Type</div>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>CM: {
                        jobCards.filter(card => card.maintenanceType === 'CM')
                          .reduce((sum, card) => sum + (card.durationOfRepair || 0), 0).toFixed(1)
                      } hrs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>PM: {
                        jobCards.filter(card => card.maintenanceType === 'PM')
                          .reduce((sum, card) => sum + (card.durationOfRepair || 0), 0).toFixed(1)
                      } hrs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>OPM: {
                        jobCards.filter(card => card.maintenanceType === 'OPM')
                          .reduce((sum, card) => sum + (card.durationOfRepair || 0), 0).toFixed(1)
                      } hrs</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="text-sm font-medium mb-2">Availability Target</div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Target: 98.5%</span>
                      <Badge variant={((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100) >= 98.5 ? "success" : "destructive"}>
                        {((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100) >= 98.5 ? 'Meeting Target' : 'Below Target'}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100) >= 98.5 ? 'bg-green-500' : 'bg-amber-500'}`} 
                        style={{ 
                          width: `${Math.min((((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100) - 95) * 20, 100)}%` 
                        }} 
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
