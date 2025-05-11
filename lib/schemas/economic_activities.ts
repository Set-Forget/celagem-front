import { z } from "zod";

export const economicActivitySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
})

export const economicActivityListResponseSchema = z.object({
  status: z.string(),
  data: z.array(economicActivitySchema),
})

export type EconomicActivityList = z.infer<typeof economicActivitySchema>;
export type EconomicActivityListResponse = z.infer<typeof economicActivityListResponseSchema>;