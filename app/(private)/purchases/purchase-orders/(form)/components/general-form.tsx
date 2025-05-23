import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useGetPurchaseRequestQuery, useLazyListPurchaseRequestsQuery } from "@/lib/services/purchase-requests"
import { useLazyGetSupplierQuery, useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { cn, createApply, FieldDefinition, placeholder } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { Info } from "lucide-react"
import { format, parseISO } from "date-fns"
import { Separator } from "@/components/ui/separator"
import DocumentInfo from "@/components/doc-info"
import { PurchaseRequestDetail } from "../../../purchase-requests/schemas/purchase-requests"
import { es } from "date-fns/locale"
import { useLazyListCompaniesQuery } from "@/lib/services/companies"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useMemo } from "react"

const fields: FieldDefinition<PurchaseRequestDetail>[] = [
  {
    label: "Título",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado",
  },
  {
    label: "Compañía",
    placeholderLength: 10,
    render: (p) => p?.company?.name || "No especificada",
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    render: (p) => p?.request_date ? format(parseISO(p?.request_date), "PP", { locale: es }) : "No especificada",
  },
  {
    label: "Fecha de creación",
    placeholderLength: 10,
    render: (p) => p?.created_at ? format(parseISO(p.created_at), "PP", { locale: es }) : "No especificada",
  },
];

export default function GeneralForm() {
  const params = useSearchParams()

  const { control, formState, setValue, resetField } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

  const purchaseRequestId = params.get("purchase_request_id");

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(purchaseRequestId!, { skip: !purchaseRequestId })

  const [searchSuppliers] = useLazyListSuppliersQuery()
  const [getSupplier] = useLazyGetSupplierQuery()
  const [searchCompanies] = useLazyListCompaniesQuery()

  const handleSearchCompany = async (query?: string) => {
    try {
      const response = await searchCompanies({ name: query }).unwrap()
      return response.data?.map(company => ({
        id: company.id,
        name: company.name
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchSupplier = async (query?: string) => {
    try {
      const response = await searchSuppliers({ name: query }).unwrap()
      return response.data?.map(supplier => ({
        id: supplier.id,
        name: supplier.name,
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const apply = useMemo(
    () => createApply<z.infer<typeof newPurchaseOrderSchema>>(setValue, resetField),
    [setValue, resetField]
  );

  return (
    <>
      {purchaseRequestId && (
        <div className="p-4 pb-0">
          <DocumentInfo<PurchaseRequestDetail>
            title="Información de la solicitud de pedido."
            data={purchaseRequest}
            isLoading={isPurchaseRequestLoading}
            fields={fields}
          />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={control}
          name="supplier"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Proveedor</FormLabel>
              <FormControl>
                <AsyncSelect<{ id: number, name: string }, number>
                  label="Proveedor"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar proveedor..."
                  fetcher={handleSearchSupplier}
                  getDisplayValue={(item) => item.name}
                  getOptionValue={(item) => item.id}
                  renderOption={(item) => <div>{item.name}</div>}
                  onChange={async (id) => {
                    field.onChange(id)
                    const supplier = await getSupplier(id).unwrap()

                    apply("payment_term", supplier?.property_payment_term?.id);
                    apply("currency", supplier?.currency?.id);
                  }}
                  value={field.value}
                  getOptionKey={(item) => String(item.id)}
                  noResultsMessage="No se encontraron resultados"
                />
              </FormControl>
              {formState.errors.supplier ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Esta será el proveedor al que se le emitirá la orden de compra.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="required_date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Fecha de requerimiento</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value || null}
                  onChange={(date) => field.onChange(date)}
                  isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) < 0}
                />
              </FormControl>
              {formState.errors.required_date ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Esta será la fecha en la que se requiere la entrega de los productos.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Compañia</FormLabel>
              <AsyncSelect<{ id: string, name: string }, string>
                label="Compañia"
                triggerClassName="!w-full"
                placeholder="Seleccionar compañia..."
                fetcher={handleSearchCompany}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
              {formState.errors.company ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Compañia desde la cual se generará la orden de compra.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="items"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full col-span-2">
              <FormLabel className="w-fit">Items</FormLabel>
              <FormControl>
                <FormTable<z.infer<typeof newPurchaseOrderSchema>>
                  columns={columns}
                  footer={({ append }) => <TableFooter append={append} />}
                  name="items"
                  className="col-span-2"
                />
              </FormControl>
              {formState.errors.items?.message && (
                <p className="text-destructive text-[12.8px] mt-1 font-medium">
                  {formState.errors.items.message}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>
    </>
  )
}