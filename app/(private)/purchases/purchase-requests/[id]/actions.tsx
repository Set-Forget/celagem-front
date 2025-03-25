import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { updateStateMessageMap } from "./utils";
import { useUpdatePurchaseRequestMutation } from "@/lib/services/purchase-requests";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Actions({ state }: { state?: "draft" | "approved" | "ordered" | "cancelled" }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [updatePurchaseRequest, { isLoading: isPurchaseRequestUpdating }] = useUpdatePurchaseRequestMutation();

  const handleUpdatePurchaseRequest = async (state: "draft" | "approved" | "cancelled" | "ordered") => {
    try {
      const response = await updatePurchaseRequest({
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
    const { generatePurchaseRequestPDF } = await import("../templates/purchase-request")
    generatePurchaseRequestPDF()
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
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleUpdatePurchaseRequest("cancelled")}
            loading={isPurchaseRequestUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseRequestUpdating && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={() => handleUpdatePurchaseRequest("approved")}
          loading={isPurchaseRequestUpdating}
        >
          <Check className={cn(isPurchaseRequestUpdating && "hidden")} />
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
            onSelect={() => handleUpdatePurchaseRequest("cancelled")}
            loading={isPurchaseRequestUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isPurchaseRequestUpdating && "hidden")} />
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

  if (state === "cancelled") {
    return (
      <Button
        size="sm"
        onClick={() => handleUpdatePurchaseRequest("draft")}
        loading={isPurchaseRequestUpdating}
      >
        <RotateCcw className={cn(isPurchaseRequestUpdating && "hidden")} />
        Reabrir
      </Button>
    )
  }

}