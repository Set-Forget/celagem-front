import {
  TableFooter as ShadcnTableFooter,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { useListCurrenciesQuery } from "@/lib/services/currencies";
import { newPaymentSchema } from "../../../schemas/payments";
import { columns } from "./columns";

type PaymentForm = z.infer<typeof newPaymentSchema>;

export default function TableFooter() {
  const { control } = useFormContext<PaymentForm>();

  const bills = useWatch({ control, name: "invoices" }) || [];
  const currency = useWatch({ control, name: "currency" });

  const { data: currencies } = useListCurrenciesQuery();

  const currencyName = currencies?.data.find((c) => c.id === Number(currency))?.name;

  const {
    subtotal,
    subtotalWithholdings,
  } = useMemo(() => {
    const totals: Record<number, number> = {};
    const totalWithheld = Object.values(totals).reduce(
      (s, v) => s + v,
      0
    );

    return {
      subtotal: bills.reduce((s, b) => s + Number(b.amount_residual), 0),
      subtotalWithholdings: totalWithheld,
      withholdingTotals: totals,
    };
  }, [bills]);

  return (
    <ShadcnTableFooter>
      {/*       <TableRow className="!border-b bg-background">
        <TableCell
          colSpan={columns.length - 1}
          className="h-6 text-xs font-medium py-0 text-end"
        >
          Subtotal (Sin ret.)
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencyName} {subtotal.toFixed(2)}
        </TableCell>
      </TableRow> */}
      <TableRow className="!border-b">
        <TableCell
          colSpan={columns.length - 1}
          className="h-6 text-xs font-semibold py-0 text-end"
        >
          Total a pagar
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span className="font-semibold">
            {currencyName} {Number(subtotal - subtotalWithholdings).toFixed(2)}
          </span>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  );
}
