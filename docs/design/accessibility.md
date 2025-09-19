# Accessibility Guidelines

Comprehensive accessibility guidelines for building inclusive and WCAG 2.1 AA compliant components in the PRIMA Partner Dashboard.

## 🎯 Accessibility Standards

### WCAG 2.1 AA Compliance
The PRIMA Partner Dashboard adheres to **WCAG 2.1 AA** standards to ensure accessibility for all users, including those with disabilities.

#### Core Principles (POUR)
1. **Perceivable**: Information must be presentable in ways users can perceive
2. **Operable**: Interface components must be operable by all users
3. **Understandable**: Information and UI operation must be understandable
4. **Robust**: Content must be robust enough for interpretation by assistive technologies

## 🌈 Color and Contrast

### Contrast Requirements
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio for focus indicators and boundaries

### Current Design Token Compliance
```css
/* ✅ WCAG AA Compliant - Light Theme */
:root {
  --foreground: oklch(0.2864 0.0785 280.2318);     /* Dark text */
  --background: oklch(0.9730 0.0133 286.1503);     /* Light background */
  /* Contrast ratio: 8.2:1 ✅ */
  
  --primary: oklch(0.5137 0.2376 283.0929);        /* Primary brand */
  --primary-foreground: oklch(1.0000 0 0);         /* White text */
  /* Contrast ratio: 6.1:1 ✅ */
}

/* ✅ WCAG AA Compliant - Dark Theme */
.dark {
  --foreground: oklch(0.9089 0.0367 285.6477);     /* Light text */
  --background: oklch(0.1844 0.0383 281.9748);     /* Dark background */
  /* Contrast ratio: 11.2:1 ✅ */
}
```

### Color Usage Guidelines
```tsx
// ✅ Good - Don't rely solely on color
<StatusBadge 
  status="ERROR" 
  variant="destructive"
  icon={<AlertCircle className="h-3 w-3" />}
>
  Error: Booking failed
</StatusBadge>

// ✅ Good - Use semantic colors with sufficient contrast
<Button variant="destructive">
  <Trash2 className="h-4 w-4 mr-2" />
  Delete Booking
</Button>

// ❌ Avoid - Color as the only indicator
<div className="text-red-500">Error occurred</div>

// ❌ Avoid - Insufficient contrast
<div className="text-gray-400 bg-gray-300">Low contrast text</div>
```

## ⌨️ Keyboard Navigation

### Focus Management
```tsx
// ✅ Good - Proper focus management
function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const previousFocusRef = useRef<HTMLElement>()
  
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Focus first interactive element
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()
    }
    
    return () => {
      // Restore focus when closing
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onKeyDown={handleKeyDown}>
        {/* Modal content */}
      </DialogContent>
    </Dialog>
  )
}
```

### Tab Order and Navigation
```tsx
// ✅ Good - Logical tab order
<form>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <Label htmlFor="guest-name">Guest Name</Label>
      <Input 
        id="guest-name" 
        name="guestName"
        tabIndex={1}
        required
      />
    </div>
    
    <div>
      <Label htmlFor="guest-email">Email</Label>
      <Input 
        id="guest-email" 
        name="guestEmail"
        type="email"
        tabIndex={2}
        required
      />
    </div>
  </div>
  
  <Button type="submit" tabIndex={3}>
    Create Booking
  </Button>
</form>

// ✅ Good - Skip links for navigation
<nav>
  <a 
    href="#main-content" 
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded"
  >
    Skip to main content
  </a>
  {/* Navigation items */}
</nav>
```

### Keyboard Event Handlers
```tsx
// ✅ Good - Comprehensive keyboard support
function InteractiveCard({ onClick }: { onClick: () => void }) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Activate on Enter or Space
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }, [onClick])

  return (
    <div
      role="button"
      tabIndex={0}
      className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      Card content
    </div>
  )
}
```

## 🔤 Semantic HTML and ARIA

### Semantic Structure
```tsx
// ✅ Good - Proper semantic HTML
<main>
  <header>
    <h1>PRIMA Partner Dashboard</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/overview">Overview</a></li>
        <li><a href="/bookings">Bookings</a></li>
        <li><a href="/promoters">Promoters</a></li>
      </ul>
    </nav>
  </header>
  
  <section aria-labelledby="kpi-heading">
    <h2 id="kpi-heading">Key Performance Indicators</h2>
    <div role="group" aria-labelledby="kpi-heading">
      {/* KPI cards */}
    </div>
  </section>
  
  <section aria-labelledby="bookings-heading">
    <h2 id="bookings-heading">Recent Bookings</h2>
    <table>
      <caption className="sr-only">
        Recent bookings with guest names, dates, and status
      </caption>
      <thead>
        <tr>
          <th scope="col">Guest</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {/* Table rows */}
      </tbody>
    </table>
  </section>
</main>

// ❌ Avoid - Generic div containers
<div>
  <div>Dashboard</div>
  <div>
    <div>Overview</div>
    <div>Bookings</div>
  </div>
</div>
```

