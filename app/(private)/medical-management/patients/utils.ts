export const documentTypes = [
  {
    value: "adult-without-identification",
    label: "Adulto sin identificación",
  },
  {
    value: "citizen-id",
    label: "Cédula de ciudadanía",
  },
  {
    value: "DNI",
    label: "Documento nacional de identidad",
  },
  {
    value: "unique-population-registration-key",
    label: "Clave única de registro de población",
  },
  {
    value: "immigration-card",
    label: "Cédula de extranjería",
  },
  {
    value: "minor-without-identification",
    label: "Menor sin identificación",
  },
  {
    value: "passport",
    label: "Pasaporte",
  },
  {
    value: "civil-registry",
    label: "Registro civil",
  },
  {
    value: "cuit",
    label: "CUIT",
  },
] as const

export const biologicalSexTypes = [
  {
    value: "male",
    label: "Masculino",
  },
  {
    value: "female",
    label: "Femenino",
  },
  {
    value: "both",
    label: "Ambos",
  },
] as const

export const genderIdentityTypes = [
  {
    value: "cisgender",
    label: "Cisgénero",
  },
  {
    value: "no-binary",
    label: "No binario",
  },
  {
    value: "transgender",
    label: "Transgénero",
  },
  {
    value: "fluent",
    label: "Fluido",
  },
  {
    value: "other",
    label: "Otro",
  },
] as const

export const disabilityTypes = [
  {
    value: "visual",
    label: "Discapacidad visual",
  },
  {
    value: "physical",
    label: "Discapacidad física",
  },
  {
    value: "hearing",
    label: "Discapacidad auditiva",
  },
  {
    value: "mental",
    label: "Discapacidad mental",
  },
  {
    value: "intellectual",
    label: "Discapacidad intelectual",
  },
  {
    value: "multiple",
    label: "Discapacidad múltiple",
  },
  {
    value: "psychosocial",
    label: "Dispacidad psicosocial",
  },
  {
    label: "Discapacidad sordoceguera",
    value: "deafblindness",
  },
  {
    value: "other",
    label: "Otra",
  },
] as const

export const maritalStatusTypes = [
  {
    value: "single",
    label: "Soltero",
  },
  {
    value: "married",
    label: "Casado",
  },
  {
    value: "divorced",
    label: "Divorciado",
  },
  {
    value: "widowed",
    label: "Viudo",
  },
] as const

export const linkageTypes = [
  {
    label: "Adicional",
    value: "additional"
  },
  {
    label: "Beneficiario",
    value: "beneficiary"
  },
  {
    label: "Cotizante",
    value: "contributor"
  },
  {
    label: "Subsidiado",
    value: "subsidized"
  },
  {
    label: "Particular",
    value: "particular"
  }
]