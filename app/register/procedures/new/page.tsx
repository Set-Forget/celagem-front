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
  Trash,
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
} from '@/app/register/procedures/schema/procedure';
import { jobPositionsMock } from '../../job-positions/mocks/jobPositionsMock';
import { servicesMock } from '../../services/mocks/servicesMock';
import { medicalExamsMock } from '../../medical-exams/mocks/medicalExamsMock';
import { materialsMock } from '../../materials/mocks/materials';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import { jobPositionsColumns } from '../../job-positions/components/columns';
import { servicesColumns } from '../../services/components/columns';
import { medicalExamsColumns } from '../../medical-exams/components/columns';
import { materialsColumns } from '../../materials/components/columns';
import { JobPosition } from '../../job-positions/schema/job-position';

const services = servicesMock.map((service) => ({
  label: service.code,
  value: service.id,
}));

const medicalExams = medicalExamsMock.map((medicalExam) => ({
  label: medicalExam.code + ' - ' + medicalExam.description,
  value: medicalExam.id,
}));

const materials = materialsMock.map((material) => ({
  label: material.code + ' - ' + material.name,
  value: material.id,
}));

export default function NewProcedureReceiptPage() {
  const newProcedureReceiptForm = useForm<
    z.infer<typeof procedureReceiptSchema>
  >({
    resolver: zodResolver(procedureReceiptSchema),
    defaultValues: {
      job_description: [],
      services: [],
      medical_exams: [],
      materials: [],
    },
  });

  const onSubmit = (data: z.infer<typeof procedureReceiptSchema>) => {
    console.log(data);
  };

  // Schemas

  const procedureSchemas = [
    'APORTANTE DE SEMEN',
    'GESTANTE',
    'OVO-APORTANTE',
  ] as const;
  //JOB POSITONS

  const jobPositionForm = useForm<z.infer<typeof jobPositionConsumedSchema>>({
    resolver: zodResolver(jobPositionConsumedSchema),
  });

  const jobPositionOnSubmit = (
    data: z.infer<typeof jobPositionConsumedSchema>
  ) => {
    newProcedureReceiptForm.setValue('job_description', [
      ...newProcedureReceiptForm.watch('job_description'),
      data,
    ]);
    jobPositionForm.resetField('id');
    jobPositionForm.resetField('qty');
  };

  const jobPositions = jobPositionsMock.map((jobPosition) => ({
    label: jobPosition.code,
    value: jobPosition.id,
  }));

  const jobPositionsColumnsExtended = [
    ...jobPositionsColumns.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({ row }: { row: { original: JobPosition } }) => (
        <div className="capitalize flex gap-1">
          <div>{row.original.qty}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <Trash
          className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
          size={20}
          aria-hidden="true"
          onClick={() =>
            newProcedureReceiptForm.setValue(
              'job_description',
              newProcedureReceiptForm
                .watch('job_description')
                .filter((job) => job.id !== row.original.id)
            )
          }
        />
      ),
    },
  ];

  //SERVICES

  const serviceForm = useForm<z.infer<typeof serviceConsumedSchema>>({
    resolver: zodResolver(serviceConsumedSchema),
  });

  const serviceOnSubmit = (data: z.infer<typeof serviceConsumedSchema>) => {
    newProcedureReceiptForm.setValue('services', [
      ...newProcedureReceiptForm.watch('services'),
      data,
    ]);

    serviceForm.resetField('id');
    serviceForm.resetField('qty');
  };

  const servicesColumnsExtended = [
    ...servicesColumns.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({ row }: { row: any }) => (
        <div className="capitalize flex gap-1">
          <div>{row.original.qty}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <Trash
          className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
          size={20}
          aria-hidden="true"
          onClick={() =>
            newProcedureReceiptForm.setValue(
              'services',
              newProcedureReceiptForm
                .watch('services')
                .filter((job) => job.id !== row.original.id)
            )
          }
        />
      ),
    },
  ];

  //Medical Exams

  const medicalExamForm = useForm<z.infer<typeof medicalExamConsumedSchema>>({
    resolver: zodResolver(medicalExamConsumedSchema),
  });

  const medicalExamOnSubmit = (
    data: z.infer<typeof medicalExamConsumedSchema>
  ) => {
    newProcedureReceiptForm.setValue('medical_exams', [
      ...newProcedureReceiptForm.watch('medical_exams'),
      data,
    ]);

    medicalExamForm.resetField('id');
    medicalExamForm.resetField('qty');
  };

  const medicalExamsColumnsExtended = [
    ...medicalExamsColumns.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({ row }: { row: any }) => (
        <div className="capitalize flex gap-1">
          <div>{row.original.qty}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <Trash
          className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
          size={20}
          aria-hidden="true"
          onClick={() =>
            newProcedureReceiptForm.setValue(
              'medical_exams',
              newProcedureReceiptForm
                .watch('medical_exams')
                .filter((job) => job.id !== row.original.id)
            )
          }
        />
      ),
    },
  ];
  //Materials

  const materialForm = useForm<z.infer<typeof materialConsumedSchema>>({
    resolver: zodResolver(materialConsumedSchema),
  });

  const materialOnSubmit = (data: z.infer<typeof materialConsumedSchema>) => {
    newProcedureReceiptForm.setValue('materials', [
      ...newProcedureReceiptForm.watch('materials'),
      data,
    ]);

    materialForm.resetField('id');
    materialForm.resetField('qty');
  };

  const materialsColumnsExtended = [
    ...materialsColumns.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({ row }: { row: any }) => (
        <div className="capitalize flex gap-1">
          <div>{row.original.qty}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: { row: any }) => (
        <Trash
          className="-ms-0.5 me-1.5 cursor-pointer hover:text-red-500"
          size={20}
          aria-hidden="true"
          onClick={() =>
            newProcedureReceiptForm.setValue(
              'materials',
              newProcedureReceiptForm
                .watch('materials')
                .filter((job) => job.id !== row.original.id)
            )
          }
        />
      ),
    },
  ];

  return (
    <Form {...newProcedureReceiptForm}>
      <Header title="Nuevo acto clinico">
        <div className="flex justify-end gap-2 ml-auto">
          {/* <Button
            type="button"
            variant="ghost"
            size="sm"
          >
            Previsualizar
          </Button> */}
          <Button
            type="submit"
            onClick={newProcedureReceiptForm.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear acto clinico
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
              <Contact
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Puestos de trabajo
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <HousePlug
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Servicios
            </TabsTrigger>
            <TabsTrigger
              value="tab-4"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Microscope
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Examenes medicos
            </TabsTrigger>
            <TabsTrigger
              value="tab-5"
              className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
            >
              <Bolt
                className="-ms-0.5 me-1.5"
                size={16}
                aria-hidden="true"
              />
              Materiales
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
              control={newProcedureReceiptForm.control}
              name="cups_code"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Código CUP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="890223"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el codigo CUP al que se asociará el acto clinico.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={newProcedureReceiptForm.control}
              name="schema"
              render={({ field }) => (
                <div className="flex flex-col gap-4 items-start justify-center">
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="w-fit">Esquema</FormLabel>
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
                              ? procedureSchemas.find(
                                (schema) => field.value === schema
                              )
                              : 'Selecciona un esquema'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar esquema..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron esquemas.
                            </CommandEmpty>
                            <CommandGroup>
                              {procedureSchemas.map((schema) => (
                                <CommandItem
                                  value={schema}
                                  key={schema}
                                  onSelect={() => {
                                    newProcedureReceiptForm.setValue(
                                      'schema',
                                      schema
                                    );
                                  }}
                                >
                                  {schema}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === schema
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
                    <FormDescription>
                      Esta será la descripcion asociada al acto clinico.
                    </FormDescription>
                  </FormItem>
                </div>
              )}
            />
            <FormField
              control={newProcedureReceiptForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full p-4">
                  <FormLabel className="w-fit">Descripcion</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripcion del acto clinico"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será la descripcion asociada al acto clinico.
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
          <FormLabel className="w-fit p-4">Puestos de trabajo</FormLabel>
          <div className="grid grid-cols-3 gap-4  p-4">
            <FormField
              control={jobPositionForm.control}
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
                              ? jobPositions.find(
                                (jobPosition) =>
                                  field.value === jobPosition.value
                              )?.label
                              : 'Selecciona un puesto de trabajo'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar puestos de trabajo..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron puestos de trabajo.
                            </CommandEmpty>
                            <CommandGroup>
                              {jobPositions.map((jobPosition) => (
                                <CommandItem
                                  value={jobPosition.label}
                                  key={jobPosition.value}
                                  onSelect={() => {
                                    jobPositionForm.setValue(
                                      'id',
                                      jobPosition.value
                                    );
                                  }}
                                  disabled={newProcedureReceiptForm
                                    .watch('job_description')
                                    .map((job) => job.id)
                                    .includes(jobPosition.value)}
                                >
                                  {jobPosition.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === jobPosition.value
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
            <FormField
              control={jobPositionForm.control}
              name="qty"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <Input
                    placeholder="Cantidad"
                    type="tel"
                    {...field}
                    value={jobPositionForm.getValues().qty ?? ''}
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              // className="mt-2"
              onClick={() => {
                jobPositionOnSubmit(jobPositionForm.getValues());
              }}
            >
              Agregar
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-full">
            <DataTable
              data={jobPositionsMock
                .filter((jobPosition) =>
                  newProcedureReceiptForm
                    .watch('job_description')
                    .map((job) => job.id)
                    .includes(jobPosition.id)
                )
                .map((jobPosition) => ({
                  ...jobPosition,
                  qty:
                    newProcedureReceiptForm
                      .watch('job_description')
                      .find((job) => job.id === jobPosition.id)?.qty || 0,
                }))}
              columns={jobPositionsColumnsExtended}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-3"
          className="m-0 pt-1"
        >
          <FormLabel className="w-fit p-4">Servicios</FormLabel>
          <div className="grid grid-cols-3 gap-4  p-4">
            <FormField
              control={serviceForm.control}
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
                              ? services.find(
                                (service) => field.value === service.value
                              )?.label
                              : 'Selecciona un servicio'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar servicios..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron servicios.
                            </CommandEmpty>
                            <CommandGroup>
                              {services.map((service) => (
                                <CommandItem
                                  value={service.label}
                                  key={service.value}
                                  onSelect={() => {
                                    serviceForm.setValue('id', service.value);
                                  }}
                                  disabled={newProcedureReceiptForm
                                    .watch('services')
                                    .map((service) => service.id)
                                    .includes(service.value)}
                                >
                                  {service.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === service.value
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
            <FormField
              control={serviceForm.control}
              name="qty"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <Input
                    placeholder="Cantidad"
                    type="tel"
                    {...field}
                    value={serviceForm.getValues().qty ?? ''}
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              // className="mt-2"
              onClick={() => {
                serviceOnSubmit(serviceForm.getValues());
              }}
            >
              Agregar
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-full">
            <DataTable
              data={servicesMock
                .filter((service) =>
                  newProcedureReceiptForm
                    .watch('services')
                    .map((service) => service.id)
                    .includes(service.id)
                )
                .map((service) => ({
                  ...service,
                  qty:
                    newProcedureReceiptForm
                      .watch('services')
                      .find((service) => service.id === service.id)?.qty || 0,
                }))}
              columns={servicesColumnsExtended}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-4"
          className="m-0 pt-1"
        >
          <FormLabel className="w-fit p-4">Examenes Medicos</FormLabel>
          <div className="grid grid-cols-3 gap-4  p-4">
            <FormField
              control={medicalExamForm.control}
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
                              ? medicalExams.find(
                                (medicalExam) =>
                                  field.value === medicalExam.value
                              )?.label
                              : 'Selecciona un examen medico'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar examenes medicos..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron examenes medicos.
                            </CommandEmpty>
                            <CommandGroup>
                              {medicalExams.map((medicalExam) => (
                                <CommandItem
                                  value={medicalExam.label}
                                  key={medicalExam.value}
                                  onSelect={() => {
                                    medicalExamForm.setValue(
                                      'id',
                                      medicalExam.value
                                    );
                                  }}
                                  disabled={newProcedureReceiptForm
                                    .watch('medical_exams')
                                    .map((medicalExam) => medicalExam.id)
                                    .includes(medicalExam.value)}
                                >
                                  {medicalExam.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === medicalExam.value
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
            <FormField
              control={medicalExamForm.control}
              name="qty"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <Input
                    placeholder="Cantidad"
                    type="tel"
                    {...field}
                    value={medicalExamForm.getValues().qty ?? ''}
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              // className="mt-2"
              onClick={() => {
                medicalExamOnSubmit(medicalExamForm.getValues());
              }}
            >
              Agregar
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-full">
            <DataTable
              data={medicalExamsMock
                .filter((medicalExam) =>
                  newProcedureReceiptForm
                    .watch('medical_exams')
                    .map((medicalExam) => medicalExam.id)
                    .includes(medicalExam.id)
                )
                .map((medicalExam) => ({
                  ...medicalExam,
                  qty:
                    newProcedureReceiptForm
                      .watch('medical_exams')
                      .find((medicalExam) => medicalExam.id === medicalExam.id)
                      ?.qty || 0,
                }))}
              columns={medicalExamsColumnsExtended}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-5"
          className="m-0 pt-1"
        >
          <FormLabel className="w-fit p-4">Materiales</FormLabel>
          <div className="grid grid-cols-3 gap-4  p-4">
            <FormField
              control={materialForm.control}
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
                              ? materials.find(
                                (material) => field.value === material.value
                              )?.label
                              : 'Selecciona un material'}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Command>
                          <CommandInput
                            placeholder="Buscar materiales..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>
                              No se encontraron materiales.
                            </CommandEmpty>
                            <CommandGroup>
                              {materials.map((material) => (
                                <CommandItem
                                  value={material.label}
                                  key={material.value}
                                  onSelect={() => {
                                    materialForm.setValue('id', material.value);
                                  }}
                                  disabled={newProcedureReceiptForm
                                    .watch('materials')
                                    .map((material) => material.id)
                                    .includes(material.value)}
                                >
                                  {material.label}
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === material.value
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
            <FormField
              control={materialForm.control}
              name="qty"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <Input
                    placeholder="Cantidad"
                    type="tel"
                    {...field}
                    value={materialForm.getValues().qty ?? ''}
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              // className="mt-2"
              onClick={() => {
                materialOnSubmit(materialForm.getValues());
              }}
            >
              Agregar
            </Button>
          </div>
          <div className="flex flex-col gap-4 p-4 [&_*[data-table='true']]:h-full">
            <DataTable
              data={materialsMock
                .filter((material) =>
                  newProcedureReceiptForm
                    .watch('materials')
                    .map((material) => material.id)
                    .includes(material.id)
                )
                .map((material) => ({
                  ...material,
                  qty:
                    newProcedureReceiptForm
                      .watch('materials')
                      .find((material) => material.id === material.id)?.qty ||
                    0,
                }))}
              columns={materialsColumnsExtended}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Form>
  );
}
