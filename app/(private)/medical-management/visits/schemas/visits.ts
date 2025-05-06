import { z } from "zod";

export const visitListSchema = z.object({
  id: z.string(),
  appointment_id: z.string(),
  visit_number: z.number(),
  createdAt: z.string(),
  status: z.enum(["DRAFT", "SIGNED"]),
})

export const visitListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(visitListSchema),
})

export const visitDetailSchema = z.object({
  id: z.string(),
  appointment_id: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  visit_number: z.number(),
  doctor: z.object({
    id: z.string(),
    first_name: z.string(),
  }),
  medical_record: z.string(),
  status: z.enum(["DRAFT", "SIGNED"]),
  signed_at: z.string().optional(),
})

export const visitDetailResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: visitDetailSchema,
})

export const createVisitSchema = z.object({
  appointment_id: z.string(),
  medical_record: z.object({
    name: z.string(),
    data: z.string()
  })
})

export const createVisitResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    appointment_id: z.string(),
    notes: z.string().optional(),
    createdAt: z.string(),
    visit_number: z.number(),
    doctor: z.object({
      id: z.string(),
      first_name: z.string(),
    }),
  }),
})

export type NewVisit = z.infer<typeof createVisitSchema>
export type NewVisitResponse = z.infer<typeof createVisitResponseSchema>

export type VisitList = z.infer<typeof visitListSchema>
export type VisitListResponse = z.infer<typeof visitListResponseSchema>

export type VisitDetail = z.infer<typeof visitDetailSchema>
export type VisitDetailResponse = z.infer<typeof visitDetailResponseSchema>
