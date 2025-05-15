'use client';

import CustomSonner from '@/components/custom-sonner';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { get } from 'lodash';
import { House } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateUserMutation } from '@/lib/services/users';
import { newUserGeneralSchema, newUserSchema } from '../../schema/users';
import GeneralForm from '../components/general-form';
import { getFieldPaths } from '../utils';

// ! Se puede unificar con el tabs de abajo.
const tabToFieldsMap = {
  'tab-1': getFieldPaths(newUserGeneralSchema),
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

  const [createUser, { isLoading: isCreatingUser }] = useCreateUserMutation();

  const newUserForm = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role_id: '',
      company_id: '',
      business_units: [],
    },
  });

  const [tab, setTab] = useState('tab-1');

  const onSubmit = async (data: Partial<z.infer<typeof newUserSchema>>) => {
    try {
      const response = await createUser(data).unwrap();
      console.log(" onSubmit ~ response:", response);

      if (response.status === 'success') {
        router.push(`/management/users/${response.data.id}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Usuario creado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      console.error(error);
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al crear usuario"
          variant="error"
        />
      ));
    }
  };

  const onError = (errors: FieldErrors<z.infer<typeof newUserSchema>>) => {
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

  return (
    <Form {...newUserForm}>
      <Header title="Nuevo usuario">
        <Button
          type="submit"
          onClick={newUserForm.handleSubmit(onSubmit, onError)}
          size="sm"
          className="ml-auto"
          loading={isCreatingUser}
        >
          Crear usuario
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
