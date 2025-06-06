import CustomSonner from "@/components/custom-sonner";
import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLazyGetAppointmentQuery } from "@/lib/services/appointments";
import { useLazyGetPatientQuery } from "@/lib/services/patients";
import { useLazyGetVisitQuery } from "@/lib/services/visits";
import { cn } from "@/lib/utils";
import { generatePDF, mergePDFs } from "@/lib/templates/utils";
import { Table } from "@tanstack/react-table";
import { CalendarFold, CircleDashed, File, FileDown, FileStack, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  status: {
    type: "multiple",
    options: [
      { label: "Pendiente", value: "pending" },
      { label: "Vencida", value: "overdue" },
      { label: "Paga", value: "paid" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
  date_range: {
    type: "date_range",
    options: [
      { label: "Fecha de emisión", value: "issue_date" },
      { label: "Fecha de vencimiento", value: "due_date" },
    ],
    label: "Rango de fecha",
    key: "date_range",
    icon: CalendarFold
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Número de factura", value: "invoice_number" },
      { label: "Proveedor", value: "supplier" },
    ],
    key: "search",
    icon: Search
  },
};

export default function Toolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const [loading, setLoading] = useState(false)

  const [getVisit] = useLazyGetVisitQuery()
  const [getAppointment] = useLazyGetAppointmentQuery()
  const [getPatient] = useLazyGetPatientQuery()

  const handleGeneratePDF = async () => {
    setLoading(true)

    for (const row of selectedRows) {
      try {
        const visit = await getVisit((row.original as { id: string }).id).unwrap()
        const appointment = await getAppointment(visit?.appointment_id!).unwrap()
        const patient = await getPatient(appointment.patient.id!).unwrap()

        const pdf = await generatePDF({
          templateName: 'visitRecord',
          data: {
            visit: visit!,
            appointment: appointment!,
            patient: patient,
            data: visit?.medical_record || "{}"
          },
        });
        pdf.view();
      } catch (error) {
        toast.custom((t) => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
        console.error('Error al generar el PDF:', error);
      } finally {
        setLoading(false)
      }
    }
  };

  return (
    <div className="flex items-center justify-between">
      <FilterSelector filtersConfig={filtersConfig} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            className="h-7"
            disabled={!selectedRows.length || loading}
            loading={loading}
          >
            <FileDown className={cn(loading && "hidden")} />
            Exportar
            {selectedRows.length > 0 && <p className="font-mono">{selectedRows.length}</p>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => handleGeneratePDF()}
          >
            <File />
            Único documento
          </DropdownMenuItem>
          {/*           <DropdownMenuItem
          //onSelect={() => handleGeneratePDF("single")}
          >
            <FileStack />
            Múltiples documentos
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}