import { PurchaseOrderDetail } from "@/app/(private)/(commercial)/purchases/purchase-orders/schemas/purchase-orders";
import { PurchaseRequestDetail } from "@/app/(private)/(commercial)/purchases/purchase-requests/schemas/purchase-requests";
import PurchaseOrderPDF from "./purchase-order";
import PurchaseRequestPDF from "./purchase-request";
import VisitRecordPDF, { VisitRecordData } from "./visit-record";
import { PurchaseReceiptDetail } from "@/app/(private)/(commercial)/purchases/purchase-receipts/schemas/purchase-receipts";
import ReceptionPDF from "./receptions";
import { BillDetail } from "@/app/(private)/(commercial)/purchases/bills/schemas/bills";
import BillPDF from "./bill";
import { CreditNoteDetail } from "@/app/(private)/(commercial)/[scope]/credit-notes/schemas/credit-notes";
import CreditNotePDF from "./credit-note";
import { DebitNoteDetail } from "@/app/(private)/(commercial)/[scope]/debit-notes/schemas/debit-notes";
import DebitNotePDF from "./debit-note";
import { InvoiceDetail } from "@/app/(private)/(commercial)/sales/invoices/schemas/invoices";
import InvoicePDF from "./invoice";
import { DeliveryNoteDetail } from "@/app/(private)/(commercial)/sales/delivery-notes/schemas/delivery-notes";
import DeliveryNotePDF from "./delivery-note";

export type TemplateMap = {
  purchaseRequest: PurchaseRequestDetail;
  purchaseOrder: PurchaseOrderDetail;
  bill: BillDetail;
  reception: PurchaseReceiptDetail;
  creditNote: CreditNoteDetail
  debitNote: DebitNoteDetail
  invoice: InvoiceDetail
  visitRecord: VisitRecordData
  deliveryNote: DeliveryNoteDetail
};

export const templates = {
  purchaseRequest: PurchaseRequestPDF,
  purchaseOrder: PurchaseOrderPDF,
  bill: BillPDF,
  reception: ReceptionPDF,
  creditNote: CreditNotePDF,
  debitNote: DebitNotePDF,
  invoice: InvoicePDF,
  deliveryNote: DeliveryNotePDF,
  visitRecord: VisitRecordPDF,
};
