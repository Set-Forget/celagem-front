import RenderFields from "@/components/render-fields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGetClassQuery } from "@/lib/services/classes";
import { closeDialogs, DialogsState, dialogsStateObservable, setDialogsState } from "@/lib/store/dialogs-store";
import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import { ClassDetail } from "../schema/classes";
import { FieldDefinition } from "@/lib/utils";

const fields: FieldDefinition<ClassDetail>[] = [
  {
    label: "Nombre",
    placeholderLength: 14,
    render: (p) => p?.name || "No especificado"
  },
  {
    label: "Compañía",
    placeholderLength: 14,
    render: (p) => p?.company_name || "No especificado"
  },
];

export default function ViewClassDialog() {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const classId = dialogState?.payload?.class_id as string;

  const { data: classData, isLoading } = useGetClassQuery(classId, { skip: !classId });

  const onOpenChange = () => {
    closeDialogs();
  };

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => { subscription.unsubscribe(); };
  }, []);

  return (
    <Dialog open={dialogState.open === "class-details"} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Detalles de la clase</DialogTitle>
          <DialogDescription className="sr-only" />
        </DialogHeader>
        <RenderFields
          fields={fields}
          loading={isLoading}
          data={classData}
        />
        <DialogFooter>
          <div className="flex gap-2 ml-auto">
            <Button size="sm" onClick={() => setDialogsState({ open: 'edit-class', payload: { class_id: classId } })}>
              <SquarePen />
              Editar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 