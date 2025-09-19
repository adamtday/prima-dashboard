# PWA Configuration Guide

Complete guide for implementing Progressive Web App (PWA) functionality in the PRIMA Partner Dashboard, enabling installable and offline-capable experiences.

## 🎯 PWA Strategy

**Primary Goal**: Transform the PRIMA Partner Dashboard into an installable, app-like experience that works reliably across devices and network conditions.

**Key Benefits**:
- **Installability**: Add to home screen on mobile/desktop
- **Offline Resilience**: Core functionality available without internet
- **Performance**: App-shell architecture for instant loading
- **Engagement**: Push notifications for critical updates

## 📱 PWA Requirements

### Installation Criteria
1. **HTTPS**: Served over secure connection
2. **Web App Manifest**: Complete manifest configuration
3. **Service Worker**: Registered and controlling pages
4. **Installable**: Meets browser installation requirements

### Offline Functionality
1. **Core App Shell**: Always available navigation and layout
2. **Critical Data**: Essential dashboard data cached
3. **Graceful Degradation**: Clear offline indicators
4. **Sync Capabilities**: Background sync for updates when online

## 🔧 Web App Manifest

### Manifest Configuration
```json
// public/manifest.json
{
  "name": "PRIMA Partner Dashboard",
  "short_name": "PRIMA",
  "description": "Comprehensive venue management and promoter dashboard for hospitality partners",
  "start_url": "/overview",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#7c3aed",
  "background_color": "#ffffff",
  "lang": "en-US",
  "dir": "ltr",
  
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96", 
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  
  "shortcuts": [
    {
      "name": "Overview Dashboard",
      "short_name": "Overview",
      "description": "Quick access to key performance metrics",
      "url": "/overview",
      "icons": [
        {
          "src": "/icons/shortcut-overview.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Bookings",
      "short_name": "Bookings",
      "description": "Manage reservations and guest bookings",
      "url": "/bookings",
      "icons": [
        {
          "src": "/icons/shortcut-bookings.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Promoters",
      "short_name": "Promoters",
      "description": "Track promoter performance and leaderboards",
      "url": "/promoters",
      "icons": [
        {
          "src": "/icons/shortcut-promoters.png",
          "sizes": "96x96"
        }
      ]
    },
    {
      "name": "Finance",
      "short_name": "Finance",
      "description": "Financial overview and payout management",
      "url": "/finance",
      "icons": [
        {
          "src": "/icons/shortcut-finance.png",
          "sizes": "96x96"
        }
      ]
    }
  ],
  
  "categories": [
    "business",
    "productivity",
    "finance"
  ],
  
  "screenshots": [
    {
      "src": "/screenshots/desktop-overview.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Overview Dashboard - Desktop"
    },
    {
      "src": "/screenshots/mobile-overview.png", 
      "sizes": "375x812",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Overview Dashboard - Mobile"
    },
    {
      "src": "/screenshots/desktop-bookings.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide",
      "label": "Bookings Management - Desktop"
    },
    {
      "src": "/screenshots/mobile-bookings.png",
      "sizes": "375x812", 
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Bookings Management - Mobile"
    }
  ]
}
```

### HTML Integration
```html
<!-- app/layout.tsx -->
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#7c3aed" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="PRIMA" />
  
  {/* Apple Touch Icons */}
  <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
  
  {/* Microsoft Tiles */}
  <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
  <meta name="msapplication-TileColor" content="#7c3aed" />
</head>
```

## 🛠️ Service Worker Implementation

### Service Worker Registration
```typescript
// lib/pwa/register-sw.ts
export function registerServiceWorker() {
  if (typeof window === 'undefined') return

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })

        // Update available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content available
                  showUpdateAvailableNotification()
                } else {
                  // Content cached for first time
                  showContentCachedNotification()
                }
              }
            })
          }
        })

        console.log('SW registered: ', registration)
      } catch (registrationError) {
        console.log('SW registration failed: ', registrationError)
      }
    })
  }
}

function showUpdateAvailableNotification() {
  // Show toast notification for app update
  if (window.showUpdateToast) {
    window.showUpdateToast()
  }
}

function showContentCachedNotification() {
  // Show first-time cache notification
  console.log('Content cached for offline use')
}
```

