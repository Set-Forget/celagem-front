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

import { FormTabs } from '@/components/form-tabs';
import {
  useGetJobPositionQuery,
  useUpdateJobPositionMutation,
} from '@/lib/services/job-positions';
import {
  newJobPositionGeneralSchema,
  newJobPositionSchema,
} from '../../../schema/job-positions';
import GeneralForm from '../../components/general-form';

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
    schema: newJobPositionGeneralSchema,
  },
];

export default function Page() {
  const router = useRouter();
  const params = useParams<{ job_position_id: string }>();

  const jobPositionId = params.job_position_id;

  const [updateJobPosition, { isLoading: isUpdatingJobPosition }] =
    useUpdateJobPositionMutation();

  const { data: jobPositionData } = useGetJobPositionQuery(jobPositionId, {
    skip: !jobPositionId,
  });

  const form = useForm<z.infer<typeof newJobPositionSchema>>({
    resolver: zodResolver(newJobPositionSchema),
  });

  const onSubmit = async (data: z.infer<typeof newJobPositionSchema>) => {
    try {
      const response = await updateJobPosition({
        id: jobPositionId,
        body: data,
      }).unwrap();

      if (response.status === 'SUCCESS') {
        router.push(`/register/job-positions/${jobPositionId}`);
        toast.custom((t) => (
          <CustomSonner
            t={t}
            description="Puesto de trabajo actualizado exitosamente"
            variant="success"
          />
        ));
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomSonner
          t={t}
          description="Error al actualizar el puesto de trabajo"
          variant="error"
        />
      ));
    }
  };

  useEffect(() => {
    if (jobPositionData) {
      form.reset({
        ...jobPositionData,
      });
    }
  }, [jobPositionData]);

  return (
    <Form {...form}>
      <Header title="Actualizar puesto de trabajo">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          size="sm"
          className="ml-auto"
          loading={isUpdatingJobPosition}
        >
          Actualizar puesto de trabajo
        </Button>
      </Header>
      <FormTabs tabs={tabs} />
    </Form>
  );
}
