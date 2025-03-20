// import { businessUnitPatientSchema, businessUnitUserSchema } from '@/lib/schemas/business-units';
import { z } from 'zod';

export const businessUnitPatientSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

export const businessUnitUserSchema = z.object({
  id: z.string(),
  email: z.string(),
});

export const businessUnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
  users: z.array(businessUnitUserSchema),
  patients: z.array(businessUnitPatientSchema),
  created_at: z.date(),
  modified_at: z.date(),
});

export const businessUnitsListResponseSchema = z.object({
  // List
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.array(businessUnitSchema),
});

export const businessUnitResponseSchema = z.object({
  // Create, Update
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: businessUnitSchema,
});

export const businessUnitRetrieveResponseSchema = z.object({
  // Retrieve by id
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: businessUnitSchema.merge(
    z.object({
      users: z.array(businessUnitUserSchema),
      patients: z.array(businessUnitPatientSchema),
    })
  ),
  details: z.string(),
});

export const businessUnitOperationResponseSchema = z.object({
  // Delete, Add User, Delete User, Add Patient, Delete Patient
  status: z.string(),
  code: z.number(),
  message: z.string(),
  details: z.string(),
  data: z.string(),
});

export const businessUnitCreateBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
});

export const businessUnitEditBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const businessUnitAddUserSchema = z.object({
  user_id: z.string(),
});

export const businessUnitAddPatientSchema = z.object({
  patient_id: z.string(),
});

export type BusinessUnit = z.infer<typeof businessUnitSchema>;
export type BusinessUnitPatient = z.infer<typeof businessUnitPatientSchema>;
export type BusinessUnitUser = z.infer<typeof businessUnitUserSchema>;
export type BusinessUnitsListResponse = z.infer<
  typeof businessUnitsListResponseSchema
>;
export type BusinessUnitResponse = z.infer<typeof businessUnitResponseSchema>;
export type BusinessUnitRetrieveResponse = z.infer<
  typeof businessUnitRetrieveResponseSchema
>;
export type BusinessUnitOperationResponse = z.infer<
  typeof businessUnitOperationResponseSchema
>;
export type BusinessUnitCreateBody = z.infer<
  typeof businessUnitCreateBodySchema
>;
export type BusinessUnitEditBody = z.infer<typeof businessUnitEditBodySchema>;
export type BusinessUnitAddUser = z.infer<typeof businessUnitAddUserSchema>;
export type BusinessUnitAddPatient = z.infer<
  typeof businessUnitAddPatientSchema
>;