### Service Worker Core
```javascript
// public/sw.js
const CACHE_NAME = 'prima-dashboard-v1.0.0'
const RUNTIME_CACHE = 'prima-runtime-v1.0.0'

// App Shell - Critical resources that should always be cached
const APP_SHELL = [
  '/',
  '/overview',
  '/bookings',
  '/pricing',
  '/promoters',
  '/finance',
  '/offline',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install event - Cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell')
        return cache.addAll(APP_SHELL)
      })
      .then(() => {
        // Take control immediately
        return self.skipWaiting()
      })
  )
})

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Take control of all pages
      return self.clients.claim()
    })
  )
})

// Fetch event - Network-first strategy with offline fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return

  // Handle API requests with network-first strategy
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request))
    return
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(event.request))
    return
  }

  // Handle static assets with cache-first strategy
  event.respondWith(cacheFirstStrategy(event.request))
})

// Network-first strategy for API requests
async function networkFirstStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE)
  
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      // Add offline indicator header
      const response = cachedResponse.clone()
      response.headers.set('X-Served-From', 'cache')
      return response
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This request requires an internet connection',
        cached: false
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
          'X-Served-From': 'offline'
        }
      }
    )
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return fallback for images
    if (request.destination === 'image') {
      return cache.match('/icons/icon-192x192.png')
    }
    
    throw error
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Network failed, serve cached page or offline page
    const cache = await caches.open(CACHE_NAME)
    
    // Try to serve cached version of requested page
    const cachedPage = await cache.match(request)
    if (cachedPage) {
      return cachedPage
    }
    
    // Serve offline page as fallback
    const offlinePage = await cache.match('/offline')
    return offlinePage || new Response('Offline')
  }
}

// Background sync for data updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync())
  }
})

async function handleBackgroundSync() {
  // Sync pending booking updates
  await syncPendingBookingUpdates()
  
  // Sync offline actions
  await syncOfflineActions()
  
  // Refresh cached data
  await refreshCriticalData()
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const notificationData = event.data.json()
    
    event.waitUntil(
      self.registration.showNotification(notificationData.title, {
        body: notificationData.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: notificationData.tag,
        data: notificationData.data,
        actions: notificationData.actions || []
      })
    )
  }
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const urlToOpen = event.notification.data?.url || '/overview'
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus()
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})
```

## 💾 Offline Data Strategy

### Critical Data Caching
```typescript
// lib/pwa/offline-data.ts
interface OfflineData {
  venues: Venue[]
  recentBookings: Booking[]
  promoterSummary: PromoterSummary[]
  kpiSnapshot: KPISnapshot
  cachedAt: string
}

export class OfflineDataManager {
  private static readonly STORAGE_KEY = 'prima-offline-data'
  private static readonly MAX_AGE = 24 * 60 * 60 * 1000 // 24 hours

  static async cacheEssentialData(data: Partial<OfflineData>) {
    try {
      const existing = await this.getOfflineData()
      const updated = {
        ...existing,
        ...data,
        cachedAt: new Date().toISOString()
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
    } catch (error) {
      console.warn('Failed to cache offline data:', error)
    }
  }

  static async getOfflineData(): Promise<OfflineData | null> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return null

      const data = JSON.parse(stored) as OfflineData
      const cachedAt = new Date(data.cachedAt)
      const now = new Date()

      // Check if data is stale
      if (now.getTime() - cachedAt.getTime() > this.MAX_AGE) {
        this.clearOfflineData()
        return null
      }

      return data
    } catch (error) {
      console.warn('Failed to retrieve offline data:', error)
      return null
    }
  }

  static clearOfflineData() {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static async isDataStale(): Promise<boolean> {
    const data = await this.getOfflineData()
    if (!data) return true

    const cachedAt = new Date(data.cachedAt)
    const now = new Date()
    return now.getTime() - cachedAt.getTime() > this.MAX_AGE
  }
}

// Hook for offline data access
export function useOfflineData() {
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    // Check online status
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine)
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    updateOnlineStatus()

    // Load offline data when offline
    if (!navigator.onLine) {
      OfflineDataManager.getOfflineData().then(setOfflineData)
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  return {
    offlineData,
    isOffline,
    hasOfflineData: !!offlineData
  }
}
```

### Offline UI Components
```typescript
// components/offline/offline-indicator.tsx
export function OfflineIndicator() {
  const { isOffline } = useOfflineData()

  if (!isOffline) return null

  return (
    <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-4">
      <div className="flex items-center">
        <WifiOff className="h-5 w-5 text-orange-500 mr-3" />
        <div>
          <p className="text-sm font-medium text-orange-800">
            You're currently offline
          </p>
          <p className="text-sm text-orange-700">
            Some features may be limited. Changes will sync when you're back online.
          </p>
        </div>
      </div>
    </div>
  )
}

// components/offline/offline-fallback.tsx
export function OfflineFallback({ children }: { children: React.ReactNode }) {
  const { isOffline, hasOfflineData } = useOfflineData()

  if (!isOffline) {
    return <>{children}</>
  }

  if (!hasOfflineData) {
    return (
      <div className="text-center py-12">
        <WifiOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No internet connection</h3>
        <p className="text-muted-foreground mb-4">
          Please check your connection and try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div>
      <OfflineIndicator />
      {children}
    </div>
  )
}
```

