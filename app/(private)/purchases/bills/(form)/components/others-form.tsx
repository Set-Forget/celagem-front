import DatePicker from "@/components/date-picker"
import SearchSelect from "@/components/search-select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { newBillSchema } from "../../schemas/bills"

// ! Debe traerse de la API
const accounts = [
  { value: "11", label: "EFECTIVO Y EQUIVALENTES AL EFECTIVO" },
  { value: "1101", label: "EFECTIVO" },
  { value: "110101", label: "CAJA GENERAL" },
  { value: "110101061", label: "CAJA GENERAL BOGOTA" },
  { value: "110102", label: "CAJAS MENORES" },
  { value: "110102061", label: "CAJAS MENORES" },
  { value: "110102062", label: "CAJA MENOR MEDELLIN" },
  { value: "110102063", label: "CAJA MENOR LEGALES" },
  { value: "110102064", label: "CAJA MENOR BUCARAMANGA" },
  { value: "110102069", label: "COMPRAS CAJA MENOR DOC SOPORTE" },
  { value: "110103", label: "CAJA MONEDA EXTRANJERA" },
  { value: "110104", label: "BANCOS CUENTAS CORRIENTES MONEDA NACIONAL" },
  { value: "110104061", label: "CTA CTE BANCO BBVA CTA No." },
  { value: "110105", label: "BANCOS CUENTAS CORRIENTES MONEDA EXTRANJERA" },
  { value: "110106", label: "BANCOS CUENTAS DE AHORRO BANCOS MONEDA NACIONAL" },
  { value: "110106061", label: "CTA AHORRO BANCO DAVIVIENDA CTA No" },
  { value: "110106062", label: "CTA AHORRO BANCOLOMBIA CTA N. 20100005011" },
  { value: "110107", label: "BANCOS CUENTAS DE AHORRO BANCOS MONEDA EXTRANJERA" },
  { value: "110108", label: "CARTERA COLECTIVA ABIERTA O FONDO DE INVERSIÓN MERCADO MONETARIO" },
  { value: "12", label: "INVERSIONES E INSTRUMENTOS DERIVADOS" }
];

// ! Debe traerse de la API
const cost_centers = [
  {
    value: "CC-2040",
    label: "Recursos Humanos"
  },
  {
    value: "CC-6997",
    label: "Marketing"
  },
  {
    value: "CC-7668",
    label: "Innovación"
  },
  {
    value: "CC-3248",
    label: "Planta Industrial"
  },
  {
    value: "CC-5670",
    label: "Logística"
  },
  {
    value: "CC-1542",
    label: "Finanzas"
  },
  {
    value: "CC-5405",
    label: "Calidad"
  },
  {
    value: "CC-8071",
    label: "Ventas"
  },
  {
    value: "CC-8608",
    label: "Compras"
  },
  {
    value: "CC-7873",
    label: "Mantenimiento"
  },
  {
    value: "CC-3669",
    label: "Producción"
  },
]

export default function OthersForm() {
  const { control, formState } = useFormContext<z.infer<typeof newBillSchema>>()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
      <FormField
        control={control}
        name="cost_center"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Centro de costos</FormLabel>
            <FormControl>
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={cost_centers}
                placeholder="Centro de costos"
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.cost_center ? (
              <FormMessage />
            ) :
              <FormDescription>
                Centro de costos al que se cargará la factura.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="accounting_date"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Fecha de contabilización</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value || null}
                onChange={(date) => field.onChange(date)}
              />
            </FormControl>
            {formState.errors.accounting_date ? (
              <FormMessage />
            ) :
              <FormDescription>
                Fecha en la que se registrará la factura en la contabilización.
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
              <SearchSelect
                value={field.value}
                onSelect={field.onChange}
                options={accounts}
                placeholder="Cuenta contable"
                searchPlaceholder="Buscar..."
              />
            </FormControl>
            {formState.errors.accounting_account ? (
              <FormMessage />
            ) :
              <FormDescription>
                Cuenta contable a la que se cargará la factura.
              </FormDescription>
            }
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="internal_notes"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full col-span-2">
            <FormLabel className="w-fit">Notas</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Notas..."
              />
            </FormControl>
            {formState.errors.internal_notes ? (
              <FormMessage />
            ) :
              <FormDescription>
                Estas notas son internas y no se incluirán en la factura.
              </FormDescription>
            }
          </FormItem>
        )}
      />
    </div>
  )
}