
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TaskDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const TaskDatePicker = ({ value, onChange }: TaskDatePickerProps) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="due-date" className="text-right">
        Due Date
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "col-span-3 pl-3 text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            {value ? format(new Date(value), "yyyy-MM-dd") : <span>Pick a date</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => onChange(format(date!, 'yyyy-MM-dd'))}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
