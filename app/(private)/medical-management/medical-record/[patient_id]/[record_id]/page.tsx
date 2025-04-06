import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";


export default function MedicalRecord() {

  return (
    <div>
      <Header title="Visita N° 123456">

      </Header>
      <div className="flex flex-col gap-4 py-4">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Detalles de la visita</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Número de visita</label>
              <span className="text-sm">36640</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha y hora atención</label>
              <span className="text-sm">
                25 Mar 2024 02:15 PM
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Tipo de atención</label>
              <span className="text-sm">
                Donante de semen
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Modalidad de atención
              </label>
              <span className="text-sm">
                Virtual
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Edad</label>
              <span className="text-sm">
                27 años
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
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Plantilla</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          </div>
        </div>
      </div>
    </div>
  )
}