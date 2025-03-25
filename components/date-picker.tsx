"use client"

import { Calendar } from "@/components/ui/calendar-rac"
import { DateInput } from "@/components/ui/datefield-rac"
import { CalendarDate } from "@internationalized/date"
import { CalendarIcon } from "lucide-react"
import { Button, DatePicker as AriaDatePicker, Dialog, Group, Label, Popover, I18nProvider } from "react-aria-components"

export default function DatePicker({ value, onChange }: { value: CalendarDate | null, onChange: (value: CalendarDate | null) => void }) {
  return (
    <I18nProvider locale="es-419">
      <AriaDatePicker
        value={value}
        onChange={(date) => onChange(date)}
        className="*:not-first:mt-2"
      >
        <Label className="sr-only">Date picker</Label>
        <div className="flex group">
          <Group className="w-full">
            <DateInput className="date-input pe-9 rounded-sm shadow-sm" />
          </Group>
          <Button className="text-muted-foreground group-[&:has(.react-aria-Input[value=''])]:hover:text-foreground z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-sm transition-[color,box-shadow] outline-none">
            <CalendarIcon size={16} className="opacity-50 group-[&:has(.react-aria-Input:not([value='']))]:opacity-100 transition-opacity" />
          </Button>
        </div>
        <Popover
          className="z-50 rounded-sm border border-border bg-background text-popover-foreground shadow-lg outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
          offset={4}
        >
          <Dialog className="max-h-[inherit] overflow-auto p-2">
            <Calendar />
          </Dialog>
        </Popover>
      </AriaDatePicker>
    </I18nProvider>
  )
}

