import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { EditIcon, Ellipsis, FileTextIcon } from "lucide-react";

export default function Actions() {

  const handleGeneratePDF = async () => {
    const { generatePurchaseReceiptPDF } = await import("../templates/purchase-receipt")
    generatePurchaseReceiptPDF()
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
      {/*       <DropdownMenuItem onSelect={() => console.log("Editar")}>
        <EditIcon />
        Editar
      </DropdownMenuItem> */}
      {/*     <DropdownMenuItem
      onSelect={() => handleUpdatePurchaseRequest("cancelled")}
      loading={isPurchaseRequestUpdating}
      className="text-destructive focus:text-destructive"
    >
      <CircleX className={cn(isPurchaseRequestUpdating && "hidden")} />
      Cancelar
    </DropdownMenuItem> */}
    </Dropdown>
  )
}