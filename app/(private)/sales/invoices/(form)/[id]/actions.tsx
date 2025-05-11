import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useApproveInvoiceMutation, useCancelInvoiceMutation, useConfirmInvoiceMutation } from "@/lib/services/invoices";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw, Stamp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { InvoiceStatus, InvoiceTypes } from "../../schemas/invoices";

export default function Actions({ state, type }: { state?: InvoiceStatus, type?: InvoiceTypes }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [confirmInvoice, { isLoading: isInvoiceConfirming }] = useConfirmInvoiceMutation();
  const [approveInvoice, { isLoading: isInvoiceApproving }] = useApproveInvoiceMutation();
  const [cancelInvoice, { isLoading: isInvoiceCancelling }] = useCancelInvoiceMutation();

  const handleConfirmInvoice = async () => {
    try {
      const response = await confirmInvoice({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la factura de venta" variant="error" />)
    }
  }

  const handleApproveInvoice = async () => {
    try {
      const response = await approveInvoice({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta aprobada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al aprobar la factura de venta" variant="error" />)
    }
  }

  const handleCancelInvoice = async () => {
    try {
      const response = await cancelInvoice({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta cancelada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la factura de venta" variant="error" />)
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
            onSelect={handleCancelInvoice}
            loading={isInvoiceCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isInvoiceCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmInvoice}
          loading={isInvoiceConfirming}
        >
          <Check className={cn(isInvoiceConfirming && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  if (state === "to_approve") {
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
            onSelect={handleCancelInvoice}
            loading={isInvoiceCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isInvoiceCancelling && "hidden")} />
            Rechazar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleApproveInvoice}
          loading={isInvoiceApproving}
        >
          <Stamp className={cn(isInvoiceApproving && "hidden")} />
          Aprobar
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
            onClick={() => router.push(`/credit-notes/new?invoiceId=${id}`)}
          >
            Nota de crédito
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/debit-notes/new?invoiceId=${id}`)}
          >
            Nota de débito
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`sales/delivery-notes/new?invoiceId=${id}`)}
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

  // ! No se puede re-abrir por el momento.
  if (state === "cancel") {
    return (
      <Button
        size="sm"
      >
        <RotateCcw /* className={cn(isInvoiceUpdating && "hidden")} */ />
        Reabrir
      </Button>
    )
  }

  // ! Falta manejar el estado done.
}