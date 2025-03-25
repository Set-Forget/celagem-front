import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const erpApi = createApi({
  reducerPath: 'erpApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/erp/api/' }),
  tagTypes: ['Supplier', 'PurchaseOrder', 'Bill', 'Invoice', 'Customer', 'DeliveryNote', 'CreditNote', 'DebitNote', 'PurchaseRequest', 'Material'],
  endpoints: () => ({}),
});