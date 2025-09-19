# PRIMA Partner Dashboard - AI Development Rules

This document establishes technical and general guidelines for AI assistance during the development of the PRIMA Partner Dashboard. These rules ensure consistency, quality, and alignment with project requirements.

## 📋 Table of Contents

- [Project Context](#-project-context)
- [Technology Stack Requirements](#-technology-stack-requirements)
- [Technical Preferences](#-technical-preferences)
- [Development Standards](#-development-standards)
- [Implementation Priorities](#-implementation-priorities)
- [General Guidelines](#-general-guidelines)
- [Design System Compliance](#-design-system-compliance)
- [Multi-Venue Architecture Rules](#-multi-venue-architecture-rules)
- [RFC-Based Development Process](#-rfc-based-development-process)
- [Quality Assurance Standards](#-quality-assurance-standards)

---

## 🎯 Project Context

### Vision
The PRIMA Partner Dashboard is an interactive Next.js 15 prototype demonstrating a unified B2B control plane for hotel and venue partners to optimize revenue, manage promoter distribution, and maintain financial transparency.

### Key Objectives
- **Interactive Prototype**: Demo-ready with 7 core modules and realistic data interactions
- **Technical Excellence**: Modern web development practices with Next.js 15, React 19, TypeScript
- **Multi-Venue Support**: Portfolio management with context preservation across venue switching
- **Design Quality**: Professional UI using preserved OKLCH design tokens and accessibility standards
- **Stakeholder Demo**: Support scripted user journeys for stakeholder presentations

### Success Criteria
- Complete 4 scripted user journeys in < 7 minutes
- Achieve 8/10+ stakeholder satisfaction on value clarity
- Demonstrate technical feasibility for production scaling
- Performance targets: TTI < 3s, route transitions < 500ms
- 100% WCAG 2.1 AA compliance

---

## 🛠️ Technology Stack Requirements

### LOCKED Core Technologies
**These technology choices are FINAL and must NOT be changed:**

#### Frontend Framework
- **Next.js 15** - App Router, RSC, TypeScript integration
- **React 19** - Latest features, enhanced performance
- **TypeScript 5.x** - Strict mode, comprehensive type coverage

#### State Management
- **RTK Query** - Server state, caching, optimistic updates
- **Redux Toolkit** - Client state management
- **React Context** - Theme, preferences, global UI state

#### UI & Styling
- **shadcn/ui** - Component library (New York style)
- **Tailwind CSS** - Utility-first styling with design tokens
- **Lucide React** - Icon system
- **OKLCH Color Space** - Advanced color management (CRITICAL: Must be preserved)

#### Development & Testing
- **MSW (Mock Service Worker)** - API mocking for realistic data flows
- **TanStack Table** - Advanced table functionality
- **React Hook Form + Zod** - Form management and validation
- **Jest + Testing Library** - Unit and integration testing
- **Playwright** - End-to-end testing for user journeys

### Version Requirements
- **Node.js**: 20.x or higher (Required: 20.10+ LTS)
- **Package Manager**: pnpm (primary), npm 10.x or yarn 4.x (alternative)
- **TypeScript**: 5.3+
- **ESLint**: 8.x
- **Prettier**: 3.x

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **PWA Support**: Service Worker support required

---

## ⚙️ Technical Preferences

### File & Component Naming Conventions
```typescript
// React components - PascalCase
KPICard.tsx
VenueSelector.tsx
BookingStatusBadge.tsx

// Utilities and hooks - kebab-case
date-utils.ts
use-booking-filters.ts
format-currency.ts

// Types and interfaces - kebab-case
booking-types.ts
api-responses.ts
venue-models.ts

// Test files - match source file name + .test
kpi-card.test.tsx
booking-utils.test.ts
venue-context.test.tsx
```

### Code Organization Principles
```
src/
├── app/                        # Next.js App Router
│   ├── (prima)/               # PRIMA route group (REQUIRED)
│   │   ├── layout.tsx         # PRIMA layout with venue selector
│   │   ├── overview/
│   │   ├── bookings/
│   │   └── [other modules]/
├── components/                 # Reusable components
│   ├── ui/                    # Base shadcn/ui components
│   ├── prima/                 # Business-specific components
│   └── layout/                # Layout components
├── lib/                       # Utilities and configuration
│   ├── store/                 # Redux store and RTK Query
│   ├── utils/                 # Utility functions
│   └── constants.ts
├── types/                     # TypeScript definitions
└── hooks/                     # Custom React hooks
```

### Architectural Patterns
1. **Layered State Management**:
   - Server State: RTK Query
   - Client State: Redux Toolkit
   - UI State: React Context
   - URL State: Search parameters

2. **Component Patterns**:
   - Functional components with hooks
   - Memo for expensive components
   - Compound components for complex UI
   - Controlled components with React Hook Form

3. **Data Flow Patterns**:
   - Optimistic updates with RTK Query
   - Smart cache invalidation
   - Cross-module data synchronization

### Data Handling Standards
```typescript
// ✅ REQUIRED: Proper TypeScript interfaces
interface BookingFilters {
  status?: BookingStatus[]
  dateRange: { from: Date; to: Date }
  venueId?: string
  promoterId?: string
}

// ✅ REQUIRED: Zod validation for all API data
const BookingSchema = z.object({
  id: z.string().uuid(),
  venueId: z.string().uuid(),
  guestName: z.string().min(1),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'NO_SHOW']),
  // ... complete schema
})

// ✅ REQUIRED: RTK Query with proper cache tags
export const bookingsApi = primaApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<BookingsResponse, BookingFilters>({
      query: (filters) => ({ url: '/bookings', params: filters }),
      providesTags: ['Booking'],
    }),
  }),
})
```

### API Interaction Standards
- **RESTful Design**: Consistent URL patterns and HTTP methods
- **Error Handling**: Standardized error responses with codes
- **Pagination**: Consistent pagination across all list endpoints
- **Filtering**: Common filter patterns across all data types
- **Caching**: RTK Query cache with selective invalidation

### Performance Requirements
- **Bundle Size**: Initial JavaScript bundle ≤ 500KB compressed
- **Load Time**: Initial page load ≤ 3 seconds on mid-tier laptop
- **Interaction Response**: UI interactions ≤ 200ms (table operations ≤ 100ms)
- **Memory Usage**: Stable operation with ≤ 100MB heap size

### Security Practices
- **Input Validation**: Zod schema validation for all user inputs
- **PII Masking**: Role-based data visibility (names, emails, phone)
- **Access Control**: Route-level protection based on user role
- **Environment Variables**: Secure configuration management

---

## 📏 Development Standards

### TypeScript Standards
```typescript
// ✅ REQUIRED: Strict mode compliance
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}

// ✅ REQUIRED: Explicit interfaces over any
interface KPICardProps {
  title: string
  value: number
  change?: { value: number; type: 'increase' | 'decrease' }
  onDrillThrough?: () => void
}

// ❌ FORBIDDEN: Any types or @ts-ignore
const data: any = { status: 'confirmed' }  // Never use
// @ts-ignore                              // Never use
```

### React Component Standards
```typescript
// ✅ REQUIRED: Complete component structure
export const KPICard = memo(forwardRef<HTMLDivElement, KPICardProps>(
  ({ title, value, change, onDrillThrough, className }, ref) => {
    // Memoized values for expensive calculations
    const formattedValue = useMemo(() => {
      return new Intl.NumberFormat('en-US').format(value)
    }, [value])

    // Memoized event handlers
    const handleClick = useCallback(() => {
      onDrillThrough?.()
    }, [onDrillThrough])

    // Accessibility and keyboard support REQUIRED
    return (
      <div
        ref={ref}
        className={cn("bg-card border rounded-lg p-4", className)}
        onClick={handleClick}
        role={onDrillThrough ? 'button' : undefined}
        tabIndex={onDrillThrough ? 0 : undefined}
        onKeyDown={(e) => {
          if (onDrillThrough && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            handleClick()
          }
        }}
      >
        {/* Component content */}
      </div>
    )
  }
))

KPICard.displayName = 'KPICard'
```

### Testing Requirements
- **Unit Test Coverage**: > 85% for critical components and utilities
- **Integration Tests**: RTK Query endpoints with MSW
- **E2E Tests**: All 4 demo user journeys
- **Accessibility Tests**: Automated axe-core integration

### Documentation Standards
- **Code Comments**: Self-documenting code with JSDoc for complex functions
- **Component Props**: Clear interface documentation
- **API Documentation**: Complete OpenAPI/JSDoc specifications
- **README Updates**: Keep implementation guide current

### Error Handling Standards
```typescript
// ✅ REQUIRED: Comprehensive error handling
try {
  const result = await updateBooking({ id, status }).unwrap()
  toast.success('Booking updated successfully')
} catch (error) {
  if (error instanceof RTKQueryError) {
    toast.error(error.data?.message || 'Failed to update booking')
  } else {
    toast.error('An unexpected error occurred')
  }
  console.error('Booking update failed:', error)
}

// ✅ REQUIRED: Error boundaries for graceful degradation
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  // Implementation with fallback UI
}
```

### Accessibility Standards (WCAG 2.1 AA)
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order

---

## 🎯 Implementation Priorities

### Critical Path Implementation Order
**MUST follow RFC sequence - no parallel implementation allowed:**

#### Phase 1: Foundation (Week 1)
1. **RFC-001**: Authentication & Base Infrastructure
2. **RFC-002**: Data Layer & State Management  
3. **RFC-003**: Layout Shell & Multi-Venue Navigation

#### Phase 2: Core Modules (Week 1-2)
4. **RFC-004**: Overview Dashboard
5. **RFC-005**: Booking Management
6. **RFC-006**: Pricing Configuration

#### Phase 3: Financial & Operations (Week 2-3)
7. **RFC-007**: Promoters Management
8. **RFC-008**: Finance & Payouts
9. **RFC-009**: Incentives Programs

#### Phase 4: Advanced Features (Week 3)
10. **RFC-010**: Commission Management
11. **RFC-011**: Team & RBAC Preview
12. **RFC-012**: PWA & Performance Optimization

### Feature Prioritization
- **Core Features**: Overview, Bookings, Pricing (Must Have)
- **Operations**: Promoters, Finance (Should Have)
- **Advanced**: Incentives, Commissions, RBAC (Could Have)

### Quality Thresholds
Before progressing to next RFC:
- [ ] All acceptance criteria met
- [ ] Performance targets maintained
- [ ] Test coverage > 85%
- [ ] Accessibility compliance verified
- [ ] Integration with previous RFCs validated

---

## 📜 General Guidelines

### Requirements Adherence
1. **RFC Specifications**: Follow RFC documents exactly - they are the single source of truth
2. **Design System**: Preserve existing OKLCH color tokens - never modify them
3. **Multi-Venue Support**: All modules must support venue context switching
4. **Performance Budgets**: Maintain performance targets throughout development

### Code Quality Standards
```typescript
// ✅ REQUIRED: Self-documenting code
const calculateCommissionAmount = (booking: Booking, rate: CommissionRate): number => {
  const baseAmount = booking.type === 'PRIME' 
    ? booking.primeTotal 
    : booking.nonPrimeTotal
  
  return rate.type === 'PERCENTAGE' 
    ? baseAmount * (rate.value / 100)
    : rate.value
}

// ✅ REQUIRED: Proper error handling
const useOptimisticBookingUpdate = () => {
  const [updateBooking] = useUpdateBookingMutation()
  
  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    try {
      await updateBooking({ id, status }).unwrap()
    } catch (error) {
      // Error handling is automatic via RTK Query optimistic updates
      console.error('Booking update failed:', error)
    }
  }, [updateBooking])
  
  return { updateBookingStatus }
}
```

### Completeness Standards
- **No TODOs**: All code must be complete and functional
- **No Placeholders**: All UI components must have real functionality
- **No Mock Buttons**: All interactive elements must perform real actions
- **Complete Workflows**: All user journeys must be end-to-end functional

### Communication Guidelines
- **Ask Specific Questions**: When unclear about requirements, ask specific questions rather than making assumptions
- **Reference Documentation**: Always reference specific sections of RFCs and documentation
- **Clarify Scope**: Confirm understanding of feature boundaries before implementation
- **Progress Updates**: Provide clear progress updates and completion confirmations

### Handling Uncertainty
1. **Check RFC Documentation**: First reference the specific RFC and related docs
2. **Follow Established Patterns**: Use patterns from previous RFC implementations
3. **Ask Specific Questions**: If still unclear, ask specific questions about the uncertainty
4. **Document Decisions**: Record any implementation decisions made

---

## 🎨 Design System Compliance

### CRITICAL: OKLCH Color Preservation
```css
/* ❌ NEVER MODIFY - These OKLCH values are locked */
:root {
  --primary: oklch(0.5137 0.2376 283.0929);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9174 0.0435 292.6901);
  --background: oklch(0.9730 0.0133 286.1503);
  --foreground: oklch(0.2864 0.0785 280.2318);
  /* ... all existing OKLCH values must be preserved */
}
```

### Component Usage Standards
```typescript
// ✅ REQUIRED: Use design tokens via Tailwind classes
<div className="bg-card text-card-foreground border rounded-lg p-4">
  <h3 className="text-heading-sm font-semibold">Revenue</h3>
  <p className="text-body-lg font-bold text-primary">$24,847</p>
</div>

// ❌ FORBIDDEN: Hard-coded colors or spacing
<div style={{ backgroundColor: '#8B5CF6', padding: '16px' }}>
<div className="bg-purple-500 p-4">
```

### Typography Standards
```typescript
// ✅ REQUIRED: Semantic typography classes
<h1 className="text-heading-xl font-semibold">Overview Dashboard</h1>
<p className="text-body text-muted-foreground">Last updated 5 minutes ago</p>
<span className="text-label font-medium">Total Revenue</span>

// ❌ FORBIDDEN: Hard-coded font sizes
<h1 className="text-4xl font-bold">Title</h1>
```

### Responsive Design Requirements
```typescript
// ✅ REQUIRED: Mobile-first responsive patterns
const gridPatterns = {
  kpiGrid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4',
  contentGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  sidebarLayout: 'flex flex-col lg:flex-row gap-6',
}
```

### Accessibility Requirements
- **ARIA Labels**: All interactive elements must have proper ARIA labels
- **Keyboard Navigation**: Full keyboard accessibility required
- **Focus Indicators**: Visible focus indicators on all interactive elements
- **Color Contrast**: Must meet WCAG 2.1 AA standards

---

## 🏢 Multi-Venue Architecture Rules

### Venue Context Management
```typescript
// ✅ REQUIRED: Venue context in all data fetching
const { data: bookings } = useGetBookingsQuery({
  venueId: selectedVenue?.id,
  ...otherFilters
})

// ✅ REQUIRED: Portfolio view support
const { data: portfolioMetrics } = useGetPortfolioMetricsQuery({
  venueIds: selectedVenues.length > 0 ? selectedVenues : 'all',
  dateRange
})
```

### Global Venue Selector
- **Prominent Placement**: Venue selector must be prominently placed in header
- **Context Preservation**: Selected venue context must persist across navigation
- **URL State**: Venue selection must be reflected in URL for shareable links
- **Portfolio View**: Support for "All Venues" and multi-venue selection

### Cross-Venue Data Patterns
```typescript
// ✅ REQUIRED: Support both single venue and portfolio views
interface MetricsFilters {
  venueId?: string          // Single venue
  venueIds?: string[]       // Multiple venues
  includePortfolio?: boolean // Portfolio aggregation
  dateRange: { from: Date; to: Date }
}
```

### Venue-Specific vs Portfolio Settings
- **Venue-Specific**: Pricing, promoter assignments, local settings
- **Portfolio-Wide**: User preferences, theme, notification settings
- **Clear Distinction**: UI must clearly indicate scope of settings

---

## 📋 RFC-Based Development Process

### Sequential Implementation Rule
**CRITICAL**: Complete RFC N before starting RFC N+1. No parallel RFC work allowed.

### RFC Compliance Checklist
Before considering an RFC complete:
- [ ] All requirements from RFC specification implemented
- [ ] All acceptance criteria met
- [ ] Integration with previous RFCs verified
- [ ] Performance targets maintained
- [ ] Test coverage requirements met
- [ ] Accessibility compliance verified
- [ ] Demo scenarios functional

### Branch Strategy
```bash
# RFC implementation branches
rfc/001-authentication      # Individual RFC branches
rfc/002-data-layer
rfc/005-booking-management

# Integration and deployment
develop                     # Integration of completed RFCs
staging                     # Stable demo environment
main                        # Production-ready code
```

### Commit Message Format
```bash
# RFC commits (during RFC implementation)
rfc-001: feat(auth): implement login page with role switching
rfc-004: feat(overview): add KPI cards with drill-through
rfc-005: test(bookings): add comprehensive booking table tests

# Standard commits (for non-RFC work)
feat(overview): add KPI drill-through navigation
fix(bookings): resolve status update race condition
```

### RFC Progression Gates
Each RFC must pass these gates:
1. **Implementation Complete**: All features implemented
2. **Tests Passing**: Unit, integration, and E2E tests
3. **Performance Validated**: No regression in metrics
4. **Accessibility Verified**: WCAG 2.1 AA compliance
5. **Demo Ready**: User scenarios functional
6. **Integration Tested**: Works with all previous RFCs

---

## ✅ Quality Assurance Standards

### Code Quality Gates
```bash
# REQUIRED: All must pass before PR approval
pnpm type-check     # TypeScript strict mode
pnpm lint           # ESLint with no violations
pnpm test           # Unit tests > 85% coverage
pnpm test:e2e       # E2E tests for user journeys
pnpm build          # Production build successful
```

### Performance Monitoring
- **Bundle Analysis**: Regular bundle size monitoring
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Memory Profiling**: No memory leaks in React components
- **API Response Times**: All API calls < 500ms (mocked)

### Accessibility Validation
```typescript
// ✅ REQUIRED: Automated accessibility testing
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

test('should have no accessibility violations', async () => {
  const { container } = render(<BookingTable />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Browser Testing
- **Desktop**: Chrome, Firefox, Safari, Edge latest versions
- **Mobile**: iOS Safari, Chrome Mobile responsive testing
- **Feature Parity**: 100% feature parity across supported browsers

### Demo Readiness Checklist
- [ ] All 4 user journeys completable in < 7 minutes
- [ ] No console errors or warnings
- [ ] Smooth performance on mobile and desktop
- [ ] Realistic demo data loaded and consistent
- [ ] Error states handled gracefully
- [ ] Loading states provide clear feedback

---

## 🚫 Explicit Prohibitions

### Technology Prohibitions
- **❌ NO** modification of OKLCH color values
- **❌ NO** technology stack changes without approval
- **❌ NO** bypassing TypeScript strict mode
- **❌ NO** using `any` types or `@ts-ignore`
- **❌ NO** hard-coded colors, fonts, or spacing values

### Development Prohibitions
- **❌ NO** parallel RFC implementation
- **❌ NO** skipping RFC sequence
- **❌ NO** incomplete implementations (TODOs, placeholders)
- **❌ NO** breaking changes to existing functionality
- **❌ NO** accessibility violations

### Code Quality Prohibitions
- **❌ NO** console.log statements in production code
- **❌ NO** unreachable code or dead code
- **❌ NO** component state mutations
- **❌ NO** direct DOM manipulation (use React patterns)
- **❌ NO** blocking the main thread with expensive operations

---

## 🎯 Success Metrics

### Technical Metrics
- **Performance**: 100% of interactions under target response times
- **Accessibility**: 0 critical accessibility violations
- **Test Coverage**: 85%+ unit test coverage, 100% user journey coverage
- **Error Rate**: < 1% error rate during demo sessions
- **Bundle Size**: < 500KB initial bundle, < 200KB route chunks

### Demo Metrics
- **Task Completion**: All 4 scenarios completable in < 7 minutes
- **Error Handling**: Graceful degradation for all error states
- **Responsiveness**: Smooth operation on mobile and desktop
- **Data Consistency**: Realistic, coherent demo data across modules

### Quality Metrics
- **Code Quality**: 0 ESLint violations, 100% TypeScript strict compliance
- **Documentation**: Complete RFC implementation documentation
- **Integration**: 100% backward compatibility with previous RFCs
- **Stakeholder Value**: Clear demonstration of business value proposition

---

## 📚 Reference Documentation

### Implementation Guides
- [Implementation Guide](./docs/IMPLEMENTATION_GUIDE.md) - Step-by-step implementation approach
- [RFC Framework](./docs/RFCs/RFCS.md) - Sequential build plan with dependencies
- [Module Specifications](./docs/modules/README.md) - Detailed module requirements

### Technical References
- [Technical Stack](./docs/architecture/technical-stack.md) - Complete technology specifications
- [State Management](./docs/architecture/state-management.md) - RTK Query and Redux patterns
- [API Contracts](./docs/data/api-contracts.md) - Complete API documentation

### Development Standards
- [Coding Standards](./docs/development/coding-standards.md) - Comprehensive coding guidelines
- [Development Workflow](./docs/development/workflow.md) - Git workflow and branch strategy
- [Design System](./docs/design/README.md) - Design tokens and component guidelines

---

**These rules are binding and must be followed precisely. They ensure the PRIMA Partner Dashboard meets all technical requirements, stakeholder expectations, and quality standards while preserving the integrity of the existing design system and architecture.**

*Last Updated: September 18, 2025*
*Version: 1.0*
