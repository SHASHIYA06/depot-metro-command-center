
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TRAIN_NUMBERS, CAR_NUMBERS, SYSTEM_OPTIONS } from '@/types/job-card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

interface MaintenanceScheduleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const MaintenanceScheduleForm: React.FC<MaintenanceScheduleFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const { toast } = useToast();
  const { user, getUsersByRole } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduleType: '',
    maintenanceCategory: '',
    trainNo: '',
    carNo: '',
    system: '',
    subSystem: '',
    equipment: '',
    component: '',
    parts: '',
    startDate: new Date(),
    endDate: new Date(),
    assignedTo: [],
    priority: 'medium',
    estimatedHours: '',
    notes: '',
    workType: '',
    specialRequirements: '',
    toolsRequired: '',
    materialsRequired: '',
    safetyPrecautions: '',
    workLocation: '',
    prerequisites: '',
    expectedOutcome: '',
    qualityChecks: '',
    documentation: '',
    riskAssessment: '',
    environmentalImpact: '',
    costEstimate: '',
    resourceRequirements: '',
    criticalityLevel: '',
    workInstruction: '',
    technicianSkillLevel: '',
    backupPlan: '',
    successCriteria: ''
  });

  const engineersAndTechnicians = [
    ...(getUsersByRole(UserRole.ENGINEER) || []),
    ...(getUsersByRole(UserRole.TECHNICIAN) || [])
  ];

  const selectedSystem = SYSTEM_OPTIONS.find(s => s.name === formData.system);
  const selectedSubSystem = selectedSystem?.subSystems.find(ss => ss.name === formData.subSystem);
  const selectedEquipment = selectedSubSystem?.equipments.find(e => e.name === formData.equipment);

  const maintenanceTypes = [
    'Preventive Maintenance (PM)',
    'Corrective Maintenance (CM)',
    'Predictive Maintenance',
    'Condition Based Maintenance',
    'Scheduled Maintenance',
    'Unscheduled Maintenance',
    'Emergency Maintenance',
    'Breakdown Maintenance',
    'Routine Inspection',
    'Overhaul',
    'Service Check A1',
    'Service Check B1',
    'Service Check B4',
    'Service Check B8',
    'Service Check IOH'
  ];

  const workLocations = [
    'Depot Yard',
    'Maintenance Bay 1',
    'Maintenance Bay 2',
    'Maintenance Bay 3',
    'Heavy Maintenance Shop',
    'Light Maintenance Shop',
    'Wheel Shop',
    'Brake Shop',
    'Electrical Shop',
    'HVAC Shop',
    'Door Shop',
    'Pantograph Shop',
    'Testing Track',
    'Washing Plant',
    'Lifting Jack Area',
    'Component Workshop'
  ];

  const criticalityLevels = [
    'Critical - Safety Impact',
    'High - Service Impact',
    'Medium - Performance Impact',
    'Low - Comfort Impact',
    'Routine - Preventive'
  ];

  const skillLevels = [
    'Level 1 - Basic Technician',
    'Level 2 - Skilled Technician', 
    'Level 3 - Senior Technician',
    'Level 4 - Specialist',
    'Level 5 - Expert/Engineer'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.scheduleType || !formData.trainNo) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields (Title, Schedule Type, Train Number)',
        variant: 'destructive'
      });
      return;
    }

    const scheduleData = {
      ...formData,
      id: `MS${Date.now()}`,
      status: 'scheduled',
      createdBy: user?.id,
      createdAt: new Date().toISOString(),
      scheduleId: `SCH-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      estimatedDuration: formData.estimatedHours ? `${formData.estimatedHours} hours` : '',
      assignedToList: formData.assignedTo,
      workOrder: `WO-${Date.now()}`,
      approvalRequired: ['Critical - Safety Impact', 'High - Service Impact'].includes(formData.criticalityLevel),
      budgetCode: formData.costEstimate ? `BUD-${Date.now()}` : '',
      complianceRequirements: formData.scheduleType.includes('Service Check') ? 'Mandatory as per schedule' : 'As per maintenance manual'
    };

    onSubmit(scheduleData);
    
    toast({
      title: 'Schedule Created',
      description: `Maintenance schedule "${formData.title}" has been created successfully.`
    });
  };

  const handleAssigneeChange = (staffId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: checked 
        ? [...prev.assignedTo, staffId]
        : prev.assignedTo.filter(id => id !== staffId)
    }));
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Create Comprehensive Maintenance Schedule</CardTitle>
        <CardDescription>Schedule detailed maintenance activities with complete specifications</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Schedule Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter comprehensive schedule title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduleType">Maintenance Type *</Label>
                <Select value={formData.scheduleType} onValueChange={(value) => setFormData({ ...formData, scheduleType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                  <SelectContent>
                    {maintenanceTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Train and Car Selection */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Train and Car Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainNo">Train Number *</Label>
                <Select value={formData.trainNo} onValueChange={(value) => setFormData({ ...formData, trainNo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select train number" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAIN_NUMBERS.map((train) => (
                      <SelectItem key={train} value={train}>{train}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carNo">Car Number</Label>
                <Select value={formData.carNo} onValueChange={(value) => setFormData({ ...formData, carNo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select car number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_CARS">All Cars</SelectItem>
                    {CAR_NUMBERS.map((car) => (
                      <SelectItem key={car} value={car}>{car}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* System Hierarchy */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">System Hierarchy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="system">System</Label>
                <Select value={formData.system} onValueChange={(value) => setFormData({ ...formData, system: value, subSystem: '', equipment: '', component: '', parts: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select system" />
                  </SelectTrigger>
                  <SelectContent>
                    {SYSTEM_OPTIONS.map((system) => (
                      <SelectItem key={system.id} value={system.name}>{system.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subSystem">Sub-System</Label>
                <Select value={formData.subSystem} onValueChange={(value) => setFormData({ ...formData, subSystem: value, equipment: '', component: '', parts: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-system" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSystem?.subSystems.map((subSystem) => (
                      <SelectItem key={subSystem.id} value={subSystem.name}>{subSystem.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Select value={formData.equipment} onValueChange={(value) => setFormData({ ...formData, equipment: value, component: '', parts: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedSubSystem?.equipments.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.name}>{equipment.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="component">Component</Label>
                <Select value={formData.component} onValueChange={(value) => setFormData({ ...formData, component: value, parts: '' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select component" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEquipment?.components.map((component) => (
                      <SelectItem key={component.id} value={component.name}>{component.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="parts">Parts/Sub-components</Label>
                <Select value={formData.parts} onValueChange={(value) => setFormData({ ...formData, parts: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parts" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedEquipment?.components.find(c => c.name === formData.component)?.parts.map((part) => (
                      <SelectItem key={part.id} value={part.name}>{part.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Schedule Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  date={formData.startDate}
                  setDate={(date) => setFormData({ ...formData, startDate: date || new Date() })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker
                  date={formData.endDate}
                  setDate={(date) => setFormData({ ...formData, endDate: date || new Date() })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  placeholder="Enter estimated hours"
                />
              </div>
            </div>
          </div>

          {/* Work Assignment */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Work Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criticalityLevel">Criticality Level</Label>
                <Select value={formData.criticalityLevel} onValueChange={(value) => setFormData({ ...formData, criticalityLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select criticality level" />
                  </SelectTrigger>
                  <SelectContent>
                    {criticalityLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workLocation">Work Location</Label>
                <Select value={formData.workLocation} onValueChange={(value) => setFormData({ ...formData, workLocation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select work location" />
                  </SelectTrigger>
                  <SelectContent>
                    {workLocations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicianSkillLevel">Required Skill Level</Label>
                <Select value={formData.technicianSkillLevel} onValueChange={(value) => setFormData({ ...formData, technicianSkillLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillLevels.map((level) => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label>Assign To (Multiple Selection)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {engineersAndTechnicians.map((staff) => (
                  <div key={staff.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={staff.id}
                      checked={formData.assignedTo.includes(staff.id)}
                      onCheckedChange={(checked) => handleAssigneeChange(staff.id, checked as boolean)}
                    />
                    <Label htmlFor={staff.id} className="text-sm">{staff.name}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Specifications */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Detailed Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toolsRequired">Tools Required</Label>
                <Textarea
                  id="toolsRequired"
                  value={formData.toolsRequired}
                  onChange={(e) => setFormData({ ...formData, toolsRequired: e.target.value })}
                  placeholder="List all tools and equipment needed"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materialsRequired">Materials Required</Label>
                <Textarea
                  id="materialsRequired"
                  value={formData.materialsRequired}
                  onChange={(e) => setFormData({ ...formData, materialsRequired: e.target.value })}
                  placeholder="List all materials and spare parts"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="safetyPrecautions">Safety Precautions</Label>
                <Textarea
                  id="safetyPrecautions"
                  value={formData.safetyPrecautions}
                  onChange={(e) => setFormData({ ...formData, safetyPrecautions: e.target.value })}
                  placeholder="Safety measures and precautions"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  placeholder="Pre-work requirements and conditions"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Work Instructions and Quality */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Work Instructions & Quality</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="workInstruction">Detailed Work Instructions</Label>
                <Textarea
                  id="workInstruction"
                  value={formData.workInstruction}
                  onChange={(e) => setFormData({ ...formData, workInstruction: e.target.value })}
                  placeholder="Step-by-step work instructions and procedures"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualityChecks">Quality Checks & Testing</Label>
                <Textarea
                  id="qualityChecks"
                  value={formData.qualityChecks}
                  onChange={(e) => setFormData({ ...formData, qualityChecks: e.target.value })}
                  placeholder="Quality control checks and testing procedures"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="successCriteria">Success Criteria</Label>
                <Textarea
                  id="successCriteria"
                  value={formData.successCriteria}
                  onChange={(e) => setFormData({ ...formData, successCriteria: e.target.value })}
                  placeholder="Define success criteria and acceptance parameters"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Risk and Cost */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-4">Risk Assessment & Cost</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="riskAssessment">Risk Assessment</Label>
                <Textarea
                  id="riskAssessment"
                  value={formData.riskAssessment}
                  onChange={(e) => setFormData({ ...formData, riskAssessment: e.target.value })}
                  placeholder="Identify and assess potential risks"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costEstimate">Cost Estimate</Label>
                <Input
                  id="costEstimate"
                  value={formData.costEstimate}
                  onChange={(e) => setFormData({ ...formData, costEstimate: e.target.value })}
                  placeholder="Estimated cost for materials and labor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupPlan">Backup Plan</Label>
                <Textarea
                  id="backupPlan"
                  value={formData.backupPlan}
                  onChange={(e) => setFormData({ ...formData, backupPlan: e.target.value })}
                  placeholder="Alternative approaches if primary plan fails"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environmentalImpact">Environmental Impact</Label>
                <Textarea
                  id="environmentalImpact"
                  value={formData.environmentalImpact}
                  onChange={(e) => setFormData({ ...formData, environmentalImpact: e.target.value })}
                  placeholder="Environmental considerations and waste management"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Final Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Comprehensive maintenance description and objectives"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional important information"
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Create Comprehensive Schedule
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
