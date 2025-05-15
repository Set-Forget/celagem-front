import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";

import { useGetCompanyQuery } from "@/lib/services/companies";
import { Companies } from "../../schema/companies";

export type FieldDefinition<T> = {
  label: string;
  placeholderLength: number;
  getValue: (data: T) => string | undefined;
  className?: string;
};

export default function GeneralTab() {
  const params = useParams<{ company_id: string }>();
  const companyId = params.company_id;

  const { data: company, isLoading: isCompanyLoading } = useGetCompanyQuery(companyId);

  const fields: FieldDefinition<Companies>[] = [
    {
      label: "Nombre",
      placeholderLength: 14,
      getValue: (p) => p.name,
    },
    {
      label: "Descripción",
      placeholderLength: 14,
      getValue: (p) => p.description,
    },

  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const displayValue = isCompanyLoading
          ? placeholder(field.placeholderLength)
          : field.getValue(company!) ?? '';
        return (
          <div className="flex flex-col gap-1" key={field.label}>
            <label className="text-muted-foreground text-sm">
              {field.label}
            </label>
            <span
              className={cn(
                "text-sm transition-all duration-300",
                isCompanyLoading ? "blur-[4px]" : "blur-none"
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
