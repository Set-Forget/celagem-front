import { z } from "zod";

export const MaterialsSchema = z.object({
  id: z.number(),
  location: z.enum(['Sede Asistencial Bogotá']),
  code: z.string(),
  name: z.string(),
  unit: z.string(),
  fraction: z.string(),
  average_price: z.number(),
})

export type Materials = z.infer<typeof MaterialsSchema>
