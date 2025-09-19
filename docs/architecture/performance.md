# Performance Guidelines

Comprehensive performance optimization guidelines for the PRIMA Partner Dashboard, ensuring fast, responsive user experiences across all devices and network conditions.

## 🎯 Performance Goals

**Primary Objectives**:
- **Core Web Vitals**: Meet Google's Core Web Vitals thresholds
- **Perceived Performance**: Instant interactions and feedback
- **Network Resilience**: Optimize for variable connection quality
- **Battery Efficiency**: Minimize resource consumption on mobile devices

### Performance Budgets
```typescript
const PERFORMANCE_BUDGETS = {
  // Core Web Vitals
  LCP: 2500,        // Largest Contentful Paint (ms)
  FID: 100,         // First Input Delay (ms)  
  CLS: 0.1,         // Cumulative Layout Shift (score)
  
  // Custom Metrics
  TTI: 3500,        // Time to Interactive (ms)
  FCP: 1800,        // First Contentful Paint (ms)
  
  // Page Load Times
  overview: 2000,    // Overview dashboard (ms)
  bookings: 3000,    // Bookings table with data (ms)
  pricing: 1500,     // Pricing configuration (ms)
  promoters: 2500,   // Promoter leaderboard (ms)
  finance: 2000,     // Financial overview (ms)
  
  // Interaction Times
  venueSwitch: 500,  // Venue context switching (ms)
  search: 300,       // Search results (ms)
  sort: 400,         // Table sorting (ms)
  livePricing: 200,  // Live pricing calculation (ms)
  
  // Bundle Sizes
  initialJS: 250,    // Initial JS bundle (KB)
  totalJS: 1000,     // Total JS transferred (KB)
  initialCSS: 50,    // Initial CSS (KB)
  totalAssets: 2000, // Total page weight (KB)
} as const
```

## 🚀 Core Optimization Strategies

### 1. Code Splitting & Lazy Loading

#### Route-Level Code Splitting
```typescript
// app/layout.tsx - Main layout with core dependencies
import { Suspense } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppShell } from '@/components/layout/app-shell'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <AppShell>
            <Suspense fallback={<PageSkeleton />}>
              {children}
            </Suspense>
          </AppShell>
        </SidebarProvider>
      </body>
    </html>
  )
}

// Component-level lazy loading
const OverviewCharts = lazy(() => import('@/components/overview/charts'))
const BookingTable = lazy(() => import('@/components/bookings/table'))
const PromoterLeaderboard = lazy(() => import('@/components/promoters/leaderboard'))

// Usage with loading boundaries
function OverviewPage() {
  return (
    <div className="space-y-6">
      <OverviewHeader />
      <OverviewKPIs />
      <Suspense fallback={<ChartsSkeleton />}>
        <OverviewCharts />
      </Suspense>
    </div>
  )
}
```

#### Dynamic Imports for Heavy Components
```typescript
// Lazy load chart library only when needed
const ChartComponent = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart })),
  { 
    loading: () => <ChartSkeleton />,
    ssr: false // Charts don't need SSR
  }
)

// Lazy load complex modals
const PromoterDetailsModal = dynamic(
  () => import('@/components/promoters/details-modal'),
  { loading: () => <ModalSkeleton /> }
)

// Conditional loading based on user role
const FinanceModule = dynamic(
  () => import('@/components/finance/finance-module'),
  { 
    loading: () => <ModuleSkeleton />,
    // Only load if user has finance access
    skip: !user?.permissions.includes('finance')
  }
)
```

### 2. Data Loading Optimization

