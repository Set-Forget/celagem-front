'use client';

import CustomSonner from '@/components/custom-sonner';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { House } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import {
  newAttributeGeneralSchema,
  newAttributeSchema,
} from '../../../schema/attributes';
import GeneralForm from '../../components/general-form';

import { FormTabs } from '@/components/form-tabs';
import {
  useGetAttributeQuery,
  useUpdateAttributeMutation,
} from '@/lib/services/attributes';

const tabs = [
  {
    value: 'tab-1',
    label: 'General',
    icon: <House size={16} />,
    content: <GeneralForm />,
    schema: newAttributeGeneralSchema,
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
          onClick={form.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingAttribute}
        >
          Actualizar atributo
        </Button>
      </Header>
      <FormTabs tabs={tabs} />
    </Form>
  );
}
