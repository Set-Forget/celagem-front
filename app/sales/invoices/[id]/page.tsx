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
import { ChevronDown, Eye } from "lucide-react"
import Link from "next/link"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"

const data = [
  {
    "item_code": "ITEM-9634",
    "item_name": "Guantes de nitrilo",
    "description": "Guantes de nitrilo talla M",
    "quantity": 50,
    "id": "5e7361f5-0fbf-433b-8688-b65896a0f54a",
    "price": "400.93",
    "tax": "21",
  },
]

export default function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  const handleGeneratePDF = async () => {
    const { generateInvoicePDF } = await import("../templates/invoice")
    generateInvoicePDF()
  }

  return (
    <>
      <Header title="FA-4500001782">
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
              <DropdownMenuItem>
                Registro de pago
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sales/debit-notes/new">
                  Nota de débito
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/sales/credit-notes/new">
                  Nota de crédito
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
              <label className="text-muted-foreground text-sm">Fecha de emisión</label>
              <span className="text-sm">12 de febrero de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de vencimiento</label>
              <span className="text-sm">12 de marzo de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Sede</label>
              <span className="text-sm">Sede principal</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Contabilidad</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de contabilización</label>
              <span className="text-sm">12 de febrero de 2022</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Cuenta</label>
              <span className="text-sm">CAJA GENERAL</span>
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
            footer={() => <TableFooter />}
          />
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Documentos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Notas de débito</label>
              <div className="flex gap-2 items-center group w-fit">
                <span className="text-sm font-medium">ND-4500001782</span>
                <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Recepciones de compra</label>
              <div className="flex gap-2 items-center group w-fit">
                <span className="text-sm font-medium">RC-4500001782</span>
                <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
