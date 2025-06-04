import { usePurchaseOrderSelect } from "@/app/(private)/(commercial)/hooks/use-purchase-order-select";
import { AsyncCommand } from "@/components/async-command";
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateBillMutation } from "@/lib/services/bills";
import { useGetPurchaseOrderQuery, useLazyGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, Calendar, LinkIcon, Save, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newBillSchema } from "../../schemas/bills";
import PurchaseOrderPopover from "./components/purchase-order-popover";

export default function Actions() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openCommand, setOpenCommand] = useState(false)

  const { handleSubmit } = useFormContext<z.infer<typeof newBillSchema>>();

  const [createBill, { isLoading: isCreatingBill }] = useCreateBillMutation()

  const purchaseOrderId = searchParams.get("purchase_order_id")

  const [getPurchaseOrder] = useLazyGetPurchaseOrderQuery()

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const { fetcher: handleSearchPurchaseOrder } = usePurchaseOrderSelect({
    map: (purchaseOrder) => ({
      id: purchaseOrder.id,
      number: purchaseOrder.number,
      supplier: purchaseOrder.supplier.name,
      created_by: purchaseOrder.created_by.name,
      required_date: purchaseOrder.required_date,
    }),
    filter: (purchaseOrder) => purchaseOrder.status === "purchase"
  })

  const onSubmit = async (data: z.infer<typeof newBillSchema>) => {
    try {
      const response = await createBill({
        ...data,
        accounting_date: data.accounting_date.toString(),
        date: data.date.toString(),
        items: data.items.map((items) => ({
          ...items,
          purchase_line_id: purchaseOrder?.items.find((poItem) => poItem.product_id === items.product_id)?.id,
        })),
        purchase_order_id: purchaseOrderId ? parseInt(purchaseOrderId) : undefined,
        company: 1,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/bills/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la factura de compra" variant="error" />)
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {!purchaseOrderId ? (
              <Button
                size="sm"
                variant="secondary"
                className="h-7 shadow-lg shadow-secondary"
                onClick={() => setOpenCommand(true)}
              >
                <LinkIcon />
                Asociar
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
      <div className="flex gap-2 ml-auto">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          size="sm"
          loading={isCreatingBill}
        >
          <Save className={cn(isCreatingBill && "hidden")} />
          Guardar
        </Button>
      </div>
      <AsyncCommand<{ id: number, number: string, supplier: string, created_by: string, required_date: string }, number>
        open={openCommand}
        onOpenChange={setOpenCommand}
        label="Ordenes de compra"
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
        onSelect={async (id, r) => {
          const purchaseOrder = await getPurchaseOrder(id).unwrap();
          const fullBilledItems = purchaseOrder.items.some(item => item.product_qty - item.qty_invoiced <= 0);
          if (fullBilledItems) return setDialogsState({
            open: "confirm-billed-po",
            payload: { purchase_order_id: id }
          });

          window.history.pushState({}, "", `/purchases/bills/new?purchase_order_id=${id}`);
        }}
      />
    </>
  )
}