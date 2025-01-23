import { FormConfig, ColumnConfig, FieldConfig } from "@/app/medical-management/scheduler/appointment/[id]/page";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* 
  This function generates a zod schema based on the form configuration.
  It returns a zod object with the schema shape.
*/
export const generateSchema = (formConfig: FormConfig): z.ZodObject<any> => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  const parseColumn = (column: ColumnConfig) => {
    if ("rows" in column) {
      column.rows.forEach(parseField);
    } else if ("columns" in column) {
      column.columns.forEach(parseColumn);
    } else {
      parseField(column);
    }
  };

  const parseField = (field: FieldConfig) => {
    const requiredMessage = field.requiredMessage || `${field.label} es obligatorio`;

    switch (field.type) {
      case "date":
      case "input":
      case "textarea":
        schemaShape[field.name] = field.required
          ? z.string({ message: requiredMessage }).min(1, requiredMessage)
          : z.string().optional();
        break;

      case "number":
        const minValue = field.minValue || 0;
        const errorMessage = field.errorMessage || `${field.label} debe ser mayor o igual a ${minValue}`;

        if (field.required) {
          schemaShape[field.name] = z
            .number({
              required_error: `${field.label} es obligatorio`,
              invalid_type_error: `${field.label} debe ser un número`,
            })
            .min(minValue, errorMessage);
        } else {
          schemaShape[field.name] = z
            .number({
              invalid_type_error: `${field.label} debe ser un número`,
            })
            .min(minValue, errorMessage)
            .optional();
        }
        break;

      case "multi-select":
        if (field.options && field.options.length > 0) {
          const values = field.options.map((option) => option.value);

          if (field.required) {
            schemaShape[field.name] = z.array(z.enum(values as [string, ...string[]]), {
              required_error: `${field.label} es obligatorio`,
            }).nonempty(`${field.label} es obligatorio`);
          } else {
            schemaShape[field.name] = z.array(z.enum(values as [string, ...string[]])).optional();
          }
        } else {
          console.warn(
            `El campo "${field.name}" de tipo "multi-select" no tiene opciones definidas.`
          );
          schemaShape[field.name] = z.array(z.string()).optional();
        }
        break;

      case "select":
        if (field.options && field.options.length > 0) {
          const values = field.options.map((option) => option.value);

          if (field.required) {
            schemaShape[field.name] = z.enum(values as [string, ...string[]], {
              required_error: `${field.label} es obligatorio`,
            });
          } else {
            schemaShape[field.name] = z
              .enum(values as [string, ...string[]])
              .optional();
          }
        } else {
          console.warn(
            `El campo "${field.name}" de tipo "select" no tiene opciones definidas.`
          );
          schemaShape[field.name] = z.string().optional();
        }
        break;

      case "file":
        if (field.required) {
          schemaShape[field.name] = z
            .object({
              name: z.string().min(1, "El archivo debe tener un nombre"),
              size: z.number().min(1, "El archivo no puede estar vacío"),
              type: z.string().optional(),
            }, { required_error: requiredMessage })
            .refine((file) => file.size < 10 * 1024 * 1024, {
              message: "El archivo debe ser menor a 10 MB",
            });
        } else {
          schemaShape[field.name] = z
            .object({
              name: z.string().min(1, "El archivo debe tener un nombre"),
              size: z.number().min(1, "El archivo no puede estar vacío"),
              type: z.string().optional(),
            })
            .optional()
            .refine(
              (file) => !file || file.size < 10 * 1024 * 1024,
              {
                message: "El archivo debe ser menor a 10 MB",
              }
            );
        }
        break;

      case "time":
        schemaShape[field.name] = z.object({
          hour: z.number().min(0).max(23).int(),
          minute: z.number().min(0).max(59).int(),
          second: z.number().min(0).max(59).int(),
          millisecond: z.number().min(0).max(999).int().optional()
        }, { required_error: requiredMessage, invalid_type_error: requiredMessage });
        break;

      case "embryos-to-disincorporate-table":
        schemaShape[field.name] = z.array(z.object({
          embryoNumber: z.number().int().min(1, "El número de embrión debe ser mayor a 0"),
          serial: z.string().min(1, "El serial es obligatorio"),
        }, { required_error: "Al menos un embrión es requerido", invalid_type_error: "Al menos un embrión es requerido" })).nonempty("Al menos un embrión es requerido");
        break;

      case "embryos-to-follow-up-table":
        schemaShape[field.name] = z.array(z.object({
          embryoNumber: z.number({ required_error: "El número de embrión es requerido", invalid_type_error: "El número de embrión debe ser un número" }).min(0, "El número de embrión debe ser mayor a 0"),
          day: z.enum(["day-5", "day-6"], { required_error: "El día es requerido" }),
          classification: z.enum(["6AA", "6AB", "6BA", "6BB", "5AA", "5AB", "5BA", "5BB", "4AA", "4AB", "4BA", "4BB", "3AA", "3AB", "3BA", "3BB"], { required_error: "La clasificación es requerida" }),
          pgtaResult: z.enum(["normal-female", "normal-male", "abnormal-female", "abnormal-male"], { required_error: "El resultado de PGT-A es requerido" }),
          cycleDate: z.string({ required_error: "La fecha de ciclo es requerida" }).min(1, "La fecha de ciclo es requerida"),
          vitrificationDate: z.string({ required_error: "La fecha de vitrificación es requerida" }).min(1, "La fecha de vitrificación es requerida"),
          tank: z.number({ required_error: "El tanque es requerido", invalid_type_error: "El tanque es requerido" }).min(0, "El tanque es requerido"),
          canister: z.number({ required_error: "El canister es requerido", invalid_type_error: "El canister es requerido" }).min(0, "El canister es requerido"),
          ladder: z.number({ required_error: "La escalerilla es requerida", invalid_type_error: "La escalerilla es requerida" }).min(0, "La escalerilla es requerida"),
        }, { required_error: "Al menos un embrión es requerido" })).nonempty("Al menos un embrión es requerido");
        break;

      case "ivf-report-table":
        schemaShape[field.name] = z.array(z.object({
          ivfDescription: z.enum(["frozen-embryos", "transferred-embryos", "eggs-number", "mii-eggs-number", "fertilized-eggs-number", "day-3-embryos-number", "blastocysts-number", "pgta"], { required_error: "La descripción es requerida" }),
          value: z.string({ required_error: "El valor es requerido" }).min(1, "El valor es requerido"),
        }, { required_error: "Al menos un reporte es requerido" })).nonempty("Al menos un reporte es requerido");
        break;

      default:
        schemaShape[field.name] = z.any();
    }
  };

  formConfig.sections.forEach((section) =>
    section.columns.forEach(parseColumn)
  );

  return z.object(schemaShape);
};

/* 
  This function generates an object with the default values for the form.
  It returns an object with the default values for each field.
*/
export const getDefaultValues = (formConfig: FormConfig) => {
  const defaultValues: Record<string, any> = {};

  const parseColumn = (column: ColumnConfig) => {
    if ("rows" in column) {
      column.rows.forEach(parseField);
    } else if ("columns" in column) {
      column.columns.forEach(parseColumn);
    } else {
      parseField(column);
    }
  };

  const parseField = (field: FieldConfig) => {
    if (field.defaultValue !== undefined) {
      defaultValues[field.name] = field.defaultValue;
    }
  };

  formConfig.sections.forEach((section) =>
    section.columns.forEach(parseColumn)
  );

  return defaultValues;
};
