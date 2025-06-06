import { DataTable } from "@/components/data-table";
import { routes } from "@/lib/routes";
import { SortingState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React from "react";
import { AppointmentList } from "../schemas/appointments";
import { columns } from "./columns";

export default function TableView({ appointments, isLoading }: { appointments?: AppointmentList[], isLoading: boolean }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'start_date', desc: false }])

  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-242px)]">
      <DataTable
        data={appointments || []}
        columns={columns}
        loading={isLoading}
        onRowClick={(row) => router.push(routes.visit.new(row.id))}
        sorting={sorting}
        setSorting={setSorting}
      />
    </div>
  )
}