import { AsyncCommand } from "@/components/async-command";
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreatePurchaseOrderMutation } from "@/lib/services/purchase-orders";
import { useLazyListPurchaseRequestsQuery } from "@/lib/services/purchase-requests";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, Calendar, LinkIcon, Save, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newPurchaseOrderSchema } from "../../schemas/purchase-orders";
import PurchaseRequestPopover from "./components/purchase-request-popover";

export default function Actions() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { handleSubmit } = useFormContext<z.infer<typeof newPurchaseOrderSchema>>();

  const [openCommand, setOpenCommand] = useState(false)

  const purchaseRequestId = searchParams.get("purchase_request_id")

  const [searchPurchaseRequest] = useLazyListPurchaseRequestsQuery()
  const [createPurchaseOrder, { isLoading: isCreatingPurchaseOrder }] = useCreatePurchaseOrderMutation()

  const onSubmit = async (data: z.infer<typeof newPurchaseOrderSchema>) => {
    try {
      const response = await createPurchaseOrder({
        ...data,
        required_date: data.required_date.toString(),
        company: 1,
      }).unwrap()

      if (response.status === "success") {
        router.push(`/purchases/purchase-orders/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Orden de compra creada exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la orden de compra" variant="error" />)
    }
  }

  const handleSearchPurchaseRequest = async (query?: string) => {
    try {
      const response = await searchPurchaseRequest({
        name: query,
        status: "approved"
      }).unwrap()

      return response.data?.map(purchaseRequest => ({
        id: purchaseRequest.id,
        name: purchaseRequest.name,
        company_name: purchaseRequest.company.name,
        created_by: purchaseRequest.created_by,
        request_date: purchaseRequest.request_date,
      }))
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {!purchaseRequestId ? (
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7 shadow-lg shadow-secondary"
                onClick={() => setOpenCommand(true)}
              >
                <LinkIcon />
              </Button>
            ) : (
              <PurchaseRequestPopover />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {purchaseRequestId ? "Ver solicitud de pedido" : "Asociar solicitud de pedido"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex justify-end gap-2 ml-auto">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          size="sm"
          loading={isCreatingPurchaseOrder}
        >
          <Save className={cn(isCreatingPurchaseOrder && "hidden")} />
          Guardar
        </Button>
      </div>
      <AsyncCommand<{ id: number, name: string, company_name: string, created_by: string, request_date: string }, number>
        open={openCommand}
        onOpenChange={setOpenCommand}
        label="Solicitudes de pedido"
        fetcher={handleSearchPurchaseRequest}
        renderOption={(r) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{r.name}</span>
            <div className="grid grid-cols-4 items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="!h-3.5 !w-3.5" />
                <p className="truncate">
                  {r.company_name}
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
                  {format(r.request_date, "PP", { locale: es })}
                </p>
              </span>
            </div>
          </div>
        )}
        getOptionValue={(r) => r.id}
        onSelect={(id, r) => {
          window.history.pushState({}, "", `/purchases/purchase-orders/new?purchase_request_id=${id}`);
        }}
      />
    </>
  )
}