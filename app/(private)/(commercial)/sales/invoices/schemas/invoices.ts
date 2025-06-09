import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { z } from "zod";

export const invoiceStatus = z.enum(["draft", "posted", "cancel", "to_approve", "done", "overdue"]);
export const invoiceTypes = z.enum(["invoice", "credit_note", "debit_note"]);

export const newInvoiceLineSchema = z.object({
    product_id: z.number({ required_error: "El producto es requerido" }),
    quantity: z.number(),
    account_id: z.number({ required_error: "La cuenta contable es requerida" }),
    cost_center: z.number().nullable().optional(),
    taxes_id: z.array(z.number()).optional(),
    price_unit: z.number({ required_error: "El precio unitario es requerido" }),
});

export const newInvoiceGeneralSchema = z.object({
    customer: z.number({ required_error: "El cliente es requerido" }),
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
    number: z.string().optional(),
    items: z.array(newInvoiceLineSchema).min(1, { message: "Debe agregar al menos un item" }),
})

export const newInvoiceFiscalSchema = z.object({
    currency: z.number({ required_error: "La moneda es requerida" }),
    payment_term: z.number({ required_error: "La condición de pago es requerida" }),
    payment_method: z.number({ required_error: "El método de pago es requerido" }),
});

export const newInvoiceNotesSchema = z.object({
    internal_notes: z.string().optional(),
    tyc_notes: z.string().optional(),
});

export const newInvoiceSchema = newInvoiceGeneralSchema
    .merge(newInvoiceFiscalSchema)
    .merge(newInvoiceNotesSchema);

export const invoiceLineSchema = z.object({
    id: z.number(),
    product_id: z.number(),
    product_name: z.string(),
    quantity: z.number(),
    price_unit: z.number(),
    price_subtotal: z.number(),
    price_tax: z.number(),
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
    taxes: z.array(z.object({ id: z.number(), name: z.string(), amount: z.number() })),
    // ! Ellos muestran también la unidad de medida (tener en cuenta para el futuro).
});

export const invoiceListSchema = z.object({
    id: z.number(),
    sequence_id: z.string(),
    custom_sequence_number: z.string(),
    customer: z.string(),
    status: invoiceStatus,
    date: z.string(),
    amount_total: z.number(),
    amount_residual: z.number(),
    due_date: z.string(),
    percentage_paid: z.number(),
    currency: z.object({
        id: z.number(),
        name: z.string(),
    }),
    created_by: z.object({
        id: z.number(),
        name: z.string(),
    }),
    created_at: z.string(),
    type: invoiceTypes,
});

export const invoiceDetailSchema = z.object({
    id: z.number(),
    sequence_id: z.string(),
    custom_sequence_number: z.string(),
    customer: z.object({
        id: z.number(),
        name: z.string(),
        phone: z.string(),
        email: z.string(),
        address: z.string(),
    }),
    status: invoiceStatus,
    date: z.string(),
    due_date: z.string(),
    accounting_date: z.string(),
    amount_total: z.number(),
    amount_residual: z.number(),
    currency: z.object({
        id: z.number(),
        name: z.string(),
    }),
    payment_term: z.object({
        id: z.number(),
        name: z.string(),
    }),
    payment_method: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable(),
    internal_notes: z.union([z.string(), z.boolean()]),
    tyc_notes: z.union([z.string(), z.boolean()]),
    credit_notes: z.array(
        z.object({
            id: z.number(),
            sequence_id: z.string(),
            date: z.string(),
            amount_total: z.number(),
            status: invoiceStatus,
        })
    ),
    debit_notes: z.array(
        z.object({
            id: z.number(),
            sequence_id: z.string(),
            date: z.string(),
            amount_total: z.number(),
            status: invoiceStatus,
        })
    ),
    charges: z.array(
        z.object({
            id: z.number(),
            sequence_id: z.string(),
            date: z.string(),
            amount: z.number(),
            status: z.enum(["draft", "posted", "cancel"]),
        })
    ),
    created_by: z.object({
        id: z.number(),
        name: z.string(),
    }),
    created_at: z.string(),
    type: invoiceTypes,
    items: z.array(invoiceLineSchema),
});

export const invoiceListResponseSchema = z.object({
    status: z.string(),
    data: z.array(invoiceListSchema),
});

export const invoiceDetailResponseSchema = z.object({
    status: z.string(),
    data: invoiceDetailSchema,
});

export const newInvoiceResponseSchema = z.object({
    status: z.string(),
    message: z.string(),
    data: z.object({
        id: z.number(),
        name: z.string(),
    }),
});

export type InvoiceList = z.infer<typeof invoiceListSchema>;
export type InvoiceListResponse = z.infer<typeof invoiceListResponseSchema>;

export type InvoiceDetail = z.infer<typeof invoiceDetailSchema>;
export type InvoiceDetailResponse = z.infer<typeof invoiceDetailResponseSchema>;

export type InvoiceLine = z.infer<typeof invoiceLineSchema>;

export type NewInvoice = z.infer<typeof newInvoiceSchema>;
export type NewInvoiceLine = z.infer<typeof newInvoiceLineSchema>;
export type NewInvoiceResponse = z.infer<typeof newInvoiceResponseSchema>;

export type InvoiceStatus = z.infer<typeof invoiceStatus>;
export type InvoiceTypes = z.infer<typeof invoiceTypes>;
