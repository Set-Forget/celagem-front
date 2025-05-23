import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useCancelPaymentMutation, useConfirmPaymentMutation, useGetPaymentQuery } from "@/lib/services/payments";
import { cn } from "@/lib/utils";
import { Check, CircleX, Ellipsis } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Actions() {
  const { id } = useParams<{ id: string }>()

  const { data: payment } = useGetPaymentQuery(id);

  const [confirmPayment, { isLoading: isPaymentConfirming }] = useConfirmPaymentMutation();
  const [cancelPayment, { isLoading: isPaymentCancelling }] = useCancelPaymentMutation();

  const handleConfirmPayment = async () => {
    try {
      const response = await confirmPayment({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Registro de pago confirmado" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar el registro de pago" variant="error" />)
    }
  }

  const handleCancelPayment = async () => {
    try {
      const response = await cancelPayment({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Registro de pago cancelado" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar el registro de pago" variant="error" />)
    }
  }

  const state = payment?.state

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
          <DropdownMenuItem
            onSelect={handleCancelPayment}
            loading={isPaymentCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPaymentCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmPayment}
          loading={isPaymentConfirming}
        >
          <Check className={cn((isPaymentConfirming) && "hidden")} />
          Confirmar
        </Button>
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