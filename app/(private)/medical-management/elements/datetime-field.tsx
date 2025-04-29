import { DateField as DateFieldRac, DateInput as DateInputRac } from "@/components/ui/datefield-rac";
import { CalendarDateTime } from "@internationalized/date";
import { I18nProvider, Label } from "react-aria-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

export default function DatetimeField({ formField }: {
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  const day = formField?.value?.day;
  const month = formField?.value?.month;
  const year = formField?.value?.year;
  const hour = formField?.value?.hour;
  const minute = formField?.value?.minute;

  const value = day && month && year ? new CalendarDateTime(year, month, day, hour, minute) : null;
  return (
    <I18nProvider locale="es-419">
      <DateFieldRac
        {...formField}
        value={value}
        className="space-y-0 w-full"
        granularity="minute"
      >
        <Label className="sr-only">Fecha y hora</Label>
        <DateInputRac />
      </DateFieldRac>
    </I18nProvider>
  );
}
