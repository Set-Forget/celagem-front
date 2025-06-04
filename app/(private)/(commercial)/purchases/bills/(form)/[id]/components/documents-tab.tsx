import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { AdaptedBillDetail } from "@/lib/adapters/bills";
import { routes } from "@/lib/routes";
import { useGetBillQuery } from "@/lib/services/bills";
import { FieldDefinition } from "@/lib/utils";
import { FileX2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const fields: FieldDefinition<AdaptedBillDetail>[] = [
  {
    label: "Órdenes de compra",
    placeholderLength: 14,
    show: (p) => !!p?.purchase_orders.length,
    render: (p) => p?.purchase_orders?.map((order) => (
      <div className="grid grid-cols-1 justify-items-start" key={order.id}>
        <Button
          key={order.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.purchaseOrder.detail(order.id)}
            target="_blank"
          >
            {order.sequence_id}
          </Link>
        </Button>
      </div>
    ))
  },
  {
    label: "Notas de crédito",
    placeholderLength: 14,
    show: (p) => !!p?.credit_notes.length,
    render: (p) => p?.credit_notes?.map((creditNote) => (
      <div className="grid grid-cols-1 justify-items-start" key={creditNote.id}>
        <Button
          key={creditNote.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.purchaseCreditNote.detail(creditNote.id)}
            target="_blank"
          >
            {creditNote.sequence_id}
          </Link>
        </Button>
      </div>
    ))
  },
  {
    label: "Notas de débito",
    placeholderLength: 14,
    show: (p) => !!p?.debit_notes?.length,
    render: (p) => p?.debit_notes?.map((debitNote) => (
      <div className="grid grid-cols-1 justify-items-start" key={debitNote.id}>
        <Button
          key={debitNote.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.purchaseDebitNote.detail(debitNote.id)}
            target="_blank"
          >
            {debitNote.sequence_id}
          </Link>
        </Button>
      </div>
    ))
  },
  {
    label: "Registro de pagos",
    placeholderLength: 14,
    show: (p) => !!p?.payments?.length,
    render: (p) => p?.payments?.map((payment) => (
      <div className="grid grid-cols-1 justify-items-start" key={payment.id}>
        <Button
          key={payment.id}
          variant="link"
          className="p-0 h-auto text-foreground"
          asChild
        >
          <Link
            href={routes.payments.detail(payment.id)}
            target="_blank"
          >
            {payment.sequence_id}
          </Link>
        </Button>
      </div>
    ))
  }
];

export default function DocumentsTab() {
  const { id } = useParams<{ id: string }>()

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(id);

  const purchaseOrders = bill?.purchase_orders || []
  const creditNotes = bill?.credit_notes || []
  const debitNotes = bill?.debit_notes || []

  return (
    <div className="flex flex-col p-4">
      {purchaseOrders.length === 0 && creditNotes.length === 0 && debitNotes.length === 0 && bill?.payments?.length === 0 ? (
        <div className="flex flex-col gap-4 items-center col-span-full">
          <div className="bg-secondary p-3 rounded-full shadow-lg shadow-secondary">
            <FileX2 className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-xs">
            No hay documentos asociados a esta factura
          </p>
        </div>
      ) : (
        <RenderFields
          fields={fields}
          data={bill}
          loading={isBillLoading}
        />
      )}
    </div>
  )
}