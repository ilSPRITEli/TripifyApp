"use client"

import { CalendarDays, ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    label?: string
    placeholder?: string
    value?: Date | undefined
    onChange?: (date: Date | undefined) => void
}

export function DatePicker( { label="label", placeholder, value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value)

  // Update internal state when value prop changes
  React.useEffect(() => {
    setInternalDate(value)
  }, [value])

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1 text-xs">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal py-4 h-fit bg-[#E6E6E6]"
          >
            <div className="flex items-center">
                <CalendarDays className="mr-2 inline h-4 w-4" />
                {internalDate ? internalDate.toLocaleDateString() : (placeholder || "Select date")}
            </div>
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="single"
            selected={internalDate}
            captionLayout="dropdown"
            onSelect={(date) => {
              setInternalDate(date)
              onChange?.(date)
              setOpen(false)
            }}
            disabled={(date) => date < new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
