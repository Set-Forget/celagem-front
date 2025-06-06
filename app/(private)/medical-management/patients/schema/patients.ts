import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

export const newPatientGeneralSchema = z.object({
  first_last_name: z
    .string({ required_error: "El apellido es requerido", })
    .nonempty({ message: "El apellido es requerido" })
    .default(""),
  first_name: z
    .string({ required_error: "El nombre es requerido" })
    .nonempty({ message: "El nombre es requerido" })
    .default(""),
  biological_sex: z
    .enum(["Male", "Female", "Both"], { required_error: "El sexo biológico es requerido" }),
  gender_identity: z
    .enum(["Cisgender", "NoBinary", "Transgender", "Fluent", "Other"])
    .optional(),
  birthdate: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de nacimiento es requerida" }),
  birth_place: z
    .object({
      place_id: z
        .string({ required_error: "El lugar de nacimiento es requerido" })
        .nonempty({ message: "El lugar de nacimiento es requerido" }),
      formatted_address: z
        .string({ required_error: "El lugar de nacimiento es requerido" })
        .nonempty({ message: "El lugar de nacimiento es requerido" }),
    }, { required_error: "El lugar de nacimiento es requerido" }),
  disability_type: z
    .enum(["Visual", "Hearing", "Physical", "Mental", "Intellectual", "Multiple", "Psychosocial", "Deafblindness", "Other"])
    .optional(),
  document_type: z
    .enum([
      "AdultWithoutIdentification",
      "CitizenId",
      "Dni",
      "UniquePopulationRegistrationKey",
      "ImmigrationCard",
      "ResearchParticipant",
      "MinorWithoutIdentification",
      "Passport",
      "UniquePersonalIdentificationNumber",
      "CivilRegistry",
      "IdentityCard",
      "SpecialPermanencePermission",
      "PersonalProtectionPermission",
      "UniqueTaxpayerIdentificationKey",
      "NationalElectoralInstitute",
      "FederalContributorRegistry",
      "MigrationForm"
    ], { required_error: "El tipo de documento es requerido" }),
  document_number: z
    .string({ required_error: "El número de documento es requerido" })
    .nonempty({ message: "El número de documento es requerido" })
    .default(""),
  father_name: z
    .string()
    .optional()
    .default(""),
  mother_name: z
    .string({ required_error: "El nombre de la madre es requerido" })
    .nonempty({ message: "El nombre de la madre es requerido" })
    .default(""),
  marital_status: z
    .enum(["Single", "Married", "Divorced", "Widowed"], { required_error: "El estado civil es requerido" }),
  created_by: z
    .string()
    .optional(),

  // @ Ignorado
  //second_last_name: z.string().optional(),
  //socioeconomic_level: z.enum(["1", "2", "3", "4", "particular", "others"]).optional(),
  //research_participant: z.boolean().optional(),
})

export const newPatientAffiliationSchema = z.object({
  class_id: z
    .string({ required_error: "La clase es requerida" })
    .min(1, { message: "La clase es requerida" }),
  company_id: z
    .string({ required_error: "La compañia es requerida" })
    .nonempty({ message: "La compañia es requerida" }),
  clinics: z
    .array(z.string().nonempty({ message: "La clínica es requerida" }), { required_error: "La clínica es requerida" })
    .nonempty({ message: "Debe seleccionar al menos una clínica" }),
  insurance_provider: z.string().optional(),
  referring_entity: z
    .string({ required_error: "La entidad referente es requerida" })
    .nonempty({ message: "La entidad referente es requerida" })
    .default(""),
  linkage: z
    .string({ required_error: "El vínculo es requerido" })
    .nonempty({ message: "El vínculo es requerido" })
    .default(""),
})

export const newPatientContactSchema = z.object({
  phone_number: z
    .string({ required_error: "El número de teléfono es requerido" })
    .default(""),
  email: z
    .string({ required_error: "El correo electrónico es requerido" })
    .email({ message: "El correo electrónico es inválido" })
    .default(""),
  address: z
    .object({
      place_id: z.string({ required_error: "El lugar es requerido" }).min(1, { message: "El lugar es requerido" }),
      formatted_address: z.string({ required_error: "La dirección es requerida" }).min(1, { message: "La dirección es requerida" }),
    }, { required_error: "La dirección es requerida" }),
})

export const newPatientFiscalSchema = z.object({
  fiscal: z.object({
    registered_name: z.string().optional(),
    fiscal_category: z.string({ required_error: "La categoría fiscal es requerida" }).min(1, { message: "La categoría fiscal es requerida" }),
    customer_type: z.string({ required_error: "El tipo de cliente es requerido" }).min(1, { message: "El tipo de cliente es requerido" }),
    tax_id: z.string({ required_error: "El número de identificación fiscal es requerido" }).min(1, { message: "El número de identificación fiscal es requerido" }),
  }, { required_error: "Los datos fiscales son requeridos" }),
})

export const newPatientCompanionSchema = z.object({
  companion: z.object({
    name: z.string({ required_error: "El nombre del acompañante es requerido" }).min(1, { message: "El nombre del acompañante es requerido" }),
    address: z.object({
      place_id: z.string(),
      formatted_address: z.string(),
    }).optional(),
    phone_number: z.string().optional(),
    relationship: z.string().optional(),
  }),
})

