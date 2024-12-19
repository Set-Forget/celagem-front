import { TableCell, TableRow, TableFooter } from "@/components/ui/table";
import { columns } from "./columns";


export default function CustomTableFooter() {

  return (
    <TableFooter>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
          <span>Subtotal</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0">
          <span>ARS 400.93</span>
        </TableCell>
      </TableRow>
      <TableRow className="!border-b bg-background">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
          <span>Impuestos</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0">
          <span>ARS 84.00</span>
        </TableCell>
      </TableRow>
      <TableRow className="!border-b">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
          <span>Total nota de crédito</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0">
          <span>-ARS 484.93</span>
        </TableCell>
      </TableRow>
      <TableRow className="!border-b">
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
          <span>Total factura</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0">
          <span>ARS 484.93</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={columns.length - 1} className="h-6 text-xs font-medium py-0">
          <span>Saldo pendiente</span>
        </TableCell>
        <TableCell className="h-6 text-xs font-medium py-0">
          <span>ARS 0.00</span>
        </TableCell>
      </TableRow>
    </TableFooter>
  )
}