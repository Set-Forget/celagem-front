import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelDebitNoteMutation, useConfirmDebitNoteMutation, useGetDebitNoteQuery } from "@/lib/services/debit-notes";
import { cn } from "@/lib/utils";
import { Check, CircleX, EditIcon, Ellipsis, FileTextIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { DebitNoteStatus } from "../../schemas/debit-notes";
import { generatePDF } from "@/lib/templates/utils.client";

export default function Actions({ state }: { state?: DebitNoteStatus }) {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const router = useRouter()

  const { data: debitNote } = useGetDebitNoteQuery(id, { skip: !id });

  const [confirmDebitNote, { isLoading: isDebitNoteConfirming }] = useConfirmDebitNoteMutation();
  const [cancelDebitNote, { isLoading: isDebitNoteCancelling }] = useCancelDebitNoteMutation();

  const handleConfirmDebitNote = async () => {
    try {
      const response = await confirmDebitNote({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Nota de débito confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la nota de débito" variant="error" />)
    }
  }

  const handleCancelDebitNote = async () => {
    try {
      const response = await cancelDebitNote({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra cancelada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la factura de compra" variant="error" />)
    }
  }

  const handleGeneratePDF = async () => {
    if (!debitNote) throw Error("No se ha encontrado la factura de compra")
    try {
      const pdf = await generatePDF({
        templateName: 'debitNote',
        data: debitNote,
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
          <DropdownMenuItem onSelect={handleGeneratePDF}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/${scope}/debit-notes/${id}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelDebitNote}
            loading={isDebitNoteCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isDebitNoteCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={() => handleConfirmDebitNote()}
          loading={isDebitNoteConfirming}
        >
          <Check className={cn(isDebitNoteConfirming && "hidden")} />
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
          <DropdownMenuItem onSelect={handleGeneratePDF}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          {/* 
            // ! Se deberían poder retornar las notas de crédito/débito a borrador, pero no se puede por el momento.
          */}
        </Dropdown>
      </div>
    )
  }

  /* if (state === "cancel") {
    return (
      <Button
        size="sm"
        onClick={() => handleUpdateDebitNote("draft")}
        loading={isDebitNoteUpdating}
      >
        <RotateCcw className={cn(isDebitNoteUpdating && "hidden")} />
        Reabrir
      </Button>
    )
  } */

  // ! Falta manejar el estado done.
}