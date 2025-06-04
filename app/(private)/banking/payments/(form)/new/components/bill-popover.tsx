"use client"

import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  LinkIcon,
  Package,
  Unlink,
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { billStatus } from "@/app/(private)/(commercial)/purchases/bills/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { AdaptedBillDetail } from "@/lib/adapters/bills"
import { useLazyGetBillQuery } from "@/lib/services/bills"
import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPaymentSchema } from "../../../schemas/payments"
import { defaultValues } from "../../default-values"

export default function BillPopover() {
  const params = useSearchParams()
  const router = useRouter()
  const { reset } = useFormContext<z.infer<typeof newPaymentSchema>>()

  const billIds = useMemo(() => params.get("bill_ids")?.split(",").filter(Boolean) ?? [], [params])

  const [getBill] = useLazyGetBillQuery()

  const [bills, setBills] = useState<AdaptedBillDetail[]>([])
  const [isLoadingBills, setLoadingBills] = useState(false)

  useEffect(() => {
    if (billIds.length === 0) return
    setLoadingBills(true)

    let active = true
    const getBills = async () => {
      try {
        const results = await Promise.all(
          billIds.map((id) => getBill(id, true).unwrap()),
        )
        if (active) setBills(results.filter(Boolean))
      } finally {
        if (active) setLoadingBills(false)
      }
    }
    getBills()
    return () => {
      active = false
    }
  }, [billIds, getBill])

  const totalResidual = bills.reduce((s, b) => s + b.amount_residual, 0)
  const currencyName = bills[0]?.currency.name ?? ""

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          loading={isLoadingBills}
          className="h-7 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-50 hover:bg-indigo-100 hover:shadow-indigo-100 transition-all"
        >
          <LinkIcon className={cn(isLoadingBills && "hidden")} />
          {bills.length} {bills.length === 1 ? "Factura" : "Facturas"}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0 overflow-hidden">
        <div className="flex justify-between items-center m-2 p-3 bg-sidebar rounded-sm">
          <div>
            <p className="font-medium text-md">
              {bills.length === 1
                ? bills[0].number
                : `${bills.length} Facturas seleccionadas`}
            </p>
            <p className="text-xs text-muted-foreground">
              Factura{bills.length === 1 ? "" : "s"} de compra
            </p>
          </div>

          {bills.length === 1 && (
            <Badge
              variant="custom"
              className={cn(
                billStatus[bills[0].status as keyof typeof billStatus].bg_color,
                billStatus[bills[0].status as keyof typeof billStatus].text_color,
                "border-none",
              )}
            >
              {billStatus[bills[0].status as keyof typeof billStatus].label}
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

          {bills.length === 1 && (
            <>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Proveedor</span>
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium">
                  {bills[0].supplier.name}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Fecha</span>
                </div>
                <span className="text-sm font-medium">
                  {bills[0].created_at && format(parseISO(bills[0].created_at), "PP", { locale: es })}
                </span>
              </div>
            </>
          )}
        </div>

        <Separator />

        {bills.length === 1 ? (
          <div className="p-2 space-y-2">
            <div className="flex gap-2 items-center mb-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Productos ({bills[0].items.length})
              </span>
            </div>

            {bills[0].items.slice(0, 3).map((it) => (
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

            {bills[0].items.length > 3 && (
              <p className="text-xs text-muted-foreground text-center">
                +{bills[0].items.length - 3} productos más
              </p>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <div className="flex gap-2 items-center mb-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Facturas ({bills.length})
              </span>
            </div>
            {bills.map((b) => (
              <div key={b.id} className="flex justify-between items-start bg-sidebar rounded-md p-2">
                <div className="flex-1">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-foreground"
                    asChild
                  >
                    <Link href={`/purchases/bills/${b.id}`} target="_blank">
                      {b.number}
                    </Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {b.supplier.name}
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
              router.push(`/banking/payments/new`)
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