#### RTK Query Configuration
```typescript
// lib/api/rtk-config.ts
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Add auth headers
      const token = selectAuthToken(getState())
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  
  // Global cache configuration
  keepUnusedDataFor: 60, // Cache data for 60 seconds
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  refetchOnFocus: true,
  refetchOnReconnect: true,
  
  tagTypes: ['Booking', 'Promoter', 'Venue', 'Pricing', 'Finance'],
  
  endpoints: (builder) => ({
    // Optimized queries with proper caching
    getOverviewData: builder.query<OverviewData, { venueId?: string }>({
      query: ({ venueId }) => ({
        url: '/overview',
        params: { venueId }
      }),
      providesTags: ['Booking', 'Promoter', 'Finance'],
      // Keep overview data cached longer
      keepUnusedDataFor: 300, // 5 minutes
      
      // Transform response to reduce re-renders
      transformResponse: (response: ApiResponse<OverviewData>) => {
        return {
          ...response.data,
          // Pre-calculate derived values
          profitMargin: response.data.revenue > 0 
            ? (response.data.profit / response.data.revenue) * 100 
            : 0
        }
      },
    }),
    
    // Paginated queries with cursor-based pagination
    getBookings: builder.query<BookingsResponse, BookingsQuery>({
      query: ({ page = 1, size = 50, ...filters }) => ({
        url: '/bookings',
        params: { page, size, ...filters }
      }),
      providesTags: (result) => 
        result?.items
          ? [...result.items.map(({ id }) => ({ type: 'Booking' as const, id })), 'Booking']
          : ['Booking'],
      
      // Merge pages for infinite scroll
      serializeQueryArgs: ({ queryArgs }) => {
        const { page, ...otherArgs } = queryArgs
        return otherArgs
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems
        }
        return {
          ...newItems,
          items: [...(currentCache?.items || []), ...newItems.items]
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page
      },
    }),
  }),
})
```

#### Prefetching Strategies
```typescript
// hooks/use-prefetch-data.ts
export function usePrefetchData() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  // Prefetch data on hover/focus
  const prefetchOverview = useCallback(() => {
    dispatch(api.util.prefetch('getOverviewData', {}, { force: false }))
  }, [dispatch])
  
  const prefetchBookings = useCallback(() => {
    dispatch(api.util.prefetch('getBookings', { page: 1 }, { force: false }))
  }, [dispatch])
  
  // Prefetch on route change intent
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (url.includes('/overview')) {
        prefetchOverview()
      } else if (url.includes('/bookings')) {
        prefetchBookings()
      }
    }
    
    router.events.on('routeChangeStart', handleRouteChangeStart)
    return () => router.events.off('routeChangeStart', handleRouteChangeStart)
  }, [router, prefetchOverview, prefetchBookings])
  
  return {
    prefetchOverview,
    prefetchBookings,
    // ... other prefetch functions
  }
}

// Navigation component with prefetching
function NavigationLink({ href, children, onPrefetch }: NavigationLinkProps) {
  return (
    <Link
      href={href}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className="nav-link"
    >
      {children}
    </Link>
  )
}
```

### 3. Rendering Optimization

#### React Performance Patterns
```typescript
// Memoization for expensive calculations
const PromoterLeaderboard = memo(function PromoterLeaderboard({ 
  promoters, 
  sortBy, 
  filters 
}: PromoterLeaderboardProps) {
  // Memoize expensive sorting/filtering
  const sortedPromoters = useMemo(() => {
    return sortPromoters(
      filterPromoters(promoters, filters),
      sortBy
    )
  }, [promoters, sortBy, filters])
  
  // Memoize callbacks to prevent child re-renders
  const handlePromoterClick = useCallback((promoterId: string) => {
    onPromoterSelect?.(promoterId)
  }, [onPromoterSelect])
  
  return (
    <div className="promoter-leaderboard">
      {sortedPromoters.map(promoter => (
        <PromoterRow
          key={promoter.id}
          promoter={promoter}
          onClick={handlePromoterClick}
        />
      ))}
    </div>
  )
})

// Virtualization for large lists
function BookingTable({ bookings }: BookingTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  
  const rowVirtualizer = useVirtualizer({
    count: bookings.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 64, // Estimated row height
    overscan: 10, // Render 10 extra items outside viewport
  })
  
  return (
    <div ref={tableContainerRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map(virtualRow => (
          <BookingRow
            key={virtualRow.key}
            booking={bookings[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Optimized state updates
function useDebouncedState<T>(initialValue: T, delay: number) {
  const [value, setValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return [debouncedValue, setValue] as const
}
```

