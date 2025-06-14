import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { z } from "zod";

const journalEntryStatus = z.enum(["draft", "posted", "cancelled"]);

export const journalEntryListSchema = z.object({
  id: z.number(),
  sequence_id: z.string(),
  status: journalEntryStatus,
  date: z.string(),
  amount_total: z.number(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  journal: z.object({
    id: z.number(),
    name: z.string(),
  }),
  ref: z.string().optional(),
  internal_notes: z.string().optional(),
});

export const newJournalEntryItemSchema = z.object({
  account_id: z.number({ required_error: "La cuenta es requerida" }),
  debit: z.number({ required_error: "El debe es requerido" }).nonnegative({ message: "El debe es requerido" }),
  credit: z.number({ required_error: "El haber es requerido" }).nonnegative({ message: "El haber es requerido" }),
  name: z.string().optional(),
  taxes_id: z.array(z.number()).optional()
}).refine(
  (data) => data.debit > 0 || data.credit > 0,
  {
    message: "Debe ingresar un importe en Debe o en Haber (al menos uno mayor que 0)",
    path: ["debit"],
  }
);

export const newJournalEntrySchema = z.object({
  date: z
    .custom<CalendarDate>((v) => v instanceof CalendarDate, {
      message: "La fecha del asiento es requerida",
    })
    .refine(d => d.compare(today(getLocalTimeZone())) <= 0, {
      message: "La fecha del asiento no puede ser posterior al día de hoy",
    }),
  currency: z.number({ required_error: "La moneda es requerida" }),
  journal: z.number({ required_error: "El diario contable es requerido" }).optional(),
  ref: z.string().optional(),
  internal_notes: z.string().optional(), // ! No existe en la API, pero lo agregué para poder usarlo en el formulario.
  items: z.array(newJournalEntryItemSchema).min(1, { message: "Al menos un item es requerido" })
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
  sequence_id: z.string(),
  status: journalEntryStatus,
  date: z.string(),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  journal: z.object({
    id: z.number(),
    name: z.string(),
  }),
  ref: z.string().optional(),
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

export type JournalEntryStatus = z.infer<typeof journalEntryStatus>;