### ARIA Labels and Descriptions
```tsx
// ✅ Good - Descriptive ARIA labels
<Button
  aria-label="Delete booking for John Doe on March 15th"
  aria-describedby="delete-booking-description"
  onClick={handleDelete}
>
  <Trash2 className="h-4 w-4" />
</Button>
<div id="delete-booking-description" className="sr-only">
  This action cannot be undone. The booking will be permanently deleted.
</div>

// ✅ Good - Form field associations
<div>
  <Label htmlFor="check-in-date">Check-in Date</Label>
  <Input
    id="check-in-date"
    type="date"
    aria-describedby="check-in-help"
    aria-required="true"
  />
  <div id="check-in-help" className="text-sm text-muted-foreground">
    Select your preferred check-in date
  </div>
</div>

// ✅ Good - Live regions for dynamic content
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {status && <span>{status}</span>}
</div>

<div aria-live="assertive" className="sr-only">
  {error && <span>Error: {error}</span>}
</div>
```

### Complex Widget Patterns
```tsx
// ✅ Good - Accessible data table with sorting
function AccessibleDataTable({ data, columns }: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string>()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  return (
    <table role="table" aria-label="Bookings data">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id} scope="col">
              {column.sortable ? (
                <button
                  aria-label={`Sort by ${column.label} ${
                    sortColumn === column.id
                      ? sortDirection === 'asc' ? 'descending' : 'ascending'
                      : 'ascending'
                  }`}
                  aria-sort={
                    sortColumn === column.id
                      ? sortDirection === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                  onClick={() => handleSort(column.id)}
                >
                  {column.label}
                  <span aria-hidden="true">
                    {sortColumn === column.id && (
                      sortDirection === 'asc' ? ' ↑' : ' ↓'
                    )}
                  </span>
                </button>
              ) : (
                column.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            {/* Table cells */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## 📱 Responsive and Mobile Accessibility

### Touch Targets
```css
/* ✅ Good - Minimum 44px touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .btn-mobile {
    min-height: 48px;
    padding: 12px 16px;
  }
  
  .input-mobile {
    min-height: 44px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

### Mobile Navigation
```tsx
// ✅ Good - Accessible mobile navigation
function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
      
      <nav
        id="mobile-menu"
        aria-hidden={!isOpen}
        className={cn(
          "md:hidden absolute top-full left-0 right-0 bg-background border-t",
          !isOpen && "hidden"
        )}
      >
        <ul role="list">
          <li>
            <a href="/overview" className="block px-4 py-3 hover:bg-accent">
              Overview
            </a>
          </li>
          <li>
            <a href="/bookings" className="block px-4 py-3 hover:bg-accent">
              Bookings
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}
```

## 🔊 Screen Reader Support

### Screen Reader Only Content
```css
/* Screen reader only utility class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sr-only.focus:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Descriptive Content
```tsx
// ✅ Good - Descriptive content for screen readers
function KPICard({ title, value, change }: KPICardProps) {
  const changeDescription = change
    ? `${change.type === 'increase' ? 'Increased' : 'Decreased'} by ${Math.abs(change.value)}% from last period`
    : ''

  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <div className="text-2xl font-bold">
        {value}
        <span className="sr-only"> {title.toLowerCase()}</span>
      </div>
      {change && (
        <div className={`change-indicator ${change.type}`}>
          <span aria-hidden="true">
            {change.type === 'increase' ? '↑' : '↓'} {change.value}%
          </span>
          <span className="sr-only">{changeDescription}</span>
        </div>
      )}
    </div>
  )
}

// ✅ Good - Table with proper headers and captions
<table>
  <caption>
    Booking summary for {venue.name} from {dateRange.from} to {dateRange.to}
  </caption>
  <thead>
    <tr>
      <th scope="col">Guest Name</th>
      <th scope="col">Check-in Date</th>
      <th scope="col">Number of Guests</th>
      <th scope="col">Booking Status</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    {bookings.map((booking) => (
      <tr key={booking.id}>
        <th scope="row">{booking.guestName}</th>
        <td>{formatDate(booking.checkInDate)}</td>
        <td>{booking.numberOfGuests}</td>
        <td>
          <StatusBadge status={booking.status} />
          <span className="sr-only">
            Booking status: {booking.status.toLowerCase()}
          </span>
        </td>
        <td>
          <Button 
            variant="ghost" 
            size="sm"
            aria-label={`Edit booking for ${booking.guestName}`}
          >
            Edit
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

## 🧪 Accessibility Testing

### Automated Testing
```typescript
// ✅ Good - Accessibility testing with jest-axe
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { KPICard } from '../kpi-card'

expect.extend(toHaveNoViolations)

describe('KPICard Accessibility', () => {
  test('should have no accessibility violations', async () => {
    const { container } = render(
      <KPICard 
        title="Total Bookings" 
        value={142}
        change={{ value: 12, type: 'increase' }}
      />
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('should be keyboard navigable', () => {
    const onDrillThrough = jest.fn()
    render(
      <KPICard 
        title="Total Bookings" 
        value={142}
        onDrillThrough={onDrillThrough}
      />
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabindex', '0')
    
    // Test keyboard activation
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(onDrillThrough).toHaveBeenCalled()
  })
})
```

### Manual Testing Checklist
- [ ] **Keyboard Navigation**: All interactive elements reachable via Tab
- [ ] **Focus Indicators**: Clear visual focus indicators on all elements
- [ ] **Screen Reader**: Content announced correctly by screen readers
- [ ] **Color Contrast**: All text meets WCAG contrast requirements
- [ ] **Zoom Testing**: Interface usable at 200% zoom level
- [ ] **Motion Sensitivity**: Respects prefers-reduced-motion settings

### Testing Tools
```bash
# Install accessibility testing tools
npm install --save-dev @axe-core/react jest-axe
npm install --save-dev @testing-library/jest-dom
```

## 🎯 Accessibility Patterns

### Error Handling
```tsx
// ✅ Good - Accessible error messages
function BookingForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitStatus, setSubmitStatus] = useState<string>('')

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <Label htmlFor="guest-name">Guest Name *</Label>
        <Input
          id="guest-name"
          name="guestName"
          aria-required="true"
          aria-invalid={!!errors.guestName}
          aria-describedby={errors.guestName ? 'guest-name-error' : undefined}
        />
        {errors.guestName && (
          <div id="guest-name-error" role="alert" className="error-message">
            {errors.guestName}
          </div>
        )}
      </div>
      
      {/* Submit status for screen readers */}
      <div aria-live="polite" className="sr-only">
        {submitStatus}
      </div>
      
      <Button type="submit">Create Booking</Button>
    </form>
  )
}
```

### Loading States
```tsx
// ✅ Good - Accessible loading states
function BookingsList() {
  const { data, isLoading, error } = useGetBookingsQuery()

  if (isLoading) {
    return (
      <div role="status" aria-label="Loading bookings">
        <div className="spinner" aria-hidden="true" />
        <span className="sr-only">Loading bookings...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert role="alert" variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load bookings. Please try again.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {/* Bookings content */}
    </div>
  )
}
```

## 📋 Accessibility Checklist

### Component Level
- [ ] **Semantic HTML**: Uses appropriate HTML elements
- [ ] **ARIA Labels**: Proper aria-label, aria-labelledby, aria-describedby
- [ ] **Keyboard Support**: Full keyboard navigation
- [ ] **Focus Management**: Logical focus order and visible indicators
- [ ] **Color Independence**: Information not conveyed by color alone
- [ ] **Error Handling**: Accessible error messages and validation

### Page Level
- [ ] **Document Structure**: Proper heading hierarchy (h1, h2, h3...)
- [ ] **Landmarks**: Main, nav, section, aside elements used appropriately
- [ ] **Skip Links**: Skip navigation links for keyboard users
- [ ] **Page Title**: Descriptive and unique page titles
- [ ] **Language**: lang attribute set on html element

### Application Level
- [ ] **Route Changes**: Screen reader announcements for route changes
- [ ] **Live Regions**: Dynamic content updates announced
- [ ] **Progressive Enhancement**: Core functionality works without JavaScript
- [ ] **Performance**: Fast loading times for assistive technology users
- [ ] **Documentation**: Accessibility features documented

---

Following these accessibility guidelines ensures that the PRIMA Partner Dashboard is usable by all users, regardless of their abilities or the assistive technologies they may use.
