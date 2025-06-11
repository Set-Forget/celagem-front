import {
  TableFooter as ShadFooter,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetCurrencyQuery } from "@/lib/services/currencies";
import { useLazyGetTaxQuery } from "@/lib/services/taxes";
import { columns } from "./columns";
import { cn } from "@/lib/utils";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
import { newChargeSchema } from "../../schemas/receipts";
import { formatNumber } from "@/lib/utils";

type ChargeForm = z.infer<typeof newChargeSchema>;

interface WithholdingDetail {
  id: number;
  name: string;
  pct: number;
}

export default function TableFooter() {
  const { control } = useFormContext<ChargeForm>();

  const invoices = useWatch({ control, name: "invoices" }) ?? [];
  const currencyId = useWatch({ control, name: "currency" });
  const withholdingIds = useWatch({ control, name: "withholdings" }) ?? [];

  const { data: currency } = useGetCurrencyQuery(currencyId, { skip: !currencyId });
  const currencyName = currency?.name ?? "";

  const [getTax] = useLazyGetTaxQuery();
  const [withholdingDetails, setWithholdingDetails] = useState<WithholdingDetail[]>([]);

  useEffect(() => {
    if (withholdingIds.length === 0) {
      setWithholdingDetails([]);
      return;
    }

    let active = true;
    const getTaxes = async () => {
      const details: WithholdingDetail[] = [];
      await Promise.all(
        withholdingIds.map(async (id: number) => {
          const { data } = await getTax(id, true);
          if (data) {
            details.push({
              id: data.id,
              name: data.name,
              pct: data.amount,
            });
          }
        })
      );
      if (active) {
        setWithholdingDetails(details);
      }
    };

    getTaxes();
    return () => {
      active = false;
    };
  }, [JSON.stringify(withholdingIds)]);

  const subtotal = useMemo(
    () => invoices.reduce((sum, inv) => sum + Number(inv.amount_residual), 0),
    [invoices]
  );

  const withholdingTotals = useMemo(() => {
    const map: Record<number, number> = {};
    withholdingDetails.forEach((w) => {
      map[w.id] = (subtotal * w.pct) / 100;
    });
    return map;
  }, [withholdingDetails, subtotal]);

  const totalWithheld = useMemo(() => {
    return withholdingDetails.reduce((acc, w) => {
      return acc + (subtotal * w.pct) / 100;
    }, 0);
  }, [withholdingDetails, subtotal]);

  const totalReceivable = subtotal - totalWithheld;

  return (
    <ShadFooter>
      <TableRow className="!border-b bg-background">
        <TableCell
          colSpan={columns.length - 1}
          className="h-6 text-xs font-medium py-0 text-end"
        >
          Subtotal (Sin retenciones)
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-left pr-5">
          {currencyName} {formatNumber(subtotal)}
        </TableCell>
      </TableRow>

      {withholdingDetails.map((w) => {
        const retenido = withholdingTotals[w.id] ?? 0;
        return (
          <TableRow key={w.id} className="!border-b bg-background">
            <TableCell
              colSpan={columns.length - 1}
              className="h-6 text-xs py-0 text-end"
            >
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      {w.name} ({w.pct}%)
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background text-foreground shadow-lg border p-2 rounded-sm w-[200px]">
                    <p className="font-medium text-xs">
                      {w.name} retiene {w.pct}% sobre el total
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className="h-6 text-xs py-0 text-left pr-5">
              {currencyName} {formatNumber(retenido)}
            </TableCell>
          </TableRow>
        );
      })}

      <TableRow className="!border-b">
        <TableCell
          colSpan={columns.length - 1}
          className="h-6 text-xs font-semibold py-0 text-end"
        >
          Total a Cobrar
        </TableCell>
        <TableCell className={cn("h-6 text-xs py-0 text-left pr-5 font-semibold")}>
          {currencyName} {formatNumber(totalReceivable)}
        </TableCell>
      </TableRow>
    </ShadFooter>
  );
}
