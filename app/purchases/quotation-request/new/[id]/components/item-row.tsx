
import { Button } from "@/components/ui/button"
import {
  TableCell,
  TableRow
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newQuotationRequestSchema } from "../../../schemas/quotation-requests"

export default function ItemRow({ index, remove }: { index: number, remove: (index: number) => void }) {
  const { getValues } = useFormContext<z.infer<typeof newQuotationRequestSchema>>()

  return (
    <TableRow className="group">
      <TableCell>
        {getValues().suppliers[index].supplier_name}
      </TableCell>
      <TableCell>
        {getValues().suppliers[index].contact_name}
      </TableCell>
      <TableCell>
        {getValues().suppliers[index].contact_email}
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