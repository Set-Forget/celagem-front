import { cn, placeholder } from '@/lib/utils';

import { useParams } from 'next/navigation';

import { useGetMaterialQuery } from '@/lib/services/materials';
import { Attributes } from '../../schema/attributes';
import { useGetAttributeQuery } from '@/lib/services/attributes';

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ attribute_id: string }>();
  const attributeId = params.attribute_id;

  const { data: attributeData, isLoading: isAttributeLoading } =
    useGetAttributeQuery(attributeId);

  const fields: FieldDefinition<Attributes>[] = [
    {
      label: 'Nombre',
      placeholderLength: 14,
      getValue: (p) => p.name,
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isAttributeLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(attributeData!) ?? '';
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
                isAttributeLoading ? 'blur-[2px]' : 'blur-none'
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
