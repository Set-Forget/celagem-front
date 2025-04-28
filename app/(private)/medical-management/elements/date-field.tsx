import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { CalendarIcon } from "lucide-react";
import { Button, DatePicker, DateValue, Dialog, Group, I18nProvider, Label, Popover } from "react-aria-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../calendar/schemas/templates";
import { CalendarDate } from "@internationalized/date";

export default function DateField({ field, formField }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  const day = formField?.value?.day;
  const month = formField?.value?.month;
  const year = formField?.value?.year;

  const value = day && month && year ? new CalendarDate(year, month, day) : undefined;

  return (
    <I18nProvider locale="es-419">
      <DatePicker
        className="w-full"
        defaultValue={field?.type?.properties?.defaultValue as DateValue}
        value={value}
        onChange={(value) => {
          if (!value) {
            formField?.onChange(undefined);
            return;
          }
          formField?.onChange(value);
        }}
      >
        <Label className="sr-only">
          {field.title}
        </Label>
        <div className="flex">
          <Group className="w-full">
            <DateInput className="pe-9" />
          </Group>
          <Button className="z-10 pe-3 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/50 outline-offset-2 transition-colors hover:text-muted-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70">
            <CalendarIcon size={16} strokeWidth={2} />
          </Button>
        </div>
        <Popover
          className="z-50 rounded-lg border border-border bg-background text-popover-foreground shadow-lg shadow-black/5 outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
          offset={4}
        >
          <Dialog className="max-h-[inherit] overflow-auto p-2">
            <Calendar />
          </Dialog>
        </Popover>
      </DatePicker>
    </I18nProvider>
  );
}
