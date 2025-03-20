'use client';

import {
  Bolt,
  // CalendarIcon,
  Check,
  // CheckIcon,
  ChevronsUpDown,
  Contact,
  HousePlug,
  Microscope,
  Stethoscope,
  Trash,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

// import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
// import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Header from '@/components/header';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  // Box,
  House,
} from 'lucide-react';
// import { MultiSelect } from '@/components/multi-select';
import {
  jobPositionConsumedSchema,
  materialConsumedSchema,
  medicalExamConsumedSchema,
  procedureReceiptSchema,
  serviceConsumedSchema,
} from '@/app/(private)/register/procedures/schema/procedure';

import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import { jobPositionsColumns } from '../../job-positions/components/columns';
import { servicesColumns } from '../../services/components/columns';
import { medicalExamsColumns } from '../../medical-exams/components/columns';
import { materialsColumns } from '../../materials/components/columns';
import { JobPosition } from '../../job-positions/schema/job-position';
import { proceduresMock } from '../mocks/proceduresMock';
import { BusinessUnit, businessUnitSchema } from '../schema/business-units';
import {
  businessUnitPatientSchema,
  businessUnitUserSchema,
} from '@/lib/schemas/business-units';
import { useListPatientsQuery } from '@/lib/services/patients';
import { useLazyListUsersQuery } from '@/lib/services/users';
import { usersColumns } from '../../users/components/columns';

