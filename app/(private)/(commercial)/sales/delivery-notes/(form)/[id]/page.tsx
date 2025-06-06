'use client';

import { DataTable } from '@/components/data-table';
import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import RenderFields from '@/components/render-fields';
import { useGetDeliveryQuery } from '@/lib/services/deliveries';
import { cn, FieldDefinition } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Box } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { DeliveryNoteDetail } from '../../schemas/delivery-notes';
import Actions from './actions';
import { columns } from './components/columns';
import CustomerTab from './components/customer-tab';
import { deliveryNoteStatus } from '../../utils';
import { Badge } from '@/components/ui/badge';

const fields: FieldDefinition<DeliveryNoteDetail>[] = [
  {
    label: "Ubicación de entrega",
    placeholderLength: 14,
    render: (p) => p.delivery_location || "No especificado",
  },
  {
    label: "Fecha de recepción",
    placeholderLength: 12,
    render: (p) => p.delivery_date ? format(parseISO(p.delivery_date), "PP", { locale: es }) : "No especificada",
  },
  {
    label: "Fecha de requerimiento",
    placeholderLength: 12,
    render: (p) => p.scheduled_date ? format(parseISO(p.scheduled_date), "PP", { locale: es }) : "No especificada",
  },
  {
    label: "Notas",
    placeholderLength: 30,
    render: (p) => p.note || "No hay notas para mostrar",
  }
];

const tabs = [
  {
    value: "tab-1",
    label: "Cliente",
    icon: <Box size={16} />,
    content: <CustomerTab />
  },
  /*   {
      value: "tab-2",
      label: "Factura",
      icon: <FileText size={16} />,
      content: <InvoiceTab />
    } */
]

export default function Page() {
  const { id } = useParams<{ id: string }>()

  const [tab, setTab] = useState(tabs[0].value)

  const { data: deliveryNote, isLoading: isDeliveryNoteLoading } = useGetDeliveryQuery(id);

  const status = deliveryNoteStatus[deliveryNote?.state as keyof typeof deliveryNoteStatus]

  return (
    <div>
      <Header title={deliveryNote?.sequence_id}>
        <div className="mr-auto">
          <Badge
            variant="custom"
            className={cn(`${status?.bg_color} ${status?.text_color} border-none rounded-sm`)}
          >
            {status?.label}
          </Badge>
        </div>
        <div className="ml-auto flex gap-2">
          <Actions />
        </div>
      </Header>
      <div className="flex flex-col gap-4 p-4">
        <RenderFields
          fields={fields}
          data={deliveryNote}
          loading={isDeliveryNoteLoading}
        />
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
