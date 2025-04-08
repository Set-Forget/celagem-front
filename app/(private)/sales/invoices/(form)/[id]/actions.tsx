import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateStateMessageMap } from "./utils";
import { useUpdateInvoiceMutation } from "@/lib/services/invoices";

export default function Actions({ state, type }: { state?: 'draft' | 'posted' | 'cancel', type?: 'credit_note' | 'debit_note' | 'invoice' }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateInvoiceMutation();

  const handleUpdateInvoice = async (state: 'draft' | 'posted' | 'cancel') => {
    try {
      const response = await updateInvoice({
        id: Number(id),
        state
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description={updateStateMessageMap[state].success} variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description={updateStateMessageMap[state].error} variant="error" />)
    }
  }

  const handleGeneratePDF = async () => {
    const { generateInvoicePDF } = await import("../../templates/invoice")
    generateInvoicePDF()
  }

  if (!state || !type) {
    return null
  }

  if (state === "draft") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleUpdateInvoice("cancel")}
            loading={isInvoiceUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isInvoiceUpdating && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={() => handleUpdateInvoice("posted")}
          loading={isInvoiceUpdating}
        >
          <Check className={cn(isInvoiceUpdating && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  if (state === "posted" && type === "invoice") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={handleGeneratePDF}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
        </Dropdown>
        <Dropdown
          trigger={
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          }
        >
          <DropdownMenuItem
            onClick={() => router.push(`/purchases/purchase-receipts/new`)}
          >
            Registro de pago
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/sales/credit-notes/new?invoiceId=${id}`)}
          >
            Nota de crédito
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/sales/debit-notes/new?invoiceId=${id}`)}
          >
            Nota de débito
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/sales/delivery-notes/new?invoiceId=${id}`)}
          >
            Remito
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }

  if (state === "posted" && type === "credit_note" || type === "debit_note") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={handleGeneratePDF}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          {/* 
            // ! Se deberían poder retornar las notas de crédito/débito a borrador, pero no se puede por el momento.
          */}
        </Dropdown>
      </div>
    )
  }

  if (state === "cancel") {
    return (
      <Button
        size="sm"
        onClick={() => handleUpdateInvoice("draft")}
        loading={isInvoiceUpdating}
      >
        <RotateCcw className={cn(isInvoiceUpdating && "hidden")} />
        Reabrir
      </Button>
    )
  }

  // ! Falta manejar el estado done.
}