#### Optimistic Updates
```typescript
// hooks/use-optimistic-updates.ts
export function useOptimisticBookingUpdate() {
  const [updateBooking] = useUpdateBookingMutation()
  const dispatch = useAppDispatch()
  
  const updateBookingOptimistically = useCallback(async (
    bookingId: string,
    updates: Partial<Booking>
  ) => {
    // Immediately update the cache optimistically
    dispatch(
      api.util.updateQueryData('getBookings', { page: 1 }, (draft) => {
        const booking = draft.items.find(b => b.id === bookingId)
        if (booking) {
          Object.assign(booking, updates, { 
            updatedAt: new Date().toISOString() 
          })
        }
      })
    )
    
    try {
      // Perform the actual update
      await updateBooking({ id: bookingId, updates }).unwrap()
    } catch (error) {
      // Revert optimistic update on error
      dispatch(
        api.util.invalidateTags([{ type: 'Booking', id: bookingId }])
      )
      
      throw error
    }
  }, [updateBooking, dispatch])
  
  return updateBookingOptimistically
}
```

### 4. Asset Optimization

#### Image Optimization
```typescript
// components/optimized-image.tsx
interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
}

function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  priority = false,
  className 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={85} // Slightly reduce quality for better compression
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0eH/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/EABRAQEAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALuYBfz9FQfynDWXYKHOYlcBkQiRnuVyKJFzQ2sBJXBOa5q2qOWkYl5N9NuMSLSpOqjepQQJrSoWxQsOpMkHGAmTWdPOGCM5lJd0s0b1Q4KNlGLdoqc3oTCtbYqqnJKs9WCHGqQYi4zMBhWqPCFGmUDGGGR8hgBGgHQWuiihNrxULNNZlFWWMJCnGlJLGk1qsGXgKdKWpvJ5gJRgWsGNjdMwONaDUDLHBpnkYsBGAHDRNHa8h4NQcmHIhUHAdpG6S1/YfOSLMGYqWRhYLWWlHkKgfJO6vQ2Yyg+y6GCkNmCjVF2YGNkdh+2qQ44xgZGWqj9y0YBdpNtS7aIUpwAgBvKEjhJGxYCKqMkgghvHhLkxGjDYcfRjlCBjRQYUgbDGgsDYjVhGH6q2rYBlDxEGPYsHBqPOmZFkqMGBqLLNhKJGXWyeNhHHhHSgGOQbpKhX7M="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={className}
    />
  )
}

// Avatar component with lazy loading
function PromoterAvatar({ promoter, size = 40 }: PromoterAvatarProps) {
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <div ref={imgRef} className="avatar">
      {isInView ? (
        <OptimizedImage
          src={promoter.avatar || '/avatars/default.png'}
          alt={`${promoter.firstName} ${promoter.lastName}`}
          width={size}
          height={size}
        />
      ) : (
        <div 
          className="avatar-skeleton"
          style={{ width: size, height: size }}
        />
      )}
    </div>
  )
}
```

#### Font Optimization
```typescript
// app/layout.tsx
import { Inter, Noto_Sans, IBM_Plex_Mono } from 'next/font/google'

// Optimize font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent invisible text during font swap
  variable: '--font-inter',
  preload: true,
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
  weight: ['400', '500', '600', '700'], // Only load needed weights
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${notoSans.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
```

## ⚡ Performance Monitoring

