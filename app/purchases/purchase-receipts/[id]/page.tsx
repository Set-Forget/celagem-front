'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
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
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronDown, Eye, Paperclip, StickyNote } from "lucide-react"
import { useParams } from "next/navigation"
import { columns } from "./components/columns"

export default function PurchaseReceiptPage() {
  const { id } = useParams<{ id: string }>()

  const { data: purchaseReceipt, isLoading } = useGetPurchaseReceiptQuery(id);

  const handleGeneratePDF = async () => {
    const { generatePurchaseReceiptPDF } = await import("../templates/purchase-receipt")
    generatePurchaseReceiptPDF()
  }

  return (
    <>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
          {isLoading ? placeholder(11, true) : purchaseReceipt?.number}
        </h1>
      }>
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                Acciones
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
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
      <div className="flex flex-col gap-4 py-4">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Proveedor</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {!purchaseReceipt ? placeholder(10) : purchaseReceipt?.supplier}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Lugar de recepción</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {!purchaseReceipt ? placeholder(10) : purchaseReceipt?.reception_location}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de requerimiento</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {!purchaseReceipt ? placeholder(13) : format(purchaseReceipt?.scheduled_date, "dd MMM yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de recepción</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {!purchaseReceipt ? placeholder(13) : format(purchaseReceipt?.received_at, "dd MMM yyyy", { locale: es })}
              </span>
            </div>
          </div>
          <DataTable
            data={purchaseReceipt?.items ?? []}
            loading={isLoading}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
      <Tabs className="mt-4" defaultValue="tab-2">
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <StickyNote
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Notas
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
            <h2 className="text-base font-medium">Notas</h2>
            <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
              {isLoading ? placeholder(100) : purchaseReceipt?.note || "No hay notas para mostrar"}
            </span>
          </div>
        </TabsContent>
        <TabsContent value="tab-3" className="m-0">
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Documentos</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Ordenes de compra</label>
                <div className="flex gap-2 items-center group w-fit">
                  <span className="text-sm font-medium">FC-4500001782</span>
                  <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Facturas de compra</label>
                <div className="flex gap-2 items-center group w-fit">
                  <span className="text-sm font-medium">OC-4500001782</span>
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
