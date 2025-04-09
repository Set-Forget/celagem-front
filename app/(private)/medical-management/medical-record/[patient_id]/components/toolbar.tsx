import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { CalendarSearch, FileDown, Search } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

const filtersConfig: Record<string, FilterConfig> = {
  date: {
    type: "date",
    label: "Fecha",
    key: "date",
    options: [
      { label: "Fecha creación", value: "created_at" },
    ],
    icon: CalendarSearch
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Número de visita", value: "visit_number" },
      { label: "Creado por", value: "created_by" },
      { label: "Especialidad", value: "speciality" },
      { label: "Tipo de atención", value: "attention_type" },
      { label: "Sede", value: "headquarter" },
    ],
    key: "search",
    icon: Search
  },
};

export default function Toolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const handleGeneratePDF = async (selectedRows: any[]) => {
    if (selectedRows.length > 1) {
      const { generateMultipleVisitsPDF } = await import("../../templates/multiple-records")
      generateMultipleVisitsPDF()
    } else {
      const { generateMedicalRecordPDF } = await import("../../templates/medical-record")
      generateMedicalRecordPDF()
    }
  }

  return (
    <div className="flex gap-4 justify-between items-center">
      <FilterSelector filtersConfig={filtersConfig} />
      {(table.getIsSomePageRowsSelected() || table.getIsAllPageRowsSelected()) && (
        <Button
          size="sm"
          className="h-7"
          variant="outline"
          onClick={() => handleGeneratePDF(table.getSelectedRowModel().flatRows)}
        >
          <FileDown />
          Exportar
        </Button>
      )}
    </div>
  )
}