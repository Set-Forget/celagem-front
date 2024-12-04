import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TableCell,
  TableRow
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { newInvoiceSchema } from "../../schemas/invoices"

export default function ItemRow({ index, remove }: { index: number, remove: (index: number) => void }) {
  const { control } = useFormContext<z.infer<typeof newInvoiceSchema>>()

  const quantity = useWatch({
    control,
    name: `items.${index}.quantity`,
  });

  const price = useWatch({
    control,
    name: `items.${index}.price`,
  });

  const tax = useWatch({
    control,
    name: `items.${index}.tax`,
  });

  const currency = useWatch({
    control: control,
    name: "currency"
  })

  const subtotal = (quantity || 0) * Number(price || 0) * (1 + Number(tax || 0) / 100);

  return (
    <TableRow className="group">
      <TableCell className="py-0 pl-0">
        <FormField
          control={control}
          name={`items.${index}.description`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Descripción del item..."
                  className="border-0 rounded-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[100px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Cantidad"
                  min={0}
                  type="number"
                  className="border-0 rounded-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`items.${index}.price`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[150px]">
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    placeholder="500.00"
                    className="pl-9 border-0 rounded-none"
                    inputMode="decimal"
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/,/g, '');

                      const regex = /^\d*(\.\d{0,2})?$/;
                      if (regex.test(value)) {
                        field.onChange(value);
                      }
                    }}
                  />
                  <div className="pointer-events-none absolute left-2 top-1/2 text-xs -translate-y-1/2 select-none opacity-50">
                    {currency}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`items.${index}.tax`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[100px]">
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-0 rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="21">21%</SelectItem>
                    <SelectItem value="10.5">10.5%</SelectItem>
                    <SelectItem value="0">Excento</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right pr-5 py-0 w-[250px]">
        {currency} <span>{subtotal.toFixed(2)}</span>
      </TableCell>
      <TableCell className="py-0 pr-5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 transition-opacity opacity-0 group-hover:opacity-100"
          onClick={() => remove(index)}
        >
          <Trash2 className="!h-3.5 !w-3.5 text-destructive" />
        </Button>
      </TableCell>
    </TableRow>
  )
}