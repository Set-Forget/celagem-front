'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import RenderFields from "@/components/render-fields";
import { Badge } from "@/components/ui/badge";
import { AdaptedBillDetail } from "@/lib/adapters/bills";
import { useLazyGetBillQuery } from "@/lib/services/bills";
import { useGetPaymentQuery } from "@/lib/services/payments";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "react-aria-components";
import { PaymentDetail } from "../../schemas/payments";
import { paymentStatus } from "../../utils";
import { columns } from "./components/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { routes } from "@/lib/routes";
import Actions from "./actions";

const fields: FieldDefinition<PaymentDetail>[] = [
  {
    label: "Fecha de pago",
    placeholderLength: 14,
    render: (p) => format(parseISO(p.date), "PP", { locale: es }),
  },
  {
    label: "Método de pago",
    placeholderLength: 10,
    render: (p) => p?.payment_method?.name || "No especificado",
  },
  {
    label: "Monto",
    placeholderLength: 10,
    render: (p) => `${p.currency.name} ${p.amount}`
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
    className: "cols-span-2",
    render: (p) => p.payment_reference || "No especificada",
  }
];

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [getBill, { isLoading: isGettingBills }] = useLazyGetBillQuery()

  const [bills, setBills] = useState<(AdaptedBillDetail & { payed_amount: number })[]>([])

  const { data: payment, isLoading: isPaymentLoading } = useGetPaymentQuery(id);

  const status = paymentStatus[payment?.state as keyof typeof paymentStatus];
  const paymentBills = payment?.invoices?.map((invoice) => invoice.id) ?? [];

  console.log(payment)

  useEffect(() => {
    if (paymentBills.length === 0) return
    (async () => {
      const bills = await Promise.all(paymentBills.map((id) => getBill(id).unwrap()))
      setBills(bills.map((bill) => ({
        ...bill,
        payed_amount: payment?.invoices?.find((i) => i.id === bill.id)?.amount_total || 0,
      })))
    })()
  }, [payment])

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isPaymentLoading ? "blur-[4px]" : "blur-none")}>
          {isPaymentLoading ? placeholder(13, true) : payment?.name}
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
          loading={isPaymentLoading}
          data={payment}
        />
        {bills.length > 0 && (
          <div className="space-y-1">
            <Label className="text-sm text-muted-foreground">Comprobantes</Label>
            <DataTable
              data={bills}
              loading={isPaymentLoading || isGettingBills}
              columns={columns}
              pagination={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
