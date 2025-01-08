import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { usePathname, useRouter } from "next/navigation";


export default function TableView({ selectedDate, appointments }: { selectedDate: Date, appointments: any[] }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <DataTable
      data={appointments}
      columns={columns}
      onRowClick={(row) => router.push(`${pathname}/appointment/${row.id}`)}
    />
  )
}