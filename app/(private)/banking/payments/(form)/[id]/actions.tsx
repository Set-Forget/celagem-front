import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelPaymentMutation, useConfirmPaymentMutation, useGetPaymentQuery } from "@/lib/services/payments";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { generatePDF } from "@/lib/templates/utils";
import { cn } from "@/lib/utils";
import { Check, CircleX, Ellipsis, FileTextIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Actions() {
  const { id } = useParams<{ id: string }>()

  const [sendMessage] = useSendMessageMutation();
  const [confirmPayment, { isLoading: isPaymentConfirming }] = useConfirmPaymentMutation();
  const [cancelPayment, { isLoading: isPaymentCancelling }] = useCancelPaymentMutation();

  const { data: payment } = useGetPaymentQuery(id);

  const handleConfirmPayment = async () => {
    try {
      const response = await confirmPayment({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Registro de pago confirmado" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar el registro de pago" variant="error" />)
      sendMessage({
        location: "app/(private)/banking/payments/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleConfirmPayment"
      }).unwrap().catch((error) => {
        console.error(error);
      });
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
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar el registro de pago" variant="error" />)
      sendMessage({
        location: "app/(private)/banking/payments/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleCancelPayment"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  const handleGeneratePDF = async () => {
    if (!payment) {
      throw new Error('No se ha encontrado el registro de pago')
    }
    try {
      const pdf = await generatePDF({
        templateName: 'payment',
        data: payment,
      })
      pdf.view()
    } catch (error) {
      toast.custom(t => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
      sendMessage({
        location: "app/(private)/banking/payments/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleGeneratePDF"
      })
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
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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

  if (state === "paid") {
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