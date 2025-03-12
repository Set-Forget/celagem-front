'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Toolbar from "./components/toolbar";
import { columns } from "./components/columns";
import { usePathname, useRouter } from "next/navigation";

const data = [
  {
    id: 1,
    name: "Laptop Dell XPS 15",
    code: "LAP-001",
    list_price: 1500.99,
    qty_available: 25,
    currency: { id: 1, name: "USD" }
  },
  {
    id: 2,
    name: "Monitor Samsung 27”",
    code: "MON-002",
    list_price: 300.50,
    qty_available: 40,
    currency: { id: 2, name: "ARS" }
  },
  {
    id: 3,
    name: "Teclado Mecánico RGB",
    code: "KEY-003",
    list_price: 120.75,
    qty_available: 60,
    currency: { id: 3, name: "COL" }
  },
  {
    id: 4,
    name: "Mouse Logitech MX Master 3",
    code: "MOU-004",
    list_price: 99.99,
    qty_available: 35,
    currency: { id: 1, name: "USD" }
  },
  {
    id: 5,
    name: "Disco SSD 1TB NVMe",
    code: "SSD-005",
    list_price: 199.95,
    qty_available: 50,
    currency: { id: 2, name: "ARS" }
  },
  {
    id: 6,
    name: "Memoria RAM 16GB DDR4",
    code: "RAM-006",
    list_price: 89.49,
    qty_available: 75,
    currency: { id: 3, name: "COL" }
  },
  {
    id: 7,
    name: "Fuente de Poder 750W",
    code: "PSU-007",
    list_price: 110.00,
    qty_available: 20,
    currency: { id: 1, name: "USD" }
  },
  {
    id: 8,
    name: "Tarjeta Gráfica RTX 4060",
    code: "GPU-008",
    list_price: 499.99,
    qty_available: 15,
    currency: { id: 2, name: "ARS" }
  },
  {
    id: 9,
    name: "Placa Madre ASUS ROG",
    code: "MBD-009",
    list_price: 229.99,
    qty_available: 30,
    currency: { id: 3, name: "COL" }
  },
  {
    id: 10,
    name: "Auriculares Inalámbricos Sony",
    code: "HEAD-010",
    list_price: 159.99,
    qty_available: 45,
    currency: { id: 1, name: "USD" }
  },
  {
    id: 11,
    name: "Silla Ergonómica para Oficina",
    code: "CHAIR-011",
    list_price: 275.00,
    qty_available: 10,
    currency: { id: 2, name: "ARS" }
  },
  {
    id: 12,
    name: "Monitor LG UltraWide 34”",
    code: "MON-012",
    list_price: 550.00,
    qty_available: 12,
    currency: { id: 3, name: "COL" }
  },
  {
    id: 13,
    name: "Impresora Multifunción HP",
    code: "PRINT-013",
    list_price: 149.95,
    qty_available: 8,
    currency: { id: 1, name: "USD" }
  },
  {
    id: 14,
    name: "Cable HDMI 4K 2m",
    code: "CABLE-014",
    list_price: 19.99,
    qty_available: 100,
    currency: { id: 2, name: "ARS" }
  },
  {
    id: 15,
    name: "Router WiFi 6 TP-Link",
    code: "ROUT-015",
    list_price: 89.90,
    qty_available: 25,
    currency: { id: 3, name: "COL" }
  },
  {
    id: 16,
    name: "Smartwatch Samsung Galaxy",
    code: "SWATCH-016",
    list_price: 249.99,
    qty_available: 20,
    currency: { id: 1, name: "USD" }
  },
  {
    id: 17,
    name: "Tablet iPad Air",
    code: "TAB-017",
    list_price: 599.99,
    qty_available: 10,
    currency: { id: 2, name: "ARS" }
  },
  {
    id: 18,
    name: "Disco Externo 2TB",
    code: "HDD-018",
    list_price: 120.00,
    qty_available: 35,
    currency: { id: 3, name: "COL" }
  },
  {
    id: 19,
    name: "Kit de Herramientas para PC",
    code: "TOOLKIT-019",
    list_price: 45.00,
    qty_available: 50,
    currency: { id: 1, name: "USD" }
  },
  {
    id: 20,
    name: "Cámara Web Logitech 1080p",
    code: "CAM-020",
    list_price: 75.99,
    qty_available: 30,
    currency: { id: 2, name: "ARS" }
  }
];

export default function ProductsPage() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <Header title="Inventario">
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => router.push(`${pathname}/new`)}
        >
          <Plus className="w-4 h-4" />
          Crear producto
        </Button>
      </Header>
      <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-[calc(100svh-225px)]">
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
