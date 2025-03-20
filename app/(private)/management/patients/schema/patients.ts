import { z } from 'zod';
import { classesSchema } from '../../classes/schema/classes';

export const birth_place_schema = z.object({
  id: z.string(),
  place_id: z.string(),
  formatted_address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const addressSchema = z.object({
  id: z.string(),
  place_id: z.string(),
  formatted_address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export const fiscalSchema = z.object({
  id: z.string(),
  registered_name: z.string(),
  fiscal_category: z.string(),
  customer_type: z.string(),
  tax_id: z.string(),
});

export const patientsSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  document_type: z.string(),
  document_number: z.string(),
  sex: z.string(),
  birthdate: z.date(),
  marital_status: z.string(),
  phone_number: z.string(),
  email: z.string(),
  birth_place: birth_place_schema,
  address: addressSchema,
  class: classesSchema,
  fiscal: fiscalSchema,
  created_at: z.string(),
  modified_at: z.string(),
});

export type Patients = z.infer<typeof patientsSchema>;
