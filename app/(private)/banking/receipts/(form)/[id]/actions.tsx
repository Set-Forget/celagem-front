import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelChargeMutation, useConfirmChargeMutation, useGetChargeQuery } from "@/lib/services/receipts";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { generatePDF } from "@/lib/templates/utils";
import { cn } from "@/lib/utils";
import { Check, CircleX, Ellipsis, FileTextIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function Actions() {
  const { id } = useParams<{ id: string }>()

  const [sendMessage] = useSendMessageMutation();
  const [confirmCharge, { isLoading: isChargeConfirming }] = useConfirmChargeMutation();
  const [cancelCharge, { isLoading: isChargeCancelling }] = useCancelChargeMutation();

  const { data: charge } = useGetChargeQuery(id);

  const handleConfirmCharge = async () => {
    try {
      const response = await confirmCharge({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Registro de cobro confirmado" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar el registro de cobro" variant="error" />)
      sendMessage({
        location: "app/(private)/banking/receipts/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleConfirmCharge"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  const handleCancelCharge = async () => {
    try {
      const response = await cancelCharge({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Registro de cobro cancelado" variant="success" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar el registro de cobro" variant="error" />)
      sendMessage({
        location: "app/(private)/banking/receipts/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleCancelCharge"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  const handleGeneratePDF = async () => {
    if (!charge) {
      throw new Error('No se ha encontrado el registro de pago')
    }
    try {
      const pdf = await generatePDF({
        templateName: 'charge',
        data: charge,
      })
      pdf.view()
    } catch (error) {
      toast.custom(t => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
      sendMessage({
        location: "app/(private)/banking/charges/(form)/[id]/actions.tsx",
        rawError: error,
        fnLocation: "handleGeneratePDF"
      })
    }
  }

  const state = charge?.state

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
            onSelect={handleCancelCharge}
            loading={isChargeCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isChargeCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmCharge}
          loading={isChargeConfirming}
        >
          <Check className={cn((isChargeConfirming) && "hidden")} />
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