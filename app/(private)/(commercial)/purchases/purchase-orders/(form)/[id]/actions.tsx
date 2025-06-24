import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdaptedPurchaseOrderDetail } from "@/lib/adapters/purchase-order";
import { useApprovePurchaseOrderMutation, useCancelPurchaseOrderMutation, useConfirmPurchaseOrderMutation, useGetPurchaseOrderQuery, useResetPurchaseOrderMutation } from "@/lib/services/purchase-orders";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { generatePDF } from "@/lib/templates/utils";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw, Stamp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Actions({ state }: { state?: AdaptedPurchaseOrderDetail['status'] }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(id)

  const [sendMessage] = useSendMessageMutation();
  const [confirmPurchaseOrder, { isLoading: isPurchaseOrderConfirming }] = useConfirmPurchaseOrderMutation();
  const [cancelPurchaseOrder, { isLoading: isPurchaseOrderCancelling }] = useCancelPurchaseOrderMutation()
  const [approvePurchaseOrder, { isLoading: isPurchaseOrderApproving }] = useApprovePurchaseOrderMutation()
  const [resetPurchaseOrder, { isLoading: isPurchaseOrderReseting }] = useResetPurchaseOrderMutation()

  const handleConfirmPurchaseOrder = async () => {
    try {
      const response = await confirmPurchaseOrder({
        id: id,
        purchaseRequestId: purchaseOrder?.purchase_request?.id || undefined,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra confirmada" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la orden de compra" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-orders/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleConfirmPurchaseOrder"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  const handleCancelPurchaseOrder = async ({ rejectionReason }: { rejectionReason?: string } = { rejectionReason: undefined }) => {
    try {
      const response = await cancelPurchaseOrder({
        id: id,
        rejection_reason: rejectionReason || "",
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description={`Orden de compra ${rejectionReason ? "rechazada" : "cancelada"}`} variant="success" />)
      }
    }
    catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la orden de compra" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-orders/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleCancelPurchaseOrder"
      }).unwrap().catch((error) => {
        console.error(error);
      });
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
      toast.custom((t) => <CustomSonner t={t} description="Error al aprobar la orden de compra" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-orders/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleApprovePurchaseOrder"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  const handleResetPurchaseOrder = async () => {
    try {
      const response = await resetPurchaseOrder({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra restablecida a borrador" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al restablecer la orden de compra" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-orders/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleResetPurchaseOrder"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  const handleGeneratePDF = async () => {
    if (!purchaseOrder) throw new Error("No se ha encontrado la orden de compra")
    try {
      const pdf = await generatePDF({
        templateName: 'purchaseOrder',
        data: purchaseOrder,
      });
      pdf.view();
    } catch (error) {
      sendMessage({
        location: "app/(private)/(commercial)/purchases/purchase-orders/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleGeneratePDF"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      toast.custom((t) => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />);
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
          <DropdownMenuItem onSelect={() => router.push(`/purchases/purchase-orders/${id}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleCancelPurchaseOrder()}
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

  if (state === "to_approve") {
    return (
      <div className="flex gap-2">
        <Dropdown
          modal={false}
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
          <DropdownMenuItem onSelect={() => router.push(`/purchases/purchase-orders/${id}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog modal>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={e => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <CircleX className={cn(isPurchaseOrderCancelling && "hidden")} />
                Rechazar
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col gap-2">
                <DialogHeader>
                  <DialogTitle>
                    Rechazar orden de compra
                  </DialogTitle>
                  <DialogDescription>
                    Una vez que se rechazada la orden de compra, podrá ser reabierta y editada.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();

                const data = new FormData(e.currentTarget);
                const rejectionReason = data.get("rejection_reason") as string;
                if (!rejectionReason) return toast.custom((t) => <CustomSonner t={t} description="Por favor, ingrese un motivo de rechazo" variant="error" />)

                handleCancelPurchaseOrder({ rejectionReason })
              }}>
                <div className="*:not-first:mt-2">
                  <Label>
                    Motivo de rechazo
                  </Label>
                  <Input
                    name="rejection_reason"
                    type="text"
                    placeholder="Motivo de rechazo..."
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      className="flex-1"
                    >
                      Cerrar
                    </Button>
                  </DialogClose>
                  <Button
                    loading={isPurchaseOrderCancelling}
                    type="submit"
                    size="sm"
                  >
                    <CircleX className={cn(isPurchaseOrderCancelling && "hidden")} />
                    Rechazar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
        </Dropdown>
      </div>
    )
  }

  if (state === "cancel" || state === "rejected") {
    return (
      <Button
        size="sm"
        onClick={handleResetPurchaseOrder}
        loading={isPurchaseOrderReseting}
      >
        <RotateCcw className={cn(isPurchaseOrderReseting && "hidden")} />
        Reabrir
      </Button>
    )
  }
}