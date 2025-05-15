export const tax_type = [
  { value: "rcn", label: "Registro civil de nacimiento" },
  { value: "t", label: "Tarjeta de identidad" },
  { value: "cc", label: "Cédula de ciudadanía" },
  { value: "te", label: "Tarjeta de extranjería" },
  { value: "ce", label: "Cédula de extranjería" },
  { value: "nit", label: "Número de identificación tributaria" },
  { value: "pas", label: "Pasaporte" },
  { value: "de", label: "Tipo doc. extranjero" },
]

export const entity_type = [
  { value: "natural", label: "Natural" },
  { value: "juridica", label: "Jurídica" },
]

export const nationality_type = [
  { value: "nacional", label: "Nacional" },
  { value: "extranjero", label: "Extranjero" },
  { value: "pt_con_clave", label: "PT con clave" },
  { value: "pt_sin_clave", label: "PT sin clave" },
]

export const tax_regime = [
  { value: "empresas_estado", label: "Empresas del Estado" },
  { value: "extranjero", label: "Extranjero" },
  { value: "gran_contribuyente", label: "Gran contribuyente" },
  { value: "no_responsable_iva", label: "No responsable IVA" },
  { value: "regimen_especial", label: "Régimen especial" },
  { value: "regimen_comun_no_retenedor", label: "Régimen común no retenedor" },
  { value: "regimen_comun", label: "Régimen común" },
  { value: "regimen_simplificado", label: "Régimen simplificado" },
]

export const tax_category = [
  { value: "simple", label: "Régimen simple" },
  { value: "ordinario", label: "Régimen ordinario" },
  { value: "iva", label: "Impuesto sobre las ventas - IVA" },
  { value: "no_iva", label: "No responsable de IVA" },
]

export const tax_information = [
  { value: "iva", label: "IVA" },
  { value: "inc", label: "INC" },
  { value: "iva_inc", label: "IVA e INC" },
  { value: "no_aplica", label: "No aplica" },
]

export const fiscal_responsibility = [
  { value: "gran_contribuyente", label: "Gran contribuyente" },
  { value: "autorretenedor", label: "Autorretenedor" },
  { value: "agente_retencion", label: "Agente de retención IVA" },
  { value: "regimen_simple", label: "Régimen simple de tributación" },
  { value: "no_aplica", label: "No aplica - Otros" },
]
