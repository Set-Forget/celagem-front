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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Box, ChevronDown, Eye, House, Paperclip } from "lucide-react"
import Link from "next/link"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  return (
    <>
      <Header title="LAP-001 Laptop Dell XPS 15" />
      <Tabs className="mt-4" defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <House
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              General
            </TabsTrigger>
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
        <TabsContent value="tab-1" className="m-0 border-b">
          <div className="grid grid-cols-1 gap-4 p-4">
            <div className="flex flex-col gap-4">
              <h2 className="text-base font-medium">General</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Precio de lista</label>
                  <span className="text-sm">
                    $249.99
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Costo de compra
                  </label>
                  <span className="text-sm">
                    $150.00
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Stock disponible</label>
                  <span className="text-sm">
                    20 unidades
                  </span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tab-2" className="m-0 border-b">
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
        <TabsContent value="tab-3" className="m-0 border-b">
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
