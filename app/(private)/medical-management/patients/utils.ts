export const documentTypes = [
  {
    value: "AdultWithoutIdentification",
    label: "Adulto sin identificación",
  },
  {
    value: "CitizenId",
    label: "Cédula de ciudadanía",
  },
  {
    value: "Dni",
    label: "Documento nacional de identidad",
  },
  {
    value: "UniquePopulationRegistrationKey",
    label: "Clave única de registro de población",
  },
  {
    value: "ImmigrationCard",
    label: "Cédula de extranjería",
  },
  {
    value: "MinorWithoutIdentification",
    label: "Menor sin identificación",
  },
  {
    value: "Passport",
    label: "Pasaporte",
  },
  {
    value: "CivilRegistry",
    label: "Registro civil",
  },
  {
    value: "Cuit",
    label: "CUIT",
  },
] as const;

export const biologicalSexTypes = [
  {
    value: "Male",
    label: "Masculino",
  },
  {
    value: "Female",
    label: "Femenino",
  },
  {
    value: "Both",
    label: "Ambos",
  },
] as const;

export const genderIdentityTypes = [
  {
    value: "Cisgender",
    label: "Cisgénero",
  },
  {
    value: "NoBinary",
    label: "No binario",
  },
  {
    value: "Transgender",
    label: "Transgénero",
  },
  {
    value: "Fluent",
    label: "Fluido",
  },
  {
    value: "Other",
    label: "Otro",
  },
] as const;

export const disabilityTypes = [
  {
    value: "Visual",
    label: "Discapacidad visual",
  },
  {
    value: "Physical",
    label: "Discapacidad física",
  },
  {
    value: "Hearing",
    label: "Discapacidad auditiva",
  },
  {
    value: "Mental",
    label: "Discapacidad mental",
  },
  {
    value: "Intellectual",
    label: "Discapacidad intelectual",
  },
  {
    value: "Multiple",
    label: "Discapacidad múltiple",
  },
  {
    value: "Psychosocial",
    label: "Dispacidad psicosocial",
  },
  {
    value: "Deafblindness",
    label: "Discapacidad sordoceguera",
  },
  {
    value: "Other",
    label: "Otra",
  },
] as const;

export const maritalStatusTypes = [
  {
    value: "Single",
    label: "Soltero",
  },
  {
    value: "Married",
    label: "Casado",
  },
  {
    value: "Divorced",
    label: "Divorciado",
  },
  {
    value: "Widowed",
    label: "Viudo",
  },
] as const;

export const linkageTypes = [
  {
    value: "Additional",
    label: "Adicional",
  },
  {
    value: "Beneficiary",
    label: "Beneficiario",
  },
  {
    value: "Contributor",
    label: "Cotizante",
  },
  {
    value: "Subsidized",
    label: "Subsidiado",
  },
  {
    value: "Particular",
    label: "Particular",
  },
] as const;

export const customerTypes = [
  {
    value: "Company",
    label: "Empresa",
  },
  {
    value: "Individual",
    label: "Particular",
  },
] as const;

export const fiscalCategories = [
  {
    value: "NaturalPerson",
    label: "Persona natural",
  },
  {
    value: "LegalEntity",
    label: "Persona jurídica",
  }
] as const;
