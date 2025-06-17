'use client'

import { DataTable } from "@/components/data-table";
import Header from "@/components/header";
import RenderFields from "@/components/render-fields";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdaptedBillDetail } from "@/lib/adapters/bills";
import { routes } from "@/lib/routes";
import { useLazyGetBillQuery } from "@/lib/services/bills";
import { useGetPaymentQuery } from "@/lib/services/payments";
import { cn, FieldDefinition, placeholder } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "react-aria-components";
import { PaymentDetail } from "../../schemas/payments";
import { paymentStatus } from "../../utils";
import Actions from "./actions";
import { columns } from "./components/columns";

const fields: FieldDefinition<PaymentDetail>[] = [
  {
    label: "Fecha de pago",
    placeholderLength: 14,
    render: (p) => p?.date && format(parseISO(p.date), "PP", { locale: es }),
  },
  {
    label: "Método de pago",
    placeholderLength: 10,
    render: (p) => p?.payment_method?.name || "No especificado",
  },
  {
    label: "Monto",
    placeholderLength: 10,
    render: (p) => `${p?.currency?.name} ${p?.amount}`
  },
  {
    label: "Retenciones",
    placeholderLength: 10,
    render: (p) => p?.withholdings?.length > 0
      ? p?.withholdings.map((w) => w.tax.name).join(", ")
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
        {p?.source_account?.name}
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

  const [getBill, { isLoading: isGettingBills }] = useLazyGetBillQuery()

  const [bills, setBills] = useState<(AdaptedBillDetail)[]>([])

  const { data: payment, isLoading: isPaymentLoading } = useGetPaymentQuery(id);

  const status = paymentStatus[payment?.state as keyof typeof paymentStatus];

  const paymentBills = payment?.reconciled_bills?.map((bill) => bill.id) ?? [];

  useEffect(() => {
    if (paymentBills.length === 0) return
    (async () => {
      const bills = await Promise.all(paymentBills.map((id) => getBill(id).unwrap()))
      setBills(bills)
    })()
  }, [payment])

  return (
    <div>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isPaymentLoading ? "blur-[4px]" : "blur-none")}>
          {isPaymentLoading ? placeholder(13, true) : payment?.sequence_id}
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
