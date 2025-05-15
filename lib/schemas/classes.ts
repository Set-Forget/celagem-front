// import { z } from 'zod';

// export const classesSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   created_at: z.date(),
//   modified_at: z.date(),
// })

// export const classesListSchema = z.object({ // List
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: z.array(classesSchema),
// })

// export const classResponseSchema = z.object({  // Create, Update, Retrieve
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: classesSchema,
// })

// export const classOperationResponseSchema = z.object({ // Delete
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: z.string(),
// })

// export const classCreateBodySchema = z.object({
//   name: z.string(),
//   company_id: z.string(),
// });

// export const classEditBodySchema = z.object({
//   name: z.string(),
// });

// export type Classes = z.infer<typeof classesSchema>;
// export type ClassesListResponse = z.infer<typeof classesListSchema>;
// export type ClassResponse = z.infer<typeof classResponseSchema>;
// export type ClassOperationResponse = z.infer<typeof classOperationResponseSchema>;
// export type ClassCreateBody = z.infer<typeof classCreateBodySchema>;
// export type ClassEditBody = z.infer<typeof classEditBodySchema>;

