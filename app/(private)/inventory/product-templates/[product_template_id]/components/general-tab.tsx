import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { ProductTemplate } from '../../../products/schema/products';
import { useGetProductTemplateQuery } from '@/lib/services/product-templates';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ product_template_id: string }>();
  const productTemplateId = params.product_template_id;

  const { data: productTemplateData, isLoading: isProductTemplateLoading } =
    useGetProductTemplateQuery(productTemplateId);

  // TODO: Update ProductTemplate type definition to reflect actual API response
  // Assuming the type might be incomplete or different from the actual response structure.
  // The getValue functions below are adjusted based on common patterns and field labels.
  const fields: FieldDefinition<ProductTemplate & { [key: string]: any }>[] = [ // Using index signature temporarily
    {
      label: 'Código',
      placeholderLength: 14,
      getValue: (p) => p.code ?? '', // Assuming 'code' exists but might be optional
    },
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name, // 'name' seems to exist based on error type
    },
    {
      label: 'Unidad de compra',
      placeholderLength: 14,
      // Assuming 'purchase_unit' is an object with a 'name' property or just a string
      getValue: (p) => (typeof p.purchase_unit === 'object' ? p.purchase_unit?.name : p.purchase_unit) ?? '',
    },
    {
      label: 'Unidad de costo',
      placeholderLength: 14,
      // Assuming 'cost_unit' is an object with a 'name' property or just a string
      getValue: (p) => (typeof p.cost_unit === 'object' ? p.cost_unit?.name : p.cost_unit) ?? '',
    },
    {
      label: 'Fracción',
      placeholderLength: 14,
      // Assuming 'fraction' exists and might need conversion to string
      getValue: (p) => p.fraction?.toString() ?? '',
    },
    {
      label: 'Ubicación',
      placeholderLength: 14,
      // Assuming 'location' exists but might be optional
      getValue: (p) => p.location ?? '',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isProductTemplateLoading
          ? placeholder(field.placeholderLength)
          // Use a default empty object if productTemplateData is null/undefined before access
          : field.getValue(productTemplateData ?? ({} as ProductTemplate)) ?? '';
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
                isProductTemplateLoading ? 'blur-[2px]' : 'blur-none'
              )}
            >
              {displayValue || '-'} {/* Display '-' if value is empty */}
            </span>
          </div>
        );
      })}
    </div>
  );
}
