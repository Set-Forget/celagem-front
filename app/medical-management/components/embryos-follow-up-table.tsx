import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Minus, Plus, Trash } from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  Group,
  Label,
  NumberField
} from "react-aria-components";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

const DAYS = [
  { value: "day-5", label: "Día 5" },
  { value: "day-6", label: "Día 6" },
];

const PGTA_RESULTS = [
  { value: "normal-male", label: "Normal masculino" },
  { value: "normal-feale", label: "Normal femenino" },
  { value: "abnormal-male", label: "Anormal masculino" },
  { value: "abnormal-female", label: "Anormal femenino" },
];

const FormSchema = z.object({
  embryoNumber: z.number({ required_error: "El número de embrión es requerido", invalid_type_error: "El número de embrión debe ser un número" }).min(0, "El número de embrión debe ser mayor a 0"),
  day: z.enum(["day-5", "day-6"], { required_error: "El día es requerido" }),
  classification: z.enum(["6AA", "6AB", "6BA", "6BB", "5AA", "5AB", "5BA", "5BB", "4AA", "4AB", "4BA", "4BB", "3AA", "3AB", "3BA", "3BB"], { required_error: "La clasificación es requerida" }),
  pgtaResult: z.enum(["normal-female", "normal-male", "abnormal-female", "abnormal-male"], { required_error: "El resultado de PGT-A es requerido" }),
  cycleDate: z.string({ required_error: "La fecha de ciclo es requerida" }).min(1, "La fecha de ciclo es requerida"),
  vitrificationDate: z.string({ required_error: "La fecha de vitrificación es requerida" }).min(1, "La fecha de vitrificación es requerida"),
  tank: z.number({ required_error: "El tanque es requerido", invalid_type_error: "El tanque es requerido" }).min(0, "El tanque es requerido"),
  canister: z.number({ required_error: "El canister es requerido", invalid_type_error: "El canister es requerido" }).min(0, "El canister es requerido"),
  ladder: z.number({ required_error: "La escalerilla es requerida", invalid_type_error: "La escalerilla es requerida" }).min(0, "La escalerilla es requerida"),
})

export default function EmbryosToFollowUpTable() {
  const { setValue } = useFormContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      embryoNumber: NaN,
      cycleDate: "",
      vitrificationDate: "",
      tank: NaN,
      canister: NaN,
      ladder: NaN,
      day: undefined,
      classification: undefined,
      pgtaResult: undefined,
    },
  });

  const embryosToFollowUp = useWatch({
    name: "embryos-to-follow-up-list",
    defaultValue: [],
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setValue("embryos-to-follow-up-list", [...embryosToFollowUp, data])
    form.reset()
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <div className="flex gap-4 items-start">
          <FormField
            control={form.control}
            name="embryoNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Número de embrión</FormLabel>
                <FormControl>
                  <NumberField
                    {...field}
                  >
                    <Label className="sr-only">
                      Número de embrión
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Día</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="classification"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Clasificación</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar clasificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6AA">6AA</SelectItem>
                      <SelectItem value="6AB">6AB</SelectItem>
                      <SelectItem value="6BA">6BA</SelectItem>
                      <SelectItem value="6BB">6BB</SelectItem>
                      <SelectItem value="5AA">5AA</SelectItem>
                      <SelectItem value="5AB">5AB</SelectItem>
                      <SelectItem value="5BA">5BA</SelectItem>
                      <SelectItem value="5BB">5BB</SelectItem>
                      <SelectItem value="4AA">4AA</SelectItem>
                      <SelectItem value="4AB">4AB</SelectItem>
                      <SelectItem value="4BA">4BA</SelectItem>
                      <SelectItem value="4BB">4BB</SelectItem>
                      <SelectItem value="3AA">3AA</SelectItem>
                      <SelectItem value="3AB">3AB</SelectItem>
                      <SelectItem value="3BA">3BA</SelectItem>
                      <SelectItem value="3BB">3BB</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 items-start">
          <FormField
            control={form.control}
            name="pgtaResult"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Resultado de PGT-A</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar resultado de PGT-A" />
                    </SelectTrigger>
                    <SelectContent>
                      {PGTA_RESULTS.map((result) => (
                        <SelectItem key={result.value} value={result.value}>
                          {result.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cycleDate"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Fecha de ciclo</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString());
                        } else {
                          field.onChange(null);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vitrificationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Fecha de vitrificación</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date.toISOString());
                        } else {
                          field.onChange(null);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 items-start">
          <FormField
            control={form.control}
            name="tank"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Tanque</FormLabel>
                <FormControl>
                  <NumberField
                    {...field}
                  >
                    <Label className="sr-only">
                      Tanque
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="canister"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Canister</FormLabel>
                <FormControl>
                  <NumberField
                    {...field}
                  >
                    <Label className="sr-only">
                      Canister
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ladder"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Escalerilla</FormLabel>
                <FormControl>
                  <NumberField
                    {...field}
                  >
                    <Label className="sr-only">
                      Escalerilla
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            size="sm"
          >
            Agregar
          </Button>
        </div>
      </Form>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Embrión #</TableHead>
            <TableHead>Día</TableHead>
            <TableHead>Clasificación</TableHead>
            <TableHead>Resultado de PGT-A</TableHead>
            <TableHead>Fecha de ciclo</TableHead>
            <TableHead>Fecha de vitrificación</TableHead>
            <TableHead>Tanque</TableHead>
            <TableHead>Canister</TableHead>
            <TableHead>Escalerilla</TableHead>
            <TableHead className="text-right pr-4">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!embryosToFollowUp || !embryosToFollowUp.length && (
            <TableRow className="[&:nth-last-child(2)]:border-b-0">
              <TableCell colSpan={10} className="text-center">
                <span className="text-xs text-muted-foreground">No hay embriones</span>
              </TableCell>
            </TableRow>
          )}
          {embryosToFollowUp.map((embryo: z.infer<typeof FormSchema>, index: number) => (
            <TableRow className="[&:nth-last-child(2)]:border-b-0" key={index}>
              <TableCell className="font-medium">{embryo.embryoNumber}</TableCell>
              <TableCell>
                {DAYS.find((day) => day.value === embryo.day)?.label}
              </TableCell>
              <TableCell>{embryo.classification}</TableCell>
              <TableCell>
                {PGTA_RESULTS.find((result) => result.value === embryo.pgtaResult)?.label}
              </TableCell>
              <TableCell>
                {format(new Date(embryo.cycleDate), "PPP")}
              </TableCell>
              <TableCell>
                {format(new Date(embryo.vitrificationDate), "PPP")}
              </TableCell>
              <TableCell>{embryo.tank}</TableCell>
              <TableCell>{embryo.canister}</TableCell>
              <TableCell>{embryo.ladder}</TableCell>
              <TableCell className="text-right pr-4">
                <Button
                  type="button"
                  size="icon"
                  className="h-7 w-7 !text-destructive"
                  variant="ghost"
                  onClick={() => {
                    setValue("embryos-to-follow-up-list", embryosToFollowUp.filter((_: any, i: number) => i !== index))
                  }}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}