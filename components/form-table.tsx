import { cn } from "@/lib/utils";
import { Loader2, Trash2 } from "lucide-react";
import { ArrayPath, Control, FieldValues, useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export interface FormTableColumn<TFormValues extends FieldValues> {
  header: React.ReactNode;
  minWidth?: number;
  width?: number;
  align?: "left" | "center" | "right";
  cellClassName?: string;
  headerClassName?: string;
  renderCell: (control: Control<TFormValues>, index: number, name: string) => React.ReactNode;
}

export interface FormTableProps<TFormValues extends FieldValues> {
  className?: string;
  loading?: boolean;
  columns: FormTableColumn<TFormValues>[];
  name: ArrayPath<TFormValues>;
  footer?: (props: { append: (value: any) => void }) => React.ReactNode;
}

export default function FormTable<TFormValues extends FieldValues>({
  columns,
  className,
  name,
  loading,
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
            {loading &&
              <TableRow className="border-none">
                <TableCell
                  colSpan={columns.length}
                  className="text-xs text-center h-10 border-b"
                >
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="animate-spin" size={14} />
                    Cargando...
                  </div>
                </TableCell>
              </TableRow>
            }
            {fields.length === 0 && !loading && (
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
                    {col.renderCell(control, index, name)}
                  </TableCell>
                ))}
                <TableCell className="py-0 pr-5 text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 transition-opacity opacity-0 group-hover:opacity-100"
                    onClick={() => {
                      removeItem(index);
                    }}
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
