"use client"

import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac"
import { CalendarIcon } from "lucide-react"
import { DateRangePicker as AriaDateRangePicker, Button, DateValue, Dialog, Group, I18nProvider, Label, Popover } from "react-aria-components"
import { RangeCalendar } from "./calendar-rac"
import { cn } from "@/lib/utils"

export default function DateRangePicker({
  value,
  onChange,
}: {
  value: {
    start: DateValue,
    end: DateValue,
  } | null,
  onChange: (value: {
    start: DateValue,
    end: DateValue,
  } | null) => void,
}) {
  return (
    <I18nProvider locale="es-419">
      <AriaDateRangePicker
        value={value}
        onChange={(date) => onChange(date)}
        className="*:not-first:mt-2"
      >
        <Label className="sr-only">Date picker</Label>
        <div className="flex group">
          <Group className={cn("relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none data-focus-within:border-ring data-focus-within:ring-ring/50 data-focus-within:ring-[3px] data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 data-focus-within:has-aria-invalid:border-destructive pe-9")}>
            <DateInput slot="start" unstyled />
            <span aria-hidden="true" className="text-muted-foreground/70 px-2">
              -
            </span>
            <DateInput slot="end" unstyled />
          </Group>
          <Button className="text-muted-foreground group-[&:has(.react-aria-Input[value=''])]:hover:text-foreground z-10 -ms-11 -me-px flex w-9 items-center justify-center rounded-e-sm transition-[color,box-shadow] outline-none">
            <CalendarIcon size={16} className="opacity-50 group-[&:has(.react-aria-Input:not([value='']))]:opacity-100 transition-opacity" />
          </Button>
        </div>
        <Popover
          className="z-50 rounded-sm border border-border bg-background text-popover-foreground shadow-lg outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
          offset={4}
        >
          <Dialog className="max-h-[inherit] overflow-auto p-2">
            <RangeCalendar />
          </Dialog>
        </Popover>
      </AriaDateRangePicker>
    </I18nProvider>
  )
}

