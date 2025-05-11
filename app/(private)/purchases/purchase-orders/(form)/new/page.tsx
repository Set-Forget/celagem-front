"use client"

import CustomSonner from "@/components/custom-sonner"
import DataTabs from "@/components/data-tabs"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useLazyGetMaterialQuery } from "@/lib/services/materials"
import { useCreatePurchaseOrderMutation } from "@/lib/services/purchase-orders"
import { useGetPurchaseRequestQuery } from "@/lib/services/purchase-requests"
import { cn, formatDateToISO, getFieldPaths } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { parseDate } from "@internationalized/date"
import { get } from "lodash"
import { Save, Sticker, Wallet } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldErrors, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { newPurchaseOrderFiscalSchema, newPurchaseOrderNotesSchema, newPurchaseOrderSchema } from "../../schemas/purchase-orders"
import FiscalForm from "../components/fiscal-form"
import GeneralForm from "../components/general-form"
import NotesForm from "../components/notes-form"

const tabToFieldsMap = {
  "tab-1": getFieldPaths(newPurchaseOrderFiscalSchema),
  "tab-2": getFieldPaths(newPurchaseOrderNotesSchema),
}

const tabs = [
  {
    value: "tab-1",
    label: "Fiscal",
    icon: <Wallet className="mr-1.5" size={16} />,
    content: <FiscalForm />
  },
  {
    value: "tab-2",
    label: "Notas",
    icon: <Sticker className="mr-1.5" size={16} />,
    content: <NotesForm />
  },
];

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [tab, setTab] = useState(tabs[0].value)

  const [getMaterial] = useLazyGetMaterialQuery();

  const [createPurchaseOrder, { isLoading: isCreatingPurchaseOrder }] = useCreatePurchaseOrderMutation()

  const purchaseRequestId = searchParams.get("purchase_request_id")

  const { data: purchaseRequest } = useGetPurchaseRequestQuery(purchaseRequestId!, { skip: !purchaseRequestId })

  const newPurchaseOrderForm = useForm<z.infer<typeof newPurchaseOrderSchema>>({
    resolver: zodResolver(newPurchaseOrderSchema),
    defaultValues: {
      items: [],
    }
  })

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

  const onError = (errors: FieldErrors<z.infer<typeof newPurchaseOrderSchema>>) => {
    for (const [tabKey, fields] of Object.entries(tabToFieldsMap)) {
      const hasError = fields.some((fieldPath) => {
        return get(errors, fieldPath) != null;
      });
      if (hasError) {
        setTab(tabKey);
        break;
      }
    }
  };

  useEffect(() => {
    // ! Esto debe eliminarse cuando purchaseRequest traiga price_unit en los items.
    const fetchPricesAndResetForm = async () => {
      if (!purchaseRequest) return;

      const itemsWithPrices = await Promise.all(
        purchaseRequest.items.map(async (item) => {
          try {
            const { standard_price } = await getMaterial(item.product_id).unwrap();
            return {
              product_id: item.product_id,
              product_qty: item.quantity,
              price_unit: standard_price || 0,
            };
          } catch (err) {
            return {
              product_id: item.product_id,
              product_qty: item.quantity,
              price_unit: 0,
            };
          }
        })
      );

      newPurchaseOrderForm.reset({
        required_date: parseDate(formatDateToISO(purchaseRequest.request_date)),
        purchase_request: purchaseRequest.id,
        items: itemsWithPrices,
      });
    };

    fetchPricesAndResetForm();
  }, [purchaseRequest]);

  return (
    <Form {...newPurchaseOrderForm}>
      <Header title="Nueva orden de compra">
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newPurchaseOrderForm.handleSubmit(onSubmit, onError)}
            size="sm"
            loading={isCreatingPurchaseOrder}
          >
            <Save className={cn(isCreatingPurchaseOrder && "hidden")} />
            Guardar
          </Button>
        </div>
      </Header>
      <GeneralForm />
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
        triggerClassName="mt-4"
      />
    </Form>
  )
}