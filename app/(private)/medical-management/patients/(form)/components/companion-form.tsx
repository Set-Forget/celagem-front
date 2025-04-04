import { AsyncSelect } from "@/components/async-select"
import { CountrySelect, FlagComponent, PhoneInput } from "@/components/phone-input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useLazyGetAutocompleteQuery } from "@/lib/services/google-places"
import * as RPNInput from "react-phone-number-input"

export default function CompanionForm() {

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
      console.error("Error al buscar lugar:", error);
      return [];
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        name="companion.name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Nombre del acompañante"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="companion.address"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Dirección</FormLabel>
            <FormControl>
              <AsyncSelect<{ formatted_address: string, place_id: string }, { formatted_address: string, place_id: string } | undefined>
                label="Dirección"
                triggerClassName="!w-full"
                placeholder="Seleccionar dirección"
                fetcher={handleSearchPlace}
                getDisplayValue={(item) => item.formatted_address}
                getOptionValue={(item) => item}
                renderOption={(item) => <div>{item.formatted_address}</div>}
                onChange={field.onChange}
                value={field.value}
                getOptionKey={(item) => item.place_id}
                noResultsMessage="Podrías ingresar 'Calle 123, Bogotá, Colombia'"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="companion.phone_number"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Número de teléfono
            </FormLabel>
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
        name="companion.relationship"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Parentesco</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ?? ""}
                placeholder="Seleccionar parentesco"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}