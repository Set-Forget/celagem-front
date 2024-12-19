"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { newCustomerSchema } from "../schema/customers"

export default function NewCustomerPage() {
  const newCustomerForm = useForm<z.infer<typeof newCustomerSchema>>({
    resolver: zodResolver(newCustomerSchema),
  })

  const onSubmit = (data: z.infer<typeof newCustomerSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header title="Nuevo cliente" />
      <div className="flex flex-col h-full justify-between">
        <Form {...newCustomerForm}>
          <form onSubmit={newCustomerForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">General</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newCustomerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Nombre del cliente</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Guantes"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.name ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.name.message}
                        </FormMessage>
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
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Número de teléfono</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="+1 123 456 7890"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.phone_number ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.phone_number.message}
                        </FormMessage>
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
                        <FormMessage>
                          {newCustomerForm.formState.errors.email.message}
                        </FormMessage>
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
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Ciudad</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Buenos Aires"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.city ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.city.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será la ciudad del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">País</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Argentina"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.country ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.country.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el país del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Dirección</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Av. Corrientes 1234"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.address ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.address.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la dirección del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Provincia</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Buenos Aires"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.province ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.province.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la provincia del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Código postal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1234"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.postal_code ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.postal_code.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el código postal del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">Fiscal</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newCustomerForm.control}
                  name="customer_type"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Tipo de cliente
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="company">
                              Empresa
                            </SelectItem>
                            <SelectItem value="individual">
                              Particular
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newCustomerForm.formState.errors.tax_status ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.tax_status.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el tipo de cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="registered_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Razón social</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Guantes S.A."
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.registered_name ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.registered_name.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la razón social del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="cuit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">CUIT/CUIL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30-12345678-9"
                        />
                      </FormControl>
                      {newCustomerForm.formState.errors.cuit ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.cuit.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el CUIT/CUIL del cliente que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newCustomerForm.control}
                  name="fiscal_category"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Condición frente al IVA
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Condición frente al IVA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="responsable_inscripto">
                              Responsable inscripto
                            </SelectItem>
                            <SelectItem value="monotributista">
                              Monotributista
                            </SelectItem>
                            <SelectItem value="exento">
                              Exento
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newCustomerForm.formState.errors.tax_status ? (
                        <FormMessage>
                          {newCustomerForm.formState.errors.tax_status.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el tipo de pago que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
          <div className="flex justify-end gap-2 mt-4 p-4">
            <Button
              type="submit"
              onClick={newCustomerForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear cliente
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}