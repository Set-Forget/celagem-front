import { AsyncSelect } from '@/components/async-select';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { useLazyListUsersQuery } from '@/lib/services/users';
import { Users } from '../../../users/schema/users';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/data-table';
import { useParams } from 'next/navigation';
import { Trash } from 'lucide-react';
import { usersColumns } from '../../../users/components/columns';
import { Button } from '@/components/ui/button';
import { useGetCompanyQuery } from '@/lib/services/companies';
import { newCompanyUserSchema } from '../../schema/companies';

export default function UsersForm() {
  const params = useParams<{ company_id: string }>();
  const companyId = params.company_id;

  const { data: company, isLoading: isCompanyLoading } =
    useGetCompanyQuery(companyId);

  const { setValue, control } =
    useFormContext<z.infer<typeof newCompanyUserSchema>>();

  const [getUsers] = useLazyListUsersQuery();

  const handleGetUsers = async () => {
    try {
      const users = await getUsers().unwrap();
      return users.data.map((user: Users) => ({
        label: user.first_name + ' ' + user.last_name,
        value: user.id,
      }));
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      return [];
    }
  };

  const onSubmitDelete = (data: z.infer<typeof newCompanyUserSchema>) => {
    console.log(data);
  };

  const onSubmitAdd = () => {
    console.log('Add user');
  };

  const columnsUsersExtended = [
    ...usersColumns.filter((column) => column.id !== 'select'),
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <Trash
          className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
          size={20}
          aria-hidden="true"
          onClick={() =>
            // TODO: Implement delete functionality
            console.log('Delete patient:', row.original)
          }
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <FormField
          control={control}
          name="user_id"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              {/* <FormLabel>Usuario</FormLabel> */}
              <FormControl>
                <AsyncSelect<{ label: string; value: string }, string>
                  label="Usuario"
                  triggerClassName="!w-full"
                  placeholder="Seleccionar usuario"
                  fetcher={handleGetUsers}
                  getDisplayValue={(item) => item.label}
                  getOptionValue={(item) => item.value}
                  renderOption={(item) => <div>{item.label}</div>}
                  onChange={field.onChange}
                  value={field.value}
                  noResultsMessage="No se encontraron usuarios"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="default"
          // className="mt-2"
          onClick={() => {
            onSubmitAdd();
          }}
        >
          Agregar
        </Button>
      </div>
      <Separator />
      <div className="px-4 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Usuarios</h2>
        </div>
        <DataTable
          data={company?.users || []}
          columns={columnsUsersExtended}
          pagination={false}
        />
      </div>
    </div>
  );
}


