import { cn } from "@/lib/utils";
import { Control, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form";
import { Field } from "../calendar/schemas/templates";
import { templateFields } from "../utils";
import NumberField from "../elements/number-field";

export default function RenderField({
  field,
  control,
}: {
  field: Field,
  control?: Control,
}) {
  const { setValue } = useFormContext();

  if (field.title === "imc") {
    return (
      <div className="grid grid-cols-3 gap-2 w-full">
        <FormField
          key={field.id}
          control={control}
          name={field.code}
          render={({ field: formField }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel
                className={cn(
                  !field.is_required && "font-normal text-accent-foreground/75",
                  field.type.primitive_type === "title" && "font-semibold py-1"
                )}
              >
                {field.title}
              </FormLabel>
              <FormControl>
                <NumberField field={field} formField={formField} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    )
  }

  const FieldComponent = field.type.primitive_type !== 'title'
    ? templateFields[field.type.primitive_type as keyof typeof templateFields]
    : null;

  return (
    <FormField
      key={field.id}
      control={control}
      name={field.code}
      render={({ field: formField }) => (
        <FormItem className="flex flex-col w-full">
          {field.title && (
            <FormLabel
              className={cn(
                !field.is_required && "font-normal text-accent-foreground/75",
                field.type.primitive_type === "title" && "font-semibold py-1"
              )}
            >
              {field.title}
            </FormLabel>
          )}
          <FormControl>
            {FieldComponent && <FieldComponent field={field} formField={formField} setValue={setValue} />}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}