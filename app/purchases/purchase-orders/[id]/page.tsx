import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronDown, Eye } from "lucide-react"
import Link from "next/link"
import { PurchaseOrderItemsTable } from "./components/purchase-order-items-table"

export default async function PurchaseOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  return (
    <>
      <Header title="Compra de guantes quirúrgicos">
        <div className="mr-auto">
          <Badge
            variant="outline"
            className={cn(`bg-amber-100 text-amber-800 border-none rounded-sm`)}
          >
            Pendiente
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              Acciones
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Cerrar orden de compra
              </DropdownMenuItem>
              <DropdownMenuItem>
                Cancelar orden de compra
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/purchases/purchase-receipts/new">
                  Recibo de compra
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Factura de compra
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <Separator />
      <div className="flex flex-col gap-4 py-4 flex-1">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitado por</label>
              <span className="text-sm">Juan Perez</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitado el</label>
              <span className="text-sm">12 de enero de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitado para</label>
              <span className="text-sm">12 de febrero de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Número de orden</label>
              <span className="text-sm">OC-4500001782</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Datos del proveedor</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Proveedor</label>
              <span className="text-sm">Guantes S.A.</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Nombre del contacto</label>
              <span className="text-sm">Juan Perez</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Email del contacto</label>
              <span className="text-sm">juan@gmail.com</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Teléfono del contacto</label>
              <span className="text-sm">+54 9 11 1234 5678</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Dirección</label>
              <span className="text-sm">Av. Corrientes 1234</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Items</h2>
          </div>
          <PurchaseOrderItemsTable />
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Documentos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Facturas de compra</label>
              <div className="flex gap-2 items-center group w-fit">
                <span className="text-sm font-medium">FC-4500001782</span>
                <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Recibos de compra</label>
              <div className="flex gap-2 items-center group w-fit">
                <span className="text-sm font-medium">RC-4500001782</span>
                <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}