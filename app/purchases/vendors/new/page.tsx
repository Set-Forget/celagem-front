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
import { newSupplierSchema } from "../schema/suppliers"

export default function NewSupplierPage() {
  const newSupplierForm = useForm<z.infer<typeof newSupplierSchema>>({
    resolver: zodResolver(newSupplierSchema),
  })

  const onSubmit = (data: z.infer<typeof newSupplierSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header title="Nuevo proveedor" />
      <Separator />
      <div className="flex flex-col h-full justify-between">
        <Form {...newSupplierForm}>
          <form onSubmit={newSupplierForm.handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col gap-4 p-4">
              <span className="text-base font-medium">General</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={newSupplierForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">Nombre del proveedor</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Guantes"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.name ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.name.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el nombre del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.phone_number ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.phone_number.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el número de teléfono del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.email ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.email.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el correo electrónico del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.city ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.city.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será la ciudad del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.country ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.country.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el país del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.address ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.address.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la dirección del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.province ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.province.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la provincia del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.postal_code ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.postal_code.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el código postal del proveedor que se registrará.
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
                  control={newSupplierForm.control}
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
                      {newSupplierForm.formState.errors.registered_name ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.registered_name.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Esta será la razón social del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="cuit"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">CUIT</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="30-12345678-9"
                        />
                      </FormControl>
                      {newSupplierForm.formState.errors.cuit ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.cuit.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el CUIT del proveedor que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="tax_status"
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
                      {newSupplierForm.formState.errors.tax_status ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.tax_status.message}
                        </FormMessage>
                      ) :
                        <FormDescription>
                          Este será el tipo de pago que se registrará.
                        </FormDescription>
                      }
                    </FormItem>
                  )}
                />
                <FormField
                  control={newSupplierForm.control}
                  name="payment_terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="w-fit">
                        Condición de pago
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Condición de pago" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="anticipo">
                              Anticipo
                            </SelectItem>
                            <SelectItem value="7_dias">
                              7 días
                            </SelectItem>
                            <SelectItem value="15_dias">
                              15 días
                            </SelectItem>
                            <SelectItem value="30_dias">
                              30 días
                            </SelectItem>
                            <SelectItem value="60_dias">
                              60 días
                            </SelectItem>
                            <SelectItem value="90_dias">
                              90 días
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {newSupplierForm.formState.errors.tax_status ? (
                        <FormMessage>
                          {newSupplierForm.formState.errors.tax_status.message}
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
              onClick={newSupplierForm.handleSubmit(onSubmit)}
              size="sm"
            >
              Crear proveedor
            </Button>
          </div>
        </Form>
      </div>
    </>
  )
}