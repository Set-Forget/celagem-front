import { cn, getFieldPaths } from "@/lib/utils";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import DataTabs, { TabDefinition } from "./data-tabs";
import { ZodTypeAny } from "zod";

export interface FormTabsDefinition {
  tabs: (TabDefinition & { schema?: ZodTypeAny })[]
  defaultTab?: string
  triggerClassName?: string
  contentClassName?: string
  forceMount?: true
}

export function FormTabs({
  tabs,
  defaultTab = tabs[0].value,
  ...rest
}: FormTabsDefinition) {
  const { formState } = useFormContext()
  const { errors } = formState

  const tabsWithFields = useMemo(() => {
    return tabs.map(tab => ({
      ...tab,
      fields: tab.schema ? getFieldPaths(tab.schema) : []
    }))
  }, [tabs])

  const [active, setActive] = useState(defaultTab)

  useEffect(() => {
    if (!errors || Object.keys(errors).length === 0) return

    for (const { value, fields } of tabsWithFields) {
      if (fields.some(path => get(errors, path))) {
        setActive(value)
        break
      }
    }
  }, [errors, tabsWithFields])

  return (
    <DataTabs
      tabs={tabsWithFields}
      activeTab={active}
      onTabChange={setActive}
      // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
      contentClassName={cn("data-[state=inactive]:hidden", rest.contentClassName)}
      // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
      forceMount
      triggerClassName={cn("mt-4", rest.triggerClassName)}
      {...rest}
    />
  )
}
