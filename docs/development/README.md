# Development Guidelines

Comprehensive development workflow, coding standards, and best practices for the PRIMA Partner Dashboard.

## 📁 Development Documentation

- [Workflow Guide](./workflow.md) - Development process, Git conventions, and project setup ✅
- [Coding Standards](./coding-standards.md) - Code style, naming conventions, and best practices ✅
- [Component Guidelines](./components.md) - Component architecture and development patterns (Future)
- [Testing Strategy](./testing.md) - Testing approaches, tools, and coverage requirements (Future)
- [Performance Guidelines](./performance.md) - Optimization strategies and monitoring (Future)
- [Deployment Process](./deployment.md) - Build, release, and deployment procedures (Future)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20.x or higher
- **Package Manager**: pnpm (recommended) or npm
- **IDE**: VS Code with recommended extensions
- **Git**: Latest version

### Initial Setup

```bash
# Clone repository
git clone <repository-url>
cd prima-dashboard-1.0

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local

# Start development server
pnpm dev
```

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode", 
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-playwright.playwright"
  ]
}
```

## 🏗️ Project Structure

### Source Organization

```
src/
├── app/                        # Next.js App Router
│   ├── (prima)/               # PRIMA route group
│   │   ├── layout.tsx         # PRIMA shell layout
│   │   ├── overview/          # Module pages
│   │   └── ...
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/                # Shared components
│   ├── ui/                    # shadcn/ui components
│   ├── prima/                 # PRIMA-specific components
│   └── layout/                # Layout components
├── lib/                       # Utilities and configuration
│   ├── store/                 # RTK Query store
│   ├── api/                   # API slice definitions
│   ├── mocks/                 # MSW handlers
│   └── utils.ts               # Utility functions
├── types/                     # TypeScript definitions
└── hooks/                     # Custom React hooks
```

### Component Organization

```
components/
├── ui/                        # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── prima/                     # PRIMA domain components
│   ├── kpi-card/
│   │   ├── index.tsx          # Main component
│   │   ├── kpi-card.test.tsx  # Tests
│   │   └── kpi-card.stories.tsx # Storybook (optional)
│   ├── bookings-table/
│   └── ...
└── layout/                    # Layout and navigation
    ├── app-sidebar.tsx
    ├── header.tsx
    └── ...
```

## 🔧 Development Workflow

### RFC-Based Implementation

The PRIMA Partner Dashboard follows a **sequential RFC implementation approach**:

```
RFCs/
├── RFCS.md                    # Master implementation plan
├── RFC-001-*.md              # Authentication & Infrastructure
├── RFC-002-*.md              # Data Layer & State Management
├── RFC-003-*.md              # Layout Shell & Navigation
├── ...                       # Sequential feature RFCs
└── implementation-prompt-*.md # Implementation guides
```

**Key Principles**:
- **Sequential Only**: Complete RFC N before starting RFC N+1
- **No Parallel Work**: Each RFC builds on all previous implementations
- **Quality Gates**: Comprehensive testing before RFC progression
- **Integration Focus**: Each RFC validates against all previous work

### Branch Strategy

```
main                           # Production branch
├── develop                    # Development integration
├── rfc/001-authentication     # RFC-based feature branches
├── rfc/002-data-layer        
├── rfc/003-layout-shell
├── hotfix/critical-bug       # Hotfix branches
└── release/v1.0.0            # Release branches
```

**RFC Branch Naming**: `rfc/###-brief-description` (e.g., `rfc/004-overview-dashboard`)

### Commit Convention

```bash
# Format: type(scope): description
# RFC Format: rfc-###: type(scope): description

# RFC Implementation Examples:
rfc-001: feat(auth): implement login page with role switching
rfc-002: feat(store): configure RTK Query with MSW integration
rfc-003: feat(layout): add venue selector with context preservation

# General Examples:
feat(overview): add KPI drill-through navigation
fix(bookings): resolve status update race condition
docs(api): update booking endpoints documentation
test(promoters): add leaderboard component tests
refactor(state): optimize RTK Query cache configuration
style(ui): update button variant styles
perf(table): implement virtual scrolling for large datasets
```

### Pull Request Process

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/feature-name
   ```

2. **Implement Feature**
   - Follow coding standards
   - Write comprehensive tests
   - Update documentation
   - Ensure accessibility compliance

3. **Pre-PR Checklist**

   ```bash
   # Run tests
   pnpm test
   
   # Check linting
   pnpm lint
   
   # Verify types
   pnpm type-check
   
   # Build successfully
   pnpm build
   ```

4. **Create Pull Request**
   - Use descriptive title and description
   - Include screenshots for UI changes
   - Link related issues
   - Request appropriate reviewers

## 📝 Coding Standards

### TypeScript Guidelines

- **Strict Mode**: Always use TypeScript strict mode
- **Type Definitions**: Prefer interfaces over types for object shapes
- **Generics**: Use meaningful generic parameter names
- **Null Safety**: Handle nullable values explicitly

```typescript
// ✅ Good
interface BookingFilters {
  status?: BookingStatus[]
  dateRange: { from: Date; to: Date }
}

