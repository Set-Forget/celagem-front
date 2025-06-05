import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { erpApi } from './lib/apis/erp-api'
import { hcApi } from './lib/apis/hc-api'
import { usersApi } from './lib/apis/users-api'
import { googleApi } from './lib/apis/google.api'
import { telegramApi } from './lib/apis/telegram.api'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [erpApi.reducerPath]: erpApi.reducer,
    [hcApi.reducerPath]: hcApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [googleApi.reducerPath]: googleApi.reducer,
    [telegramApi.reducerPath]: telegramApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      erpApi.middleware,
      hcApi.middleware,
      usersApi.middleware,
      googleApi.middleware,
      telegramApi.middleware,
    ),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)