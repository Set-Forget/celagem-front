'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Pencil, Plus, X } from "lucide-react"
import { columns } from "./components/columns"
import CustomTableFooter from "./components/table-footer"

const data = [
  {
    "item_code": "ITEM-9634",
    "item_name": "Guantes de nitrilo",
    "description": "Guantes de nitrilo talla M",
    "quantity": 50,
    "id": "5e7361f5-0fbf-433b-8688-b65896a0f54a",
    "price": "400.93",
    "tax": "21",
  },
]

const notes = [
  { id: 1, content: "Nota de crédito por error en la factura" },
]

export default function CreditNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  return (
    <>
      <Header title="NC-6252" />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col gap-4 py-4 flex-1">
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">General</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Proveedor</label>
                  <span className="text-sm">Guantes S.A.</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de factura</label>
                  <span className="text-sm">FA-4500001782</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de orden de compra</label>
                  <span className="text-sm">OC-4500001782</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Contabilidad</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Fecha de contabilización</label>
                  <span className="text-sm">12 de febrero de 2022</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Cuenta</label>
                  <span className="text-sm">CAJA GENERAL</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Centro de costos</label>
                  <span className="text-sm">Mantenimiento</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">Items</h2>
              </div>
              <DataTable
                data={data}
                columns={columns}
                pagination={false}
                footer={() => <CustomTableFooter />}
              />
            </div>
          </div>
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
            <h2 className="text-base font-medium">Actividad</h2>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Creado por <strong>John Doe</strong></label>
              <span className="text-sm">Hace 3 días</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Editado por <strong>Jane Doe</strong></label>
              <span className="text-sm">Hace 2 días</span>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}
