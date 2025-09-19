# Routing & Information Architecture

Comprehensive guide to the application routing structure, information architecture, and navigation patterns for the PRIMA Partner Dashboard.

## 🗂️ Route Groups Structure

The application uses Next.js 15 App Router with route groups to organize functionality:

```
src/app/
├── (auth)/                     # Authentication routes
│   ├── layout.tsx             # Auth shell (minimal header)
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── (dashboard)/                # Existing dashboard routes  
│   ├── layout.tsx             # Dashboard shell with sidebar
│   ├── (dashboard-1)/         # Original dashboard demos
│   ├── dashboard-2/
│   ├── dashboard-3/
│   ├── users/
│   ├── tasks/
│   ├── developers/
│   └── settings/
├── (prima)/                    # PRIMA Partner Dashboard
│   ├── layout.tsx             # PRIMA shell with global controls
│   ├── overview/
│   ├── bookings/
│   ├── pricing/
│   ├── promoters/
│   ├── incentives/
│   ├── commissions/
│   ├── finance/
│   ├── team/
│   └── settings/
└── (errors)/                   # Error pages
    ├── 401/
    ├── 403/
    ├── 404/
    └── 503/
```

## 🎯 PRIMA Route Structure

### Primary Routes

| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/prima/overview` | KPI Dashboard | Revenue metrics, trends, drill-through |
| `/prima/bookings` | Booking Management | Status controls, filters, bulk actions |
| `/prima/pricing` | Pricing Configuration | Prime/Non-Prime setup, live calculations |
| `/prima/promoters` | Promoter Management | Leaderboard, performance, commission assignment |
| `/prima/incentives` | Incentive Programs | Create/edit incentives, progress tracking |
| `/prima/commissions` | Commission Management | Tier configuration, precedence preview |
| `/prima/finance` | Financial Overview | Payouts, holds, financial summaries |
| `/prima/team` | RBAC Preview | Role management, permission preview |
| `/prima/settings` | PRIMA Settings | Theme, preferences, configuration |

### URL State Management

All PRIMA routes support URL-driven state for shareability and deep linking:

```typescript
// Example URL with state
/prima/bookings?venueId=venue-123&from=2025-01-01&to=2025-01-31&status=confirmed&tab=overview

// Search params structure
interface PrimaSearchParams {
  venueId?: string          // Selected venue
  from?: string            // Start date (ISO format)
  to?: string              // End date (ISO format)
  status?: BookingStatus   // Filter by booking status
  tab?: string             // Active tab
  view?: string            // Saved view preset
  page?: number            // Pagination
  sort?: string            // Sort configuration
}
```

## 🧭 Navigation Architecture

### Sidebar Navigation

The PRIMA module integrates into the existing sidebar with a dedicated section:

```typescript
// src/components/layout/data/sidebar-data.tsx
export const sidebarNavMain = [
  // ... existing nav items
  {
    title: "PRIMA",
    items: [
      {
        title: "Overview",
        url: "/prima/overview",
        icon: BarChart3,
      },
      {
        title: "Bookings",
        url: "/prima/bookings", 
        icon: Calendar,
        badge: "12", // Active count
      },
      {
        title: "Pricing",
        url: "/prima/pricing",
        icon: DollarSign,
      },
      {
        title: "Promoters",
        url: "/prima/promoters",
        icon: Users,
      },
      {
        title: "Incentives",
        url: "/prima/incentives",
        icon: Target,
      },
      {
        title: "Commissions",
        url: "/prima/commissions",
        icon: Percent,
      },
      {
        title: "Finance",
        url: "/prima/finance",
        icon: CreditCard,
      },
      {
        title: "Team",
        url: "/prima/team",
        icon: Shield,
      },
      {
        title: "Settings",
        url: "/prima/settings",
        icon: Settings,
      },
    ],
  },
]
```

### Breadcrumb Navigation

```typescript
// Dynamic breadcrumbs for PRIMA routes
const breadcrumbMap = {
  '/prima': 'PRIMA',
  '/prima/overview': 'Overview',
  '/prima/bookings': 'Bookings',
  '/prima/pricing': 'Pricing',
  '/prima/promoters': 'Promoters', 
  '/prima/incentives': 'Incentives',
  '/prima/commissions': 'Commissions',
  '/prima/finance': 'Finance & Payouts',
  '/prima/team': 'Team',
  '/prima/settings': 'Settings',
}
```

## 🎛️ Layout Architecture

### PRIMA Layout Shell

The PRIMA layout provides global controls and context:

```tsx
// src/app/(prima)/layout.tsx
export default function PrimaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PrimaProvider>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PrimaHeader />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PrimaProvider>
  )
}
```

### Global Controls

The PRIMA header includes context-aware controls:

```tsx
// Global controls available across all PRIMA routes
interface PrimaHeaderControls {
  venueSelector: VenueSelectorProps
  dateRangePicker: DateRangePickerProps  
  searchGlobal: SearchInputProps
  exportCenter: ExportCenterProps
  themeToggle: ThemeToggleProps
  userMenu: UserMenuProps
}
```

## 🔗 Deep Linking Strategy

### Shareable URLs

Every PRIMA view should be shareable via URL:

```typescript
// Example: Bookings view with specific filters
const shareableUrl = buildPrimaUrl('/prima/bookings', {
  venueId: 'venue-123',
  from: '2025-01-01',
  to: '2025-01-31',
  status: 'confirmed',
  view: 'revenue-focus'
})

