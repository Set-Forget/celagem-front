import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileDown } from "lucide-react";

export default function MedicalRecord() {

  return (
    <div>
      <Header title="Visita N° 123456">
        <div className="ml-auto">
          <Button size="sm" variant="outline">
            <FileDown />
            Exportar
          </Button>
        </div>
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
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Firmado por</label>
              <span className="text-sm">Juan Pérez</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Firmado el</label>
              <span className="text-sm">25 Mar 2024 02:15 PM</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Consulta de primera vez ip</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Cabeza</label>
              <span className="text-sm">
                Normal
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Abdomen</label>
              <span className="text-sm">
                Normal
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Extremidades</label>
              <span className="text-sm">
                Normal
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Neurológico</label>
              <span className="text-sm">
                Normal
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Motivo de la consulta</label>
              <span className="text-sm">
                Donante de semen
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Enfermedad Actual</label>
              <span className="text-sm">
                No presenta enfermedad actual
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Antecedentes Personales</label>
              <span className="text-sm">
                No presenta antecedentes personales
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Antecedentes Familiares</label>
              <span className="text-sm">
                No presenta antecedentes familiares
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Indice de masa corporal</label>
              <span className="text-sm">
                23.5 kg/m2
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <span className="text-sm font-medium col-span-2">Signos vitales</span>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">T.A.S.</label>
              <span className="text-sm">
                120 mmHg
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">T.A.D.</label>
              <span className="text-sm">
                80 mmHg
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">F.C.</label>
              <span className="text-sm">
                80 lpm
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">F.R.</label>
              <span className="text-sm">
                20 rpm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}