
import React from 'react';
import { JobCardList } from '@/components/job-card/JobCardList';
import { getJobCards, getJobCardStatistics } from '@/lib/mockDataJobCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Clipboard, ClipboardCheck, FileWarning, Clock, Wrench } from 'lucide-react';

const JobCards = () => {
  const jobCards = getJobCards();
  const stats = getJobCardStatistics(jobCards);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Cards</h1>
        <p className="text-muted-foreground">
          Manage job cards, track failures, and analyze maintenance activities
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Job Cards"
          value={stats.totalCards.toString()}
          icon={<Clipboard className="h-5 w-5 text-primary" />}
          description={`${stats.closedCards} closed, ${stats.openCards + stats.inProgressCards} active`}
        />
        <StatCard
          title="Maintenance Types"
          value={`${stats.cmCards} CM`}
          icon={<Wrench className="h-5 w-5 text-metro-warning" />}
          description={`${stats.pmCards} PM, ${stats.opmCards} OPM`}
        />
        <StatCard
          title="Service Failures"
          value={stats.serviceFailures.toString()}
          icon={<FileWarning className="h-5 w-5 text-metro-danger" />}
          description={`${stats.withWithdraw} withdrawals, ${stats.withDelay} delays`}
        />
        <StatCard
          title="MTTR"
          value={`${stats.mttr.toFixed(1)} hrs`}
          icon={<Clock className="h-5 w-5 text-metro-info" />}
          description={`MDBF: ${Math.round(stats.mdbf)} km`}
        />
      </div>

      <JobCardList jobCards={jobCards} />
    </div>
  );
};

export default JobCards;
