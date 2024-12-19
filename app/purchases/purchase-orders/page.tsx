'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import Toolbar from "./components/toolbar";
import { columns } from "./components/columns";
import { PurchaseOrder } from "./schemas/purchase-orders";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const data: PurchaseOrder[] = [
  {
    "id": "17988862-3c48-4f9a-86d1-4f5675ad2ec1",
    "supplier_name": "Peterson Inc",
    "status": "pending",
    "created_at": "2024-11-19T17:47:57.665218",
    "price": 2039.55,
    "number": 31,
    "percentage_received": 50.57,
    "title": "Compra de guantes quirúrgicos"
  },
  {
    "id": "b49a7004-7d23-43f7-9a69-9b2031472fe1",
    "supplier_name": "Banks PLC",
    "status": "cancelled",
    "created_at": "2024-11-07T17:47:57.665516",
    "price": 3314.45,
    "number": 52,
    "percentage_received": 0,
    "title": "Compra de mascarillas N95"
  },
  {
    "id": "bbf8810b-9690-4568-89c2-e1145009cd28",
    "supplier_name": "Mcdonald and Sons",
    "status": "ordered",
    "created_at": "2024-11-14T17:47:57.665798",
    "price": 2140.48,
    "number": 43,
    "percentage_received": 100,
    "title": "Adquisición de termómetros digitales"
  },
  {
    "id": "d97a7175-500b-4be9-a19e-925505579510",
    "supplier_name": "Williams Inc",
    "status": "cancelled",
    "created_at": "2024-11-09T17:47:57.666006",
    "price": 2805.01,
    "number": 28,
    "percentage_received": 0,
    "title": "Compra de alcohol en gel"
  },
  {
    "id": "52ee0425-1ba7-42c9-94e4-34da4b187bc5",
    "supplier_name": "Collins, Cooper and Cox",
    "status": "cancelled",
    "created_at": "2024-11-12T17:47:57.666563",
    "price": 9415.25,
    "number": 44,
    "percentage_received": 0,
    "title": "Pedido de bolsas para desechos biológicos"
  },
  {
    "id": "e20224ea-15b3-4228-840b-80e588127148",
    "supplier_name": "Green-Gutierrez",
    "status": "ordered",
    "created_at": "2024-11-17T17:47:57.667134",
    "price": 3953.16,
    "number": 71,
    "percentage_received": 100,
    "title": "Compra de equipos de oxigenoterapia"
  },
  {
    "id": "4701ba28-7de9-42b8-95d6-2310ef514fc3",
    "supplier_name": "Garcia-Smith",
    "status": "pending",
    "created_at": "2024-10-31T17:47:57.667591",
    "price": 1569.28,
    "number": 27,
    "percentage_received": 2.4,
    "title": "Adquisición de lámparas quirúrgicas"
  },
  {
    "id": "f8c97598-30f7-41af-abe4-ab4c5aa94fb1",
    "supplier_name": "Thomas-Rose",
    "status": "pending",
    "created_at": "2024-11-27T17:47:57.668003",
    "price": 8730.76,
    "number": 79,
    "percentage_received": 90.59,
    "title": "Solicitud de camillas de traslado"
  },
  {
    "id": "98ff50f6-2ac4-4fdb-bacc-5b4e2d7bdf65",
    "supplier_name": "Underwood, Wells and Roth",
    "status": "pending",
    "created_at": "2024-11-14T17:47:57.668585",
    "price": 7279.57,
    "number": 26,
    "percentage_received": 89.02,
    "title": "Compra de gasas esterilizadas"
  },
  {
    "id": "3afbf83e-e928-4cd7-ae6a-385d17f2468e",
    "supplier_name": "Morris Group",
    "status": "pending",
    "created_at": "2024-11-12T17:47:57.668863",
    "price": 2238.24,
    "number": 79,
    "percentage_received": 50.7,
    "title": "Adquisición de medicamentos básicos"
  },
  {
    "id": "c60e1578-36e4-4d1e-9a8a-c18efe821adb",
    "supplier_name": "Brown-Cisneros",
    "status": "cancelled",
    "created_at": "2024-10-31T17:47:57.669342",
    "price": 7747.69,
    "number": 41,
    "percentage_received": 0,
    "title": "Compra de jeringas descartables"
  },
  {
    "id": "753cb0aa-f2f1-4706-bde6-bc027fba0551",
    "supplier_name": "Howard-Myers",
    "status": "pending",
    "created_at": "2024-11-07T17:47:57.669727",
    "price": 5745.11,
    "number": 66,
    "percentage_received": 46.34,
    "title": "Pedido de desfibriladores"
  },
  {
    "id": "2de552b3-7f2f-4f4f-a21c-bf3e5a5377e6",
    "supplier_name": "Wilson, Smith and Saunders",
    "status": "cancelled",
    "created_at": "2024-11-12T17:47:57.670229",
    "price": 2872.99,
    "number": 56,
    "percentage_received": 0,
    "title": "Compra de batas médicas"
  },
  {
    "id": "4ec0a464-8f23-4e15-b462-2a222a2502b2",
    "supplier_name": "Collins, Carlson and Hanna",
    "status": "ordered",
    "created_at": "2024-11-28T17:47:57.670751",
    "price": 5873.02,
    "number": 82,
    "percentage_received": 100,
    "title": "Renovación de instrumental quirúrgico"
  },
  {
    "id": "e37ec877-1312-4ec8-b587-db2a74a16f0f",
    "supplier_name": "Lawson, Rodriguez and Lane",
    "status": "cancelled",
    "created_at": "2024-11-06T17:47:57.671364",
    "price": 8248.75,
    "number": 51,
    "percentage_received": 0,
    "title": "Compra de estetoscopios"
  },
  {
    "id": "ee6d0971-a9d5-470e-be74-f3b18ea54b57",
    "supplier_name": "Perry Inc",
    "status": "cancelled",
    "created_at": "2024-11-21T17:47:57.671614",
    "price": 8062.23,
    "number": 6,
    "percentage_received": 0,
    "title": "Adquisición de tensiómetros digitales"
  },
  {
    "id": "9467fcb7-027c-4d28-b778-7be3004eb52f",
    "supplier_name": "King Group",
    "status": "pending",
    "created_at": "2024-11-11T17:47:57.671825",
    "price": 3504.99,
    "number": 29,
    "percentage_received": 12.81,
    "title": "Renovación de mobiliario clínico"
  },
  {
    "id": "da015b50-ec98-4266-8864-29b979020cc5",
    "supplier_name": "Jimenez, Jones and Davenport",
    "status": "pending",
    "created_at": "2024-11-07T17:47:57.672317",
    "price": 5549.19,
    "number": 91,
    "percentage_received": 3.8,
    "title": "Pedido de autoclaves"
  },
  {
    "id": "e2c86964-23a9-4254-a24c-68ac93d50913",
    "supplier_name": "Lester Group",
    "status": "ordered",
    "created_at": "2024-11-15T17:47:57.672500",
    "price": 4883.55,
    "number": 3,
    "percentage_received": 100,
    "title": "Compra de uniformes médicos"
  },
  {
    "id": "e11f6b33-ec14-4305-906f-7b87ae5cd296",
    "supplier_name": "Cruz, Wells and Perkins",
    "status": "pending",
    "created_at": "2024-11-05T17:47:57.673026",
    "price": 9138.11,
    "number": 10,
    "percentage_received": 60.25,
    "title": "Adquisición de insumos de laboratorio"
  }
]

export default function PurchaseOrdersPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header>
        <Button
          className="ml-auto"
          size="sm"
          asChild
        >
          <Link href="/purchases/purchase-orders/new">
            <Plus className="w-4 h-4" />
            Crear orden de compra
          </Link>
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 h-[calc(100svh-99px)]">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={(row) => router.push(`${pathname}/${row.id}`)}
          toolbar={({ table }) => <Toolbar table={table} />}
        />
      </div>
    </>
  )
}