import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import React from "react"
import {
  FieldArrayPath,
  FieldValues,
  UseFieldArrayAppend,
  useFieldArray,
  useFormContext,
} from "react-hook-form"

type UnwrapArray<T> = T extends Array<infer U> ? U : T

interface FormTableProps<
  TFormValues extends FieldValues,
  TName extends FieldArrayPath<TFormValues>
> {
  name: TName
  columns: ColumnDef<UnwrapArray<TFormValues[TName]>>[]
  label?: string
  footer?: (props: {
    append: UseFieldArrayAppend<TFormValues, TName>
  }) => React.ReactNode
}

export default function FormTable<
  TFormValues extends FieldValues,
  TName extends FieldArrayPath<TFormValues>
>(props: FormTableProps<TFormValues, TName>) {
  const { name, columns, label, footer } = props

  const { control } = useFormContext<TFormValues>()

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { fields, append, remove } = useFieldArray<TFormValues, TName>({
    name,
    control,
  })

  const table = useReactTable<UnwrapArray<TFormValues[TName]>>({
    data: fields as UnwrapArray<TFormValues[TName]>[],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    meta: {
      remove,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getRowId: (row) => row.id,
  })

  return (
    <div className="flex flex-col gap-2 flex-grow">
      <div className="flex items-center justify-between w-full">
        {label && (
          <label className="text-sm font-medium leading-4 text-gray-700">
            {label}
          </label>
        )}
      </div>

      <div className="flex flex-col">
        <Table className="border-none">
          <TableHeader className="bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-b-0" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="h-9"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-px pl-px" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-none">
                <TableCell
                  colSpan={columns.length}
                  className="h-auto text-xs text-center text-muted-foreground"
                >
                  No hay items
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footer && footer({ append })}
        </Table>
      </div>
    </div>
  )
}
