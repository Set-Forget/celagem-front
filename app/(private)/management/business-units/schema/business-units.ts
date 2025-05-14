// import { businessUnitPatientSchema, businessUnitUserSchema } from '@/lib/schemas/business-units';
import { z } from 'zod';

export const newBusinessUnitGeneralSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .nonempty({ message: 'El nombre es requerido' })
    .default(''),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .nonempty({ message: 'La descripción es requerida' })
    .default(''),
  company_id: z
    .string({ required_error: 'La sede es requerida' })
    .nonempty({ message: 'La sede es requerida' })
    .default(''),
  created_by: z.string(),
});

export const newBusinessUnitSchema = newBusinessUnitGeneralSchema;

export const newBusinessUnitUserSchema = z.object({
  user_id: z
    .string({ required_error: 'El usuario es requerido' })
    .min(1, { message: 'El usuario es requerido' }),
});

export const newBusinessUnitPatientSchema = z.object({
  patient_id: z
    .string({ required_error: 'El paciente es requerido' })
    .min(1, { message: 'El paciente es requerido' }),
});

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
  created_at: z.string(),
  created_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  modified_at: z.string(),
  updated_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
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

export const businessUnitGetResponseSchema = z.object({
  // Get by id
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

export const businessUnitUpdateBodySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const businessUnitAddUserSchema = z.object({
  user_ids: z.array(z.string()),
});

export const businessUnitAddPatientSchema = z.object({
  patient_ids: z.array(z.string()),
});

export type BusinessUnit = z.infer<typeof businessUnitSchema>;
export type BusinessUnitPatient = z.infer<typeof businessUnitPatientSchema>;
export type BusinessUnitUser = z.infer<typeof businessUnitUserSchema>;
export type BusinessUnitsListResponse = z.infer<
  typeof businessUnitsListResponseSchema
>;
export type BusinessUnitResponse = z.infer<typeof businessUnitResponseSchema>;
export type BusinessUnitGetResponse = z.infer<
  typeof businessUnitGetResponseSchema
>;
export type BusinessUnitOperationResponse = z.infer<
  typeof businessUnitOperationResponseSchema
>;
export type BusinessUnitCreateBody = z.infer<
  typeof businessUnitCreateBodySchema
>;
export type BusinessUnitUpdateBody = z.infer<
  typeof businessUnitUpdateBodySchema
>;
export type BusinessUnitAddUser = z.infer<typeof businessUnitAddUserSchema>;
export type BusinessUnitAddPatient = z.infer<
  typeof businessUnitAddPatientSchema
>;
