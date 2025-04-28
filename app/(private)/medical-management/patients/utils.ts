export const documentTypes = [
  {
    value: "AdultWithoutIdentification",
    label: "Adulto sin identificación",
    short: "ASI"
  },
  {
    value: "CitizenId",
    label: "Cédula de ciudadanía",
    short: "CC"
  },
  {
    value: "Dni",
    label: "Documento nacional de identidad",
    short: "DNI"
  },
  {
    value: "UniquePopulationRegistrationKey",
    label: "Clave única de registro de población",
    short: "CUP"
  },
  {
    value: "ImmigrationCard",
    label: "Cédula de extranjería",
    short: "CE"
  },
  {
    label: "Paciente investigación",
    value: "ResearchParticipant",
    short: "PI"
  },
  {
    value: "MinorWithoutIdentification",
    label: "Menor sin identificación",
    short: "MSI"
  },
  {
    value: "Passport",
    label: "Pasaporte",
    short: "PAS"
  },
  {
    label: "Número único de id. personal",
    value: "UniquePersonalIdentificationNumber",
    short: "NUIP"
  },
  {
    value: "CivilRegistry",
    label: "Registro civil",
    short: "RC"
  },
  {
    label: "Tarjeta de identidad",
    value: "IdentityCard",
    short: "TI"
  },
  {
    label: "Permiso especial de permanencia",
    value: "SpecialPermanencePermission",
    short: "PEP"
  },
  {
    label: "Permiso de protección personal",
    value: "PersonalProtectionPermission",
    short: "PPP"
  },
  {
    label: "Clave única de identificación tributaria",
    value: "UniqueTaxpayerIdentificationKey",
    short: "CUIT"
  },
  {
    label: "Institutio nacional electoral",
    value: "NationalElectoralInstitute",
    short: "INE"
  },
  {
    label: "Registro federal de contribuyentes",
    value: "FederalContributorRegistry",
    short: "RFC"
  },
  {
    label: "Forma migratoria",
    value: "MigrationForm",
    short: "FM"
  }
] as const;

export const biologicalSexTypes = [
  {
    value: "Male",
    label: "Masculino",
  },
  {
    value: "male",
    label: "Masculino",
  },
  {
    value: "Female",
    label: "Femenino",
  },
  {
    value: "female",
    label: "Femenino",
  },
  {
    value: "Both",
    label: "Ambos",
  },
  {
    value: "both",
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
