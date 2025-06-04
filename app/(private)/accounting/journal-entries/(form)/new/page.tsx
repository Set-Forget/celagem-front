"use client"

import { AsyncSelect } from "@/components/async-select"
import CustomSonner from "@/components/custom-sonner"
import DatePicker from "@/components/date-picker"
import FormTable from "@/components/form-table"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useCreateJournalEntryMutation } from "@/lib/services/journal-entries"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newJournalEntrySchema } from "../../schemas/journal-entries"
import { columns } from "../components/columns"
import TableFooter from "../components/table-footer"

export default function Page() {
  const router = useRouter()

  const [searchCurrencies] = useLazyListCurrenciesQuery()

  const [createJournalEntry, { isLoading: isCreatingJournalEntry }] = useCreateJournalEntryMutation()

  const newJournalEntryForm = useForm<z.infer<typeof newJournalEntrySchema>>({
    resolver: zodResolver(newJournalEntrySchema),
    defaultValues: {
      items: [],
      date: parseDate(new Date().toISOString().split("T")[0]),
    }
  })

  const handleSearchCurrency = async (query?: string) => {
    try {
      const response = await searchCurrencies({ name: query }).unwrap()
      return response.data?.map(currency => ({
        id: currency.id,
        name: currency.name
      }))
        .slice(0, 10)
    } catch (error) {
      console.error(error)
      return []
    }
  }

  const onSubmit = async (data: z.infer<typeof newJournalEntrySchema>) => {
    const isBalanced = data.items.reduce((acc, item) => {
      const debit = Number(item.debit) || 0
      const credit = Number(item.credit) || 0
      return acc + debit - credit
    }, 0) === 0

    if (!isBalanced) {
      toast.custom((t) => <CustomSonner t={t} description="El asiento no está balanceado" variant="error" />)
      return
    }

    try {
      const response = await createJournalEntry({
        ...data,
        date: data.date.toString(),
        journal: 3
      }).unwrap()

      if (response.status === "success") {
        router.push(`/accounting/journal-entries/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Asiento creado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el asiento" variant="error" />)
    }
  }

  return (
    <Form {...newJournalEntryForm}>
      <Header title="Nuevo asiento">
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newJournalEntryForm.handleSubmit(onSubmit)}
            size="sm"
            loading={isCreatingJournalEntry}
          >
            Crear asiento
          </Button>
        </div>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={newJournalEntryForm.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Fecha del asiento</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value || null}
                  onChange={(date) => field.onChange(date)}
                  isDateUnavailable={(date) => date.compare(today(getLocalTimeZone())) > 0}
                />
              </FormControl>
              {newJournalEntryForm.formState.errors.date ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Esta será la fecha del asiento contable.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newJournalEntryForm.control}
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
                />
              </FormControl>
              {newJournalEntryForm.formState.errors.currency ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Moneda que figura en el asiento contable.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newJournalEntryForm.control}
          name="internal_notes"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full col-span-2">
              <FormLabel className="w-fit">
                Notas
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Notas del asiento"
                  className="resize-none"
                />
              </FormControl>
              {newJournalEntryForm.formState.errors.internal_notes ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Estas serán las notas del asiento contable.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newJournalEntryForm.control}
          name="items"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full col-span-2">
              <FormLabel className="w-fit">Items</FormLabel>
              <FormControl>
                <FormTable<z.infer<typeof newJournalEntrySchema>>
                  columns={columns}
                  footer={({ append }) => <TableFooter append={append} />}
                  name="items"
                  className="col-span-2"
                />
              </FormControl>
              {newJournalEntryForm.formState.errors.items?.message && (
                <p className="text-destructive text-[12.8px] mt-1 font-medium">
                  {newJournalEntryForm.formState.errors.items.message}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>
    </Form>
  )
}