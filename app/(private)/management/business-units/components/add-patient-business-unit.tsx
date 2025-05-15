'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  closeDialogs,
  DialogsState,
  dialogsStateObservable,
} from '@/lib/store/dialogs-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { businessUnitAddPatientSchema } from '../schema/business-units';
import {
  useAddPatientToBusinessUnitMutation,
  useGetBusinessUnitQuery,
} from '@/lib/services/business-units';
import { useLazyListPatientsQuery } from '@/lib/services/patients';
import { AsyncMultiSelect } from '@/components/async-multi-select';
import { toast } from 'sonner';
import CustomSonner from '@/components/custom-sonner';

export default function AddPatientBusinessUnit({
  businessUnitId,
}: {
  businessUnitId: string;
}) {
  const [dialogState, setDialogState] = useState<DialogsState>({ open: false });

  const addPatientForm = useForm<z.infer<typeof businessUnitAddPatientSchema>>({
    resolver: zodResolver(businessUnitAddPatientSchema),
    defaultValues: {
      patient_ids: [],
    },
  });

  const onOpenChange = () => {
    closeDialogs();
  };

  const { data: businessUnit } = useGetBusinessUnitQuery(businessUnitId);
  const [getPatients] = useLazyListPatientsQuery();
  const [addPatientToBusinessUnit, { isLoading: isAddingPatient }] =
    useAddPatientToBusinessUnitMutation();
  const handleGetPatients = async () => {
    try {
      // Use company_id from the business unit to filter patients
      const params = businessUnit?.company_id
        ? { company_id: businessUnit.company_id }
        : undefined;

      const response = await getPatients(params).unwrap();
      return response.data.map((patient) => ({
        label: `${patient.first_name} ${patient.first_last_name}`,
        value: patient.id,
      }));
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      return [];
    }
  };

  const onSubmit = async (
    data: z.infer<typeof businessUnitAddPatientSchema>
  ) => {
    try {
      const response = await addPatientToBusinessUnit({
        Id: businessUnitId,
        Body: { ...data },
      }).unwrap();

      if (response.status === 'success') {
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Pacientes agregados exitosamente a la unidad de negocio"
            variant="success"
          />
        ));
        addPatientForm.reset();
        closeDialogs();
      }
    } catch (error) {
      console.error('Error adding patients to business unit:', error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Ocurrió un error al agregar los pacientes a la unidad de negocio"
          variant="error"
        />
      ));
    }
  };
  useEffect(() => {
    const subscription = dialogsStateObservable.subscribe(setDialogState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reset form when dialog opens or business unit changes
  useEffect(() => {
    if (dialogState.open === 'add-patient-business-unit') {
      addPatientForm.reset();
    }
  }, [dialogState.open, businessUnit, addPatientForm]);

  return (
    <Dialog
      open={dialogState.open === 'add-patient-business-unit'}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        {' '}
        <DialogHeader>
          <DialogTitle>Agregar Pacientes a Unidad de Negocio</DialogTitle>
          <DialogDescription>
            Seleccione los pacientes para agregarlos a esta unidad de negocio.
          </DialogDescription>
        </DialogHeader>
        <Form {...addPatientForm}>
          <form className="flex flex-col gap-4">
            <FormField
              control={addPatientForm.control}
              name="patient_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pacientes</FormLabel>{' '}
                  <FormControl>
                    <AsyncMultiSelect<{ label: string; value: string }, string>
                      key={`patients-${businessUnit?.company_id || 'empty'}`}
                      placeholder={
                        businessUnit?.company_id
                          ? 'Seleccionar pacientes'
                          : 'Cargando información...'
                      }
                      fetcher={handleGetPatients}
                      getDisplayValue={(item) => item.label}
                      getOptionValue={(item) => item.value}
                      renderOption={(item) => <div>{item.label}</div>}
                      onValueChange={field.onChange}
                      value={field.value}
                      noResultsMessage="No se encontraron pacientes"
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Estos pacientes serán agregados a la unidad de negocio.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              {' '}
              <Button
                size="sm"
                type="submit"
                onClick={addPatientForm.handleSubmit(onSubmit)}
                disabled={isAddingPatient}
              >
                Agregar Pacientes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
