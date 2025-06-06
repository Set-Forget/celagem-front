import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";
import { Table } from "@tanstack/react-table";
import { BanknoteArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { AccountsPayableList } from "../schemas/accounts-payable";

export default function Toolbar({ table }: { table: Table<AccountsPayableList> }) {
  const router = useRouter()

  const selectedRows = table.getSelectedRowModel().rows

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="secondary"
        className="h-7"
        size="sm"
        disabled={selectedRows.length === 0 || selectedRows.some(row => row.original.outstanding_amount === 0)}
        onClick={() => {
          const billIds = selectedRows.map((row) => row.original.id).join(",")
          router.push(routes.payments.new(billIds))
        }}
      >
        <BanknoteArrowDown />
        {selectedRows.length > 1 ? "Registrar pagos" : "Registrar pago"}
      </Button>
    </div>
  )
}