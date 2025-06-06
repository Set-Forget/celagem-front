'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { House, Stethoscope, Users } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


import { useGetBusinessUnitQuery, useUpdateBusinessUnitMutation } from '@/lib/services/business-units';
import { newBusinessUnitGeneralSchema, newBusinessUnitPatientSchema, newBusinessUnitSchema, newBusinessUnitUserSchema } from '../../../schema/business-units';
import GeneralForm from '../../components/general-form';
import PatientsForm from '../../components/patients-form';
import UsersForm from '../../components/users-form';
import { getFieldPaths } from '../../utils';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newBusinessUnitGeneralSchema),
  'tab-2': getFieldPaths(newBusinessUnitUserSchema),
  'tab-3': getFieldPaths(newBusinessUnitPatientSchema),
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
    label: 'Usuarios',
    icon: (
      <Users
        className="mr-1.5"
        size={16}
      />
    ),
    content: <UsersForm />,
  },
  {
    value: 'tab-3',
    label: 'Pacientes',
    icon: (
      <Stethoscope
        className="mr-1.5"
        size={16}
      />
    ),
    content: <PatientsForm />,
  },

];

export default function Page() {
  const router = useRouter();
  const params = useParams<{ business_unit_id: string }>();

  const businessUnitId = params.business_unit_id;

  const [updateBusinessUnit, { isLoading: isUpdatingBusinessUnit }] =
    useUpdateBusinessUnitMutation();

  const { data: businessUnit } = useGetBusinessUnitQuery(businessUnitId, { skip: !businessUnitId });

  const form = useForm<z.infer<typeof newBusinessUnitSchema>>({
    resolver: zodResolver(newBusinessUnitSchema),
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: z.infer<typeof newBusinessUnitSchema>) => {
    try {
      const response = await updateBusinessUnit({
        Id: businessUnitId,
        Body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/management/business-units/${businessUnitId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Paciente actualizado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar el paciente"
          variant="error"
        />
      ));
    }
  };

  const onError = (
    errors: FieldErrors<z.infer<typeof newBusinessUnitSchema>>
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
    if (businessUnit) {
      form.reset({
        ...businessUnit,
        created_by: businessUnit.created_by?.id,
      });
    }
  }, [businessUnit]);

  return (
    <Form {...form}>
      <Header title="Actualizar unidad de negocio">
        {tab === 'tab-1' && <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingBusinessUnit}
        >
          Actualizar unidad de negocio
        </Button>}
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
