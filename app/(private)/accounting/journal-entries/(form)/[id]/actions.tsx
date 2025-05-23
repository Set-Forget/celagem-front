import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelJournalEntryMutation, useConfirmJournalEntryMutation } from "@/lib/services/journal-entries";
import { cn } from "@/lib/utils";
import { Ban, Check, EditIcon, Ellipsis } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { JournalEntryStatus } from "../../schemas/journal-entries";

export default function Actions({ state }: { state?: JournalEntryStatus }) {
  const { id } = useParams<{ id: string }>()

  const [confirmJournalEntry, { isLoading: isJournalEntryConfirming }] = useConfirmJournalEntryMutation();
  const [cancelJournalEntry, { isLoading: isJournalEntryCancelling }] = useCancelJournalEntryMutation();

  const handleConfirmJournalEntry = async () => {
    try {
      const response = await confirmJournalEntry(id).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Asiento confirmado" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar el asiento" variant="error" />)
    }
  }

  const handleCancelJournalEntry = async () => {
    try {
      const response = await cancelJournalEntry(id).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Asiento cancelado" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar el asiento" variant="error" />)
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
          <DropdownMenuItem
            onSelect={handleCancelJournalEntry}
            loading={isJournalEntryCancelling}
            className="text-destructive focus:text-destructive"
          >
            <Ban className={cn(isJournalEntryCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmJournalEntry}
          loading={isJournalEntryConfirming}
        >
          <Check className={cn(isJournalEntryConfirming && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  /*   if (state === "posted") {
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
              //onSelect={() => handleUpdateJournalEntry("cancel")}
              loading={isJournalEntryConfirming}
              className="text-destructive focus:text-destructive"
            >
              <Undo className={cn(isJournalEntryConfirming && "hidden")} />
              Revertir
            </DropdownMenuItem>
          </Dropdown>
        </div>
      )
    } */
}