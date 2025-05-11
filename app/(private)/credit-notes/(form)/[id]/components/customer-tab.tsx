import { useGetCreditNoteQuery } from "@/lib/services/credit-notes";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";

export default function CustomerTab() {
  const { id } = useParams<{ id: string }>()

  const { data: creditNote, isLoading: isCreditNoteLoading } = useGetCreditNoteQuery(id ?? "", {
    skip: !id
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Cliente</label>
        <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isCreditNoteLoading ? placeholder(13) : creditNote?.partner.name || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Correo electrónico</label>
        <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isCreditNoteLoading ? placeholder(13) : creditNote?.partner.email || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Número de teléfono</label>
        <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isCreditNoteLoading ? placeholder(13) : creditNote?.partner.phone || "No especificado"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-muted-foreground text-sm">Dirección</label>
        <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isCreditNoteLoading ? placeholder(20) : creditNote?.partner.address || "No especificado"}
        </span>
      </div>
    </div>
  )
}