const useBookingFilters = <T extends BookingFilters>(
  initialFilters: T
): BookingFiltersResult<T> => {
  // Implementation
}

// ❌ Avoid
const filters: any = { status: 'confirmed' }
```

### React Component Guidelines

- **Functional Components**: Use function declarations
- **Props Interface**: Always define props interface
- **Component Organization**: Props → hooks → render logic
- **Error Boundaries**: Wrap complex components

```typescript
// ✅ Good
interface KPICardProps {
  title: string
  value: number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  onDrillThrough?: () => void
}

export function KPICard({ title, value, change, onDrillThrough }: KPICardProps) {
  const formattedValue = useMemo(() => formatNumber(value), [value])
  
  return (
    <Card onClick={onDrillThrough} className="cursor-pointer">
      {/* Component JSX */}
    </Card>
  )
}
```

### Styling Guidelines

- **Tailwind First**: Use Tailwind utilities for styling
- **Design Tokens**: Use CSS variables for colors
- **Component Variants**: Use cva for component variations
- **Responsive Design**: Mobile-first approach

```typescript
// ✅ Good
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## 🧪 Testing Requirements

### Testing Strategy

- **Unit Tests**: All utilities and pure functions
- **Component Tests**: User interaction testing with Testing Library
- **Integration Tests**: API integration with MSW
- **E2E Tests**: Critical user journeys with Playwright

### Coverage Requirements

```typescript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

### Test Examples

```typescript
// Component test
describe('KPICard', () => {
  test('displays title and value correctly', () => {
    render(<KPICard title="Total Bookings" value={142} />)
    
    expect(screen.getByText('Total Bookings')).toBeInTheDocument()
    expect(screen.getByText('142')).toBeInTheDocument()
  })
  
  test('handles drill-through click', async () => {
    const onDrillThrough = jest.fn()
    render(<KPICard title="Test" value={100} onDrillThrough={onDrillThrough} />)
    
    await user.click(screen.getByRole('button'))
    expect(onDrillThrough).toHaveBeenCalled()
  })
})

// API integration test
describe('Bookings API', () => {
  test('fetches bookings with filters', async () => {
    const bookings = [createMockBooking({ status: 'CONFIRMED' })]
    server.use(
      http.get('/api/bookings', ({ request }) => {
        const url = new URL(request.url)
        expect(url.searchParams.get('status')).toBe('CONFIRMED')
        return HttpResponse.json({ items: bookings, total: 1 })
      })
    )
    
    const { result } = renderHook(() => 
      useGetBookingsQuery({ status: ['CONFIRMED'] })
    )
    
    await waitFor(() => {
      expect(result.current.data?.items).toEqual(bookings)
    })
  })
})
```

## ⚡ Performance Guidelines

### Bundle Optimization

- **Code Splitting**: Route-based and component-based lazy loading
- **Tree Shaking**: Import only used functions from libraries
- **Bundle Analysis**: Regular bundle size monitoring

```typescript
// ✅ Good - Lazy loading
const BookingsTable = lazy(() => import('./bookings-table'))

// ✅ Good - Specific imports
import { formatDate, formatCurrency } from '@/lib/utils'

// ❌ Avoid - Full library imports
import * as _ from 'lodash'
```

### React Optimization

- **Memoization**: Use React.memo for expensive components
- **Callback Optimization**: Use useCallback for event handlers
- **State Optimization**: Minimize re-renders with proper state structure

```typescript
// ✅ Good
const BookingRow = React.memo(({ booking, onStatusChange }: BookingRowProps) => {
  const handleStatusChange = useCallback((status: BookingStatus) => {
    onStatusChange(booking.id, status)
  }, [booking.id, onStatusChange])
  
  return <tr onClick={handleStatusChange}>{/* Row content */}</tr>
})
```

## 🚀 Build & Deployment

### Build Process

```bash
# Development build
pnpm dev

# Production build
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint

# Testing
pnpm test
```

### Environment Configuration

```typescript
// .env.local (development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MSW_ENABLED=true
NODE_ENV=development

// .env.production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_MSW_ENABLED=false
NODE_ENV=production
```

### Deployment Checklist

- [ ] All tests passing
- [ ] Bundle size within limits
- [ ] Performance metrics acceptable
- [ ] Accessibility compliance verified
- [ ] Cross-browser testing completed
- [ ] Environment variables configured
- [ ] Error tracking enabled

## 🔍 Code Review Guidelines

### Review Checklist

- [ ] **Functionality**: Does the code solve the intended problem?
- [ ] **Performance**: Are there any performance concerns?
- [ ] **Security**: Are there security vulnerabilities?
- [ ] **Accessibility**: Is the UI accessible to all users?
- [ ] **Testing**: Are tests comprehensive and meaningful?
- [ ] **Documentation**: Is code properly documented?
- [ ] **Standards**: Does code follow project conventions?

### Review Process

1. **Automated Checks**: Ensure CI passes
2. **Code Quality**: Review for maintainability
3. **Design Patterns**: Verify architectural consistency
4. **User Experience**: Consider impact on users
5. **Technical Debt**: Identify potential issues

---

Following these development guidelines ensures consistent, maintainable, and high-quality code throughout the PRIMA Partner Dashboard project.
