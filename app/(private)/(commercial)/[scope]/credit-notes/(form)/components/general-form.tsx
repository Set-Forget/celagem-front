import { FormTableFooter } from "@/app/(private)/(commercial)/components/form-table-footer"
import { useCurrencySelect } from "@/app/(private)/(commercial)/hooks/use-currency-select"
import { useCustomerSelect } from "@/app/(private)/(commercial)/hooks/use-customer-select"
import { useSupplierSelect } from "@/app/(private)/(commercial)/hooks/use-supplier-select"
import { AsyncSelect } from "@/components/async-select"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useGetBillQuery } from "@/lib/services/bills"
import { useLazyGetCustomerQuery } from "@/lib/services/customers"
import { useGetInvoiceQuery } from "@/lib/services/invoices"
import { useLazyGetSupplierQuery } from "@/lib/services/suppliers"
import { createApply } from "@/lib/utils"
import { getLocalTimeZone, today } from "@internationalized/date"
import { useParams, useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { useFormContext } from "react-hook-form"
import { v4 as uuidv4 } from 'uuid'
import { NewCreditNote, NewCreditNoteLine } from "../../schemas/credit-notes"
import { columns } from "./columns"

export default function GeneralForm() {
  const { scope } = useParams<{ scope: "sales" | "purchases" }>()

  const params = useSearchParams()

  const invoiceId = params.get("invoiceId");
  const billId = params.get("billId");

  const { control, formState, setValue, resetField } = useFormContext<NewCreditNote>()

  const [getSupplier] = useLazyGetSupplierQuery()
  const [getCustomer] = useLazyGetCustomerQuery()

  const { initialOptions: initialCurrency, fetcher: handleSearchCurrency } = useCurrencySelect({
    currencyId: control._getWatch("currency"),
  })
  const { initialOptions: initialCustomer, fetcher: handleSearchCustomer } = useCustomerSelect({
    customerId: control._getWatch("partner"),
    skip: scope === "purchases",
  })
  const { initialOptions: initialSupplier, fetcher: handleSearchSupplier } = useSupplierSelect({
    supplierId: control._getWatch("partner"),
    skip: scope === "sales",
  })

  const { isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });
  const { isLoading: isBillLoading } = useGetBillQuery(billId ?? "", {
    skip: !billId
  });

  const isDocumentLoading = isInvoiceLoading || isBillLoading

  const apply = useMemo(
    () => createApply<NewCreditNote>(setValue, resetField),
    [setValue, resetField]
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {scope === "purchases" && (
        <>
          <FormField
            control={control}
            name="custom_sequence_number"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="w-fit">
                  Número de nota de crédito
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Número de nota de crédito"
                  />
                </FormControl>
                {formState.errors.custom_sequence_number ? (
                  <FormMessage />
                ) :
                  <FormDescription>
                    Número de la nota de crédito a crear.
                  </FormDescription>
                }
              </FormItem>
            )}
          />
        </>
      )}
      <FormField
        control={control}
        name="partner"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              {scope === "purchases" ? "Proveedor" : "Cliente"}
            </FormLabel>
            <AsyncSelect<{ id: number, name: string }, number>
              label={scope === "purchases" ? "Proveedor" : "Cliente"}
              triggerClassName="!w-full"
              placeholder={`Seleccionar ${scope === "purchases" ? "proveedor" : "cliente"}...`}
              fetcher={scope === "purchases" ? handleSearchSupplier : handleSearchCustomer}
              getDisplayValue={(item) => item.name}
              getOptionValue={(item) => item.id}
              renderOption={(item) => <div>{item.name}</div>}
              onChange={async (id) => {
                field.onChange(id)
                const partner = scope === "purchases"
                  ? await getSupplier(id).unwrap()
                  : await getCustomer(id).unwrap()

                //apply("payment_method", supplier?.payment_method?.id || undefined)
                apply("currency", partner?.currency.id)
                //apply("payment_term", supplier?.property_payment_term?.id)
              }}
              value={field.value}
              getOptionKey={(item) => String(item.id)}
              noResultsMessage="No se encontraron resultados"
              initialOptions={scope === "purchases" ? initialSupplier : initialCustomer}
            />
            {formState.errors.partner ? (
              <FormMessage />
            ) :
              <FormDescription>
                {scope === "purchases" ? "Proveedor que figura en la nota de crédito." : "Cliente que figura en la nota de crédito."}
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de nota de crédito</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
                isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) > 0}
              />
            </FormControl>
            {formState.errors.date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha de emisión de la nota de crédito.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="accounting_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de contabilización</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
                isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) > 0}
              />
            </FormControl>
            {formState.errors.accounting_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la fecha en la que se contabilizará la nota de crédito.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="currency"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Moneda</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
                label="Moneda"
                triggerClassName="!w-full"
                placeholder="Seleccionar moneda..."
                fetcher={handleSearchCurrency}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                initialOptions={initialCurrency}
              />
            </FormControl>
            {formState.errors.currency ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la moneda de la nota de crédito.
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
              <FormTable<NewCreditNote>
                name="items"
                className="col-span-2"
                columns={columns}
                loading={isDocumentLoading}
                footer={({ append }) =>
                  <FormTableFooter<NewCreditNote, NewCreditNoteLine>
                    control={control}
                    onAddRow={() => append({
                      id: uuidv4(),
                      product_id: null,
                      quantity: 1,
                      price_unit: 0,
                      account_id: null,
                      cost_center: null,
                      taxes_id: []
                    })}
                    colSpan={columns.length}
                    selectors={{
                      items: (values) => values.items,
                      currencyId: (values) => values.currency,
                      unitPrice: (items) => items.price_unit,
                      quantity: (items) => items.quantity,
                      taxes: (items) => items.taxes_id ?? [],
                    }}
                  />
                }
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
  )
}