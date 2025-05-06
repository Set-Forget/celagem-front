import { AsyncSelect } from "@/components/async-select"
import SearchSelect from "@/components/search-select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useLazyListAccountingAccountsQuery } from "@/lib/services/accounting-accounts"
import { useLazyListCurrenciesQuery } from "@/lib/services/currencies"
import { useLazyListPaymentTermsQuery } from "@/lib/services/payment-terms"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newSupplierSchema } from "../../../schema/suppliers"
import { economic_activity, payment_methods } from "../data"

export default function FiscalAccountingForm() {
  const { control, formState } = useFormContext<z.infer<typeof newSupplierSchema>>()

  const [searchCurrencies] = useLazyListCurrenciesQuery()
  const [searchPaymentTerms] = useLazyListPaymentTermsQuery()
  const [searchAccountingAccounts] = useLazyListAccountingAccountsQuery()

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

  const handleSearchPaymentTerm = async (query?: string) => {
    try {
      const response = await searchPaymentTerms({ name: query }).unwrap()
      return response.data?.map(term => ({
        id: term.id,
        name: term.name
      }))
    }
    catch (error) {
      console.error(error)
      return []
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

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="commercial_company_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre registrado</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Guantes S.A."
              />
            </FormControl>
            {formState.errors.commercial_company_name ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el nombre registrado del proveedor que se registrará.
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
              />
            </FormControl>
            {formState.errors.currency ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la moneda del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="tax_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Tipo de documento
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Regimen tributario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="11">
                    Registro civil de nacimiento
                  </SelectItem>
                  <SelectItem value="12">
                    Tarjeta de identidad
                  </SelectItem>
                  <SelectItem value="13">
                    Cédula de ciudadanía
                  </SelectItem>
                  <SelectItem value="21">
                    Tarjeta de extranjería
                  </SelectItem>
                  <SelectItem value="22">
                    Cédula de extranjería
                  </SelectItem>
                  <SelectItem value="31">
                    NIT/CUIT
                  </SelectItem>
                  <SelectItem value="41">
                    Pasaporte
                  </SelectItem>
                  <SelectItem value="42">
                    Tipo doc. extranjero
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_type ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el tipo de documento del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="tax_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Identificación fiscal</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="30-12345678-9"
              />
            </FormControl>
            {formState.errors.tax_id ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el CUIT/NIT del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="property_payment_term"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Condición de pago
            </FormLabel>
            <FormControl>
              <AsyncSelect<{ id: number, name: string }, number>
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
            ) :
              <FormDescription>
                Esta será la condición de pago del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="payment_method"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Metodo de pago</FormLabel>
            <SearchSelect
              value={field.value}
              onSelect={field.onChange}
              options={payment_methods}
              placeholder="Metodo de pago"
              searchPlaceholder="Buscar..."
            />
            {formState.errors.payment_method ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el método de pago del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="tax_regime"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Regimen tributario
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Regimen tributario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EE">
                    Empresas del estado
                  </SelectItem>
                  <SelectItem value="EX">
                    Extranjero
                  </SelectItem>
                  <SelectItem value="GC">
                    Gran contribuyente
                  </SelectItem>
                  <SelectItem value="NR">
                    No responsable de IVA
                  </SelectItem>
                  <SelectItem value="RE">
                    Régimen especial
                  </SelectItem>
                  <SelectItem value="RCN">
                    Régimen común no retenedor
                  </SelectItem>
                  <SelectItem value="RC">
                    Régimen común
                  </SelectItem>
                  <SelectItem value="RS">
                    Régimen simplificado
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_regime ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el regimen tributario del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="tax_category"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Regimen fiscal
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Regimen fiscal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="4">
                    Régimen simple
                  </SelectItem>
                  <SelectItem value="5">
                    Régimen ordinario
                  </SelectItem>
                  <SelectItem value="48">
                    Impuesto sobre las ventas - IVA
                  </SelectItem>
                  <SelectItem value="49">
                    No responsable de IVA
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_category ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el regimen fiscal del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="tax_information"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Información tributaria
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Información tributaria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="01">
                    IVA
                  </SelectItem>
                  <SelectItem value="04">
                    INC
                  </SelectItem>
                  <SelectItem value="ZA">
                    IVA e INC
                  </SelectItem>
                  <SelectItem value="ZZ">
                    No Aplica
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_information ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será la información tributaria del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="fiscal_responsibility"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Responsabilidad fiscal
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Responsabilidad fiscal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="O-13">
                    Gran contribuyente
                  </SelectItem>
                  <SelectItem value="O-15">
                    Autorretenedor
                  </SelectItem>
                  <SelectItem value="O-23">
                    Agente de retención IVA
                  </SelectItem>
                  <SelectItem value="O-47">
                    Régimen simple de tributación
                  </SelectItem>
                  <SelectItem value="R-99-PN">
                    No aplica - Otros
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.fiscal_responsibility ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será la responsabilidad fiscal del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="economic_activity"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Actividad económica</FormLabel>
            <SearchSelect
              value={field.value}
              onSelect={field.onChange}
              options={economic_activity}
              placeholder="Actividad económica"
              searchPlaceholder="Buscar..."
            />
            {formState.errors.economic_activity ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la actividad económica del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="entity_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Tipo de persona
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de persona" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">
                    Natural
                  </SelectItem>
                  <SelectItem value="2">
                    Juridica
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.entity_type ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el tipo de persona del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField // ! Debería venir de un endpoint.
        control={control}
        name="nationality_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Tipo de nacionalidad
            </FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de nacionalidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">
                    Nacional
                  </SelectItem>
                  <SelectItem value="2">
                    Extranjero
                  </SelectItem>
                  <SelectItem value="3">
                    PT con clave
                  </SelectItem>
                  <SelectItem value="4">
                    PT sin clave
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.nationality_type ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el tipo de nacionalidad del proveedor que se registrará.
              </FormDescription>
            }
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
              <AsyncSelect<{ id: number, name: string, code: string }, number>
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
            ) :
              <FormDescription>
                Esta será la cuenta contable del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="is_resident"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2 col-start-1">
            <div className="flex flex-row rounded-sm border h-9 px-3 shadow-sm items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>¿Es residente?</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
            <FormDescription>
              Este campo indica si el proveedor es residente.
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  )
}