// Result: /prima/bookings?venueId=venue-123&from=2025-01-01&to=2025-01-31&status=confirmed&view=revenue-focus
```

### Saved Views

Common filter combinations can be saved as named views:

```typescript
interface SavedView {
  id: string
  name: string
  route: string
  params: Record<string, string>
  isDefault?: boolean
}

// Example saved views
const savedViews: SavedView[] = [
  {
    id: 'weekly-revenue',
    name: 'Weekly Revenue Focus',
    route: '/prima/overview',
    params: { 
      from: 'last-7-days',
      view: 'revenue-focus'
    }
  },
  {
    id: 'pending-bookings',
    name: 'Pending Bookings',
    route: '/prima/bookings', 
    params: {
      status: 'pending',
      sort: 'created-desc'
    }
  }
]
```

## 🔄 Navigation Patterns

### Drill-Through Navigation

Enable seamless navigation between related data:

```typescript
// Overview KPI tile click → Bookings with filters
const handleKpiDrillThrough = (metric: string, filters: object) => {
  const params = new URLSearchParams(filters)
  router.push(`/prima/bookings?${params.toString()}`)
}

// Promoter performance → Detailed promoter view  
const handlePromoterClick = (promoterId: string) => {
  router.push(`/prima/promoters?selected=${promoterId}&tab=performance`)
}
```

### Context Preservation

Maintain user context across navigation:

```typescript
// Preserve venue and date range when switching modules
const useContextualNavigation = () => {
  const searchParams = useSearchParams()
  const venueId = searchParams.get('venueId')
  const from = searchParams.get('from') 
  const to = searchParams.get('to')
  
  const navigateWithContext = (path: string, additionalParams = {}) => {
    const params = new URLSearchParams({
      ...(venueId && { venueId }),
      ...(from && { from }),
      ...(to && { to }),
      ...additionalParams
    })
    
    router.push(`${path}?${params.toString()}`)
  }
  
  return { navigateWithContext }
}
```

## 📱 Mobile Navigation

### Responsive Sidebar

```tsx
// Mobile-first navigation approach
const MobilePrimaNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <PrimaSidebarContent />
      </SheetContent>
    </Sheet>
  )
}
```

### Bottom Navigation (Mobile)

For mobile views, consider bottom navigation for primary actions:

```tsx
const MobileBottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <nav className="flex items-center justify-around py-2">
        {primaryNavItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>
    </div>
  )
}
```

## 🎯 Route Guards & Permissions

### Role-Based Route Access

```typescript
// Route access control by role
const routePermissions = {
  '/prima/overview': ['ADMIN', 'MANAGER', 'COORDINATOR'],
  '/prima/bookings': ['ADMIN', 'MANAGER', 'COORDINATOR'], 
  '/prima/pricing': ['ADMIN'],
  '/prima/promoters': ['ADMIN', 'MANAGER', 'COORDINATOR'],
  '/prima/incentives': ['ADMIN', 'COORDINATOR'],
  '/prima/commissions': ['ADMIN'],
  '/prima/finance': ['ADMIN', 'MANAGER'],
  '/prima/team': ['ADMIN'],
  '/prima/settings': ['ADMIN'],
} as const
```

### Route Guard Implementation

```tsx
// Middleware for route protection
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (pathname.startsWith('/prima')) {
    // Check authentication and role
    const userRole = getUserRole(request)
    
    if (!hasRouteAccess(pathname, userRole)) {
      return NextResponse.redirect(new URL('/403', request.url))
    }
  }
  
  return NextResponse.next()
}
```

---

This routing architecture provides a scalable, maintainable foundation for the PRIMA Partner Dashboard while preserving the existing application structure and enabling seamless user experiences.
