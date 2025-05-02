import { Input } from "@/components/ui/input";
import { UseFormSetValue } from "react-hook-form";
import { Field } from "../(masters)/schemas/templates";

export default function FileField({ field, setValue }: {
  field: Field;
  setValue?: UseFormSetValue<any>
}) {
  const {
    defaultValue,
    ...safeProperties
  } = field.type.properties || {};

  return (
    <Input
      {...safeProperties}
      type="file"
      className={`p-0 pe-3 file:me-3 file:border-0 file:border-e w-full`}
      onChange={(event) => {
        const file = event.target.files?.[0];
        if (file && setValue) {
          setValue(field.code, file);
        }
      }}
    />
  );
}