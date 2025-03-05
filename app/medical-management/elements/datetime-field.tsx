import { DateField as DateFieldRac, DateInput as DateInputRac } from "@/components/ui/datefield-rac";
import { DateValue } from "@internationalized/date";
import { I18nProvider, Label } from "react-aria-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../scheduler/schemas/templates";

export default function DatetimeField({ formField, field }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  return (
    <I18nProvider locale="es-419">
      <DateFieldRac
        value={field.type.properties.defaultValue as DateValue}
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
