import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, Trash } from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  Group,
  Label,
  NumberField
} from "react-aria-components";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  embryoNumber: z.number({ required_error: "El número de embrión es requerido", invalid_type_error: "El número de embrión debe ser un número" }).min(0, "El número de embrión debe ser mayor a 0"),
  serial: z.string({ required_error: "El serial es requerido" }).min(1, "El serial es requerido"),
})

export default function EmbryosToDisincorporateTable() {
  const { setValue } = useFormContext()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      serial: "",
      embryoNumber: NaN,
    },
  });

  const embryosToDisincorporate = useWatch({
    name: "embryos-to-disincorporate-list",
    defaultValue: [],
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setValue("embryos-to-disincorporate-list", [...embryosToDisincorporate, data])
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
            name="serial"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Serial</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Serial..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="mt-[24px]"
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
            <TableHead>Serial</TableHead>
            <TableHead className="text-right pr-4">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!embryosToDisincorporate || !embryosToDisincorporate.length && (
            <TableRow className="[&:nth-last-child(2)]:border-b-0">
              <TableCell colSpan={3} className="text-center">
                <span className="text-xs text-muted-foreground">No hay embriones</span>
              </TableCell>
            </TableRow>
          )}
          {embryosToDisincorporate.map((embryo: z.infer<typeof FormSchema>, index: number) => (
            <TableRow className="[&:nth-last-child(2)]:border-b-0" key={index}>
              <TableCell className="font-medium">{embryo.embryoNumber}</TableCell>
              <TableCell>{embryo.serial}</TableCell>
              <TableCell className="text-right pr-4">
                <Button
                  type="button"
                  size="icon"
                  className="h-7 w-7 !text-destructive"
                  variant="ghost"
                  onClick={() => {
                    setValue("embryos-to-disincorporate-list", embryosToDisincorporate.filter((_: any, i: number) => i !== index))
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