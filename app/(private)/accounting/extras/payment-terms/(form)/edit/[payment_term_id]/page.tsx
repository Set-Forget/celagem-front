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
import { newPaymentTermSchema } from '../../../schema/payment-terms';
import { useGetPaymentTermQuery, useUpdatePaymentTermMutation } from '@/lib/services/payment-terms';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newPaymentTermSchema),
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
  const params = useParams<{ payment_term_id: string }>();

  const paymentTermId = params.payment_term_id;

  const [updatePaymentTerm, { isLoading: isUpdatingPaymentTerm }] = useUpdatePaymentTermMutation();

  const { data: paymentTermData } = useGetPaymentTermQuery(paymentTermId, { skip: !paymentTermId });

  const form = useForm<z.infer<typeof newPaymentTermSchema>>({
    resolver: zodResolver(newPaymentTermSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newPaymentTermSchema>) => {
    try {
      const response = await updatePaymentTerm({
        id: paymentTermId,
        body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/accounting/extras/payment-terms/${paymentTermId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Término de pago actualizado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar el término de pago"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newPaymentTermSchema>>) => {
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
    if (paymentTermData) {
      form.reset({
        ...paymentTermData,
        created_by: paymentTermData.created_by?.id,
      });
    }
  }, [paymentTermData]);

  return (
    <Form {...form}>
      <Header title="Actualizar paciente">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingPaymentTerm}
        >
          Actualizar término de pago
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
