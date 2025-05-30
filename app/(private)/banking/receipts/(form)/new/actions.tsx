import { InvoiceList } from "@/app/(private)/(commercial)/sales/invoices/schemas/invoices";
import { AsyncCommand } from "@/components/async-command";
import CustomSonner from "@/components/custom-sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { routes } from "@/lib/routes";
import { useLazyListInvoicesQuery } from "@/lib/services/invoices";
import { useCreateChargeMutation } from "@/lib/services/receipts";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, CalendarX2, DollarSign, LinkIcon, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newChargeSchema } from "../../schemas/receipts";
import InvoicePopover from "./components/invoice-popover";

export default function Actions() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openCommand, setOpenCommand] = useState(false)

  const { handleSubmit } = useFormContext<z.infer<typeof newChargeSchema>>();

  const [createCharge, { isLoading: isCreatingCharge }] = useCreateChargeMutation()

  const invoiceIds = searchParams.get("invoice_ids")

  const [searchInvoices] = useLazyListInvoicesQuery()

  const handleSearchInvoice = async (query?: string) => {
    try {
      const invoice = await searchInvoices({
        number: query,
        status: "posted",
        type: "invoice"
      }).unwrap()

      return invoice?.map(invoice => ({
        ...invoice,
        partner: invoice.customer,
      }))
        .filter(invoice => invoice.amount_residual > 0)
        .slice(0, 10)
    }
    catch (error) {
      console.error(error)
      return []
    }
  }

  const onSubmit = async (data: z.infer<typeof newChargeSchema>) => {
    const { invoices, ...rest } = data

    try {
      const response = await createCharge({
        ...rest,
        date: rest.date.toString(),
        amount: rest.amount || invoices?.reduce((acc, b) => acc + b.amount_residual, 0),
        partner: rest.partner || invoices?.[0]?.customer.id,
        journal: 6,
        invoices: invoices?.map((b) => b.id) || undefined,
        withholdings: data?.withholdings?.map((id) => ({
          tax_id: id,
          account_id: id === 1 ? 22 : 1,
        })),
      }).unwrap()

      if (response.status === "success") {
        router.push(routes.receipts.detail(response.data.id))
        toast.custom((t) => <CustomSonner t={t} description="Cobro registrado exitosamente" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al registrar el cobro" variant="error" />)
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
                size="icon"
                className="h-7 w-7 shadow-lg shadow-secondary"
                onClick={() => setOpenCommand(true)}
              >
                <LinkIcon />
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
          loading={isCreatingCharge}
        >
          <Save className={cn(isCreatingCharge && "hidden")} />
          Guardar
        </Button>
      </div>
      <AsyncCommand<Omit<InvoiceList, "customer"> & { partner: string }, number>
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
                  {format(r?.due_date, "PP", { locale: es })}
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