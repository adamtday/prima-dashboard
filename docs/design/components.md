# Component Library Documentation

Comprehensive guide to PRIMA Partner Dashboard components, their usage patterns, and implementation guidelines.

## 📁 Component Organization

```
components/
├── ui/                        # Base shadcn/ui components
│   ├── button.tsx            # Button primitives
│   ├── card.tsx              # Card containers
│   ├── table.tsx             # Table primitives
│   └── ...                   # Other base components
├── prima/                     # PRIMA business components
│   ├── kpi-card/             # KPI display cards
│   ├── venue-selector/       # Multi-venue navigation
│   ├── booking-status/       # Booking status management
│   ├── promoter-leaderboard/ # Promoter performance
│   └── ...                   # Other business components
└── layout/                   # Layout and navigation
    ├── app-sidebar.tsx       # Main navigation
    ├── header.tsx            # Page headers
    └── breadcrumb.tsx        # Navigation breadcrumbs
```

## 🎯 Component Categories

### 1. Base UI Components (shadcn/ui)

These are the foundational components that follow the established design tokens and should not be modified.

#### Button
```tsx
import { Button } from '@/components/ui/button'

// Primary action
<Button variant="default" size="default">
  Save Changes
</Button>

// Secondary action
<Button variant="outline" size="sm">
  Cancel
</Button>

// Destructive action
<Button variant="destructive" size="lg">
  Delete Booking
</Button>

// Icon button
<Button variant="ghost" size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>
```

#### Card
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Total Revenue</CardTitle>
    <CardDescription>Last 30 days</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-2xl font-bold">$24,847</p>
  </CardContent>
</Card>
```

#### Table
```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Guest Name</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>2024-03-15</TableCell>
      <TableCell>Confirmed</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 2. Business Components (PRIMA-specific)

#### KPI Card
**Purpose**: Display key performance indicators with drill-through capability

```tsx
interface KPICardProps {
  title: string
  value: number | string
  subtitle?: string
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period?: string
  }
  trend?: number[]
  format?: 'number' | 'currency' | 'percentage'
  icon?: React.ComponentType<{ className?: string }>
  onDrillThrough?: () => void
  isLoading?: boolean
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  change,
  trend,
  format = 'number',
  icon: Icon,
  onDrillThrough,
  isLoading,
  className
}: KPICardProps) {
  const formattedValue = useMemo(() => {
    if (isLoading) return '---'
    
    switch (format) {
      case 'currency':
        return formatCurrency(value as number)
      case 'percentage':
        return `${value}%`
      default:
        return formatNumber(value as number)
    }
  }, [value, format, isLoading])

  return (
    <Card 
      className={cn(
        "relative transition-all duration-200",
        onDrillThrough && "cursor-pointer hover:shadow-md hover:ring-1 hover:ring-primary/20",
        className
      )}
      onClick={onDrillThrough}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {change && (
          <div className="flex items-center pt-1">
            <ChangeIndicator change={change} />
          </div>
        )}
        {trend && (
          <div className="mt-2 h-6">
            <MiniChart data={trend} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

#### Venue Selector
**Purpose**: Multi-venue navigation with context preservation

```tsx
interface VenueSelectorProps {
  selectedVenue: Venue | null
  availableVenues: Venue[]
  isPortfolioView: boolean
  onVenueSelect: (venueId: string | null) => void
  isLoading?: boolean
  className?: string
}

export function VenueSelector({
  selectedVenue,
  availableVenues,
  isPortfolioView,
  onVenueSelect,
  isLoading,
  className
}: VenueSelectorProps) {
  // Implementation follows RFC-003 specification
}
```

#### Status Badge
**Purpose**: Consistent status indication across the application

```tsx
interface StatusBadgeProps {
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'COMPLETED'
  variant?: 'default' | 'outline'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

const statusConfig = {
  PENDING: { label: 'Pending', color: 'warning' },
  CONFIRMED: { label: 'Confirmed', color: 'success' },
  CANCELLED: { label: 'Cancelled', color: 'destructive' },
  NO_SHOW: { label: 'No Show', color: 'destructive' },
  COMPLETED: { label: 'Completed', color: 'success' },
}

export function StatusBadge({ status, variant = 'default', size = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <Badge 
      variant={variant} 
      className={cn(
        'font-medium',
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1',
        config.color === 'success' && 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        config.color === 'warning' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        config.color === 'destructive' && 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        className
      )}
    >
      {config.label}
    </Badge>
  )
}
```

### 3. Data Display Components

#### Advanced Data Table
**Purpose**: High-performance table with filtering, sorting, and pagination

```tsx
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterConfig?: FilterConfig
  sortingConfig?: SortingConfig
  paginationConfig?: PaginationConfig
  selectionConfig?: SelectionConfig
  onRowClick?: (row: TData) => void
  loading?: boolean
  error?: string
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterConfig,
  sortingConfig,
  paginationConfig,
  selectionConfig,
  onRowClick,
  loading,
  error,
  className
}: DataTableProps<TData, TValue>) {
  // TanStack Table implementation with virtual scrolling
  // Follows RFC-005 specification for booking management
}
```

#### Filter Panel
**Purpose**: Consistent filtering interface across modules

```tsx
interface FilterPanelProps {
  filters: FilterConfig[]
  values: Record<string, any>
  onChange: (filters: Record<string, any>) => void
  onReset: () => void
  onApply: () => void
  className?: string
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onReset,
  onApply,
  className
}: FilterPanelProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
        
        <div className="space-y-3">
          {filters.map((filter) => (
            <FilterField
              key={filter.key}
              config={filter}
              value={values[filter.key]}
              onChange={(value) => onChange({ ...values, [filter.key]: value })}
            />
          ))}
        </div>
        
        <Button onClick={onApply} className="w-full">
          Apply Filters
        </Button>
      </div>
    </Card>
  )
}
```

## 🎨 Design Patterns

### Loading States
```tsx
// Skeleton loading for KPI cards
<Card className="animate-pulse">
  <CardHeader>
    <div className="h-4 bg-muted rounded w-3/4"></div>
  </CardHeader>
  <CardContent>
    <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-muted rounded w-1/3"></div>
  </CardContent>
