import { date, z } from "zod";

export const journalEntryItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  account: z.string(),
  credit: z.number(),
  debit: z.number(),
  date: z.string().optional(),
  cost_center: z.string().optional(),
  balance: z.number().optional(),
});

export const journalEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  account: z.string(),
  amount: z.number(),
  date: z.string(),
  notes: z.string().optional(),
});

export const newJournalEntrySchema = z.object({
  title: z.string(),
  date: z.string(),
  notes: z.string().optional(),
  items: z.array(journalEntryItemSchema.omit({ id: true, balance: true, date: true })),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type JournalEntryItem = z.infer<typeof journalEntryItemSchema>;