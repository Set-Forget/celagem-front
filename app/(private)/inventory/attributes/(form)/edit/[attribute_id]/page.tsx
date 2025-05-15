'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

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
  newAttributeGeneralSchema,
  newAttributeSchema,
} from '../../../schema/attributes';

import {
  useGetAttributeQuery,
  useUpdateAttributeMutation,
} from '@/lib/services/attributes';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newAttributeGeneralSchema),
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
  const params = useParams<{ attribute_id: string }>();

  const attributeId = params.attribute_id;

  const [updateMaterial, { isLoading: isUpdatingAttribute }] =
    useUpdateAttributeMutation();

  const { data: attributeData } = useGetAttributeQuery(attributeId, {
    skip: !attributeId,
  });

  const form = useForm<z.infer<typeof newAttributeSchema>>({
    resolver: zodResolver(newAttributeSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newAttributeSchema>) => {
    try {
      const response = await updateMaterial({
        id: attributeId,
        body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/inventory/attributes/${attributeId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Atributo actualizado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar el atributo"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newAttributeSchema>>) => {
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
    if (attributeData) {
      form.reset({
        ...attributeData,
        created_by: attributeData.created_by?.id,
      });
    }
  }, [attributeData]);

  return (
    <Form {...form}>
      <Header title="Actualizar atributo">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingAttribute}
        >
          Actualizar atributo
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
