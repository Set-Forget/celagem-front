import { InvoiceList } from "@/app/(private)/(commercial)/sales/invoices/schemas/invoices";
import { AsyncCommand } from "@/components/async-command";
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { routes } from "@/lib/routes";
import { useLazyListInvoicesQuery } from "@/lib/services/invoices";
import { useCreateBulkChargeMutation, useCreateChargeMutation } from "@/lib/services/receipts";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, CalendarX2, DollarSign, LinkIcon, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newChargeSchema } from "../../schemas/receipts";
import InvoicePopover from "./components/invoice-popover";
import { AdaptedInvoiceList } from "@/lib/adapters/invoices";
import { useInvoiceSelect } from "@/hooks/use-invoice-select";
import { useSendMessageMutation } from "@/lib/services/telegram";

export default function Actions() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openCommand, setOpenCommand] = useState(false)

  const { handleSubmit } = useFormContext<z.infer<typeof newChargeSchema>>();

  const [sendMessage] = useSendMessageMutation();
  const [createCharge, { isLoading: isCreatingCharge }] = useCreateChargeMutation()
  const [createBulkCharge, { isLoading: isCreatingBulkCharge }] = useCreateBulkChargeMutation()

  const invoiceIds = searchParams.get("invoice_ids")

  const { fetcher: handleSearchInvoice } = useInvoiceSelect({
    map: (i) => ({
      ...i,
      partner: i.customer,
    }),
    filter: (i) =>
      i.amount_residual > 0 &&
      i.type === "invoice" &&
      i.status === "posted"
  })

  const onSubmit = async (data: z.infer<typeof newChargeSchema>) => {
    const { invoices, ...rest } = data

    const hasMultipleCustomers = invoices && new Set(invoices.map((i) => i.customer.id)).size > 1;

    try {
      if (hasMultipleCustomers) {
        const response = await createBulkCharge({
          ...rest,
          date: rest.date.toString(),
          amount: rest.amount || invoices?.reduce((acc, b) => acc + b.amount_residual, 0),
          journal: 6,
          invoices: invoices?.map((b) => b.id),
        }).unwrap();

        if (response.status === "success") {
          router.push(routes.receipts.list)
          toast.custom((t) => <CustomSonner t={t} description="Cobros registrados exitosamente" />)
        }
      } else {
        const response = await createCharge({
          ...rest,
          date: rest.date.toString(),
          amount: rest.amount || invoices?.reduce((acc, b) => acc + b.amount_residual, 0),
          journal: 6,
          invoices: invoices?.map((b) => b.id),
        }).unwrap();

        if (response.status === "success") {
          router.push(routes.receipts.detail(response.data.id))
          toast.custom((t) => <CustomSonner t={t} description="Cobro registrado exitosamente" />)
        }
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al registrar el cobro" variant="error" />)
      sendMessage({
        location: "app/(private)/banking/receipts/(form)/new/actions.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {!invoiceIds ? (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 shadow-lg shadow-secondary"
                onClick={() => setOpenCommand(true)}
              >
                <LinkIcon />
                Asociar
              </Button>
            ) : (
              <InvoicePopover />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {invoiceIds ? "Ver factura" : "Asociar factura"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex gap-2 ml-auto">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          size="sm"
          loading={isCreatingCharge || isCreatingBulkCharge}
        >
          <Save className={cn(isCreatingCharge || isCreatingBulkCharge && "hidden")} />
          Guardar
        </Button>
      </div>
      <AsyncCommand<Omit<AdaptedInvoiceList, "customer"> & { partner: string }, number>
        open={openCommand}
        onOpenChange={setOpenCommand}
        label="Facturas"
        fetcher={handleSearchInvoice}
        renderOption={(r) => (
          <div className="flex flex-col gap-1">
            <span className="font-medium">{r.number}</span>
            <div className="grid grid-cols-4 items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="!h-3.5 !w-3.5" />
                <p className="truncate">
                  {r.partner}
                </p>
              </span>
              <span className="flex items-center gap-1 truncate">
                <DollarSign className="!h-3.5 !w-3.5" />
                <p className="truncate">
                  {r?.amount_residual?.toLocaleString("es-ES", {
                    style: "currency",
                    currency: r?.currency?.name,
                  })}
                </p>
              </span>
              <span className="flex items-center gap-1 truncate">
                <CalendarX2 className="!h-3.5 !w-3.5" />
                <p className="truncate">
                  {r?.due_date && format(parseISO(r?.due_date), "PP", { locale: es })}
                </p>
              </span>
            </div>
          </div>
        )}
        getOptionValue={(r) => r.id}
        onSelect={(id, r) => {
          window.history.pushState({}, "", `/banking/receipts/new?invoice_ids=${id}`);
        }}
      />
    </>
  )
}