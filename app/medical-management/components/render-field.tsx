import { DateField as DateFieldRac, DateInput, DateInput as DateInputRac } from "@/components/ui/datefield-rac";
import { CalendarIcon, Clock, Minus, Plus } from "lucide-react";
import {
  Button as AriaButton,
  DateInput as AriaDateInput,
  Input as AriaInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  I18nProvider,
  Label,
  NumberField,
  Popover,
  TimeField
} from "react-aria-components";
import { Control, useFormContext } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Field } from "../scheduler/schemas/templates";
import { Calendar } from "@/components/ui/calendar-rac";

export default function RenderField({
  field,
  control,
}: {
  field: Field,
  control: Control,
}) {
  const { setValue } = useFormContext();
  return (
    <FormField
      key={field.id}
      control={control}
      name={field.code}
      render={({ field: formField }) => (
        <FormItem className="flex flex-col w-full">
          {field.title && <FormLabel>{field.title}</FormLabel>}
          <FormControl>
            <>
              {field.type.primitiveField.type === "textarea" && (
                <Textarea
                  {...formField}
                  {...(field.type.values)}
                  defaultValue={undefined}
                  placeholder="Escribe aquí..."
                  className="resize-none"
                />
              )}

              {field.type.primitiveField.type === "text" && (
                <Input
                  {...formField}
                  {...(field.type.primitiveField.properties)}
                  placeholder="Escribe aquí..."
                />
              )}

              {field.type.primitiveField.type === "number" && (
                <NumberField
                  {...formField}
                  {...(field.type.values)}
                  defaultValue={typeof field.type.values?.defaultValue === "number" ? field.type.values.defaultValue : undefined}
                >
                  <Label className="sr-only">
                    {field.title}
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
                </NumberField>
              )}

              {field.type.primitiveField.type === "select" && (
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Seleccioná una opción"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.type.values?.options?.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type.primitiveField.type === "file" && (
                <Input
                  {...(field.type.values)}
                  type="file"
                  className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setValue(field.code, file);
                    }
                  }}
                />
              )}

              {field.type.primitiveField.type === "time" && (
                <I18nProvider locale="es-419">
                  <TimeField
                    value={formField.value ?? undefined}
                    onChange={(value) => {
                      if (!value) {
                        formField.onChange(undefined);
                        return;
                      }
                      formField.onChange({ ...value });
                    }}
                  >
                    <Label className="sr-only">
                      {field.title}
                    </Label>
                    <div className="relative">
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
                  </TimeField>
                </I18nProvider>
              )}

              {field.type.primitiveField.type === "date" && (
                <I18nProvider locale="es-419">
                  <DatePicker
                    onChange={(value) => {
                      if (!value) {
                        formField.onChange(undefined);
                        return;
                      }
                      formField.onChange({ ...value });
                    }}
                  >
                    <Label className="sr-only">
                      {field.title}
                    </Label>
                    <div className="flex">
                      <Group className="w-full">
                        <DateInput className="pe-9" />
                      </Group>
                      <AriaButton className="z-10 pe-3 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/50 outline-offset-2 transition-colors hover:text-muted-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70">
                        <CalendarIcon size={16} strokeWidth={2} />
                      </AriaButton>
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
              )}

              {field.type.primitiveField.type === "datetime" && (
                <I18nProvider locale="es-419">
                  <DateFieldRac
                    onChange={(value) => formField.onChange(value)}
                    className="space-y-0"
                    granularity="minute"
                  >
                    <Label className="sr-only">Date and time input</Label>
                    <DateInputRac />
                  </DateFieldRac>
                </I18nProvider>
              )}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}