
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskCategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const taskCategories = [
  'Corrective Maintenance',
  'Preventive Maintenance',
  'Other Preventive Maintenance',
  'Breakdown Maintenance',
  'Condition Based Maintenance',
  'Scheduled Overhaul',
  'Emergency Repair',
  'System Upgrade',
  'Inspection',
  'Testing',
  'Software Update',
  'Hardware Replacement',
  'Cleaning',
  'Lubrication',
  'Calibration'
];

export const TaskCategorySelect = ({ value, onValueChange }: TaskCategorySelectProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="category" className="text-right">
        Category
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="category" className="col-span-3">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          {taskCategories.map(category => (
            <SelectItem 
              key={category} 
              value={category.toLowerCase().replace(/\s+/g, '_')}
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
