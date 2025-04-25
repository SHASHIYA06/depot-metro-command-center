
import React from 'react';
import { FracasMetricsCard } from '@/components/job-card/FracasMetricsCard';
import { getJobCards } from '@/lib/mockDataJobCards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, FileText, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';

const FracasReport = () => {
  const jobCards = getJobCards();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleExportExcel = () => {
    const dataToExport = [
      {
        'Report Type': 'FRACAS Summary',
        'Generated On': new Date().toLocaleDateString(),
        'Total Job Cards': jobCards.length,
        'Service Failures': jobCards.filter(card => 
          card.withdraw || 
          (card.delay && card.delayDuration && 
            ['3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'].includes(card.delayDuration))
        ).length,
        'MTTR (hours)': (jobCards.filter(card => 
          (card.status === 'completed' || card.status === 'closed') && 
          card.durationOfRepair !== undefined
        ).reduce((sum, card) => sum + (card.durationOfRepair || 0), 0) / 
        jobCards.filter(card => 
          (card.status === 'completed' || card.status === 'closed') && 
          card.durationOfRepair !== undefined
        ).length).toFixed(1),
        'MDBF (km)': (5000 * 25 / jobCards.filter(card => 
          card.withdraw || 
          (card.delay && card.delayDuration && 
            ['3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'].includes(card.delayDuration))
        ).length).toFixed(0),
        'Availability (%)': ((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100).toFixed(2)
      }
    ];
    
    exportToExcel(dataToExport, 'fracas_summary_report');
    toast({
      title: "Export Successful",
      description: "FRACAS summary report has been exported to Excel.",
    });
  };
  
  const handleExportPDF = () => {
    const dataToExport = [
      {
        'Report Type': 'FRACAS Summary',
        'Generated On': new Date().toLocaleDateString(),
        'Total Job Cards': jobCards.length,
        'Service Failures': jobCards.filter(card => 
          card.withdraw || 
          (card.delay && card.delayDuration && 
            ['3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'].includes(card.delayDuration))
        ).length,
        'MTTR (hours)': (jobCards.filter(card => 
          (card.status === 'completed' || card.status === 'closed') && 
          card.durationOfRepair !== undefined
        ).reduce((sum, card) => sum + (card.durationOfRepair || 0), 0) / 
        jobCards.filter(card => 
          (card.status === 'completed' || card.status === 'closed') && 
          card.durationOfRepair !== undefined
        ).length).toFixed(1),
        'MDBF (km)': (5000 * 25 / jobCards.filter(card => 
          card.withdraw || 
          (card.delay && card.delayDuration && 
            ['3 Minutes', '4 Minutes', '5 Minutes', 'More than 5 Minutes'].includes(card.delayDuration))
        ).length).toFixed(0),
        'Availability (%)': ((720 * 25 - jobCards.reduce((sum, card) => sum + (card.durationOfRepair || 0), 0)) / (720 * 25) * 100).toFixed(2)
      }
    ];
    
    exportToPDF(dataToExport, 'fracas_summary_report', 'FRACAS Summary Report');
    toast({
      title: "Export Successful",
      description: "FRACAS summary report has been exported to PDF.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">FRACAS Report</h1>
          <p className="text-muted-foreground">
            Failure Reporting and Corrective Action System metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={() => navigate('/job-cards')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            View Job Cards
          </Button>
        </div>
      </div>
      
      <FracasMetricsCard jobCards={jobCards} />
      
      <Card>
        <CardHeader>
          <CardTitle>FRACAS Methodology</CardTitle>
          <CardDescription>Understanding the FRACAS metrics and calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Mean Time To Repair (MTTR)</h3>
            <p className="text-sm text-muted-foreground">
              MTTR measures the average time required to repair a failed component or system. It is calculated as: 
              <span className="font-mono bg-muted p-1 rounded mx-1">Total repair time ÷ Number of relevant failures</span>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Mean Distance Between Failures (MDBF)</h3>
            <p className="text-sm text-muted-foreground">
              MDBF measures the reliability of the fleet by calculating the average distance traveled between service failures. It is calculated as: 
              <span className="font-mono bg-muted p-1 rounded mx-1">Total fleet km ÷ Number of service failures</span>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Mean Distance Between Component Failures (MDBCF)</h3>
            <p className="text-sm text-muted-foreground">
              MDBCF is similar to MDBF but calculated for specific components. It is calculated as: 
              <span className="font-mono bg-muted p-1 rounded mx-1">Total km of identical components in fleet ÷ Number of component failures</span>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Availability</h3>
            <p className="text-sm text-muted-foreground">
              Availability measures the percentage of time that the fleet is available for service. It is calculated as: 
              <span className="font-mono bg-muted p-1 rounded mx-1">(Total possible hours - Downtime) ÷ Total possible hours × 100</span>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Service Failure</h3>
            <p className="text-sm text-muted-foreground">
              A service failure is defined as any failure that results in:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
              <li>Pre-departure withdrawal</li>
              <li>In-service withdrawal</li>
              <li>Service delays of 3 minutes or more</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FracasReport;