export default function NewBusinessUnitPage({
  businessUnit,
}: {
  businessUnit: BusinessUnit;
}) {
  let defaultBusinessUnit = {
    users: [],
    patients: [],
  } as unknown as BusinessUnit;

  if (businessUnit) {
    defaultBusinessUnit = { ...businessUnit };
  }

  const [listUsers, { data: usersList, isLoading: isLoadingUsers }] =
    useLazyListUsersQuery();

  const { data: patientsList, isLoading: isLoadingPatients } =
    useListPatientsQuery();

  const newBusinessUnitForm = useForm<z.infer<typeof businessUnitSchema>>({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: defaultBusinessUnit,
  });

  const onSubmit = (data: z.infer<typeof businessUnitSchema>) => {
    console.log(data);
  };

  // USERS

  const userForm = useForm<z.infer<typeof businessUnitUserSchema>>({
    resolver: zodResolver(businessUnitUserSchema),
  });

  const userOnSubmit = (data: z.infer<typeof businessUnitUserSchema>) => {
    newBusinessUnitForm.setValue('users', [
      ...newBusinessUnitForm.watch('users'),
      data,
    ]);
    userForm.resetField('id');
    userForm.resetField('email');
  };

  const users = usersList ? usersList.data.map((user) => ({
    label: user.email,
    value: user.id,
  })) : [];

  const usersColumnsExtended = [
    ...usersColumns.filter((column) => column.id !== 'select'),
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <Trash
          className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
          size={20}
          aria-hidden="true"
          onClick={() =>
            newBusinessUnitForm.setValue(
              'users',
              newBusinessUnitForm
                .watch('users')
                .filter((user) => user.id !== row.original.id)
            )
          }
        />
      ),
    },
  ];

  // PATIENTS

  // const patientForm = useForm<z.infer<typeof businessUnitPatientSchema>>({
  //   resolver: zodResolver(businessUnitPatientSchema),
  // });

  // const patientOnSubmit = (data: z.infer<typeof businessUnitPatientSchema>) => {
  //   newBusinessUnitForm.setValue('patients', [
  //     ...newBusinessUnitForm.watch('patients'),
  //     data,
  //   ]);

  //   patientForm.resetField('id');
  //   patientForm.resetField('first_name');
  //   patientForm.resetField('last_name');
  // };

  // const patientsColumnsExtended = [
  //   ...patientsColumns.filter((column) => column.id !== 'select'),
  //   {
  //     id: 'actions',
  //     cell: ({ row }: { row: any }) => (
  //       <Trash
  //         className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
  //         size={20}
  //         aria-hidden="true"
  //         onClick={() =>
  //           newBusinessUnitForm.setValue(
  //             'patients',
  //             newBusinessUnitForm
  //               .watch('patients')
  //               .filter((patient) => patient.id !== row.original.id)
  //           )
  //         }
  //       />
  //     ),
  //   },
  // ];

  return (
    <Form {...newBusinessUnitForm}>
      <Header
        title={
          businessUnit ? 'Editar unidad de negocio' : 'Nueva unidad de negocio'
        }
      >
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="submit"
            onClick={newBusinessUnitForm.handleSubmit(onSubmit)}
            size="sm"
          >
            {businessUnit ? 'Guardar cambios' : 'Crear unidad de negocio'}
          </Button>
        </div>
      </Header>
      <Tabs
        className="mt-4"
        defaultValue="tab-1"
      >
        <ScrollArea>
          <TabsList className="relative justify-start !pl-4 h-auto w-full gap-1 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
            <TabsTrigger
              value="tab-1"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <House
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              General
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <User
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Usuarios
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Stethoscope
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Pacientes
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <TabsContent
          value="tab-1"
          className="m-0 p-1"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newBusinessUnitForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nombre de la unidad de negocio"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el nombre de la unidad de negocio.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newBusinessUnitForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Descripción</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción de la unidad de negocio"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será la descripción de la unidad de negocio.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-2"
          className="m-0 pt-1"
        >
          <FormLabel className="w-fit p-4">Usuarios</FormLabel>
          <div className="grid grid-cols-3 gap-4  p-4">
            <FormField
              control={userForm.control}
              name="id"
              render={({ field }) => (
                <div className="flex flex-row gap-4 items-center justify-center">
                  <FormItem className="flex flex-col w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between pl-3 font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? users.find((user) => field.value === user.value)
                                  ?.label
                              : 'Selecciona un usuario'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar usuarios..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron usuarios.
                            </CommandEmpty>
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  value={user.label}
                                  key={user.value}
                                  onSelect={() => {
                                    userForm.setValue('id', user.value);
                                  }}
                                  disabled={newBusinessUnitForm
                                    .watch('users')
                                    .map((user) => user.id)
                                    .includes(user.value)}
                                >
                                  {user.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === user.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                </div>
              )}
            />
            <Button
              type="submit"
              size="sm"
              // className="mt-2"
              onClick={() => {
                userOnSubmit(userForm.getValues());
              }}
            >
              Agregar
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-full">
            <DataTable
              data={users
                .filter((user) =>
                  newBusinessUnitForm
                    .watch('users')
                    .map((user) => user.id)
                    .includes(user.id)
                )
                .map((user) => ({
                  ...user,
                  qty:
                    newBusinessUnitForm
                      .watch('users')
                      .find((user) => user.id === user.id)?.qty || 0,
                }))}
              columns={usersColumnsExtended}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-3"
          className="m-0 pt-2"
        >
          <FormLabel className="w-fit p-4">Pacientes</FormLabel>
          {/* <div className="grid grid-cols-3 gap-4  p-4">
            <FormField
              control={patientForm.control}
              name="id"
              render={({ field }) => (
                <div className="flex flex-row gap-4 items-center justify-center">
                  <FormItem className="flex flex-col w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              'w-full justify-between pl-3 font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value
                              ? patients.find(
                                  (patient) => field.value === patient.value
                                )?.label
                              : 'Selecciona un paciente'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar pacientes..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron pacientes.
                            </CommandEmpty>
                            <CommandGroup>
                              {patients.map((patient) => (
                                <CommandItem
                                  value={patient.label}
                                  key={patient.value}
                                  onSelect={() => {
                                    patientForm.setValue('id', patient.value);
                                  }}
                                  disabled={newBusinessUnitForm
                                    .watch('patients')
                                    .map((patient) => patient.id)
                                    .includes(patient.value)}
                                >
                                  {patient.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === patient.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                </div>
              )}
            />
            <Button
              type="submit"
              size="sm"
              // className="mt-2"
              onClick={() => {
                patientOnSubmit(patientForm.getValues());
              }}
            >
              Agregar
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-full">
            <DataTable
              data={patientsMock
                .filter((patient) =>
                  newBusinessUnitForm
                    .watch('patients')
                    .map((patient) => patient.id)
                    .includes(patient.id)
                )
                .map((patient) => ({
                  ...patient,
                  qty:
                    newBusinessUnitForm
                      .watch('patients')
                      .find((patient) => patient.id === patient.id)?.qty || 0,
                }))}
              columns={patientsColumnsExtended}
            />
          </div> */}
        </TabsContent>
      </Tabs>
    </Form>
  );
}


