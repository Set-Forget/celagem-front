"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { FieldErrors, useForm } from "react-hook-form"
import { z } from "zod"
import { newCustomerAccountingSchema, newCustomerFiscalSchema, newCustomerSchema } from "../../schema/customers"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, getFieldPaths } from "@/lib/utils"
import { Calculator, Check, ChevronsUpDown, Ellipsis, Landmark, Save } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { economic_activity, payment_methods } from "./data"
import { useCreateCustomerMutation } from "@/lib/services/customers"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CustomSonner from "@/components/custom-sonner"
import { FiscalForm } from "./components/fiscal-form"
import { AccountingForm } from "./components/accounting-form"
import { useState } from "react"
import DataTabs from "@/components/data-tabs"
import { get } from "lodash"
import OthersForm from "./components/others-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newCustomerFiscalSchema),
  "tab-2": getFieldPaths(newCustomerAccountingSchema),
}

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Calculator className="mr-1.5" size={16} />,
    content: <FiscalForm />
  },
  {
    value: "tab-2",
    label: "Contabilidad",
    icon: <Landmark className="mr-1.5" size={16} />,
    content: <AccountingForm />
  },
  {
    value: "tab-3",
    label: "Others",
    icon: <Ellipsis className="mr-1.5" size={16} />,
    content: <OthersForm />
  }
]

export default function Page() {
  const router = useRouter()

  const [tab, setTab] = useState(tabs[0].value)

  const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation()

  const newCustomerForm = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      website: "",
      contact_address_inline: "",
      property_account_position: false,
      commercial_company_name: "",
      tax_id: "",
      tags: [],
      internal_notes: [],
      is_resident: true,
    }
  })

  const onSubmit = async (data: z.infer<typeof newCustomerSchema>) => {
    const { accounting_account, ...dataToSend } = data;
    try {
      const response = await createCustomer({
        ...dataToSend,
        payment_method: 1,
        tax_type: "rcn",
        entity_type: "natural",
        nationality_type: 'nacional',
        tax_regime: "gran_contribuyente",
        tax_category: "simple",
        tax_information: "iva",
        fiscal_responsibility: "gran_contribuyente",
        economic_activity: 1,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/sales/customers/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Cliente creado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el cliente" variant="error" />)
    }
  }

  const onError = (errors: FieldErrors<z.infer<typeof newCustomerSchema>>) => {
    for (const [tabKey, fields] of Object.entries(tabToFieldsMap)) {
      const hasError = fields.some((fieldPath) => {
        return get(errors, fieldPath) != null;
      });
      if (hasError) {
        setTab(tabKey);
        break;
      }
    }
  };

  return (
    <Form {...newCustomerForm}>
      <Header title="Nuevo cliente" >
        <Button
          type="submit"
          onClick={newCustomerForm.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isCreatingCustomer}
        >
          <Save className={cn(isCreatingCustomer && "hidden")} />
          Guardar
        </Button>
      </Header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={newCustomerForm.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Nombre</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Jhon Doe"
                />
              </FormControl>
              {newCustomerForm.formState.errors.name ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Este será el nombre del cliente que se registrará.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newCustomerForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Número de teléfono</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="+1 123 456 7890"
                />
              </FormControl>
              {newCustomerForm.formState.errors.phone ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Este será el número de teléfono del cliente que se registrará.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newCustomerForm.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ventas@guantes.com"
                />
              </FormControl>
              {newCustomerForm.formState.errors.email ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Este será el correo electrónico del cliente que se registrará.
                </FormDescription>
              }
            </FormItem>
          )}
        />
        <FormField
          control={newCustomerForm.control}
          name="contact_address_inline"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="w-fit">Dirección</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Av. Corrientes 1234, CABA, Argentina"
                />
              </FormControl>
              {newCustomerForm.formState.errors.contact_address_inline ? (
                <FormMessage />
              ) :
                <FormDescription>
                  Esta será la dirección del cliente que se registrará.
                </FormDescription>
              }
            </FormItem>
          )}
        />
      </div>
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
      />
    </Form>
  )
}