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
  newInternalTransferSchema,
  newInternalTransferGeneralSchema,
} from '../../../schema/internal-transfers';

import {
  useGetInternalTransferQuery,
  useUpdateInternalTransferMutation,
} from '@/lib/services/internal-transfers';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newInternalTransferGeneralSchema),
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
  const params = useParams<{ internal_transfer_id: string }>();

  const internalTransferId = params.internal_transfer_id;

  const [updateInternalTransfer, { isLoading: isUpdatingInternalTransfer }] =
    useUpdateInternalTransferMutation();

  const { data: internalTransferData } = useGetInternalTransferQuery(
    internalTransferId,
    {
      skip: !internalTransferId,
    }
  );

  const form = useForm<z.infer<typeof newInternalTransferSchema>>({
    resolver: zodResolver(newInternalTransferSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (
    data: z.infer<typeof newInternalTransferSchema>
  ) => {
    try {
      const response = await updateInternalTransfer({
        id: internalTransferId,
        body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/inventory/internal-transfers/${internalTransferId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Transferencia interna actualizada exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar la trasnferencia interna"
          variant="error"
        />
      ));
    }
  };

  const onError = (
    errors: FieldErrors<z.infer<typeof newInternalTransferSchema>>
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
    if (internalTransferData) {
      form.reset({
        ...internalTransferData,
        created_by: internalTransferData.created_by?.id,
        source_location: internalTransferData.source_location?.id,
        destination_location: internalTransferData.destination_location?.id,
        items: internalTransferData.items.map((item) => ({
          ...item,
          source_location: item.source_location?.id,
          destination_location: item.destination_location?.id,
          product_uom: item.product_uom?.id,
        })),
      });
    }
  }, [internalTransferData]);

  return (
    <Form {...form}>
      <Header title="Actualizar transferencia interna">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingInternalTransfer}
        >
          Actualizar transferencia interna
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
