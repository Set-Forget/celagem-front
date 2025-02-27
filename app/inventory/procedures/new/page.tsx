'use client';

import {
  Bolt,
  // CalendarIcon,
  Check,
  // CheckIcon,
  ChevronsUpDown,
  Contact,
  Delete,
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import ItemsTable from './job-positions-components/items-table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  // Box,
  House,
} from 'lucide-react';
// import { MultiSelect } from '@/components/multi-select';
import {
  jobPositionConsumedSchema,
  procedureReceiptSchema,
} from '@/app/inventory/procedures/schema/procedure';
import { jobPositionsMock } from '../../job-positions/mocks/jobPositionsMock';
import { servicesMock } from '../../services/mocks/servicesMock';
import { medicalExamsMock } from '../../medical-exams/mocks/medicalExamsMock';
import { materialsMock } from '../../materials/mocks/materials';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/data-table';
import { jobPositionsColumns } from '../../job-positions/components/columns';

// const companies = [
//   { label: 'Google', value: '30-67890123-4' },
//   { label: 'Facebook', value: '30-12345678-9' },
//   { label: 'Microsoft', value: '33-98765432-1' },
//   { label: 'Apple', value: '33-11223344-5' },
//   { label: 'Amazon', value: '34-55667788-0' },
//   { label: 'Tesla', value: '30-99887766-3' },
//   { label: 'Netflix', value: '31-44556677-2' },
//   { label: 'Twitter', value: '31-77665544-8' },
//   { label: 'Spotify', value: '32-33445566-7' },
//   { label: 'Adobe', value: '33-22334455-9' },
// ] as const;

const jobPositions = jobPositionsMock.map((jobPosition) => ({
  label: jobPosition.code,
  value: jobPosition.id,
}));

const services = servicesMock.map((service) => ({
  label: service.code,
  value: service.id,
}));

const medicalExams = medicalExamsMock.map((medicalExam) => ({
  label: medicalExam.code,
  value: medicalExam.id,
}));

const materials = materialsMock.map((material) => ({
  label: material.code,
  value: material.id,
}));

// const headquarters = [
//   { id: 'hq1', name: 'Main Office' },
//   { id: 'hq2', name: 'Regional Office - North' },
//   { id: 'hq3', name: 'Regional Office - South' },
//   { id: 'hq4', name: 'International Office - Europe' },
//   { id: 'hq5', name: 'International Office - Asia' },
// ];

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

  const jobPositionForm = useForm<z.infer<typeof jobPositionConsumedSchema>>({
    resolver: zodResolver(jobPositionConsumedSchema),
    defaultValues: {},
  });

  const onSubmit = (data: z.infer<typeof procedureReceiptSchema>) => {
    console.log(data);
  };

  const jobPositionsColumnsExtended = [
    ...jobPositionsColumns.filter((column) => column.id !== 'select'),
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({ row }) => (
        <div className="capitalize flex gap-1">
          <div>{row.original.qty}</div>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
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

  return (
    <Form {...newProcedureReceiptForm}>
      <Header title="Nuevo procedimiento">
        <div className="flex justify-end gap-2 ml-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
          >
            Previsualizar
          </Button>
          <Button
            type="submit"
            onClick={newProcedureReceiptForm.handleSubmit(onSubmit)}
            size="sm"
          >
            Crear orden de compra
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
          className="m-0"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newProcedureReceiptForm.control}
              name="cups_code"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">CUPS</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="890223"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Esta será el codigo CUP al que se asociará el procedimiento.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-2"
          className="m-0"
        >
          <div className="grid grid-cols-1 gap-4  p-4">
            <FormLabel className="w-fit">Puestos de trabajo</FormLabel>
            <FormField
              control={jobPositionForm.control}
              name="id"
              render={({ field }) => (
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
                    <PopoverContent className="w-[200px] p-0">
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
                    value={jobPositionForm.watch('qty')}
                  />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="sm"
              className="mt-2"
              onClick={() => {
                jobPositionForm.handleSubmit((data) => {
                  newProcedureReceiptForm.setValue('job_description', [
                    ...newProcedureReceiptForm.watch('job_description'),
                    data,
                  ]);
                })();
                jobPositionForm.reset({id: undefined, qty: undefined});
              }}
            >
              Agregar
            </Button>
            <pre>{JSON.stringify(jobPositionForm.watch())}</pre>
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
          className="m-0"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newProcedureReceiptForm.control}
              name="job_description"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Services</FormLabel>
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
                            ? services.find((service) =>
                                field.value.some(
                                  (item) => item.id === service.value
                                )
                              )?.label
                            : 'Selecciona un servicio'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
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
                                  newProcedureReceiptForm.setValue('services', [
                                    ...field.value,
                                    {
                                      id: service.value,
                                      qty: 1,
                                    },
                                  ]);
                                }}
                              >
                                {service.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value.some(
                                      (item) => item.id === service.value
                                    )
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
              )}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-4"
          className="m-0"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newProcedureReceiptForm.control}
              name="job_description"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Examenes Medicos</FormLabel>
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
                            ? medicalExams.find((medicalExam) =>
                                field.value.some(
                                  (item) => item.id === medicalExam.value
                                )
                              )?.label
                            : 'Selecciona un examen medico'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
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
                                  newProcedureReceiptForm.setValue(
                                    'medical_exams',
                                    [
                                      ...field.value,
                                      {
                                        id: medicalExam.value,
                                        qty: 1,
                                      },
                                    ]
                                  );
                                }}
                              >
                                {medicalExam.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value.some(
                                      (item) => item.id === medicalExam.value
                                    )
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
              )}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="tab-5"
          className="m-0"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <FormField
              control={newProcedureReceiptForm.control}
              name="job_description"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="w-fit">Materiales</FormLabel>
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
                            ? materials.find((material) =>
                                field.value.some(
                                  (item) => item.id === material.value
                                )
                              )?.label
                            : 'Selecciona un material'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
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
                                  newProcedureReceiptForm.setValue(
                                    'job_description',
                                    [
                                      ...field.value,
                                      {
                                        id: material.value,
                                        qty: 1,
                                      },
                                    ]
                                  );
                                }}
                              >
                                {material.label}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value.some(
                                      (item) => item.id === material.value
                                    )
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
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Form>
  );
}
