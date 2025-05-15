import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { CountrySelect, FlagComponent, PhoneInput } from "@/components/phone-input"
import * as RPNInput from "react-phone-number-input"
import { newCustomerSchema } from "../../../schema/customers"

export default function ContactForm() {
  const { control, formState } = useFormContext<z.infer<typeof newCustomerSchema>>()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Número de teléfono</FormLabel>
            <FormControl>
              <RPNInput.default
                className="flex rounded-md shadow-sm"
                international
                flagComponent={FlagComponent}
                countrySelectComponent={CountrySelect}
                inputComponent={PhoneInput}
                placeholder="Ingresa un número de teléfono"
                defaultCountry="AR"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            {formState.errors.phone ? (
              <FormMessage />
            ) :
              <FormDescription>
                Este será el número de teléfono del cliente.
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
                Este será el correo electrónico del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      {/* <FormField
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
                Esta será la dirección del cliente.
              </FormDescription>
            }
          </FormItem>
        )}
      /> */}
    </div>
  )
}