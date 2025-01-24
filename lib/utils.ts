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
export const generateSchema = (sections: FormConfig["sections"]): z.ZodObject<any> => {
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

      case "table":
        if (field.tableColumns && Array.isArray(field.tableColumns)) {
          const tableShape = generateSchema([
            { columns: field.tableColumns, sectionName: field.label || "" },
          ]).shape;

          schemaShape[field.name] = z.array(z.object(tableShape), { required_error: "Al menos un item requerido" }).nonempty(`Al menos un item requerido`);
        } else {
          console.warn(`El campo "${field.name}" de tipo "table" no tiene columnas definidas.`);
          schemaShape[field.name] = z.array(z.object({})).optional();
        }
        break;

      default:
        schemaShape[field.name] = z.any();
    }
  };

  sections.forEach((section) =>
    section.columns.forEach(parseColumn)
  );

  return z.object(schemaShape);
};

/* 
  This function generates an object with the default values for the form.
  It returns an object with the default values for each field.
*/
export const getDefaultValues = (sections: FormConfig["sections"]) => {
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

  sections.forEach((section) =>
    section.columns.forEach(parseColumn)
  );

  return defaultValues;
};
