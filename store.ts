import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { purchaseOrdersApi } from './services/purchase-orders'
import { medicalManagementApi } from './services/appointments'
import { purchaseReceiptsApi } from './services/purchase-receipts'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [purchaseOrdersApi.reducerPath]: purchaseOrdersApi.reducer,
    [medicalManagementApi.reducerPath]: medicalManagementApi.reducer,
    [purchaseReceiptsApi.reducerPath]: purchaseReceiptsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      purchaseOrdersApi.middleware,
      medicalManagementApi.middleware,
      purchaseReceiptsApi.middleware
    ),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)