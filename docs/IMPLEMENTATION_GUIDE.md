# PRIMA Dashboard Implementation Guide

This guide provides a structured approach to implementing the PRIMA Partner Dashboard based on the comprehensive PRD and documentation framework.

## 🎯 Implementation Overview

The PRIMA Partner Dashboard is a Next.js 15 prototype demonstrating a B2B dashboard for hotel and venue partners to manage revenue, promoters, and financial operations.

### Key Objectives

- **Interactive Prototype**: Demonstrate 7 core modules with realistic data and interactions
- **Technical Excellence**: Showcase modern web development practices with Next.js 15, React 19, TypeScript
- **Design Quality**: Implement professional UI with design tokens and accessibility standards
- **Demo-Ready**: Support scripted user journeys for stakeholder demonstrations

## 📋 Implementation Phases

### Phase 1: Foundation (Week 1)

**Priority**: Critical Path - Core Infrastructure

#### 1.1 Project Setup & Configuration

```bash
# Verify current setup
pnpm install
pnpm dev

# Implement missing dependencies if needed
pnpm add @reduxjs/toolkit react-redux @tanstack/react-table
pnpm add -D msw @types/react @types/node
```

#### 1.2 Design System Verification

- [ ] **Verify Design Tokens**: Confirm existing design tokens in `globals.css` are properly documented
- [ ] **Component Foundation**: Ensure new PRIMA components integrate with existing shadcn/ui foundation  
- [ ] **Theme Provider**: Verify existing dark/light theme toggle functionality works correctly

**Important**: The current design system using OKLCH color space should NOT be modified. All new components must use the existing design tokens.

**Reference**: [Design Tokens](./design/tokens.md)

#### 1.3 State Management Setup

- [ ] **RTK Query Store**: Configure base API and store setup
- [ ] **MSW Integration**: Set up mock service worker with basic handlers
- [ ] **Provider Configuration**: Wire up Redux Provider in app layout

**Reference**: [State Management](./architecture/state-management.md)

#### 1.4 Routing Structure

- [ ] **PRIMA Route Group**: Create `src/app/(prima)/` structure
- [ ] **Layout Shell**: Implement PRIMA-specific layout with global controls
- [ ] **Navigation Integration**: Add PRIMA section to sidebar navigation

**Reference**: [Routing & IA](./architecture/routing-ia.md)

### Phase 2: Core Modules (Week 1-2)

**Priority**: Overview → Bookings → Pricing

#### 2.1 Overview Dashboard

**Timeline**: 2-3 days

- [ ] **KPI Cards Component**: Implement with drill-through navigation
- [ ] **Metrics API**: Create MSW handlers for overview metrics
- [ ] **Weekly Trends Chart**: Integrate chart library with responsive design
- [ ] **Recent Bookings Table**: Basic table with status indicators

**Reference**: [Overview Module](./modules/overview.md)

**Implementation Steps**:

```typescript
// 1. Create KPI card component
export function KPICard({ title, value, change, onDrillThrough }: KPICardProps) {
  // Implementation with drill-through navigation
}

// 2. Set up metrics API
export const metricsApi = primaApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewMetrics: builder.query<OverviewMetrics, MetricsFilters>({
      // MSW handler implementation
    }),
  }),
})

// 3. Create overview page
export default function OverviewPage() {
  // Page layout with KPIs, charts, and tables
}
```

#### 2.2 Bookings Management

**Timeline**: 3-4 days

- [ ] **Advanced Data Table**: Implement TanStack Table with filtering and sorting
- [ ] **Status Management**: Optimistic updates for booking status changes
- [ ] **Bulk Operations**: Multi-select and batch status updates
- [ ] **Export Functionality**: CSV export with role-based data masking

**Reference**: [Bookings Module](./modules/bookings.md)

**Implementation Steps**:

```typescript
// 1. Create bookings table with TanStack Table
const BookingsTable = ({ data, columns, onStatusUpdate }) => {
  // Virtual scrolling, filtering, sorting implementation
}

// 2. Implement optimistic updates
const useOptimisticBookingUpdate = () => {
  // RTK Query optimistic update pattern
}

// 3. Add bulk operations
const useBulkBookingOperations = () => {
  // Multi-select and batch update logic
}
```

#### 2.3 Pricing Configuration

**Timeline**: 2-3 days

- [ ] **Pricing Forms**: Prime/Non-Prime configuration forms with validation
- [ ] **Live Calculations**: Real-time pricing examples with form changes
- [ ] **Impact Preview**: Projected revenue and commission impact display
- [ ] **Save & Persistence**: Update API with optimistic UI updates

**Reference**: [Pricing Module](./modules/pricing.md)

### Phase 3: Financial & Promoter Modules (Week 2)

**Priority**: Finance → Promoters → Incentives

#### 3.1 Finance & Payouts

- [ ] **Financial Summary Cards**: Revenue, commissions, payout overview
- [ ] **Payout Management**: Next payout details with hold functionality
- [ ] **Transaction History**: Searchable transaction list with filters
- [ ] **Hold Management**: Create and manage payout holds with reasons

#### 3.2 Promoters Management

- [ ] **Leaderboard Table**: Performance-sorted promoter list with metrics
- [ ] **Promoter Detail**: Drill-down view with performance history
- [ ] **Commission Assignment**: Update promoter commission tiers
- [ ] **Performance Charts**: Trend visualization for individual promoters

#### 3.3 Incentives Programs

- [ ] **Incentive Creation**: Form to create new incentive programs
- [ ] **Progress Tracking**: Real-time progress bars and leaderboards
- [ ] **Achievement System**: Automatic achievement detection and rewards
- [ ] **Program Management**: Edit, pause, and complete incentive programs

