import { useBillSelect } from "@/app/(private)/(commercial)/hooks/use-bill-select"
import { useInvoiceSelect } from "@/app/(private)/(commercial)/hooks/use-invoice-select"
import { AsyncCommand } from "@/components/async-command"
import CustomSonner from "@/components/custom-sonner"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AdaptedBillList } from "@/lib/adapters/bills"
import { AdaptedInvoiceList } from "@/lib/adapters/invoices"
import { useCreateCreditNoteMutation } from "@/lib/services/credit-notes"
import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Building2, CalendarX2, DollarSign, LinkIcon, Save } from "lucide-react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import DocumentPopover from "../../../components/document-popover"
import { newCreditNoteSchema } from "../../schemas/credit-notes"
import { useSendMessageMutation } from "@/lib/services/telegram"

export default function Actions() {
  const { handleSubmit } = useFormContext<z.infer<typeof newCreditNoteSchema>>();

  const { scope } = useParams<{ scope: "sales" | "purchases" }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const invoiceId = searchParams.get("invoiceId");
  const billId = searchParams.get("billId");

  const [openCommand, setOpenCommand] = useState(false)

  const [createCreditNote, { isLoading: isCreatingCreditNote }] = useCreateCreditNoteMutation()
  const [sendMessage] = useSendMessageMutation();

  const { fetcher: handleSearchBill } = useBillSelect({
    map: (b) => ({
      ...b,
      partner: b.supplier,
    }),
    filter: (b) =>
      b.amount_residual > 0 &&
      b.type === "invoice" &&
      b.status === "posted"
  })

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

  const onSubmit = async (data: z.infer<typeof newCreditNoteSchema>) => {
    try {
      const response = await createCreditNote({
        ...data,
        accounting_date: data.accounting_date.toString(),
        date: data.date.toString(),
        items: data.items.map((item) => ({
          ...item,
          cost_center: item.cost_center || undefined
        }))
      }).unwrap()

      if (response.status === "success") {
        router.push(`/${scope}/credit-notes/${response.data.id}`)
        toast.custom((t) => <CustomSonner t={t} description="Nota de crédito creada exitosamente" />)
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear la nota de crédito" variant="error" />)
      sendMessage({
        location: "app/(private)/(commercial)/[scope]/credit-notes/(form)/new/actions.tsx",
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
            {!invoiceId && !billId ? (
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
              <DocumentPopover />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {(billId || invoiceId) ? "Ver factura asociada" : "Asociar factura"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex gap-2 ml-auto">
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          size="sm"
          loading={isCreatingCreditNote}
        >
          <Save className={cn(isCreatingCreditNote && "hidden")} />
          Guardar
        </Button>
      </div>
      <AsyncCommand<Omit<AdaptedBillList, "supplier"> & { partner: string } | Omit<AdaptedInvoiceList, "customer"> & { partner: string }, number>
        open={openCommand}
        onOpenChange={setOpenCommand}
        label="Facturas"
        fetcher={scope === "purchases" ? handleSearchBill : handleSearchInvoice}
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
          window.history.pushState({}, "", `/${scope}/credit-notes/new?${scope === "purchases" ? "billId" : "invoiceId"}=${id}`);
        }}
      />
    </>
  )
}