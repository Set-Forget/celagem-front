import { StatusIndicator } from "@/components/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import { Pencil, Plus, X } from "lucide-react"
import { ContactsTable } from "./components/contacts-table"

const notes = [
  { id: 1, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc." },
  { id: 2, content: "Nullam nec purus nec nunc. ac bibendum." },
  { id: 3, content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" },
  { id: 4, content: "Sed pretium tortor nec ipsum interdum dictum. Aliquam erat volutpat. Phasellus pulvinar velit arcu, at interdum ligula volutpat id. Nulla et tellus vel ipsum scelerisque auctor eu non massa. Duis laoreet vel magna eu sodales. Maecenas bibendum nisl neque, quis auctor arcu pharetra commodo. Proin sit amet facilisis libero. Fusce sagittis purus ut aliquam accumsan. Fusce vel mauris nisi. Vestibulum lobortis." },
]

const tags = [
  { id: 1, name: "Cliente" },
  { id: 2, name: "Contactado" },
  { id: 3, name: "VIP" },
]

export default async function CustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  return (
    <div>
      <Header>
        <Button size="sm">
          <Pencil className="w-4 h-4" />
          Editar Cliente
        </Button>
      </Header>
      <Separator />
      <ResizablePanelGroup className="flex !h-auto !w-auto" direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col gap-4 py-4">
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">General</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Nombre</label>
                  <span className="text-sm">Set&Forget</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de teléfono</label>
                  <span className="text-sm">+54 9 11 1234 5678</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Email</label>
                  <span className="text-sm">set@forget.com</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Ciudad</label>
                  <span className="text-sm">Buenos Aires</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Calle</label>
                  <span className="text-sm">Av. Corrientes 1234</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">País</label>
                  <span className="text-sm">Argentina</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Provincia</label>
                  <span className="text-sm">Buenos Aires</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Código postal</label>
                  <span className="text-sm">1234</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Estado de cuenta</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Saldo actual</label>
                  <div className="flex gap-1.5 items-center">
                    <StatusIndicator status="busy" size="sm" />
                    <span className="text-md font-medium">$1234.56</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Facturado en el año</label>
                  <span className="text-md font-medium">$1234.56</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Fiscal</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Razón social</label>
                  <span className="text-sm">Set&Forget S.A.</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">CUIT</label>
                  <span className="text-sm">30-12345678-9</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Condición frente al IVA</label>
                  <span className="text-sm">Responsable Inscripto</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium">Contactos</h2>
                <Button
                  size="sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Contacto
                </Button>
              </div>
              <ContactsTable />
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
    </div>
  )
}
