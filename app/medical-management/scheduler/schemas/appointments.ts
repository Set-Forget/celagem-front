import { z } from 'zod'

export const newAppointmentSchema = z.object({
  time_allocation: z.enum(["diary", "consecutive"], { required_error: "La asignación de tiempo es requerida" }),
  start_date: z.string({ required_error: "La fecha de inicio es requerida" }).min(1, { message: "La fecha de inicio es requerida" }),
  end_date: z.string({ required_error: "La fecha de fin es requerida" }).min(1, { message: "La fecha de fin es requerida" }),
  attention_type: z.enum(["ovo-contributor", "pregnant", "semen-contributor"], { required_error: "El tipo de atención es requerido" }),
  user_id: z.string({ required_error: "El usuario es requerido" }),
  headquarter_id: z.string({ required_error: "La sede es requerida" }),
  office: z.string({ required_error: "El consultorio es requerido" }).optional(),
  notes: z.string().optional(),
  patient_id: z.string({ required_error: "El paciente es requerido" })
})