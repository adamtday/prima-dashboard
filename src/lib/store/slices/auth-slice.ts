// Auth slice for Redux store
// Based on RFC-002: Data Layer & State Management

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  lastActivity: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  lastActivity: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.lastActivity = new Date().toISOString()
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString()
    },
    
    clearAuth: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
      state.lastActivity = null
    }
  }
})

export const { setUser, setLoading, updateLastActivity, clearAuth } = authSlice.actions
export { authSlice }
