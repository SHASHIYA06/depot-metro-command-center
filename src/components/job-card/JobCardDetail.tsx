
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JobCard } from '@/types/job-card';
import { FileText, Clipboard, Calendar, Clock, Train, User, FileEdit, CheckSquare } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface JobCardDetailProps {
  jobCard: JobCard;
  onEdit?: () => void;
}

const LabelValue: React.FC<{ label: string; value: string | number | undefined | boolean; className?: string }> = ({ 
  label, 
  value, 
  className = "" 
}) => (
  <div className={`mb-3 ${className}`}>
    <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
    <div className="text-sm">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || 'N/A'}</div>
  </div>
);

export const JobCardDetail: React.FC<JobCardDetailProps> = ({ jobCard, onEdit }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePrintClick = () => {
    toast({
      title: "Print Functionality",
      description: "Print functionality would open a print dialog here.",
    });
    window.print();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  const formatDateTime = (dateString?: string, timeString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (timeString) {
      const [hours, minutes] = timeString.split(':');
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }
    return format(date, 'dd/MM/yyyy HH:mm');
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span>Job Card {jobCard.jcNo}</span>
          </CardTitle>
          <CardDescription className="mt-1">
            FRACAS ID: {jobCard.fracasId}
          </CardDescription>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <Badge className="mb-2" variant={
            jobCard.status === 'open' ? 'default' :
            jobCard.status === 'in_progress' ? 'secondary' :
            jobCard.status === 'completed' ? 'outline' : 'success'
          }>
            {jobCard.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">
            {jobCard.maintenanceType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="failure">Failure Info</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="actions">Actions & Closure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clipboard className="h-4 w-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LabelValue label="Train Number" value={jobCard.trainNo} />
                  <LabelValue label="Car Number" value={jobCard.carNo} />
                  <LabelValue label="Odometer Reading" value={`${jobCard.odometerReading} km`} />
                  <LabelValue label="Reporting Location" value={jobCard.reportingLocation} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Personnel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LabelValue label="Issued To" value={jobCard.issuedTo} />
                  <LabelValue label="Reported By" value={jobCard.reportedBy} />
                  <LabelValue label="Inspector" value={jobCard.inspector} />
                  {jobCard.nameOfActionEndorsement && (
                    <LabelValue label="Action Endorsement" value={jobCard.nameOfActionEndorsement} />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Dates & Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LabelValue 
                    label="Failure Occurred" 
                    value={formatDateTime(jobCard.failureOccurredDate, jobCard.failureOccurredTime)} 
                  />
                  <LabelValue 
                    label="Job Card Issued" 
                    value={formatDateTime(jobCard.jobCardIssuedDate, jobCard.jobCardIssuedTime)} 
                  />
                  <LabelValue 
                    label="Expected Completion" 
                    value={formatDateTime(jobCard.expectedCompleteDate, jobCard.expectedCompleteTime)} 
                  />
                  {jobCard.status === 'closed' && (
                    <LabelValue 
                      label="Job Card Closed" 
                      value={formatDateTime(jobCard.jobCardCloseDate, jobCard.jobCardCloseTime)} 
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="failure">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Failure Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{jobCard.failureDescription}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <LabelValue label="Work Pending" value={jobCard.workPending} />
                    {jobCard.workPending && (
                      <>
                        <LabelValue label="Can Be Energized" value={jobCard.canBeEnergized} />
                        <LabelValue label="Can Be Moved" value={jobCard.canBeMoved} />
                      </>
                    )}
                    <LabelValue label="Withdraw" value={jobCard.withdraw} />
                    <LabelValue label="Delay" value={jobCard.delay} />
                    {jobCard.delay && jobCard.delayTime && (
                      <LabelValue label="Delay Time" value={jobCard.delayTime} />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Operating Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  {jobCard.maintenanceType === 'CM' ? (
                    <>
                      <LabelValue 
                        label="Job Operating Conditions" 
                        value={jobCard.jobOperatingConditions || 'N/A'} 
                      />
                      <LabelValue 
                        label="Effects on Train Service" 
                        value={jobCard.effectsOnTrainService} 
                      />
                      {jobCard.effectsOnTrainService && (
                        <LabelValue 
                          label="Service Distinction" 
                          value={jobCard.serviceDistinction || 'N/A'} 
                        />
                      )}
                      {jobCard.serviceDistinction === 'Delay' && (
                        <LabelValue 
                          label="Delay Duration" 
                          value={jobCard.delayDuration || 'N/A'} 
                        />
                      )}
                    </>
                  ) : jobCard.maintenanceType === 'PM' ? (
                    <LabelValue 
                      label="Service Checks" 
                      value={jobCard.serviceChecks || 'N/A'} 
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No specific operating conditions for OPM maintenance type.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="technical">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">System Hierarchy</CardTitle>
                </CardHeader>
                <CardContent>
                  <LabelValue label="System" value={jobCard.system} />
                  <LabelValue label="Sub-System" value={jobCard.subSystem} />
                  <LabelValue label="Equipment" value={jobCard.equipment} />
                  <LabelValue label="Component" value={jobCard.component} />
                  <LabelValue label="Part(s)" value={jobCard.parts} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Failure Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <LabelValue label="NCR Number" value={jobCard.ncrNo} />
                  <LabelValue label="Serial Number" value={jobCard.serialNo} />
                  <LabelValue label="Failure Location" value={jobCard.failureLocation} />
                  <LabelValue label="Failure Name" value={jobCard.failureName} />
                  <LabelValue label="Failure Details" value={jobCard.failureDetails} />
                  {jobCard.failureCategory && (
                    <LabelValue label="Failure Category" value={jobCard.failureCategory} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="actions">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Work Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <LabelValue label="Workflow State" value={jobCard.workflowState} />
                  <LabelValue label="Actions Taken" value={jobCard.actionsTaken} />
                  <LabelValue label="Root Cause" value={jobCard.rootCause} />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <LabelValue label="No. of Men" value={jobCard.noOfMen} />
                    <LabelValue label="Duration of Repair" value={`${jobCard.durationOfRepair} hr`} />
                    <LabelValue label="Car Lifting Required" value={jobCard.carLiftingRequired} />
                    <LabelValue label="Replace/Change" value={jobCard.replaceChange} />
                  </div>
                </CardContent>
              </Card>
              
              {jobCard.replaceChange && (
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">Component Replacement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LabelValue 
                      label="Components Taken Out Date" 
                      value={formatDate(jobCard.componentsTakenOutDate)} 
                    />
                    <LabelValue 
                      label="Serial No. of Components Taken Out" 
                      value={jobCard.componentsTakenOutSerialNo} 
                    />
                    <LabelValue 
                      label="Components Taken In Date" 
                      value={formatDate(jobCard.componentsTakenInDate)} 
                    />
                    <LabelValue 
                      label="Serial No. of Components Taken In" 
                      value={jobCard.componentsTakenInSerialNo} 
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/job-cards')}>
          Back to List
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintClick}>
            <FileText className="h-4 w-4 mr-2" />
            Print
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              <FileEdit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
