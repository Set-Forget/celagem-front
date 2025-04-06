'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";

const data: any[] = [
  {
    "payment_mode": "bank_transfer",
    "payment_date": "2023-10-12",
    "party_type": "customer",
    "amount": 3109.97,
    "transaction_id": 321461560092
  },
  {
    "payment_mode": "cash",
    "payment_date": "2023-10-24",
    "party_type": "customer",
    "amount": 6067.87,
    "transaction_id": 937998729354
  },
  {
    "payment_mode": "check",
    "payment_date": "2024-10-13",
    "party_type": "supplier",
    "amount": 3497.4,
    "transaction_id": 404915564883
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2023-03-21",
    "party_type": "customer",
    "amount": 8161.03,
    "transaction_id": 896999920591
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2023-08-02",
    "party_type": "customer",
    "amount": 2898.91,
    "transaction_id": 506372627775
  },
  {
    "payment_mode": "bank_transfer",
    "payment_date": "2023-07-26",
    "party_type": "customer",
    "amount": 6777.46,
    "transaction_id": 778034113674
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2024-06-07",
    "party_type": "customer",
    "amount": 1102.08,
    "transaction_id": 215870433114
  },
  {
    "payment_mode": "check",
    "payment_date": "2023-03-05",
    "party_type": "customer",
    "amount": 9099.49,
    "transaction_id": 463972900163
  },
  {
    "payment_mode": "cash",
    "payment_date": "2024-11-27",
    "party_type": "customer",
    "amount": 283.45,
    "transaction_id": 722326938750
  },
  {
    "payment_mode": "bank_transfer",
    "payment_date": "2024-08-22",
    "party_type": "supplier",
    "amount": 1412.05,
    "transaction_id": 187334280676
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2024-02-28",
    "party_type": "customer",
    "amount": 5640.78,
    "transaction_id": 831091194377
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2023-05-21",
    "party_type": "supplier",
    "amount": 4433.78,
    "transaction_id": 537443114338
  },
  {
    "payment_mode": "debit_card",
    "payment_date": "2023-03-30",
    "party_type": "supplier",
    "amount": 4112.49,
    "transaction_id": 503190929511
  },
  {
    "payment_mode": "bank_transfer",
    "payment_date": "2023-09-02",
    "party_type": "customer",
    "amount": 487.5,
    "transaction_id": 609216524074
  },
  {
    "payment_mode": "debit_card",
    "payment_date": "2023-07-26",
    "party_type": "supplier",
    "amount": 5349.95,
    "transaction_id": 151797173996
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2023-10-22",
    "party_type": "supplier",
    "amount": 439.91,
    "transaction_id": 410287534038
  },
  {
    "payment_mode": "check",
    "payment_date": "2023-07-27",
    "party_type": "supplier",
    "amount": 8461.42,
    "transaction_id": 358372750143
  },
  {
    "payment_mode": "check",
    "payment_date": "2024-11-01",
    "party_type": "supplier",
    "amount": 9915.78,
    "transaction_id": 810927211084
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2024-02-12",
    "party_type": "supplier",
    "amount": 6104.43,
    "transaction_id": 288780819788
  },
  {
    "payment_mode": "credit_card",
    "payment_date": "2024-03-25",
    "party_type": "customer",
    "amount": 5846.92,
    "transaction_id": 767921341703
  }
]

export default function Page() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div>
      <Header title="Pagos">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Cargar pago
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-209px)]">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </div>
  )
}