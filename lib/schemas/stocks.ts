import { z } from "zod";

export const stockLocationListSchema = z.object({
  id: z.number(),
  name: z.string(),
  complete_name: z.string(),
  usage: z.enum(["internal", "view", "supplier", "customer", "transit", "inventory", "production"]),
  active: z.boolean(),
  parent: z.string(),
  has_products: z.boolean(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const stockLocationListResponseSchema = z.object({
  status: z.string(),
  data: z.array(stockLocationListSchema),
});

export type StockLocationListResponse = z.infer<typeof stockLocationListResponseSchema>;
export type StockLocationList = z.infer<typeof stockLocationListSchema>;