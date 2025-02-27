import { useFormContext, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { procedureReceiptSchema } from '../../schema/procedure';
import {
  TableFooter as ShadcnTableFooter,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { v4 as uuidv4 } from 'uuid';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TableFooter({
  append,
}: {
  append: (value: any) => void;
}) {
  const { control } = useFormContext<z.infer<typeof procedureReceiptSchema>>();

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

  return (
    <ShadcnTableFooter className="border-t-0">
      <TableRow className="bg-background border-b-0 border-t">
        <TableCell
          className="h-6 text-xs font-medium py-0"
          colSpan={8}
        >
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
