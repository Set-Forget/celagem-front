import PurchaseOrderPDF, { PurchaseOrderData } from "./purchase-order";
import VisitRecordPDF, { VisitRecordData } from "./visit-record";

export type TemplateMap = {
  purchaseOrder: PurchaseOrderData;
  visitRecord: VisitRecordData
};

export const templates = {
  purchaseOrder: PurchaseOrderPDF,
  visitRecord: VisitRecordPDF,
};
