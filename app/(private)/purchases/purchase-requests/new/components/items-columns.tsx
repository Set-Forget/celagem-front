import { ColumnDef } from "@tanstack/react-table"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export interface ItemData {
  item_code: string
  item_name: string
  description: string
  quantity: number
}

export const columns: ColumnDef<ItemData>[] = [
  {
    accessorKey: "item_code",
    header: "Código",
    cell: ({ row }) => {
      const index = row.index
      return (
        <FormField
          name={`items.${index}.item_code`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="GIF-H180J"
                  className="border-0 rounded-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
  },
  {
    accessorKey: "item_name",
    header: "Nombre",
    cell: ({ row }) => {
      const index = row.index
      return (
        <FormField
          name={`items.${index}.item_name`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Guante de nitrilo"
                  className="border-0 rounded-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      const index = row.index
      return (
        <FormField
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
      )
    },
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      const index = row.index
      return (
        <FormField
          name={`items.${index}.quantity`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-[100px]">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Cantidad"
                  min={1}
                  type="number"
                  className="border-0 rounded-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const removeFn = (table.options.meta as any)?.remove

      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6 transition-opacity opacity-0 group-hover:opacity-100"
          onClick={() => removeFn(row.index)}
        >
          <Trash2 className="!h-3.5 !w-3.5 text-destructive" />
        </Button>
      )
    },
  },

]
