import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useCancelCreditNoteMutation, useConfirmCreditNoteMutation, useGetCreditNoteQuery } from "@/lib/services/credit-notes";
import { cn } from "@/lib/utils";
import { Check, CircleX, EditIcon, Ellipsis, FileTextIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditNoteStatus } from "../../schemas/credit-notes";
import { generatePDF } from "@/lib/templates/utils";

export default function Actions({ state }: { state?: CreditNoteStatus }) {
  const { id, scope } = useParams<{ id: string, scope: "sales" | "purchases" }>()

  const router = useRouter()

  const { data: creditNote } = useGetCreditNoteQuery(id, {
    skip: !id,
  })

  const [confirmCreditNote, { isLoading: isCreditNoteConfirming }] = useConfirmCreditNoteMutation();
  const [cancelCreditNote, { isLoading: isCreditNoteCancelling }] = useCancelCreditNoteMutation();

  const handleConfirmCreditNote = async () => {
    try {
      const response = await confirmCreditNote({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la nota de crédito" variant="error" />)
    }
  }

  const handleCancelCreditNote = async () => {
    try {
      const response = await cancelCreditNote({
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
    if (!creditNote) throw Error("No se ha encontrado la factura de compra")
    try {
      const pdf = await generatePDF({
        templateName: 'creditNote',
        data: creditNote,
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
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/${scope}/credit-notes/${id}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={handleCancelCreditNote}
            loading={isCreditNoteCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isCreditNoteCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleConfirmCreditNote}
          loading={isCreditNoteConfirming}
        >
          <Check className={cn(isCreditNoteConfirming && "hidden")} />
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

  /*   if (state === "cancel") {
      return (
        <Button
          size="sm"
          onClick={() => handleUpdateCreditNote("draft")}
          loading={isCreditNoteUpdating}
        >
          <RotateCcw className={cn(isCreditNoteUpdating && "hidden")} />
          Reabrir
        </Button>
      )
    } */

  // ! Falta manejar el estado done.
}