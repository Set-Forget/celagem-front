import { AppointmentDetail } from '@/app/(private)/medical-management/calendar/schemas/appointments';
import { Section, TemplateDetail, templateDetailSchema } from '@/app/(private)/medical-management/calendar/schemas/templates';
import { modesOfCare } from '@/app/(private)/medical-management/calendar/utils';
import { PatientDetail } from '@/app/(private)/medical-management/patients/schema/patients';
import { biologicalSexTypes, disabilityTypes, documentTypes } from '@/app/(private)/medical-management/patients/utils';
import { resolveFieldDisplayValue } from '@/app/(private)/medical-management/visits/(form)/[visit_id]/components/template-view';
import { VisitDetail } from '@/app/(private)/medical-management/visits/schemas/visits';
import { PDF } from '@/components/pdf-component';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Fragment } from 'react';

export type VisitRecordData = {
  visit: VisitDetail,
  appointment: AppointmentDetail,
  patient: PatientDetail
  data: string,
};

const VisitRecordPDF = ({ data }: { data: VisitRecordData }) => {
  const medicalRecord = JSON.parse(data.data ?? "{}") as { template: TemplateDetail, formData: Record<string, any> }
  const parsedTemplate = templateDetailSchema.parse(medicalRecord.template);

  const visit = data.visit
  const appointment = data.appointment
  const patient = data.patient

  return (
    <PDF options={{
      title: `Visit Record 1`
    }}>
      <div className="p-4 text-sm">
        <div className="flex justify-between mb-4 gap-4">
          <div className="w-full">
            <h1 className="mb-5 text-2xl font-bold">VISITA N° {visit.visit_number}</h1>
            <div className="flex justify-between text-xs">
              <span className="inline-block">Fecha y hora:</span>
              <span className="font-medium">
                {visit.createdAt ? format(new Date(visit.createdAt ?? ""), "PP hh:mmaaa", { locale: es }) : 'No especificado'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="inline-block">Tipo de atención:</span>
              <span className="font-medium">{parsedTemplate.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="inline-block">Modalidad:</span>
              <span className="font-medium">{appointment?.mode_of_care ? modesOfCare[appointment.mode_of_care as keyof typeof modesOfCare] : "No especificado"}</span>
            </div>
          </div>
          <div className="w-full px-3 mt-12">
            <img src="/celagem-logo.svg" alt="CENTRO DE FERTILIDAD REPRONAT S.A.S." className="block w-[362px] h-[77px]" />
          </div>
        </div>

        <div className="mb-4">
          <div className="bg-[#f8f9fa] p-2 rounded-md">
            <h3 className="mb-4 text-sm font-bold">DATOS DEL PACIENTE</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs">
                  <span>Nombre:</span>
                  <span className="font-medium">
                    {patient.first_name} {patient.first_last_name}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Sexo biológico:</span>
                  <span className="font-medium">
                    {biologicalSexTypes.find((b) => b.value === patient.biological_sex)?.label || "No especificado"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Fecha de nacimiento:</span>
                  <span className="font-medium">
                    {patient.birth_date ? format(new Date(patient.birth_date), "PPP", { locale: es }) : 'No especificado'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Documento:</span>
                  <span className="font-medium">
                    {documentTypes.find((d) => d.value === patient.document_type)?.short || ""} {patient.document_number || "No especificado"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Discapacidad:</span>
                  <span className="font-medium">
                    {disabilityTypes.find((d) => d.value === patient.disability_type)?.label || "No especificado"}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span>Teléfono:</span>
                  <span className="font-medium">
                    {patient.phone_number || "No especificado"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Email:</span>
                  <span className="font-medium">
                    {patient.email || "No especificado"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Dirección de residencia:</span>
                  <span className="font-medium">
                    {patient.address?.formatted_address || "No especificado"}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Clase:</span>
                  <span className="font-medium">
                    {patient.class?.name || "No especificado"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="text-sm font-bold">{parsedTemplate.name.toUpperCase()}</span>

          {parsedTemplate.sections.map((section: Section) => {
            const sectionKey = medicalRecord.formData[section.name]

            if (section.type === "form") {
              return (
                <div
                  key={section.id}
                  className="border border-input rounded-md p-2 min-w-0 w-full mb-4"
                >
                  {section.name && (
                    <div className="inline-block mb-2 text-xs font-medium">
                      {section.name.toUpperCase()}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {section.fields.map(field => {
                      const rawValue = medicalRecord.formData[field.code]
                      const displayValue = resolveFieldDisplayValue(field, rawValue);
                      return (
                        <Fragment key={field.id}>
                          <div className="text-muted-foreground text-xs">
                            {field.title}
                          </div>
                          <div className="text-xs">
                            {displayValue}
                          </div>
                        </Fragment>
                      )
                    })}
                  </div>
                </div>
              )
            }

            if (section.type === "table") {
              const rows: Record<string, unknown>[] = Array.isArray(sectionKey) ? sectionKey : []

              return (
                <div
                  key={section.id}
                  className="border border-input rounded-md p-2 min-w-0 w-full mb-4"
                >
                  {section.name && (
                    <div className="inline-block mb-2 text-xs font-medium">
                      {section.name.toUpperCase()}
                    </div>
                  )}

                  <div className="overflow-hidden border rounded-sm">
                    <table className="w-full text-xs border-collapse">
                      <thead className="border-b bg-[#f8f9fa]">
                        <tr>
                          {section.fields.map(col => (
                            <th key={col.id} className="px-2 py-1 text-left font-medium text-xs">
                              {col.title}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {rows.length > 0 ? (
                          rows.map((row, idx) => (
                            <tr key={idx} className="border-b last:border-b-0">
                              {section.fields.map(col => (
                                <td key={col.id} className="px-2 py-1">
                                  {resolveFieldDisplayValue(col, row[col.code])}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={section.fields.length}
                              className="px-2 py-2 text-center text-muted-foreground italic"
                            >
                              — Sin datos —
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-2 text-xs">
          <div className="flex justify-between items-end">
            <div>
              <p className="m-0">CENTRO DE FERTILIDAD REPRONAT S.A.S.</p>
              <p className="m-0">Informe de Visita Confidencial</p>
              <p className="m-0">Este documento contiene información médica confidencial protegida por la ley.</p>
            </div>
            <div className="text-right">
              <p className="m-0 font-semibold">Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}</p>
              <p className="m-0">Médico Especialista</p>
              <p className="m-0">Fecha de firma: {visit.signed_at ? format(new Date(visit.signed_at ?? ""), "PPP", { locale: es }) : 'No firmado'}</p>
            </div>
          </div>
        </div>
      </div>
    </PDF>
  );
};

export default VisitRecordPDF;
