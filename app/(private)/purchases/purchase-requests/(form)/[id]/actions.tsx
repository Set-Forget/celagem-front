import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelPurchaseRequestMutation, useConfirmPurchaseRequestMutation, useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PurchaseRequestState } from "../../schemas/purchase-requests";
import { generatePDF } from "@/lib/templates/utils";

export default function Actions({ state }: { state?: PurchaseRequestState }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const { data: purchaseRequest } = useGetPurchaseRequestQuery(id, {
    skip: !id,
  })

  const [confirmPurchaseRequest, { isLoading: isPurchaseRequestConfirming }] = useConfirmPurchaseRequestMutation();
  const [cancelPurchaseRequest, { isLoading: isPurchaseRequestCancelling }] = useCancelPurchaseRequestMutation()

  const handleConfirmPurchaseRequest = async () => {
    try {
      const response = await confirmPurchaseRequest({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Solicitud de pedido confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la solicitud de pedido" variant="error" />)
    }
  }

  const handleCancelPurchaseRequest = async () => {
    try {
      const response = await cancelPurchaseRequest({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Solicitud de pedido cancelada" variant="success" />)
      }
    }
    catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la solicitud de pedido" variant="error" />)
    }
  }

  const handleGeneratePDF = async () => {
    if (!purchaseRequest) {
      throw new Error('No se ha encontrado la solicitud de pedido')
    }
    try {
      const pdf = await generatePDF({
        templateName: 'purchaseRequest',
        data: purchaseRequest,
      })
      pdf.view()
    } catch (error) {
      toast.custom(t => (
        <CustomSonner t={t} description="Error al generar el PDF" variant="error" />
      ))
      console.error('Error al generar el PDF:', error)
    }
  }


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
          <DropdownMenuItem onSelect={() => router.push(`/purchases/purchase-requests/${id}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelPurchaseRequest}
            loading={isPurchaseRequestCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseRequestCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmPurchaseRequest}
          loading={isPurchaseRequestConfirming}
        >
          <Check className={cn(isPurchaseRequestConfirming && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  if (state === "approved") {
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelPurchaseRequest}
            loading={isPurchaseRequestCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseRequestCancelling && "hidden")} />
            Cancelar
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
            onSelect={() => router.push(`/purchases/purchase-orders/new?purchase_request_id=${id}`)}
          >
            Orden de compra
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }

  if (state === "ordered") {
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
      </div>
    )
  }

  // if (state === "cancelled") {
  //   return (
  //     <Button
  //       size="sm"
  //     //onClick={() => handleUpdatePurchaseRequest("draft")}
  //     //loading={isPurchaseRequestUpdating}
  //     >
  //       <RotateCcw className={cn(/* isPurchaseRequestUpdating && "hidden" */)} />
  //       Reabrir
  //     </Button>
  //   )
  // }

}