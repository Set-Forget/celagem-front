import { useFormContext, useWatch } from 'react-hook-form';
import { z } from 'zod';
import {
  TableFooter as ShadcnTableFooter,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { v4 as uuidv4 } from 'uuid';
import { Check, ChevronsUpDown, Command, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormControl } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from 'cmdk';
import { Popover } from 'react-aria-components';
import { jobPositionsMock } from '@/app/inventory/job-positions/mocks/jobPositionsMock';
import { jobPositionSchema } from '@/app/inventory/job-positions/schema/job-position';

export default function TableFooter({
  append,
}: {
  append: (value: any) => void;
}) {
  const { control } = useFormContext<z.infer<typeof jobPositionSchema>>();

  const currency = useWatch({
    control: control,
    name: 'currency',
  });

  const items = useWatch({
    control,
    name: `items`,
  });

  const handleAddItem = () => {
    append({
      id: uuidv4(),
      description: '',
      quantity: 1,
      price: '',
      tax: '21',
    });
  };

  const jobPositions = jobPositionsMock;

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell
          className="h-6 text-xs font-medium py-0 flex flex-row items-center"
          colSpan={8}
        >
          <FormField
            control={newProcedureReceiptForm.control}
            name="supplier_name"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn('w-full justify-between pl-3 font-normal')}
                    >
                      {field.value
                        ? jobPositions.find(
                            (company) => company.value === field.value
                          )?.label
                        : 'Selecciona un cliente'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar proveedores..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>
                        No se encontraron proveedores.
                      </CommandEmpty>
                      <CommandGroup>
                        {companies.map((company) => (
                          <CommandItem
                            value={company.label}
                            key={company.value}
                            onSelect={() => {
                              newProcedureReceiptForm.setValue(
                                'supplier_name',
                                company.value
                              );
                            }}
                          >
                            {company.label}
                            <Check
                              className={cn(
                                'ml-auto',
                                company.value === field.value
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
            )}
          />

          <Button
            onClick={handleAddItem}
            size="sm"
            type="button"
            variant="ghost"
            className="h-7 rounded-none w-full"
          >
            <Plus />
            Agregar item
          </Button>
        </TableCell>
      </TableRow>
    </ShadcnTableFooter>
  );
}
