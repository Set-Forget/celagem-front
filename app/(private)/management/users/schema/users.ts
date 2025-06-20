import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const userListSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role_id: z.number(),
  role_name: z.string(),
  role_is_medical: z.boolean(),
  company_id: z.string(),
  company_name: z.string(),
})

export const userDetailSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  role_id: z.string(),
  role_name: z.string(),
  role_is_medical: z.boolean(),
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

export const userBaseSchema = z.object({
  first_name: z.string({ required_error: 'El nombre es requerido' }).min(1, { message: 'El nombre es requerido' }),
  last_name: z.string({ required_error: 'El apellido es requerido' }).min(1, { message: 'El apellido es requerido' }),
  email: z.string({ required_error: 'El correo electrónico es requerido' }).min(1, { message: 'El correo electrónico es requerido' }),
  password: z.string().optional(),
  business_units: z.array(z.string()).min(1, { message: 'Debes seleccionar al menos una unidad de negocio' }),
  company_id: z.string({ required_error: 'La compañía es requerida' }).min(1, { message: 'La compañía es requerida' }),
  role_id: z.string({ required_error: 'El rol es requerido' }).min(1, { message: 'El rol es requerido' }),
  role_is_medical: z.boolean().default(false),
  speciality_id: z.number().optional(),
  signature: z.string().nullable().optional(),
});

const medicalRoleRefinement = (
  { role_is_medical, speciality_id, signature }: { role_is_medical: boolean; speciality_id?: number; signature?: string | null },
  ctx: z.RefinementCtx,
) => {
  if (role_is_medical && !speciality_id) {
    ctx.addIssue({
      path: ['speciality_id'],
      code: z.ZodIssueCode.custom,
      message: 'La especialidad es requerida cuando el rol es médico',
    });
    ctx.addIssue({
      path: ['signature'],
      code: z.ZodIssueCode.custom,
      message: 'La firma es requerida',
    });
  }

  if (signature && !signature.startsWith('data:image/png;base64,')) {
    ctx.addIssue({
      path: ['signature'],
      code: z.ZodIssueCode.custom,
      message: 'La firma debe ser una imagen en formato base64',
    });
  }
};

export const newUserSchema = userBaseSchema
  .extend({
    password: z.string({ required_error: 'La contraseña es requerida' })
      .min(1, { message: 'La contraseña es requerida' })
      .regex(passwordRegex, {
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
      }),
  })
  .superRefine(medicalRoleRefinement);

export const editUserSchema = userBaseSchema
  .omit({ password: true })
  .superRefine(medicalRoleRefinement);

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
export type EditUser = z.infer<typeof editUserSchema>;
export type NewUserResponse = z.infer<typeof newUserResponseSchema>;