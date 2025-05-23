import { CalendarDate } from '@internationalized/date';
import { z } from 'zod';

export const newDeliveryNoteItemSchema = z.object({
  product_id: z.number({ required_error: "El producto es requerido" }),
  product_uom: z.number({ required_error: "La unidad de medida es requerida" }),
  quantity: z.number({ required_error: "La cantidad es requerida" }),
});

export const deliveryNoteListSchema = z.object({
  id: z.number(),
  number: z.string(),
  customer: z.string(),
  scheduled_date: z.string(),
  delivery_date: z.string(),
  delivery_location: z.string(),
  source_location: z.string(),
})

export const newDeliveryNoteSchema = z.object({
  customer: z.number({ required_error: "El proveedor es requerido" }),
  delivery_date: z.custom<CalendarDate>((data) => {
    return data instanceof CalendarDate;
  }, { message: "La fecha de recepción es requerida" }),
  scheduled_date: z.string().optional(),
  delivery_location: z.number({ required_error: "La ubicación de recepción es requerida" }),
  source_location: z.number({ required_error: "La ubicación de origen es requerida" }),
  move_type: z.enum(["direct"], { required_error: "El tipo de movimiento es requerido" }),
  notes: z.string().optional(),
  items: z.array(newDeliveryNoteItemSchema),
});

export const deliveryNoteListResponseSchema = z.object({
  status: z.string(),
  data: z.array(deliveryNoteListSchema),
});

export const newDeliveryNoteResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const deliveryNoteItemSchema = z.object({
  product_id: z.number(),
  display_name: z.string(),
  product_uom_qty: z.number(),
  quantity: z.number(),
  product_uom: z.object({
    id: z.number(),
    name: z.string(),
  }),
})

export const deliveryNoteDetailSchema = z.object({
  id: z.number(),
  number: z.string(),
  customer: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
  }),
  scheduled_date: z.string(),
  delivery_date: z.string(),
  note: z.string(),
  delivery_location: z.string(),
  source_location: z.string(),
  items: z.array(deliveryNoteItemSchema),
});

export const deliveryNoteDetailResponseSchema = z.object({
  status: z.string(),
  data: deliveryNoteDetailSchema,
});

export type DeliveryNoteList = z.infer<typeof deliveryNoteListSchema>;
export type DeliveryNoteListResponse = z.infer<typeof deliveryNoteListResponseSchema>;

export type NewDeliveryNote = z.infer<typeof newDeliveryNoteSchema>;
export type NewDeliveryNoteResponse = z.infer<typeof newDeliveryNoteResponseSchema>;


export type DeliveryNoteDetail = z.infer<typeof deliveryNoteDetailSchema>;
export type DeliveryNoteItem = z.infer<typeof deliveryNoteItemSchema>;
export type DeliveryNoteDetailResponse = z.infer<typeof deliveryNoteDetailResponseSchema>;
