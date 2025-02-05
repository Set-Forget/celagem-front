import { z } from "zod";

export const newPatientSchema = z.object({
  //Datos personales
  link_type: z.enum(["subsidized", "contributor", "beneficiary", "additional", "particular"], { required_error: "El tipo de vinculación es requerido" }),
  headquarter_id: z.string().optional(),
  document_type: z.enum(["adult-without-identification", "citizen-id", "dni", "unique-population-registration-key", "immigration-card", "minor-without-identification", "passport", "civil-registry", "cuit"], { required_error: "El tipo de documento es requerido" }),
  document_number: z.string({ required_error: "El número de documento es requerido" }),
  first_name: z.string({ required_error: "El nombre es requerido" }),
  last_name: z.string({ required_error: "El apellido es requerido" }),
  biological_sex: z.enum(["male", "female", "both"], { required_error: "El sexo biológico es requerido" }),
  gender_identity: z.enum(["cisgender", "no-binary", "transgender", "fluent", "other"]).optional(),
  birthdate: z.string({ required_error: "La fecha de nacimiento es requerida" }),
  birth_place: z.string({ required_error: "El lugar de nacimiento es requerido" }),
  disability: z.boolean(),
  disability_type_id: z.enum(["visual", "hearing", "physical", "mental", "intellectual", "multiple", "psychosocial", "deafblindness", "other"]).optional(),
  marital_status: z.enum(["single", "married", "divorced", "widowed"], { required_error: "El estado civil es requerido" }),
  residence_address: z.string({ required_error: "La dirección de residencia es requerida" }),
  residence_city_id: z.string({ required_error: "La ciudad de residencia es requerida" }),
  phone_number: z.string({ required_error: "El número de teléfono es requerido" }),
  email: z.string().optional(),
  role: z.enum(["ovo-contributor", "pregnant", "semen-contributor"], { required_error: "El rol es requerido" }),

  //Datos del acompañante
  companion_first_name: z.string().optional(),
  companion_last_name: z.string().optional(),
  companion_residence_address: z.string().optional(),
  companion_residence_city_id: z.string().optional(),
  companion_relationship: z.string().optional(),

  //Datos del responsable
  responsible_first_name: z.string().optional(),
  responsible_last_name: z.string().optional(),
  responsible_residence_address: z.string().optional(),
  responsible_phone_number: z.string().optional(),
  responsible_document_type: z.string().optional(),
  responsible_document_number: z.string().optional(),
  responsible_relationship: z.string().optional(),

  //Datos fiscales
  registered_name: z.string().optional(),
  fiscal_category: z.string().optional(),
  customer_type: z.string().optional(),
  tax_id: z.string().optional(),
})