</Card>

// Loading state for tables
<div className="space-y-3">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="h-16 bg-muted rounded animate-pulse" />
  ))}
</div>
```

### Error States
```tsx
// Error boundary fallback
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to load data. Please try again.
  </AlertDescription>
</Alert>

// Empty state
<div className="text-center py-12">
  <div className="mx-auto h-12 w-12 text-muted-foreground">
    <InboxIcon />
  </div>
  <h3 className="mt-4 text-sm font-semibold">No bookings found</h3>
  <p className="mt-2 text-sm text-muted-foreground">
    Try adjusting your filters or date range.
  </p>
</div>
```

### Responsive Patterns
```tsx
// Mobile-first responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
  {kpis.map((kpi) => (
    <KPICard key={kpi.id} {...kpi} />
  ))}
</div>

// Responsive table with mobile cards
<div className="block md:hidden">
  {data.map((item) => (
    <BookingCard key={item.id} booking={item} />
  ))}
</div>
<div className="hidden md:block">
  <DataTable columns={columns} data={data} />
</div>
```

## 🔧 Component Development Guidelines

### Component Structure
```tsx
// components/prima/example-component/index.tsx

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// 1. Define Props Interface
interface ExampleComponentProps {
  // Required props first
  title: string
  value: number
  
  // Optional props
  subtitle?: string
  className?: string
  
  // Event handlers
  onClick?: () => void
}

// 2. Component Implementation
export const ExampleComponent = forwardRef<
  HTMLDivElement,
  ExampleComponentProps
>(({ title, value, subtitle, className, onClick, ...props }, ref) => {
  // 3. Hooks and state
  const [isLoading, setIsLoading] = useState(false)
  
  // 4. Event handlers
  const handleClick = useCallback(() => {
    onClick?.()
  }, [onClick])
  
  // 5. Render
  return (
    <div
      ref={ref}
      className={cn("default-classes", className)}
      onClick={handleClick}
      {...props}
    >
      {/* Component JSX */}
    </div>
  )
})

ExampleComponent.displayName = "ExampleComponent"
```

### Testing Pattern
```tsx
// components/prima/example-component/__tests__/example-component.test.tsx

import { render, screen, fireEvent } from '@testing-library/react'
import { ExampleComponent } from '../index'

describe('ExampleComponent', () => {
  test('renders title and value correctly', () => {
    render(<ExampleComponent title="Test Title" value={100} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })
  
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<ExampleComponent title="Test" value={100} onClick={handleClick} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
  
  test('applies custom className', () => {
    render(<ExampleComponent title="Test" value={100} className="custom-class" />)
    
    expect(screen.getByText('Test').parentElement).toHaveClass('custom-class')
  })
})
```

## 📏 Accessibility Guidelines

### Keyboard Navigation
- All interactive components must be keyboard accessible
- Logical tab order throughout component hierarchy
- Escape key to close modals/dropdowns
- Enter/Space to activate buttons and links

### Screen Reader Support
```tsx
// Proper ARIA labels and descriptions
<button
  aria-label="Close modal"
  aria-describedby="modal-description"
  onClick={onClose}
>
  <XIcon className="h-4 w-4" />
</button>

// Semantic HTML structure
<main>
  <h1>Page Title</h1>
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section Title</h2>
    {/* Section content */}
  </section>
</main>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {status && <p>{status}</p>}
</div>
```

### Color and Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Do not rely solely on color to convey information
- Use icons, text, or patterns as additional indicators

## 🎯 Performance Optimization

### Memoization
```tsx
// Memoize expensive calculations
const ExpensiveComponent = memo(({ data, filters }) => {
  const processedData = useMemo(() => {
    return data.filter(item => 
      filters.every(filter => filter.predicate(item))
    )
  }, [data, filters])
  
  return <div>{/* Render processed data */}</div>
})

// Memoize event handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id)
}, [onItemClick])
```

### Lazy Loading
```tsx
// Lazy load heavy components
const BookingTable = lazy(() => import('./booking-table'))
const PromoterChart = lazy(() => import('./promoter-chart'))

// Use with Suspense
<Suspense fallback={<TableSkeleton />}>
  <BookingTable data={bookings} />
</Suspense>
```

### Virtual Scrolling
```tsx
// For large lists (1000+ items)
import { FixedSizeList as List } from 'react-window'

const VirtualizedList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={60}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <ItemComponent item={data[index]} />
      </div>
    )}
  </List>
)
```

---

This component library documentation provides comprehensive guidelines for building consistent, accessible, and performant components throughout the PRIMA Partner Dashboard.
