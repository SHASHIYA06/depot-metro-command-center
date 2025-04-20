
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskPrioritySelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TaskPrioritySelect = ({ value, onValueChange }: TaskPrioritySelectProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="priority" className="text-right">
        Priority
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="priority" className="col-span-3">
          <SelectValue placeholder="Select priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
