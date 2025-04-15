
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Upload } from 'lucide-react';

// Define schema for the form
const commissioningSchema = z.object({
  trainSet: z.string().min(1, { message: "Train set is required" }),
  carNo: z.string().min(1, { message: "Car number(s) required" }),
  system: z.string().min(1, { message: "System is required" }),
  activity: z.string().min(1, { message: "Activity is required" }),
  status: z.enum(["Pending", "In Progress", "Completed"], { 
    required_error: "Status is required" 
  }),
  remarks: z.string().optional(),
});

// Props for the component
interface CommissioningFormProps {
  activity?: any; // The activity to edit (if any)
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

// Car options
const carOptions = [
  { id: 'DMC1', label: 'DMC1' },
  { id: 'TC1', label: 'TC1' },
  { id: 'MC1', label: 'MC1' },
  { id: 'MC2', label: 'MC2' },
  { id: 'TC2', label: 'TC2' },
  { id: 'DMC2', label: 'DMC2' },
  { id: 'All Cars', label: 'All Cars' },
];

export const CommissioningForm: React.FC<CommissioningFormProps> = ({ 
  activity,
  onSubmit,
  onCancel
}) => {
  const { user } = useAuth();
  const [selectedCars, setSelectedCars] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  
  // Initialize the form
  const form = useForm<z.infer<typeof commissioningSchema>>({
    resolver: zodResolver(commissioningSchema),
    defaultValues: {
      trainSet: activity?.trainSet || '',
      carNo: activity?.carNo || '',
      system: activity?.system || '',
      activity: activity?.activity || '',
      status: activity?.status || 'Pending',
      remarks: activity?.remarks || '',
    },
  });

  // When editing, set the selected cars and photo URLs
  useEffect(() => {
    if (activity) {
      if (activity.carNo) {
        const cars = activity.carNo.split(', ');
        setSelectedCars(cars);
      }
      
      if (activity.photoUrls && activity.photoUrls.length > 0) {
        setPhotoUrls(activity.photoUrls);
      }
    }
  }, [activity]);

  // When cars are selected/deselected, update the carNo form field
  useEffect(() => {
    form.setValue('carNo', selectedCars.join(', '));
  }, [selectedCars, form]);

  const handleCarSelection = (carId: string, checked: boolean) => {
    if (carId === 'All Cars' && checked) {
      // If "All Cars" is checked, select only it
      setSelectedCars(['All Cars']);
    } else if (checked) {
      // If any other car is checked while "All Cars" is selected, unselect "All Cars"
      if (selectedCars.includes('All Cars')) {
        setSelectedCars([carId]);
      } else {
        setSelectedCars(prev => [...prev, carId]);
      }
    } else {
      setSelectedCars(prev => prev.filter(id => id !== carId));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPhotoFiles(prev => [...prev, ...newFiles]);
      
      // Create URLs for preview
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPhotoUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: z.infer<typeof commissioningSchema>) => {
    // Combine all data
    const formData = {
      ...values,
      officer: user?.name || 'Unknown',
      photoUrls: photoUrls,
      ...(activity ? { id: activity.id, date: activity.date } : {})
    };
    
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activity ? 'Edit Activity' : 'New Commissioning Activity'}</CardTitle>
        <CardDescription>
          {activity 
            ? 'Update the commissioning activity details' 
            : 'Record a new commissioning activity for the train sets'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="trainSet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Train Set</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select train set" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TS15">TS15</SelectItem>
                        <SelectItem value="TS16">TS16</SelectItem>
                        <SelectItem value="TS17">TS17</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Car Numbers</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {carOptions.map((car) => (
                    <div key={car.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`car-${car.id}`} 
                        checked={selectedCars.includes(car.id)}
                        onCheckedChange={(checked) => 
                          handleCarSelection(car.id, checked === true)
                        }
                      />
                      <label 
                        htmlFor={`car-${car.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {car.label}
                      </label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.carNo && (
                  <p className="text-sm font-medium text-destructive mt-2">
                    {form.formState.errors.carNo.message}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="system"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select system" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Train">Train</SelectItem>
                        <SelectItem value="Vehicle Structure & Interior Fitting">Vehicle Structure & Interior Fitting</SelectItem>
                        <SelectItem value="Bogie & Suspension">Bogie & Suspension</SelectItem>
                        <SelectItem value="Gangway & Coupler">Gangway & Coupler</SelectItem>
                        <SelectItem value="Traction System">Traction System</SelectItem>
                        <SelectItem value="Brake System">Brake System</SelectItem>
                        <SelectItem value="Auxiliary Electric System">Auxiliary Electric System</SelectItem>
                        <SelectItem value="Door System">Door System</SelectItem>
                        <SelectItem value="Air Conditioning System">Air Conditioning System</SelectItem>
                        <SelectItem value="Train Integrated Management System">Train Integrated Management System</SelectItem>
                        <SelectItem value="Communication System">Communication System</SelectItem>
                        <SelectItem value="Others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="activity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Unloading of all 6 cars">Unloading of all 6 cars</SelectItem>
                        <SelectItem value="Coupling all 6 cars">Coupling all 6 cars</SelectItem>
                        <SelectItem value="Visual inspection internal and external">Visual inspection internal and external</SelectItem>
                        <SelectItem value="Before on the train battery test">Before on the train battery test</SelectItem>
                        <SelectItem value="On the train with battery power">On the train with battery power</SelectItem>
                        <SelectItem value="Function check each car MCB and relay status">Function check each car MCB and relay status</SelectItem>
                        <SelectItem value="Stinger box inspection">Stinger box inspection</SelectItem>
                        <SelectItem value="Stinger connection">Stinger connection</SelectItem>
                        <SelectItem value="On the train with 750 v power supply">On the train with 750 v power supply</SelectItem>
                        <SelectItem value="Check all the current fault status">Check all the current fault status</SelectItem>
                        <SelectItem value="Wiring check">Wiring check</SelectItem>
                        <SelectItem value="VCC">VCC</SelectItem>
                        <SelectItem value="Brake elctronics and brake pneumatic check internal and witness">Brake elctronics and brake pneumatic check internal and witness</SelectItem>
                        <SelectItem value="TRCC inspection and installation">TRCC inspection and installation</SelectItem>
                        <SelectItem value="TRCC height adjustment">TRCC height adjustment</SelectItem>
                        <SelectItem value="Door inspection and door witness">Door inspection and door witness</SelectItem>
                        <SelectItem value="PAPIS testing internal and witness">PAPIS testing internal and witness</SelectItem>
                        <SelectItem value="CCTV testing internal and witness">CCTV testing internal and witness</SelectItem>
                        <SelectItem value="FDS system internal check and witness">FDS system internal check and witness</SelectItem>
                        <SelectItem value="Propulsion test dynamic">Propulsion test dynamic</SelectItem>
                        <SelectItem value="Brake electronics test dynamic">Brake electronics test dynamic</SelectItem>
                        <SelectItem value="Brake pneumatic test dynamic">Brake pneumatic test dynamic</SelectItem>
                        <SelectItem value="DI/DO Check internal">DI/DO Check internal</SelectItem>
                        <SelectItem value="VAC internal test and witness">VAC internal test and witness</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any remarks or notes"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Attach Photos</FormLabel>
              <div className="mt-2">
                <label 
                  htmlFor="photos" 
                  className="flex items-center justify-center border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <Upload className="h-6 w-6 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload photos</span>
                  <Input 
                    id="photos" 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              {photoUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Photo ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-md" 
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full h-6 w-6 flex items-center justify-center"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {activity ? 'Update Activity' : 'Submit Activity'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
