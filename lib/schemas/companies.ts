// import { z } from 'zod';

// export const companiesSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   description: z.string(),
//   created_at: z.string(),
//   modified_at: z.string(),
// })

// export const companiesListSchema = z.object({  // List
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: z.array(companiesSchema),
// })

// export const companyResponseSchema = z.object({  // Create, Update, Retrieve
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: companiesSchema,
// })

// export const companyOperationResponseSchema = z.object({ // Delete
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: z.string(),
// })

// export const companiesUsersOperationResponseSchema = z.object({  // Add, Remove User from Company
//   status: z.string(),
//   code: z.number(),
//   message: z.string(),
//   details: z.string(),
//   data: z.string(),
// })

// export const companyCreateBodySchema = z.object({
//   name: z.string(),
//   description: z.string(),
// });

// export const companyEditBodySchema = z.object({
//   name: z.string(),
//   description: z.string(),
// });

// export const companyAddUserBodySchema = z.object({
//   user_id: z.string(),
// });

// export type Companies = z.infer<typeof companiesSchema>;
// export type CompaniesListResponse = z.infer<typeof companiesListSchema>;
// export type CompanyResponse = z.infer<typeof companyResponseSchema>;
// export type CompanyOperationResponse = z.infer<typeof companyOperationResponseSchema>;
// export type CompanyAddUserBody = z.infer<typeof companyAddUserBodySchema>;
// export type CompanyCreateBody = z.infer<typeof companyCreateBodySchema>;
// export type CompanyEditBody = z.infer<typeof companyEditBodySchema>;
// export type CompanyAddUser = z.infer<typeof companyAddUserBodySchema>;
