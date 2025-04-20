
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface TaskCarSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const carIds = ['DMC1', 'TC1', 'MC1', 'MC2', 'TC2', 'DMC2'];

export const TaskCarSelect = ({ value, onValueChange }: TaskCarSelectProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="carId" className="text-right">
        Car ID
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id="carId" className="col-span-3">
          <SelectValue placeholder="Select car" />
        </SelectTrigger>
        <SelectContent>
          {carIds.map(car => (
            <SelectItem key={car} value={car}>
              {car}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