### Real User Monitoring (RUM)
```typescript
// lib/performance/monitoring.ts
interface PerformanceMetrics {
  LCP: number
  FID: number
  CLS: number
  FCP: number
  TTI: number
  customMetrics: Record<string, number>
}

export class PerformanceMonitor {
  private static metrics: Partial<PerformanceMetrics> = {}
  
  static initialize() {
    // Core Web Vitals monitoring
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    
    // Custom metrics
    this.observeCustomMetrics()
    
    // Send metrics when page unloads
    window.addEventListener('beforeunload', () => {
      this.sendMetrics()
    })
  }
  
  private static observeLCP() {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.metrics.LCP = lastEntry.startTime
    }).observe({ entryTypes: ['largest-contentful-paint'] })
  }
  
  private static observeFID() {
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0]
      this.metrics.FID = firstInput.processingStart - firstInput.startTime
    }).observe({ entryTypes: ['first-input'] })
  }
  
  private static observeCLS() {
    let cls = 0
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value
        }
      }
      this.metrics.CLS = cls
    }).observe({ entryTypes: ['layout-shift'] })
  }
  
  private static observeCustomMetrics() {
    // Venue switch time
    window.addEventListener('venue-switch-start', () => {
      performance.mark('venue-switch-start')
    })
    
    window.addEventListener('venue-switch-end', () => {
      performance.mark('venue-switch-end')
      performance.measure('venue-switch', 'venue-switch-start', 'venue-switch-end')
      
      const measure = performance.getEntriesByName('venue-switch')[0]
      this.metrics.customMetrics = {
        ...this.metrics.customMetrics,
        venueSwitch: measure.duration
      }
    })
    
    // Search performance
    window.addEventListener('search-start', () => {
      performance.mark('search-start')
    })
    
    window.addEventListener('search-results', () => {
      performance.mark('search-end')
      performance.measure('search', 'search-start', 'search-end')
      
      const measure = performance.getEntriesByName('search')[0]
      this.metrics.customMetrics = {
        ...this.metrics.customMetrics,
        search: measure.duration
      }
    })
  }
  
  static recordCustomMetric(name: string, value: number) {
    this.metrics.customMetrics = {
      ...this.metrics.customMetrics,
      [name]: value
    }
  }
  
  private static async sendMetrics() {
    if (Object.keys(this.metrics).length === 0) return
    
    try {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.metrics,
          url: window.location.pathname,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
        keepalive: true
      })
    } catch (error) {
      console.warn('Failed to send performance metrics:', error)
    }
  }
}

// Usage in hooks
export function usePerformanceTracking() {
  const trackVenueSwitch = useCallback(() => {
    window.dispatchEvent(new CustomEvent('venue-switch-start'))
    
    return () => {
      window.dispatchEvent(new CustomEvent('venue-switch-end'))
    }
  }, [])
  
  const trackSearch = useCallback(() => {
    window.dispatchEvent(new CustomEvent('search-start'))
    
    return () => {
      window.dispatchEvent(new CustomEvent('search-results'))
    }
  }, [])
  
  return {
    trackVenueSwitch,
    trackSearch,
    recordMetric: PerformanceMonitor.recordCustomMetric
  }
}
```

### Performance Budget Enforcement
```typescript
// lib/performance/budget-enforcement.ts
export function enforcePerformanceBudgets() {
  // Check bundle sizes
  if (process.env.NODE_ENV === 'development') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const loadTime = entry.loadEventEnd - entry.fetchStart
          
          if (loadTime > PERFORMANCE_BUDGETS.overview) {
            console.warn(
              `⚠️ Page load time (${loadTime}ms) exceeds budget (${PERFORMANCE_BUDGETS.overview}ms)`
            )
          }
        }
      }
    })
    
    observer.observe({ entryTypes: ['navigation'] })
  }
}

// Webpack bundle analyzer for development
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Next.js config
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['recharts', 'lucide-react'],
  },
  
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Warn about large chunks in development
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 10,
        })
      )
    }
    
    return config
  },
})
```

## 📊 Performance Testing

