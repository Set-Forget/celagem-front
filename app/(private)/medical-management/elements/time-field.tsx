import { Clock } from "lucide-react";
import { DateInput as AriaDateInput, TimeField as AriaTimeField, DateSegment, I18nProvider, Label } from "react-aria-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../calendar/schemas/templates";
import { Time } from "@internationalized/date";

export default function TimeField({ field, formField }: {
  field: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {
  return (
    <I18nProvider locale="es-419">
      <AriaTimeField
        className="w-full"
        value={field?.type?.properties?.defaultValue as Time}
        onChange={(value) => {
          if (!value) {
            formField?.onChange(undefined);
            return;
          }
          formField?.onChange({ ...value });
        }}
      >
        <Label className="sr-only">
          {field.title}
        </Label>
        <div className="relative w-full">
          <AriaDateInput className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input bg-background px-3 py-2 pe-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground data-[type=literal]:text-muted-foreground data-[disabled]:opacity-50"
              />
            )}
          </AriaDateInput>
          <div className="pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-4 text-muted-foreground/50">
            <Clock size={16} strokeWidth={2} aria-hidden="true" />
          </div>
        </div>
      </AriaTimeField>
    </I18nProvider>
  );
}
