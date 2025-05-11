import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useGetPurchaseRequestQuery, useLazyListPurchaseRequestsQuery } from "@/lib/services/purchase-requests"
import { useLazyListSuppliersQuery } from "@/lib/services/suppliers"
import { useLazyListCompaniesQuery } from "@/lib/services/users"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders"
import { columns } from "./columns"
import TableFooter from "./table-footer"
import { Info } from "lucide-react"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import DocumentInfo from "@/components/doc-info"
import { PurchaseRequestDetail } from "../../../purchase-requests/schemas/purchase-requests"
import { es } from "date-fns/locale"

const fields: FieldDefinition<PurchaseRequestDetail>[] = [
  {
    label: "Título",
    placeholderLength: 14,
    getValue: (p) => p?.name || "No especificado",
  },
  {
    label: "Compañía",
    placeholderLength: 10,
    getValue: (p) => p?.company?.name || "No especificada",
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 10,
    getValue: (p) => p?.request_date ? format(p?.request_date, "PP", { locale: es }) : "No especificada",
  },
  {
    label: "Fecha de creación",
    placeholderLength: 10,
    getValue: (p) => p?.created_at ? format(p.created_at, "PP", { locale: es }) : "No especificada",
  },
];

export default function GeneralForm() {
  const router = useRouter()
  const params = useSearchParams()

  const { control, formState } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>()

  const purchaseRequestId = params.get("purchase_request_id");

  const { data: purchaseRequest, isLoading: isPurchaseRequestLoading } = useGetPurchaseRequestQuery(purchaseRequestId!, { skip: !purchaseRequestId })

  const [searchSuppliers] = useLazyListSuppliersQuery()
  const [searchPurchaseRequest] = useLazyListPurchaseRequestsQuery()
  const [searchCompanies] = useLazyListCompaniesQuery()


  const handleSearchCompany = async (query?: string) => {
    try {
      const response = await searchCompanies({ name: query }).unwrap()
      return response.data?.map(company => ({
        id: company.id,
        name: company.name
      }))
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
        name: supplier.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchPurchaseRequest = async (query?: string) => {
    try {
      const response = await searchPurchaseRequest({ name: query }).unwrap()
      return response.data?.map(purchase_request => ({
        id: purchase_request.id,
        name: purchase_request.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

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
                  onChange={field.onChange}
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
          name="purchase_request"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Solicitud de pedido</FormLabel>
              <FormControl>
                <AsyncSelect<{ id: number, name: string }, number | undefined>
                  label="Solicitud de pedido"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar solicitud de pedido..."
                  fetcher={handleSearchPurchaseRequest}
                  getDisplayValue={(item) => item.name}
                  getOptionValue={(item) => item.id}
                  renderOption={(item) => <div>{item.name}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  getOptionKey={(item) => String(item.id)}
                  noResultsMessage="No se encontraron resultados"
                />
              </FormControl>
              {formState.errors.purchase_request ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Esta será la solicitud de pedido a la que se le emitirá la orden de compra.
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