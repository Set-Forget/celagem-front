import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userListSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role_id: z.number(),
  role_name: z.string(),
})

export const userDetailSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role_id: z.string(),
  role_name: z.string(),
  is_email_confirmed: z.boolean(),
  company_id: z.string(),
  company_name: z.string(),
  business_units: z.array(z.object({
    id: z.string(),
    name: z.string(),
  })),
  created_at: z.string(),
  modified_at: z.string(),
})

export const newUserSchema = z.object({
  first_name: z.string({ required_error: 'El nombre es requerido' }).min(1, { message: 'El nombre es requerido' }),
  last_name: z.string({ required_error: 'El apellido es requerido' }).min(1, { message: 'El apellido es requerido' }),
  email: z.string({ required_error: 'El correo electrónico es requerido' }).min(1, { message: 'El correo electrónico es requerido' }),
  password: z.string({ required_error: 'La contraseña es requerida' }).min(1, { message: 'La contraseña es requerida' }).regex(passwordRegex, { message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial' }),
  business_units: z.array(z.string()).min(1, { message: 'Debes seleccionar al menos una unidad de negocio' }),
  company_id: z.string({ required_error: 'La compañía es requerida' }).min(1, { message: 'La compañía es requerida' }),
  role_id: z.string({ required_error: 'El rol es requerido' }).min(1, { message: 'El rol es requerido' }),
})

export const editUserSchema = newUserSchema.extend({
  password: z.string().optional(),
}).partial({ password: true });

export const userListResponseSchema = z.object({
  data: z.array(userListSchema),
  status: z.string(),
  message: z.string(),
  code: z.number(),
})

export const userDetailResponseSchema = z.object({
  data: userDetailSchema,
  status: z.string(),
  message: z.string(),
  code: z.number(),
})

export const newUserResponseSchema = z.object({
  data: userDetailSchema,
  status: z.string(),
  message: z.string(),
  code: z.number(),
})

export type UserList = z.infer<typeof userListSchema>;
export type UserListResponse = z.infer<typeof userListResponseSchema>;

export type UserDetail = z.infer<typeof userDetailSchema>;
export type UserDetailResponse = z.infer<typeof userDetailResponseSchema>;

export type NewUser = z.infer<typeof newUserSchema>;
export type NewUserResponse = z.infer<typeof newUserResponseSchema>;