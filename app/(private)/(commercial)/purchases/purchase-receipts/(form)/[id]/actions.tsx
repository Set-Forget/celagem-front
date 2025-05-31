import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelPurchaseReceiptMutation, useGetPurchaseReceiptQuery, useValidatePurchaseReceiptMutation } from "@/lib/services/purchase-receipts";
import { generatePDF } from "@/lib/templates/utils";
import { Check, CircleX, EditIcon, Ellipsis, FileTextIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { PurchaseReceiptStatus } from "../../schemas/purchase-receipts";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

export default function Actions({ state }: { state?: PurchaseReceiptStatus }) {
  const router = useRouter();

  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt } = useGetPurchaseReceiptQuery(id);

  const [validatePurchaseReceipt, { isLoading: isPurchaseReceiptValidating }] = useValidatePurchaseReceiptMutation();
  const [cancelPurchaseReceipt, { isLoading: isPurchaseReceiptCancelling }] = useCancelPurchaseReceiptMutation();

  const handleValidatePurchaseReceipt = async () => {
    try {
      const response = await validatePurchaseReceipt({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Recepcion de compra confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la recepcion de compra" variant="error" />)
    }
  }

  const handleCancelPurchaseReceipt = async () => {
    try {
      const response = await cancelPurchaseReceipt({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Recepcion de compra cancelada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la recepcion de compra" variant="error" />)
    }
  };

  const handleGeneratePDF = async () => {
    if (!purchaseReceipt) throw new Error("No se ha encontrado la recepción de compra")
    try {
      const pdf = await generatePDF({
        templateName: 'reception',
        data: purchaseReceipt,
      });
      pdf.view();
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
      console.error('Error al generar el PDF:', error);
    }
  };

  if (!state) {
    return null
  }

  if (state === "draft" || state === "assigned") {
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
          <DropdownMenuItem onSelect={() => router.push(routes.purchaseReceipts.edit(id))}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelPurchaseReceipt}
            loading={isPurchaseReceiptCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseReceiptCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleValidatePurchaseReceipt}
          loading={isPurchaseReceiptValidating}
        >
          <Check className={cn(isPurchaseReceiptValidating && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  return (
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
  )
}