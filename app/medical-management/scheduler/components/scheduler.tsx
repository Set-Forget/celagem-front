'use client';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { ArrowLeftRight, ArrowRightLeft, ChevronLeft, ChevronRight, CircleDashed, Plus, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Header from '../../../../components/header';
import DailyView from './daily-view';
import MonthlyView from './monthly-view';
import NewAppointmentDialog from './new-appointment-dialog';
import WeeklyView from './weekly-view';
import { cn } from '@/lib/utils';
import FilterSelector, { FilterConfig } from '@/components/filter-selector';
import AppointmentDetailsDialog from './appointment-details-dialog';
import TableView from './table-view';

const APPOINTMENTS = [
  {
    id: '1',
    start_date: '2024-12-30',
    start_time: '10:00',
    end_time: '11:30',
    created_by_user_id: 1,
    professional: 'Dr. Ana López',
    patient: 'Juan Pérez',
    appointment_type: 'ovo-contributor',
    headquarters: 'Sede Asistencial Bucaramanga', status: 'scheduled',
  },
  {
    id: '2',
    start_date: '2024-12-30',
    start_time: '10:30',
    end_time: '11:00',
    created_by_user_id: 2,
    professional: 'Dr. Carlos Gómez',
    patient: 'María Rodríguez',
    appointment_type: 'pregnant',
    headquarters: 'Sede Asistencial Bogotá', status: 'completed',
  },
  {
    id: '3',
    start_date: '2024-12-31',
    start_time: '09:00',
    end_time: '09:30',
    created_by_user_id: 3,
    professional: 'Dra. Laura Martínez',
    patient: 'Pedro García',
    appointment_type: 'semen-contributor',
    headquarters: 'Sede Medellin', status: 'scheduled',
  },
  {
    id: '4',
    start_date: '2024-12-31',
    start_time: '13:00',
    end_time: '13:30',
    created_by_user_id: 4,
    professional: 'Dr. Mario Ramírez',
    patient: 'Sofía Hernández',
    appointment_type: 'pregnant',
    headquarters: 'Sede Asistencial Bogotá', status: 'scheduled',
  },
  {
    id: '5',
    start_date: '2025-01-01',
    start_time: '11:00',
    end_time: '11:30',
    created_by_user_id: 1,
    professional: 'Dr. Ana López',
    patient: 'Lucía Fernández',
    appointment_type: 'ovo-contributor',
    headquarters: 'Sede Asistencial Bucaramanga', status: 'scheduled',
  },
  {
    id: '6',
    start_date: '2025-01-02',
    start_time: '15:00',
    end_time: '15:30',
    created_by_user_id: 2,
    professional: 'Dr. Carlos Gómez',
    patient: 'Miguel Torres',
    appointment_type: 'semen-contributor',
    headquarters: 'Sede Medellin', status: 'scheduled',
  },
  {
    id: '7',
    start_date: '2025-01-03',
    start_time: '16:00',
    end_time: '16:30',
    created_by_user_id: 3,
    professional: 'Dra. Laura Martínez',
    patient: 'Andrea Sánchez',
    appointment_type: 'pregnant',
    headquarters: 'Sede Asistencial Bogotá', status: 'scheduled',
  },
  {
    id: '8',
    start_date: '2025-01-04',
    start_time: '08:00',
    end_time: '08:30',
    created_by_user_id: 4,
    professional: 'Dr. Mario Ramírez',
    patient: 'Roberto Díaz',
    appointment_type: 'ovo-contributor',
    headquarters: 'Sede Asistencial Bucaramanga', status: 'scheduled',
  },
  {
    id: '9',
    start_date: '2025-01-05',
    start_time: '10:00',
    end_time: '10:30',
    created_by_user_id: 1,
    professional: 'Dr. Ana López',
    patient: 'Carolina Mora',
    appointment_type: 'semen-contributor',
    headquarters: 'Sede Medellin', status: 'scheduled',
  },
  {
    id: '10',
    start_date: '2025-01-05',
    start_time: '18:00',
    end_time: '18:30',
    created_by_user_id: 2,
    professional: 'Dr. Carlos Gómez',
    patient: 'Esteban Vargas',
    appointment_type: 'pregnant',
    headquarters: 'Sede Asistencial Bogotá', status: 'scheduled',
  },
];

const filtersConfig: Record<string, FilterConfig> = {
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Usuario", value: "user" },
      { label: "Sede", value: "headquarter" },
    ],
    key: "search",
    icon: Search
  },
  status: {
    type: "multiple",
    options: [
      { label: "Programado", value: "scheduled" },
      { label: "Cancelado", value: "cancelled" },
      { label: "Completado", value: "completed" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
};

export default function Scheduler() {
  const searchParams = useSearchParams();

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const view = searchParams.get('view') || 'month';
  const adaptedSelectedDate = (() => {
    if (view === 'month' || view === 'table') {
      return selectedDate.toLocaleString('es-AR', {
        month: 'long',
        year: 'numeric',
      }).charAt(0).toUpperCase() + selectedDate.toLocaleString('es-AR', { month: 'long', year: 'numeric' }).slice(1);
    } else if (view === 'week') {
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startYear = startOfWeek.getFullYear();
      const endYear = endOfWeek.getFullYear();

      return startYear === endYear
        ? `${startOfWeek.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} ${startYear}`
        : `${startOfWeek.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} ${startYear} - ${endOfWeek.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} ${endYear}`;
    } else {
      return selectedDate.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  })();

  const handlePrev = () => {
    if (view === 'month' || view === 'table') {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
      );
    } else if (view === 'week') {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 7)
      );
    } else if (view === 'day') {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1)
      );
    }
  };

  const handleNext = () => {
    if (view === 'month' || view === 'table') {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
      );
    } else if (view === 'week') {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 7)
      );
    } else if (view === 'day') {
      setSelectedDate(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1)
      );
    }
  };

  const handleSelectView = (view: string) => {
    if (!view) return;
    window.history.pushState({}, '', `?view=${view}`);
  };

  return (
    <>
      <Header title={view === 'table' ? 'Tabla' : 'Agenda'}>
        <Button
          className="ml-2"
          size="sm"
          variant="ghost"
          onClick={() => handleSelectView(view === 'table' ? 'month' : 'table')}
        >
          {view === 'table' ? <ArrowRightLeft /> : <ArrowLeftRight />}
          {view === 'table' ? 'Ver agenda' : 'Ver tabla'}
        </Button>
        <Button
          className="ml-auto"
          size="sm"
          onClick={() => setDialogsState({ open: "new-appointment" })}
        >
          <Plus className="w-4 h-4" />
          Nuevo turno
        </Button>
      </Header>
      <div className={cn('flex justify-between p-4 border-b')}>
        <FilterSelector filtersConfig={filtersConfig} />

        <div className='flex items-center gap-2'>
          <div className={cn('flex items-center justify-between gap-2 border rounded-sm pl-4 h-7 overflow-hidden',
            (view === 'month' || view === 'week' || view === "table") && 'w-[250px]',
            view === 'day' && 'w-[300px]'
          )}>
            <span className='font-medium mr-2 text-xs'>
              {adaptedSelectedDate}
            </span>
            <div className='flex items-center gap-2'>
              <Button className='h-7 w-7 rounded-none' variant="ghost" size="icon" onClick={handlePrev}>
                <ChevronLeft />
              </Button>
              <Button className='h-7 w-7 rounded-tl-none rounded-bl-none' variant="ghost" size="icon" onClick={handleNext}>
                <ChevronRight />
              </Button>
            </div>
          </div>
          {view !== 'table' &&
            <ToggleGroup type="single" value={view} onValueChange={handleSelectView}>
              <ToggleGroupItem className='h-7 text-xs rounded-sm' variant="outline" value="month" >
                Mes
              </ToggleGroupItem>
              <ToggleGroupItem className='h-7 text-xs rounded-sm' variant="outline" value="week">
                Semana
              </ToggleGroupItem>
              <ToggleGroupItem className='h-7 text-xs rounded-sm' variant="outline" value="day">
                Día
              </ToggleGroupItem>
            </ToggleGroup>
          }
        </div>
      </div>
      {/* Create a context or use rtk query to store de appointments and avoid pass them as props */}
      {view === 'month' && <MonthlyView selectedDate={selectedDate} appointments={APPOINTMENTS} />}
      {view === 'week' && <WeeklyView selectedDate={selectedDate} appointments={APPOINTMENTS} />}
      {view === 'day' && <DailyView selectedDate={selectedDate} appointments={APPOINTMENTS} />}
      {view === 'table' &&
        <div className="p-4 h-full">
          <TableView selectedDate={selectedDate} appointments={APPOINTMENTS} />
        </div>
      }

      <NewAppointmentDialog />
      <AppointmentDetailsDialog />
    </>
  );
}
