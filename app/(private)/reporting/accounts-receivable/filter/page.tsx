'use client'

import { useSupplierSelect } from "@/hooks/use-supplier-select";
import { AsyncMultiSelect } from "@/components/async-multi-select";
import CustomSonner from "@/components/custom-sonner";
import DateRangePicker from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useLazyListAccountsPayableQuery } from "@/lib/services/accounts-payable";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDate } from "@internationalized/date";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { voucherType } from "../utils";
import { useCustomerSelect } from "@/hooks/use-customer-select";
import { useSendMessageMutation } from "@/lib/services/telegram";

const formSchema = z.object({
  customer: z.array(z.number()).optional(),
  voucher_type: z.array(z.string()).optional(),
  include_paid: z.boolean().optional(),
  date: z.object({
    start: z.custom<CalendarDate>(),
    end: z.custom<CalendarDate>(),
  }).nullable().optional(),
  due_date: z.object({
    start: z.custom<CalendarDate>(),
    end: z.custom<CalendarDate>(),
  }).nullable().optional(),
})

const voucherTypes = Object.entries(voucherType).map(([key, value]) => ({
  id: key,
  name: value
}))

export default function Page() {
  const router = useRouter()

  const { fetcher: handleSearchCustomer } = useCustomerSelect()

  const [sendMessage] = useSendMessageMutation();
  const [listAccountsPayable, { isFetching: isListAccountsPayableFetching }] = useLazyListAccountsPayableQuery()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: [],
      voucher_type: [],
      include_paid: true
    }
  })

  const handleSearchVoucherType = useCallback(async (query?: string) => {
    return voucherTypes.filter(item => item.name.toLowerCase().includes(query?.toLowerCase() || ""))
  }, [])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const dateRange = {
      from: data.date?.start.toString(),
      to: data.date?.end.toString(),
      field: "date"
    }
    const dueDateRange = {
      from: data.due_date?.start.toString(),
      to: data.due_date?.end.toString(),
      field: "due_date"
    }
    const customer = data.customer?.join(",")
    const voucherTypes = data.voucher_type?.join(",")
    const includePaid = data.include_paid

    const params = new URLSearchParams();
    if (customer && customer.length > 0) params.append("customer", customer);
    if (dateRange.from && dateRange.to) params.append("date_range", JSON.stringify(dateRange));
    if (dueDateRange.from && dueDateRange.to) params.append("date_range", JSON.stringify(dueDateRange));
    if (voucherTypes && voucherTypes.length > 0) params.append("voucher_type", voucherTypes);
    if (includePaid) params.append("include_paid", includePaid.toString());

    try {
      const accountsPayable = await listAccountsPayable().unwrap()
      const filteredAccountsPayable = accountsPayable.data
        .filter(item => {
          if (customer && customer.length > 0) return customer.includes(String(item.partner.id))
          return true
        })
        .filter(item => {
          if (voucherTypes && voucherTypes.length > 0) return voucherTypes.includes(String(item.voucher_type))
          return true
        })
        .filter(item => {
          if (dateRange.from && dateRange.to) return item.date >= dateRange.from && item.date <= dateRange.to
          return true
        })
        .filter(item => {
          if (dueDateRange.from && dueDateRange.to) return item.due_date >= dueDateRange.from && item.due_date <= dueDateRange.to
          return true
        })
        .filter(item => {
          if (includePaid) return true;
          return item.outstanding_amount && item.outstanding_amount > 0;
        })

      if (filteredAccountsPayable.length === 0) {
        toast.custom((t) => <CustomSonner t={t} description="No se encontraron datos que cumplan con los filtros seleccionados" variant="warning" />)
        return
      }
    } catch (error) {
      sendMessage({
        location: "app/(private)/reporting/accounts-receivable/filter/page.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }

    router.push(`/reporting/accounts-receivable?${params.toString()}`);
  }

  return (
    <div className="flex h-full bg-accent overflow-hidden">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="inset-0 w-full max-w-[650px] m-auto border rounded-sm shadow-lg bg-background"
        >
          <div className="flex flex-col gap-1 p-4">
            <h2 className="text-lg font-medium leading-none tracking-tight">
              Cuentas por cobrar
            </h2>
            <p className="text-sm text-muted-foreground">
              Filtra los datos que se mostrarán en la tabla. En caso de no seleccionar ningún filtro, se mostrarán todos los datos.
            </p>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Cliente</FormLabel>
                  <AsyncMultiSelect<{ id: number, name: string }, number>
                    placeholder="Seleccionar cliente..."
                    fetcher={handleSearchCustomer}
                    getDisplayValue={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    renderOption={(item) => <div>{item.name}</div>}
                    onValueChange={field.onChange}
                    value={field.value}
                    getOptionKey={(item) => String(item.id)}
                    noResultsMessage="No se encontraron resultados"
                  />
                  {form.formState.errors.customer ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Clientes que figuran en los comprobantes.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de emisión</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        value={field.value || null}
                        onChange={(date) => {
                          field.onChange(date);
                          form.setValue("due_date", null);
                        }}
                      />
                    </FormControl>
                    {form.formState.errors.date ? (
                      <FormMessage />
                    ) :
                      <FormDescription>
                        Rango de fechas de emisión de los comprobantes.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Fecha de vencimiento</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        value={field.value || null}
                        onChange={(date) => {
                          field.onChange(date);
                          form.setValue("date", null);
                        }}
                      />
                    </FormControl>
                    {form.formState.errors.due_date ? (
                      <FormMessage />
                    ) :
                      <FormDescription>
                        Rango de fechas de vencimiento de los comprobantes.
                      </FormDescription>
                    }
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="voucher_type"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Tipos de comprobante</FormLabel>
                  <FormControl>
                    <AsyncMultiSelect<{ id: string, name: string }, string>
                      placeholder="Seleccionar tipo de comprobante..."
                      fetcher={handleSearchVoucherType}
                      getOptionValue={(item) => item.id}
                      getOptionKey={(item) => item.id}
                      getDisplayValue={(item) => item.name}
                      renderOption={(item) => <div>{item.name}</div>}
                      onValueChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron resultados"
                    />
                  </FormControl>
                  {form.formState.errors.voucher_type ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Tipos de comprobante que figuran en los comprobantes.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="include_paid"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Checkbox id="include_paid" checked={field.value} onCheckedChange={field.onChange} />
                      <Label htmlFor="include_paid">
                        Incluir comprobantes saldados
                      </Label>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="p-4 flex justify-end">
            <Button
              size="sm"
              type="submit"
              loading={isListAccountsPayableFetching}
            >
              Aplicar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
