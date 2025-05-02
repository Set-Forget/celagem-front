import {
  Button as AriaButton,
  Input as AriaInput,
  Group,
  Label,
  NumberField as AriaNumberField,
} from "react-aria-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { Field } from "../(masters)/schemas/templates";
import { Minus, Plus } from "lucide-react";

export default function NumberField({ field, formField }: {
  field?: Field;
  formField?: ControllerRenderProps<FieldValues, string>;
}) {

  return (
    <AriaNumberField
      {...formField}
      {...(field?.type.properties)}
      className="w-full"
      value={typeof formField?.value === "number" ? formField?.value : NaN}
      defaultValue={typeof field?.type.properties?.defaultValue === "number" ? field?.type.properties.defaultValue : NaN}
    >
      <Label className="sr-only">
        {field?.title}
      </Label>
      <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 data-[focus-within]:outline outline-1">
        <AriaButton
          slot="decrement"
          className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-sm border border-input bg-background text-sm text-muted-foreground/50 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Minus size={16} strokeWidth={2} aria-hidden="true" />
        </AriaButton>
        <AriaInput className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus-visible:outline-none" />
        <AriaButton
          slot="increment"
          className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-sm border border-input bg-background text-sm text-muted-foreground/50 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
        </AriaButton>
      </Group>
    </AriaNumberField>
  );
}
