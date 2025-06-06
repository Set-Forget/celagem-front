import { AsyncSelect } from "@/components/async-select";
import SearchSelect from "@/components/search-select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { accountTypes } from "../data";
import { newAccountSchema } from "../schemas/account";
import { useLazyListAccountingAccountsQuery } from "@/lib/services/accounting-accounts";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function NewAccountForm() {
  const { control, formState } = useFormContext<z.infer<typeof newAccountSchema>>()

  const [sendMessage] = useSendMessageMutation();
  const [searchAccountingAccounts] = useLazyListAccountingAccountsQuery()

  const handleSearchAccountingAccount = async (query?: string) => {
    try {
      const response = await searchAccountingAccounts({}, true).unwrap()
      return response.data?.map(account => ({
        id: account.id,
        name: account.name,
        code: account.code
      }))
        .filter(accountingAccount => accountingAccount.name.toLowerCase().includes(query?.toLowerCase() || "") || accountingAccount.code.toLowerCase().includes(query?.toLowerCase() || ""))
        .slice(0, 10)
    }
    catch (error) {
      sendMessage({
        location: "app/(private)/accounting/chart-of-accounts/components/new-account-form.tsx",
        rawError: error,
        fnLocation: "handleSearchAccountingAccount"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      return []
    }
  }

  return (
    <form className="gap-4 grid grid-cols-1">
      <FormField
        control={control}
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
                getDisplayValue={(item) => (
                  <div className="flex gap-1">
                    <span className="font-medium">
                      {item.code}
                    </span>
                    -{" "}
                    {item.name}
                  </div>
                )}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div className="truncate">
                  <span className="font-medium">
                    {item.code}
                  </span>
                  {" - "}
                  {item.name}
                </div>}
                onChange={(value, option) => {
                  field.onChange(value)
                  //setValue("parent_code", option?.code || "")
                }}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                modal
              />
            </FormControl>
            {formState.errors.parent ? (
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
          control={control}
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
          control={control}
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
        control={control}
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
  )
}