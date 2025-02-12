import { z } from 'zod'

export const newAppointmentSchema = z.object({
  start_date: z.string({ required_error: "La fecha de inicio es requerida" }).min(1, { message: "La fecha de inicio es requerida" }),
  end_date: z.string({ required_error: "La fecha de fin es requerida" }).min(1, { message: "La fecha de fin es requerida" }),
  created_by: z.string(),
  doctor_id: z.string({ required_error: "El doctor es requerido" }).min(1, { message: "El doctor es requerido" }),
  patient_id: z.string({ required_error: "El paciente es requerido" }).min(1, { message: "El paciente es requerido" }),
  clinic_id: z.string({ required_error: "La clinica es requerida" }).min(1, { message: "La clinica es requerida" }),
  status_id: z.number(),
  notes: z.string({ required_error: "Las notas son requeridas" }).min(1, { message: "Las notas son requeridas" }).optional(),
  attention_type: z.string({ required_error: "El tipo de atención es requerido" }).min(1, { message: "El tipo de atención es requerido" }),
  mode_of_care: z.enum(["VIRTUAL", "IN_PERSON"]),
})

export const listAppointmentSchema = z.object({
  id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  created_by: z.number(),
  doctor_id: z.number(),
  patient_id: z.number(),
  clinic_id: z.number(),
  care_type: z.string(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]),
  mode_of_care: z.enum(["VIRTUAL", "IN_PERSON"]),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const patientListSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  first_name: z.string(),
  first_last_name: z.string(),
  second_last_name: z.string(),
})

export const doctorListSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  is_email_confirmed: z.boolean(),
  created_at: z.string(),
  modified_at: z.string(),
})

export const patientListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(patientListSchema),
})

export const doctorListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(doctorListSchema),
})

export type AppointmentList = z.infer<typeof listAppointmentSchema>

export type NewAppointment = z.infer<typeof newAppointmentSchema>
export type PatientList = z.infer<typeof patientListSchema>
export type PatientListResponse = z.infer<typeof patientListResponseSchema>
export type DoctorList = z.infer<typeof doctorListSchema>
export type DoctorListResponse = z.infer<typeof doctorListResponseSchema>