import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../calendar/schemas/templates";

export default function SelectField({ field, formField }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {

  return (
    <Select
      onValueChange={formField?.onChange}
      defaultValue={field?.type?.properties?.defaultValue as string}
      value={formField?.value}
    >
      <SelectTrigger>
        <SelectValue
          placeholder="Seleccioná una opción"
        />
      </SelectTrigger>
      <SelectContent>
        {field.type?.properties?.options?.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
