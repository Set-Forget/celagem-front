import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { routes } from "@/lib/routes";
import { useApproveInvoiceMutation, useCancelInvoiceMutation, useGetInvoiceQuery } from "@/lib/services/invoices";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { generatePDF } from "@/lib/templates/utils";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, Stamp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { InvoiceStatus, InvoiceTypes } from "../../schemas/invoices";

export default function Actions({ state, type }: { state?: InvoiceStatus, type?: InvoiceTypes }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [sendMessage] = useSendMessageMutation();
  const [approveInvoice, { isLoading: isInvoiceApproving }] = useApproveInvoiceMutation();
  const [cancelInvoice, { isLoading: isInvoiceCancelling }] = useCancelInvoiceMutation();

  const { data: invoice } = useGetInvoiceQuery(id, { skip: !id });

  const handleApproveInvoice = async () => {
    try {
      const response = await approveInvoice({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta confirmada" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la factura de venta" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/sales/invoices/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleApproveInvoice"
      }).unwrap().catch((error) => {
        console.error(error);
      });
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
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la factura de venta" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/sales/invoices/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleCancelInvoice"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  const handleGeneratePDF = async () => {
    if (!invoice) throw Error("No se ha encontrado la factura de venta")
    try {
      const pdf = await generatePDF({
        templateName: 'invoice',
        data: invoice,
      });
      pdf.view();
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/sales/invoices/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleGeneratePDF"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  };

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
          <DropdownMenuItem onSelect={handleGeneratePDF}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/sales/invoices/${id}/edit`)}>
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
          onClick={handleApproveInvoice}
          loading={isInvoiceApproving}
        >
          <Check className={cn(isInvoiceApproving && "hidden")} />
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
          <DropdownMenuItem onSelect={handleGeneratePDF}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/sales/invoices/${id}/edit`)}>
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

  if (state === "posted") {
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
            onClick={() => router.push(routes.receipts.new(invoice?.id))}
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

  if (state === "done") {
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
        <Dropdown
          trigger={
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          }
        >
          <DropdownMenuItem
            onClick={() => router.push(`/sales/debit-notes/new?invoiceId=${id}`)}
          >
            Nota de débito
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }

  // // ! No se puede re-abrir por el momento.
  // if (state === "cancel") {
  //   return (
  //     <Button
  //       size="sm"
  //     >
  //       <RotateCcw /* className={cn(isInvoiceUpdating && "hidden")} */ />
  //       Reabrir
  //     </Button>
  //   )
  // }
}