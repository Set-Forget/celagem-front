import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building2, Calendar, DollarSign, LinkIcon, Package, Unlink, User } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { newCreditNoteSchema } from "../credit-notes/schemas/credit-notes";
import { useGetInvoiceQuery } from "@/lib/services/invoices";
import { useGetBillQuery } from "@/lib/services/bills";
import { billStatus } from "@/app/(private)/(commercial)/purchases/bills/utils";
import { invoiceStatus } from "@/app/(private)/(commercial)/sales/invoices/utils";
import { defaultValues as creditNoteDefaultValues } from "../credit-notes/(form)/default-values";
import { defaultValues as debitNoteDefaultValues } from "../debit-notes/(form)/default-values";

export default function DocumentPopover() {
  const pathname = usePathname()
  const { scope } = useParams<{ scope: "sales" | "purchases" }>()

  const searchParams = useSearchParams()

  const { reset } = useFormContext<z.infer<typeof newCreditNoteSchema>>();

  const invoiceId = searchParams.get("invoiceId");
  const billId = searchParams.get("billId");

  const { data: invoice, isLoading: isInvoiceLoading } = useGetInvoiceQuery(invoiceId ?? "", {
    skip: !invoiceId
  });

  const { data: bill, isLoading: isBillLoading } = useGetBillQuery(billId ?? "", {
    skip: !billId
  });

  const document = invoice || bill
  const isDocumentLoading = isInvoiceLoading || isBillLoading

  const status = scope === "purchases" ? billStatus[document?.status as keyof typeof billStatus] : invoiceStatus[document?.status as keyof typeof invoiceStatus];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          loading={isDocumentLoading}
          className="h-7 w-7 bg-indigo-50 text-indigo-600 shadow-lg shadow-indigo-50 hover:bg-indigo-100 hover:shadow-indigo-100"
        >
          <LinkIcon className={cn(isDocumentLoading && "hidden")} />
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
              <Link href={`/${scope}/${scope === "purchases" ? "bills" : "invoices"}/${document?.id}`} target="_blank">
                {document?.number}
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">Factura de {scope === "purchases" ? "Compra" : "Venta"}</p>
          </div>
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none`)}
          >
            {status?.label}
          </Badge>
        </div>


        <div className="space-y-2 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Total</span>
            </div>
            <span className="font-medium">
              {document?.amount_residual.toFixed(2)} {document?.currency.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{scope === "purchases" ? "Proveedor" : "Cliente"}</span>
            </div>
            <span className="text-sm max-w-[100px] text-nowrap truncate font-medium">
              {scope === "purchases" ? bill?.supplier.name : invoice?.customer.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Fecha Creación</span>
            </div>
            <span className="text-sm max-w-[100px] text-nowrap truncate font-medium">{document?.created_at && format(document?.created_at, "PP", { locale: es })}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Creado por</span>
            </div>
            <span className="text-sm max-w-[100px] text-nowrap truncate font-medium">{document?.created_by}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 p-2">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Productos ({document?.items.length})</span>
          </div>
          {document?.items.slice(0, 3).map((item) => (
            <div key={item.id} className="bg-sidebar rounded-md p-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.product_name}</p>
                  <p className="text-xs text-muted-foreground">{item.product_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{item.quantity} unidades</p>
                </div>
              </div>
            </div>
          ))}
          {document?.items && document.items.length > 3 && (
            <p className="text-xs text-muted-foreground text-center">+{document.items.length - 3} productos más</p>
          )}
        </div>

        <Separator />

        <div className="text-xs text-muted-foreground p-2">
          <Button
            size="sm"
            variant="secondary"
            className="w-full"
            onClick={() => {
              window.history.pushState({}, "", `/${scope}/${pathname.includes("credit-notes") ? "credit-notes" : "debit-notes"}/new`);
              reset(pathname.includes("credit-notes") ? creditNoteDefaultValues : debitNoteDefaultValues);
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