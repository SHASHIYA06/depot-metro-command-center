
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CloudBackupSettings } from '@/components/settings/CloudBackupSettings';

const BackupPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data Backup & Recovery</h1>
        <p className="text-muted-foreground">
          Configure and manage cloud backups for your Metro Depot Management system
        </p>
      </div>
      
      <CloudBackupSettings />
    </div>
  );
};

export default BackupPage;
