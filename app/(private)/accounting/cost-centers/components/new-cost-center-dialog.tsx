'use client'

import CustomSonner from "@/components/custom-sonner";
import SearchSelect from "@/components/search-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCostCenterMutation } from "@/lib/services/cost-centers";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { newCostCenterSchema } from "../schemas/cost-centers";

const plans = [
  {
    "id": 1,
    "name": "Project",
    "description": false,
    "parent_id": false,
    "parent_path": "1/",
    "root_id": [
      1,
      "Project"
    ],
    "children_ids": [],
    "children_count": 0,
    "complete_name": "Project",
    "account_ids": [
      16,
      8,
      15,
      6,
      7,
      9,
      13,
      14,
      12,
      5,
      11,
      3,
      4,
      10
    ],
    "account_count": 14,
    "all_account_count": 14,
    "color": 10,
    "sequence": 10,
    "default_applicability": "optional",
    "applicability_ids": [],
    "display_name": "Project",
    "create_uid": [
      1,
      "OdooBot"
    ],
    "create_date": "2025-01-03 19:11:11",
    "write_uid": [
      1,
      "OdooBot"
    ],
    "write_date": "2025-01-03 19:11:11"
  },
  {
    "id": 2,
    "name": "Departments",
    "description": false,
    "parent_id": false,
    "parent_path": "2/",
    "root_id": [
      2,
      "Departments"
    ],
    "children_ids": [],
    "children_count": 0,
    "complete_name": "Departments",
    "account_ids": [
      17,
      18,
      22,
      20,
      21,
      23,
      19
    ],
    "account_count": 7,
    "all_account_count": 7,
    "color": 2,
    "sequence": 10,
    "default_applicability": "optional",
    "applicability_ids": [],
    "display_name": "Departments",
    "create_uid": [
      1,
      "OdooBot"
    ],
    "create_date": "2025-01-03 19:11:11",
    "write_uid": [
      1,
      "OdooBot"
    ],
    "write_date": "2025-01-03 19:11:11"
  },
  {
    "id": 3,
    "name": "Internal",
    "description": false,
    "parent_id": false,
    "parent_path": "3/",
    "root_id": [
      3,
      "Internal"
    ],
    "children_ids": [],
    "children_count": 0,
    "complete_name": "Internal",
    "account_ids": [
      2,
      1
    ],
    "account_count": 2,
    "all_account_count": 2,
    "color": 5,
    "sequence": 10,
    "default_applicability": "unavailable",
    "applicability_ids": [
      1
    ],
    "display_name": "Internal",
    "create_uid": [
      1,
      "OdooBot"
    ],
    "create_date": "2025-01-03 19:11:11",
    "write_uid": [
      1,
      "OdooBot"
    ],
    "write_date": "2025-01-03 19:11:31"
  },
  {
    "id": 4,
    "name": "Default",
    "description": false,
    "parent_id": false,
    "parent_path": "4/",
    "root_id": [
      4,
      "Default"
    ],
    "children_ids": [],
    "children_count": 0,
    "complete_name": "Default",
    "account_ids": [],
    "account_count": 0,
    "all_account_count": 0,
    "color": 7,
    "sequence": 10,
    "default_applicability": "optional",
    "applicability_ids": [],
    "display_name": "Default",
    "create_uid": [
      1,
      "OdooBot"
    ],
    "create_date": "2025-03-19 16:15:35",
    "write_uid": [
      1,
      "OdooBot"
    ],
    "write_date": "2025-03-28 15:18:37"
  }
]

export default function NewCostCenterDialog() {
  const router = useRouter()

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false })

  const [createCostCenter, { isLoading: isCreatingCostCenter }] = useCreateCostCenterMutation()

  const newCostCenterForm = useForm<z.infer<typeof newCostCenterSchema>>({
    resolver: zodResolver(newCostCenterSchema),
    defaultValues: {
      name: "",
      code: "",
    }
  });

  const onOpenChange = () => {
    closeDialogs()
    newCostCenterForm.reset()
  }

  const onSubmit = async (data: z.infer<typeof newCostCenterSchema>) => {
    try {
      const response = await createCostCenter(data).unwrap()

      if (response.status === "success") {
        closeDialogs()

        toast.custom((t) => <CustomSonner t={t} description="Centro de costos creado correctamente" variant="success" />)
        router.push(`/accounting/cost-centers/${response.data.id}`)
        newCostCenterForm.reset()
      }
    } catch (error) {
      console.error(error)
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al crear el centro de costos" variant="error" />)
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState)
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Dialog
      open={dialogState.open === "new-cost-center"}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo centro de costos</DialogTitle>
          <DialogDescription>
            Crea un nuevo centro de costos para asignar a tus transacciones.
          </DialogDescription>
        </DialogHeader>
        <Form {...newCostCenterForm}>
          <form className="gap-4 grid grid-cols-2">
            <FormField
              control={newCostCenterForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Centro de costos principal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newCostCenterForm.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CC-001"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={newCostCenterForm.control}
              name="plan_id"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full col-span-2">
                  <FormLabel className="w-fit">
                    Plan
                  </FormLabel>
                  <FormControl>
                    <SearchSelect
                      modal
                      value={field.value}
                      onSelect={field.onChange}
                      options={plans.map((plan) => ({
                        value: plan.id,
                        label: plan.name,
                      }))}
                      placeholder="Selecciona un plan..."
                      searchPlaceholder="Buscar..."
                    />
                  </FormControl>
                  {newCostCenterForm.formState.errors.plan_id ? (
                    <FormMessage />
                  ) :
                    <FormDescription>
                      Esta será la ubicación de origen del pedido.
                    </FormDescription>
                  }
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={() => newCostCenterForm.handleSubmit(onSubmit)()}
            size="sm"
            loading={isCreatingCostCenter}
            type="button">
            Crear
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
