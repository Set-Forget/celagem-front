import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { ArrayPath, Control, FieldValues, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { FormMessage } from "./ui/form";

export interface FormTableColumn<TFormValues extends FieldValues> {
  header: React.ReactNode;
  minWidth?: number;
  width?: number;
  align?: "left" | "center" | "right";
  cellClassName?: string;
  headerClassName?: string;
  renderCell: (control: Control<TFormValues>, index: number) => React.ReactNode;
}

export interface FormTableProps<TFormValues extends FieldValues> {
  className?: string;
  columns: FormTableColumn<TFormValues>[];
  name: ArrayPath<TFormValues>;
  footer?: (props: { append: (value: any) => void }) => React.ReactNode;
}

export default function FormTable<TFormValues extends FieldValues>({
  columns,
  className,
  name,
  footer,
}: FormTableProps<TFormValues>) {
  const { control } = useFormContext<TFormValues>();

  const { fields, append, remove: removeItem } = useFieldArray({ control, name: name });

  return (
    <div className={cn("flex flex-col gap-2 flex-grow", className)}>
      <div className="flex flex-col border rounded-sm overflow-hidden shadow-sm">
        <Table className="border-none">
          <TableHeader className="bg-sidebar">
            <TableRow>
              {columns.map((col, idx) => (
                <TableHead key={idx} className={
                  cn("h-9",
                    col.width && `w-[${col.width}px]`,
                    col.minWidth && `min-w-[${col.minWidth}px]`,
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                    col.align === "left" && "text-left",
                    col.headerClassName
                  )
                }>
                  {col.header}
                </TableHead>
              ))}
              <TableHead className="w-9 h-9"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  <span className="text-xs text-muted-foreground">No hay items</span>
                </TableCell>
              </TableRow>
            )}
            {fields.map((item, index) => (
              <TableRow key={item.id} className="group">
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    className={cn(
                      "p-0 border-l first:border-l-0",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                      col.align === "left" && "text-left",
                      col.cellClassName
                    )}
                  >
                    {col.renderCell(control, index)}
                  </TableCell>
                ))}
                <TableCell className="py-0 pr-5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 transition-opacity opacity-0 group-hover:opacity-100"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="!h-3.5 !w-3.5 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {footer && footer({ append })}
        </Table>
      </div>
    </div>
  );
}
