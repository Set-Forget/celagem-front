'use client'

import Header from "@/components/header"
import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetSupplierQuery } from "@/lib/services/suppliers"
import { cn, placeholder } from "@/lib/utils"
import { Box, Calculator, Edit, FileText, House, Paperclip, Pencil, Plus, X } from "lucide-react"
import { useParams } from "next/navigation"

const notes = [
  { id: 1, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc." },
  { id: 2, content: "Nullam nec purus nec nunc. ac bibendum." },
  { id: 3, content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" },
  { id: 4, content: "Sed pretium tortor nec ipsum interdum dictum. Aliquam erat volutpat. Phasellus pulvinar velit arcu, at interdum ligula volutpat id. Nulla et tellus vel ipsum scelerisque auctor eu non massa. Duis laoreet vel magna eu sodales. Maecenas bibendum nisl neque, quis auctor arcu pharetra commodo. Proin sit amet facilisis libero. Fusce sagittis purus ut aliquam accumsan. Fusce vel mauris nisi. Vestibulum lobortis." },
]

const tags = [
  { id: 1, name: "Proveedor" },
  { id: 3, name: "VIP" },
]

export default function SupplierPage() {
  const { id } = useParams<{ id: string }>()

  const { data: supplier, isLoading: isSupplierLoading } = useGetSupplierQuery(Number(id))
  console.log(supplier)
  return (
    <>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
          {isSupplierLoading ? placeholder(13, true) : supplier?.name}
        </h1>
      }>
        <Button className="ml-auto" size="sm">
          <Edit />
          Editar proveedor
        </Button>
      </Header>
      <ResizablePanelGroup className="flex !h-full !w-auto" direction="horizontal">
        <ResizablePanel defaultSize={70}>
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
                  <Calculator
                    className="-ms-0.5 me-1.5"
                    size={16}
                    aria-hidden="true"
                  />
                  Fiscal y contable
                </TabsTrigger>
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <TabsContent value="tab-1" className="m-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Email</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    {isSupplierLoading ? placeholder(16) : supplier?.email || "No especificado"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de teléfono</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Sitio web</label>
                  <Button
                    size="sm"
                    variant="link"
                    className="justify-start p-0 h-auto"
                    onClick={() => window.open(supplier?.website || "", "_blank")}
                  >
                    <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                      {isSupplierLoading ? placeholder(12) : supplier?.website || "No especificado"}
                    </span>
                  </Button>
                </div>
                {/* 
                  // ! Falta country, city, state, zip_code que deberían venir en el place_id del address (actualmente es un string address).
                */}
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Dirección</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    {isSupplierLoading ? placeholder(30) : supplier?.contact_address_inline || "No especificado"}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="p-4 flex flex-col gap-4">
                <h2 className="text-base font-medium">Estado de cuenta</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-muted-foreground text-sm">Total facturado</label>
                    <div className="flex gap-1.5 items-center">
                      <StatusIndicator status="online" size="sm" />
                      <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                        {isSupplierLoading ? placeholder(4) : supplier?.total_invoiced}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-muted-foreground text-sm">Saldo pendiente</label>
                    <div className="flex gap-1.5 items-center">
                      <StatusIndicator status="away" size="sm" />
                      <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                        {isSupplierLoading ? placeholder(4) : supplier?.payment_amount_due}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-muted-foreground text-sm">Saldo vencido</label>
                    <div className="flex gap-1.5 items-center">
                      <StatusIndicator status="busy" size="sm" />
                      <span className={cn("text-sm font-medium transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                        {isSupplierLoading ? placeholder(4) : supplier?.payment_amount_overdue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tab-2" className="m-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Nombre registrado</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    {isSupplierLoading ? placeholder(12) : supplier?.commercial_company_name || "No especificado"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Moneda</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de documento</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Identificación fiscal</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    {isSupplierLoading ? placeholder(13) : supplier?.tax_id}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Condición de pago</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    {isSupplierLoading ? placeholder(15) : supplier?.property_payment_term || "No especificado"}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Método de pago</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Régimen tributario</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Régimen fiscal</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Información tributaria</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Responsabilidad fiscal</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Actividad económica</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de persona</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de nacionalidad</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">¿Es residente?</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Cuenta contable</label>
                  <span className={cn("text-sm transition-all duration-300", isSupplierLoading ? "blur-[4px]" : "blur-none")}>
                    xxxxx
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel className="!flex-none w-[350px]" defaultSize={30}>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Notas</h2>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
              >
                <Plus />
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full pr-2 overflow-x-hidden border p-2 bg-muted !rounded-sm">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start justify-between py-2 border-b last:border-b-0 group relative">
                  <p className="text-xs break-words pr-2 flex-1">{note.content}</p>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1">
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-tr-none rounded-br-none border-r-0">
                      <Pencil />
                    </Button>
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-tl-none rounded-bl-none">
                      <X />
                    </Button>
                  </div>

                </div>
              ))}
            </ScrollArea>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Etiquetas</h2>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
              >
                <Plus />
              </Button>
            </div>
            <div className="flex gap-2">
              {tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Actividad</h2>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Creado por <strong className="font-medium">John Doe</strong></label>
              <span className="text-sm">Hace 3 días</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Editado por <strong className="font-medium">Jane Doe</strong></label>
              <span className="text-sm">Hace 2 días</span>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
