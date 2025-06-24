import { CreditNoteDetail } from "@/app/(private)/(commercial)/[scope]/credit-notes/schemas/credit-notes";
import { DebitNoteDetail } from "@/app/(private)/(commercial)/[scope]/debit-notes/schemas/debit-notes";
import { BillDetail } from "@/app/(private)/(commercial)/purchases/bills/schemas/bills";
import { PurchaseReceiptDetail } from "@/app/(private)/(commercial)/purchases/purchase-receipts/schemas/purchase-receipts";
import { DeliveryNoteDetail } from "@/app/(private)/(commercial)/sales/delivery-notes/schemas/delivery-notes";
import { InvoiceDetail } from "@/app/(private)/(commercial)/sales/invoices/schemas/invoices";
import { PaymentDetail } from "@/app/(private)/banking/payments/schemas/payments";
import { ChargeDetail } from "@/app/(private)/banking/receipts/schemas/receipts";
import { AdaptedPurchaseRequestDetail } from "@/lib/adapters/purchase-requests";
import { AdaptedPurchaseOrderDetail } from "../adapters/purchase-order";
import BillPDF from "./bill";
import ChargePDF from "./charge";
import CreditNotePDF from "./credit-note";
import DebitNotePDF from "./debit-note";
import DeliveryNotePDF from "./delivery-note";
import InvoicePDF from "./invoice";
import PaymentPDF from "./payment";
import PurchaseOrderPDF from "./purchase-order";
import PurchaseRequestPDF from "./purchase-request";
import ReceptionPDF from "./receptions";
import VisitRecordPDF, { VisitRecordData } from "./visit-record";

export type TemplateMap = {
  purchaseRequest: AdaptedPurchaseRequestDetail;
  purchaseOrder: AdaptedPurchaseOrderDetail;
  bill: BillDetail;
  reception: PurchaseReceiptDetail;
  creditNote: CreditNoteDetail
  debitNote: DebitNoteDetail
  invoice: InvoiceDetail
  visitRecord: VisitRecordData
  deliveryNote: DeliveryNoteDetail
  payment: PaymentDetail
  charge: ChargeDetail
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
  payment: PaymentPDF,
  charge: ChargePDF,
  visitRecord: VisitRecordPDF,
};
