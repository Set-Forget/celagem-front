'use client'

import { AsyncSelect } from "@/components/async-select";
import CustomSonner from "@/components/custom-sonner";
import SearchSelect from "@/components/search-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useLazyListAccountingAccountsQuery } from "@/lib/services/accounting-accounts";
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies";
import { useCreateJournalMutation } from "@/lib/services/journals";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newJournalSchema } from "../schema/journals";
import { journalReferenceTypes, journalTypes } from "../utils";

export default function NewJournalDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [createJournal, { isLoading: isCreatingJournal }] = useCreateJournalMutation()

  const [searchAccountingAccount] = useLazyListAccountingAccountsQuery()
  const [searchCurrencies] = useLazyListCurrenciesQuery()

  const newJournalForm = useForm<z.infer<typeof newJournalSchema>>({
    resolver: zodResolver(newJournalSchema),
    defaultValues: {
      name: "",
      code: "",
    }
  });

  const onOpenChange = () => {
    closeDialogs()
    newJournalForm.reset()
  }


  const onSubmit = async (data: z.infer<typeof newJournalSchema>) => {
    try {
      const response = await createJournal({
        ...data,
        company: 1, // ! Esto debería ser el id de la compañía pero necesito que Ciro acomode el endpoint para que reciba string.
      }).unwrap()

      if (response.status === "success") {
        closeDialogs()

        toast.custom((t) => <CustomSonner t={t} description="Diario contable creada correctamente" variant="success" />)
        newJournalForm.reset()
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el diario contable" variant="error" />)
    }
  }

  const handleSearchAccountingAccount = async (query?: string) => {
    try {
      const response = await searchAccountingAccount({ name: query }).unwrap()
      return response.data?.map(account => ({
        id: account.id,
        name: account.name,
        code: account.code
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const handleSearchCurrency = async (query?: string) => {
    try {
      const response = await searchCurrencies({ name: query }).unwrap()
      return response.data?.map(currency => ({
        id: currency.id,
        name: currency.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "new-journal"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Nuevo diario contable
          </DialogTitle>
          <DialogDescription>
            Crea un nuevo diario contable para el sistema de contabilidad.
          </DialogDescription>
        </DialogHeader>
        <Form {...newJournalForm}>
          <form className="gap-4 grid grid-cols-1">
            <FormField
              control={newJournalForm.control}
              name="default_account_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Cuenta contable por defecto</FormLabel>
                  <FormControl>
                    <AsyncSelect<{ id: number, name: string, code: string }, number | undefined>
                      label="Cuenta contable por defecto"
                      triggerClassName="!w-full"
                      placeholder="Seleccionar cuenta contable ..."
                      fetcher={handleSearchAccountingAccount}
                      getDisplayValue={(item) => `${item.code} - ${item.name}`}
                      getOptionValue={(item) => item.id}
                      renderOption={(item) => <div>{item.code} - {item.name}</div>}
                      onChange={(value) => {
                        field.onChange(value)
                      }}
                      value={field.value}
                      getOptionKey={(item) => String(item.id)}
                      noResultsMessage="No se encontraron resultados"
                      modal
                    />
                  </FormControl>
                  {newJournalForm.formState.errors.default_account_id ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Esta cuenta se usará como cuenta por defecto para el diario contable.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={newJournalForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre del diario contable..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newJournalForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Código del diario contable..."
                        {...field}
                        value={field.value.toUpperCase()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={newJournalForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">
                      Tipo de diario
                    </FormLabel>
                    <FormControl>
                      <SearchSelect
                        modal
                        value={field.value}
                        onSelect={field.onChange}
                        options={journalTypes}
                        placeholder="Selecciona un tipo de diario..."
                        searchPlaceholder="Buscar..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newJournalForm.control}
                name="invoice_reference_type"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">
                      Tipo de referencia de factura
                    </FormLabel>
                    <FormControl>
                      <SearchSelect
                        modal
                        value={field.value}
                        onSelect={field.onChange}
                        options={journalReferenceTypes}
                        placeholder="Selecciona un tipo de referencia..."
                        searchPlaceholder="Buscar..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={newJournalForm.control}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={() => newJournalForm.handleSubmit(onSubmit)()}
            size="sm"
            loading={isCreatingJournal}
            type="button">
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
