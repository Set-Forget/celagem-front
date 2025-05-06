import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Ellipsis, FileTextIcon } from "lucide-react";

export default function Actions() {
  return (
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
    </Dropdown>
  )
}