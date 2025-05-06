import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newSupplierSchema } from "../../../schema/suppliers"
import { CountrySelect, FlagComponent, PhoneInput } from "@/components/phone-input"
import * as RPNInput from "react-phone-number-input"

export default function GeneralForm() {
  const { control, formState } = useFormContext<z.infer<typeof newSupplierSchema>>()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Guantes S.A."
              />
            </FormControl>
            {formState.errors.name ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el nombre del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Número de teléfono</FormLabel>
            <FormControl>
              <RPNInput.default
                className="flex rounded-md shadow-xs"
                international
                flagComponent={FlagComponent}
                countrySelectComponent={CountrySelect}
                inputComponent={PhoneInput}
                placeholder="Ingresa un número de teléfono"
                defaultCountry="CO"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            {formState.errors.phone ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el número de teléfono del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
            {formState.errors.email ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el correo electrónico del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Sitio web</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="https://guantes.com"
              />
            </FormControl>
            {formState.errors.website ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el sitio web del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
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
            {formState.errors.contact_address_inline ? (
              <FormMessage />
            ) :
              <FormDescription>
                Esta será la dirección del proveedor que se registrará.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}