"use client";

import { AsyncSelect } from "@/components/async-select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLazyListAccountingAccountsQuery } from "@/lib/services/accounting-accounts";
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies";
import { useLazyListPaymentTermsQuery } from "@/lib/services/payment-terms";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newCustomerSchema } from "../../../schema/customers";

export function AccountingForm() {
  const { control, formState } = useFormContext<z.infer<typeof newCustomerSchema>>();

  const [searchCurrencies] = useLazyListCurrenciesQuery();
  const [searchPaymentTerms] = useLazyListPaymentTermsQuery();
  const [searchAccountingAccounts] = useLazyListAccountingAccountsQuery();

  const handleSearchCurrency = async (query?: string) => {
    try {
      const response = await searchCurrencies({ name: query }).unwrap();
      return response.data?.map(currency => ({
        id: currency.id,
        name: currency.name,
      })) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSearchPaymentTerm = async (query?: string) => {
    try {
      const response = await searchPaymentTerms({ name: query }).unwrap();
      return response.data?.map(term => ({
        id: term.id,
        name: term.name,
      })) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSearchAccountingAccount = async (query?: string) => {
    try {
      const response = await searchAccountingAccounts({ name: query }).unwrap();
      return response.data?.map(account => ({
        id: account.id,
        name: account.name,
        code: account.code,
      })) || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="currency"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Moneda</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number | undefined>
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
            {formState.errors.currency ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Esta será la moneda del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="property_payment_term"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Condición de pago</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number | undefined>
                label="Condición de pago"
                triggerClassName="!w-full"
                placeholder="Seleccionar condición de pago..."
                fetcher={handleSearchPaymentTerm}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
            </FormControl>
            {formState.errors.property_payment_term ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Esta será la condición de pago del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="payment_method"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Método de pago</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Método de pago" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Metodo1">Método 1</SelectItem>
                  <SelectItem value="Metodo2">Método 2</SelectItem>
                  <SelectItem value="Metodo3">Método 3</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.payment_method ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el método de pago del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="accounting_account"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Cuenta contable</FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string, code: string }, number | undefined>
                label="Cuenta contable"
                triggerClassName="!w-full"
                placeholder="Seleccionar cuenta contable..."
                fetcher={handleSearchAccountingAccount}
                getDisplayValue={(item) => `${item.code} - ${item.name}`}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.code} - {item.name}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
              />
            </FormControl>
            {formState.errors.accounting_account ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Esta será la cuenta contable del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
    </div>
  );
}
