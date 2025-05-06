import { Button } from "@/components/ui/button";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { Eye } from "lucide-react";
import { useParams } from "next/navigation";

export default function DocumentsTab() {
  const { id } = useParams<{ id: string }>()

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(id);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Remitos</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className="text-sm font-medium">xxxxxxxxxxx</span>
            <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Notas de crédito</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className="text-sm font-medium">xxxxxxxxxxx</span>
            <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye />
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-muted-foreground text-sm">Notas de débito</label>
          <div className="flex gap-2 items-center group w-fit">
            <span className="text-sm font-medium">xxxxxxxxxxx</span>
            <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <Eye />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}