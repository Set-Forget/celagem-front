'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetProfileQuery } from '@/lib/services/auth';
import {
  useCreatePatientMutation,
  useGetPatientQuery,
  useUpdatePatientMutation,
} from '@/lib/services/patients';
import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { Building, House, Shield, Users, Wallet } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import GeneralForm from '../../components/general-form';
import { getFieldPaths } from '../../utils';
import {
  newMedicalExamGeneralSchema,
  newMedicalExamSchema,
} from '../../../schema/medical-exams';

import {
  useGetMedicalExamQuery,
  useUpdateMedicalExamMutation,
} from '@/lib/services/medical-exams';

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
  const params = useParams<{ medical_exam_id: string }>();

  const medicalExamId = params.medical_exam_id;

  const [updateMedicalExam, { isLoading: isUpdatingMedicalExam }] =
    useUpdateMedicalExamMutation();

  const { data: medicalExamData } = useGetMedicalExamQuery(medicalExamId, {
    skip: !medicalExamId,
  });

  const form = useForm<z.infer<typeof newMedicalExamSchema>>({
    resolver: zodResolver(newMedicalExamSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newMedicalExamSchema>) => {
    try {
      const response = await updateMedicalExam({
        id: medicalExamId,
        body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/register/medical-exams/${medicalExamId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Examen médico actualizado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar el examen médico"
          variant="error"
        />
      ));
    }
  };

  const onError = (
    errors: FieldErrors<z.infer<typeof newMedicalExamSchema>>
  ) => {
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
    if (medicalExamData) {
      form.reset({
        ...medicalExamData,
        created_by: medicalExamData.created_by?.id,
      });
    }
  }, [medicalExamData]);

  return (
    <Form {...form}>
      <Header title="Actualizar examen médico">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingMedicalExam}
        >
          Actualizar examen médico
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
