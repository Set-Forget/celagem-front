'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Search,
  ChevronsUpDown,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AccountItem {
  id: string;
  name: string;
  balance: number;
  children?: AccountItem[];
}

interface NestedAccountTableProps {
  data: AccountItem[];
}

enum Periodicity {
  'monthly',
  'yearly',
  'quarterly',
  'half-yearly',
}

enum Range {
  'datarange',
  'fiscalyear',
}

const NestedAccountTable: React.FC<NestedAccountTableProps> = ({ data }) => {
  const router = useRouter();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 365),
  });

  const [range, setRange] = React.useState<Range | null>();

  const [periodicity, setPeriodicity] = useState<Periodicity | null>();

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const countAccounts = (items: AccountItem[]): number => {
    return items.reduce((acc, item) => {
      return acc + 1 + (item.children ? countAccounts(item.children) : 0);
    }, 0);
  };

  const filterData = (
    items: AccountItem[],
    searchTerm: string
  ): AccountItem[] => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return items.reduce<AccountItem[]>((acc, item) => {
      const matches =
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.id.toLowerCase().includes(lowerSearchTerm);
      let children: AccountItem[] | undefined;
      if (item.children) {
        children = filterData(item.children, searchTerm);
      }
      if (matches || (children && children.length > 0)) {
        acc.push({
          ...item,
          children,
        });
      }
      return acc;
    }, []);
  };

  const filteredData = searchTerm ? filterData(data, searchTerm) : data;

  const renderTableRows = (
    items: AccountItem[],
    depth = 0
  ): React.ReactNode => {
    return items.map((item) => {
      const isExpanded = expandedRows.has(item.id);
      const hasChildren = item.children && item.children.length > 0;
      const currentNumber = item.id;

      return (
        <React.Fragment key={item.id}>
          <TableRow className={cn('border-b', isExpanded && 'bg-muted')}>
            <TableCell className={cn('p-2 text-sm')}>
              {hasChildren && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => toggleRow(item.id)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              )}
            </TableCell>
            <TableCell className="p-2 text-sm">{currentNumber}</TableCell>
            <TableCell
              className="p-2 text-sm"
              style={{ paddingLeft: `${depth * 1.5}rem` }}
            >
              <Button
                size="sm"
                variant="ghost"
                className="h-6"
                onClick={() =>
                  router.push(`/accounting/chart-of-accounts/${currentNumber}`)
                }
              >
                {item.name}
              </Button>
            </TableCell>
            <TableCell className="p-2 text-sm text-right">
              ARS {item.balance.toFixed(2)}
            </TableCell>
            <TableCell className="p-2 text-sm"></TableCell>
          </TableRow>
          {isExpanded &&
            hasChildren &&
            renderTableRows(item.children!, depth + 1)}
        </React.Fragment>
      );
    });
  };

  const accountsCount = countAccounts(filteredData);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-1">
          <Input
            placeholder="Buscar cuenta..."
            className="max-w-xs py-0 h-8 rounded-tr-none rounded-br-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            className="min-w-8 h-8 rounded-tl-none rounded-bl-none"
          >
            <Search />
          </Button>
        </div>
        <div className={cn('grid gap-2 w-64')}>
          <Select
            onValueChange={(data) => setRange(data as unknown as Range)}
            defaultValue={undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rango para el filtrado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daterange">Rango de fechas</SelectItem>
              <SelectItem value="fiscalyear">Año Fiscal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={cn('grid gap-2 w-64')}>
          <Select
            onValueChange={(data) => setPeriodicity(data as unknown as Periodicity)}
            defaultValue={undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una periodicidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="half-yearly">Semi-Anual</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className={cn('grid gap-2')}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={'outline'}
                className={cn(
                  'justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'LLL dd, y')} -{' '}
                      {format(date.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(date.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Seleccioná un rango</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-6"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Cuenta</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="w-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableRows(filteredData)}</TableBody>
        <TableFooter className="border-t-0">
          <TableRow>
            <TableCell
              colSpan={1}
              className="h-6 text-xs font-medium py-0 text-right rounded-bl-sm"
            ></TableCell>
            <TableCell
              colSpan={2}
              className="h-6 text-xs font-medium py-0"
            >
              <span>Total</span>
            </TableCell>
            <TableCell
              colSpan={1}
              className="h-6 text-xs font-semibold py-0 text-right"
            >
              ARS 17,000.00
            </TableCell>
            <TableCell
              colSpan={1}
              className="h-6 text-xs font-medium py-0 text-right rounded-br-sm"
            ></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="text-sm text-muted-foreground">
        {accountsCount} cuentas en total
      </div>
    </div>
  );
};

export default NestedAccountTable;
