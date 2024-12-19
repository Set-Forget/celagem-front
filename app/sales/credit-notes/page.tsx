'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import { columns, CreditNote } from "./components/columns";
import Toolbar from "./components/toolbar";

const data: CreditNote[] = [
  {
    "number": "NC-6252",
    "status": "pending",
    "type": "NC",
    "issue_date": "2023-12-14",
    "due_date": "2024-02-08",
    "amount": 1970.41,
    "currency": "ARS",
    "description": "Descuento aplicado",
    "company_name": "Rho Digital Agency S.A."
  },
  {
    "number": "NC-9833",
    "status": "paid",
    "type": "NC",
    "issue_date": "2023-07-06",
    "due_date": "2023-09-03",
    "amount": 8084.62,
    "currency": "ARS",
    "description": "Descuento aplicado",
    "company_name": "Upsilon Health Tech LLC"
  },
  {
    "number": "NC-5398",
    "status": "overdue",
    "type": "NC",
    "issue_date": "2023-03-31",
    "due_date": "2023-06-02",
    "amount": 4634.13,
    "currency": "ARS",
    "description": "Corrección de factura",
    "company_name": "Xi Innovations LLC"
  },
  {
    "number": "NC-6561",
    "status": "in_process",
    "type": "NC",
    "issue_date": "2023-05-13",
    "due_date": "2023-07-17",
    "amount": 7046.22,
    "currency": "USD",
    "description": "Bonificación",
    "company_name": "Alpha Solutions S.A."
  },
  {
    "number": "NC-9638",
    "status": "paid",
    "type": "NC",
    "issue_date": "2023-05-14",
    "due_date": "2023-06-21",
    "amount": 4987.85,
    "currency": "USD",
    "description": "Bonificación",
    "company_name": "Omega Tech Group S.A."
  },
  {
    "number": "NC-3134",
    "status": "in_process",
    "type": "NC",
    "issue_date": "2023-01-23",
    "due_date": "2023-03-22",
    "amount": 6993.69,
    "currency": "ARS",
    "description": "Corrección de factura",
    "company_name": "Iota Global Services Inc."
  },
  {
    "number": "NC-5382",
    "status": "pending",
    "type": "NC",
    "issue_date": "2023-12-16",
    "due_date": "2024-02-24",
    "amount": 4676.55,
    "currency": "ARS",
    "description": "Ajuste por servicios no prestados",
    "company_name": "Alpha Solutions S.A."
  },
  {
    "number": "NC-6068",
    "status": "overdue",
    "type": "NC",
    "issue_date": "2023-08-12",
    "due_date": "2023-10-26",
    "amount": 7728.74,
    "currency": "USD",
    "description": "Bonificación",
    "company_name": "Rho Digital Agency S.A."
  },
  {
    "number": "NC-5525",
    "status": "overdue",
    "type": "NC",
    "issue_date": "2023-12-09",
    "due_date": "2024-02-16",
    "amount": 789.37,
    "currency": "EUR",
    "description": "Devolución de productos",
    "company_name": "Theta Manufacturing Co."
  },
  {
    "number": "NC-1133",
    "status": "in_process",
    "type": "NC",
    "issue_date": "2023-02-22",
    "due_date": "2023-04-24",
    "amount": 5083.65,
    "currency": "EUR",
    "description": "Devolución de productos",
    "company_name": "Beta Industries Corp."
  },
  {
    "number": "NC-9889",
    "status": "pending",
    "type": "NC",
    "issue_date": "2023-02-03",
    "due_date": "2023-04-11",
    "amount": 6792.04,
    "currency": "EUR",
    "description": "Descuento aplicado",
    "company_name": "Rho Digital Agency S.A."
  },
  {
    "number": "NC-2775",
    "status": "in_process",
    "type": "NC",
    "issue_date": "2023-02-07",
    "due_date": "2023-03-31",
    "amount": 6102.85,
    "currency": "USD",
    "description": "Bonificación",
    "company_name": "Tau Analytics Group Ltd."
  },
  {
    "number": "NC-7593",
    "status": "paid",
    "type": "NC",
    "issue_date": "2023-05-26",
    "due_date": "2023-06-28",
    "amount": 5052.8,
    "currency": "USD",
    "description": "Bonificación",
    "company_name": "Iota Global Services Inc."
  },
  {
    "number": "NC-3047",
    "status": "pending",
    "type": "NC",
    "issue_date": "2023-09-11",
    "due_date": "2023-10-13",
    "amount": 8461.89,
    "currency": "EUR",
    "description": "Devolución de productos",
    "company_name": "Alpha Solutions S.A."
  },
  {
    "number": "NC-7260",
    "status": "overdue",
    "type": "NC",
    "issue_date": "2023-03-02",
    "due_date": "2023-04-30",
    "amount": 1606.42,
    "currency": "USD",
    "description": "Ajuste por servicios no prestados",
    "company_name": "Tau Analytics Group Ltd."
  },
  {
    "number": "NC-6136",
    "status": "pending",
    "type": "NC",
    "issue_date": "2023-06-20",
    "due_date": "2023-09-11",
    "amount": 5722.35,
    "currency": "USD",
    "description": "Descuento aplicado",
    "company_name": "Tau Analytics Group Ltd."
  },
  {
    "number": "NC-1654",
    "status": "overdue",
    "type": "NC",
    "issue_date": "2023-10-24",
    "due_date": "2023-12-21",
    "amount": 7974.07,
    "currency": "ARS",
    "description": "Ajuste por servicios no prestados",
    "company_name": "Beta Industries Corp."
  },
  {
    "number": "NC-2699",
    "status": "paid",
    "type": "NC",
    "issue_date": "2023-05-17",
    "due_date": "2023-07-25",
    "amount": 5387.49,
    "currency": "USD",
    "description": "Ajuste por servicios no prestados",
    "company_name": "Xi Innovations LLC"
  },
  {
    "number": "NC-8239",
    "status": "overdue",
    "type": "NC",
    "issue_date": "2023-12-17",
    "due_date": "2024-01-31",
    "amount": 3574.39,
    "currency": "EUR",
    "description": "Bonificación",
    "company_name": "Upsilon Health Tech LLC"
  },
  {
    "number": "NC-5362",
    "status": "paid",
    "type": "NC",
    "issue_date": "2023-07-25",
    "due_date": "2023-09-08",
    "amount": 2735.81,
    "currency": "EUR",
    "description": "Corrección de factura",
    "company_name": "Alpha Solutions S.A."
  }
]

export default function CreditNotesPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header title="Notas de crédito" />
      <div className="flex flex-col gap-4 p-4 h-[calc(100svh-99px)]">
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