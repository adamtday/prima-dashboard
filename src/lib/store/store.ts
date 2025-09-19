// Redux store configuration for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { primaApi } from './api'
import { authSlice } from './slices/auth-slice'
import { uiSlice } from './slices/ui-slice'

export const store = configureStore({
  reducer: {
    // RTK Query API
    [primaApi.reducerPath]: primaApi.reducer,
    
    // Client state slices
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }).concat(primaApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// Enable refetch on focus/reconnect
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Export store for use in components
export { store as default }
