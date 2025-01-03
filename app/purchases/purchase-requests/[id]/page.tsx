'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { columns } from "./components/columns"

const data = [
  {
    "id": "1ebf68c9-8bb8-4da2-8b84-e33896a4f47b",
    "item_code": "CODE-3100",
    "item_name": "Guantes quirúrgicos",
    "description": "Guantes de látex quirúrgicos, talla M",
    "quantity": 100
  },
]

export default function PurchaseRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  const handleGeneratePDF = async () => {
    const { generatePurchaseRequestPDF } = await import("../templates/purchase-request")
    generatePurchaseRequestPDF()
  }

  return (
    <>
      <Header title="Compra de guantes quirúrgicos">
        <div className="mr-auto">
          <Badge
            variant="outline"
            className={cn(`bg-amber-100 text-amber-800 border-none rounded-sm`)}
          >
            Pendiente
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              Acciones
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Cancelar solicitud
              </DropdownMenuItem>
              <DropdownMenuItem>
                Envíar solicitud
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleGeneratePDF()}
              >
                Generar PDF
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/purchases/purchase-orders/new">
                  Orden de compra
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Header>
      <div className="flex flex-col gap-4 py-4 flex-1">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitado por</label>
              <span className="text-sm">Juan Perez</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitado el</label>
              <span className="text-sm">12 de enero de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Solicitado para</label>
              <span className="text-sm">12 de febrero de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Sede</label>
              <span className="text-sm">Sede principal</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Items</h2>
          </div>
          <DataTable
            data={data}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </>
  )
}
