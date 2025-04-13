import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw, Stamp } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUpdatePurchaseOrderMutation } from "@/lib/services/purchase-orders";
import { updateStateMessageMap } from "./utils";
import { generatePDF } from "@/templates/utils.client";

export default function Actions({ state }: { state?: "draft" | "sent" | "to approve" | "purchase" | "done" | "cancel" }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [updatePurchaseOrder, { isLoading: isPurchaseOrderUpdating }] = useUpdatePurchaseOrderMutation();

  const handleUpdatePurchaseOrder = async (state: "draft" | "sent" | "to approve" | "purchase" | "done" | "cancel") => {
    try {
      const response = await updatePurchaseOrder({
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
            onSelect={() => handleUpdatePurchaseOrder("cancel")}
            loading={isPurchaseOrderUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseOrderUpdating && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={() => handleUpdatePurchaseOrder("to approve")}
          loading={isPurchaseOrderUpdating}
        >
          <Check className={cn(isPurchaseOrderUpdating && "hidden")} />
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
            onSelect={() => handleUpdatePurchaseOrder("cancel")}
            loading={isPurchaseOrderUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseOrderUpdating && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={() => handleUpdatePurchaseOrder("purchase")}
          loading={isPurchaseOrderUpdating}
        >
          <Stamp className={cn(isPurchaseOrderUpdating && "hidden")} />
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleUpdatePurchaseOrder("cancel")}
            loading={isPurchaseOrderUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseOrderUpdating && "hidden")} />
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

  if (state === "cancel") {
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
  }

  // ! Falta manejar el estado done.
}