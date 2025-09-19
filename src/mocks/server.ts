// MSW server setup for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// This configures a request mocking server with the given request handlers
export const server = setupServer(...handlers)
