import { FieldConfig } from "@/app/medical-management/scheduler/appointment/[id]/page";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Clock, Minus, Plus } from "lucide-react";
import { useEffect } from "react";
import {
  Button as AriaButton,
  Input as AriaInput,
  DateField,
  DateInput,
  DateSegment,
  Group,
  I18nProvider,
  Label,
  NumberField,
  TimeField
} from "react-aria-components";
import { Control, useFormContext, useWatch } from "react-hook-form";
import { MultiSelect } from "../../../components/multi-select";
import { Button } from "../../../components/ui/button";
import { Calendar } from "../../../components/ui/calendar";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import RenderTable from "./render-table";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DateField as DateFieldRac, DateInput as DateInputRac } from "@/components/ui/datefield-rac";

export default function RenderField({
  field,
  control,
}: {
  field: FieldConfig,
  control: Control,
}) {
  const { setValue } = useFormContext();

  const weight = useWatch({ control, name: "weight" }) || 0;
  const height = useWatch({ control, name: "height" }) || 0;

  useEffect(() => {
    if (field.name === "imc") {
      const calculateBMI = (weight: number, height: number) => {
        if (height > 0) {
          return (weight / ((height / 100) ** 2)).toFixed(2);
        }
        return "";
      };
      setValue("imc", calculateBMI(weight, height));
    }
  }, [weight, height]);


  const dependentValue = useWatch({ control, name: field?.dependsOn?.field ?? "" });


  const options =
    field.dependsOn && field.dependsOn.filterOptions
      ? field.dependsOn.filterOptions.find(
        (filter) => filter.parentValue === dependentValue
      )?.options || []
      : field.options;

  return (
    <FormField
      key={field.name}
      control={control}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="flex flex-col w-full">
          {field.label && <FormLabel>{field.label}</FormLabel>}
          <FormControl>
            <>
              {field.type === "textarea" && (
                <Textarea
                  {...formField}
                  readOnly={field.readOnly}
                  placeholder={field.placeholder || "Escribe aquí..."}
                  className={`resize-none ${field.className || ""}`}
                />
              )}

              {field.type === "input" && (
                <Input
                  {...formField}
                  readOnly={field.readOnly}
                  placeholder={field.placeholder || "Escribe aquí..."}
                  className={field.className || ""}
                />
              )}

              {field.type === "number" && (
                <NumberField
                  isReadOnly={field.readOnly}
                  minValue={field.minValue || 0}
                  defaultValue={field.defaultValue}
                  className={field.className}
                  {...formField}
                >
                  <Label className="sr-only">
                    {field.label}
                  </Label>
                  <Group className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 data-[focus-within]:outline outline-1">
                    <AriaButton
                      slot="decrement"
                      className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-sm border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Minus size={16} strokeWidth={2} aria-hidden="true" />
                    </AriaButton>
                    <AriaInput className="w-full grow bg-background px-3 py-2 text-center tabular-nums text-foreground focus-visible:outline-none" />
                    <AriaButton
                      slot="increment"
                      className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-sm border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={16} strokeWidth={2} aria-hidden="true" />
                    </AriaButton>
                  </Group>
                </NumberField>
              )}

              {field.type === "select" && (
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "combobox" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled={field.dependsOn && !dependentValue}
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value
                          ? options?.find(
                            (option) => option.value === formField.value
                          )?.label
                          : "Seleccioná una opción"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Buscar..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>
                          No se encontraron resultados
                        </CommandEmpty>
                        <CommandGroup>
                          {options?.map((option) => (
                            <CommandItem
                              value={option.label}
                              key={option.value}
                              onSelect={() => {
                                setValue(field.name, option.value);
                              }}
                            >
                              {option.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  option.value === formField.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}

              {field.type === "multi-select" && (
                <MultiSelect
                  options={field.options || []}
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                  placeholder={field.placeholder}
                  searchPlaceholder={"Buscar..."}
                />
              )}

              {field.type === "file" && (
                <Input
                  id={field.name}
                  type="file"
                  className="p-0 pe-3 file:me-3 file:border-0 file:border-e"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      setValue(field.name, file);
                    }
                  }}
                />
              )}

              {field.type === "time" && (
                <TimeField
                  value={formField.value}
                  onChange={(value) => {
                    formField.onChange({ ...value });
                  }}
                >
                  <Label className="sr-only">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <DateInput className="relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-sm border border-input bg-background px-3 py-2 pe-9 text-sm shadow-sm shadow-black/5 transition-shadow data-[focus-within]:border-ring data-[disabled]:opacity-50 data-[focus-within]:outline-none">
                      {(segment) => (
                        <DateSegment
                          segment={segment}
                          className="inline rounded p-0.5 text-foreground caret-transparent outline outline-0 data-[disabled]:cursor-not-allowed data-[focused]:bg-accent data-[invalid]:data-[focused]:bg-destructive data-[type=literal]:px-0 data-[focused]:data-[placeholder]:text-foreground data-[focused]:text-foreground data-[invalid]:data-[focused]:data-[placeholder]:text-destructive-foreground data-[invalid]:data-[focused]:text-destructive-foreground data-[invalid]:data-[placeholder]:text-destructive data-[invalid]:text-destructive data-[placeholder]:text-muted-foreground/70 data-[type=literal]:text-muted-foreground/70 data-[disabled]:opacity-50"
                        />
                      )}
                    </DateInput>
                    <div className="pointer-events-none absolute inset-y-0 end-0 z-10 flex items-center justify-center pe-3 text-muted-foreground/80">
                      <Clock size={16} strokeWidth={2} aria-hidden="true" />
                    </div>
                  </div>
                </TimeField>
              )}

              {field.type === "date" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !formField.value && "text-muted-foreground"
                        )}
                      >
                        {formField.value ? (
                          format(new Date(formField.value), "PPP")
                        ) : (
                          <span>Seleccioná una fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formField.value ? new Date(formField.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          formField.onChange(date.toISOString());
                        } else {
                          formField.onChange(null);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}

              {field.type === "table" && (
                <RenderTable {...field} />
              )}

              {field.type === "datetime" && (
                <I18nProvider locale="es-419">
                  <DateFieldRac
                    onChange={(value) => formField.onChange(value?.toString())}
                    className="space-y-0"
                    granularity="minute"
                    hourCycle={24}
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