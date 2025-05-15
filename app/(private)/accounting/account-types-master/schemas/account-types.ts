import { z } from "zod";

export const accountTypeSchema = z.object({
  name: z.string(),
  report: z.string(),
  category: z.string(),
  // id: z.string(),
})

// export const newAccountTypeSchema = accountTypeSchema.omit({ id: true })

export type AccountType = z.infer<typeof accountTypeSchema>
// export type NewAccountType = z.infer<typeof accountTypeSchema>;