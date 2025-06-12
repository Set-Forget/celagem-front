import { userListSchema } from "@/app/(private)/management/users/schema/users";
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Correo electrónico es requerido" })
    .nonempty({ message: "Correo electrónico es requerido" })
    .email({ message: "Correo electrónico no es válido" }),
  password: z
    .string({ required_error: "Contraseña es requerida" })
    .min(6, { message: "Contraseña debe tener al menos 6 caracteres" }),
});

export const getProfileResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  code: z.number(),
  data: userListSchema,
});

export const signInResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  code: z.number(),
  data: z.string(),
});

export type SignIn = z.infer<typeof signInSchema>;
export type SignInResponse = z.infer<typeof signInResponseSchema>;

export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>;