import Header from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { PaymentInvoicesTable } from "./components/payment-invoices-table"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //const customerId = (await params).id

  return (
    <div>
      <Header title="Pago 321461560092" />
      <Separator />
      <div className="flex flex-col gap-4 py-4 flex-1">
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Información del pago</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Proveedor
              </label>
              <span className="text-sm">
                Guantes S.A
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
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <h2 className="text-base font-medium">Cuentas</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Cuenta contable origen de la empresa
              </label>
              <span className="text-sm">
                SANTANDER - Cuenta Corriente
              </span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="px-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Facturas</h2>
          </div>
          <PaymentInvoicesTable />
        </div>
      </div>
    </div>
  )
}