### Phase 4: Advanced Features (Week 3)

**Priority**: Commissions → Team/RBAC → Polish

#### 4.1 Commission Management

- [ ] **Commission Tier Configuration**: Set up tier-based commission rates
- [ ] **Assignment Management**: Assign promoters to commission tiers
- [ ] **Precedence Preview**: Show effective commission rates per promoter
- [ ] **Impact Calculation**: Preview financial impact of commission changes

#### 4.2 Team & RBAC Preview

- [ ] **Role Switching**: Demo different user roles and permissions
- [ ] **Data Masking**: Implement PII masking based on user role
- [ ] **Permission Preview**: Show what each role can access
- [ ] **Audit Logging**: Track user actions for compliance demo

#### 4.3 PWA & Performance

- [ ] **Service Worker**: Implement offline functionality for app shell
- [ ] **Manifest**: PWA manifest with icons and app metadata
- [ ] **Performance Optimization**: Virtual scrolling, code splitting, caching
- [ ] **Accessibility**: WCAG 2.1 AA compliance verification

## 🔧 Development Workflow

### Daily Development Process

1. **Start with Tests**: Write component tests before implementation
2. **Component Development**: Build components using design system tokens
3. **Integration**: Connect components to RTK Query APIs
4. **Responsive Design**: Ensure mobile-first responsive implementation
5. **Accessibility**: Verify keyboard navigation and screen reader support

### Code Quality Checklist

- [ ] TypeScript strict mode compliance
- [ ] ESLint and Prettier formatting
- [ ] Unit test coverage > 80%
- [ ] Component accessibility testing
- [ ] Performance budget compliance
- [ ] Mobile responsiveness verification

### API Development Pattern

```typescript
// 1. Define TypeScript interfaces
interface BookingFilters {
  status?: BookingStatus[]
  dateRange: { from: Date; to: Date }
}

// 2. Create RTK Query endpoint
export const bookingsApi = primaApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<BookingsResponse, BookingFilters>({
      query: (filters) => ({
        url: '/bookings',
        params: filters,
      }),
      providesTags: ['Booking'],
    }),
  }),
})

// 3. Implement MSW handler
export const bookingsHandlers = [
  http.get('/api/bookings', ({ request }) => {
    // Mock implementation with realistic data
    return HttpResponse.json(mockBookingsResponse)
  }),
]

// 4. Use in component
export function BookingsPage() {
  const { data, isLoading, error } = useGetBookingsQuery(filters)
  // Component implementation
}
```

## 📊 Demo Preparation

### Demo Scenarios Implementation

Ensure these user journeys work flawlessly:

#### 1. Revenue Control

- Navigate to Overview → View revenue metrics
- Go to Pricing → Adjust Prime pricing
- See live calculation updates → Save changes
- Return to Overview → Verify updated projections

#### 2. Demand Activation

- Go to Promoters → Review leaderboard
- Navigate to Incentives → Create "Monthly 20 Booking Bonus"
- Set target and reward → Save program
- Verify progress tracking and payout integration

#### 3. Loss Management

- Start at Overview → Notice booking discrepancies
- Go to Bookings → Filter for recent bookings
- Mark booking as "No Show" → See optimistic update
- Verify KPI recalculation in Overview

#### 4. Commission Strategy

- Go to Promoters → Select high performer
- Navigate to Commissions → Set to VIP tier
- Preview margin impact → Apply changes
- Verify updated leaderboard and detail view

### Data Scenarios

- **High-Volume Venue**: 200+ bookings, 25 promoters, multiple incentives
- **Seasonal Trends**: Realistic booking patterns by day/time
- **Performance Distribution**: 80/20 promoter performance pattern
- **Financial Accuracy**: Accurate commission and payout calculations

## 🚀 Deployment Strategy

### Environment Setup

```bash
# Development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MSW_ENABLED=true

# Production  
NEXT_PUBLIC_APP_URL=https://prima-dashboard.vercel.app
NEXT_PUBLIC_MSW_ENABLED=false
```

### Build Process

1. **Type Check**: `pnpm type-check`
2. **Lint**: `pnpm lint`
3. **Test**: `pnpm test`
4. **Build**: `pnpm build`
5. **Performance Check**: Bundle analysis and Core Web Vitals

### Success Criteria

- [ ] All demo scenarios work smoothly
- [ ] Performance metrics meet targets (< 2s initial load)
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility tested
- [ ] Mobile responsiveness confirmed
- [ ] Error handling graceful and informative

## 📚 Resources & References

### Technical Documentation

- [Technical Stack](./architecture/technical-stack.md)
- [API Contracts](./data/api-contracts.md)
- [Component Guidelines](./development/components.md)

### Design Resources

- [Design Tokens](./design/tokens.md)
- [Component Library](./design/components.md)
- [Accessibility Guidelines](./design/accessibility.md)

### Module Specifications

- [All Module Specs](./modules/README.md)
- [Data Models](./data/models.md)
- [Testing Strategy](./development/testing.md)

## 🎯 Success Metrics

### Technical Metrics

- **Performance**: TTI < 3s, route transitions < 500ms
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Code Quality**: 90%+ test coverage, 0 critical lint errors
- **Bundle Size**: < 500KB initial bundle

### Demo Metrics

- **Task Completion**: All 4 scenarios completable in < 7 minutes
- **Error Rate**: 0 critical errors during demo
- **Responsiveness**: Smooth operation on mobile and desktop
- **Stakeholder Satisfaction**: 8/10+ on clarity and value demonstration

---

This implementation guide provides a structured path to building the PRIMA Partner Dashboard prototype, ensuring all requirements are met while maintaining high code quality and user experience standards.
