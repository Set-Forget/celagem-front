import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { Products } from '../../schema/products';
import { useGetProductQuery } from '@/lib/services/products';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ product_id: string }>();
  const productId = params.product_id;

  const { data: productData, isLoading: isProductLoading } =
    useGetProductQuery(productId);

  const fields: FieldDefinition<Products>[] = [
    {
      label: 'Código',
      placeholderLength: 14,
      getValue: (p) => p.default_code,
    },
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    },

    {
      label: 'Unidad de compra',
      placeholderLength: 14,
      getValue: (p) => p.purchase_unit.name,
    },
    {
      label: 'Unidad de costo',
      placeholderLength: 14,
      getValue: (p) => p.cost_unit.name,
    },
    {
      label: 'Fracción',
      placeholderLength: 14,
      getValue: (p) => p.fraction?.toString(), // Ensure fraction is converted to string if it's a number
    },
    {
      label: 'Ubicación',
      placeholderLength: 14,
      getValue: (p) => p.location?.name ?? 'No especificado',
    },
    {
      label: 'Activo',
      placeholderLength: 3,
      getValue: (p) => (p.active ? 'Sí' : 'No'),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isProductLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(productData!) ?? '';
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
                isProductLoading ? 'blur-[2px]' : 'blur-none'
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
