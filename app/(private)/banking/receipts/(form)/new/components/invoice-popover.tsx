"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  LinkIcon,
  Building2,
  Calendar,
  DollarSign,
  Package,
  Unlink,
  FileText,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newChargeSchema } from "../../../schemas/receipts"
import { useLazyGetInvoiceQuery } from "@/lib/services/invoices"
import { InvoiceDetail } from "@/app/(private)/(commercial)/sales/invoices/schemas/invoices"
import { defaultValues } from "../../default-values"
import { invoiceStatus } from "@/app/(private)/(commercial)/sales/invoices/utils"

export default function InvoicePopover() {
  const params = useSearchParams()
  const router = useRouter()
  const { reset } = useFormContext<z.infer<typeof newChargeSchema>>()

  const invoiceIds = useMemo(
    () => params.get("invoice_ids")?.split(",").filter(Boolean) ?? [],
    [params]
  )

  const [getInvoice] = useLazyGetInvoiceQuery()
  const [invoices, setInvoices] = useState<InvoiceDetail[]>([])
  const [isLoadingInvoices, setLoadingInvoices] = useState(false)

  useEffect(() => {
    if (invoiceIds.length === 0) return
    setLoadingInvoices(true)

    let active = true
    const getInvoices = async () => {
      try {
        const results = await Promise.all(
          invoiceIds.map((id) => getInvoice(id, true).unwrap()),
        )
        if (active) setInvoices(results.filter(Boolean))
      } finally {
        if (active) setLoadingInvoices(false)
      }
    }
    getInvoices()
    return () => {
      active = false
    }
  }, [invoiceIds, getInvoice])

  const totalResidual = invoices.reduce((s, b) => s + b.amount_residual, 0)
  const currencyName = invoices[0]?.currency.name ?? ""

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          loading={isLoadingInvoices}
          className="h-7 w-7 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-50 hover:bg-indigo-100"
        >
          <LinkIcon className={cn(isLoadingInvoices && "hidden")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0 overflow-hidden">
        <div className="flex justify-between items-center m-2 p-3 bg-sidebar rounded-sm">
          <div>
            <p className="font-medium text-md">
              {invoices.length === 1
                ? invoices[0].number
                : `${invoices.length} Facturas seleccionadas`}
            </p>
            <p className="text-xs text-muted-foreground">
              Factura{invoices.length === 1 ? "" : "s"} de compra
            </p>
          </div>

          {invoices.length === 1 && (
            <Badge
              variant="custom"
              className={cn(
                invoiceStatus[invoices[0].status as keyof typeof invoiceStatus].bg_color,
                invoiceStatus[invoices[0].status as keyof typeof invoiceStatus].text_color,
                "border-none",
              )}
            >
              {invoiceStatus[invoices[0].status as keyof typeof invoiceStatus].label}
            </Badge>
          )}
        </div>

        <div className="p-2 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Total pendiente</span>
            </div>
            <span className="font-medium">
              {totalResidual.toFixed(2)} {currencyName}
            </span>
          </div>

          {invoices.length === 1 && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cliente</span>
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium">
                  {invoices[0].customer.name}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Fecha</span>
                </div>
                <span className="text-sm font-medium">
                  {format(invoices[0].created_at, "PP", { locale: es })}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator />

        {invoices.length === 1 ? (
          <div className="p-2 space-y-2">
            <div className="flex gap-2 items-center mb-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Productos ({invoices[0].items.length})
              </span>
            </div>

            {invoices[0].items.slice(0, 3).map((it) => (
              <div key={it.id} className="bg-sidebar rounded-md p-2">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{it.product_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {it.product_id}
                    </p>
                  </div>
                  <p className="text-xs font-medium">{it.quantity} u.</p>
                </div>
              </div>
            ))}

            {invoices[0].items.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{invoices[0].items.length - 3} productos más
              </p>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <div className="flex gap-2 items-center mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Facturas ({invoices.length})
              </span>
            </div>
            {invoices.map((b) => (
              <div key={b.id} className="flex justify-between items-start bg-sidebar rounded-md p-2">
                <div className="flex-1">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-foreground"
                    asChild
                  >
                    <Link href={`/purchases/invoices/${b.id}`} target="_blank">
                      {b.number}
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {b.customer.name}
                  </p>
                </div>
                <span className="text-xs">
                  {b.amount_residual.toFixed(2)} {b.currency.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className="p-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {
              router.push(`/banking/receipts/new`)
              reset(defaultValues)
            }}
          >
            <Unlink />
            Desvincular
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
