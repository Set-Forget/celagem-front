'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import RenderFields from "@/components/render-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdaptedBillDetail } from "@/lib/adapters/bills";
import { routes } from "@/lib/routes";
import { useLazyGetBillQuery } from "@/lib/services/bills";
import { cn, FieldDefinition, formatNumber, placeholder } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "react-aria-components";
import { ChargeDetail } from "../../schemas/receipts";
import { chargeStatus } from "../../utils";
import Actions from "./actions";
import { columns } from "./components/columns";
import { useGetChargeQuery } from "@/lib/services/receipts";
import { AdaptedInvoiceDetail } from "@/lib/adapters/invoices";
import { useLazyGetInvoiceQuery } from "@/lib/services/invoices";

const fields: FieldDefinition<ChargeDetail>[] = [
  {
    label: "Fecha de cobro",
    placeholderLength: 14,
    render: (p) => format(parseISO(p.date), "PP", { locale: es }),
  },
  {
    label: "Método de cobro",
    placeholderLength: 10,
    render: (p) => p?.payment_method?.name || "No especificado",
  },
  {
    label: "Monto",
    placeholderLength: 10,
    render: (p) => `${p.currency.name} ${formatNumber(p.amount)}`
  },
  {
    label: "Retenciones",
    placeholderLength: 10,
    render: (p) => p.withholdings?.length > 0
      ? p.withholdings.map((w) => w.tax.name).join(", ")
      : "No especificadas",
  },
  {
    label: "Cuenta contable",
    placeholderLength: 10,
    render: (p) => <Button
      variant="link"
      className="h-auto p-0 text-foreground"
      asChild
    >
      <Link
        href={routes.chartOfAccounts.detail(p.source_account?.id)}
        target="_blank"
      >
        {p.source_account?.name}
      </Link>
    </Button>
  },
  {
    label: "Referencia",
    placeholderLength: 10,
    className: "col-span-2",
    render: (p) => p.payment_reference || "No especificada",
  }
];

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [getInvoice, { isLoading: isGettingInvoices }] = useLazyGetInvoiceQuery()

  const [invoices, setInvoices] = useState<(AdaptedInvoiceDetail & { payed_amount: number })[]>([])

  const { data: charge, isLoading: isChargeLoading } = useGetChargeQuery(id);

  const status = chargeStatus[charge?.state as keyof typeof chargeStatus];
  const chargeInvoices = charge?.reconciled_invoices?.map((invoice) => invoice.id) ?? [];

  useEffect(() => {
    if (chargeInvoices.length === 0) return
    (async () => {
      const invoices = await Promise.all(chargeInvoices.map((id) => getInvoice(id).unwrap()))
      setInvoices(invoices.map((invoice) => ({
        ...invoice,
        payed_amount: charge?.reconciled_invoices?.find((i) => i.sequence_id === invoice.sequence_id)?.amount_total || 0,
      })))
    })()
  }, [charge])

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isChargeLoading ? "blur-[4px]" : "blur-none")}>
          {isChargeLoading ? placeholder(13, true) : charge?.sequence_id}
        </h1>
      }>
        <div className="mr-auto">
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
          >
            {status?.label}
          </Badge>
        </div>
        <Actions />
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          loading={isChargeLoading}
          data={charge}
        />
        {invoices.length > 0 && (
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Comprobantes</Label>
            <DataTable
              data={invoices}
              loading={isChargeLoading || isGettingInvoices}
              columns={columns}
              pagination={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
