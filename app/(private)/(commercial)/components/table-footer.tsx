import {
  TableFooter as ShadFooter,
  TableCell,
  TableRow,
} from "@/components/ui/table";

export interface StaticFooterSelectors<I> {
  unitPrice(item: I): number;
  quantity(item: I): number;
  taxes?(item: I): readonly { id: number, amount: number, name: string }[];
  withholdings?(item: I): readonly number[];
  currency(): { name: string, id: number } | undefined;
  pendingAmount?(): number;
}

export interface StaticTableFooterProps<I> {
  items: readonly I[];
  selectors: StaticFooterSelectors<I>;
  colSpan: number;
}

export function TableFooter<I>({
  items,
  selectors,
  colSpan,
}: StaticTableFooterProps<I>) {
  const subtotal = items.reduce(
    (acc, item) =>
      acc + selectors.unitPrice(item) * selectors.quantity(item),
    0
  );

  const totalTaxes = selectors.taxes
    ? items.reduce(
      (acc, item) =>
        acc +
        (selectors.taxes?.(item)?.reduce((s, t) => s + t.amount, 0) ?? 0) *
        selectors.quantity(item),
      0
    )
    : 0;

  const totalWithholdings = selectors.withholdings
    ? items.reduce(
      (acc, item) =>
        acc +
        (selectors.withholdings?.(item)?.reduce((s, w) => s + w, 0) ?? 0) *
        selectors.quantity(item),
      0
    )
    : 0;

  const total = subtotal + totalTaxes - totalWithholdings;
  const currency = selectors.currency?.();

  return (
    <ShadFooter>
      <TableRow className="!border-solid !border-b bg-background h-6" />

      <TableRow className="!border-b bg-background">
        <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end">
          Subtotal&nbsp;(sin impuestos)
        </TableCell>
        <TableCell className="h-6 text-xs py-0 pr-5">
          {currency?.name} {subtotal.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs py-0 pr-5" />
      </TableRow>

      {selectors.taxes && items.flatMap(selectors.taxes).map((tax) => {
        return (
          <TableRow key={`tax-${tax.id}`} className="!border-b bg-background">
            <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end">
              {tax.name} ({tax.amount.toFixed(2)}%)
            </TableCell>
            <TableCell className="h-6 text-xs py-0 pr-5">
              {currency?.name} {tax.amount.toFixed(2)}
            </TableCell>
            <TableCell className="h-6 text-xs py-0 pr-5" />
          </TableRow>
        );
      })}

      {totalWithholdings !== 0 && (
        <TableRow>
          <TableCell colSpan={colSpan - 1} className="text-right font-semibold">
            Retenciones
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5">
            {currency?.name}
            {totalWithholdings.toFixed(2)}
          </TableCell>
        </TableRow>
      )}

      <TableRow className="!border-b">
        <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end font-semibold">
          Total
        </TableCell>
        <TableCell className="h-6 text-xs py-0 pr-5 font-semibold">
          {currency?.name} {total.toFixed(2)}
        </TableCell>
        <TableCell className="h-6 text-xs py-0 pr-5" />
      </TableRow>

      {selectors.pendingAmount && (
        <TableRow className="!border-b">
          <TableCell colSpan={colSpan - 1} className="h-6 text-xs py-0 text-end font-semibold">
            Saldo pendiente
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5 font-semibold">
            {currency?.name} {selectors.pendingAmount().toFixed(2)}
          </TableCell>
          <TableCell className="h-6 text-xs py-0 pr-5" />
        </TableRow>
      )}
    </ShadFooter>
  );
}
