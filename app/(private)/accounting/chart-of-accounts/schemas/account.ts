import { z } from "zod";
import { accountTypes } from "../data";

type AccountTypeValues = typeof accountTypes[number]["value"];

const valid = new Set<AccountTypeValues>(
  accountTypes.map(a => a.value) as AccountTypeValues[]
);

export const accountTypeSchema = z.custom<AccountTypeValues>(
  v => valid.has(v as AccountTypeValues),
  { message: "El tipo de cuenta es requerido" }
);

export const accountListSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  account_type: z.string(),
  group: z.string(),
  active: z.boolean(),
  company: z.array(z.string()),
  parent_id: z.number().nullable(),
  has_children: z.boolean(),
  balance: z.number(),
})

export const accountDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  account_type: accountTypeSchema,
  group: z.null(),
  active: z.boolean(),
  company: z.object({
    id: z.number(),
    name: z.string(),
  }),
  parent: z.object({
    id: z.number(),
    name: z.string(),
  }).nullable(),
  childrens: z.array(accountListSchema).nullable(),
})

export const newAccountSchema = z.object({
  name: z.string({ required_error: "El nombre es requerido" }).min(1, { message: "El nombre es requerido" }),
  code: z.string({ required_error: "El código es requerido" }).min(1, { message: "El código es requerido" }),
  account_type: accountTypeSchema,
  company: z.number().optional(),
  parent: z.number().optional(),
})

export const newAccountResponseSchema = z.object({
  status: z.string(),
  data: z.object({
    name: z.string(),
    id: z.number(),
  }),
})

export const accountMoveLineSchema = z.object({
  id: z.number(),
  move_id: z.object({
    id: z.number(),
    name: z.string(),
    state: z.string(),
  }),
  date: z.string(),
  partner: z.object({
    id: z.number(),
    name: z.string(),
  }),
  currency: z.object({
    id: z.number(),
    name: z.string(),
  }),
  debit: z.number(),
  credit: z.number(),
  balance: z.number(),
  ref: z.string(),
  name: z.string(),
  account: z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
  }),
})

export const accountMoveLineResponseSchema = z.object({
  status: z.string(),
  data: z.array(accountMoveLineSchema),
})

export const accountListResponseSchema = z.object({
  status: z.string(),
  data: z.array(accountListSchema),
})

export const accountDetailResponseSchema = z.object({
  status: z.string(),
  data: accountDetailSchema,
})

export type AccountList = z.infer<typeof accountListSchema>;
export type AccountListResponse = z.infer<typeof accountListResponseSchema>;

export type AccountDetail = z.infer<typeof accountDetailSchema>;
export type AccountDetailResponse = z.infer<typeof accountDetailResponseSchema>;

export type NewAccount = z.infer<typeof newAccountSchema>;
export type NewAccountResponse = z.infer<typeof newAccountResponseSchema>;

export type AccountMoveLine = z.infer<typeof accountMoveLineSchema>;
export type AccountMoveLineResponse = z.infer<typeof accountMoveLineResponseSchema>;

export type AccountTypes = z.infer<typeof accountTypeSchema>;