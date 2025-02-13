'use client';

import FilterSelector, { FilterConfig } from '@/components/filter-selector';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';
import { useSearchAppointmentsQuery } from '@/services/appointments';
import { format } from 'date-fns';
import { ArrowLeftRight, ArrowRightLeft, ChevronLeft, ChevronRight, CircleDashed, Plus, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import Header from '../../../../components/header';
import AppointmentDetailsDialog from './appointment-details-dialog';
import DailyView from './daily-view';
import MonthlyView from './monthly-view';
import NewAppointmentDialog from './new-appointment-dialog';
import TableView from './table-view';
import WeeklyView from './weekly-view';

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

  const { data: appointments } = useSearchAppointmentsQuery({
    start_date: format(selectedDate, 'yyyy-MM-dd'),
  });

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
        <FilterSelector
          filtersConfig={filtersConfig}
        />

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
      {view === 'month' && <MonthlyView selectedDate={selectedDate} appointments={appointments} />}
      {view === 'week' && <WeeklyView selectedDate={selectedDate} appointments={appointments} />}
      {view === 'day' && <DailyView selectedDate={selectedDate} appointments={appointments} />}
      {view === 'table' && <TableView appointments={appointments} />}
      <NewAppointmentDialog />
      <AppointmentDetailsDialog />
    </>
  );
}
