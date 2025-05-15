'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { House } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useGetClassQuery, useUpdateClassMutation } from '@/lib/services/classes';
import GeneralForm from '../../components/general-form';
import { getFieldPaths } from '../../utils';
import { newClassGeneralSchema, newClassSchema } from '@/app/(private)/management/classes/schema/classes';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newClassGeneralSchema),
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
  const params = useParams<{ class_id: string }>();

  const classId = params.class_id;

  const [updateClass, { isLoading: isUpdatingClass }] = useUpdateClassMutation();

  const { data: classData } = useGetClassQuery(classId, { skip: !classId });

  const form = useForm<z.infer<typeof newClassSchema>>({
    resolver: zodResolver(newClassSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newClassSchema>) => {
    try {
      const response = await updateClass({
        id: classId,
        body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/management/classes/${classId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Clase actualizada exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar la clase"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newClassSchema>>) => {
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
    if (classData) {
      form.reset({
        ...classData,
      });
    }
  }, [classData]);

  return (
    <Form {...form}>
      <Header title="Actualizar paciente">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingClass}
        >
          Actualizar clase
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
