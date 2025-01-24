import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const purchaseOrdersApi = createApi({
  reducerPath: 'purchaseOrdersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://res.cloudinary.com/deogn3dmg/raw/upload/' }),
  endpoints: (builder) => ({
    listPurchaseOrders: builder.query({
      query: () => 'v1737729527/purchase_orders_inzfru.json',
    }),
  }),
})

export const { useListPurchaseOrdersQuery } = purchaseOrdersApi


