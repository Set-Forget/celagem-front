import { z } from "zod";

export const newVisitSchema = z.object({
  // ! No existen aún.
  appointment_id: z.string(),
  notes: z.string().optional(),
  procedures: z.array(z.string()),
  template_data: z.string(),
})

export const newVisitResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.object({
    // ! Es un mock, no se lo que devuelve.
    id: z.string(),
    appointment_id: z.string(),
    notes: z.string().optional(),
    procedures: z.array(z.string()),
    template_data: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
})

export type NewVisit = z.infer<typeof newVisitSchema>
export type NewVisitResponse = z.infer<typeof newVisitResponseSchema>