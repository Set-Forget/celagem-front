import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Eye } from "lucide-react"

export default async function PurchaseRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  return (
    <>
      <Header title="Pago 321461560092" />
      <Separator />
      <div className="flex flex-col gap-4 py-4 flex-1">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                ID de transacción
              </label>
              <span className="text-sm">
                321461560092
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Modo de pago
              </label>
              <span className="text-sm">
                Transferencia bancaria
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de pago</label>
              <span className="text-sm">
                12 de febrero de 2022
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Centro de costos</label>
              <span className="text-sm">PRINCIPAL</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Pago desde/hacia</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Tipo de parte
              </label>
              <span className="text-sm">
                Proveedor
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Parte
              </label>
              <span className="text-sm">
                Guantes S.A
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Cuenta bancaria de la empresa</label>
              <Button
                variant="link"
                size="sm"
                className="text-foreground text-sm justify-start p-0 h-auto"
              >
                Banco Santander - Cuenta Corriente
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Cuenta bancaria de la parte</label>
              <Button
                variant="link"
                size="sm"
                className="text-foreground text-sm justify-start p-0 h-auto"
              >
                Banco Galicia - Cuenta Corriente
              </Button>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Cuentas</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Cuenta pagada desde
              </label>
              <span className="text-sm">
                CAJA GENERAL
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Cuenta pagada a
              </label>
              <span className="text-sm">
                PROVEEDORES
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Monto</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Moneda
              </label>
              <span className="text-sm">
                ARS
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Monto
              </label>
              <span className="text-sm">
                5000,00
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Documentos</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Factura de compra</label>
              <div className="flex gap-2 items-center group w-fit">
                <span className="text-sm font-medium">FC-4500001782</span>
                <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Orden de compra</label>
              <div className="flex gap-2 items-center group w-fit">
                <span className="text-sm font-medium">OC-4500001782</span>
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