## 📲 Installation & Update Management

### Install Prompt Handler
```typescript
// lib/pwa/install-prompt.ts
export class InstallPromptManager {
  private static deferredPrompt: any = null

  static initialize() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = e
      
      // Show custom install button
      this.showInstallButton()
    })

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed')
      this.hideInstallButton()
      this.deferredPrompt = null
    })
  }

  static async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false
    }

    // Show the install prompt
    this.deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice

    console.log(`User response to the install prompt: ${outcome}`)

    this.deferredPrompt = null
    
    return outcome === 'accepted'
  }

  static canInstall(): boolean {
    return !!this.deferredPrompt
  }

  private static showInstallButton() {
    // Dispatch custom event to show install button
    window.dispatchEvent(new CustomEvent('pwa-install-available'))
  }

  private static hideInstallButton() {
    // Dispatch custom event to hide install button
    window.dispatchEvent(new CustomEvent('pwa-install-completed'))
  }
}

// Install Button Component
export function InstallButton() {
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    const handleInstallAvailable = () => setCanInstall(true)
    const handleInstallCompleted = () => setCanInstall(false)

    window.addEventListener('pwa-install-available', handleInstallAvailable)
    window.addEventListener('pwa-install-completed', handleInstallCompleted)

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable)
      window.removeEventListener('pwa-install-completed', handleInstallCompleted)
    }
  }, [])

  const handleInstall = async () => {
    const installed = await InstallPromptManager.promptInstall()
    if (installed) {
      setCanInstall(false)
    }
  }

  if (!canInstall) return null

  return (
    <Button onClick={handleInstall} className="flex items-center gap-2">
      <Download className="h-4 w-4" />
      Install App
    </Button>
  )
}
```

### Update Management
```typescript
// lib/pwa/update-manager.ts
export class UpdateManager {
  static async checkForUpdates(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      
      if (registration) {
        await registration.update()
        return !!registration.waiting
      }
    }
    
    return false
  }

  static async applyUpdate(): Promise<void> {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration()
      
      if (registration?.waiting) {
        // Tell the waiting SW to skip waiting and take control
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        
        // Reload to activate new service worker
        window.location.reload()
      }
    }
  }
}

// Update Notification Component
export function UpdateNotification() {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    const checkUpdates = async () => {
      const hasUpdate = await UpdateManager.checkForUpdates()
      setUpdateAvailable(hasUpdate)
    }

    checkUpdates()

    // Check for updates every 30 minutes
    const interval = setInterval(checkUpdates, 30 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const handleUpdate = () => {
    UpdateManager.applyUpdate()
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <Download className="h-5 w-5 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium">Update Available</h4>
          <p className="text-sm opacity-90 mb-3">
            A new version of PRIMA Dashboard is ready to install.
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setUpdateAvailable(false)}
            >
              Later
            </Button>
            <Button size="sm" onClick={handleUpdate}>
              Update Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## 🔔 Push Notifications (Optional)

### Push Notification Setup
```typescript
// lib/pwa/push-notifications.ts
export class PushNotificationManager {
  private static readonly VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_KEY

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  static async subscribeToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (!registration) return null

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.VAPID_PUBLIC_KEY!)
      })

      // Send subscription to backend
      await this.sendSubscriptionToBackend(subscription)

      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  private static urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  private static async sendSubscriptionToBackend(subscription: PushSubscription) {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
  }
}
```

## ✅ PWA Implementation Checklist

### Manifest & Icons
- [ ] Web app manifest configured with complete metadata
- [ ] Icon set generated (72px to 512px)
- [ ] Apple touch icons included
- [ ] Screenshots for app stores prepared
- [ ] Shortcuts configured for key features

### Service Worker
- [ ] Service worker registered and functional
- [ ] App shell caching strategy implemented
- [ ] API request caching with network-first strategy
- [ ] Offline fallback pages created
- [ ] Background sync configured

### Installation & Updates
- [ ] Install prompt management implemented
- [ ] Custom install button/banner created
- [ ] Update detection and notification system
- [ ] Smooth update application process

### Offline Experience
- [ ] Critical data caching implemented
- [ ] Offline indicators and feedback
- [ ] Graceful degradation for offline features
- [ ] Offline action queuing and sync

### Performance & Compliance
- [ ] PWA audit scores >90 in Lighthouse
- [ ] Installability criteria met
- [ ] HTTPS serving configured
- [ ] Responsive design verified across devices

### Optional Enhancements
- [ ] Push notification infrastructure
- [ ] Background sync for data updates
- [ ] Advanced caching strategies
- [ ] Deep linking and navigation handling

---

This PWA configuration transforms the PRIMA Partner Dashboard into a native app-like experience while maintaining web accessibility and cross-platform compatibility.
