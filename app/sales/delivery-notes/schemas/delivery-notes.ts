import { z } from 'zod';

export const deliveryNoteSchema = z.object({
    id: z.string(),
    source_document: z.string(),
    customer: z.string(),
    created_at: z.string(),
    delivered_at: z.string(),
});

export const deliveryNoteItemsSchema = z.object({
    item_code: z.string(),
    item_name: z.string(),
    description: z.string(),
    delivered_quantity: z.number({
        required_error: 'La cantidad a entregar es requerida',
    }),
    id: z.string(),
});

export const newDeliveryNoteSchema = z.object({
    headquarter: z.object({
        id: z.string({ required_error: 'La sede es requerida' }),
        name: z.string({ required_error: 'La sede es requerida' }),
    }),
    purchase_order: z.string({
        required_error: 'La orden de compra es requerida',
    }),
    supplier: z.string({ required_error: 'El cliente es requerido' }),
    delivered_at: z.string({
        required_error: 'La fecha de entrega es requerida',
    }),
    delivered_quantity: z.number({
        required_error: 'La cantidad a entregar es requerida',
    }),
    notes: z.string().optional(),
    items: z
        .array(deliveryNoteItemsSchema)
        .nonempty('Al menos un item es requerido'),
});

export type deliveryNote = z.infer<typeof deliveryNoteSchema>;
export type NewdeliveryNote = z.infer<typeof newDeliveryNoteSchema>;
export type deliveryNoteItems = z.infer<typeof deliveryNoteItemsSchema>;
