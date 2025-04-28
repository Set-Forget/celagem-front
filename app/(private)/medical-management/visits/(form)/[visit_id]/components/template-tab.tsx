import { useGetVisitQuery } from "@/lib/services/visits";
import { cn, placeholder } from "@/lib/utils";
import { useParams } from "next/navigation";
import { TemplateView } from "./template-view";

export default function TemplateTab() {
  const params = useParams<{ visit_id: string }>();

  const visitId = params.visit_id

  const { data: visit } = useGetVisitQuery(visitId)

  return (
    <div>
      {!visit ? (
        <div className="flex flex-col gap-4 p-4">
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
        <TemplateView
          data={visit.medical_record}
        />
      )}
    </div>
  )
}