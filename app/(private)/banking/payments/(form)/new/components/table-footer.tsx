import {
  TableFooter as ShadcnTableFooter,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";
import { z } from "zod";

import { newPaymentSchema } from "../../../schemas/payments";
import { columns, withholdings } from "./columns";
import { useListCurrenciesQuery } from "@/lib/services/currencies";

type PaymentForm = z.infer<typeof newPaymentSchema>;

export default function TableFooter({
  append,
}: {
  append: (value: any) => void;
}) {
  const { control } = useFormContext<PaymentForm>();

  const invoices = useWatch({ control, name: "invoices" }) || [];
  const currency = useWatch({ control, name: "currency" });

  const { data: currencies } = useListCurrenciesQuery();

  const currencyName = currencies?.data.find((c) => c.id === Number(currency))?.name;

  const {
    subtotal,
    subtotalWithholdings,
    withholdingTotals,
    withholdingDetails,
  } = useMemo(() => {
    const whLookup = Object.fromEntries(
      withholdings.map((w) => [w.id, w])
    ) as Record<number, (typeof withholdings)[number]>;

    const totals: Record<number, number> = {};
    let baseSubtotal = 0;

    invoices.forEach((inv) => {
      baseSubtotal += Number(inv.amount || 0);

      inv.withholding_ids?.forEach((id) => {
        const w = whLookup[id];
        if (!w) return;
        const applied = inv.amount * (w.amount / 100);
        totals[id] = (totals[id] ?? 0) + applied;
      });
    });

    const totalWithheld = Object.values(totals).reduce(
      (s, v) => s + v,
      0
    );

    return {
      subtotal: baseSubtotal,
      subtotalWithholdings: totalWithheld,
      withholdingTotals: totals,
      withholdingDetails: withholdings.filter((w) => w.id in totals),
    };
  }, [invoices, withholdings]);

  const percentage =
    subtotal > 0
      ? ((subtotalWithholdings / subtotal) * 100).toFixed(2)
      : "0.00";

  const handleAddItem = () => {
    append({ id: uuidv4(), amount: undefined });
  };

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="!border-b bg-background h-6" />

      <TableRow className="!border-b bg-background">
        <TableCell
          colSpan={columns.length - 1}
          className="h-6 text-xs font-medium py-0 text-end"
        >
          Subtotal (Sin ret.)
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencyName} {subtotal.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5" />
      </TableRow>

      <TableRow className="!border-b bg-background">
        <TableCell
          colSpan={columns.length - 1}
          className="h-6 text-xs font-medium py-0 text-end"
        >
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>Retenciones ({percentage}%)</span>
              </TooltipTrigger>

              <TooltipContent className="bg-background shadow-lg border border-border p-1 rounded-sm text-foreground">
                <div className="space-y-2">
                  <p className="font-medium">Retenciones ({percentage}%)</p>
                  <div className="flex flex-col gap-1">
                    {withholdingDetails.map((w) => (
                      <div
                        key={w.id}
                        className="flex justify-between gap-4 text-xs"
                      >
                        <span>{w.name}</span>
                        <span>
                          {currencyName} {withholdingTotals[w.id].toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>

        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencyName} {subtotalWithholdings.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5" />
      </TableRow>

      <TableRow className="!border-b">
        <TableCell
          colSpan={columns.length - 1}
          className="h-6 text-xs font-semibold py-0 text-end"
        >
          Total
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          <span className="font-semibold">
            {currencyName} {Number(subtotal - subtotalWithholdings).toFixed(2)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5" />
      </TableRow>

      <TableRow className="bg-background border-b-0 border-t">
        <TableCell
          className="h-6 text-xs font-medium py-0 p-0"
          colSpan={columns.length + 1}
        >
          <Button
            onClick={handleAddItem}
            size="sm"
            variant="ghost"
            type="button"
            className="h-7 rounded-none w-full"
          >
            <Plus />
            Agregar item
          </Button>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  );
}
