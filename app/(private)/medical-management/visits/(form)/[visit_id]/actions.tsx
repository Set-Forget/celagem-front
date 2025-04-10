import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { EditIcon, Ellipsis, FileDown, FileTextIcon, Signature } from "lucide-react";

export default function Actions({ state }: { state?: 'DRAFT' | 'SIGNED' }) {

  if (!state) {
    return null
  }

  if (state === "DRAFT") {
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
        </Dropdown>
        <Button size="sm">
          <Signature />
          Firmar visita
        </Button>
      </div>
    )
  }

  if (state === "SIGNED") {
    return (
      <Button
        size="sm"
        variant="outline"
      >
        <FileDown />
        Exportar
      </Button>
    )
  }
}