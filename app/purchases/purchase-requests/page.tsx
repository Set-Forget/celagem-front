'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { usePathname, useRouter } from "next/navigation";
import { columns } from "./components/columns";
import Toolbar from "./components/toolbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

const data = [
  {
    "title": "Compra de guantes quirúrgicos",
    "status": "cancelled",
    "requested_by": "Larry Hughes",
    "required_by": "2024-12-03T16:51:19.750031",
    "created_at": "2024-11-29T16:51:19.750060",
    "id": 1
  },
  {
    "title": "Reposición de batas médicas",
    "status": "ordered",
    "requested_by": "Christopher Williams",
    "required_by": "2024-12-28T16:51:19.750466",
    "created_at": "2024-11-29T16:51:19.750484",
    "id": 2
  },
  {
    "title": "Adquisición de alcohol en gel",
    "status": "pending",
    "requested_by": "Alicia Sawyer",
    "required_by": "2024-12-03T16:51:19.750877",
    "created_at": "2024-11-29T16:51:19.750894",
    "id": 3
  },
  {
    "title": "Compra de mascarillas N95",
    "status": "ordered",
    "requested_by": "Katherine James",
    "required_by": "2024-12-04T16:51:19.751217",
    "created_at": "2024-11-29T16:51:19.751232",
    "id": 4
  },
  {
    "title": "Renovación de instrumental quirúrgico",
    "status": "pending",
    "requested_by": "Michael Mills",
    "required_by": "2024-11-30T16:51:19.751547",
    "created_at": "2024-11-29T16:51:19.751557",
    "id": 5
  },
  {
    "title": "Solicitud de jeringas descartables",
    "status": "pending",
    "requested_by": "George Mcmillan",
    "required_by": "2024-12-09T16:51:19.751872",
    "created_at": "2024-11-29T16:51:19.751882",
    "id": 6
  },
  {
    "title": "Compra de gasas esterilizadas",
    "status": "pending",
    "requested_by": "Joseph Morris",
    "required_by": "2024-12-27T16:51:19.752173",
    "created_at": "2024-11-29T16:51:19.752184",
    "id": 7
  },
  {
    "title": "Adquisición de termómetros digitales",
    "status": "pending",
    "requested_by": "Ryan Oneill",
    "required_by": "2024-11-30T16:51:19.752495",
    "created_at": "2024-11-29T16:51:19.752509",
    "id": 8
  },
  {
    "title": "Compra de uniformes médicos",
    "status": "ordered",
    "requested_by": "Travis Miller",
    "required_by": "2024-12-12T16:51:19.752812",
    "created_at": "2024-11-29T16:51:19.752821",
    "id": 9
  },
  {
    "title": "Pedido de estetoscopios",
    "status": "ordered",
    "requested_by": "Sherry Thomas",
    "required_by": "2024-12-14T16:51:19.753092",
    "created_at": "2024-11-29T16:51:19.753102",
    "id": 10
  },
  {
    "title": "Compra de equipos de oxigenoterapia",
    "status": "cancelled",
    "requested_by": "Shane Evans",
    "required_by": "2024-12-22T16:51:19.753414",
    "created_at": "2024-11-29T16:51:19.753424",
    "id": 11
  },
  {
    "title": "Adquisición de lámparas quirúrgicas",
    "status": "pending",
    "requested_by": "Danielle Becker",
    "required_by": "2024-12-08T16:51:19.753718",
    "created_at": "2024-11-29T16:51:19.753729",
    "id": 12
  },
  {
    "title": "Solicitud de camillas de traslado",
    "status": "cancelled",
    "requested_by": "Jennifer Chambers",
    "required_by": "2024-12-12T16:51:19.753998",
    "created_at": "2024-11-29T16:51:19.754006",
    "id": 13
  },
  {
    "title": "Pedido de autoclave para esterilización",
    "status": "ordered",
    "requested_by": "David Castillo",
    "required_by": "2024-12-12T16:51:19.754293",
    "created_at": "2024-11-29T16:51:19.754303",
    "id": 14
  },
  {
    "title": "Compra de tensiómetros digitales",
    "status": "ordered",
    "requested_by": "Alex Jones",
    "required_by": "2024-12-24T16:51:19.754812",
    "created_at": "2024-11-29T16:51:19.754838",
    "id": 15
  },
  {
    "title": "Adquisición de medicamentos básicos",
    "status": "ordered",
    "requested_by": "Danielle Cabrera",
    "required_by": "2024-12-25T16:51:19.755140",
    "created_at": "2024-11-29T16:51:19.755151",
    "id": 16
  },
  {
    "title": "Renovación de mobiliario clínico",
    "status": "pending",
    "requested_by": "Judy Mercado",
    "required_by": "2024-12-10T16:51:19.755440",
    "created_at": "2024-11-29T16:51:19.755449",
    "id": 17
  },
  {
    "title": "Pedido de desfibriladores",
    "status": "cancelled",
    "requested_by": "Mallory Cherry",
    "required_by": "2024-12-15T16:51:19.755732",
    "created_at": "2024-11-29T16:51:19.755743",
    "id": 18
  },
  {
    "title": "Compra de bolsas para desechos biológicos",
    "status": "cancelled",
    "requested_by": "Roy Rodriguez",
    "required_by": "2024-12-28T16:51:19.756064",
    "created_at": "2024-11-29T16:51:19.756894",
    "id": 19
  },
  {
    "title": "Adquisición de insumos de laboratorio",
    "status": "cancelled",
    "requested_by": "Danielle Payne",
    "required_by": "2024-12-03T16:51:19.757388",
    "created_at": "2024-11-29T16:51:19.757403",
    "id": 20
  }
]

export default function PurchaseRequestsPage() {
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
          <Link href="/purchases/purchase-requests/new">
            <Plus className="w-4 h-4" />
            Crear solicitud
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