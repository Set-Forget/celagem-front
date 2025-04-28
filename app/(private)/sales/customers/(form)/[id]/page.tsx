'use client'

import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGetCustomerQuery } from "@/lib/services/customers"
import { cn, FieldDefinition, placeholder } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Calculator, Edit, Landmark, Pencil, Plus, X } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import { CustomerDetail } from "../../schema/customers"
import { customerStatus } from "../../utils"
import AccountingTab from "./components/accounting-tab"
import FiscalTab from "./components/fiscal-tab"

const notes = [
  { id: 1, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc." },
  { id: 2, content: "Nullam nec purus nec nunc. ac bibendum." },
  { id: 3, content: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit" },
  { id: 4, content: "Sed pretium tortor nec ipsum interdum dictum. Aliquam erat volutpat. Phasellus pulvinar velit arcu, at interdum ligula volutpat id. Nulla et tellus vel ipsum scelerisque auctor eu non massa. Duis laoreet vel magna eu sodales. Maecenas bibendum nisl neque, quis auctor arcu pharetra commodo. Proin sit amet facilisis libero. Fusce sagittis purus ut aliquam accumsan. Fusce vel mauris nisi. Vestibulum lobortis." },
]

const tags = [
  { id: 1, name: "Cliente" },
  { id: 3, name: "VIP" },
]

const fields: FieldDefinition<CustomerDetail>[] = [
  {
    label: "Correo electrónico",
    placeholderLength: 16,
    getValue: (p) => p.email || "No especificado",
  },
  {
    label: "Número de teléfono",
    placeholderLength: 10,
    getValue: (p) => p.phone || "No especificado",
  },
  {
    label: "Dirección",
    placeholderLength: 30,
    getValue: (p) => p.contact_address_inline || "No especificado",
    className: "col-span-2"
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Contabilidad",
    icon: <Landmark className="mr-1.5" size={16} />,
    content: <AccountingTab />
  },
  {
    value: "tab-2",
    label: "Fiscal",
    icon: <Calculator className="mr-1.5" size={16} />,
    content: <FiscalTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: customer, isLoading: isCustomerLoading } = useGetCustomerQuery(id)

  const status = customerStatus[String(customer?.status) as keyof typeof customerStatus];

  return (
    <div className="flex flex-col h-full">
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isCustomerLoading ? "blur-[4px]" : "blur-none")}>
          {isCustomerLoading ? placeholder(13, true) : customer?.name}
        </h1>
      }>
        <div className="mr-auto">
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
          >
            {status?.label}
          </Badge>
        </div>
        <Button className="ml-auto" size="sm">
          <Edit />
          Editar cliente
        </Button>
      </Header>
      <ResizablePanelGroup className="flex !h-full !w-auto" direction="horizontal">
        <ResizablePanel defaultSize={70}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            {fields.map((field) => {
              const displayValue = isCustomerLoading
                ? placeholder(field.placeholderLength)
                : field.getValue(customer!) ?? "";
              return (
                <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                  <label className="text-muted-foreground text-sm">
                    {field.label}
                  </label>
                  <span
                    className={cn(
                      "text-sm transition-all duration-300",
                      isCustomerLoading ? "blur-[4px]" : "blur-none"
                    )}
                  >
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
          <DataTabs
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            triggerClassName="mt-4"
          />
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel className="!flex-none w-[350px]" defaultSize={30}>
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Notas</h2>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
              >
                <Plus />
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full pr-2 overflow-x-hidden border p-2 bg-muted !rounded-sm">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start justify-between py-2 border-b last:border-b-0 group relative">
                  <p className="text-xs break-words pr-2 flex-1">{note.content}</p>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1">
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-tr-none rounded-br-none border-r-0">
                      <Pencil />
                    </Button>
                    <Button variant="outline" size="icon" className="h-6 w-6 rounded-tl-none rounded-bl-none">
                      <X />
                    </Button>
                  </div>

                </div>
              ))}
            </ScrollArea>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Etiquetas</h2>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
              >
                <Plus />
              </Button>
            </div>
            <div className="flex gap-2">
              {customer?.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">{tag.text}</Badge>
              ))}
            </div>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Actividad</h2>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Creado por <span className="font-medium">{customer?.traceability.created_by}</span></label>
              <span className="text-sm">
                hace {customer?.traceability.created_at && formatDistanceToNow(customer?.traceability.created_at, { locale: es })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Editado por <span className="font-medium">{customer?.traceability.updated_by}</span></label>
              <span className="text-sm">
                hace {customer?.traceability.updated_at && formatDistanceToNow(customer?.traceability.updated_at, { locale: es })}
              </span>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
