import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useUpdateBillMutation } from "@/lib/services/bills";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, RotateCcw } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { updateStateMessageMap } from "./utils";

export default function Actions({ state }: { state?: 'draft' | 'posted' | 'cancel' }) {
  const { id } = useParams<{ id: string }>()

  const [updateBill, { isLoading: isBillUpdating }] = useUpdateBillMutation();

  const handleUpdateBill = async (state: 'draft' | 'posted' | 'cancel') => {
    try {
      const response = await updateBill({
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
          <DropdownMenuItem>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleUpdateBill("cancel")}
            loading={isBillUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isBillUpdating && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          //onClick={() => handleUpdateBill("to approve")}
          loading={isBillUpdating}
        >
          <Check className={cn(isBillUpdating && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }
  // ! Falta que exista el estado de aprobación y manejarlo.
  /*   if (state === "to approve") {
      return (
        <div className="flex gap-2">
          <Dropdown
            trigger={
              <Button size="icon" variant="outline" className="h-8 w-8">
                <Ellipsis />
              </Button>
            }
          >
            <DropdownMenuItem>
              <FileTextIcon />
              Previsualizar
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log("Editar")}>
              <EditIcon />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => handleUpdateBill("cancel")}
              loading={isBillUpdating}
              className="text-destructive focus:text-destructive"
            >
              <CircleX className={cn(isBillUpdating && "hidden")} />
              Cancelar
            </DropdownMenuItem>
          </Dropdown>
          <Button
            size="sm"
            onClick={() => handleUpdateBill("purchase")}
            loading={isBillUpdating}
          >
            <Stamp className={cn(isBillUpdating && "hidden")} />
            Aprobar
          </Button>
        </div>
      )
    } */

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
          <DropdownMenuItem>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleUpdateBill("cancel")}
            loading={isBillUpdating}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isBillUpdating && "hidden")} />
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
          <DropdownMenuItem>
            Factura de compra
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }

  if (state === "cancel") {
    return (
      <Button
        size="sm"
        onClick={() => handleUpdateBill("draft")}
        loading={isBillUpdating}
      >
        <RotateCcw className={cn(isBillUpdating && "hidden")} />
        Reabrir
      </Button>
    )
  }

  // ! Falta manejar el estado done.
}