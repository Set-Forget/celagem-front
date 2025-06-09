import { Textarea } from "@/components/ui/textarea";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../(masters)/schemas/templates";

export default function TextAreaField({ field, formField }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  const {
    maxLength,
    defaultValue,
    ...safeProperties
  } = field.type.properties || {};

  return (
    <Textarea
      {...formField}
      {...safeProperties}
      className={`resize-none bg-background`}
      maxLength={maxLength}
    />
  );
}