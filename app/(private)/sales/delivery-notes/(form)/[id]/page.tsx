'use client';

import { DataTable } from '@/components/data-table';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { useGetDeliveryQuery } from '@/lib/services/deliveries';
import { cn, placeholder } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Box, FileText } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { DeliveryNoteDetail } from '../../schemas/delivery-notes';
import Actions from './actions';
import { columns } from './components/columns';
import CustomerTab from './components/customer-tab';
import InvoiceTab from './components/invoice-tab';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

const fields: FieldDefinition<DeliveryNoteDetail>[] = [
  {
    label: "Ubicación de origen",
    placeholderLength: 14,
    getValue: (p) => p.source_location || "No especificado",
  },
  {
    label: "Ubicación de recepción",
    placeholderLength: 14,
    getValue: (p) => p.reception_location || "No especificado",
  },
  {
    label: "Fecha de recepción",
    placeholderLength: 12,
    getValue: (p) => "xxxxx",
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 12,
    getValue: (p) => format(new Date(p.scheduled_date), "PPP", { locale: es }),
  },
  {
    label: "Notas",
    placeholderLength: 30,
    getValue: (p) => p.note || "No hay notas para mostrar",
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Cliente",
    icon: <Box className="mr-1.5" size={16} />,
    content: <CustomerTab />
  },
  {
    value: "tab-2",
    label: "Factura",
    icon: <FileText className="mr-1.5" size={16} />,
    content: <InvoiceTab />
  }
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: deliveryNote, isLoading: isDeliveryNoteLoading } = useGetDeliveryQuery(id);

  return (
    <div>
      <Header title="RC-2000342">
        <div className="ml-auto flex gap-2">
          <Actions />
        </div>
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const displayValue = isDeliveryNoteLoading
              ? placeholder(field.placeholderLength)
              : field.getValue(deliveryNote!) ?? "";
            return (
              <div className={cn("flex flex-col gap-1", field.className)} key={field.label}>
                <label className="text-muted-foreground text-sm">
                  {field.label}
                </label>
                <span
                  className={cn(
                    "text-sm transition-all duration-300",
                    isDeliveryNoteLoading ? "blur-[4px]" : "blur-none"
                  )}
                >
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
        <DataTable
          data={deliveryNote?.items ?? []}
          loading={isDeliveryNoteLoading}
          columns={columns}
          pagination={false}
        />
      </div>
      <DataTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={setTab}
        triggerClassName="mt-4"
      />
    </div>
  );
}
