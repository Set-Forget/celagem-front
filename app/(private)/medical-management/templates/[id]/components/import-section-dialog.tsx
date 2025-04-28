"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { importSectionSchema } from "@/app/(private)/medical-management/calendar/schemas/templates";
import { AsyncSelect } from "@/components/async-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLazyGetSectionsQuery, useLazyListSectionsQuery } from "@/lib/services/templates";
import { closeDialogs, DialogsState, dialogsStateObservable } from "@/lib/store/dialogs-store";
import { NormalizedSchema } from "../page";

export default function ImportSectionDialog() {
  const { getValues, setValue } = useFormContext<NormalizedSchema>();

  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const [getSections] = useLazyListSectionsQuery();
  const [getSection, { isLoading }] = useLazyGetSectionsQuery();

  const form = useForm<z.infer<typeof importSectionSchema>>({
    resolver: zodResolver(importSectionSchema),
  });

  const onOpenChange = () => {
    closeDialogs();
    form.reset();
  };

  const handleGetSections = async (query?: string) => {
    try {
      const sections = await getSections({
        name: query,
      }).unwrap()
      return sections.data.map((sections) => ({
        label: sections.name,
        value: sections.id,
      }))
    } catch (error) {
      console.error("Error al obtener la clase:", error)
      return []
    }
  }

  async function onSubmit(data: z.infer<typeof importSectionSchema>) {
    try {
      const currentSections = getValues("sections") || [];
      const currentFields = getValues("fields") || [];

      const importedSection = await getSection(data.id).unwrap();

      setValue("sections", [
        ...currentSections,
        {
          ...importedSection,
          type: importedSection.type !== "form" && importedSection.type !== "table" ? "form" : importedSection.type,
          fields: importedSection.fields.map((field) => field.id),
        },
      ], {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue("fields", [
        ...currentFields,
        ...importedSection.fields,
      ], {
        shouldDirty: true,
        shouldValidate: true,
      });

      closeDialogs();
      form.reset();
    } catch (error) {
      console.error("Error al importar la sección:", error)
    }
  }

  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Dialog open={dialogState.open === "import-section"} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px] max-w-none">
        <DialogHeader>
          <DialogTitle>Importar sección</DialogTitle>
          <DialogDescription>
            Importá una nueva sección para la plantilla.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Sección</FormLabel>
                    <AsyncSelect<{ label: string, value: number }, number>
                      label="Sección"
                      triggerClassName="!w-full"
                      placeholder="Seleccionar sección"
                      fetcher={handleGetSections}
                      getDisplayValue={(item) => item.label}
                      getOptionValue={(item) => item.value}
                      renderOption={(item) => <div>{item.label}</div>}
                      onChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron secciones"
                      modal
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                loading={isLoading}
                size="sm"
              >
                Importar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
