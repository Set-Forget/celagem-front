import { Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer"
import type { AppointmentDetail } from "@/app/(private)/medical-management/calendar/schemas/appointments"
import type { Section, TemplateDetail } from "@/app/(private)/medical-management/(masters)/schemas/templates"
import { templateDetailSchema } from "@/app/(private)/medical-management/(masters)/schemas/templates"
import { modesOfCare } from "@/app/(private)/medical-management/calendar/utils"
import type { PatientDetail } from "@/app/(private)/medical-management/patients/schema/patients"
import { biologicalSexTypes, disabilityTypes, documentTypes } from "@/app/(private)/medical-management/patients/utils"
import { resolveFieldDisplayValue } from "@/app/(private)/medical-management/visits/(form)/[visit_id]/components/template-view"
import type { VisitDetail } from "@/app/(private)/medical-management/visits/schemas/visits"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export type VisitRecordData = {
  visit: VisitDetail
  appointment: AppointmentDetail
  patient: PatientDetail
  data: string
}

Font.register({
  family: "Geist",
  fonts: [
    {
      src: "/Geist-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/Geist-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/Geist-Semibold.ttf",
      fontWeight: 700,
    },
    {
      fontWeight: 400,
      fontStyle: "italic",
      src: "/Geist-Regular.ttf",
    }
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: "Geist",
    fontSize: 8,
    padding: 16,
    margin: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  headerLeft: {
    width: "50%",
  },
  headerRight: {
    width: "50%",
    paddingHorizontal: 12,
    marginTop: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    fontSize: 8,
  },
  label: {
    fontWeight: 400,
  },
  value: {
    fontWeight: 500,
  },
  logo: {
    width: 362,
    height: 77,
  },
  patientSection: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 16,
  },
  patientGrid: {
    flexDirection: "row",
    gap: 16,
  },
  patientColumn: {
    width: "50%",
  },
  templateTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  formSection: {
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    width: "100%",
  },
  formSectionTitle: {
    fontSize: 8,
    fontWeight: 500,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  formField: {
    width: "48%",
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 8,
  },
  tableSection: {
    border: "1px solid #e5e7eb",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    width: "100%",
  },
  table: {
    width: "100%",
    borderRadius: 2,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableHeaderCell: {
    padding: 4,
    fontSize: 8,
    fontWeight: 500,
    textAlign: "left",
    flex: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    padding: 4,
    fontSize: 9,
    flex: 1,
  },
  emptyTableCell: {
    padding: 8,
    fontSize: 9,
    textAlign: "center",
    fontStyle: "italic",
    color: "#6b7280",
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    fontSize: 8,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {
    width: "60%",
  },
  footerRight: {
    width: "40%",
    textAlign: "right",
  },
  doctorName: {
    fontWeight: 600,
    marginBottom: 2,
  },
})

const VisitRecordPDF = ({ data }: { data: VisitRecordData }) => {
  const medicalRecord = JSON.parse(data.data ?? "{}") as {
    template: TemplateDetail
    formData: Record<string, any>
  }
  const parsedTemplate = templateDetailSchema.parse(medicalRecord.template)

  const visit = data.visit
  const appointment = data.appointment
  const patient = data.patient

  return (
    <Document title={`Visit Record ${visit.visit_number}`}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>VISITA N° {visit.visit_number}</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha y hora:</Text>
              <Text style={styles.value}>
                {visit.createdAt
                  ? format(parseISO(visit.createdAt ?? ""), "PP hh:mmaaa", { locale: es })
                  : "No especificado"}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tipo de atención:</Text>
              <Text style={styles.value}>{parsedTemplate.name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Modalidad:</Text>
              <Text style={styles.value}>
                {appointment?.mode_of_care
                  ? modesOfCare[appointment.mode_of_care as keyof typeof modesOfCare]
                  : "No especificado"}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Image src="/celagem-logo.jpg" alt="Celagem logo" />
          </View>
        </View>

        {/* Patient Section */}
        <View style={styles.patientSection}>
          <Text style={styles.sectionTitle}>DATOS DEL PACIENTE</Text>
          <View style={styles.patientGrid}>
            <View style={styles.patientColumn}>
              <View style={styles.row}>
                <Text>Nombre:</Text>
                <Text style={styles.value}>
                  {patient.first_name} {patient.first_last_name}
                </Text>
              </View>
              <View style={styles.row}>
                <Text>Sexo biológico:</Text>
                <Text style={styles.value}>
                  {biologicalSexTypes.find((b) => b.value === patient.biological_sex)?.label || "No especificado"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text>Fecha de nacimiento:</Text>
                <Text style={styles.value}>
                  {patient.birth_date ? format(new Date(patient.birth_date), "PP", { locale: es }) : "No especificado"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text>Documento:</Text>
                <Text style={styles.value}>
                  {documentTypes.find((d) => d.value === patient.document_type)?.short || ""}{" "}
                  {patient.document_number || "No especificado"}
                </Text>
              </View>
              <View style={styles.row}>
                <Text>Discapacidad:</Text>
                <Text style={styles.value}>
                  {disabilityTypes.find((d) => d.value === patient.disability_type)?.label || "No especificado"}
                </Text>
              </View>
            </View>
            <View style={styles.patientColumn}>
              <View style={styles.row}>
                <Text>Teléfono:</Text>
                <Text style={styles.value}>{patient.phone_number || "No especificado"}</Text>
              </View>
              <View style={styles.row}>
                <Text>Email:</Text>
                <Text style={styles.value}>{patient.email || "No especificado"}</Text>
              </View>
              <View style={styles.row}>
                <Text>Dirección de residencia:</Text>
                <Text style={styles.value}>{patient.address?.formatted_address || "No especificado"}</Text>
              </View>
              <View style={styles.row}>
                <Text>Clase:</Text>
                <Text style={styles.value}>{patient.class?.name || "No especificado"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Template Content */}
        <Text style={styles.templateTitle}>{parsedTemplate.name.toUpperCase()}</Text>

        {parsedTemplate.sections.map((section: Section) => {
          const sectionKey = medicalRecord.formData[section.name]

          if (section.type === "form") {
            return (
              <View key={section.id} style={styles.formSection}>
                {section.name && <Text style={styles.formSectionTitle}>{section.name.toUpperCase()}</Text>}

                <View style={styles.formGrid}>
                  {section.fields.map((field) => {
                    const rawValue = medicalRecord.formData[field.code]
                    const displayValue = resolveFieldDisplayValue(field, rawValue)
                    return (
                      <View key={field.id} style={styles.formField}>
                        <Text style={styles.fieldLabel}>{field.title}</Text>
                        <Text style={styles.fieldValue}>{displayValue}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          }

          if (section.type === "table") {
            const rows: Record<string, unknown>[] = Array.isArray(sectionKey) ? sectionKey : []

            return (
              <View key={section.id} style={styles.tableSection}>
                {section.name && <Text style={styles.formSectionTitle}>{section.name.toUpperCase()}</Text>}

                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    {section.fields.map((col) => (
                      <Text key={col.id} style={styles.tableHeaderCell}>
                        {col.title}
                      </Text>
                    ))}
                  </View>

                  {rows.length > 0 ? (
                    rows.map((row, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        {section.fields.map((col) => (
                          <Text key={col.id} style={styles.tableCell}>
                            {resolveFieldDisplayValue(col, row[col.code])}
                          </Text>
                        ))}
                      </View>
                    ))
                  ) : (
                    <View style={styles.tableRow}>
                      <Text style={[styles.emptyTableCell, { width: "100%" }]}>— Sin datos —</Text>
                    </View>
                  )}
                </View>
              </View>
            )
          }
          return null
        })}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerLeft}>
              <Text>CENTRO DE FERTILIDAD REPRONAT S.A.S.</Text>
              <Text>Informe de Visita Confidencial</Text>
              <Text>Este documento contiene información médica confidencial protegida por la ley.</Text>
            </View>
            <View style={styles.footerRight}>
              <Text style={styles.doctorName}>
                Dr. {appointment.doctor.first_name} {appointment.doctor.last_name}
              </Text>
              <Text>Médico Especialista</Text>
              <Text>
                Fecha de firma:{" "}
                {visit.signed_at ? format(new Date(visit.signed_at ?? ""), "PP", { locale: es }) : "No firmado"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default VisitRecordPDF
