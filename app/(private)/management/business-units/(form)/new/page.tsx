'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useGetProfileQuery } from '@/lib/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { House } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateBusinessUnitMutation } from '@/lib/services/business-units';
import { newBusinessUnitGeneralSchema, newBusinessUnitSchema } from '../../schema/business-units';
import GeneralForm from '../components/general-form';
import { getFieldPaths } from '../utils';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newBusinessUnitGeneralSchema),
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

  const [createBusinessUnit, { isLoading: isCreatingBusinessUnit }] =
    useCreateBusinessUnitMutation();
  const { data: profile } = useGetProfileQuery();

  const newBusinessUnitForm = useForm<z.infer<typeof newBusinessUnitSchema>>({
    resolver: zodResolver(newBusinessUnitSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newBusinessUnitSchema>) => {
    try {
      const response = await createBusinessUnit(data).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/management/business-units/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Unidad de negocio creado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al crear unidad de negocio"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newBusinessUnitSchema>>) => {
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
      newBusinessUnitForm.setValue('created_by', profile.data.id);
    }
  }, [profile]);

  return (
    <Form {...newBusinessUnitForm}>
      <Header title="Nueva unidad de negocio">
        <Button
          type="submit"
          onClick={newBusinessUnitForm.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isCreatingBusinessUnit}
        >
          Crear unidad de negocio
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
