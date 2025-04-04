'use client'

import CustomSonner from "@/components/custom-sonner"
import { DataTable } from "@/components/data-table"
import Header from "@/components/header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDeleteInvoiceMutation, useGetInvoiceQuery, useUpdateInvoiceMutation } from "@/lib/services/invoices"
import { cn, placeholder } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Box, Check, ChevronDown, Edit, Ellipsis, Eye, FileText, Paperclip, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { invoiceStatus } from "../utils"
import { columns } from "./components/columns"
import TableFooter from "./components/table-footer"

export default function InvoicePage() {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const { data: invoice, isLoading } = useGetInvoiceQuery(id);
  const [updateInvoice, { isLoading: isInvoiceUpdating }] = useUpdateInvoiceMutation()
  const [deleteInvoice, { isLoading: isInvoiceDeleting }] = useDeleteInvoiceMutation()

  const status = invoiceStatus[
    invoice?.status === "posted" && new Date(invoice?.due_date) < new Date()
      ? "overdue"
      : invoice?.status as keyof typeof invoiceStatus
  ];

  const handleGeneratePDF = async () => {
    const { generateInvoicePDF } = await import("../templates/invoice")
    generateInvoicePDF()
  }

  const handleConfirmInvoice = async () => {
    try {
      const response = await updateInvoice({
        id: Number(id),
        status: "posted"
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta confirmada" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al confirmar la factura de venta" variant="error" />)
    }
  }

  const handleDeteleInvoice = async (e: Event) => {
    e.preventDefault()
    try {
      const response = await deleteInvoice(Number(id)).unwrap()

      if (response.status === "success") {
        router.push("/sales/invoices")
        toast.custom((t) => <CustomSonner t={t} description="Factura de venta eliminada" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al eliminar la factura de venta" variant="error" />)
    }
  }

  return (
    <>
      <Header title={
        <h1 className={cn("text-lg font-medium tracking-tight transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
          {isLoading ? placeholder(13, true) : invoice?.number}
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
        {invoice?.status === "draft" ? (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleGeneratePDF}
                  >
                    <FileText />
                    Previsualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    loading={isInvoiceDeleting}
                    className="text-destructive focus:text-destructive"
                    onSelect={handleDeteleInvoice}
                  >
                    <Trash2 className={cn(isInvoiceDeleting && "hidden")} />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              onClick={handleConfirmInvoice}
              loading={isInvoiceUpdating}
            >
              <Check className={cn(isInvoiceUpdating && "hidden")} />
              Confirmar
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FileText />
                    Previsualizar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm">
                  Crear
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push(`/purchases/purchase-receipts/new`)}
                  >
                    Registro de pago
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/sales/credit-notes/new?invoiceId=${id}`)}
                  >
                    Nota de crédito
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push(`/sales/debit-notes/new?invoiceId=${id}`)}
                  >
                    Nota de débito
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </Header>
      <div className="grid grid-cols-1 gap-4 p-4">
        <div className="flex flex-col gap-4">
          <h2 className="text-base font-medium">General</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Sede</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                xxxxxxxxxxxx
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de emisión</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {isLoading ? placeholder(13) : format(invoice?.date ?? "", "dd MMM yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Fecha de vencimiento</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {isLoading ? placeholder(13) : format(invoice?.due_date ?? "", "dd MMM yyyy", { locale: es })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Condición de pago</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {isLoading ? placeholder(10) : invoice?.payment_term || "No especificado"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">Método de pago</label>
              <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                {isLoading ? placeholder(10) : invoice?.payment_method || "No especificado"}
              </span>
            </div>
          </div>
        </div>
        <DataTable
          data={invoice?.items.map((item) => ({ ...item, currency: invoice?.currency })) ?? []}
          loading={isLoading}
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
              <FileText
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Contabilidad
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
            <TabsTrigger
              value="tab-3"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Paperclip
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Documentos
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent value="tab-1" className="m-0">
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Contabilidad</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Fecha de contabilización</label>
                <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
                  {isLoading ? placeholder(13) : format(invoice?.accounting_date ?? "", "dd MMM yyyy", { locale: es })}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Cuenta contable</label>
                <span className="text-sm">xxxxxxx</span>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Centro de costos</label>
                <span className="text-sm">xxxxxxxx</span>
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
                <span className={cn("text-sm transition-all duration-300", isLoading ? "blur-[4px]" : "blur-none")}>
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
        <TabsContent value="tab-3" className="m-0">
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Documentos</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Pagos</label>
                <div className="flex gap-2 items-center group w-fit">
                  <span className="text-sm font-medium">xxxxxxxxxxx</span>
                  <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Notas de débito</label>
                <div className="flex gap-2 items-center group w-fit">
                  <span className="text-sm font-medium">xxxxxxxxxxx</span>
                  <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-muted-foreground text-sm">Notas de crédito</label>
                <div className="flex gap-2 items-center group w-fit">
                  <span className="text-sm font-medium">xxxxxxxxxxx</span>
                  <Button variant="outline" size="icon" className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
