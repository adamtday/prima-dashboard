// MSW initialization for PRIMA Partner Dashboard
// Based on RFC-002: Data Layer & State Management

export async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  // Only import and start MSW in browser environment
  if (typeof window !== 'undefined') {
    const { worker } = await import('@/mocks/browser')
    
    // Start the worker with more permissive settings
    return worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      },
      quiet: false
    })
  }
}
