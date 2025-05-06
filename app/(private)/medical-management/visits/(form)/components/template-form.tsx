import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";
import { Field, Section, TemplateDetail, templateDetailSchema } from "../../../calendar/schemas/templates";
import { generateDefaultValues, generateFormSchema } from "../utils";
import RenderField from "../../../components/render-field";

export interface TemplateFormHandle {
  submit: () => void;
  reset: (values?: any) => void;
}

interface TemplateFormProps {
  template: TemplateDetail;
  onSubmit: (formData: any, templateName: string) => void;
}

export const TemplateForm = forwardRef<TemplateFormHandle, TemplateFormProps>(
  ({ template, onSubmit }, ref) => {
    const parsedTemplate = templateDetailSchema.parse(template);

    const formSchema = generateFormSchema(parsedTemplate);
    const defaultValues = generateDefaultValues(parsedTemplate);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues,
    });

    const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
      onSubmit(data, parsedTemplate.name);
    };

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(handleFormSubmit),
      reset: (values = defaultValues) => {
        form.reset(values);
      },
    }));

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 p-4">
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
                    <RenderField field={field} control={form.control} />
                  </div>
                ))}
              </fieldset>
            </div>
          ))}
        </form>
      </Form>
    );
  }
);

TemplateForm.displayName = "TemplateForm";
