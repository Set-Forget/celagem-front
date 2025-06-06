import { AsyncSelect } from "@/components/async-select"
import { CountrySelect, FlagComponent, PhoneInput } from "@/components/phone-input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLazyGetAutocompleteQuery } from "@/lib/services/google-places"
import { useFormContext } from "react-hook-form"
import * as RPNInput from "react-phone-number-input"
import { z } from "zod"
import { newPatientSchema } from "../../schema/patients"
import { useSendMessageMutation } from "@/lib/services/telegram"

export default function ContactForm() {
  const { control } = useFormContext<z.infer<typeof newPatientSchema>>()

  const [sendMessage] = useSendMessageMutation()
  const [searchPlace] = useLazyGetAutocompleteQuery();

  const handleSearchPlace = async (query?: string) => {
    if (!query) return [];
    try {
      const place = await searchPlace(query).unwrap();
      return place.predictions.map((prediction) => ({
        formatted_address: prediction.description,
        place_id: prediction.place_id,
      }));
    } catch (error) {
      sendMessage({
        location: "app/(private)/medical-management/patients/(form)/components/contact-form.tsx",
        rawError: error,
        fnLocation: "handleSearchPlace"
      }).unwrap().catch((error) => {
        console.error(error);
      });
      return [];
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="phone_number"
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
            <FormMessage />
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
                value={field.value ?? ""}
                placeholder="ventas@guantes.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Dirección de residencia</FormLabel>
            <FormControl>
              <AsyncSelect<{ formatted_address: string, place_id: string }, { formatted_address: string, place_id: string }>
                label="Dirección de residencia"
                triggerClassName="!w-full"
                placeholder="Seleccionar dirección de residencia"
                fetcher={handleSearchPlace}
                getDisplayValue={(item) => item.formatted_address}
                getOptionValue={(item) => item}
                renderOption={(item) => <div>{item.formatted_address}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => item.place_id}
                noResultsMessage="Podrías ingresar 'Calle 123, Bogotá, Colombia'"
                initialOptions={field.value ? [field.value] : []}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}