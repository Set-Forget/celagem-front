import { Button } from "@/components/ui/button";
import { TableFooter as ShadcnTableFooter, TableCell, TableRow } from "@/components/ui/table";
import { useListCurrenciesQuery } from "@/lib/services/currencies";
import { useListTaxesQuery } from "@/lib/services/taxes";
import { Plus } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { newJournalEntrySchema } from "../../schemas/journal-entries";
import { columns } from "./columns";
import { formatNumber } from "@/lib/utils";

export default function TableFooter({ append }: { append: (value: any) => void }) {
  const { control } = useFormContext<z.infer<typeof newJournalEntrySchema>>()

  const { data: taxes } = useListTaxesQuery()
  const { data: currencies } = useListCurrenciesQuery()

  const currency = useWatch({
    control: control,
    name: "currency",
  });

  const items = useWatch({
    control,
    name: `items`,
  });

  const handleAddItem = () => {
    append({
      account: "",
      credit: 0,
      debit: 0,
      name: "",
    });
  };

  const debitSubtotal = items.reduce((acc, item) => {
    const debit = Number(item.debit) || 0;
    return acc + debit;
  }, 0);

  const creditSubtotal = items.reduce((acc, item) => {
    const credit = Number(item.credit) || 0;
    return acc + credit;
  }, 0);

  const debitTaxSubtotal = items.reduce((acc, item) => {
    const debit = Number(item.debit) || 0;
    const taxesAmount = item.taxes_id?.map(taxId => taxes?.data.find(tax => tax.id === taxId)?.amount || 0) || [];
    return acc + (debit * taxesAmount.reduce((acc, tax) => acc + tax, 0) / 100);
  }, 0);

  const creditTaxSubtotal = items.reduce((acc, item) => {
    const credit = Number(item.credit) || 0;
    const taxesAmount = item.taxes_id?.map(taxId => taxes?.data.find(tax => tax.id === taxId)?.amount || 0) || [];
    return acc + (credit * taxesAmount.reduce((acc, tax) => acc + tax, 0) / 100);
  }, 0);

  const debitTotal = debitSubtotal + debitTaxSubtotal;
  const creditTotal = creditSubtotal + creditTaxSubtotal;

  return (
    <ShadcnTableFooter>
      <TableRow className="!border-b bg-background h-6" />
      <TableRow>
        <TableCell colSpan={columns.length - 2} className="h-6 text-xs font-semibold py-0 text-start">
          <span>Total</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5">
          <span className="font-semibold">
            {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          </span>
          <span className="font-semibold">
            {formatNumber(debitTotal)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5">
          <span className="font-semibold">
            {currencies?.data.find(c => c.id === Number(currency))?.name}{" "}
          </span>
          <span className="font-semibold">
            {formatNumber(creditTotal)}
          </span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0 text-right pr-5"></TableCell>
      </TableRow>
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell className="h-6 text-xs font-medium py-0 p-0" colSpan={6}>
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
