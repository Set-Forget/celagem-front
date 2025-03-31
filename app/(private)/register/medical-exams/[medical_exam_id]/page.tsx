'use client';

import DataTabs from '@/components/data-tabs';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useGetPatientQuery } from '@/lib/services/patients';
import { cn, placeholder } from '@/lib/utils';
import {
  Building,
  ChevronDown,
  House,
  Pencil,
  Plus,
  Shield,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import GeneralTab from './components/general-tab';
import { useGetClassQuery } from '@/lib/services/classes';
import { useGetMedicalExamQuery } from '@/lib/services/medical-exams';

const notes = [
  {
    id: 1,
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc.',
  },
  { id: 2, content: 'Nullam nec purus nec nunc. ac bibendum.' },
  {
    id: 3,
    content:
      'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit',
  },
  {
    id: 4,
    content:
      'Sed pretium tortor nec ipsum interdum dictum. Aliquam erat volutpat. Phasellus pulvinar velit arcu, at interdum ligula volutpat id. Nulla et tellus vel ipsum scelerisque auctor eu non massa. Duis laoreet vel magna eu sodales. Maecenas bibendum nisl neque, quis auctor arcu pharetra commodo. Proin sit amet facilisis libero. Fusce sagittis purus ut aliquam accumsan. Fusce vel mauris nisi. Vestibulum lobortis.',
  },
];

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
    content: <GeneralTab />,
  },
];

export default function Page() {
  const router = useRouter();
  const params = useParams<{ medical_exam_id: string }>();

  const medicalExamId = params.medical_exam_id;

  const { data: medicalExamData, isLoading: isMedicalExamLoading } =
    useGetMedicalExamQuery(medicalExamId);

  const [tab, setTab] = useState('tab-1');

  return (
    <>
      <Header title="Detalles del examen médico">
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
              >
                Acciones
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>Ver historial</DropdownMenuItem>
                <DropdownMenuItem>Crear visita</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent> */}
          </DropdownMenu>
          <Button
            onClick={() => router.push(`/register/medical-exams/edit/${medicalExamId}`)}
            size="sm"
          >
            <Pencil className="w-4 h-4" />
            Editar examen médico
          </Button>
        </div>
      </Header>
      <ResizablePanelGroup
        className="flex !h-full !w-full"
        direction="horizontal"
      >
        <ResizablePanel defaultSize={70}>
          <DataTabs
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            triggerClassName="mt-4"
            contentClassName="p-4"
          />
        </ResizablePanel>
        <ResizableHandle disabled />
        <ResizablePanel
          className="!flex-none w-[350px]"
          defaultSize={30}
        >
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Notas</h2>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
              >
                <Plus />
              </Button>
            </div>
            <ScrollArea className="h-[300px] w-full pr-2 overflow-x-hidden border p-2 bg-muted !rounded-sm">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start justify-between py-2 border-b last:border-b-0 group relative"
                >
                  <p className="text-xs break-words pr-2 flex-1">
                    {note.content}
                  </p>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity absolute top-1 right-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-tr-none rounded-br-none border-r-0"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-tl-none rounded-bl-none"
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-medium">Última visita</h2>
            </div>
          </div>
          <Separator />
          <div className="p-4 flex flex-col gap-4">
            <h2 className="text-base font-medium">Actividad</h2>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Creado por <span className="font-medium">John Doe</span>
              </label>
              <span
                className={cn(
                  'text-sm transition-all duration-300',
                  isMedicalExamLoading ? 'blur-[4px]' : 'blur-none'
                )}
              >
                {isMedicalExamLoading ? placeholder(13) : 'Hace 3 días'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-muted-foreground text-sm">
                Editado por{' '}
                <span
                  className={cn(
                    'font-medium transition-all duration-300',
                    isMedicalExamLoading ? 'blur-[4px]' : 'blur-none'
                  )}
                >
                  {isMedicalExamLoading
                    ? placeholder(13)
                    : medicalExamData?.updated_by?.first_name +
                      ' ' +
                      medicalExamData?.updated_by?.last_name}
                </span>
              </label>
              <span
                className={cn(
                  'text-sm transition-all duration-300',
                  isMedicalExamLoading ? 'blur-[4px]' : 'blur-none'
                )}
              >
                Hace 2 días
              </span>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
