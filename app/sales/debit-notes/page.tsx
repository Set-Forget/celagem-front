'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import { columns, DebitNote } from "./components/columns";
import Toolbar from "./components/toolbar";

const data: DebitNote[] = [
  {
    "number": "ND-7868",
    "status": "pending",
    "type": "ND",
    "issue_date": "2023-03-30",
    "due_date": "2023-06-17",
    "amount": 5989.14,
    "currency": "ARS",
    "description": "Ajuste por nuevos productos",
    "company_name": "Pi Engineering Co."
  },
  {
    "number": "ND-6025",
    "status": "overdue",
    "type": "ND",
    "issue_date": "2023-12-02",
    "due_date": "2024-02-12",
    "amount": 3796.77,
    "currency": "USD",
    "description": "Corrección de factura",
    "company_name": "Zeta Holdings Inc."
  },
  {
    "number": "ND-9827",
    "status": "pending",
    "type": "ND",
    "issue_date": "2023-12-26",
    "due_date": "2024-02-07",
    "amount": 2131.97,
    "currency": "USD",
    "description": "Corrección de factura",
    "company_name": "Alpha Solutions S.A."
  },
  {
    "number": "ND-3536",
    "status": "paid",
    "type": "ND",
    "issue_date": "2023-03-06",
    "due_date": "2023-05-10",
    "amount": 6713.81,
    "currency": "USD",
    "description": "Ajuste por nuevos productos",
    "company_name": "Theta Manufacturing Co."
  },
  {
    "number": "ND-6019",
    "status": "pending",
    "type": "ND",
    "issue_date": "2023-10-26",
    "due_date": "2023-12-12",
    "amount": 9051.34,
    "currency": "EUR",
    "description": "Intereses por mora",
    "company_name": "Tau Analytics Group Ltd."
  },
  {
    "number": "ND-6611",
    "status": "paid",
    "type": "ND",
    "issue_date": "2023-10-17",
    "due_date": "2023-12-26",
    "amount": 2654.66,
    "currency": "ARS",
    "description": "Servicios adicionales",
    "company_name": "Mu Retail Group S.A."
  },
  {
    "number": "ND-8965",
    "status": "in_process",
    "type": "ND",
    "issue_date": "2023-07-15",
    "due_date": "2023-08-17",
    "amount": 4601.23,
    "currency": "ARS",
    "description": "Ajuste por nuevos productos",
    "company_name": "Iota Global Services Inc."
  },
  {
    "number": "ND-2364",
    "status": "pending",
    "type": "ND",
    "issue_date": "2023-04-02",
    "due_date": "2023-05-03",
    "amount": 5762.09,
    "currency": "EUR",
    "description": "Cargos administrativos",
    "company_name": "Sigma Ventures LLC"
  },
  {
    "number": "ND-2920",
    "status": "in_process",
    "type": "ND",
    "issue_date": "2023-01-25",
    "due_date": "2023-03-26",
    "amount": 1842.14,
    "currency": "USD",
    "description": "Ajuste por nuevos productos",
    "company_name": "Beta Industries Corp."
  },
  {
    "number": "ND-7783",
    "status": "overdue",
    "type": "ND",
    "issue_date": "2023-12-04",
    "due_date": "2024-01-15",
    "amount": 8708.17,
    "currency": "ARS",
    "description": "Intereses por mora",
    "company_name": "Pi Engineering Co."
  },
  {
    "number": "ND-3645",
    "status": "paid",
    "type": "ND",
    "issue_date": "2023-03-22",
    "due_date": "2023-04-27",
    "amount": 8959.99,
    "currency": "EUR",
    "description": "Servicios adicionales",
    "company_name": "Iota Global Services Inc."
  },
  {
    "number": "ND-5990",
    "status": "pending",
    "type": "ND",
    "issue_date": "2023-07-07",
    "due_date": "2023-08-12",
    "amount": 9843.72,
    "currency": "EUR",
    "description": "Corrección de factura",
    "company_name": "Kappa Dynamics S.R.L."
  },
  {
    "number": "ND-9368",
    "status": "paid",
    "type": "ND",
    "issue_date": "2023-10-26",
    "due_date": "2024-01-06",
    "amount": 1403.44,
    "currency": "ARS",
    "description": "Corrección de factura",
    "company_name": "Omega Tech Group S.A."
  },
  {
    "number": "ND-7546",
    "status": "paid",
    "type": "ND",
    "issue_date": "2023-05-25",
    "due_date": "2023-07-09",
    "amount": 1834.79,
    "currency": "ARS",
    "description": "Cargos administrativos",
    "company_name": "Zeta Holdings Inc."
  },
  {
    "number": "ND-8786",
    "status": "overdue",
    "type": "ND",
    "issue_date": "2023-11-21",
    "due_date": "2024-01-19",
    "amount": 937.14,
    "currency": "EUR",
    "description": "Corrección de factura",
    "company_name": "Kappa Dynamics S.R.L."
  },
  {
    "number": "ND-2990",
    "status": "overdue",
    "type": "ND",
    "issue_date": "2023-06-12",
    "due_date": "2023-07-28",
    "amount": 5281.39,
    "currency": "USD",
    "description": "Intereses por mora",
    "company_name": "Beta Industries Corp."
  },
  {
    "number": "ND-3425",
    "status": "overdue",
    "type": "ND",
    "issue_date": "2023-06-05",
    "due_date": "2023-08-19",
    "amount": 9564.9,
    "currency": "EUR",
    "description": "Corrección de factura",
    "company_name": "Omicron Systems Corp."
  },
  {
    "number": "ND-9415",
    "status": "overdue",
    "type": "ND",
    "issue_date": "2023-03-08",
    "due_date": "2023-04-18",
    "amount": 5791.49,
    "currency": "EUR",
    "description": "Corrección de factura",
    "company_name": "Sigma Ventures LLC"
  },
  {
    "number": "ND-3723",
    "status": "in_process",
    "type": "ND",
    "issue_date": "2023-07-14",
    "due_date": "2023-08-20",
    "amount": 3585.01,
    "currency": "ARS",
    "description": "Cargos administrativos",
    "company_name": "Upsilon Health Tech LLC"
  },
  {
    "number": "ND-1164",
    "status": "overdue",
    "type": "ND",
    "issue_date": "2023-12-14",
    "due_date": "2024-01-23",
    "amount": 5748.88,
    "currency": "EUR",
    "description": "Ajuste por nuevos productos",
    "company_name": "Epsilon Software LLC"
  }
]

export default function DebitNotesPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header title="Notas de débito" />
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.number}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  )
}