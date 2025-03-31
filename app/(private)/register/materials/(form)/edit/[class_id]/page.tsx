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
  newMaterialCostSchema,
  newMaterialGeneralSchema,
  newMaterialPurchaseSchema,
  newMaterialSchema,
} from '../../../schema/materials';
import {
  useGetClassQuery,
  useUpdateClassMutation,
} from '@/lib/services/classes';
import CostForm from '../../components/cost-form';
import PurchaseForm from '../../components/purchase-form';
import { useGetMaterialQuery, useUpdateMaterialMutation } from '@/lib/services/materials';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newMaterialGeneralSchema),
  'tab-2': getFieldPaths(newMaterialCostSchema),
  'tab-3': getFieldPaths(newMaterialPurchaseSchema),
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
    label: 'Costo',
    icon: (
      <House
        className="mr-1.5"
        size={16}
      />
    ),
    content: <CostForm />,
  },
  {
    value: 'tab-3',
    label: 'Compra',
    icon: (
      <House
        className="mr-1.5"
        size={16}
      />
    ),
    content: <PurchaseForm />,
  },
];

export default function Page() {
  const router = useRouter();
  const params = useParams<{ material_id: string }>();

  const materialId = params.material_id;

  const [updateMaterial, { isLoading: isUpdatingMaterial }] =
    useUpdateMaterialMutation();

  const { data: materialData } = useGetMaterialQuery(materialId, {
    skip: !materialId,
  });  

  const form = useForm<z.infer<typeof newMaterialSchema>>({
    resolver: zodResolver(newMaterialSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newMaterialSchema>) => {
    try {
      const response = await updateMaterial({
        id: materialId,
        body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/register/materials/${materialId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Material actualizado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar el material"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newMaterialSchema>>) => {
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
    if (materialData) {
      form.reset({
        ...materialData,
        created_by: materialData.created_by?.id,
      });
    }
  }, [materialData]);  

  return (
    <Form {...form}>
      <Header title="Actualizar material">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingMaterial}
        >
          Actualizar material
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
