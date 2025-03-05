import { z } from "zod";

export const searchPlacesResponse = z.object({
  predictions: z.array(z.object({
    description: z.string(),
    place_id: z.string(),
  })),
  status: z.string(),
});

export type SearchPlacesResponse = z.infer<typeof searchPlacesResponse>;