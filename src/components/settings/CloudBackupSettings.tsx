
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Cloud, Download, Upload, RefreshCw, Clock, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  BackupConfig, 
  backupToGoogleCloud, 
  scheduleAutomaticBackups,
  listAvailableBackups,
  retrieveBackup,
  getCloudBackupConfigGuide
} from '@/utils/cloudBackup';

export const CloudBackupSettings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('settings');
  
  const [backupConfig, setBackupConfig] = useState<BackupConfig>({
    bucketName: '',
    backupFrequency: 'monthly',
    retention: 90,
    serviceAccountKey: ''
  });
  
  const [availableBackups, setAvailableBackups] = useState<Array<{ id: string; date: string; size: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackupId, setSelectedBackupId] = useState('');
  
  const handleConfigChange = (field: keyof BackupConfig, value: any) => {
    setBackupConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveConfig = async () => {
    setIsLoading(true);
    
    if (!backupConfig.bucketName) {
      toast({
        title: 'Error',
        description: 'Bucket name is required',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Schedule backups
      scheduleAutomaticBackups(backupConfig);
      
      toast({
        title: 'Success',
        description: `Backup configuration saved. Automatic backups scheduled with ${backupConfig.backupFrequency} frequency.`
      });
      
      // Switch to history tab
      setActiveTab('history');
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save backup configuration',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualBackup = async () => {
    setIsLoading(true);
    
    if (!backupConfig.bucketName) {
      toast({
        title: 'Error',
        description: 'Bucket name is required',
        variant: 'destructive'
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // Mock data to back up
      const mockDataToBackup = {
        activities: 'All activity data',
        attendance: 'All attendance records',
        maintenance: 'All maintenance records',
        timestamp: new Date().toISOString()
      };
      
      const result = await backupToGoogleCloud(mockDataToBackup, backupConfig);
      
      if (result.success) {
        toast({
          title: 'Backup Successful',
          description: result.message
        });
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      toast({
        title: 'Backup Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadAvailableBackups = async () => {
    setIsLoading(true);
    
    try {
      const result = await listAvailableBackups(backupConfig);
      
      if (result.success && result.backups) {
        setAvailableBackups(result.backups);
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load backup history',
        variant: 'destructive'
      });
      setAvailableBackups([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestoreBackup = async () => {
    if (!selectedBackupId) {
      toast({
        title: 'Error',
        description: 'Please select a backup to restore',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await retrieveBackup(selectedBackupId, backupConfig);
      
      if (result.success) {
        toast({
          title: 'Restore Successful',
          description: result.message
        });
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      toast({
        title: 'Restore Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load backups when tab changes to history
  React.useEffect(() => {
    if (activeTab === 'history' && backupConfig.bucketName) {
      loadAvailableBackups();
    }
  }, [activeTab]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Cloud Backup</CardTitle>
        <CardDescription>
          Configure and manage Google Cloud Storage backups for all system data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="history">Backup History</TabsTrigger>
            <TabsTrigger value="guide">Setup Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bucket-name">Bucket Name</Label>
              <Input
                id="bucket-name"
                placeholder="e.g., metro-depot-backups"
                value={backupConfig.bucketName}
                onChange={e => handleConfigChange('bucketName', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                The Google Cloud Storage bucket where backups will be stored
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select
                value={backupConfig.backupFrequency}
                onValueChange={value => handleConfigChange('backupFrequency', value)}
              >
                <SelectTrigger id="backup-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retention">Retention Period (Days)</Label>
              <Input
                id="retention"
                type="number"
                min="1"
                placeholder="90"
                value={backupConfig.retention.toString()}
                onChange={e => handleConfigChange('retention', parseInt(e.target.value) || 90)}
              />
              <p className="text-sm text-muted-foreground">
                Number of days to keep backups before automatic deletion
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service-account-key">Service Account Key (JSON)</Label>
              <Textarea
                id="service-account-key"
                placeholder="Paste your service account key JSON here"
                className="font-mono text-xs"
                rows={5}
                value={backupConfig.serviceAccountKey}
                onChange={e => handleConfigChange('serviceAccountKey', e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Service account credentials for authenticating with Google Cloud
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button onClick={handleSaveConfig} disabled={isLoading} className="flex-1">
                <Cloud className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
              
              <Button onClick={handleManualBackup} disabled={isLoading} variant="outline" className="flex-1">
                <Upload className="mr-2 h-4 w-4" />
                Run Manual Backup
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Backup History</h3>
              <Button variant="outline" size="sm" onClick={loadAvailableBackups} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
            
            {availableBackups.length > 0 ? (
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-2 text-left">Backup ID</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Size</th>
                        <th className="px-4 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availableBackups.map(backup => (
                        <tr key={backup.id} className="border-t">
                          <td className="px-4 py-2">{backup.id}</td>
                          <td className="px-4 py-2">{new Date(backup.date).toLocaleString()}</td>
                          <td className="px-4 py-2">{backup.size}</td>
                          <td className="px-4 py-2 text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedBackupId(backup.id)}>
                              Select
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
                  <div>
                    <p className="font-medium">Selected Backup:</p>
                    <p>{selectedBackupId || 'None selected'}</p>
                  </div>
                  
                  <Button 
                    onClick={handleRestoreBackup} 
                    disabled={isLoading || !selectedBackupId}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Restore Backup
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 border rounded-md bg-muted/10">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No Backup History</h3>
                <p className="text-sm text-muted-foreground">
                  {backupConfig.bucketName 
                    ? 'No backups found in the specified bucket' 
                    : 'Configure a bucket in the Settings tab first'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="guide" className="mt-4">
            <div className="border rounded-md p-6 bg-muted/10">
              <div className="flex items-center mb-4">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                <h3 className="text-lg font-medium">Google Cloud Backup Setup Guide</h3>
              </div>
              
              <div className="space-y-4">
                <p>
                  To set up Google Cloud Storage backups for your Metro Depot Management system,
                  follow these steps:
                </p>
                
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Create or use an existing Google Cloud Platform (GCP) account</li>
                  <li>Create a new project in GCP or use an existing one</li>
                  <li>Enable the Google Cloud Storage API for your project</li>
                  <li>Create a storage bucket with appropriate permissions:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Choose a globally unique bucket name</li>
                      <li>Select a storage class (Standard is recommended)</li>
                      <li>Choose a location close to your users</li>
                      <li>Set access control to fine-grained</li>
                    </ul>
                  </li>
                  <li>Create a service account with Storage Admin permissions:
                    <ul className="list-disc pl-5 mt-1">
                      <li>Go to IAM & Admin > Service Accounts</li>
                      <li>Create a new service account</li>
                      <li>Assign the Storage Admin role</li>
                      <li>Create and download a JSON key file</li>
                    </ul>
                  </li>
                  <li>Enter the bucket name and paste the service account JSON key in the Settings tab</li>
                  <li>Choose your preferred backup frequency and retention period</li>
                  <li>Save the configuration to enable automatic backups</li>
                </ol>
                
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md mt-4">
                  <p className="text-sm font-medium">Required Information Summary:</p>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    <li>Google Cloud Storage bucket name</li>
                    <li>Service account credentials (JSON key file)</li>
                    <li>Backup frequency preference</li>
                    <li>Retention period preference</li>
                  </ul>
                </div>
                
                <p className="text-sm text-muted-foreground pt-2">
                  For more detailed instructions, refer to the 
                  <a 
                    href="https://cloud.google.com/storage/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline ml-1"
                  >
                    Google Cloud Documentation
                  </a>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
