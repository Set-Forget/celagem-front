const purchaseRequest = "/purchases/purchase-requests";
const bill = "/purchases/bills";
const reception = "/purchases/purchase-receipts";
const purchaseOrder = "/purchases/purchase-orders";
const purchaseCreditNote = "/purchases/credit-notes";
const purchaseDebitNote = "/purchases/debit-notes";
const salesCreditNote = "/sales/credit-notes";
const salesDebitNote = "/sales/debit-notes";
const invoice = "/sales/invoices";
const chartOfAccounts = "/accounting/chart-of-accounts";
const suppliers = "/purchases/vendors";
const customers = "/sales/customers";
const payments = "/banking/payments";
const receipts = "/banking/receipts";

export const routes = {
  purchaseOrder: {
    list: purchaseOrder,
    detail: (id: number | string) => `${purchaseOrder}/${id}`,
    new: `${purchaseOrder}/new`,
    edit: (id: number | string) => `${purchaseOrder}/${id}/edit`,
  },

  purchaseRequest: {
    list: purchaseRequest,
    detail: (id: number | string) => `${purchaseRequest}/${id}`,
    new: `${purchaseRequest}/new`,
    edit: (id: number | string) => `${purchaseRequest}/${id}/edit`,
  },

  bill: {
    list: bill,
    detail: (id: number | string) => `${bill}/${id}`,
    new: `${bill}/new`,
    edit: (id: number | string) => `${bill}/${id}/edit`,
  },

  invoice: {
    list: invoice,
    detail: (id: number | string) => `${invoice}/${id}`,
    new: `${invoice}/new`,
    edit: (id: number | string) => `${invoice}/${id}/edit`,
  },

  reception: {
    list: reception,
    detail: (id: number | string) => `${reception}/${id}`,
    new: `${reception}/new`,
    edit: (id: number | string) => `${reception}/${id}/edit`,
  },

  purchaseCreditNote: {
    list: purchaseCreditNote,
    detail: (id: number | string) => `${purchaseCreditNote}/${id}`,
    new: `${purchaseCreditNote}/new`,
    edit: (id: number | string) => `${purchaseCreditNote}/${id}/edit`,
  },

  purchaseDebitNote: {
    list: purchaseDebitNote,
    detail: (id: number | string) => `${purchaseDebitNote}/${id}`,
    new: `${purchaseDebitNote}/new`,
    edit: (id: number | string) => `${purchaseDebitNote}/${id}/edit`,
  },

  salesCreditNote: {
    list: salesCreditNote,
    detail: (id: number | string) => `${salesCreditNote}/${id}`,
    new: `${salesCreditNote}/new`,
    edit: (id: number | string) => `${salesCreditNote}/${id}/edit`,
  },

  salesDebitNote: {
    list: salesDebitNote,
    detail: (id: number | string) => `${salesDebitNote}/${id}`,
    new: `${salesDebitNote}/new`,
    edit: (id: number | string) => `${salesDebitNote}/${id}/edit`,
  },

  chartOfAccounts: {
    list: chartOfAccounts,
    detail: (id: number | string) => `${chartOfAccounts}/${id}`,
    new: `${chartOfAccounts}/new`,
    edit: (id: number | string) => `${chartOfAccounts}/${id}/edit`,
  },

  suppliers: {
    list: suppliers,
    detail: (id: number | string) => `${suppliers}/${id}`,
    new: `${suppliers}/new`,
    edit: (id: number | string) => `${suppliers}/${id}/edit`,
  },

  customers: {
    list: customers,
    detail: (id: number | string) => `${customers}/${id}`,
    new: `${customers}/new`,
    edit: (id: number | string) => `${customers}/${id}/edit`,
  },

  payments: {
    list: payments,
    detail: (id: number | string) => `${payments}/${id}`,
    new: (billIds?: string | number) => `${payments}/new${billIds ? `?bill_ids=${billIds}` : ""}`,
    edit: (id: number | string) => `${payments}/${id}/edit`,
  },

  receipts: {
    list: receipts,
    detail: (id: number | string) => `${receipts}/${id}`,
    new: (invoiceIds?: string | number) => `${receipts}/new${invoiceIds ? `?bill_ids=${invoiceIds}` : ""}`,
    edit: (id: number | string) => `${receipts}/${id}/edit`,
  },
} as const;
