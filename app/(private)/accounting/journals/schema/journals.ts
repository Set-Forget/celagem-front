import { z } from "zod";

export const journalTypes = z.enum(['sale', 'purchase', 'cash', 'bank', 'credit', 'general'], { required_error: "El tipo de diario es requerido" })
export const journalReferenceTypes = z.enum(['none', 'partner', 'invoice'], { required_error: "El tipo de referencia de diario es requerido" })

export const journalListSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  type: journalTypes,
  active: z.boolean(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
});

export const newJournalSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  code: z.string({ required_error: "El código es requerido" }).min(1, { message: "El código es requerido" }),
  type: journalTypes,
  company: z.number().optional(),
  currency: z.number({ required_error: "La moneda es requerida" }).min(1, { message: "La moneda es requerida" }),
  default_account_id: z.number({ required_error: "La cuenta por defecto es requerida" }).min(1, { message: "La cuenta por defecto es requerida" }),
  suspense_account_id: z.number().optional(),
  invoice_reference_type: journalReferenceTypes,
})

export const journalListResponseSchema = z.object({
  status: z.string(),
  data: z.array(journalListSchema),
})

export const newJournalResponseSchema = z.object({
  status: z.string(),
  data: journalListSchema,
})

export type JournalListResponse = z.infer<typeof journalListResponseSchema>
export type JournalList = z.infer<typeof journalListSchema>

export type NewJournal = z.infer<typeof newJournalSchema>
export type NewJournalResponse = z.infer<typeof newJournalResponseSchema>

export type JournalTypes = z.infer<typeof journalTypes>
export type JournalReferenceTypes = z.infer<typeof journalReferenceTypes>