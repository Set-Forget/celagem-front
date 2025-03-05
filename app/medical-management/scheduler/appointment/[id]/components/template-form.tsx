import RenderField from "@/app/medical-management/components/render-field"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Field, Section, TemplateDetail, templateDetailSchema } from "../../../schemas/templates"
import { generateDefaultValues, generateFormSchema } from "../utils"
import { forwardRef, useImperativeHandle } from "react"
import { cn } from "@/lib/utils"

interface TemplateFormProps {
  template: TemplateDetail;
}

export interface TemplateFormHandle {
  submit: () => void;
}

export const TemplateForm = forwardRef<TemplateFormHandle, TemplateFormProps>(
  ({ template }, ref) => {
    const parsedTemplate = templateDetailSchema.parse(template);

    const formSchema = generateFormSchema(parsedTemplate);
    const defaultValues = generateDefaultValues(parsedTemplate);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
      console.log("Formulario enviado:", data);
    };

    useImperativeHandle(ref, () => ({
      submit: form.handleSubmit(onSubmit),
    }));

    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-4"
        >
          <span className="text-base font-medium">{parsedTemplate?.name}</span>
          {parsedTemplate?.sections?.map((section: Section) => (
            <div key={section.id} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <fieldset className={cn(
                  "border border-input rounded-md p-4 !shadow-sm min-w-0 w-full flex flex-col gap-4 hover:[&:not(:has(.field:hover))]:border-primary transition-colors")}>
                  {section.name && <legend className="text-xs px-2 border rounded-sm font-medium">{section.name}</legend>}
                  {section.fields.map((field: Field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <RenderField field={field} control={form.control} />
                    </div>
                  ))}
                </fieldset>
              </div>
            </div>
          ))}
        </form>
      </Form>
    )
  })
TemplateForm.displayName = "TemplateForm";