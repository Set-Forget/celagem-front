import { DataTable } from "@/components/data-table";
import { usePathname, useRouter } from "next/navigation";
import { AppointmentList } from "../schemas/appointments";
import { columns } from "./columns";

export default function TableView({ appointments }: { appointments?: AppointmentList[] }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="p-4 h-full">
      <DataTable
        data={appointments ?? []}
        columns={columns}
        onRowClick={(row) => router.push(`${pathname}/appointment/${row.id}`)}
      />
    </div>
  )
}