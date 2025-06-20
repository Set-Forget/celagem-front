import { Input } from "@/components/ui/input";
import CustomSonner from "@/components/custom-sonner";
import { UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
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
          const TEN_MB = 10 * 1024 * 1024;
          if (file.size > TEN_MB) {
            toast.custom((t) => (
              <CustomSonner
                t={t}
                description="File exceeds the maximum allowed size of 10 MB"
                variant="warning"
              />
            ));
            event.target.value = "";
            return;
          }
          setValue(field.code, file);
        }
      }}
    />
  );
}