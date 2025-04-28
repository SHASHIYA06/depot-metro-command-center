
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Save, X, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NCRReport, NCR_STATUS_OPTIONS, RESPONSIBILITY_OPTIONS, SOURCE_OPTIONS, MODIFIED_OPTIONS } from '@/types/ncr';
import { TRAIN_NUMBERS, CAR_NUMBERS } from '@/types/job-card';
import { STAFF_MEMBERS } from '@/types/job-card';

interface NCRFormProps {
  initialNCR?: NCRReport;
  onSubmit: (data: NCRReport) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const NCRForm: React.FC<NCRFormProps> = ({ 
  initialNCR, 
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [dateOfNcr, setDateOfNcr] = useState<Date | undefined>(
    initialNCR?.dateOfNcr ? new Date(initialNCR.dateOfNcr) : new Date()
  );
  
  const [dateOfDetection, setDateOfDetection] = useState<Date | undefined>(
    initialNCR?.dateOfDetection ? new Date(initialNCR.dateOfDetection) : new Date()
  );
  
  const [dateOfRepairedReplaced, setDateOfRepairedReplaced] = useState<Date | undefined>(
    initialNCR?.dateOfRepairedReplaced ? new Date(initialNCR.dateOfRepairedReplaced) : undefined
  );
  
  const [dateOfInvestigationReceived, setDateOfInvestigationReceived] = useState<Date | undefined>(
    initialNCR?.dateOfInvestigationReceived ? new Date(initialNCR.dateOfInvestigationReceived) : undefined
  );
  
  const [dateOfNcrClosure, setDateOfNcrClosure] = useState<Date | undefined>(
    initialNCR?.dateOfNcrClosure ? new Date(initialNCR.dateOfNcrClosure) : undefined
  );

  const { register, handleSubmit, formState, setValue, watch } = useForm<NCRReport>({
    defaultValues: initialNCR || {
      ncrReportNo: `NCR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      status: 'Open',
      source: 'Internal',
      modifiedUnmodified: 'Unmodified',
      quantity: 1,
      ncrClosedByDocument: false
    }
  });

  const { errors } = formState;
  const watchStatus = watch("status");
  const watchNcrClosedByDocument = watch("ncrClosedByDocument");

  const handleFormSubmit = (data: NCRReport) => {
    const submissionData = {
      ...data,
      dateOfNcr: dateOfNcr ? format(dateOfNcr, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      dateOfDetection: dateOfDetection ? format(dateOfDetection, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      dateOfRepairedReplaced: dateOfRepairedReplaced ? format(dateOfRepairedReplaced, 'yyyy-MM-dd') : undefined,
      dateOfInvestigationReceived: dateOfInvestigationReceived ? format(dateOfInvestigationReceived, 'yyyy-MM-dd') : undefined,
      dateOfNcrClosure: dateOfNcrClosure ? format(dateOfNcrClosure, 'yyyy-MM-dd') : undefined,
      createdAt: initialNCR?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: initialNCR?.createdBy || "current-user-id", // Replace with actual user ID
      id: initialNCR?.id || `ncr-${Date.now()}`
    };
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the basic details for the NCR report.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NCR Report Number */}
          <div className="space-y-2">
            <Label htmlFor="ncrReportNo">NCR Report No. <span className="text-red-500">*</span></Label>
            <Input 
              id="ncrReportNo"
              {...register("ncrReportNo", { required: "NCR Report No. is required" })}
              placeholder="e.g., NCR-2023-0001"
              className={errors.ncrReportNo ? "border-red-500" : ""}
            />
            {errors.ncrReportNo && <p className="text-xs text-red-500">{errors.ncrReportNo.message}</p>}
          </div>

          {/* Date of NCR */}
          <div className="space-y-2">
            <Label>Date of NCR <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateOfNcr && "text-muted-foreground",
                    errors.dateOfNcr && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfNcr ? format(dateOfNcr, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfNcr}
                  onSelect={setDateOfNcr}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date of Detection */}
          <div className="space-y-2">
            <Label>Date of Detection <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateOfDetection && "text-muted-foreground",
                    errors.dateOfDetection && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfDetection ? format(dateOfDetection, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfDetection}
                  onSelect={setDateOfDetection}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Item Description */}
          <div className="space-y-2">
            <Label htmlFor="itemDescription">Item Description <span className="text-red-500">*</span></Label>
            <Input 
              id="itemDescription"
              {...register("itemDescription", { required: "Item Description is required" })}
              placeholder="Describe the item"
              className={errors.itemDescription ? "border-red-500" : ""}
            />
            {errors.itemDescription && <p className="text-xs text-red-500">{errors.itemDescription.message}</p>}
          </div>

          {/* Part Number */}
          <div className="space-y-2">
            <Label htmlFor="partNumber">Part Number <span className="text-red-500">*</span></Label>
            <Input 
              id="partNumber"
              {...register("partNumber", { required: "Part Number is required" })}
              placeholder="Enter part number"
              className={errors.partNumber ? "border-red-500" : ""}
            />
            {errors.partNumber && <p className="text-xs text-red-500">{errors.partNumber.message}</p>}
          </div>

          {/* Modified/Unmodified */}
          <div className="space-y-2">
            <Label>Modified/Unmodified <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialNCR?.modifiedUnmodified || "Unmodified"}
              onValueChange={(value) => setValue("modifiedUnmodified", value as "Modified" | "Unmodified")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {MODIFIED_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fault Mode Identifier (FMI) */}
          <div className="space-y-2">
            <Label htmlFor="fmi">FMI</Label>
            <Input 
              id="fmi"
              {...register("fmi")}
              placeholder="Fault Mode Identifier (if applicable)"
            />
          </div>

          {/* Faulty Serial Number */}
          <div className="space-y-2">
            <Label htmlFor="faultySerialNo">Faulty Serial No. <span className="text-red-500">*</span></Label>
            <Input 
              id="faultySerialNo"
              {...register("faultySerialNo", { required: "Faulty Serial No. is required" })}
              placeholder="Enter faulty serial number"
              className={errors.faultySerialNo ? "border-red-500" : ""}
            />
            {errors.faultySerialNo && <p className="text-xs text-red-500">{errors.faultySerialNo.message}</p>}
          </div>

          {/* Healthy Serial Number */}
          <div className="space-y-2">
            <Label htmlFor="healthySerialNo">Healthy Serial No.</Label>
            <Input 
              id="healthySerialNo"
              {...register("healthySerialNo")}
              placeholder="Enter healthy serial number (if applicable)"
            />
          </div>

          {/* Issued By */}
          <div className="space-y-2">
            <Label>Issued By <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialNCR?.issuedBy}
              onValueChange={(value) => setValue("issuedBy", value)}
            >
              <SelectTrigger className={errors.issuedBy ? "border-red-500" : ""}>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_MEMBERS.map(staff => (
                  <SelectItem key={staff.id} value={staff.name}>{staff.name} ({staff.role})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.issuedBy && <p className="text-xs text-red-500">{errors.issuedBy.message}</p>}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
            <Input 
              id="quantity"
              type="number"
              {...register("quantity", { 
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" }
              })}
              placeholder="Enter quantity"
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && <p className="text-xs text-red-500">{errors.quantity.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>NCR Description</CardTitle>
          <CardDescription>Provide detailed description of the non-conformance.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* NCR Description */}
          <div className="space-y-2">
            <Label htmlFor="ncrDescription">NCR Description <span className="text-red-500">*</span></Label>
            <Textarea 
              id="ncrDescription"
              {...register("ncrDescription", { required: "NCR Description is required" })}
              placeholder="Provide a detailed description of the non-conformance report"
              className={cn("min-h-32", errors.ncrDescription ? "border-red-500" : "")}
            />
            {errors.ncrDescription && <p className="text-xs text-red-500">{errors.ncrDescription.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Train Information</CardTitle>
          <CardDescription>Provide details about the train and car involved.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Train Number */}
          <div className="space-y-2">
            <Label>Train No. <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialNCR?.trainNo}
              onValueChange={(value) => setValue("trainNo", value)}
            >
              <SelectTrigger className={errors.trainNo ? "border-red-500" : ""}>
                <SelectValue placeholder="Select train number" />
              </SelectTrigger>
              <SelectContent>
                {TRAIN_NUMBERS.map(trainNo => (
                  <SelectItem key={trainNo} value={trainNo}>{trainNo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.trainNo && <p className="text-xs text-red-500">{errors.trainNo.message}</p>}
          </div>

          {/* Car Number */}
          <div className="space-y-2">
            <Label>Car No. <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialNCR?.carNo}
              onValueChange={(value) => setValue("carNo", value)}
            >
              <SelectTrigger className={errors.carNo ? "border-red-500" : ""}>
                <SelectValue placeholder="Select car number" />
              </SelectTrigger>
              <SelectContent>
                {CAR_NUMBERS.map(carNo => (
                  <SelectItem key={carNo} value={carNo}>{carNo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.carNo && <p className="text-xs text-red-500">{errors.carNo.message}</p>}
          </div>

          {/* Sub-System */}
          <div className="space-y-2">
            <Label htmlFor="subSystem">Sub-System <span className="text-red-500">*</span></Label>
            <Input 
              id="subSystem"
              {...register("subSystem", { required: "Sub-System is required" })}
              placeholder="Enter sub-system"
              className={errors.subSystem ? "border-red-500" : ""}
            />
            {errors.subSystem && <p className="text-xs text-red-500">{errors.subSystem.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Information</CardTitle>
          <CardDescription>Provide details about the NCR status and responsibility.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Responsibility */}
          <div className="space-y-2">
            <Label>Responsibility <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialNCR?.responsibility}
              onValueChange={(value) => setValue("responsibility", value as "Vendor" | "BEML" | "Others")}
            >
              <SelectTrigger className={errors.responsibility ? "border-red-500" : ""}>
                <SelectValue placeholder="Select responsibility" />
              </SelectTrigger>
              <SelectContent>
                {RESPONSIBILITY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.responsibility && <p className="text-xs text-red-500">{errors.responsibility.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialNCR?.status || "Open"}
              onValueChange={(value) => setValue("status", value as "Open" | "Closed" | "Investigation")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {NCR_STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div className="space-y-2">
            <Label>Source <span className="text-red-500">*</span></Label>
            <Select 
              defaultValue={initialNCR?.source || "Internal"}
              onValueChange={(value) => setValue("source", value as "Internal" | "External")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Repair/Replacement Information</CardTitle>
          <CardDescription>Provide details about repair or replacement if applicable.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Repaired/Replaced */}
          <div className="space-y-2">
            <Label htmlFor="itemRepairedReplaced">Item Repaired/Replaced</Label>
            <Input 
              id="itemRepairedReplaced"
              {...register("itemRepairedReplaced")}
              placeholder="Enter repaired/replaced item details"
            />
          </div>

          {/* Item Replaced Details */}
          <div className="space-y-2">
            <Label htmlFor="itemReplacedDetails">Item Replaced Details</Label>
            <Input 
              id="itemReplacedDetails"
              {...register("itemReplacedDetails")}
              placeholder="Enter details of replaced item if any"
            />
          </div>

          {/* Date of Repaired/Replaced */}
          <div className="space-y-2">
            <Label>Date of Repaired/Replaced</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateOfRepairedReplaced && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfRepairedReplaced ? format(dateOfRepairedReplaced, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfRepairedReplaced}
                  onSelect={setDateOfRepairedReplaced}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date of Investigation Received */}
          <div className="space-y-2">
            <Label>Date of Investigation Report Received</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateOfInvestigationReceived && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateOfInvestigationReceived ? format(dateOfInvestigationReceived, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateOfInvestigationReceived}
                  onSelect={setDateOfInvestigationReceived}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Closure Information</CardTitle>
          <CardDescription>Provide details about NCR closure if applicable.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* NCR Closed By Document */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ncrClosedByDocument" 
              checked={watchNcrClosedByDocument}
              onCheckedChange={(checked) => {
                setValue("ncrClosedByDocument", checked === true);
              }}
            />
            <Label htmlFor="ncrClosedByDocument">NCR Closed By Document</Label>
          </div>

          {watchNcrClosedByDocument && (
            <div className="space-y-2">
              <Label>NCR Closure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateOfNcrClosure && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfNcrClosure ? format(dateOfNcrClosure, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateOfNcrClosure}
                    onSelect={setDateOfNcrClosure}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Gate Pass Number */}
          <div className="space-y-2">
            <Label htmlFor="gatePassNumber">Gate Pass No.</Label>
            <Input 
              id="gatePassNumber"
              {...register("gatePassNumber")}
              placeholder="Enter gate pass number if applicable"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea 
              id="remarks"
              {...register("remarks")}
              placeholder="Additional remarks or notes"
              className="min-h-20"
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
          <span>{isEditing ? 'Update' : 'Save'} NCR Report</span>
        </Button>
      </div>
    </form>
  );
};
