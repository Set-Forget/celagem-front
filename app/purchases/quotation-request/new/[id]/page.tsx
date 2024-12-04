"use client"


import { Button } from "@/components/ui/button"

import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import Header from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { newQuotationRequestSchema } from "../../schemas/quotation-requests"
import ItemsTable from "./components/items-table"
import { Pencil } from "lucide-react"
import { PurchaseRequestItemsTable } from "@/app/purchases/purchase-requests/[id]/components/purchase-request-items-table"

export default function NewQuotationRequestPage() {
  const newQuotationRequest = useForm<z.infer<typeof newQuotationRequestSchema>>({
    resolver: zodResolver(newQuotationRequestSchema),
    defaultValues: {
      suppliers: [
        {
          "supplier_name": "Cisneros, Malone and Flores",
          "contact_name": "Margaret Kelly",
          "contact_email": "gary69@noble-nicholson.com"
        },
        {
          "supplier_name": "Nelson Inc",
          "contact_name": "Calvin Moran",
          "contact_email": "johnsonstefanie@hotmail.com"
        },
        {
          "supplier_name": "Martin LLC",
          "contact_name": "Allison Haas",
          "contact_email": "emily37@church-robertson.com"
        }
      ]
    }
  })

  const onSubmit = (data: z.infer<typeof newQuotationRequestSchema>) => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <Separator />
      <div className="flex flex-col py-4 gap-4 flex-1">
        <Form {...newQuotationRequest}>
          <div className="flex flex-col gap-4">
            <div className="px-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 group">
                <h2 className="text-base font-medium">General</h2>
                <Button
                  className="w-6 h-6 opacity-0 transition-opacity group-hover:opacity-100"
                  variant="outline"
                  size="icon"
                >
                  <Pencil />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Solicitado por</label>
                  <span className="text-sm">Juan Perez</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">SC N°</label>
                  <span className="text-sm">1234</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Solicitado el</label>
                  <span className="text-sm">12 de enero de 2022</span>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-muted-foreground text-sm">Solicitado para</label>
                  <span className="text-sm">12 de febrero de 2022</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <div className="flex items-center gap-2 group">
                <h2 className="text-base font-medium">Solicitud de compra</h2>
                <Button
                  className="w-6 h-6 opacity-0 transition-opacity group-hover:opacity-100"
                  variant="outline"
                  size="icon"
                >
                  <Pencil />
                </Button>
              </div>
              <PurchaseRequestItemsTable />
            </div>
            <Separator />
            <div className="px-4 flex flex-col gap-4">
              <h2 className="text-base font-medium">Proveedores</h2>
              <form onSubmit={newQuotationRequest.handleSubmit(onSubmit)} className="space-y-6">
                <ItemsTable />
              </form>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-auto px-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
            >
              Previsualizar
            </Button>
            <Button
              type="submit"
              onClick={newQuotationRequest.handleSubmit(onSubmit)}
              size="sm"
            >
              Envíar Solicitud
            </Button>
          </div>
        </Form >
      </div >
    </>
  )
}