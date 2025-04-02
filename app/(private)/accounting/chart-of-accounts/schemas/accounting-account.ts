import { z } from "zod";

export const accountingAccountListSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  account_type: z.string(),
  group: z.string(),
  active: z.boolean(),
  company: z.string(),
})

export const accountingAccountListResponseSchema = z.object({
  status: z.string(),
  data: z.array(accountingAccountListSchema),
})

export type AccountingAccountList = z.infer<typeof accountingAccountListSchema>;
export type AccountingAccountListResponse = z.infer<typeof accountingAccountListResponseSchema>;