### Lighthouse CI Integration
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Start app
        run: npm start &
      
      - name: Wait for app
        run: sleep 30
      
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/overview',
        'http://localhost:3000/bookings',
        'http://localhost:3000/pricing',
        'http://localhost:3000/promoters',
        'http://localhost:3000/finance',
      ],
      startServerCommand: 'npm start',
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:pwa': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Other metrics
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],
        'interactive': ['error', { maxNumericValue: 3500 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
```

### Load Testing
```typescript
// scripts/load-test.ts
import { chromium } from 'playwright'

interface LoadTestConfig {
  url: string
  concurrency: number
  requests: number
  duration: number
}

async function runLoadTest(config: LoadTestConfig) {
  const browser = await chromium.launch()
  const contexts = []
  
  // Create multiple browser contexts to simulate concurrent users
  for (let i = 0; i < config.concurrency; i++) {
    const context = await browser.newContext()
    contexts.push(context)
  }
  
  const startTime = Date.now()
  const results = []
  
  // Run concurrent requests
  const promises = contexts.map(async (context, index) => {
    const page = await context.newPage()
    const requests = []
    
    for (let i = 0; i < Math.ceil(config.requests / config.concurrency); i++) {
      const requestStart = Date.now()
      
      try {
        await page.goto(config.url)
        await page.waitForLoadState('networkidle')
        
        const requestTime = Date.now() - requestStart
        requests.push({ success: true, time: requestTime })
      } catch (error) {
        requests.push({ success: false, error: error.message })
      }
    }
    
    await context.close()
    return requests
  })
  
  const allResults = await Promise.all(promises)
  const flatResults = allResults.flat()
  
  await browser.close()
  
  // Calculate statistics
  const successful = flatResults.filter(r => r.success)
  const failed = flatResults.filter(r => !r.success)
  const times = successful.map(r => r.time)
  
  console.log(`
Load Test Results:
- Total Requests: ${flatResults.length}
- Successful: ${successful.length}
- Failed: ${failed.length}
- Success Rate: ${(successful.length / flatResults.length * 100).toFixed(2)}%
- Average Response Time: ${(times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)}ms
- Min Response Time: ${Math.min(...times)}ms
- Max Response Time: ${Math.max(...times)}ms
- 95th Percentile: ${percentile(times, 95).toFixed(2)}ms
  `)
}

function percentile(arr: number[], p: number): number {
  const sorted = arr.sort((a, b) => a - b)
  const index = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[index]
}

// Run load test
runLoadTest({
  url: 'http://localhost:3000/overview',
  concurrency: 10,
  requests: 100,
  duration: 60000, // 1 minute
})
```

## ✅ Performance Checklist

### Code Optimization
- [ ] Route-level code splitting implemented
- [ ] Component lazy loading configured
- [ ] Heavy libraries dynamically imported
- [ ] Unused code eliminated (tree shaking)
- [ ] Bundle sizes within budget limits

### Data Loading
- [ ] RTK Query caching optimized
- [ ] Prefetching strategies implemented
- [ ] Optimistic updates for better UX
- [ ] Pagination and virtualization for large datasets
- [ ] Background sync for offline capabilities

### Rendering Performance
- [ ] React.memo and useMemo used appropriately
- [ ] Expensive calculations memoized
- [ ] Virtualization for large lists
- [ ] Layout shift minimized (CLS < 0.1)
- [ ] Smooth animations (60fps target)

### Asset Optimization
- [ ] Images optimized and properly sized
- [ ] Fonts optimized with display: swap
- [ ] Critical CSS inlined
- [ ] SVG icons optimized
- [ ] Service worker caching configured

### Monitoring & Testing
- [ ] Core Web Vitals monitoring setup
- [ ] Custom performance metrics tracked
- [ ] Lighthouse CI integrated
- [ ] Performance budgets enforced
- [ ] Load testing implemented

### Network Optimization
- [ ] CDN configured for static assets
- [ ] Compression enabled (gzip/brotli)
- [ ] HTTP/2 server push configured
- [ ] Resource hints implemented (preload, prefetch)
- [ ] Service worker caching strategies optimized

---

These performance guidelines ensure the PRIMA Partner Dashboard delivers exceptional user experiences across all devices and network conditions while maintaining development efficiency.
