
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudBackupSettings } from '@/components/settings/CloudBackupSettings';
import { useToast } from '@/hooks/use-toast';
import { performBackup, setupAutomaticBackups, verifyBackupConfig } from '@/utils/backupUtils';
import { listAvailableBackups } from '@/utils/cloudBackup';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Download, 
  Check, 
  Clock, 
  Calendar, 
  AlertCircle,
  RefreshCw,
  Server,
  FileText,
  CloudOff,
  HardDrive,
} from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const BackupPage = () => {
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<Date | null>(null);
  const [nextScheduledBackup, setNextScheduledBackup] = useState<Date | null>(null);
  const [backupList, setBackupList] = useState<Array<{ id: string; date: string; size: string }>>([]);
  const [bucketName, setBucketName] = useState('metro-depot-backups');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [isLoadingBackups, setIsLoadingBackups] = useState(false);
  
  // Backup options
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(true);
  const [includeReports, setIncludeReports] = useState(true);
  const [includeTools, setIncludeTools] = useState(true);
  const [includeTrains, setIncludeTrains] = useState(true);
  const [includeStaff, setIncludeStaff] = useState(true);
  
  // Load initial data
  useEffect(() => {
    // Simulate last backup date (30 days ago)
    const lastBackup = new Date();
    lastBackup.setDate(lastBackup.getDate() - 30);
    setLastBackupDate(lastBackup);
    
    // Simulate next scheduled backup date (in 1 day)
    const nextBackup = new Date();
    nextBackup.setDate(nextBackup.getDate() + 1);
    setNextScheduledBackup(nextBackup);
    
    // Load backup list
    loadBackupList();
  }, []);
  
  // Load backup list
  const loadBackupList = async () => {
    setIsLoadingBackups(true);
    
    try {
      // Simulate API call to load backup list
      const response = await listAvailableBackups({
        bucketName,
        backupFrequency: 'monthly',
        retention: 365,
      });
      
      if (response.success && response.backups) {
        setBackupList(response.backups);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load backup list',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load backup list',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingBackups(false);
    }
  };
  
  // Handle manual backup
  const handleManualBackup = async () => {
    setIsBackingUp(true);
    
    try {
      // Create backup options object
      const backupOptions = {
        includeAttendance,
        includeTasks,
        includeReports,
        includeTools,
        includeTrains,
        includeStaff,
      };
      
      // Perform backup
      const result = await performBackup(backupOptions);
      
      if (result.success) {
        // Update last backup date
        setLastBackupDate(new Date());
        
        // Show success toast
        toast({
          title: 'Backup Successful',
          description: 'Data has been successfully backed up to Google Cloud',
        });
        
        // Reload backup list
        loadBackupList();
      } else {
        toast({
          title: 'Backup Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Backup Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsBackingUp(false);
    }
  };
  
  // Handle setup automatic backups
  const handleSetupAutomaticBackups = () => {
    setIsSettingUp(true);
    
    try {
      // Set up automatic backups
      setupAutomaticBackups(frequency);
      
      // Calculate next backup date based on frequency
      const nextBackup = new Date();
      if (frequency === 'daily') {
        nextBackup.setDate(nextBackup.getDate() + 1);
      } else if (frequency === 'weekly') {
        nextBackup.setDate(nextBackup.getDate() + 7);
      } else if (frequency === 'monthly') {
        nextBackup.setMonth(nextBackup.getMonth() + 1);
      }
      
      setNextScheduledBackup(nextBackup);
      
      // Show success toast
      toast({
        title: 'Automatic Backups Configured',
        description: `Backups will be performed ${frequency}`,
      });
    } catch (error) {
      toast({
        title: 'Setup Failed',
        description: 'Failed to set up automatic backups',
        variant: 'destructive',
      });
    } finally {
      setIsSettingUp(false);
    }
  };
  
  // Handle verify configuration
  const handleVerifyConfig = async () => {
    setIsVerifying(true);
    
    try {
      // Verify backup configuration
      const result = await verifyBackupConfig();
      
      setIsConfigValid(result.valid);
      
      if (result.valid) {
        toast({
          title: 'Configuration Valid',
          description: 'Backup configuration verified successfully',
        });
      } else {
        toast({
          title: 'Configuration Invalid',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      setIsConfigValid(false);
      toast({
        title: 'Verification Failed',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle restore backup
  const handleRestoreBackup = (backupId: string) => {
    // In a real application, this would initiate the restore process
    toast({
      title: 'Restore Initiated',
      description: `Restoring backup ${backupId}. This may take several minutes.`,
    });
  };
  
  // Handle download backup
  const handleDownloadBackup = (backupId: string) => {
    // In a real application, this would download the backup file
    toast({
      title: 'Download Started',
      description: `Downloading backup ${backupId}`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Backup & Recovery</h1>
        <p className="text-muted-foreground">
          Configure and manage cloud backups for your Metro Depot Management system
        </p>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList>
          <TabsTrigger value="dashboard">Backup Dashboard</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="history">Backup History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Last Backup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-semibold">
                    {lastBackupDate ? format(lastBackupDate, 'MMM dd, yyyy') : 'Never'}
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                {lastBackupDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(lastBackupDate, 'h:mm a')}
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Next Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-semibold">
                    {nextScheduledBackup ? format(nextScheduledBackup, 'MMM dd, yyyy') : 'Not Scheduled'}
                  </div>
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                {nextScheduledBackup && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(nextScheduledBackup, 'h:mm a')}
                  </p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Backup Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-semibold">
                    {isConfigValid === null ? 'Not Verified' : isConfigValid ? 'Valid' : 'Invalid'}
                  </div>
                  {isConfigValid === true ? (
                    <Check className="h-8 w-8 text-green-500" />
                  ) : isConfigValid === false ? (
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-amber-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {isConfigValid === null 
                    ? 'Configuration needs verification' 
                    : isConfigValid 
                      ? 'Ready to back up data' 
                      : 'Configuration invalid'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Manual Backup</CardTitle>
                <CardDescription>
                  Start a manual backup to Google Cloud Storage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-attendance"
                          checked={includeAttendance}
                          onCheckedChange={(checked) => setIncludeAttendance(!!checked)}
                        />
                        <Label htmlFor="include-attendance">Attendance Records</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-tasks"
                          checked={includeTasks}
                          onCheckedChange={(checked) => setIncludeTasks(!!checked)}
                        />
                        <Label htmlFor="include-tasks">Tasks & Activities</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-reports"
                          checked={includeReports}
                          onCheckedChange={(checked) => setIncludeReports(!!checked)}
                        />
                        <Label htmlFor="include-reports">Reports (RSOI/EIR/NCR)</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-tools"
                          checked={includeTools}
                          onCheckedChange={(checked) => setIncludeTools(!!checked)}
                        />
                        <Label htmlFor="include-tools">M&P Tools</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-trains"
                          checked={includeTrains}
                          onCheckedChange={(checked) => setIncludeTrains(!!checked)}
                        />
                        <Label htmlFor="include-trains">Trains & Maintenance</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-staff"
                          checked={includeStaff}
                          onCheckedChange={(checked) => setIncludeStaff(!!checked)}
                        />
                        <Label htmlFor="include-staff">Staff Records</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleManualBackup} 
                    disabled={isBackingUp || isConfigValid === false}
                  >
                    {isBackingUp ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Backing Up...
                      </>
                    ) : (
                      <>
                        <Cloud className="mr-2 h-4 w-4" />
                        Start Backup Now
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Backup Size</CardTitle>
                <CardDescription>
                  Current data storage usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Attendance Records</span>
                    <span className="text-sm">42 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tasks & Activities</span>
                    <span className="text-sm">124 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reports</span>
                    <span className="text-sm">78 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>M&P Tools</span>
                    <span className="text-sm">18 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Trains & Maintenance</span>
                    <span className="text-sm">65 MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Staff Records</span>
                    <span className="text-sm">15 MB</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total</span>
                      <span>342 MB</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Backups</CardTitle>
              <CardDescription>
                Last 5 backup operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Backup ID</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupList.length > 0 ? (
                    backupList.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{format(new Date(backup.date), 'MMM dd, yyyy HH:mm')}</TableCell>
                        <TableCell>{backup.id}</TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-600">
                            Complete
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup(backup.id)}
                            >
                              <HardDrive className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadBackup(backup.id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <CloudOff className="h-8 w-8 mb-2" />
                          <p>No backups found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google Cloud Storage Settings</CardTitle>
              <CardDescription>
                Configure your Google Cloud Storage for data backups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bucket-name">Bucket Name</Label>
                  <Input
                    id="bucket-name"
                    placeholder="Enter Google Cloud Storage bucket name"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    The name of your Google Cloud Storage bucket where backups will be stored
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select 
                    value={frequency} 
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}
                  >
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How often automatic backups should be performed
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Service Account Key</Label>
                  <div className="flex">
                    <Input
                      type="file"
                      accept=".json"
                      className="w-full"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload your Google Cloud service account key (JSON file)
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleVerifyConfig} 
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Server className="mr-2 h-4 w-4" />
                        Verify Configuration
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={handleSetupAutomaticBackups} 
                    disabled={isSettingUp || isConfigValid === false}
                    className="flex-1"
                  >
                    {isSettingUp ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Setting Up...
                      </>
                    ) : (
                      <>
                        <Calendar className="mr-2 h-4 w-4" />
                        Set Up Automatic Backups
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Local Backup Settings</CardTitle>
              <CardDescription>
                Configure settings for local data backups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="local-backup-dir">Local Backup Directory</Label>
                  <Input
                    id="local-backup-dir"
                    placeholder="Enter path to local backup directory"
                    value="/opt/metro-depot/backups"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Local directory where backups will be stored (in addition to cloud backups)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="local-retention">Local Retention (days)</Label>
                  <Input
                    id="local-retention"
                    type="number"
                    placeholder="Enter number of days to keep local backups"
                    value="90"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of days to keep local backups before automatic deletion
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enable-compression" checked disabled />
                  <Label htmlFor="enable-compression">Enable Compression</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="enable-encryption" checked disabled />
                  <Label htmlFor="enable-encryption">Enable Encryption</Label>
                </div>
                
                <Button variant="outline" disabled>
                  <HardDrive className="mr-2 h-4 w-4" />
                  Update Local Backup Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>
                Complete history of backup operations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={loadBackupList} disabled={isLoadingBackups}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isLoadingBackups ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Export Log
                </Button>
              </div>
              
              <Table>
                <TableCaption>
                  {backupList.length > 0 
                    ? `Showing ${backupList.length} backup operations` 
                    : 'No backup history available'}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Backup ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupList.length > 0 ? (
                    backupList.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{format(new Date(backup.date), 'MMM dd, yyyy HH:mm')}</TableCell>
                        <TableCell>{backup.id}</TableCell>
                        <TableCell>
                          {backup.id.includes('backup') ? 'Full Backup' : 'Incremental'}
                        </TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-600">
                            Complete
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRestoreBackup(backup.id)}
                            >
                              <HardDrive className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDownloadBackup(backup.id)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <CloudOff className="h-8 w-8 mb-2" />
                          <p>No backup history found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackupPage;
