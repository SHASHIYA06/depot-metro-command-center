
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { 
  JobCard, 
  SYSTEM_OPTIONS, 
  TRAIN_NUMBERS, 
  CAR_NUMBERS, 
  LOCATIONS,
  STAFF_MEMBERS,
  SystemOption,
  SubSystemOption,
  EquipmentOption,
  ComponentOption
} from '@/types/job-card';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface JobCardFormProps {
  initialJobCard?: JobCard;
  onSubmit?: (jobCard: JobCard) => void;
  isEditing?: boolean;
}

const generateFracasId = (): string => {
  const prefix = 'FRACAS';
  const date = format(new Date(), 'yyMMddHHmm');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}-${date}-${random}`;
};

const generateJobCardNo = (): string => {
  const prefix = 'JC';
  const date = format(new Date(), 'yyMMdd');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${date}-${random}`;
};

// Time input component
const TimeInput: React.FC<{ value: string; onChange: (value: string) => void; label: string; id: string }> = ({ value, onChange, label, id }) => {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export const JobCardForm: React.FC<JobCardFormProps> = ({ 
  initialJobCard, 
  onSubmit,
  isEditing = false
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('basic-info');
  const [jobCard, setJobCard] = useState<Partial<JobCard>>({
    id: initialJobCard?.id || uuidv4(),
    jcNo: initialJobCard?.jcNo || generateJobCardNo(),
    fracasId: initialJobCard?.fracasId || generateFracasId(),
    status: initialJobCard?.status || 'open',
    createdAt: initialJobCard?.createdAt || format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    updatedAt: initialJobCard?.updatedAt || format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
    
    // Basic Info Tab
    issuedTo: initialJobCard?.issuedTo || '',
    failureOccurredDate: initialJobCard?.failureOccurredDate || format(new Date(), 'yyyy-MM-dd'),
    failureOccurredTime: initialJobCard?.failureOccurredTime || format(new Date(), 'HH:mm'),
    depotArrivingDate: initialJobCard?.depotArrivingDate || format(new Date(), 'yyyy-MM-dd'),
    depotArrivingTime: initialJobCard?.depotArrivingTime || format(new Date(), 'HH:mm'),
    jobCardIssuedDate: initialJobCard?.jobCardIssuedDate || format(new Date(), 'yyyy-MM-dd'),
    jobCardIssuedTime: initialJobCard?.jobCardIssuedTime || format(new Date(), 'HH:mm'),
    expectedCompleteDate: initialJobCard?.expectedCompleteDate || '',
    expectedCompleteTime: initialJobCard?.expectedCompleteTime || '',
    reportingLocation: initialJobCard?.reportingLocation || '',
    maintenanceType: initialJobCard?.maintenanceType || 'CM',
    odometerReading: initialJobCard?.odometerReading || 0,
    trainNo: initialJobCard?.trainNo || '',
    carNo: initialJobCard?.carNo || '',
    
    // Failure Info Tab
    failureDescription: initialJobCard?.failureDescription || '',
    workPending: initialJobCard?.workPending || false,
    canBeEnergized: initialJobCard?.canBeEnergized,
    canBeMoved: initialJobCard?.canBeMoved,
    withdraw: initialJobCard?.withdraw || false,
    delay: initialJobCard?.delay || false,
    delayTime: initialJobCard?.delayTime || '',
    reportedBy: initialJobCard?.reportedBy || '',
    inspector: initialJobCard?.inspector || '',
    
    // Technical Details Tab
    jobOperatingConditions: initialJobCard?.jobOperatingConditions,
    effectsOnTrainService: initialJobCard?.effectsOnTrainService || false,
    serviceDistinction: initialJobCard?.serviceDistinction,
    delayDuration: initialJobCard?.delayDuration,
    serviceChecks: initialJobCard?.serviceChecks,
    system: initialJobCard?.system || '',
    subSystem: initialJobCard?.subSystem || '',
    equipment: initialJobCard?.equipment || '',
    component: initialJobCard?.component || '',
    parts: initialJobCard?.parts || '',
    ncrNo: initialJobCard?.ncrNo || '',
    serialNo: initialJobCard?.serialNo || '',
    failureLocation: initialJobCard?.failureLocation || '',
    failureName: initialJobCard?.failureName || '',
    failureDetails: initialJobCard?.failureDetails || '',
    
    // Work Info Tab
    workflowState: initialJobCard?.workflowState || 'Investigation',
    actionsTaken: initialJobCard?.actionsTaken || '',
    replaceChange: initialJobCard?.replaceChange || false,
    componentsTakenOutDate: initialJobCard?.componentsTakenOutDate || '',
    componentsTakenOutSerialNo: initialJobCard?.componentsTakenOutSerialNo || '',
    componentsTakenInDate: initialJobCard?.componentsTakenInDate || '',
    componentsTakenInSerialNo: initialJobCard?.componentsTakenInSerialNo || '',
    carLiftingRequired: initialJobCard?.carLiftingRequired || false,
    noOfMen: initialJobCard?.noOfMen || 1,
    durationOfRepair: initialJobCard?.durationOfRepair || 1,
    rootCause: initialJobCard?.rootCause || '',
    
    // Closure Tab
    jobCardCloseDate: initialJobCard?.jobCardCloseDate || '',
    jobCardCloseTime: initialJobCard?.jobCardCloseTime || '',
    nameOfActionEndorsement: initialJobCard?.nameOfActionEndorsement || '',
    dateOfActionEndorsement: initialJobCard?.dateOfActionEndorsement || '',
    failureCategory: initialJobCard?.failureCategory || undefined,
  });

  const [availableSubSystems, setAvailableSubSystems] = useState<SubSystemOption[]>([]);
  const [availableEquipments, setAvailableEquipments] = useState<EquipmentOption[]>([]);
  const [availableComponents, setAvailableComponents] = useState<ComponentOption[]>([]);
  const [availableParts, setAvailableParts] = useState<{ id: string, name: string }[]>([]);

  // Update cascading dropdowns when system changes
  useEffect(() => {
    const selectedSystem = SYSTEM_OPTIONS.find(s => s.name === jobCard.system);
    if (selectedSystem) {
      setAvailableSubSystems(selectedSystem.subSystems);
      setJobCard(prev => ({ ...prev, subSystem: '', equipment: '', component: '', parts: '' }));
    } else {
      setAvailableSubSystems([]);
    }
  }, [jobCard.system]);

  // Update cascading dropdowns when subsystem changes
  useEffect(() => {
    const selectedSystem = SYSTEM_OPTIONS.find(s => s.name === jobCard.system);
    if (selectedSystem) {
      const selectedSubSystem = selectedSystem.subSystems.find(ss => ss.name === jobCard.subSystem);
      if (selectedSubSystem) {
        setAvailableEquipments(selectedSubSystem.equipments);
        setJobCard(prev => ({ ...prev, equipment: '', component: '', parts: '' }));
      } else {
        setAvailableEquipments([]);
      }
    }
  }, [jobCard.subSystem, jobCard.system]);

  // Update cascading dropdowns when equipment changes
  useEffect(() => {
    if (availableEquipments.length > 0) {
      const selectedEquipment = availableEquipments.find(e => e.name === jobCard.equipment);
      if (selectedEquipment) {
        setAvailableComponents(selectedEquipment.components);
        setJobCard(prev => ({ ...prev, component: '', parts: '' }));
      } else {
        setAvailableComponents([]);
      }
    }
  }, [jobCard.equipment, availableEquipments]);

  // Update cascading dropdowns when component changes
  useEffect(() => {
    if (availableComponents.length > 0) {
      const selectedComponent = availableComponents.find(c => c.name === jobCard.component);
      if (selectedComponent) {
        setAvailableParts(selectedComponent.parts);
        setJobCard(prev => ({ ...prev, parts: '' }));
      } else {
        setAvailableParts([]);
      }
    }
  }, [jobCard.component, availableComponents]);

  // Conditional visibility logic based on form state
  const showWorkPendingOptions = jobCard.workPending === true;
  const showDelayTimeOption = jobCard.delay === true;
  const showOperatingConditions = jobCard.maintenanceType === 'CM';
  const showServiceDistinction = showOperatingConditions && jobCard.effectsOnTrainService === true;
  const showDelayDuration = showServiceDistinction && jobCard.serviceDistinction === 'Delay';
  const showServiceChecks = jobCard.maintenanceType === 'PM';
  const showReplaceOptions = jobCard.replaceChange === true;

  const handleChange = (field: string, value: any) => {
    setJobCard(prev => ({
      ...prev,
      [field]: value,
      // Update the updatedAt timestamp
      updatedAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss')
    }));
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      handleChange(field, format(date, 'yyyy-MM-dd'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Perform form validation
    if (!jobCard.issuedTo) {
      toast({
        title: "Validation Error",
        description: "Please specify who the job card is issued to.",
        variant: "destructive"
      });
      setActiveTab('basic-info');
      return;
    }

    if (!jobCard.trainNo) {
      toast({
        title: "Validation Error",
        description: "Please select a train number.",
        variant: "destructive"
      });
      setActiveTab('basic-info');
      return;
    }

    if (!jobCard.carNo) {
      toast({
        title: "Validation Error",
        description: "Please select a car number.",
        variant: "destructive"
      });
      setActiveTab('basic-info');
      return;
    }

    if (!jobCard.failureDescription) {
      toast({
        title: "Validation Error",
        description: "Please provide a failure description.",
        variant: "destructive"
      });
      setActiveTab('failure-info');
      return;
    }

    if (!jobCard.system || !jobCard.subSystem || !jobCard.equipment) {
      toast({
        title: "Validation Error",
        description: "Please select system, sub-system and equipment.",
        variant: "destructive"
      });
      setActiveTab('technical-details');
      return;
    }

    // Submit the form data
    if (onSubmit) {
      onSubmit(jobCard as JobCard);
    } else {
      toast({
        title: isEditing ? "Job Card Updated" : "Job Card Created",
        description: `Job Card ${jobCard.jcNo} has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
      navigate('/job-cards');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isEditing ? `Edit Job Card ${jobCard.jcNo}` : 'Create New Job Card'}
          </CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Update job card details and make changes as needed'
              : 'Fill in the details to create a new job card and failure report'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="failure-info">Failure Info</TabsTrigger>
              <TabsTrigger value="technical-details">Technical Details</TabsTrigger>
              <TabsTrigger value="work-info">Work Info</TabsTrigger>
              <TabsTrigger value="closure">Closure</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic-info" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jcNo">Job Card Number</Label>
                  <Input 
                    id="jcNo" 
                    value={jobCard.jcNo} 
                    readOnly 
                    className="bg-muted" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated job card number</p>
                </div>
                <div>
                  <Label htmlFor="fracasId">FRACAS ID</Label>
                  <Input 
                    id="fracasId" 
                    value={jobCard.fracasId} 
                    readOnly 
                    className="bg-muted" 
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated FRACAS identifier</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="issuedTo">Job Card Issued To</Label>
                  <Select 
                    value={jobCard.issuedTo} 
                    onValueChange={(value) => handleChange('issuedTo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_MEMBERS.map(staff => (
                        <SelectItem key={staff.id} value={staff.name}>
                          {staff.name} ({staff.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reportingLocation">Reporting Location</Label>
                  <Select 
                    value={jobCard.reportingLocation} 
                    onValueChange={(value) => handleChange('reportingLocation', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trainNo">Train Number</Label>
                  <Select 
                    value={jobCard.trainNo} 
                    onValueChange={(value) => handleChange('trainNo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select train number" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRAIN_NUMBERS.map(train => (
                        <SelectItem key={train} value={train}>
                          {train}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="carNo">Car Number</Label>
                  <Select 
                    value={jobCard.carNo} 
                    onValueChange={(value) => handleChange('carNo', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select car number" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAR_NUMBERS.map(car => (
                        <SelectItem key={car} value={car}>
                          {car}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maintenanceType">Maintenance Type</Label>
                  <Select 
                    value={jobCard.maintenanceType} 
                    onValueChange={(value) => handleChange('maintenanceType', value as JobCard['maintenanceType'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CM">CM (Corrective Maintenance)</SelectItem>
                      <SelectItem value="PM">PM (Preventive Maintenance)</SelectItem>
                      <SelectItem value="OPM">OPM (Other Preventive Maintenance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="odometerReading">Odometer Reading (km)</Label>
                  <Input 
                    id="odometerReading" 
                    type="number"
                    value={jobCard.odometerReading} 
                    onChange={e => handleChange('odometerReading', parseFloat(e.target.value))} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="failureOccurredDate">Failure Occurred Date</Label>
                  <DatePicker 
                    date={jobCard.failureOccurredDate ? new Date(jobCard.failureOccurredDate) : undefined}
                    setDate={(date) => handleDateChange('failureOccurredDate', date)}
                  />
                </div>
                <TimeInput 
                  id="failureOccurredTime" 
                  label="Failure Occurred Time" 
                  value={jobCard.failureOccurredTime || ''} 
                  onChange={(value) => handleChange('failureOccurredTime', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="depotArrivingDate">Depot Arriving Date</Label>
                  <DatePicker 
                    date={jobCard.depotArrivingDate ? new Date(jobCard.depotArrivingDate) : undefined}
                    setDate={(date) => handleDateChange('depotArrivingDate', date)}
                  />
                </div>
                <TimeInput 
                  id="depotArrivingTime" 
                  label="Depot Arriving Time" 
                  value={jobCard.depotArrivingTime || ''} 
                  onChange={(value) => handleChange('depotArrivingTime', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobCardIssuedDate">Job Card Issued Date</Label>
                  <DatePicker 
                    date={jobCard.jobCardIssuedDate ? new Date(jobCard.jobCardIssuedDate) : undefined}
                    setDate={(date) => handleDateChange('jobCardIssuedDate', date)}
                  />
                </div>
                <TimeInput 
                  id="jobCardIssuedTime" 
                  label="Job Card Issued Time" 
                  value={jobCard.jobCardIssuedTime || ''} 
                  onChange={(value) => handleChange('jobCardIssuedTime', value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedCompleteDate">Expected Complete Date</Label>
                  <DatePicker 
                    date={jobCard.expectedCompleteDate ? new Date(jobCard.expectedCompleteDate) : undefined}
                    setDate={(date) => handleDateChange('expectedCompleteDate', date)}
                  />
                </div>
                <TimeInput 
                  id="expectedCompleteTime" 
                  label="Expected Complete Time" 
                  value={jobCard.expectedCompleteTime || ''} 
                  onChange={(value) => handleChange('expectedCompleteTime', value)}
                />
              </div>
            </TabsContent>

            {/* Failure Info Tab */}
            <TabsContent value="failure-info" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="failureDescription">Failure Description</Label>
                <Textarea 
                  id="failureDescription" 
                  value={jobCard.failureDescription}
                  onChange={e => handleChange('failureDescription', e.target.value)} 
                  rows={4} 
                  placeholder="Describe the failure in detail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reportedBy">Reported By</Label>
                  <Select 
                    value={jobCard.reportedBy} 
                    onValueChange={(value) => handleChange('reportedBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_MEMBERS.map(staff => (
                        <SelectItem key={staff.id} value={staff.name}>
                          {staff.name} ({staff.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="inspector">Inspector</Label>
                  <Select 
                    value={jobCard.inspector} 
                    onValueChange={(value) => handleChange('inspector', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inspector" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_MEMBERS.filter(staff => staff.role === 'Inspector').map(staff => (
                        <SelectItem key={staff.id} value={staff.name}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="workPending" 
                    checked={jobCard.workPending} 
                    onCheckedChange={(checked) => handleChange('workPending', checked)} 
                  />
                  <Label htmlFor="workPending">Work Pending?</Label>
                </div>

                {showWorkPendingOptions && (
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="canBeEnergized" 
                      checked={jobCard.canBeEnergized} 
                      onCheckedChange={(checked) => handleChange('canBeEnergized', checked)} 
                    />
                    <Label htmlFor="canBeEnergized">Can be energized?</Label>
                  </div>
                )}
              </div>

              {showWorkPendingOptions && (
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="canBeMoved" 
                    checked={jobCard.canBeMoved} 
                    onCheckedChange={(checked) => handleChange('canBeMoved', checked)} 
                  />
                  <Label htmlFor="canBeMoved">Can be moved?</Label>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="withdraw" 
                    checked={jobCard.withdraw} 
                    onCheckedChange={(checked) => handleChange('withdraw', checked)} 
                  />
                  <Label htmlFor="withdraw">Withdraw?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="delay" 
                    checked={jobCard.delay} 
                    onCheckedChange={(checked) => handleChange('delay', checked)} 
                  />
                  <Label htmlFor="delay">Delay?</Label>
                </div>
              </div>

              {showDelayTimeOption && (
                <div>
                  <Label htmlFor="delayTime">Delay Time (DD/HH/MM)</Label>
                  <Input 
                    id="delayTime" 
                    value={jobCard.delayTime} 
                    onChange={e => handleChange('delayTime', e.target.value)} 
                    placeholder="00/00/00"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Format: DD/HH/MM (Days/Hours/Minutes)</p>
                </div>
              )}
            </TabsContent>

            {/* Technical Details Tab */}
            <TabsContent value="technical-details" className="space-y-4">
              {showOperatingConditions && (
                <div>
                  <Label htmlFor="jobOperatingConditions">Job Operating Conditions</Label>
                  <Select 
                    value={jobCard.jobOperatingConditions || ''} 
                    onValueChange={(value) => handleChange('jobOperatingConditions', value as 'Normal' | 'Abnormal' | 'Emergency')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operating conditions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">1. Normal</SelectItem>
                      <SelectItem value="Abnormal">2. Abnormal</SelectItem>
                      <SelectItem value="Emergency">3. Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch 
                  id="effectsOnTrainService" 
                  checked={jobCard.effectsOnTrainService} 
                  onCheckedChange={(checked) => handleChange('effectsOnTrainService', checked)} 
                />
                <Label htmlFor="effectsOnTrainService">Effects on Train Service?</Label>
              </div>

              {showServiceDistinction && (
                <div>
                  <Label htmlFor="serviceDistinction">Service Distinction</Label>
                  <Select 
                    value={jobCard.serviceDistinction || ''} 
                    onValueChange={(value) => handleChange('serviceDistinction', value as JobCard['serviceDistinction'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service distinction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="No effect Service">1. No effect Service</SelectItem>
                      <SelectItem value="Changeover">2. Changeover</SelectItem>
                      <SelectItem value="Push Out">3. Push Out</SelectItem>
                      <SelectItem value="Fail to Dispath">4. Fail to Dispath</SelectItem>
                      <SelectItem value="Deboarding">5. Deboarding</SelectItem>
                      <SelectItem value="Delay">6. Delay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showDelayDuration && (
                <div>
                  <Label htmlFor="delayDuration">Delay Duration</Label>
                  <Select 
                    value={jobCard.delayDuration || ''} 
                    onValueChange={(value) => handleChange('delayDuration', value as JobCard['delayDuration'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delay duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Less than 1 Minute">1. Less than 1 Minute</SelectItem>
                      <SelectItem value="1 Minute">2. 1 Minute</SelectItem>
                      <SelectItem value="2 Minutes">3. 2 Minutes</SelectItem>
                      <SelectItem value="3 Minutes">4. 3 Minutes</SelectItem>
                      <SelectItem value="4 Minutes">5. 4 Minutes</SelectItem>
                      <SelectItem value="5 Minutes">6. 5 Minutes</SelectItem>
                      <SelectItem value="More than 5 Minutes">7. More than 5 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {showServiceChecks && (
                <div>
                  <Label htmlFor="serviceChecks">Service Checks</Label>
                  <Select 
                    value={jobCard.serviceChecks || ''} 
                    onValueChange={(value) => handleChange('serviceChecks', value as JobCard['serviceChecks'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service check" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A Service Check">1. A Service Check</SelectItem>
                      <SelectItem value="B1 Service Check">2. B1 Service Check</SelectItem>
                      <SelectItem value="B4 Service Check">3. B4 Service Check</SelectItem>
                      <SelectItem value="B8 Service Check">4. B8 Service Check</SelectItem>
                      <SelectItem value="C1 Service Check">5. C1 Service Check</SelectItem>
                      <SelectItem value="C2 Service Check">6. C2 Service Check</SelectItem>
                      <SelectItem value="C5 Service Check">7. C5 Service Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="system">System</Label>
                <Select 
                  value={jobCard.system} 
                  onValueChange={(value) => handleChange('system', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_OPTIONS.map(system => (
                      <SelectItem key={system.id} value={system.name}>
                        {system.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subSystem">Sub-System</Label>
                <Select 
                  value={jobCard.subSystem} 
                  onValueChange={(value) => handleChange('subSystem', value)}
                  disabled={availableSubSystems.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableSubSystems.length === 0 ? "Select a System first" : "Select sub-system"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubSystems.map(subSystem => (
                      <SelectItem key={subSystem.id} value={subSystem.name}>
                        {subSystem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="equipment">Equipment</Label>
                <Select 
                  value={jobCard.equipment} 
                  onValueChange={(value) => handleChange('equipment', value)}
                  disabled={availableEquipments.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableEquipments.length === 0 ? "Select a Sub-System first" : "Select equipment"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableEquipments.map(equipment => (
                      <SelectItem key={equipment.id} value={equipment.name}>
                        {equipment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="component">Component</Label>
                <Select 
                  value={jobCard.component} 
                  onValueChange={(value) => handleChange('component', value)}
                  disabled={availableComponents.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableComponents.length === 0 ? "Select Equipment first" : "Select component"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableComponents.map(component => (
                      <SelectItem key={component.id} value={component.name}>
                        {component.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="parts">Part(s)</Label>
                <Select 
                  value={jobCard.parts} 
                  onValueChange={(value) => handleChange('parts', value)}
                  disabled={availableParts.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableParts.length === 0 ? "Select Component first" : "Select part"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParts.map(part => (
                      <SelectItem key={part.id} value={part.name}>
                        {part.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ncrNo">NCR Number</Label>
                  <Input 
                    id="ncrNo" 
                    value={jobCard.ncrNo} 
                    onChange={e => handleChange('ncrNo', e.target.value)} 
                  />
                </div>
                <div>
                  <Label htmlFor="serialNo">Serial Number</Label>
                  <Input 
                    id="serialNo" 
                    value={jobCard.serialNo} 
                    onChange={e => handleChange('serialNo', e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="failureLocation">Failure Location</Label>
                <Select 
                  value={jobCard.failureLocation} 
                  onValueChange={(value) => handleChange('failureLocation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RH1">RH1</SelectItem>
                    <SelectItem value="RH2">RH2</SelectItem>
                    <SelectItem value="LH1">LH1</SelectItem>
                    <SelectItem value="LH2">LH2</SelectItem>
                    <SelectItem value="1st">1st</SelectItem>
                    <SelectItem value="2nd">2nd</SelectItem>
                    <SelectItem value="3rd">3rd</SelectItem>
                    <SelectItem value="4th">4th</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="failureName">Failure Name</Label>
                <Input 
                  id="failureName" 
                  value={jobCard.failureName} 
                  onChange={e => handleChange('failureName', e.target.value)} 
                />
              </div>

              <div>
                <Label htmlFor="failureDetails">Failure Details</Label>
                <Textarea 
                  id="failureDetails" 
                  value={jobCard.failureDetails} 
                  onChange={e => handleChange('failureDetails', e.target.value)} 
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Work Info Tab */}
            <TabsContent value="work-info" className="space-y-4">
              <div>
                <Label htmlFor="workflowState">Workflow State</Label>
                <Select 
                  value={jobCard.workflowState} 
                  onValueChange={(value) => handleChange('workflowState', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Investigation">Investigation</SelectItem>
                    <SelectItem value="Repair">Repair</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Verification">Verification</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="actionsTaken">Description of Actions Taken</Label>
                <Textarea 
                  id="actionsTaken" 
                  value={jobCard.actionsTaken} 
                  onChange={e => handleChange('actionsTaken', e.target.value)} 
                  rows={4}
                  placeholder="Describe the maintenance or repair actions performed..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="replaceChange" 
                    checked={jobCard.replaceChange} 
                    onCheckedChange={(checked) => handleChange('replaceChange', checked)} 
                  />
                  <Label htmlFor="replaceChange">Replace/Change Info?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="carLiftingRequired" 
                    checked={jobCard.carLiftingRequired} 
                    onCheckedChange={(checked) => handleChange('carLiftingRequired', checked)} 
                  />
                  <Label htmlFor="carLiftingRequired">Car Lifting Required?</Label>
                </div>
              </div>

              {showReplaceOptions && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="componentsTakenOutDate">Components Taken Out Date</Label>
                      <DatePicker 
                        date={jobCard.componentsTakenOutDate ? new Date(jobCard.componentsTakenOutDate) : undefined}
                        setDate={(date) => handleDateChange('componentsTakenOutDate', date)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="componentsTakenOutSerialNo">Serial No. of Components Taken Out</Label>
                      <Input 
                        id="componentsTakenOutSerialNo" 
                        value={jobCard.componentsTakenOutSerialNo} 
                        onChange={e => handleChange('componentsTakenOutSerialNo', e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="componentsTakenInDate">Components Taken In Date</Label>
                      <DatePicker 
                        date={jobCard.componentsTakenInDate ? new Date(jobCard.componentsTakenInDate) : undefined}
                        setDate={(date) => handleDateChange('componentsTakenInDate', date)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="componentsTakenInSerialNo">Serial No. of Components Taken In</Label>
                      <Input 
                        id="componentsTakenInSerialNo" 
                        value={jobCard.componentsTakenInSerialNo} 
                        onChange={e => handleChange('componentsTakenInSerialNo', e.target.value)} 
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="noOfMen">Number of Men</Label>
                  <Input 
                    id="noOfMen" 
                    type="number"
                    min="1"
                    value={jobCard.noOfMen} 
                    onChange={e => handleChange('noOfMen', parseInt(e.target.value))} 
                  />
                </div>
                <div>
                  <Label htmlFor="durationOfRepair">Duration of Repair (hr)</Label>
                  <Input 
                    id="durationOfRepair" 
                    type="number"
                    min="0"
                    step="0.5"
                    value={jobCard.durationOfRepair} 
                    onChange={e => handleChange('durationOfRepair', parseFloat(e.target.value))} 
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="rootCause">Root Cause</Label>
                <Textarea 
                  id="rootCause" 
                  value={jobCard.rootCause} 
                  onChange={e => handleChange('rootCause', e.target.value)} 
                  rows={3}
                  placeholder="Identify the root cause of the failure..."
                />
              </div>
            </TabsContent>

            {/* Closure Tab */}
            <TabsContent value="closure" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobCardCloseDate">Job Card Close Date</Label>
                  <DatePicker 
                    date={jobCard.jobCardCloseDate ? new Date(jobCard.jobCardCloseDate) : undefined}
                    setDate={(date) => handleDateChange('jobCardCloseDate', date)}
                  />
                </div>
                <TimeInput 
                  id="jobCardCloseTime" 
                  label="Job Card Close Time" 
                  value={jobCard.jobCardCloseTime || ''} 
                  onChange={(value) => handleChange('jobCardCloseTime', value)}
                />
              </div>

              <div>
                <Label htmlFor="nameOfActionEndorsement">Name of Action Endorsement</Label>
                <Select 
                  value={jobCard.nameOfActionEndorsement || ''} 
                  onValueChange={(value) => handleChange('nameOfActionEndorsement', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select name" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_MEMBERS.filter(staff => staff.role === 'Engineer' || staff.role === 'Depot Incharge').map(staff => (
                      <SelectItem key={staff.id} value={staff.name}>
                        {staff.name} ({staff.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfActionEndorsement">Date of Action Endorsement</Label>
                <DatePicker 
                  date={jobCard.dateOfActionEndorsement ? new Date(jobCard.dateOfActionEndorsement) : undefined}
                  setDate={(date) => handleDateChange('dateOfActionEndorsement', date)}
                />
              </div>

              <div>
                <Label htmlFor="failureCategory">Failure Category</Label>
                <Select 
                  value={jobCard.failureCategory || ''} 
                  onValueChange={(value) => handleChange('failureCategory', value as JobCard['failureCategory'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select failure category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="System Design">1. System Design (HECP/SECP)</SelectItem>
                    <SelectItem value="Software Error">2. Software Error</SelectItem>
                    <SelectItem value="Equipment/component failure--Itself">3. Equipment/component failure--Itself</SelectItem>
                    <SelectItem value="Equipment/component failure--NFF">4. Equipment/component failure--NFF (replaced as suspected)</SelectItem>
                    <SelectItem value="Poor Workmanship">5. Poor Workmanship</SelectItem>
                    <SelectItem value="Loose Wire and Connector">6. Loose Wire and Connector</SelectItem>
                    <SelectItem value="NFF(MCB tripped)">7. NFF(MCB tripped)</SelectItem>
                    <SelectItem value="NFF(System hang-up)">8. NFF(System hang-up)</SelectItem>
                    <SelectItem value="NFF(Others)">9. NFF(Others)</SelectItem>
                    <SelectItem value="Incorrect Operation & Main't of equip">10. Incorrect Operation & Main't of equip</SelectItem>
                    <SelectItem value="Failure due to external factor">11. Failure due to external factor</SelectItem>
                    <SelectItem value="Others(Service Check & Unschduled Maintenance)">12. Others(Service Check & Unschduled Maintenance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Job Card Status</Label>
                <Select 
                  value={jobCard.status} 
                  onValueChange={(value) => handleChange('status', value as 'open' | 'in_progress' | 'completed' | 'closed')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/job-cards')}
          >
            Cancel
          </Button>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                // Go to previous tab or go to job cards page if on first tab
                if (activeTab === 'basic-info') {
                  navigate('/job-cards');
                } else if (activeTab === 'failure-info') {
                  setActiveTab('basic-info');
                } else if (activeTab === 'technical-details') {
                  setActiveTab('failure-info');
                } else if (activeTab === 'work-info') {
                  setActiveTab('technical-details');
                } else if (activeTab === 'closure') {
                  setActiveTab('work-info');
                }
              }}
            >
              Previous
            </Button>
            {activeTab !== 'closure' ? (
              <Button 
                type="button"
                onClick={() => {
                  // Go to next tab
                  if (activeTab === 'basic-info') {
                    setActiveTab('failure-info');
                  } else if (activeTab === 'failure-info') {
                    setActiveTab('technical-details');
                  } else if (activeTab === 'technical-details') {
                    setActiveTab('work-info');
                  } else if (activeTab === 'work-info') {
                    setActiveTab('closure');
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button type="submit">
                {isEditing ? 'Update Job Card' : 'Create Job Card'}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};
