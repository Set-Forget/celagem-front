import { AsyncMultiSelect } from "@/components/async-multi-select";
import { AsyncSelect } from "@/components/async-select";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useBusinessUnitSelect } from "@/hooks/use-business-unit-select";
import { useCompanySelect } from "@/hooks/use-company-select";
import { useRoleSelect } from "@/hooks/use-role-select";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { z } from "zod";
import { userBaseSchema } from "../schema/users";
import { cn } from "@/lib/utils";
import { useSpecialitySelect } from "@/hooks/use-speciality-select";
import SignaturePad from "./signature-pad";

export default function NewUserForm({
  isEditing = false,
}: {
  isEditing?: boolean
}) {
  const { control, setValue } = useFormContext<z.infer<typeof userBaseSchema>>()

  const [isVisible, setIsVisible] = useState(false);

  const roleIsMedical = useWatch({
    control: control,
    name: 'role_is_medical',
  })

  const companyId = useWatch({
    control: control,
    name: 'company_id',
  })

  const businessUnitIds = useWatch({
    control: control,
    name: 'business_units',
  })

  const { fetcher: handleSearchSpeciality } = useSpecialitySelect()
  const { fetcher: handleSearchCompany } = useCompanySelect()
  const { fetcher: handleSearchBusinessUnit, initialOptions: businessUnitInitialOptions } = useBusinessUnitSelect({
    companyId,
    businessUnitIds,
  })
  const { fetcher: handleSearchRole } = useRoleSelect({
    map: (role) => ({
      ...role,
      is_medical: role.is_medical,
    }),
  })

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <form className="gap-4 grid grid-cols-2">
      <FormField
        control={control}
        name="first_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Nombre</FormLabel>
            <FormControl>
              <Input
                placeholder="Nombre"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="last_name"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">Apellido</FormLabel>
            <FormControl>
              <Input
                placeholder="Apellido"
                {...field}
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
          <FormItem className={cn("flex flex-col w-full")}>
            <FormLabel className="w-fit">Correo electrónico</FormLabel>
            <FormControl>
              <Input
                placeholder="Correo electrónico"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {!isEditing && (
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel
                htmlFor="password"
              >
                Contraseña
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    type={isVisible ? "text" : "password"}
                    placeholder="•••••••••••"
                    {...field}
                  />
                  <Button
                    className="absolute inset-y-0 end-0 flex p-0 !w-7 !h-7 items-center justify-center rounded-full text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 top-1/2 transform -translate-y-1/2 right-1.5 focus-visible:!ring-0 focus-visible:!outline-none focus-visible:!shadow-none focus-visible:ring-offset-0"
                    variant="ghost"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="password"
                  >
                    {isVisible ? (
                      <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <Eye size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {!isEditing && (
        <>
          <FormField
            control={control}
            name="company_id"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="w-fit">Compañía</FormLabel>
                <FormControl>
                  <AsyncSelect<{ id: string, name: string }, string>
                    label="Compañía"
                    triggerClassName="!w-full"
                    placeholder="Seleccionar compañía..."
                    fetcher={handleSearchCompany}
                    getDisplayValue={(item) => item.name}
                    getOptionValue={(item) => item.id}
                    renderOption={(item) => <div>{item.name}</div>}
                    onChange={field.onChange}
                    value={field.value}
                    getOptionKey={(item) => item.id}
                    noResultsMessage="No se encontraron resultados"
                    modal
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            key={companyId}
            control={control}
            name="business_units"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="w-fit">Unidades de negocio</FormLabel>
                <FormControl>
                  <AsyncMultiSelect<{ id: string, name: string }, string>
                    placeholder="Buscar unidades de negocio…"
                    fetcher={handleSearchBusinessUnit}
                    defaultValue={field.value}
                    value={field.value}
                    getOptionValue={(o) => o.id}
                    getOptionKey={(o) => String(o.id)}
                    renderOption={(o) => <>{o.name}</>}
                    getDisplayValue={(o) => <>{o.name}</>}
                    noResultsMessage="No se encontraron resultados"
                    onValueChange={field.onChange}
                    disabled={!companyId}
                    initialOptions={businessUnitInitialOptions}
                    modalPopover
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      <FormField
        control={control}
        name="role_id"
        render={({ field }) => (
          <FormItem className="flex flex-col w-full">
            <FormLabel className="w-fit">
              Rol
            </FormLabel>
            <FormControl>
              <AsyncSelect<{ id: string, name: string, is_medical: boolean }, string>
                label="Rol"
                triggerClassName="!w-full"
                placeholder="Seleccionar rol..."
                fetcher={handleSearchRole}
                getDisplayValue={(item) => item.name}
                getOptionValue={(item) => item.id}
                renderOption={(item) => <div>{item.name}</div>}
                onChange={(val, option) => {
                  field.onChange(val)
                  setValue('role_is_medical', option?.is_medical ?? false, { shouldValidate: true })
                }}
                value={field.value}
                getOptionKey={(item) => String(item.id)}
                noResultsMessage="No se encontraron resultados"
                modal
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {roleIsMedical && (
        <>
          <FormField
            control={control}
            name="speciality_id"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="w-fit">Especialidad</FormLabel>
                <FormControl>
                  <AsyncSelect<{ id: number, title: string }, number | undefined>
                    label="Especialidad"
                    triggerClassName="!w-full"
                    placeholder="Seleccionar especialidad..."
                    fetcher={handleSearchSpeciality}
                    getDisplayValue={(item) => item.title}
                    getOptionValue={(item) => item.id}
                    renderOption={(item) => <div>{item.title}</div>}
                    onChange={field.onChange}
                    value={field.value}
                    getOptionKey={(item) => String(item.id)}
                    noResultsMessage="No se encontraron resultados"
                    modal
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="signature"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full col-span-2">
                <FormLabel className="w-fit">Firma</FormLabel>
                <FormControl>
                  <SignaturePad
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </form>
  )
}