import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const journalEntryListSchema = z.object({
  id: z.number(),
  number: z.string(),
  status: z.string(), // ? No se que estados tiene, pero no deberían ser necesarios.
  date: z.string(),
  amount_total: z.number(),
  currency: z.string(),
  ref: z.string().optional(),
  internal_notes: z.string().optional(),
  // ! Falta journal.
});

export const newJournalEntrySchema = z.object({
  number: z.string().optional(), // @ Debería generarse automáticamente.
  date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha del asiento es requerida" }),
  currency: z.number({ required_error: "La moneda es requerida" }),
  journal: z.number({ required_error: "El diario contable es requerido" }),
  ref: z.string().optional(),
  internal_notes: z.string().optional(), // ! No existe en la API, pero lo agregué para poder usarlo en el formulario.
  items: z.array(
    z.object({
      account_id: z.number({ required_error: "La cuenta es requerida" }),
      debit: z.number({ required_error: "El debe es requerido" }).min(0, { message: "El debe es requerido" }),
      credit: z.number({ required_error: "El haber es requerido" }).min(0, { message: "El haber es requerido" }),
      name: z.string(),
      taxes_id: z.array(z.number()).optional()
    })
  ).min(1, { message: "Al menos un item es requerido" })
})

export const newJournalEntryResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  })
})

export const journalEntryListResponseSchema = z.object({
  status: z.string(),
  data: z.array(journalEntryListSchema),
});

export const journalEntryLineSchema = z.object({
  id: z.string(),
  account_id: z.number(),
  account_name: z.string(),
  debit: z.number(),
  credit: z.number(),
  name: z.string(),
  taxes: z.array(z.object({
    id: z.number(),
    name: z.string(),
    amount: z.number(),
  })),
  tax_amount: z.number(),
});

export const journalEntryDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  status: z.enum(["draft", "posted"]),
  date: z.string(),
  currency: z.string(),
  amount_total: z.number(),
  ref: z.string().optional(),
  journal: z.object({
    id: z.number(),
    name: z.string(),
  }),
  internal_notes: z.string().optional(),
  items: z.array(journalEntryLineSchema),
});

export const journalEntryDetailResponseSchema = z.object({
  status: z.string(),
  data: journalEntryDetailSchema,
});

export type JournalEntryList = z.infer<typeof journalEntryListSchema>;
export type JournalEntryListResponse = z.infer<typeof journalEntryListResponseSchema>;

export type JournalEntryDetail = z.infer<typeof journalEntryDetailSchema>;
export type JournalEntryDetailResponse = z.infer<typeof journalEntryDetailResponseSchema>;

export type JournalEntryItem = z.infer<typeof journalEntryLineSchema>;

export type NewJournalEntry = z.infer<typeof newJournalEntrySchema>;
export type NewJournalEntryResponse = z.infer<typeof newJournalEntryResponseSchema>;