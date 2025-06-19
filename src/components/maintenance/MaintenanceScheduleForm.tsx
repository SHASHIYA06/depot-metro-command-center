
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
    trainNo: '',
    carNo: '',
    system: '',
    subSystem: '',
    equipment: '',
    component: '',
    startDate: new Date(),
    endDate: new Date(),
    assignedTo: '',
    priority: 'medium',
    estimatedHours: '',
    notes: ''
  });

  const engineersAndTechnicians = [
    ...(getUsersByRole(UserRole.ENGINEER) || []),
    ...(getUsersByRole(UserRole.TECHNICIAN) || [])
  ];

  const selectedSystem = SYSTEM_OPTIONS.find(s => s.name === formData.system);
  const selectedSubSystem = selectedSystem?.subSystems.find(ss => ss.name === formData.subSystem);
  const selectedEquipment = selectedSubSystem?.equipments.find(e => e.name === formData.equipment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.scheduleType || !formData.trainNo) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    const scheduleData = {
      ...formData,
      id: `MS${Date.now()}`,
      status: 'scheduled',
      createdBy: user?.id,
      createdAt: new Date().toISOString()
    };

    onSubmit(scheduleData);
    
    toast({
      title: 'Schedule Created',
      description: `Maintenance schedule ${formData.title} has been created successfully.`
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Maintenance Schedule</CardTitle>
        <CardDescription>Schedule maintenance activities for trains and equipment</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Schedule Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter schedule title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduleType">Schedule Type *</Label>
              <Select value={formData.scheduleType} onValueChange={(value) => setFormData({ ...formData, scheduleType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                  <SelectItem value="corrective">Corrective Maintenance</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="overhaul">Overhaul</SelectItem>
                  <SelectItem value="service_check">Service Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                  <SelectItem value="all">All Cars</SelectItem>
                  {CAR_NUMBERS.map((car) => (
                    <SelectItem key={car} value={car}>{car}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="system">System</Label>
              <Select value={formData.system} onValueChange={(value) => setFormData({ ...formData, system: value, subSystem: '', equipment: '', component: '' })}>
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
              <Select value={formData.subSystem} onValueChange={(value) => setFormData({ ...formData, subSystem: value, equipment: '', component: '' })}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment</Label>
              <Select value={formData.equipment} onValueChange={(value) => setFormData({ ...formData, equipment: value, component: '' })}>
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
              <Select value={formData.component} onValueChange={(value) => setFormData({ ...formData, component: value })}>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {engineersAndTechnicians.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter maintenance description and requirements"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter additional notes"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Create Schedule
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
