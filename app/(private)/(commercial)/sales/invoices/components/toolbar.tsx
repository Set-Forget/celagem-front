import FilterSelector, { FilterConfig } from "@/components/filter-selector";
import { Button } from "@/components/ui/button";
import { AdaptedInvoiceList } from "@/lib/adapters/invoices";
import { routes } from "@/lib/routes";
import { Table } from "@tanstack/react-table";
import { BanknoteArrowDown, CalendarFold, CircleDashed, Search, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

const filtersConfig: Record<string, FilterConfig> = {
  status: {
    type: "multiple",
    options: [
      { label: "Borrador", value: "draft" },
      { label: "Pendiente", value: "posted" },
      { label: "Cancelada", value: "cancel" },
      { label: "Vencida", value: "overdue" },
      { label: "Completada", value: "done" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
  type: {
    type: "multiple",
    options: [
      { label: "Factura", value: "invoice" },
      { label: "Nota de crédito", value: "credit_note" },
      { label: "Nota de débito", value: "debit_note" },
    ],
    label: "Tipo",
    key: "type",
    icon: Tag
  },
  date_range: {
    type: "date_range",
    options: [
      { label: "Fecha de vencimiento", value: "due_date" },
      { label: "Fecha de emisión", value: "date" },
    ],
    label: "Rango de fecha",
    key: "date_range",
    icon: CalendarFold
  },
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Número de factura", value: "number" },
      { label: "Cliente", value: "customer" },
    ],
    key: "search",
    icon: Search
  },
};

export default function Toolbar({ table }: { table: Table<AdaptedInvoiceList> }) {
  const router = useRouter()

  const selectedRows = table.getSelectedRowModel().rows
  return (
    <div className="flex items-center justify-between">

      <FilterSelector filtersConfig={filtersConfig} />
      <Button
        variant="secondary"
        className="h-7"
        size="sm"
        disabled={selectedRows.length === 0 || selectedRows.some(row => row.original.type === 'credit_note') || selectedRows.some(row => row.original.status !== 'posted') || selectedRows.some(row => row.original.amount_residual <= 0)}
        onClick={() => {
          const invoiceIds = selectedRows.map((row) => row.original.id).join(",")
          router.push(routes.receipts.new(invoiceIds))
        }}
      >
        <BanknoteArrowDown />
        {selectedRows.length > 1 ? "Registrar cobros" : "Registrar cobro"}
      </Button>
    </div>
  )
}