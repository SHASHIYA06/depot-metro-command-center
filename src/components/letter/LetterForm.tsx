import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon, Save, X, Upload, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Letter, LETTER_TYPE_OPTIONS } from '@/types/letter';

interface LetterFormProps {
  initialLetter?: Letter;
  onSubmit: (data: Letter) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const LetterForm: React.FC<LetterFormProps> = ({ 
  initialLetter, 
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [letterDate, setLetterDate] = useState<Date | undefined>(
    initialLetter?.date ? new Date(initialLetter.date) : new Date()
  );
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { register, handleSubmit, formState, setValue, watch } = useForm<Letter>({
    defaultValues: initialLetter || {
      letterType: 'Incoming',
      letterNumber: `LTR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      attachments: []
    }
  });

  const { errors } = formState;
  const watchLetterType = watch("letterType");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (data: Letter) => {
    // In a real application, you would handle file uploads here
    // and store the file URLs or references in the attachments array
    // For now, we'll just store the file names
    
    const attachments = selectedFiles.map(file => file.name);
    
    const submissionData = {
      ...data,
      date: letterDate ? format(letterDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      attachments: [...(initialLetter?.attachments || []), ...attachments],
      createdAt: initialLetter?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: initialLetter?.createdBy || "current-user-id", // Replace with actual user ID
      id: initialLetter?.id || `letter-${Date.now()}`
    };
    
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Letter Information</CardTitle>
          <CardDescription>Enter the basic details for the letter.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Letter Type */}
          <div className="space-y-3">
            <Label>Letter Type <span className="text-red-500">*</span></Label>
            <RadioGroup 
              defaultValue={initialLetter?.letterType || "Incoming"} 
              onValueChange={(value) => setValue("letterType", value as "Incoming" | "Outgoing")}
              className="flex flex-col sm:flex-row gap-4"
            >
              {LETTER_TYPE_OPTIONS.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`letter-type-${option.value}`} />
                  <Label htmlFor={`letter-type-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Letter Number */}
            <div className="space-y-2">
              <Label htmlFor="letterNumber">Letter Number <span className="text-red-500">*</span></Label>
              <Input 
                id="letterNumber"
                {...register("letterNumber", { required: "Letter number is required" })}
                placeholder="e.g., LTR-2023-0001"
                className={errors.letterNumber ? "border-red-500" : ""}
              />
              {errors.letterNumber && <p className="text-xs text-red-500">{errors.letterNumber.message}</p>}
            </div>

            {/* Letter Date */}
            <div className="space-y-2">
              <Label>Letter Date <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !letterDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {letterDate ? format(letterDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={letterDate}
                    onSelect={setLetterDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
            <Input 
              id="subject"
              {...register("subject", { required: "Subject is required" })}
              placeholder="Enter letter subject"
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
          </div>

          {/* Issued By / Received From */}
          <div className="space-y-2">
            <Label htmlFor="issuedByOrReceivedFrom">
              {watchLetterType === 'Outgoing' ? 'Issued By' : 'Received From'} <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="issuedByOrReceivedFrom"
              {...register("issuedByOrReceivedFrom", { required: `${watchLetterType === 'Outgoing' ? 'Issued by' : 'Received from'} is required` })}
              placeholder={`Enter ${watchLetterType === 'Outgoing' ? 'issuer name' : 'sender name'}`}
              className={errors.issuedByOrReceivedFrom ? "border-red-500" : ""}
            />
            {errors.issuedByOrReceivedFrom && <p className="text-xs text-red-500">{errors.issuedByOrReceivedFrom.message}</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attachments</CardTitle>
          <CardDescription>Upload letter documents or related files.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="file-upload">Upload Files</Label>
            <div className="flex items-center">
              <Input 
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <Label 
                htmlFor="file-upload"
                className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-md flex items-center gap-2 text-sm"
              >
                <Upload className="h-4 w-4" />
                <span>Select Files</span>
              </Label>
              <span className="ml-4 text-sm text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, JPG, PNG
              </span>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files</Label>
              <div className="border rounded-md divide-y">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRemoveFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing Attachments */}
          {initialLetter?.attachments && initialLetter.attachments.length > 0 && (
            <div className="space-y-2">
              <Label>Existing Attachments</Label>
              <div className="border rounded-md divide-y">
                {initialLetter.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{attachment}</span>
                    </div>
                    {/* In a real app, you would implement a delete functionality */}
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
          <span>{isEditing ? 'Update' : 'Save'} Letter</span>
        </Button>
      </div>
    </form>
  );
};
