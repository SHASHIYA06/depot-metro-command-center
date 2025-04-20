
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskTrainSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const trainSets = Array.from({ length: 25 }, (_, i) => `TS${String(i + 1).padStart(2, '0')}`);

export const TaskTrainSelect = ({ value, onValueChange }: TaskTrainSelectProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="trainId" className="text-right">
        Train ID
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="trainId" className="col-span-3">
          <SelectValue placeholder="Select train" />
        </SelectTrigger>
        <SelectContent>
          {trainSets.map(train => (
            <SelectItem key={train} value={train}>
              {train}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
