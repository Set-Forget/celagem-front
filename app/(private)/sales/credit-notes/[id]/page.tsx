'use client'

import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGetCreditNoteQuery } from "@/lib/services/credit-notes"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Box, ChevronDown, Eye, FileText, Paperclip, Receipt } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { creditNoteStatus } from "../utils"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"

export default function CreditNotePage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data: creditNote, isLoading: isCreditNoteLoading } = useGetCreditNoteQuery(id)

  const handleGeneratePDF = async () => {
    const { generateCreditNotePDF } = await import("../templates/credit-note")
    generateCreditNotePDF()
  }

  const status = creditNoteStatus[
    creditNote?.status === "posted" && new Date(creditNote?.due_date) < new Date()
      ? "overdue"
      : creditNote?.status as keyof typeof creditNoteStatus
  ];

  return (
    <>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
          {isCreditNoteLoading ? placeholder(13, true) : creditNote?.number}
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleGeneratePDF()}
        >
          Previsualizar
        </Button>
      </Header>
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Cliente</label>
              <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
                {isCreditNoteLoading ? placeholder(10) : creditNote?.partner || "No especificado"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de emisión</label>
              <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
                {isCreditNoteLoading ? placeholder(13) : format(creditNote?.date ?? "", "dd MMM yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de vencimiento</label>
              <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
                {isCreditNoteLoading ? placeholder(13) : format(creditNote?.due_date ?? "", "dd MMM yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Condición de pago</label>
              <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
                {isCreditNoteLoading ? placeholder(10) : creditNote?.payment_term || "No especificado"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Método de pago</label>
              <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
                {isCreditNoteLoading ? placeholder(10) : creditNote?.payment_method || "No especificado"}
              </span>
            </div>
          </div>
        </div>
        <DataTable
          data={creditNote?.items.map((item) => ({ ...item, currency: creditNote?.currency })) ?? []}
          loading={isCreditNoteLoading}
          columns={columns}
          pagination={false}
          footer={() => <TableFooter />}
        />
      </div>
      <Tabs className="mt-4" defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Receipt
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Factura
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Box
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Proveedor
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1" className="m-0">
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Factura</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Fecha de emisión</label>
                <span className={cn("text-sm transition-all duration-300", false ? "blur-[4px]" : "blur-none")}>
                  xxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Fecha de vencimiento</label>
                <span className={cn("text-sm transition-all duration-300", false ? "blur-[4px]" : "blur-none")}>
                  xxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Condición de pago</label>
                <span className={cn("text-sm transition-all duration-300", false ? "blur-[4px]" : "blur-none")}>
                  xxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Método de pago</label>
                <span className={cn("text-sm transition-all duration-300", false ? "blur-[4px]" : "blur-none")}>
                  xxxx
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="tab-2" className="m-0">
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Datos del proveedor</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Proveedor</label>
                <span className={cn("text-sm transition-all duration-300", isCreditNoteLoading ? "blur-[4px]" : "blur-none")}>
                  xxxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Correo electrónico</label>
                <span className="text-sm">
                  xxxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Número de teléfono</label>
                <span className="text-sm">
                  xxxxx
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Dirección</label>
                <span className="text-sm">
                  xxxxx
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
