import { ColumnDef } from "@tanstack/react-table"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export interface ProviderData {
  supplier_name: string
  contact_name: string
  contact_email: string
}

export const columns: ColumnDef<ProviderData>[] = [
  {
    accessorKey: "supplier_name",
    header: "Proveedor",
    cell: ({ row }) => {
      const index = row.index
      return (
        <FormField
          name={`suppliers.${index}.supplier_name`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Guantes S.A."
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
    accessorKey: "contact_name",
    header: "Contacto",
    cell: ({ row }) => {
      const index = row.index
      return (
        <FormField
          name={`suppliers.${index}.contact_name`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Juan Pérez"
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
    accessorKey: "contact_email",
    header: "Email",
    cell: ({ row }) => {
      const index = row.index
      return (
        <FormField
          name={`suppliers.${index}.contact_email`}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormControl>
                <Input
                  {...field}
                  placeholder="juan@perez.com"
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
