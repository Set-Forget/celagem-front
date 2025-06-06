'use client';

import FilterSelector, { FilterConfig } from '@/components/filter-selector';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSearchAppointmentsQuery } from '@/lib/services/appointments';
import { setDialogsState } from '@/lib/store/dialogs-store';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ArrowLeftRight, ArrowRightLeft, ChevronLeft, ChevronRight, CircleDashed, Plus, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { getRangeForView } from './utils';
import Header from '@/components/header';
import WeeklyView from './components/weekly-view';
import DailyView from './components/daily-view';
import TableView from './components/table-view';
import NewAppointmentDialog from './components/new-appointment-dialog';
import AppointmentDetailsDialog from './components/appointment-details-dialog';
import EditAppointmentDialog from './components/edit-appointment-dialog';
import MonthlyView from './components/monthly-view';

const filtersConfig: Record<string, FilterConfig> = {
  search: {
    type: "search",
    label: "Buscar",
    options: [
      { label: "Usuario", value: "user" },
    ],
    key: "search",
    icon: Search
  },
  status: {
    type: "multiple",
    options: [
      { label: "Programado", value: "SCHEDULED" },
      { label: "Cancelado", value: "CANCELLED" },
      { label: "Completado", value: "COMPLETED" },
    ], label: "Estado",
    key: "status",
    icon: CircleDashed
  },
};

export default function Page() {
  const searchParams = useSearchParams();

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const view = searchParams.get('view') || 'month';
  const status = searchParams.get('status');

  const range = getRangeForView(view, selectedDate)

  const { data: appointments, isLoading: isAppointmentLoading } = useSearchAppointmentsQuery({
    range_start_date: format(range.start, 'yyyy-MM-dd'),
    range_end_date: format(range.end, 'yyyy-MM-dd'),
    status: status ? JSON.parse(status).join(',') : undefined,
  });

  const adaptSelectedDate = () => {
    if (view === 'month' || view === 'table') {
      const monthYear = range.start.toLocaleString('es-AR', { month: 'long', year: 'numeric' });
      return monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
    }

    if (view === 'week') {
      const startYear = range.start.getFullYear();
      const endYear = range.end.getFullYear();
      return startYear === endYear
        ? `${range.start.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} - ${range.end.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} ${startYear}`
        : `${range.start.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} ${startYear} - ${range.end.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })} ${endYear}`;
    }

    return selectedDate.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const handlePrev = () => {
    if (view === 'month' || view === 'table') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    } else if (view === 'week') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 7));
    } else if (view === 'day') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() - 1));
    }
  };

  const handleNext = () => {
    if (view === 'month' || view === 'table') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    } else if (view === 'week') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 7));
    } else if (view === 'day') {
      setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1));
    }
  };

  const handleSelectView = (view: string) => {
    if (!view) return;
    window.history.pushState({}, '', `?view=${view}`);
    setSelectedDate(new Date());
  };

  const adaptedSelectedDate = adaptSelectedDate();

  return (
    <div className='flex flex-col h-full'>
      <Header title={view === 'table' ? 'Tabla' : 'Agenda'}>
        <div className='flex items-center gap-2 ml-auto'>
          <Button
            size="sm"
            variant="outline"
            className="w-[115px]"
            onClick={() => handleSelectView(view === 'table' ? 'month' : 'table')}
          >
            {view === 'table' ? <ArrowRightLeft /> : <ArrowLeftRight />}
            {view === 'table' ? 'Ver agenda' : 'Ver tabla'}
          </Button>
          <Button
            size="sm"
            onClick={() => setDialogsState({ open: "new-appointment" })}
          >
            <Plus className="w-4 h-4" />
            Nuevo turno
          </Button>
        </div>
      </Header>
      <div className={cn('flex justify-between p-4 border-b')}>
        <FilterSelector filtersConfig={filtersConfig} />
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'flex items-center justify-between gap-2 border rounded-sm pl-4 h-7 overflow-hidden',
              (view === 'month' || view === 'week' || view === 'table') && 'w-[250px]',
              view === 'day' && 'w-[300px]'
            )}
          >
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
          {view !== 'table' && (
            <ToggleGroup type="single" value={view} onValueChange={handleSelectView}>
              <ToggleGroupItem className='h-7 text-xs rounded-sm' variant="outline" value="month">
                Mes
              </ToggleGroupItem>
              <ToggleGroupItem className='h-7 text-xs rounded-sm' variant="outline" value="week">
                Semana
              </ToggleGroupItem>
              {/*
              <ToggleGroupItem className='h-7 text-xs rounded-sm' variant="outline" value="day">
                Día
              </ToggleGroupItem>
              */}
            </ToggleGroup>
          )}
        </div>
      </div>
      {view === 'month' && <MonthlyView selectedDate={selectedDate} appointments={appointments?.data} />}
      {view === 'week' && <WeeklyView selectedDate={selectedDate} appointments={appointments?.data} />}
      {view === 'day' && <DailyView selectedDate={selectedDate} appointments={appointments?.data} />}
      {view === 'table' && <TableView appointments={appointments?.data} isLoading={isAppointmentLoading} />}
      <NewAppointmentDialog />
      <AppointmentDetailsDialog />
      <EditAppointmentDialog />
    </div>
  );
}
