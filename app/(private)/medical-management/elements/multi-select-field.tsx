import { MultiSelect } from "@/components/multi-select";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../calendar/schemas/templates";

export default function MultiSelectField({ field, formField }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  return (
    <MultiSelect
      options={field.type?.properties?.options ?? []}
      onValueChange={formField?.onChange}
      defaultValue={formField?.value ?? []}
      getDisplayValue={(item) => item.label}
      getOptionValue={(item) => item.value}
      renderOption={(item) => <div>{item.label}</div>}
      getOptionKey={(item) => item.value}
    />
  )
}
