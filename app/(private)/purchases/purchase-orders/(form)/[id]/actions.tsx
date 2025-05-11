import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useApprovePurchaseOrderMutation, useCancelPurchaseOrderMutation, useConfirmPurchaseOrderMutation, useGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { cn } from "@/lib/utils";
import { generatePDF } from "@/templates/utils.client";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, Stamp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PurchaseOrderState } from "../../schemas/purchase-orders";

export default function Actions({ state }: { state?: PurchaseOrderState }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(id)

  const [confirmPurchaseOrder, { isLoading: isPurchaseOrderConfirming }] = useConfirmPurchaseOrderMutation();
  const [cancelPurchaseOrder, { isLoading: isPurchaseOrderCancelling }] = useCancelPurchaseOrderMutation()
  const [approvePurchaseOrder, { isLoading: isPurchaseOrderApproving }] = useApprovePurchaseOrderMutation()

  const handleConfirmPurchaseOrder = async () => {
    try {
      const response = await confirmPurchaseOrder({
        id: id,
        purchaseRequestId: purchaseOrder?.purchase_request.id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la orden de compra" variant="error" />)
    }
  }

  const handleCancelPurchaseOrder = async () => {
    try {
      const response = await cancelPurchaseOrder({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra cancelada" variant="success" />)
      }
    }
    catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la orden de compra" variant="error" />)
    }
  }

  const handleApprovePurchaseOrder = async () => {
    try {
      const response = await approvePurchaseOrder({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra aprobada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al aprobar la orden de compra" variant="error" />)
    }
  }

  const handleGeneratePDF = async () => {
    try {
      const pdf = await generatePDF({
        templateName: 'purchaseOrder',
        data: { orderNumber: "1437" },
      });
      pdf.view();
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  if (!state) {
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
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelPurchaseOrder}
            loading={isPurchaseOrderCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseOrderCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmPurchaseOrder}
          loading={isPurchaseOrderConfirming}
        >
          <Check className={cn(isPurchaseOrderConfirming && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  if (state === "to approve") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelPurchaseOrder}
            loading={isPurchaseOrderCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseOrderCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleApprovePurchaseOrder}
          loading={isPurchaseOrderApproving}
        >
          <Stamp className={cn(isPurchaseOrderApproving && "hidden")} />
          Aprobar
        </Button>
      </div>
    )
  }

  if (state === "purchase") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
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
            onSelect={() => router.push(`/purchases/bills/new?purchase_order_id=${id}`)}
          >
            Factura de compra
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => router.push(`/purchases/purchase-receipts/new?purchase_order_id=${id}`)}
          >
            Recepción de compra
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }

  /*   if (state === "cancel") {
      return (
        <Button
          size="sm"
          onClick={() => handleUpdatePurchaseOrder("draft")}
          loading={isPurchaseOrderUpdating}
        >
          <RotateCcw className={cn(isPurchaseOrderUpdating && "hidden")} />
          Reabrir
        </Button>
      )
    } */

  // ! Falta manejar el estado done.
}