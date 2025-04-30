'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetProfileQuery } from '@/lib/services/auth';

import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { Building, House, Shield, Users, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import GeneralForm from '../components/general-form';
import { getFieldPaths } from '../utils';
import { newMedicalExamGeneralSchema, newMedicalExamSchema } from '../../schema/medical-exams';
import { useCreateMedicalExamMutation } from '@/lib/services/medical-exams';


// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newMedicalExamGeneralSchema),
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
];

export default function Page() {
  const router = useRouter();

  const [createMedicalExam, { isLoading: isCreatingMedicalExam }] =
    useCreateMedicalExamMutation();
  const { data: profile } = useGetProfileQuery();

  const newMedicalExamForm = useForm<z.infer<typeof newMedicalExamSchema>>({
    resolver: zodResolver(newMedicalExamSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newMedicalExamSchema>) => {
    try {
      const response = await createMedicalExam(data).unwrap();

      if (response.status === 'SUCCESS') {

        router.push(`/register/medical-exams/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Examen médico creado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al crear examen médico"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newMedicalExamSchema>>) => {
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
      newMedicalExamForm.setValue('created_by', profile.data.id);
    }
  }, [profile]);

  return (
    <Form {...newMedicalExamForm}>
      <Header title="Nuevo examen médico">
        <Button
          type="submit"
          onClick={newMedicalExamForm.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isCreatingMedicalExam}
        >
          Crear examen médico
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