export const newPatientCaregiverSchema = z.object({
  caregiver: z.object({
    name: z.string({ required_error: "El nombre del responsable es requerido" }).min(1, { message: "El nombre del responsable es requerido" }),
    document_type: z.string({ required_error: "El tipo de documento del responsable es requerido" }).min(1, { message: "El tipo de documento del responsable es requerido" }),
    document_number: z.string({ required_error: "El número de documento del responsable es requerido" }).min(1, { message: "El número de documento del responsable es requerido" }),
    address: z.object({
      place_id: z.string(),
      formatted_address: z.string(),
    }).optional(),
    phone_number: z.string({ required_error: "El número de teléfono del responsable es requerido" }).min(1, { message: "El número de teléfono del responsable es requerido" }),
    relationship: z.string({ required_error: "La relación con el responsable es requerida" }).min(1, { message: "La relación con el responsable es requerida" }),
  }),
})

export const newPatientCareCompanySchema = z.object({
  care_company_plan: z.object({
    care_company_id: z.string({ required_error: "La empresa de atención es requerida" }).min(1, { message: "La empresa de atención es requerida" }),
    contract_number: z.string().optional(),
    coverage: z.string({ required_error: "La cobertura es requerida" }).min(1, { message: "La cobertura es requerida" }),
  }),
})

export const newPatientSchema = newPatientGeneralSchema
  .merge(newPatientFiscalSchema)
  .merge(newPatientCompanionSchema)
  .merge(newPatientCaregiverSchema)
  .merge(newPatientCareCompanySchema)
  .merge(newPatientAffiliationSchema)
  .merge(newPatientContactSchema)

export const patientListSchema = z.object({
  id: z.string(),
  first_last_name: z.string(),
  second_last_name: z.string(),
  first_name: z.string(),
  document_type: z.string(),
  document_number: z.string(),
  phone_number: z.string(),
  class: z.object({
    id: z.string(),
    name: z.string(),
  }),
})

export const patientCareCompanyListSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const patientDetailSchema = z.object({
  id: z.string(),
  first_last_name: z.string(),
  second_last_name: z.string(),
  first_name: z.string(),
  document_type: z.enum([
    "AdultWithoutIdentification",
    "CitizenId",
    "Dni",
    "UniquePopulationRegistrationKey",
    "ImmigrationCard",
    "ResearchParticipant",
    "MinorWithoutIdentification",
    "Passport",
    "UniquePersonalIdentificationNumber",
    "CivilRegistry",
    "IdentityCard",
    "SpecialPermanencePermission",
    "PersonalProtectionPermission",
    "UniqueTaxpayerIdentificationKey",
    "NationalElectoralInstitute",
    "FederalContributorRegistry",
    "MigrationForm"
  ], { required_error: "El tipo de documento es requerido" }),
  document_number: z.string(),
  phone_number: z.string(),
  email: z.string(),
  research_participant: z.boolean(),
  biological_sex: z.enum(["Male", "Female", "Both"]),
  gender_identity: z.enum(["Cisgender", "NoBinary", "Transgender", "Fluent", "Other"]),
  birth_date: z.string(),
  birth_place: z.object({
    id: z.string(),
    place_id: z.string(),
    formatted_address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  disability_type: z.enum(["Visual", "Hearing", "Physical", "Mental", "Intellectual", "Multiple", "Psychosocial", "Deafblindness", "Other"]),
  socioeconomic_level: z.string().nullable(),
  residence_zone: z.string(),
  father_name: z.string(),
  mother_name: z.string(),
  insurance_provider: z.string(),
  referring_entity: z.string(),
  marital_status: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  address: z.object({
    id: z.string(),
    place_id: z.string(),
    formatted_address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  class: z.object({
    id: z.string(),
    name: z.string(),
  }),
  fiscal: z.object({
    id: z.string(),
    registered_name: z.string(),
    fiscal_category: z.string(),
    customer_type: z.string(),
    tax_id: z.string(),
  }),
  company: z.object({
    id: z.string(),
    name: z.string(),
  }),
  created_at: z.string(),
  created_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  updated_at: z.string(),
  updated_by: z.object({
    id: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  linkage: z.string().optional(),
  companion: z.object({
    id: z.string(),
    name: z.string(),
    address: z.object({
      id: z.string(),
      place_id: z.string(),
      formatted_address: z.string(),
    }),
    phone_number: z.string(),
    relationship: z.string(),
  }),
  caregiver: z.object({
    name: z.string(),
    document_type: z.string(),
    document_number: z.string(),
    address: z.object({
      id: z.string(),
      place_id: z.string(),
      formatted_address: z.string(),
    }),
    phone_number: z.string(),
    relationship: z.string(),
  }),
  care_company_plan: z.object({
    care_company: z.object({
      id: z.string(),
      name: z.string(),
    }),
    contract_number: z.string(),
    coverage: z.string(),
  }),
  notes: z.array(z.object({
    id: z.string(),
    note: z.string(),
  })),
  clinics: z.array(z.object({
    id: z.string(),
    name: z.string(),
  }))
})

export const patientListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(patientListSchema),
})

export const patientCareCompanyListResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.array(patientCareCompanyListSchema),
})

export const patientDetailResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: patientDetailSchema,
})

export const newPatientResponseSchema = z.object({
  status: z.string(),
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.string(),
    first_last_name: z.string(),
    second_last_name: z.string(),
    first_name: z.string(),
  }),
})

export type PatientList = z.infer<typeof patientListSchema>;
export type PatientListResponse = z.infer<typeof patientListResponseSchema>;

export type PatientDetail = z.infer<typeof patientDetailSchema>;
export type PatientDetailResponse = z.infer<typeof patientDetailResponseSchema>;

export type PatientCareCompanyList = z.infer<typeof patientCareCompanyListSchema>;
export type PatientCareCompanyListResponse = z.infer<typeof patientCareCompanyListResponseSchema>;

export type NewPatient = z.infer<typeof newPatientSchema>;
export type NewPatientResponse = z.infer<typeof newPatientResponseSchema>;