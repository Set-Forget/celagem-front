import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import { ChevronDown, Pencil, Plus, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const notes = [
  { id: 1, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc." },
  { id: 2, content: "Nullam nec purus nec nunc. ac bibendum." },
  { id: 3, content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" },
  { id: 4, content: "Sed pretium tortor nec ipsum interdum dictum. Aliquam erat volutpat. Phasellus pulvinar velit arcu, at interdum ligula volutpat id. Nulla et tellus vel ipsum scelerisque auctor eu non massa. Duis laoreet vel magna eu sodales. Maecenas bibendum nisl neque, quis auctor arcu pharetra commodo. Proin sit amet facilisis libero. Fusce sagittis purus ut aliquam accumsan. Fusce vel mauris nisi. Vestibulum lobortis." },
]

export default function PatientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {

  return (
    <>
      <Header title="Detalles del paciente">
        <div className="ml-auto flex items-center gap-2">
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
                  Ver historial
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Crear visita
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm">
            <Pencil className="w-4 h-4" />
            Editar paciente
          </Button>
        </div>
      </Header>
      <ResizablePanelGroup className="flex !h-full !w-auto" direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col gap-4 py-4">
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">General</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Nombre</label>
                  <span className="text-sm">Juan Perez</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de vinculación</label>
                  <span className="text-sm">
                    Particular
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Rol</label>
                  <span className="text-sm">
                    Donante de semen
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Sexo biológico</label>
                  <span className="text-sm">
                    Masculino
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Identidad de género
                  </label>
                  <span className="text-sm">
                    Cisgénero
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Fecha de nacimiento
                  </label>
                  <span className="text-sm">
                    01/01/1990
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Lugar de nacimiento
                  </label>
                  <span className="text-sm">
                    Buenos Aires
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Dirección de residencia
                  </label>
                  <span className="text-sm">
                    Av. Corrientes 1234
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Discapacidad
                  </label>
                  <span className="text-sm">
                    Sin discapacidad
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Sede
                  </label>
                  <span className="text-sm">
                    Sede Asistencial Bogotá
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Documento
                  </label>
                  <span className="text-sm">
                    CC 123456789
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Número de teléfono</label>
                  <span className="text-sm">+54 9 11 1234 5678</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Email</label>
                  <span className="text-sm">set@forget.com</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Acompañante</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Nombre</label>
                  <span className="text-sm">Juan Pérez</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Dirección de residencia
                  </label>
                  <span className="text-sm">
                    Av. Corrientes 1234
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Ciudad de residencia
                  </label>
                  <span className="text-sm">
                    Buenos Aires
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">
                    Parentesco
                  </label>
                  <span className="text-sm">
                    Conyuge
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Responsable</h2>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Fiscal</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Tipo de cliente</label>
                  <span className="text-sm">Particular</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">CUIT/CUIL</label>
                  <span className="text-sm">20-12345678-9</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Condición frente al IVA</label>
                  <span className="text-sm">Responsable Inscripto</span>
                </div>
              </div>
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
              <h2 className="text-base font-medium">Última visita</h2>
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
