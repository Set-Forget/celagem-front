import { PurchaseOrderDetail, purchaseOrderDetailSchema } from '@/app/purchases/purchase-orders/schemas/purchase-orders';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const purchaseOrdersApi = createApi({
  reducerPath: 'purchaseOrdersApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://res.cloudinary.com/deogn3dmg/raw/upload/' }),
  endpoints: (builder) => ({
    listPurchaseOrders: builder.query({
      query: () => 'v1737729527/purchase_orders_inzfru.json',
    }),
    getPurchaseOrder: builder.query<PurchaseOrderDetail, string>({
      async queryFn(id, _queryApi, _extraOptions, fetchBaseQuery) {
        const response = await fetchBaseQuery('v1737729527/purchase_orders_inzfru.json');

        if (response.error) {
          return { error: response.error };
        }

        const orders = response.data as PurchaseOrderDetail[];
        const filteredOrder = orders.find((order) => order.id === parseInt(id));

        if (!filteredOrder) {
          return { error: { status: 404, data: 'Order not found' } };
        }

        return { data: filteredOrder };
      },
    }),
  }),
});

export const {
  useListPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
} = purchaseOrdersApi;


