import { useGetAppointmentQuery } from "@/lib/services/appointments";
import { useGetTemplateQuery } from "@/lib/services/templates";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { TemplateForm } from "../../new/components/template-form";

export default function TemplateFormTab({ formRef, onSubmit }: { formRef: any, onSubmit: any }) {
  const params = useParams<{ appointment_id: string }>();
  const appointmentId = params.appointment_id;

  const { data: appointment } = useGetAppointmentQuery(appointmentId!, { skip: !appointmentId });
  const { data: template } = useGetTemplateQuery(appointment?.template.id!, {
    skip: !appointment?.template.id,
  });

  return (
    <div>
      {!template ? (
        <div className="p-4 flex flex-col gap-4">
          <span className={cn("text-base blur-[4px]")}>
            {placeholder(40)}
          </span>
          <div className="space-y-4">
            {[1, 2].map((section) => (
              <fieldset key={section} className="border border-input rounded-md p-4">
                <legend className="text-xs px-2 border rounded-sm">
                  <span className="font-medium blur-[4px]">
                    {placeholder(10)}
                  </span>
                </legend>
                <div className="grid grid-cols-1 gap-4">
                  {[1, 2, 3].map((field) => (
                    <div key={field} className="flex flex-col gap-2">
                      <span className="text-sm blur-[4px]">
                        {placeholder(9)}
                      </span>
                      <span className="bg-accent blur-[4px] rounded-md h-9"></span>
                    </div>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
        </div>
      ) : (
        <TemplateForm template={template} onSubmit={onSubmit} ref={formRef} />
      )}
    </div>
  )
}