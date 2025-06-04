import CustomSonner from "@/components/custom-sonner";
import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { routes } from "@/lib/routes";
import { useApproveBillMutation, useCancelBillMutation, useConfirmBillMutation, useGetBillQuery } from "@/lib/services/bills";
import { generatePDF } from "@/lib/templates/utils";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, CircleX, EditIcon, Ellipsis, FileTextIcon, Stamp } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Actions() {
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const { data: bill } = useGetBillQuery(id);

  const [confirmBill, { isLoading: isBillConfirming }] = useConfirmBillMutation();
  const [approveBill, { isLoading: isBillApproving }] = useApproveBillMutation();
  const [cancelBill, { isLoading: isBillCancelling }] = useCancelBillMutation();

  const handleConfirmBill = async () => {
    try {
      const response = await confirmBill({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra confirmada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al confirmar la factura de compra" variant="error" />)
    }
  }

  const handleApproveBill = async () => {
    try {
      const response = await approveBill({
        id: id,
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description="Factura de compra aprobada" variant="success" />)
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al aprobar la factura de compra" variant="error" />)
    }
  }

  const handleCancelBill = async ({ rejectionReason }: { rejectionReason?: string } = { rejectionReason: undefined }) => {
    try {
      const response = await cancelBill({
        id: id,
        rejection_reason: rejectionReason || "",
      }).unwrap()

      if (response.status === "success") {
        toast.custom((t) => <CustomSonner t={t} description={`Factura de compra ${rejectionReason ? "rechazada" : "cancelada"}`} variant="success" />)
      }
    }
    catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Error al cancelar la factura de compra" variant="error" />)
    }
  }

  const handleGeneratePDF = async () => {
    if (!bill) throw new Error("No se ha encontrado la factura de compra")
    try {
      const pdf = await generatePDF({
        templateName: 'bill',
        data: bill,
      });
      pdf.view();
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Error al generar el PDF" variant="error" />)
      console.error('Error al generar el PDF:', error);
    }
  };

  const state = bill?.status
  const type = bill?.type
  const hasPurchaseOrder = (bill?.purchase_orders?.length ?? 0) > 0

  if (!state || !type) return null

  if (state === "draft") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/purchases/bills/${id}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => handleCancelBill()}
            loading={isBillCancelling}
            className="text-destructive focus:text-destructive"
          >
            <CircleX className={cn(isBillCancelling && "hidden")} />
            Cancelar
          </DropdownMenuItem>
        </Dropdown>
        <Button
          size="sm"
          onClick={hasPurchaseOrder ? handleApproveBill : handleConfirmBill}
          loading={isBillConfirming || isBillApproving}
        >
          <Check className={cn((isBillConfirming || isBillApproving) && "hidden")} />
          Confirmar
        </Button>
      </div>
    )
  }

  if (state === "to_approve") {
    return (
      <div className="flex gap-2">
        <Dropdown
          modal={false}
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/purchases/bills/${id}/edit`)}>
            <EditIcon />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog modal>
            <DialogTrigger asChild>
              <DropdownMenuItem
                onSelect={e => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <CircleX className={cn(isBillCancelling && "hidden")} />
                Rechazar
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <div className="flex flex-col gap-2">
                <DialogHeader>
                  <DialogTitle>
                    Rechazar orden de compra
                  </DialogTitle>
                  <DialogDescription>
                    Una vez que se rechazada la orden de compra, podrá ser reabierta y editada.
                  </DialogDescription>
                </DialogHeader>
              </div>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();

                const data = new FormData(e.currentTarget);
                const rejectionReason = data.get("rejection_reason") as string;
                if (!rejectionReason) return toast.custom((t) => <CustomSonner t={t} description="Por favor, ingrese un motivo de rechazo" variant="error" />)

                handleCancelBill({ rejectionReason })
              }}>
                <div className="*:not-first:mt-2">
                  <Label>
                    Motivo de rechazo
                  </Label>
                  <Input
                    name="rejection_reason"
                    type="text"
                    placeholder="Motivo de rechazo..."
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      className="flex-1"
                    >
                      Cerrar
                    </Button>
                  </DialogClose>
                  <Button
                    size="sm"
                    loading={isBillCancelling}
                    type="submit"
                  >
                    <CircleX className={cn(isBillCancelling && "hidden")} />
                    Rechazar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </Dropdown>
        <Button
          size="sm"
          onClick={handleApproveBill}
          loading={isBillApproving}
        >
          <Stamp className={cn(isBillApproving && "hidden")} />
          Aprobar
        </Button>
      </div>
    )
  }

  if (state === "posted" && type === "invoice") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
        </Dropdown>
        <Dropdown
          trigger={
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => router.push(routes.payments.new(bill?.id))}>
            Registro de pago
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/purchases/credit-notes/new?billId=${id}`)}>
            Nota de crédito
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push(`/purchases/debit-notes/new?billId=${id}`)}>
            Nota de débito
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }

  if (state === "done") {
    return (
      <div className="flex gap-2">
        <Dropdown
          trigger={
            <Button size="icon" variant="outline" className="h-8 w-8">
              <Ellipsis />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => handleGeneratePDF()}>
            <FileTextIcon />
            Previsualizar
          </DropdownMenuItem>
          {/* 
            // ! Se deberían poder retornar las notas de crédito/débito a borrador, pero no se puede por el momento.
          */}
        </Dropdown>
        <Dropdown
          trigger={
            <Button size="sm">
              Crear
              <ChevronDown />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => router.push(`/purchases/debit-notes/new?billId=${id}`)}>
            Nota de débito
          </DropdownMenuItem>
        </Dropdown>
      </div>
    )
  }

  // // ! No se puede re-abrir por el momento.
  // if (state === "cancel") {
  //   return (
  //     <Button
  //       size="sm"
  //     >
  //       <RotateCcw /* className={cn(isInvoiceUpdating && "hidden")} */ />
  //       Reabrir
  //     </Button>
  //   )
  // }

}