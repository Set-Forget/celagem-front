import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useFieldArray, useFormContext } from "react-hook-form"
import { z } from "zod"

import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { newQuotationRequestSchema } from "../../../schemas/quotation-requests"
import ItemRow from "./item-row"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ProviderSelect from "./provider-select"
import { FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import ProviderContactSelect from "./provider-contact-select"

export default function ItemsTable() {
  const { control } = useFormContext<z.infer<typeof newQuotationRequestSchema>>()

  const { fields, remove: removeItem } = useFieldArray({
    control: control,
    name: "suppliers",
  });

  return (
    <Dialog>
      <div className="flex flex-col gap-2 flex-grow">
        <div className="flex flex-col border rounded-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-9 pl-3">Proveedor</TableHead>
                <TableHead className="h-9">Contacto</TableHead>
                <TableHead className="h-9">Email</TableHead>
                <TableHead className="w-9 h-9"></TableHead>
              </TableRow>
            </TableHeader>
            <TableCaption className="m-0 text-center text-muted-foreground text-xs">
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  type="button"
                  variant="ghost"
                  className="h-9 border-b rounded-none w-full"
                >
                  <Plus />
                  Agregar Proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[700px] max-w-none">
                <DialogHeader>
                  <DialogTitle>
                    Selecciona un proveedor
                  </DialogTitle>
                  <DialogDescription>
                    Buscá un proveedor y seleccionar un contacto para enviar la solicitud de cotización.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2 items-center mt-2">
                  <div className="flex flex-col gap-2">
                    <FormLabel className="w-fit">Proveedor</FormLabel>
                    <ProviderSelect />
                    <FormDescription>
                      Este será el proveedor al que se le enviará la solicitud de cotización.
                    </FormDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <FormLabel className="w-fit">Contacto</FormLabel>
                    <ProviderContactSelect />
                    <FormDescription>
                      Este será el contacto del proveedor al que se le enviará la solicitud de cotización.
                    </FormDescription>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    size="sm"
                  >
                    Seleccionar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </TableCaption>
            <TableBody scrollBarClassName="pt-[40px]">
              {fields.map((item, index) => (
                <ItemRow key={item.id} index={index} remove={removeItem} />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Dialog>
  )
}