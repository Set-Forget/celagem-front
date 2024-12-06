import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { ChevronDown } from "lucide-react"
import { PurchaseRequestItemsTable } from "./components/purchase-request-items-table"

export default async function PurchaseRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  return (
    <>
      <Header title="RC-2000342">
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                Crear
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  Devolución de compra
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Factura de compra
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Header>
      <Separator />
      <div className="flex flex-col gap-4 py-4 flex-1">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Número de orden de compra
              </label>
              <span className="text-sm">
                4500009257
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Proveedor</label>
              <span className="text-sm">
                Miller PLC
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de recepción</label>
              <span className="text-sm">12 de febrero de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Sede</label>
              <span className="text-sm">Sede principal</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Items</h2>
          </div>
          <PurchaseRequestItemsTable />
        </div>
      </div>
    </>
  )
}
