// MSW browser setup for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// This configures a Service Worker with the given request handlers
export const worker = setupWorker(...handlers)
