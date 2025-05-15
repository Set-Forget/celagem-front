'use client'

import { AsyncSelect } from "@/components/async-select";
import CustomSonner from "@/components/custom-sonner";
import SearchSelect from "@/components/search-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateAccountingAccountMutation, useLazyListAccountingAccountsQuery } from "@/lib/services/accounting-accounts";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { accountTypes } from "../data";
import { newAccountSchema } from "../schemas/account";

export default function NewAccountDialog() {
  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [createAccount, { isLoading: isCreatingAccount }] = useCreateAccountingAccountMutation()
  const [searchAccountingAccounts] = useLazyListAccountingAccountsQuery()

  const newAccountForm = useForm<z.infer<typeof newAccountSchema>>({
    resolver: zodResolver(newAccountSchema),
    defaultValues: {
      name: "",
      code: "",
    }
  });

  const onOpenChange = () => {
    closeDialogs()
    newAccountForm.reset()
  }

  const onSubmit = async (data: z.infer<typeof newAccountSchema>) => {
    try {
      const response = await createAccount({
        ...data,
        company: 1, // ! Esto debería ser el id de la compañía pero necesito que Ciro acomode el endpoint para que reciba string.
      }).unwrap()

      if (response.status === "success") {
        closeDialogs()

        toast.custom((t) => <CustomSonner t={t} description="Cuenta contable creada correctamente" variant="success" />)
        router.push(`/accounting/chart-of-accounts/${response.data.id}`)
        newAccountForm.reset()
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la cuenta contable" variant="error" />)
    }
  }

  const handleSearchAccountingAccount = async (query?: string) => {
    try {
      const response = await searchAccountingAccounts({ name: query }).unwrap()
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

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "new-account"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            Nueva cuenta contable
          </DialogTitle>
          <DialogDescription>
            Crea una nueva cuenta contable para el sistema de contabilidad.
          </DialogDescription>
        </DialogHeader>
        <Form {...newAccountForm}>
          <form className="gap-4 grid grid-cols-1">
            <FormField
              control={newAccountForm.control}
              name="parent"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Cuenta contable padre</FormLabel>
                  <FormControl>
                    <AsyncSelect<{ id: number, name: string, code: string }, number | undefined>
                      label="Cuenta contable padre"
                      triggerClassName="!w-full"
                      placeholder="Seleccionar cuenta contable padre..."
                      fetcher={handleSearchAccountingAccount}
                      getDisplayValue={(item) => `${item.code} - ${item.name}`}
                      getOptionValue={(item) => item.id}
                      renderOption={(item) => <div>{item.code} - {item.name}</div>}
                      onChange={(value, option) => {
                        field.onChange(value)
                        //newAccountForm.setValue("parent_code", option?.code || "")
                      }}
                      value={field.value}
                      getOptionKey={(item) => String(item.id)}
                      noResultsMessage="No se encontraron resultados"
                      modal
                    />
                  </FormControl>
                  {newAccountForm.formState.errors.parent ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Esta será la cuenta contable padre de la nueva cuenta contable.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={newAccountForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nombre de la cuenta contable..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newAccountForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Código</FormLabel>
                    <div className="relative">
                      <Input
                        //className="peer ps-16"
                        placeholder="Código de la cuenta contable..."
                        {...field}
                      />
                      {/*                       <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                        https://
                      </span> */}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={newAccountForm.control}
              name="account_type"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">
                    Tipo de cuenta
                  </FormLabel>
                  <FormControl>
                    <SearchSelect
                      modal
                      value={field.value}
                      onSelect={field.onChange}
                      options={accountTypes}
                      placeholder="Selecciona un tipo de cuenta..."
                      searchPlaceholder="Buscar..."
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
            onClick={() => newAccountForm.handleSubmit(onSubmit)()}
            size="sm"
            loading={isCreatingAccount}
            type="button">
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
