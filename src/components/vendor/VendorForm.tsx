
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Save, X, Plus, Minus } from 'lucide-react';
import { Vendor, CONTRACT_STATUS_OPTIONS } from '@/types/vendor';
import { SYSTEM_OPTIONS } from '@/types/job-card';

interface VendorFormProps {
  initialVendor?: Vendor;
  onSubmit: (data: Vendor) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const VendorForm: React.FC<VendorFormProps> = ({ 
  initialVendor, 
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const { register, handleSubmit, formState, setValue, watch } = useForm<Vendor>({
    defaultValues: initialVendor || {
      vendorCode: `VEN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      contractStatus: 'Active',
      relatedSystemsSubsystems: []
    }
  });

  const { errors } = formState;
  const watchRelatedSystems = watch("relatedSystemsSubsystems") || [];

  const handleSystemChange = (system: string) => {
    const currentSystems = [...watchRelatedSystems];
    const index = currentSystems.indexOf(system);
    
    if (index === -1) {
      currentSystems.push(system);
    } else {
      currentSystems.splice(index, 1);
    }
    
    setValue("relatedSystemsSubsystems", currentSystems);
  };

  const handleFormSubmit = (data: Vendor) => {
    const submissionData = {
      ...data,
      createdAt: initialVendor?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: initialVendor?.createdBy || "current-user-id", // Replace with actual user ID
      id: initialVendor?.id || `vendor-${Date.now()}`
    };
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the basic details for the vendor.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vendor Name */}
          <div className="space-y-2">
            <Label htmlFor="vendorName">Vendor Name <span className="text-red-500">*</span></Label>
            <Input 
              id="vendorName"
              {...register("vendorName", { required: "Vendor name is required" })}
              placeholder="Enter vendor name"
              className={errors.vendorName ? "border-red-500" : ""}
            />
            {errors.vendorName && <p className="text-xs text-red-500">{errors.vendorName.message}</p>}
          </div>

          {/* Vendor Code */}
          <div className="space-y-2">
            <Label htmlFor="vendorCode">Vendor Code <span className="text-red-500">*</span></Label>
            <Input 
              id="vendorCode"
              {...register("vendorCode", { required: "Vendor code is required" })}
              placeholder="e.g., VEN-2023-0001"
              className={errors.vendorCode ? "border-red-500" : ""}
            />
            {errors.vendorCode && <p className="text-xs text-red-500">{errors.vendorCode.message}</p>}
          </div>

          {/* Contract Status */}
          <div className="space-y-2">
            <Label>Contract Status <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialVendor?.contractStatus || "Active"}
              onValueChange={(value) => setValue("contractStatus", value as "Active" | "Inactive")}
            >
              <SelectTrigger className={errors.contractStatus ? "border-red-500" : ""}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contractStatus && <p className="text-xs text-red-500">{errors.contractStatus.message}</p>}
          </div>

          {/* GST Number */}
          <div className="space-y-2">
            <Label htmlFor="gstNumber">GST Number <span className="text-red-500">*</span></Label>
            <Input 
              id="gstNumber"
              {...register("gstNumber", { required: "GST number is required" })}
              placeholder="Enter GST number"
              className={errors.gstNumber ? "border-red-500" : ""}
            />
            {errors.gstNumber && <p className="text-xs text-red-500">{errors.gstNumber.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Provide contact details for the vendor.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Person */}
          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person <span className="text-red-500">*</span></Label>
            <Input 
              id="contactPerson"
              {...register("contactPerson", { required: "Contact person is required" })}
              placeholder="Enter contact person name"
              className={errors.contactPerson ? "border-red-500" : ""}
            />
            {errors.contactPerson && <p className="text-xs text-red-500">{errors.contactPerson.message}</p>}
          </div>

          {/* Contact Number */}
          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number <span className="text-red-500">*</span></Label>
            <Input 
              id="contactNumber"
              {...register("contactNumber", { required: "Contact number is required" })}
              placeholder="Enter contact number"
              className={errors.contactNumber ? "border-red-500" : ""}
            />
            {errors.contactNumber && <p className="text-xs text-red-500">{errors.contactNumber.message}</p>}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address <span className="text-red-500">*</span></Label>
            <Input 
              id="emailAddress"
              {...register("emailAddress", { 
                required: "Email address is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="Enter email address"
              className={errors.emailAddress ? "border-red-500" : ""}
            />
            {errors.emailAddress && <p className="text-xs text-red-500">{errors.emailAddress.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Provide address details for the vendor.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
            <Textarea 
              id="address"
              {...register("address", { required: "Address is required" })}
              placeholder="Enter complete address"
              className={errors.address ? "border-red-500" : ""}
              rows={4}
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Systems</CardTitle>
          <CardDescription>Select the systems that this vendor is associated with.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SYSTEM_OPTIONS.map(system => (
              <div 
                key={system.id} 
                className={`p-4 border rounded-md cursor-pointer hover:bg-slate-50 transition-colors ${
                  watchRelatedSystems.includes(system.name) ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => handleSystemChange(system.name)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{system.name}</span>
                  {watchRelatedSystems.includes(system.name) ? (
                    <Minus className="h-4 w-4 text-primary" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {system.subSystems.map(sub => sub.name).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Provide additional details about the vendor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Specialization Area */}
          <div className="space-y-2">
            <Label htmlFor="specializationArea">Specialization Area</Label>
            <Input 
              id="specializationArea"
              {...register("specializationArea")}
              placeholder="Enter vendor's area of specialization"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea 
              id="remarks"
              {...register("remarks")}
              placeholder="Additional remarks or notes"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex gap-2 items-center">
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Button>
        )}
        <Button type="submit" className="flex gap-2 items-center ml-auto">
          <Save className="h-4 w-4" />
          <span>{isEditing ? 'Update' : 'Save'} Vendor</span>
        </Button>
      </div>
    </form>
  );
};
