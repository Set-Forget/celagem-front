import { z } from "zod";

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
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type JournalEntryItem = z.infer<typeof journalEntryItemSchema>;