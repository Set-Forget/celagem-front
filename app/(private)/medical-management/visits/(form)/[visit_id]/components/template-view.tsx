import { Field, Section, TemplateDetail, templateDetailSchema } from "@/app/(private)/medical-management/calendar/schemas/templates";
import { cn } from "@/lib/utils";

interface TemplateViewProps {
  template: TemplateDetail;
  data: string;
}

export const TemplateView = ({ template, data }: TemplateViewProps) => {
  const parsedTemplate = templateDetailSchema.parse(template);
  const medicalRecord = JSON.parse(data ?? "{}") as Record<string, any>

  return (
    <div className="flex flex-col gap-4 p-4">
      <span className="text-base font-medium">{parsedTemplate?.name}</span>

      {parsedTemplate?.sections?.map((section: Section) => (
        <div key={section.id} className="flex flex-col gap-4">
          <fieldset
            className={cn(
              "border border-input rounded-md p-4 !shadow-sm min-w-0 w-full flex flex-col gap-4"
            )}
          >
            {section.name && (
              <legend className="text-xs px-2 border rounded-sm font-medium">
                {section.name}
              </legend>
            )}

            {section.fields.map((field: Field) => (
              <div key={field.id} className="flex flex-col gap-2">
                <label className="text-muted-foreground text-sm">
                  {field.title}
                </label>
                <span className="text-sm">
                  {medicalRecord[field.code] ?? ""}
                </span>
              </div>
            ))}
          </fieldset>
        </div>
      ))}
    </div>
  );
};