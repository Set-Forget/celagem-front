'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { columns, Invoice } from "./components/columns";
import Toolbar from "./components/toolbar";

const data: Invoice[] = [
  {
    "number": "INV-6505",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-09-26",
    "due_date": "2023-11-21",
    "amount": 8421.71,
    "currency": "EUR",
    "description": "Devolución de productos",
    "company_name": "Alpha Solutions S.A."
  },
  {
    "number": "INV-9483",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-12-25",
    "due_date": "2024-02-14",
    "amount": 747.02,
    "currency": "ARS",
    "description": "Compra de insumos",
    "company_name": "Beta Industries Corp."
  },
  {
    "number": "INV-1668",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-12-21",
    "due_date": "2024-01-23",
    "amount": 2446.35,
    "currency": "USD",
    "description": "Compra de insumos",
    "company_name": "Gamma Enterprises Ltd."
  },
  {
    "number": "INV-1810",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-03-13",
    "due_date": "2023-05-16",
    "amount": 7469.16,
    "currency": "ARS",
    "description": "Reembolso de gastos",
    "company_name": "Delta Logistics S.R.L."
  },
  {
    "number": "INV-7305",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-05-07",
    "due_date": "2023-07-17",
    "amount": 6518.74,
    "currency": "ARS",
    "description": "Servicios prestados",
    "company_name": "Epsilon Software LLC"
  },
  {
    "number": "INV-9266",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-10-31",
    "due_date": "2023-11-24",
    "amount": 7294.64,
    "currency": "ARS",
    "description": "Gastos administrativos",
    "company_name": "Zeta Holdings Inc."
  },
  {
    "number": "INV-7993",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-06-04",
    "due_date": "2023-07-14",
    "amount": 9059.42,
    "currency": "ARS",
    "description": "Gastos administrativos",
    "company_name": "Theta Manufacturing Co."
  },
  {
    "number": "INV-8151",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-06-26",
    "due_date": "2023-07-24",
    "amount": 5016.77,
    "currency": "EUR",
    "description": "Orden de compra de equipo",
    "company_name": "Omega Tech Group S.A."
  },
  {
    "number": "INV-5231",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-08-11",
    "due_date": "2023-09-03",
    "amount": 4333.29,
    "currency": "ARS",
    "description": "Venta de productos",
    "company_name": "Sigma Ventures LLC"
  },
  {
    "number": "INV-3151",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-08-08",
    "due_date": "2023-11-06",
    "amount": 8015.32,
    "currency": "EUR",
    "description": "Facturación de proyecto",
    "company_name": "Lambda Consulting Ltd."
  },
  {
    "number": "INV-5189",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-09-04",
    "due_date": "2023-10-21",
    "amount": 8464.7,
    "currency": "ARS",
    "description": "Nota de crédito aplicada",
    "company_name": "Kappa Dynamics S.R.L."
  },
  {
    "number": "INV-1342",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-09-27",
    "due_date": "2023-11-04",
    "amount": 2124.93,
    "currency": "ARS",
    "description": "Venta de productos",
    "company_name": "Iota Global Services Inc."
  },
  {
    "number": "INV-6617",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-03-13",
    "due_date": "2023-05-16",
    "amount": 6512.55,
    "currency": "ARS",
    "description": "Nota de crédito aplicada",
    "company_name": "Mu Retail Group S.A."
  },
  {
    "number": "INV-6929",
    "status": "paid",
    "type": "FA",
    "issue_date": "2023-03-23",
    "due_date": "2023-06-01",
    "amount": 8347.34,
    "currency": "EUR",
    "description": "Nota de crédito aplicada",
    "company_name": "Nu Energy Solutions Ltd."
  },
  {
    "number": "INV-5125",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-11-13",
    "due_date": "2024-01-22",
    "amount": 1752.09,
    "currency": "ARS",
    "description": "Venta de productos",
    "company_name": "Xi Innovations LLC"
  },
  {
    "number": "INV-9769",
    "status": "overdue",
    "type": "FA",
    "issue_date": "2023-01-22",
    "due_date": "2023-04-18",
    "amount": 9485.95,
    "currency": "EUR",
    "description": "Nota de débito generada",
    "company_name": "Omicron Systems Corp."
  },
  {
    "number": "INV-7980",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-10-17",
    "due_date": "2023-11-26",
    "amount": 288.91,
    "currency": "EUR",
    "description": "Nota de crédito aplicada",
    "company_name": "Pi Engineering Co."
  },
  {
    "number": "INV-1829",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-06-27",
    "due_date": "2023-08-17",
    "amount": 3963.94,
    "currency": "USD",
    "description": "Nota de débito generada",
    "company_name": "Rho Digital Agency S.A."
  },
  {
    "number": "INV-5287",
    "status": "in_process",
    "type": "FA",
    "issue_date": "2023-06-16",
    "due_date": "2023-07-01",
    "amount": 7223.78,
    "currency": "ARS",
    "description": "Nota de crédito aplicada",
    "company_name": "Tau Analytics Group Ltd."
  },
  {
    "number": "INV-5507",
    "status": "pending",
    "type": "FA",
    "issue_date": "2023-10-06",
    "due_date": "2023-11-04",
    "amount": 8848.93,
    "currency": "ARS",
    "description": "Devolución de productos",
    "company_name": "Upsilon Health Tech LLC"
  }
]

export default function InvoicesPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header>
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear factura
        </Button>
      </Header>
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