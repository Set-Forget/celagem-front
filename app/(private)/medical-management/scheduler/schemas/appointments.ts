import { z } from 'zod'

export const newAppointmentSchema = z.object({
  start_date: z.string({ required_error: "La fecha de inicio es requerida" }).min(1, { message: "La fecha de inicio es requerida" }),
  end_date: z.string({ required_error: "La fecha de fin es requerida" }).min(1, { message: "La fecha de fin es requerida" }),
  start_time: z.string({ required_error: "La hora de inicio es requerida" }).min(1, { message: "La hora de inicio es requerida" }),
  end_time: z.string({ required_error: "La hora de fin es requerida" }).min(1, { message: "La hora de fin es requerida" }),
  created_by: z.string(),
  doctor_id: z.string({ required_error: "El doctor es requerido" }).min(1, { message: "El doctor es requerido" }),
  patient_id: z.string({ required_error: "El paciente es requerido" }).min(1, { message: "El paciente es requerido" }),
  clinic_id: z.string({ required_error: "La clinica es requerida" }).min(1, { message: "La clinica es requerida" }),
  status_id: z.number(),
  notes: z.string({ required_error: "Las notas son requeridas" }).optional(),
  attention_type: z.string({ required_error: "El tipo de atención es requerido" }).min(1, { message: "El tipo de atención es requerido" }),
  mode_of_care: z.enum(["VIRTUAL", "IN_PERSON"]),
  care_type_id: z.number(),
})

export const appointmentDetailSchema = z.object({
  id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  created_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  doctor: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  patient: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  clinic: z.string(),
  care_type: z.string(),
  status: z.string(),
  mode_of_care: z.string(),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const appointmentListSchema = z.object({
  id: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  created_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  doctor: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  patient: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  clinic_id: z.string(),
  care_type: z.string(),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]),
  mode_of_care: z.enum(["VIRTUAL", "IN_PERSON"]),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
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

export const appointmentDetailResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: appointmentDetailSchema,
})

export const doctorListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(doctorListSchema),
})

export const appointmentListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(appointmentListSchema),
})

export type NewAppointment = z.infer<typeof newAppointmentSchema>

export type AppointmentList = z.infer<typeof appointmentListSchema>
export type AppointmentListResponse = z.infer<typeof appointmentListResponseSchema>

export type AppointmentDetail = z.infer<typeof appointmentDetailSchema>
export type AppointmentDetailResponse = z.infer<typeof appointmentDetailResponseSchema>

export type DoctorList = z.infer<typeof doctorListSchema>
export type DoctorListResponse = z.infer<typeof doctorListResponseSchema>