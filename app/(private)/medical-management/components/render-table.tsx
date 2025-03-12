import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { generateSchema, getDefaultValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Fragment } from "react";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { ColumnConfig, FieldConfig } from "../scheduler/appointment/[id]/page";
import RenderColumn from "./render-column";
import { format } from "date-fns";

export default function RenderTable({ ...fields }: { tableColumns?: ColumnConfig[], name: string, type?: string }) {
  const { setValue } = useFormContext()

  if (!fields.tableColumns) {
    throw new Error("tableColumns no puede ser undefined");
  }

  const schema = generateSchema([{ columns: fields.tableColumns, sectionName: "" }]);
  const defaultValues = getDefaultValues([{ columns: fields.tableColumns, sectionName: "" }]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const list = useWatch({
    name: fields.name,
    defaultValue: [],
  })

  const onSubmit = (data: z.infer<typeof schema>) => {
    setValue(fields.name, [...list, data])
    form.reset()
  }

  const getHeaders = (columns?: ColumnConfig[]): string[] => {
    if (!columns) return [];

    const headers: string[] = [];

    const traverse = (column: ColumnConfig) => {
      if ("rows" in column) {
        column.rows.forEach(traverse);
      } else if ("columns" in column) {
        column.columns.forEach(traverse);
      } else if ("label" in column && column.label) {
        headers.push(column.label);
      }
    };

    columns.forEach(traverse);
    return headers;
  };

  const getCells = (columns?: ColumnConfig[]): FieldConfig[] => {
    if (!columns) return [];

    const cells: FieldConfig[] = [];

    const traverse = (column: ColumnConfig) => {
      if ("rows" in column) {
        column.rows.forEach(traverse);
      } else if ("columns" in column) {
        column.columns.forEach(traverse);
      } else {
        cells.push(column);
      }
    };

    columns.forEach(traverse);
    return cells;
  }

  const headers = getHeaders(fields.tableColumns);
  const cells = getCells(fields.tableColumns);

  return (
    <div className="flex flex-col gap-4 w-full">
      <Form {...form}>
        <div
          className="grid gap-4 w-full"
          style={{
            gridTemplateColumns: `repeat(1, 1fr)`,
          }}
        >
          {fields.tableColumns?.map((column, columnIndex) =>
            <Fragment key={columnIndex}>
              <RenderColumn column={column} control={form.control} />
            </Fragment>
          )}
        </div>
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="ml-auto shrink-0"
          size="sm"
        >
          Agregar
        </Button>
      </Form>
      <div className="overflow-hidden rounded-md border border-border bg-background w-full">
        <Table className="border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
          <TableHeader className="sticky top-0 z-10 bg-accent/90 backdrop-blur-sm">
            <TableRow className="bg-muted/50">
              {headers.map((header, index) => (
                <TableHead className="text-nowrap h-9" key={index}>{header}</TableHead>
              ))}
              <TableHead className="text-right pr-4 h-9"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!list || !list.length && (
              <TableRow className="[&:nth-last-child(2)]:border-b-0">
                <TableCell
                  colSpan={headers.length + 1}
                  className="text-center"
                >
                  <span className="text-xs text-muted-foreground">No hay datos</span>
                </TableCell>
              </TableRow>
            )}
            {list.map((row: z.infer<typeof schema>, index: number) => (
              <TableRow className="[&:nth-last-child(2)]:border-b-0" key={index}>
                {cells.map((cell, cellIndex) => {
                  let value;

                  if (cell.type === "select" || cell.type === "combobox") {
                    if (cell.dependsOn) {
                      const parentValue = row[cell.dependsOn.field];
                      const filteredOptions = cell.dependsOn.filterOptions.find(
                        (filter) => filter.parentValue === parentValue
                      )?.options;

                      value =
                        filteredOptions?.find((option) => option.value === row[cell.name])
                          ?.label || row[cell.name];
                    } else {
                      value =
                        cell.options?.find((option) => option.value === row[cell.name])
                          ?.label || row[cell.name];
                    }
                  } else if (cell.type === "date") {
                    value = format(new Date(row[cell.name]), "dd MMM yy");
                  } else if (cell.type === "time") {
                    const currentDate = new Date();
                    const time = row[cell.name];

                    const date = new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate(),
                      time.hour || 0,
                      time.minute || 0,
                      time.second || 0,
                      time.millisecond || 0
                    );
                    value = format(date, "HH:mm a");
                  } else {
                    value = row[cell.name];
                  }

                  return <TableCell key={cellIndex}>{value}</TableCell>;
                })}
                <TableCell className="text-right pr-4">
                  <Button
                    type="button"
                    size="icon"
                    className="h-7 w-7 !text-destructive"
                    variant="ghost"
                    onClick={() => {
                      setValue(fields.name,
                        list.filter((_: any, i: number) => i !== index));
                    }}
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}