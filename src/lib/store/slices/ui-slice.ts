// UI slice for Redux store
// Based on RFC-002: Data Layer & State Management

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  selectedDateRange: {
    from: string
    to: string
  } | null
  selectedVenueId: string | null
  isPortfolioView: boolean
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: string
    read: boolean
  }>
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'system',
  selectedDateRange: null,
  selectedVenueId: null,
  isPortfolioView: true,
  notifications: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload
    },
    
    setDateRange: (state, action: PayloadAction<{ from: string; to: string } | null>) => {
      state.selectedDateRange = action.payload
    },
    
    setSelectedVenue: (state, action: PayloadAction<string | null>) => {
      state.selectedVenueId = action.payload
      state.isPortfolioView = !action.payload
    },
    
    togglePortfolioView: (state) => {
      state.isPortfolioView = !state.isPortfolioView
      if (state.isPortfolioView) {
        state.selectedVenueId = null
      }
    },
    
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info'
      title: string
      message: string
    }>) => {
      const notification = {
        id: Math.random().toString(36).substr(2, 9),
        ...action.payload,
        timestamp: new Date().toISOString(),
        read: false
      }
      state.notifications.unshift(notification)
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50)
      }
    },
    
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    }
  }
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setDateRange,
  setSelectedVenue,
  togglePortfolioView,
  addNotification,
  markNotificationRead,
  clearNotifications,
  removeNotification
} = uiSlice.actions

export { uiSlice }
