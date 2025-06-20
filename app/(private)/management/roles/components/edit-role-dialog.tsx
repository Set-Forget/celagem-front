import { useForm } from "react-hook-form";
import { newRoleSchema } from "../schema/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { DialogsState, dialogsStateObservable, closeDialogs } from "@/lib/store/dialogs-store";
import { useSendMessageMutation } from "@/lib/services/telegram";
import { useCreateRoleMutation, useAddPermissionToRoleMutation, useGetRoleQuery, useUpdateRoleMutation, useRemovePermissionFromRoleMutation } from "@/lib/services/roles";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CustomSonner from "@/components/custom-sonner";
import { NewRoleForm } from "./new-role-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";

export default function EditRoleDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const roleId = dialogState?.payload?.role_id as string

  const { data: role } = useGetRoleQuery(roleId, {
    skip: !roleId
  })

  const [sendMessage] = useSendMessageMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateRoleMutation();
  const [addPermissionToRole, { isLoading: isAddingPermissionToRole }] = useAddPermissionToRoleMutation();
  const [removePermissionFromRole, { isLoading: isRemovingPermissionFromRole }] = useRemovePermissionFromRoleMutation();

  const form = useForm<z.infer<typeof newRoleSchema>>({
    resolver: zodResolver(newRoleSchema),
    defaultValues: {
      name: '',
    },
  });

  const onOpenChange = () => {
    form.reset();
    closeDialogs();
  };

  const onSubmit = async (data: z.infer<typeof newRoleSchema>) => {
    const { permissions, ...rest } = data;
    try {
      const response = await updateRole({
        id: roleId,
        body: rest,
      }).unwrap();

      const permissionsToRemove = role?.permissions?.filter((p) => !permissions.includes(p.id)) ?? [];
      const permissionsToAdd = permissions.filter((p) => !role?.permissions?.some((rp) => rp.id === p));

      if (permissionsToRemove.length > 0) {
        await Promise.all(
          permissionsToRemove.map((permission) =>
            removePermissionFromRole({
              role_id: roleId,
              permission_id: permission.id,
            }).unwrap()
          )
        );
      }

      if (permissionsToAdd.length > 0) {
        await Promise.all(
          permissionsToAdd.map((permission) =>
            addPermissionToRole({
              role_id: roleId,
              permission_ids: [permission],
            }).unwrap()
          )
        );
      }

      if (response.status === 'success') {
        toast.custom((t) => <CustomSonner t={t} description="Rol actualizado exitosamente" variant="success" />);
        onOpenChange();
      }
    } catch (error) {
      toast.custom((t) => <CustomSonner t={t} description="Ocurrió un error al actualizar el rol" variant="error" />);
      sendMessage({
        location: "app/(private)/management/roles/components/edit-role-dialog.tsx",
        rawError: error,
        fnLocation: "onSubmit"
      })
    }
  };

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (role) {
      form.reset({
        name: role.name,
        permissions: role.permissions.map((p) => p.id),
        company_id: role.company_id,
      });
    }
  }, [role]);

  return (
    <Dialog
      open={dialogState.open === 'edit-role'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar rol</DialogTitle>
          <DialogDescription>
            Edita el rol para asignar a tus usuarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <NewRoleForm />
          <DialogFooter>
            <Button
              size="sm"
              type="submit"
              loading={isUpdatingRole || isAddingPermissionToRole || isRemovingPermissionFromRole}
              onClick={form.handleSubmit(onSubmit)}
            >
              Guardar
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
