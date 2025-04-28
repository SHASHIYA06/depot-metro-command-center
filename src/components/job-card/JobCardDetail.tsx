
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/types/job-card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Pencil, FilePlus, Download, Printer, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { exportJobCardToPDF } from '@/utils/pdfGenerator';
import { useToast } from '@/hooks/use-toast';
import { syncJobCardsToSheets } from '@/utils/googleSheetsSync';

interface JobCardDetailProps {
  jobCard: JobCard;
  onEdit?: () => void;
}

export const JobCardDetail: React.FC<JobCardDetailProps> = ({ 
  jobCard, 
  onEdit
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExportPDF = () => {
    try {
      exportJobCardToPDF(jobCard);
      toast({
        title: "PDF Export Successful",
        description: `Job Card ${jobCard.jcNo} has been exported as a PDF.`
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "PDF Export Failed",
        description: "There was an error exporting the job card as a PDF.",
        variant: "destructive",
      });
    }
  };

  const handleSyncToSheets = async () => {
    const result = await syncJobCardsToSheets([jobCard]);
    if (!result) {
      toast({
        title: "Sync Failed",
        description: "Please configure Google Sheets integration in environment settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <Button variant="outline" onClick={handleGoBack} className="flex gap-2 items-center">
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handlePrintPDF} className="flex gap-2 items-center">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" onClick={handleExportPDF} className="flex gap-2 items-center">
            <Download className="h-4 w-4" />
            <span>Export PDF</span>
          </Button>
          <Button variant="outline" onClick={handleSyncToSheets} className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span>Sync to Sheets</span>
          </Button>
          {onEdit && (
            <Button onClick={onEdit} className="flex gap-2 items-center">
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block print:mb-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Job Card Details</h1>
          <p className="text-gray-500">JC No: {jobCard.jcNo}</p>
        </div>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 bg-slate-50 border-b print:bg-white">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <h2 className="text-2xl font-bold">{jobCard.jcNo}</h2>
                <p className="text-muted-foreground">Created on {format(parseISO(jobCard.createdAt), 'PPP')}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <Badge 
                  variant={
                    jobCard.status === 'open' ? 'default' :
                    jobCard.status === 'in_progress' ? 'secondary' :
                    jobCard.status === 'completed' ? 'outline' : 
                    'success'
                  }
                  className="text-sm py-1 px-3"
                >
                  {jobCard.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Train Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Train No</p>
                    <p className="font-medium">{jobCard.trainNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Car No</p>
                    <p className="font-medium">{jobCard.carNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Odometer Reading</p>
                    <p className="font-medium">{jobCard.odometerReading}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance Type</p>
                    <Badge variant="outline">{jobCard.maintenanceType}</Badge>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Failure Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">System</p>
                    <p className="font-medium">{jobCard.system}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sub-System</p>
                    <p className="font-medium">{jobCard.subSystem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Equipment</p>
                    <p className="font-medium">{jobCard.equipment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Component</p>
                    <p className="font-medium">{jobCard.component}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Parts</p>
                    <p className="font-medium">{jobCard.parts}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Issued To</p>
                    <p className="font-medium">{jobCard.issuedTo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reporting Location</p>
                    <p className="font-medium">{jobCard.reportingLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Withdraw</p>
                    <p className="font-medium">{jobCard.withdraw ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delay</p>
                    <p className="font-medium">{jobCard.delay ? 'Yes' : 'No'}</p>
                  </div>
                  {jobCard.delay && jobCard.delayTime && (
                    <div>
                      <p className="text-sm text-muted-foreground">Delay Time</p>
                      <p className="font-medium">{jobCard.delayTime}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Work Pending</p>
                    <p className="font-medium">{jobCard.workPending ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Failure Description</h3>
                <p className="bg-slate-50 p-3 rounded-md border text-gray-800 print:bg-white">
                  {jobCard.failureDescription}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Actions Taken</h3>
                <p className="bg-slate-50 p-3 rounded-md border text-gray-800 print:bg-white">
                  {jobCard.actionsTaken}
                </p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-3">Root Cause Analysis</h3>
            <p className="bg-slate-50 p-3 rounded-md border text-gray-800 print:bg-white">
              {jobCard.rootCause || 'Not provided'}
            </p>
          </div>
          
          {jobCard.status === 'closed' && jobCard.jobCardCloseDate && (
            <>
              <Separator />
              <div className="p-6 bg-slate-50 print:bg-white">
                <h3 className="text-lg font-semibold mb-3">Closure Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Closed Date</p>
                    <p className="font-medium">{format(parseISO(jobCard.jobCardCloseDate), 'PPP')}</p>
                  </div>
                  {jobCard.jobCardCloseTime && (
                    <div>
                      <p className="text-sm text-muted-foreground">Closed Time</p>
                      <p className="font-medium">{jobCard.jobCardCloseTime}</p>
                    </div>
                  )}
                  {jobCard.nameOfActionEndorsement && (
                    <div>
                      <p className="text-sm text-muted-foreground">Action Endorsed By</p>
                      <p className="font-medium">{jobCard.nameOfActionEndorsement}</p>
                    </div>
                  )}
                  {jobCard.dateOfActionEndorsement && (
                    <div>
                      <p className="text-sm text-muted-foreground">Endorsement Date</p>
                      <p className="font-medium">{jobCard.dateOfActionEndorsement}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Print-only footer */}
      <div className="hidden print:block print:mt-8 print:border-t print:pt-4">
        <div className="flex justify-between text-sm">
          <span>Printed on: {format(new Date(), 'PPP')}</span>
          <span>Metro Depot Command Center</span>
        </div>
      </div>

      {/* Print styles - will only affect printed output */}
      <style type="text/css" media="print">
        {`
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        `}
      </style>
    </div>
  );
};
