import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../scheduler/schemas/templates";

export default function TextAreaField({ field, formField }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  const {
    maxLength,
    defaultValue,
    ...safeProperties
  } = field.type.properties || {};

  const safeDefaultValue = typeof defaultValue === 'boolean'
    ? defaultValue.toString()
    : defaultValue;

  return (
    <Textarea
      {...formField}
      {...safeProperties}
      className={`resize-none`}
      maxLength={maxLength}
      defaultValue={safeDefaultValue as string | number | readonly string[] | undefined}
    />
  );
}