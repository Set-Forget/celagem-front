import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useDeleteJournalEntryMutation, useUpdateJournalEntryMutation } from "@/lib/services/journal-entries";
import { cn } from "@/lib/utils";
import { Check, EditIcon, Ellipsis, Trash2, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateStateMessageMap } from "./utils";

export default function Actions({ state }: { state?: 'draft' | 'posted' }) {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [updateJournalEntry, { isLoading: isJournalEntryUpdating }] = useUpdateJournalEntryMutation();
  const [deleteJournalEntry, { isLoading: isJournalEntryDeleting }] = useDeleteJournalEntryMutation();

  const handleUpdateJournalEntry = async (state: 'draft' | 'posted') => {
    try {
      const response = await updateJournalEntry({
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

  const handleDeleteJournalEntry = async () => {
    try {
      const response = await deleteJournalEntry(Number(id)).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Asiento eliminado" variant="success" />)
        router.push("/accounting/journal-entries")
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al eliminar el asiento" variant="error" />)
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
          <DropdownMenuItem onSelect={() => console.log("Editar")}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleDeleteJournalEntry()}
            loading={isJournalEntryDeleting}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className={cn(isJournalEntryDeleting && "hidden")} />
            Eliminar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={() => handleUpdateJournalEntry("posted")}
          loading={isJournalEntryUpdating}
        >
          <Check className={cn(isJournalEntryUpdating && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            //onSelect={() => handleUpdateJournalEntry("cancel")}
            loading={isJournalEntryUpdating}
            className="text-destructive focus:text-destructive"
          >
            <Undo className={cn(isJournalEntryUpdating && "hidden")} />
            Revertir
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }
}