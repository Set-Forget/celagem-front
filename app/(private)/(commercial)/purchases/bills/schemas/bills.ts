import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { z } from "zod";

export const billStatus = z.enum(["draft", "posted", "to_approve", "cancel", "done", "overdue", "rejected"]);
export const billTypes = z.enum(["invoice", "credit_note", "debit_note"]);

export const newBillLineSchema = z.object({
    product_id: z.number({ required_error: "El producto es requerido" }),
    quantity: z.number(),
    price_unit: z.number({ required_error: "El precio unitario es requerido" }),
    account_id: z.number({ required_error: "La cuenta contable es requerida" }),
    cost_center: z.number().nullable().optional(),
    taxes_id: z.array(z.number()).optional(),
    purchase_line_id: z.number().optional(),
});

export const newBillGeneralSchema = z.object({
    supplier: z.number({ required_error: "El proveedor es requerido" }),
    custom_sequence_number: z.string({ required_error: "El número de factura es requerido" }).min(1, { message: "El número de factura es requerido" }),
    date: z
        .custom<CalendarDate>((v) => v instanceof CalendarDate, {
            message: "La fecha de factura es requerida",
        })
        .refine(d => d.compare(today(getLocalTimeZone())) <= 0, {
            message: "La fecha de factura no puede ser posterior al día de hoy",
        }),
    accounting_date: z
        .custom<CalendarDate>((v) => v instanceof CalendarDate, {
            message: "La fecha de contabilización es requerida",
        })
        .refine(d => d.compare(today(getLocalTimeZone())) <= 0, {
            message: "La fecha de contabilización no puede ser posterior al día de hoy",
        }),
    company: z.number({ required_error: "La empresa es requerida" }).optional(),
    items: z.array(newBillLineSchema).min(1, { message: "Debe agregar al menos un item" }),
})

export const newBillFiscalSchema = z.object({
    currency: z.number({ required_error: "La moneda es requerida" }),
    payment_term: z.number({ required_error: "El término de pago es requerido" }),
    payment_method: z.number({ required_error: "El método de pago es requerido" }),
});

export const newBillNotesSchema = z.object({
    internal_notes: z.string().optional(),
    tyc_notes: z.string().optional(),
});

export const newBillSchema = newBillGeneralSchema.merge(newBillFiscalSchema).merge(newBillNotesSchema);

export const newBillResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
    data: z.object({
        id: z.number(),
        name: z.string(),
    }),
});

export const billLineSchema = z.object({
    id: z.number(),
    product_id: z.number(),
    product_name: z.string(),
    quantity: z.number(),
    price_unit: z.number(),
    price_subtotal: z.number(),
    rejection_reason: z.string().nullable(),
    price_tax: z.number(),
    purchase_order_line: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable(),
    account: z.object({
        id: z.number(),
        name: z.string(),
    }),
    cost_center: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable(),
    taxes: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            amount: z.number(),
        })
    ),
});

export const billListSchema = z.object({
    id: z.number(),
    supplier: z.string(),
    sequence_id: z.string(),
    custom_sequence_number: z.string(),
    status: billStatus,
    date: z.string(),
    due_date: z.string(),
    amount_total: z.number(),
    amount_residual: z.number(),
    currency: z.object({
        id: z.number(),
        name: z.string(),
    }),
    percentage_paid: z.number(),
    payment_term: z.object({
        id: z.number(),
        name: z.string(),
    }),
    payment_method: z.object({
        id: z.number(),
        name: z.string(),
    }),
    company: z.object({
        id: z.number(),
        name: z.string(),
    }),
    created_by: z.object({
        id: z.number(),
        name: z.string(),
    }),
    created_at: z.string(),
    type: billTypes,
});

export const billDetailSchema = z.object({
    id: z.number(),
    sequence_id: z.string(),
    custom_sequence_number: z.string(),
    supplier: z.object({
        id: z.number(),
        name: z.string(),
        email: z.string(),
        address: z.string(),
        phone: z.string(),
    }),
    status: billStatus,
    approval_state: z.enum(["draft", "to_approve", "approved"]),
    date: z.string(),
    due_date: z.string(),
    accounting_date: z.string(),
    created_at: z.string(),
    created_by: z.object({
        id: z.number(),
        name: z.string(),
    }),
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
    internal_notes: z.union([z.string(), z.boolean()]),
    tyc_notes: z.union([z.string(), z.boolean()]),
    purchase_orders: z.array(
        z.object({
            id: z.number(),
            sequence_id: z.string(),
        })
    ),
    amount_total: z.number(),
    amount_residual: z.number(),
    credit_notes: z.array(
        z.object({
            id: z.number(),
            sequence_id: z.string(),
            date: z.string(),
            amount_total: z.number(),
            status: billStatus,
        })
    ),
    debit_notes: z.array(
        z.object({
            id: z.number(),
            sequence_id: z.string(),
            date: z.string(),
            amount_total: z.number(),
            status: billStatus,
        })
    ),
    company: z.object({
        id: z.number(),
        name: z.string(),
    }),
    payments: z.array(
        z.object({
            id: z.number(),
            sequence_id: z.string(),
            state: z.string(),
            amount: z.number(),
            date: z.string(),
        })
    ),
    type: billTypes,
    items: z.array(billLineSchema),
});

export const billListResponseSchema = z.object({
    status: z.string(),
    data: z.array(billListSchema),
});

export const billDetailResponseSchema = z.object({
    status: z.string(),
    data: billDetailSchema,
});

export type NewBillLine = z.infer<typeof newBillLineSchema>;

export type NewBill = z.infer<typeof newBillSchema>;
export type NewBillResponse = z.infer<typeof newBillResponseSchema>;

export type BillList = z.infer<typeof billListSchema>;
export type BillListResponse = z.infer<typeof billListResponseSchema>;

export type BillDetail = z.infer<typeof billDetailSchema>;
export type BillLine = z.infer<typeof billLineSchema>;
export type BillDetailResponse = z.infer<typeof billDetailResponseSchema>;

export type BillStatus = z.infer<typeof billStatus>;
export type BillTypes = z.infer<typeof billTypes>;
