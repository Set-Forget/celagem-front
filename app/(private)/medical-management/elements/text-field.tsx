import { Input } from "@/components/ui/input";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../calendar/schemas/templates";

export default function TextField({ field, formField }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  const {
    maxLength,
    defaultValue,
    ...safeProperties
  } = field.type.properties || {};

  return (
    <Input
      {...formField}
      {...safeProperties}
      maxLength={maxLength}
    />
  );
}