import { CalendarDate } from "@internationalized/date";
import { z } from "zod";

const creditNoteStatus = z.enum(["draft", "posted", "cancel", "done", "overdue"]);
const creditNoteMoveType = z.enum(["out_refund", "in_refund"]);

export const newCreditNoteLineSchema = z.object({
    product_id: z.number({ required_error: "El producto es requerido" }),
    quantity: z.number(),
    taxes_id: z.array(z.number()).optional(),
    account_id: z.number({ required_error: "La cuenta contable es requerida" }),
    cost_center: z.number().nullable().optional(),
    price_unit: z.number(),
});

export const creditNoteLineSchema = z.object({
    id: z.number(),
    product_id: z.number(),
    product_name: z.string(),
    quantity: z.number(),
    price_unit: z.number(),
    price_subtotal: z.number(),
    price_tax: z.number(),
    taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
    account: z.object({
        id: z.number(),
        name: z.string(),
    }),
    cost_center: z.object({
        id: z.number(),
        name: z.string(),
    }),
});

export const creditNoteDetailSchema = z.object({
    id: z.number(),
    sequence_id: z.string(),
    custom_sequence_number: z.string(),
    partner: z.object({
        id: z.number(),
        name: z.string(),
        phone: z.string(),
        email: z.string(),
        address: z.string(),
    }),
    created_at: z.string(),
    created_by: z.object({
        id: z.number(),
        name: z.string(),
    }),
    status: creditNoteStatus,
    date: z.string(),
    due_date: z.string(),
    accounting_date: z.string(),
    currency: z.object({
        id: z.number(),
        name: z.string(),
    }),
    payment_term: z.object({
        id: z.number(),
        name: z.string(),
    }),
    payment_method: z.object({
        id: z.number(),
        name: z.string(),
    }),
    internal_notes: z.string(),
    amount_residual: z.number(),
    associated_invoice: z.object({
        id: z.number(),
        sequence_id: z.string(),
    }),
    items: z.array(creditNoteLineSchema),
});

export const newCreditNoteSchema = z
    .object({
        partner: z.number(),
        date: z.custom<CalendarDate>(
            (data) => {
                return data instanceof CalendarDate;
            },
            { message: "La fecha de emisión es requerida" }
        ),
        custom_sequence_number: z.string().optional(),
        accounting_date: z.custom<CalendarDate>(
            (data) => {
                return data instanceof CalendarDate;
            },
            { message: "La fecha de contabilización es requerida" }
        ),
        currency: z.number(),
        move_type: creditNoteMoveType.optional(),
        internal_notes: z.string().optional(),
        associated_invoice: z.number().optional(),
        items: z.array(newCreditNoteLineSchema).min(1, { message: "Debe agregar al menos un item" }),
    })
    .superRefine((data, ctx) => {
        if (
            data.move_type === "in_refund" &&
            (!data.custom_sequence_number || data.custom_sequence_number.trim() === "")
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["custom_sequence_number"],
                message: "El número es obligatorio para notas de crédito entrantes",
            });
        }
    });

export const creditNoteDetailResponseSchema = z.object({
    status: z.string(),
    data: creditNoteDetailSchema,
});

export const newCreditNoteResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
    data: z.object({
        id: z.number(),
        name: z.string(),
    }),
});

export type CreditNoteDetail = z.infer<typeof creditNoteDetailSchema>;
export type CreditNoteDetailResponse = z.infer<typeof creditNoteDetailResponseSchema>;

export type CreditNoteLine = z.infer<typeof creditNoteLineSchema>;

export type NewCreditNote = z.infer<typeof newCreditNoteSchema>;
export type NewCreditNoteLine = z.infer<typeof newCreditNoteLineSchema>;
export type NewCreditNoteResponse = z.infer<typeof newCreditNoteResponseSchema>;

export type CreditNoteStatus = z.infer<typeof creditNoteStatus>;
export type CreditNoteMoveType = z.infer<typeof creditNoteMoveType>;
