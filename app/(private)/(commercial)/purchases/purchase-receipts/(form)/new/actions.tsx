import { AsyncCommand } from "@/components/async-command"
import CustomSonner from "@/components/custom-sonner"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLazyListPurchaseOrdersQuery } from "@/lib/services/purchase-orders"
import { useCreatePurchaseReceiptMutation } from "@/lib/services/purchase-receipts"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Building2, Calendar, LinkIcon, Save, User } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPurchaseReceiptSchema } from "../../schemas/purchase-receipts"
import PurchaseOrderPopover from "./components/purchase-order-popover"

export default function Actions() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { handleSubmit } = useFormContext<z.infer<typeof newPurchaseReceiptSchema>>();

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const [openCommand, setOpenCommand] = useState(false)

  const [searchPurchaseOrder] = useLazyListPurchaseOrdersQuery()
  const [createPurchaseReceipt, { isLoading: isCreatingPurchaseReceipt }] = useCreatePurchaseReceiptMutation()

  const handleSearchPurchaseOrder = async (query?: string) => {
    try {
      const response = await searchPurchaseOrder({
        number: query,
        status: "purchase"
      }).unwrap()

      return response.data?.map(purchaseOrder => ({
        id: purchaseOrder.id,
        number: purchaseOrder.number,
        supplier: purchaseOrder.supplier.name,
        created_by: purchaseOrder.created_by,
        required_date: purchaseOrder.required_date,
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const onSubmit = async (data: z.infer<typeof newPurchaseReceiptSchema>) => {
    const { purchase_order, ...rest } = data

    try {
      const response = await createPurchaseReceipt({
        ...rest,
        items: rest.items.map(item => ({
          ...item,
          expected_quantity: item.quantity,
        })),
        reception_date: rest.reception_date.toString(),
        source_location: 7, // Assuming a default source location
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-receipts/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Recepción de compra creada exitosamente" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la recepción de compra" variant="error" />)
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {!purchaseOrderId ? (
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 shadow-lg shadow-secondary"
                onClick={() => setOpenCommand(true)}
              >
                <LinkIcon />
              </Button>
            ) : (
              <PurchaseOrderPopover />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {purchaseOrderId ? "Ver orden de compra" : "Asociar orden de compra"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex justify-end gap-2 ml-auto">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          loading={isCreatingPurchaseReceipt}
          size="sm"
        >
          <Save className={cn(isCreatingPurchaseReceipt && "hidden")} />
          Guardar
        </Button>
      </div>
      <AsyncCommand<{ id: number, number: string, supplier: string, created_by: string, required_date: string }, number>
        open={openCommand}
        onOpenChange={setOpenCommand}
        label="Solicitudes de pedido"
        fetcher={handleSearchPurchaseOrder}
        renderOption={(r) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{r.number}</span>
            <div className="grid grid-cols-4 items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="!h-3.5 !w-3.5" />
                <p className="truncate">
                  {r.supplier}
                </p>
              </span>
              <span className="flex items-center gap-1 truncate">
                <User className="!h-3.5 !w-3.5" />
                <p className="truncate">
                  {r.created_by}
                </p>
              </span>
              <span className="flex items-center gap-1 truncate">
                <Calendar className="!h-3.5 !w-3.5" />
                <p className="truncate">
                  {format(r.required_date, "PP", { locale: es })}
                </p>
              </span>
            </div>
          </div>
        )}
        getOptionValue={(r) => r.id}
        onSelect={(id, r) => {
          window.history.pushState({}, "", `/purchases/purchase-receipts/new?purchase_order_id=${id}`);
        }}
      />
    </>
  )
}