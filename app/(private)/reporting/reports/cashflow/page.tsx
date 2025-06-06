import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import NestedAccountTable from "./components/nested-account-table";
import sampleData from "./data/accounts.json";

export default function CashFlowPage() {

  return (
    <>
      <Header title="Flujo de efectivo">
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto" asChild>
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Nueva cuenta
              </DropdownMenuItem>
              <DropdownMenuItem>
                Nuevo asiento
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <div className="flex flex-col p-4 h-full justify-between">
        <NestedAccountTable data={sampleData} />
      </div>
    </>
  )
}