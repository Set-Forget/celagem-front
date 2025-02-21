'use client'

import { DataTable } from "@/components/data-table"
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn, placeholder } from "@/lib/utils"
import { useGetPurchaseOrderQuery } from "@/services/purchase-orders"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Box, ChevronDown, Eye, Paperclip } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { PURCHASE_ORDER_STATUS } from "../adapters/customers"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"

export default function PurchaseOrderPage() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseOrder, isLoading } = useGetPurchaseOrderQuery(id);

  const handleGeneratePDF = async () => {
    const { generatePurchaseOrderPDF } = await import("../templates/purchase-order")
    generatePurchaseOrderPDF()
  }

  const status = PURCHASE_ORDER_STATUS[purchaseOrder?.status as keyof typeof PURCHASE_ORDER_STATUS]

  return (
    <>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
          {isLoading ? placeholder(7, true) : purchaseOrder?.number}
        </h1>
      }>
        <div className="mr-auto">
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
          >
            {status?.label}
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
              <DropdownMenuItem
                onClick={() => handleGeneratePDF()}
              >
                Generar PDF
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
                  Recepciones
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Factura de compra
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitado por</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {isLoading ? placeholder(10) : purchaseOrder?.required_by}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de requerimiento</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {isLoading ? placeholder(13) : format(purchaseOrder!.required_date, "dd MMM yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de creación</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {isLoading ? placeholder(13) : format(purchaseOrder!.purchase_order_date, "dd MMM yyyy", { locale: es })}
              </span>
            </div>
          </div>
        </div>
        <DataTable
          data={purchaseOrder?.items.map((item) => ({ ...item, currency: purchaseOrder?.currency })) ?? []}
          loading={isLoading}
          columns={columns}
          pagination={false}
          footer={() => <TableFooter />}
        />
      </div>
      <Tabs className="mt-4" defaultValue="tab-2">
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Box
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Proveedor
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Paperclip
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Documentos
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-2" className="m-0">
          <div className="p-4 flex flex-col gap-4">
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
        </TabsContent>
        <TabsContent value="tab-3" className="m-0">
          <div className="p-4 flex flex-col gap-4">
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
                <label className="text-muted-foreground text-sm">Recepciones de compra</label>
                <div className="flex gap-2 items-center group w-fit">
                  <span className="text-sm font-medium">RC-4500001782</span>
                  <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
