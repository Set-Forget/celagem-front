import { z } from "zod";

export const newPatientSchema = z.object({
  //Datos personales
  research_participant: z.boolean(),
  first_name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  first_last_name: z.string({ required_error: "El apellido es requerido" }).min(1, { message: "El apellido es requerido" }),
  second_last_name: z.string().optional(),
  sex: z.enum(["male", "female", "both"], { required_error: "El sexo biológico es requerido" }),
  gender_identity: z.enum(["cisgender", "no-binary", "transgender", "fluent", "other"]).optional(),
  birthdate: z.string({ required_error: "La fecha de nacimiento es requerida" }),
  birth_place: z.object({
    place_id: z.string({ required_error: "El lugar de nacimiento es requerido" }).min(1, { message: "El lugar de nacimiento es requerido" }),
    formatted_address: z.string({ required_error: "El lugar de nacimiento es requerido" }).min(1, { message: "El lugar de nacimiento es requerido" }),
  }, { required_error: "El lugar de nacimiento es requerido" }),
  disability: z.boolean(),
  disability_type: z.enum(["visual", "hearing", "physical", "mental", "intellectual", "multiple", "psychosocial", "deafblindness", "other"]).optional(),
  socioeconomic_level: z.enum(["1", "2", "3", "4", "particular", "others"]).optional(),
  residence_zone: z.enum(["urban", "rural", "others"]).optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  insurance_provider: z.string().optional(),
  referring_entity: z.string({ required_error: "La entidad referente es requerida" }).min(1, { message: "La entidad referente es requerida" }),
  document_type: z.enum(["adult-without-identification", "citizen-id", "dni", "unique-population-registration-key", "immigration-card", "minor-without-identification", "passport", "civil-registry", "cuit"], { required_error: "El tipo de documento es requerido" }),
  document_number: z.string({ required_error: "El número de documento es requerido" }).min(1, { message: "El número de documento es requerido" }),
  marital_status: z.enum(["single", "married", "divorced", "widowed"], { required_error: "El estado civil es requerido" }),
  phone_number: z.string({ required_error: "El número de teléfono es requerido" }),
  email: z.string().optional(),
  class_id: z.string().min(1, { message: "La clase es requerida" }),
  address: z.object({
    place_id: z.string({ required_error: "El lugar es requerido" }).min(1, { message: "El lugar es requerido" }),
    formatted_address: z.string({ required_error: "La dirección es requerida" }).min(1, { message: "La dirección es requerida" }),
  }, { required_error: "La dirección es requerida" }),

  //Datos fiscales
  fiscal: z.object({
    registered_name: z.string({ required_error: "La razón social es requerida" }).min(1, { message: "La razón social es requerida" }),
    fiscal_category: z.string({ required_error: "La categoría fiscal es requerida" }).min(1, { message: "La categoría fiscal es requerida" }),
    customer_type: z.string({ required_error: "El tipo de cliente es requerido" }).min(1, { message: "El tipo de cliente es requerido" }),
    tax_id: z.string({ required_error: "El número de identificación fiscal es requerido" }).min(1, { message: "El número de identificación fiscal es requerido" }),
  }, { required_error: "Los datos fiscales son requeridos" }),

  //link_type: z.enum(["subsidized", "contributor", "beneficiary", "additional", "particular"], { required_error: "El tipo de vinculación es requerido" }),
  //headquarter_id: z.string().optional(),


  //Datos del acompañante
  //companion_first_name: z.string().optional(),
  //companion_last_name: z.string().optional(),
  //companion_residence_address: z.string().optional(),
  //companion_residence_city_id: z.string().optional(),
  //companion_relationship: z.string().optional(),

  //Datos del responsable
  //responsible_first_name: z.string().optional(),
  //responsible_last_name: z.string().optional(),
  //responsible_residence_address: z.string().optional(),
  //responsible_phone_number: z.string().optional(),
  //responsible_document_type: z.string().optional(),
  //responsible_document_number: z.string().optional(),
  //responsible_relationship: z.string().optional(),
})

export const patientListSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  first_last_name: z.string(),
  second_last_name: z.string(),
  first_name: z.string(),
})

export const patientListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(patientListSchema),
})

export type PatientList = z.infer<typeof patientListSchema>;
export type PatientListResponse = z.infer<typeof patientListResponseSchema>;