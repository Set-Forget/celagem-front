import { FormControl, FormField, FormItem } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  TableCell,
  TableRow
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { useFormContext } from "react-hook-form"
//import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"

export default function ItemRow({ index, remove }: { index: number, remove: (index: number) => void }) {
  const { control } = useFormContext()

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
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`items.${index}.item_name`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[150px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Guante de nitrilo"
                  className="border-0 rounded-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`items.${index}.item_code`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[150px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="GIF-H180J"
                  className="border-0 rounded-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="py-0">
        <FormField
          control={control}
          name={`items.${index}.received_quantity`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[100px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Cantidad recibida"
                  min={0}
                  type="number"
                  className="border-0 rounded-none"
                />
              </FormControl>
            </FormItem>
          )}
        />
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