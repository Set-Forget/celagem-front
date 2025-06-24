import { AsyncCommand } from "@/components/async-command";
import CustomSonner from "@/components/custom-sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePurchaseOrderSelect } from "@/hooks/use-purchase-order-select";
import { usePurchaseReceiptSelect } from "@/hooks/use-purchase-receipt-select";
import { useCreateBillMutation } from "@/lib/services/bills";
import { useGetPurchaseOrderQuery, useLazyGetPurchaseOrderQuery } from "@/lib/services/purchase-orders";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { setDialogsState } from "@/lib/store/dialogs-store";
import { cn } from "@/lib/utils";
import { Building2, Calendar, LinkIcon, Save, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newBillSchema } from "../../schemas/bills";
import PurchaseOrderPopover from "./components/purchase-order-popover";
import PurchaseReceiptPopover from "./components/purchase-receipt-popover";
import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";

export default function Actions() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openCommand, setOpenCommand] = useState(false)

  const { handleSubmit } = useFormContext<z.infer<typeof newBillSchema>>();

  const [sendMessage] = useSendMessageMutation();
  const [createBill, { isLoading: isCreatingBill }] = useCreateBillMutation()

  const purchaseOrderId = searchParams.get("purchase_order_id")
  const purchaseReceiptId = searchParams.get("purchase_receipt_id")

  const selectedType: "purchase_order" | "purchase_receipt" | null = purchaseOrderId
    ? "purchase_order"
    : purchaseReceiptId
      ? "purchase_receipt"
      : null

  const [getPurchaseOrder] = useLazyGetPurchaseOrderQuery()

  const { data: purchaseOrder } = useGetPurchaseOrderQuery(purchaseOrderId!, { skip: !purchaseOrderId })

  const { fetcher: handleSearchPurchaseOrder } = usePurchaseOrderSelect({
    map: (purchaseOrder) => ({
      id: purchaseOrder.id,
      number: purchaseOrder.sequence_id,
      supplier: purchaseOrder.supplier.name,
      created_by: purchaseOrder.created_by.name,
      required_date: purchaseOrder.required_date,
      type: "purchase_order",
    }) as const,
    filter: (purchaseOrder) => purchaseOrder.status !== "cancel" && purchaseOrder.status !== "draft"
  })

  const { fetcher: handleSearchPurchaseReceipt } = usePurchaseReceiptSelect({
    map: (purchaseReceipt) => ({
      id: purchaseReceipt.id,
      number: purchaseReceipt.sequence_id,
      supplier: purchaseReceipt.supplier,
      created_by: purchaseReceipt.created_by.name,
      required_date: purchaseReceipt.scheduled_date,
      type: "purchase_receipt",
    }) as const,
    filter: (purchaseReceipt) => purchaseReceipt.status !== "assigned" && purchaseReceipt.status !== "cancel" && purchaseReceipt.status !== "draft"
  })

  const handleSearch = useCallback(async (query?: string) => {
    const [orders, receipts] = await Promise.all([
      handleSearchPurchaseOrder(query),
      handleSearchPurchaseReceipt(query),
    ])
    return [...orders, ...receipts]
  }, [handleSearchPurchaseOrder, handleSearchPurchaseReceipt])

  const handleLink = async (id: number, type: "purchase_order" | "purchase_receipt") => {
    if (type === "purchase_order") {
      const purchaseOrder = await getPurchaseOrder(id).unwrap();

      const fullBilledItems = purchaseOrder.items.some(item => item.product_qty - item.qty_invoiced <= 0);
      if (fullBilledItems) return setDialogsState({
        open: "confirm-billed-po",
        payload: { purchase_order_id: id }
      });
    }
    window.history.pushState({}, "", `/purchases/bills/new?${type === "purchase_order" ? "purchase_order_id" : "purchase_receipt_id"}=${id}`);
  }

  const onSubmit = async (data: z.infer<typeof newBillSchema>) => {
    try {
      const response = await createBill({
        ...data,
        accounting_date: data.accounting_date.toString(),
        date: data.date.toString(),
        items: data.items.map((items) => ({
          ...items,
          purchase_line_id: purchaseOrder?.items.find((poItem) => poItem.product_id === items.product_id)?.id,
          cost_center: items.cost_center || undefined
        })),
        purchase_order_id: purchaseOrderId ? parseInt(purchaseOrderId) : undefined,
        stock_picking: purchaseReceiptId ? parseInt(purchaseReceiptId) : undefined,
        company: 1,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/bills/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra creada exitosamente" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la factura de compra" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/purchases/bills/(form)/new/actions.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      }).unwrap().catch((error) => {
        console.error(error);
      });
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {selectedType === null ? (
              <Button
                size="sm"
                variant="secondary"
                className="h-7 shadow-lg shadow-secondary"
                onClick={() => setOpenCommand(true)}
              >
                <LinkIcon />
                Asociar
              </Button>
            ) : selectedType === "purchase_order" ? (
              <PurchaseOrderPopover />
            ) : (
              <PurchaseReceiptPopover />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {selectedType === "purchase_order" ? "Ver orden de compra" : "Ver recibo de compra"}
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
      <AsyncCommand<{ id: number, number: string, supplier: string, created_by: string, required_date: string, type: "purchase_order" | "purchase_receipt" }, number>
        open={openCommand}
        onOpenChange={setOpenCommand}
        label="Ordenes de compra"
        fetcher={handleSearch}
        renderOption={(r) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary" className="text-xs px-1">
                {r.type === "purchase_order" ? "OC" : "RC"}
              </Badge>
              <span className="font-medium">{r.number}</span>
            </div>
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
                  {r.required_date && format(parseISO(r.required_date), "PP", { locale: es })}
                </p>
              </span>
            </div>
          </div>
        )}
        getOptionValue={(r) => r.id}
        onSelect={(id, r) => handleLink(id, r.type)}
      />
    </>
  )
}