import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";

const IVF_DESCRIPTIONS = [
  { label: "Número de embriones congelados", value: "frozen-embryos" },
  { label: "Número de embriones transferidos", value: "transferred-embryos" },
  { label: "Número de óvulos", value: "eggs-number" },
  { label: "Número de óvulos MII", value: "mii-eggs-number" },
  { label: "Número de óvulos fertilizados", value: "fertilized-eggs-number" },
  { label: "Número de embriones día 3", value: "day-3-embryos-number" },
  { label: "Número de blastocistos", value: "blastocysts-number" },
  { label: "PGTA", value: "pgta" },
] as const;

const FormSchema = z.object({
  ivfDescription: z.enum(["frozen-embryos", "transferred-embryos", "eggs-number", "mii-eggs-number", "fertilized-eggs-number", "day-3-embryos-number", "blastocysts-number", "pgta"], { required_error: "La descripción es requerida" }),
  value: z.string({ required_error: "El valor es requerido" }).min(1, "El valor es requerido"),
})

export default function IVFReportTable() {
  const { setValue } = useFormContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ivfDescription: undefined,
      value: "",
    },
  });

  const ivfReport = useWatch({
    name: "ivf-report-list",
    defaultValue: [],
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setValue("ivf-report-list", [...ivfReport, data])
    form.reset()
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <div className="flex gap-4 items-start">
          <FormField
            control={form.control}
            name="ivfDescription"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Día</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {IVF_DESCRIPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
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
            name="value"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Valor..."
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
            <TableHead>Descripción</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead className="text-right pr-4">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!ivfReport || !ivfReport.length && (
            <TableRow className="[&:nth-last-child(2)]:border-b-0">
              <TableCell colSpan={3} className="text-center">
                <span className="text-xs text-muted-foreground">No hay embriones</span>
              </TableCell>
            </TableRow>
          )}
          {ivfReport.map((embryo: z.infer<typeof FormSchema>, index: number) => (
            <TableRow className="[&:nth-last-child(2)]:border-b-0" key={index}>
              <TableCell className="font-medium">
                {IVF_DESCRIPTIONS.find((option) => option.value === embryo.ivfDescription)?.label}
              </TableCell>
              <TableCell>{embryo.value}</TableCell>
              <TableCell className="text-right pr-4">
                <Button
                  type="button"
                  size="icon"
                  className="h-7 w-7 !text-destructive"
                  variant="ghost"
                  onClick={() => {
                    setValue("ivf-report-list", ivfReport.filter((_: any, i: number) => i !== index))
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