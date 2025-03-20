// import { patientsSchema } from '@/app/(private)/management/patients/schema/patients';
// import { z } from 'zod';

// export const patientsListSchema = z.object({
//   // List
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: z.array(patientsSchema),
// });

// export const patientResponseSchema = z.object({
//   // Create, Update, Retrieve
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: patientsSchema,
// });

// export const patientOperationResponseSchema = z.object({
//   // Delete
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: z.string(),
// });

// export const patientCreateBodySchema = z.object({
//   name: z.string(),
//   company_id: z.string(),
// });

// export const patientEditBodySchema = z.object({
//   name: z.string(),
// });

// export type ClassesListResponse = z.infer<typeof classesListSchema>;
// export type ClassResponse = z.infer<typeof classResponseSchema>;
// export type ClassOperationResponse = z.infer<
//   typeof classOperationResponseSchema
// >;
// export type ClassCreateBody = z.infer<typeof classCreateBodySchema>;
// export type ClassEditBody = z.infer<typeof classEditBodySchema>;
