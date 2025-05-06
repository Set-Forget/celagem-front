import PurchaseOrderPDF, { PurchaseOrderData } from "./purchase-order";

export type TemplateMap = {
  purchaseOrder: PurchaseOrderData;
};

export const templates = {
  purchaseOrder: PurchaseOrderPDF,
};
