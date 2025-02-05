import { z } from 'zod'

export const newAppointmentSchema = z.object({
  start_date: z.string({ required_error: "La fecha de inicio es requerida" }).min(1, { message: "La fecha de inicio es requerida" }),
  end_date: z.string({ required_error: "La fecha de fin es requerida" }).min(1, { message: "La fecha de fin es requerida" }),
  start_time: z.string({ required_error: "La hora de inicio es requerida" }).min(1, { message: "La hora de inicio es requerida" }),
  end_time: z.string({ required_error: "La hora de fin es requerida" }).min(1, { message: "La hora de fin es requerida" }),
  created_by: z.number(),
  doctor_id: z.number({ required_error: "El doctor es requerido" }).min(1, { message: "El doctor es requerido" }),
  patient_id: z.number({ required_error: "El paciente es requerido" }).min(1, { message: "El paciente es requerido" }),
  clinic_id: z.number({ required_error: "La clinica es requerida" }).min(1, { message: "La clinica es requerida" }),
  status_id: z.number({ required_error: "El estado es requerido" }).min(1, { message: "El estado es requerido" }),
  notes: z.string({ required_error: "Las notas son requeridas" }).min(1, { message: "Las notas son requeridas" }),
  attention_type: z.string({ required_error: "El tipo de atención es requerido" }).min(1, { message: "El tipo de atención es requerido" }),
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

export type AppointmentList = z.infer<typeof listAppointmentSchema>
export type NewAppointment = z.infer<typeof newAppointmentSchema>