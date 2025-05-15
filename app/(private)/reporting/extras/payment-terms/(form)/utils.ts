import { z } from "zod";

export function getFieldPaths(schema: z.ZodTypeAny, parentPath = ""): string[] {
  if (schema instanceof z.ZodObject) {
    const shape = schema._def.shape();
    const myPaths = parentPath ? [parentPath] : [];

    for (const key of Object.keys(shape)) {
      const subSchema = shape[key];
      const childPath = parentPath ? `${parentPath}.${key}` : key;
      const childPaths = getFieldPaths(subSchema, childPath);
      myPaths.push(...childPaths);
    }
    return myPaths;
  }

  return [parentPath];
}
