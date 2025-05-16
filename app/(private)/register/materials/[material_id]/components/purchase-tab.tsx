import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetMaterialQuery } from '@/lib/services/materials';
import { Materials } from '../../schema/materials';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function PurchaseTab() {
  const params = useParams<{ material_id: string }>();
  const materialId = params.material_id;

  const { data: materialData, isLoading: isMaterialLoading } =
    useGetMaterialQuery(materialId);

  const fields: FieldDefinition<Materials>[] = [
    {
      label: 'Unidad de compra',
      placeholderLength: 14,
      getValue: (p) => p.purchase_unit,
    },
    {
      label: 'Precio unitario',
      placeholderLength: 14,
      getValue: (p) => p.purchase_unit_price?.toString(),
    },
    {
      label: 'Tasa de conversión',
      placeholderLength: 14,
      getValue: (p) => p.convertion_rate_purchase_to_cost_unit?.toString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isMaterialLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(materialData! as any) ?? '';
        return (
          <div
            className="flex flex-col gap-1"
            key={field.label}
          >
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                'text-sm transition-all duration-300',
                isMaterialLoading ? 'blur-[2px]' : 'blur-none'
              )}
            >
              {displayValue}
            </span>
          </div>
        );
      })}
    </div>
  );
}
