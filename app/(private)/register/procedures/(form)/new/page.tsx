'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetProfileQuery } from '@/lib/services/auth';

import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { Bolt, Building, Contact, House, HousePlug, Microscope, Shield, Users, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import GeneralForm from '../components/general-form';
import { getFieldPaths } from '../utils';
import { newProcedureGeneralSchema, newProcedureJobPositionsSchema, newProcedureMaterialsSchema, newProcedureMedicalExamsSchema, newProcedureSchema, newProcedureServicesSchema } from '../../schema/procedures';
import { useCreateProcedureMutation } from '@/lib/services/procedures';
import JobPositionsForm from '../components/job-positions-form';
import ServicesForm from '../components/services-form';
import MedicalExamsForm from '../components/medical-exams-form';
import MaterialsForm from '../components/materials-form';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newProcedureGeneralSchema),
  'tab-2': getFieldPaths(newProcedureJobPositionsSchema),
  'tab-3': getFieldPaths(newProcedureServicesSchema),
  'tab-4': getFieldPaths(newProcedureMedicalExamsSchema),
  'tab-5': getFieldPaths(newProcedureMaterialsSchema),
};

const tabs = [
  {
    value: 'tab-1',
    label: 'General',
    icon: (
      <House
        className="mr-1.5"
        size={16}
      />
    ),
    content: <GeneralForm />,
  },
  {
    value: 'tab-2',
    label: 'Puestos de trabajo',
    icon: (
      <Contact
        className="mr-1.5"
        size={16}
      />
    ),
    content: <JobPositionsForm />,
  },
  {
    value: 'tab-3',
    label: 'Servicios',
    icon: (
      <HousePlug
        className="mr-1.5"
        size={16}
      />
    ),
    content: <ServicesForm />,
  },
  {
    value: 'tab-4',
    label: 'Examenes medicos',
    icon: (
      <Microscope
        className="mr-1.5"
        size={16}
      />
    ),
    content: <MedicalExamsForm />,
  },
  {
    value: 'tab-5',
    label: 'Materiales',
    icon: (
      <Bolt
        className="mr-1.5"
        size={16}
      />
    ),
    content: <MaterialsForm />,
  },
];

export default function Page() {
  const router = useRouter();

  const [createProcedure, { isLoading: isCreatingProcedure }] =
    useCreateProcedureMutation();
  const { data: profile } = useGetProfileQuery();

  const newProcedureForm = useForm<z.infer<typeof newProcedureSchema>>({
    resolver: zodResolver(newProcedureSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newProcedureSchema>) => {
    try {
      const response = await createProcedure(data).unwrap();

      if (response.status === 'SUCCESS') {  
        router.push(`/register/procedures/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Acto clinico creado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al crear acto clinico"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newProcedureSchema>>) => {
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
    if (profile) {
      newProcedureForm.setValue('created_by', profile.data.id);
    }
  }, [profile]);

  return (
    <Form {...newProcedureForm}>
      <Header title="Nuevo acto clinico">
        <Button
          type="submit"
          onClick={newProcedureForm.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isCreatingProcedure}
        >
          Crear acto clinico
        </Button>
      </Header>
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
        // ? data-[state=inactive]:hidden se usa para ocultar el contenido de las tabs que no estén activas, esto es necesario porque forceMount hace que el contenido de todas las tabs se monte al mismo tiempo.
        contentClassName="data-[state=inactive]:hidden"
        // ? forceMount se usa para que el contenido de las tabs no se desmonte al cambiar de tab, esto es necesario para que los errores de validación no se pierdan al cambiar de tab.
        forceMount
      />
    </Form>
  );
}
