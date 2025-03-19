import { Calendar } from "@/components/ui/calendar-rac";
import { DateField as DateFieldRac, DateInput, DateInput as DateInputRac } from "@/components/ui/datefield-rac";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "emblor";
import { CalendarIcon, Clock, Minus, Plus } from "lucide-react";
import { useState } from "react";
import {
  Button as AriaButton,
  DateInput as AriaDateInput,
  Input as AriaInput,
  NumberField as AriaNumberField,
  TimeField as AriaTimeField,
  Button,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  I18nProvider,
  Label,
  Popover,
} from "react-aria-components";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { propFieldAdapter } from "../utils";

function SelectRenderer(
  field: Omit<ControllerRenderProps<FieldValues, string>, "ref">
) {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <TagInput
      tags={
        field?.value?.map((tag: { label: string; value: string }) => ({
          id: tag.value,
          text: tag.label,
        })) ?? []
      }
      setTags={(newTags) => {
        const tagsArray = typeof newTags === "function" ? newTags([]) : newTags;
        field.onChange(
          tagsArray.map((tag) => ({
            label: tag.text,
            value: tag.id,
          }))
        );
      }}
      placeholder="Agregar opción"
      styleClasses={{
        tagList: {
          container: "gap-1",
        },
        input:
          "rounded-sm transition-[color,box-shadow] placeholder:text-muted-foreground",
        tag: {
          body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
          closeButton:
            "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
        },
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      inlineTags={false}
      inputFieldPosition="top"
    />
  );
}
SelectRenderer.displayName = "SelectRenderer";

const defaultValueRenderers: Record<
  string,
  (
    field: Omit<ControllerRenderProps<FieldValues, string>, "ref">,
    props?: Record<string, unknown>
  ) => JSX.Element
> = {
  text: (field) => <Input {...field} placeholder="Ingrese valor por defecto" />,
  textarea: (field) => (
    <Textarea
      {...field}
      placeholder="Escribe aquí..."
      className="resize-none"
    />
  ),
  email: (field) => <Input {...field} placeholder="Ingrese valor por defecto" />,
  number: (field, props) => (
    <AriaNumberField
      {...props}
      {...field}
      onChange={(value) => {
        if (!isNaN(value)) return field.onChange(value);
        field.onChange(null);
      }}
      className="w-full"
    >
      <Label className="sr-only">Number field</Label>
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
  ),
  date: (field) => (
    <I18nProvider locale="es-419">
      <DatePicker
        className="w-full"
        value={field.value}
        onChange={(value) => {
          if (!value) {
            field?.onChange(undefined);
            return;
          }
          field?.onChange(value);
        }}
      >
        <Label className="sr-only">Date</Label>
        <div className="flex">
          <Group className="w-full">
            <DateInput className="pe-9" />
          </Group>
          <Button className="z-10 pe-3 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/50 outline-offset-2 transition-colors hover:text-muted-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70">
            <CalendarIcon size={16} strokeWidth={2} />
          </Button>
        </div>
        <Popover
          className="z-50 rounded-lg border border-border bg-background text-popover-foreground shadow-lg shadow-black/5 outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
          offset={4}
        >
          <Dialog className="max-h-[inherit] overflow-auto p-2">
            <Calendar />
          </Dialog>
        </Popover>
      </DatePicker>
    </I18nProvider>
  ),
  time: (field) => (
    <I18nProvider locale="es-419">
      <AriaTimeField
        value={field.value}
        onChange={(value) => {
          if (!value) {
            field?.onChange(undefined);
            return;
          }
          field?.onChange(value);
        }}
      >
        <Label className="sr-only">Time Input</Label>
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
  ),
  datetime: (field) => (
    <I18nProvider locale="es-419">
      <DateFieldRac
        value={field.value}
        onChange={(value) => field?.onChange(value)}
        className="space-y-0 w-full"
        granularity="minute"
      >
        <Label className="sr-only">Date and time input</Label>
        <DateInputRac />
      </DateFieldRac>
    </I18nProvider>
  ),

  select: (field) => <SelectRenderer {...field} />,
};

const defaultPropRenderers: Record<
  string,
  (field: Omit<ControllerRenderProps<FieldValues, string>, "ref">) => JSX.Element
> = {
  options: (field) => defaultValueRenderers.select(field),
  minLength: (field) => defaultValueRenderers.number(field, { minValue: 0 }),
  maxValue: (field) => defaultValueRenderers.number(field, { minValue: 0 }),
  minValue: (field) => defaultValueRenderers.number(field),
  maxLength: (field) => defaultValueRenderers.number(field, { minValue: 0 }),
  decimalPlaces: (field) => defaultValueRenderers.number(field),
};

function getRenderer(propKey: string, primitiveType?: string) {
  if (propKey === "defaultValue" && primitiveType && defaultValueRenderers[primitiveType]) {
    return defaultValueRenderers[primitiveType];
  }
  if (defaultPropRenderers[propKey]) {
    return defaultPropRenderers[propKey];
  }
  const DefaultInputRenderer = (
    field: Omit<ControllerRenderProps<FieldValues, string>, "ref">
  ) => (
    <Input
      {...field}
      placeholder={`Ingrese ${propFieldAdapter[
        propKey as keyof typeof propFieldAdapter
      ].toLowerCase()}`}
    />
  );
  DefaultInputRenderer.displayName = `DefaultInputRenderer(${propKey})`;
  return DefaultInputRenderer;
}


type DynamicFieldProps = {
  propKey: string;
  field: Omit<ControllerRenderProps<FieldValues, string>, "ref">;
  primitiveType?: string;
};

export default function PropField({ propKey, field, primitiveType }: DynamicFieldProps) {
  const Renderer = getRenderer(propKey, primitiveType);
  return (
    <div className="flex flex-col w-full">
      <Renderer {...field} />
    </div>
  );
}
