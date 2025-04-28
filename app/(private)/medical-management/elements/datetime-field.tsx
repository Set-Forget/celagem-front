import { DateField as DateFieldRac, DateInput as DateInputRac } from "@/components/ui/datefield-rac";
import { CalendarDateTime, DateValue } from "@internationalized/date";
import { I18nProvider, Label } from "react-aria-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../calendar/schemas/templates";

export default function DatetimeField({ formField, field }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  const day = formField?.value?.day;
  const month = formField?.value?.month;
  const year = formField?.value?.year;
  const hour = formField?.value?.hour;
  const minute = formField?.value?.minute;

  const value = day && month && year ? new CalendarDateTime(year, month, day, hour, minute) : undefined;
  return (
    <I18nProvider locale="es-419">
      <DateFieldRac
        defaultValue={field?.type?.properties?.defaultValue as DateValue}
        value={value}
        onChange={(value) => formField?.onChange(value)}
        className="space-y-0 w-full"
        granularity="minute"
      >
        <Label className="sr-only">Date and time input</Label>
        <DateInputRac />
      </DateFieldRac>
    </I18nProvider>
  );
}
