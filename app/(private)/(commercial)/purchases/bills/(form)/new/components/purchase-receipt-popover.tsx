import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useGetPurchaseReceiptQuery } from "@/lib/services/purchase-receipts";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, Calendar, LinkIcon, Package, Unlink, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { purchaseReceiptStatus } from "../../../../purchase-receipts/utils";
import { newBillSchema } from "../../../schemas/bills";
import { defaultValues } from "../../default-values";
import { StatusBadge } from "@/components/status-badge";

export default function PurchaseReceiptPopover() {
  const searchParams = useSearchParams()

  const { reset } = useFormContext<z.infer<typeof newBillSchema>>();

  const purchaseReceiptId = searchParams.get("purchase_receipt_id")
  const { data: purchaseReceipt, isLoading: isPurchaseReceiptLoading } = useGetPurchaseReceiptQuery(purchaseReceiptId!, { skip: !purchaseReceiptId })

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          loading={isPurchaseReceiptLoading}
          className="h-7 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-50 hover:bg-indigo-100 hover:shadow-indigo-100 transition-all"
        >
          <LinkIcon className={cn(isPurchaseReceiptLoading && "hidden")} />
          {purchaseReceipt?.sequence_id}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden" align="start">
        <div className="flex items-center justify-between m-2 p-3 py-2 rounded-sm bg-sidebar">
          <div>
            <Button
              variant="link"
              className="p-0 h-auto text-md font-medium text-foreground"
              asChild
            >
              <Link href={`/purchases/purchase-receipts/${purchaseReceipt?.id}`} target="_blank">
                {purchaseReceipt?.sequence_id}
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">Recepción de Compra</p>
          </div>
          <StatusBadge status={purchaseReceipt?.status} />
        </div>

        <div className="space-y-2 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Proveedor</span>
            </div>
            <span className="text-sm max-w-[100px] text-nowrap truncate font-medium">{purchaseReceipt?.supplier.name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Fecha Solicitud</span>
            </div>
            <span className="text-sm max-w-[100px] text-nowrap truncate font-medium">{purchaseReceipt?.scheduled_date && format(parseISO(purchaseReceipt?.scheduled_date), "PP", { locale: es })}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Creado por</span>
            </div>
            <span className="text-sm max-w-[100px] text-nowrap truncate font-medium">{purchaseReceipt?.created_by.name}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 p-2">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Productos ({purchaseReceipt?.items.length})</span>
          </div>
          {purchaseReceipt?.items.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-sidebar rounded-md p-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">{item.product_code}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{item.quantity} unidades</p>
                </div>
              </div>
            </div>
          ))}
          {purchaseReceipt?.items && purchaseReceipt.items.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">+{purchaseReceipt.items.length - 3} productos más</p>
          )}
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground p-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {
              window.history.pushState({}, "", `/purchases/bills/new`);
              reset(defaultValues);
            }}
          >
            <Unlink />
            Desvincular
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}