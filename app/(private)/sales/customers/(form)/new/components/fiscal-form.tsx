"use client";

import { AsyncSelect } from "@/components/async-select";
import SearchSelect from "@/components/search-select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { economic_activity } from "../data";
import { newCustomerSchema } from "../../../schema/customers";

export function FiscalForm() {
  const { control, formState } = useFormContext<z.infer<typeof newCustomerSchema>>();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      {/*       <FormField
        control={control}
        name="commercial_company_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre registrado</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Guantes S.A." />
            </FormControl>
            {formState.errors.commercial_company_name ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el nombre registrado del cliente que se registrará.
              </FormDescription>
            )}
          </FormItem>
        )}
      /> */}
      <FormField
        control={control}
        name="tax_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Tipo de documento</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de documento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="11">Registro civil de nacimiento</SelectItem>
                  <SelectItem value="12">Tarjeta de identidad</SelectItem>
                  <SelectItem value="13">Cédula de ciudadanía</SelectItem>
                  <SelectItem value="21">Tarjeta de extranjería</SelectItem>
                  <SelectItem value="22">Cédula de extranjería</SelectItem>
                  <SelectItem value="31">NIT/CUIT</SelectItem>
                  <SelectItem value="41">Pasaporte</SelectItem>
                  <SelectItem value="42">Tipo doc. extranjero</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_type ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el tipo de documento del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tax_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Identificación fiscal</FormLabel>
            <FormControl>
              <Input {...field} placeholder="30-12345678-9" />
            </FormControl>
            {formState.errors.tax_id ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el CUIT/NIT del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tax_regime"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Régimen tributario</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Régimen tributario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="EE">Empresas del estado</SelectItem>
                  <SelectItem value="EX">Extranjero</SelectItem>
                  <SelectItem value="GC">Gran contribuyente</SelectItem>
                  <SelectItem value="NR">No responsable de IVA</SelectItem>
                  <SelectItem value="RE">Régimen especial</SelectItem>
                  <SelectItem value="RCN">Régimen común no retenedor</SelectItem>
                  <SelectItem value="RC">Régimen común</SelectItem>
                  <SelectItem value="RS">Régimen simplificado</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_regime ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el régimen tributario del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tax_category"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Régimen fiscal</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Régimen fiscal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="4">Régimen simple</SelectItem>
                  <SelectItem value="5">Régimen ordinario</SelectItem>
                  <SelectItem value="48">IVA</SelectItem>
                  <SelectItem value="49">No responsable de IVA</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_category ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el régimen fiscal del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="tax_information"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Información tributaria</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Información tributaria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="01">IVA</SelectItem>
                  <SelectItem value="04">INC</SelectItem>
                  <SelectItem value="ZA">IVA e INC</SelectItem>
                  <SelectItem value="ZZ">No Aplica</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.tax_information ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será la información tributaria del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="fiscal_responsibility"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Responsabilidad fiscal</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Responsabilidad fiscal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="O-13">Gran contribuyente</SelectItem>
                  <SelectItem value="O-15">Autorretenedor</SelectItem>
                  <SelectItem value="O-23">Agente de retención IVA</SelectItem>
                  <SelectItem value="O-47">Régimen simple de tributación</SelectItem>
                  <SelectItem value="R-99-PN">No aplica - Otros</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.fiscal_responsibility ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será la responsabilidad fiscal del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
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
            ) : (
              <FormDescription>
                Esta será la actividad económica del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="entity_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Tipo de entidad</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de entidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Natural</SelectItem>
                  <SelectItem value="2">Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.entity_type ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el tipo de entidad del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="nationality_type"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Tipo de nacionalidad</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de nacionalidad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Nacional</SelectItem>
                  <SelectItem value="2">Extranjero</SelectItem>
                  <SelectItem value="3">PT con clave</SelectItem>
                  <SelectItem value="4">PT sin clave</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            {formState.errors.nationality_type ? (
              <FormMessage />
            ) : (
              <FormDescription>
                Este será el tipo de nacionalidad del cliente.
              </FormDescription>
            )}
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="is_resident"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-2 justify-center mb-1.5">
            <div className="flex flex-row rounded-sm border h-9 px-3 shadow-sm items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>¿Es residente?</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
