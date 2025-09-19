# Responsive Design Guide

Comprehensive guide to responsive design patterns, breakpoints, and mobile-first implementation for the PRIMA Partner Dashboard.

## 📱 Mobile-First Philosophy

The PRIMA Partner Dashboard is built with a **mobile-first approach**, ensuring optimal performance and user experience across all device sizes, from smartphones to large desktop displays.

### Core Principles
1. **Progressive Enhancement**: Start with mobile, enhance for larger screens
2. **Touch-Friendly**: Minimum 44px touch targets for interactive elements
3. **Content Priority**: Most important content visible on smallest screens
4. **Performance**: Optimized loading and rendering on mobile devices
5. **Accessibility**: Responsive design that works with assistive technologies

## 📏 Breakpoint System

### Tailwind CSS Breakpoints
```typescript
const breakpoints = {
  // Mobile first (default)
  // 0px - 639px: Mobile portrait and landscape
  
  sm: '640px',    // Small tablets and large phones (landscape)
  md: '768px',    // Tablets (portrait)
  lg: '1024px',   // Small laptops and tablets (landscape)
  xl: '1280px',   // Laptops and desktops
  '2xl': '1536px' // Large desktops and monitors
}
```

### Usage in Components
```tsx
// ✅ Good - Mobile-first responsive classes
<div className="
  grid grid-cols-1        // Mobile: 1 column
  sm:grid-cols-2          // Small: 2 columns
  lg:grid-cols-3          // Large: 3 columns
  xl:grid-cols-4          // XL: 4 columns
  gap-4 sm:gap-6          // Responsive gap sizing
">
  {kpiCards.map(card => <KPICard key={card.id} {...card} />)}
</div>

// ✅ Good - Responsive text sizing
<h1 className="
  text-2xl sm:text-3xl lg:text-4xl
  font-bold leading-tight
">
  Dashboard Overview
</h1>

// ✅ Good - Responsive spacing
<div className="
  p-4 sm:p-6 lg:p-8
  space-y-4 sm:space-y-6
">
  Content with responsive padding and spacing
</div>
```

## 🎨 Layout Patterns

### Grid Systems
```tsx
// KPI Cards Grid - Responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
  <KPICard title="Total Revenue" value={24847} />
  <KPICard title="Bookings" value={342} />
  <KPICard title="Avg. Value" value={72.67} />
  <KPICard title="Conversion" value={12.4} />
</div>

// Main Content Layout - Sidebar + Content
<div className="flex flex-col lg:flex-row gap-6">
  {/* Sidebar - Full width on mobile, sidebar on desktop */}
  <aside className="lg:w-80 lg:flex-shrink-0">
    <FilterPanel />
  </aside>
  
  {/* Main content - Adapts to available space */}
  <main className="flex-1 min-w-0">
    <BookingsTable />
  </main>
</div>

// Dashboard Layout - Stacked on mobile, grid on desktop
<div className="space-y-6 lg:space-y-8">
  {/* Top section - Full width */}
  <section>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* KPI Cards */}
    </div>
  </section>
  
  {/* Middle section - Two columns on large screens */}
  <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <div className="xl:col-span-2">
      <Chart />
    </div>
    <div>
      <RecentActivity />
    </div>
  </section>
</div>
```

### Navigation Patterns
```tsx
// Desktop Navigation - Sidebar
<div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
  <div className="flex flex-col flex-grow pt-5 bg-sidebar overflow-y-auto">
    <AppSidebar />
  </div>
</div>

// Mobile Navigation - Collapsible sheet
<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden">
      <Menu className="h-6 w-6" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-72">
    <MobileSidebar />
  </SheetContent>
</Sheet>

// Header Navigation - Responsive toolbar
<header className="
  flex items-center justify-between
  h-14 sm:h-16 lg:h-20
  px-4 sm:px-6 lg:px-8
  border-b bg-background
">
  <div className="flex items-center gap-4">
    <SidebarTrigger className="lg:hidden" />
    <Logo className="h-8 sm:h-10" />
  </div>
  
  <div className="flex items-center gap-2 sm:gap-4">
    <GlobalSearch className="hidden sm:block" />
    <ThemeToggle />
    <UserProfile />
  </div>
</header>
```

## 📊 Data Display Patterns

### Tables - Responsive Strategies
```tsx
// Strategy 1: Horizontal scroll on mobile
<div className="w-full overflow-x-auto">
  <table className="min-w-full divide-y divide-border">
    <thead>
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          Guest Name
        </th>
        <th className="hidden sm:table-cell px-6 py-3">Date</th>
        <th className="hidden md:table-cell px-6 py-3">Guests</th>
        <th className="px-6 py-3">Status</th>
        <th className="px-6 py-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* Table rows with responsive cell visibility */}
    </tbody>
  </table>
</div>

// Strategy 2: Card layout on mobile
function ResponsiveBookingsView({ bookings }: { bookings: Booking[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <DataTable data={bookings} columns={desktopColumns} />
      </div>
      
      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {bookings.map(booking => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </div>
    </>
  )
}

// Mobile-optimized card component
function BookingCard({ booking }: { booking: Booking }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{booking.guestName}</h3>
          <p className="text-sm text-muted-foreground">{booking.guestEmail}</p>
        </div>
        <StatusBadge status={booking.status} size="sm" />
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Date:</span>
          <span className="ml-1">{formatDate(booking.checkInDate)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Guests:</span>
          <span className="ml-1">{booking.numberOfGuests}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="flex-1">
          Edit
        </Button>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
```

### Charts - Responsive Implementation
```tsx
function ResponsiveChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Revenue Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                className="text-xs sm:text-sm"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                className="text-xs sm:text-sm"
              />
              <Tooltip 
                contentStyle={{
                  fontSize: '14px',
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 🎛️ Interactive Components

### Forms - Mobile Optimization
```tsx
function ResponsiveBookingForm() {
  return (
    <form className="space-y-4 sm:space-y-6">
      {/* Single column on mobile, two columns on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label htmlFor="guest-name">Guest Name</Label>
          <Input 
            id="guest-name"
            className="
              h-12 sm:h-10          // Larger touch targets on mobile
              text-base sm:text-sm   // Prevent zoom on iOS
            "
            placeholder="Enter guest name"
          />
        </div>
        
        <div>
          <Label htmlFor="guest-email">Email</Label>
          <Input 
            id="guest-email"
            type="email"
            className="h-12 sm:h-10 text-base sm:text-sm"
            placeholder="guest@example.com"
          />
        </div>
      </div>
      
      {/* Date picker - Full width on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <Label htmlFor="check-in">Check-in Date</Label>
          <DatePicker className="w-full" />
        </div>
        
        <div>
          <Label htmlFor="guests">Number of Guests</Label>
          <Select>
            <SelectTrigger className="h-12 sm:h-10">
              <SelectValue placeholder="Select guests" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={`${i + 1}`}>
                  {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Buttons - Stack on mobile, inline on desktop */}
      <div className="
        flex flex-col sm:flex-row 
        gap-3 sm:gap-4 
        sm:justify-end
      ">
        <Button variant="outline" className="sm:w-auto">
          Cancel
        </Button>
        <Button className="sm:w-auto">
          Create Booking
        </Button>
      </div>
    </form>
  )
}
```

### Modals and Dialogs
```tsx
function ResponsiveDialog({ children, ...props }: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="
        w-full max-w-lg
        mx-4 sm:mx-auto          // Margin on mobile
        max-h-[90vh] sm:max-h-[85vh]  // Height constraints
        overflow-y-auto          // Scroll if needed
      ">
        {children}
      </DialogContent>
    </Dialog>
  )
}

// Sheet for mobile, Dialog for desktop
function ResponsiveBookingDetail({ booking, isOpen, onClose }: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="h-[90vh]">
          <BookingDetailContent booking={booking} />
        </SheetContent>
      </Sheet>
    )
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <BookingDetailContent booking={booking} />
      </DialogContent>
    </Dialog>
  )
}
```

## 🖱️ Touch and Gesture Support

### Touch Targets
```css
/* Minimum touch target sizes */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile-specific button sizing */
@media (max-width: 768px) {
  .btn-mobile {
    min-height: 48px;
    padding: 12px 16px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .input-mobile {
    min-height: 44px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
```

### Hover States - Touch Considerations
```tsx
// ✅ Good - Touch-friendly interactions
<Button 
  className="
    transition-colors duration-200
    hover:bg-primary/90
    active:bg-primary/95        // Active state for touch
    focus:ring-2 focus:ring-primary focus:ring-offset-2
  "
  onTouchStart={() => {}}       // Enables :active on iOS
>
  Click me
</Button>

// ✅ Good - Conditional hover effects
<Card className="
  transition-shadow duration-200
  hover:shadow-md
  @media (hover: hover) {       // Only apply hover on devices that support it
    &:hover {
      transform: translateY(-2px);
    }
  }
">
  Card content
</Card>
```

## 📐 Container and Spacing

### Container Patterns
```tsx
// Page container with responsive max-width
<div className="
  w-full max-w-7xl mx-auto
  px-4 sm:px-6 lg:px-8
  py-6 sm:py-8 lg:py-12
">
  Page content
</div>

// Section containers
<section className="
  w-full
  py-8 sm:py-12 lg:py-16
  px-4 sm:px-6 lg:px-8
">
  <div className="max-w-4xl mx-auto">
    Section content
  </div>
</section>

// Card containers with responsive padding
<Card className="
  p-4 sm:p-6 lg:p-8
  space-y-4 sm:space-y-6
">
  Card content
</Card>
```

### Spacing Utilities
```typescript
// Responsive spacing scale
const spacing = {
  mobile: {
    xs: 'space-y-2',
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
  },
  desktop: {
    xs: 'sm:space-y-3',
    sm: 'sm:space-y-4',
    md: 'sm:space-y-6',
    lg: 'sm:space-y-8',
    xl: 'sm:space-y-12',
  }
}

// Usage in components
<div className="space-y-4 sm:space-y-6 lg:space-y-8">
  <ComponentA />
  <ComponentB />
  <ComponentC />
</div>
```

## 🔧 Responsive Utilities

### Custom Hooks
```typescript
// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Breakpoint hook
export function useBreakpoint() {
  const isSm = useMediaQuery('(min-width: 640px)')
  const isMd = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1024px)')
  const isXl = useMediaQuery('(min-width: 1280px)')
  const is2Xl = useMediaQuery('(min-width: 1536px)')

  return {
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile: !isMd,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
  }
}
```

### Responsive Component Patterns
```tsx
// Conditional rendering based on screen size
function ResponsiveNavigation() {
  const { isMobile } = useBreakpoint()
  
  return (
    <>
      {isMobile ? (
        <MobileNavigation />
      ) : (
        <DesktopNavigation />
      )}
    </>
  )
}

// Responsive props pattern
interface ResponsiveCardProps {
  title: string
  compact?: boolean  // Compact layout for mobile
}

function ResponsiveCard({ title, compact }: ResponsiveCardProps) {
  const { isMobile } = useBreakpoint()
  const isCompact = compact ?? isMobile
  
  return (
    <Card className={cn(
      'transition-all duration-200',
      isCompact ? 'p-4' : 'p-6',
      isCompact ? 'space-y-2' : 'space-y-4'
    )}>
      <h3 className={cn(
        'font-semibold',
        isCompact ? 'text-base' : 'text-lg'
      )}>
        {title}
      </h3>
      {/* Card content */}
    </Card>
  )
}
```

## 🎯 Performance Considerations

### Image Optimization
```tsx
// Responsive images with Next.js
<Image
  src="/venue-photo.jpg"
  alt="Venue interior"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-lg object-cover"
  priority={false}
/>

// CSS responsive images
<div className="relative aspect-video">
  <img 
    src="/photo.jpg"
    alt="Description"
    className="absolute inset-0 w-full h-full object-cover"
    loading="lazy"
  />
</div>
```

### Lazy Loading
```tsx
// Lazy load components on larger screens
const AdvancedChart = lazy(() => import('./advanced-chart'))
const DetailedTable = lazy(() => import('./detailed-table'))

function DashboardSection() {
  const { isDesktop } = useBreakpoint()
  
  return (
    <div>
      {/* Always show basic components */}
      <KPICards />
      
      {/* Conditionally load heavy components */}
      {isDesktop && (
        <Suspense fallback={<ChartSkeleton />}>
          <AdvancedChart />
        </Suspense>
      )}
    </div>
  )
}
```

## ✅ Responsive Design Checklist

### Design Phase
- [ ] **Mobile-first wireframes** created for all key screens
- [ ] **Touch targets** designed at minimum 44px
- [ ] **Content hierarchy** prioritized for mobile
- [ ] **Navigation patterns** defined for mobile and desktop
- [ ] **Breakpoint strategy** documented

### Development Phase
- [ ] **Mobile-first CSS** using min-width media queries
- [ ] **Touch-friendly interactions** implemented
- [ ] **Responsive typography** scales appropriately
- [ ] **Images optimized** with responsive sizing
- [ ] **Performance budgets** maintained across devices

### Testing Phase
- [ ] **Device testing** on actual mobile devices
- [ ] **Viewport testing** at all major breakpoints
- [ ] **Orientation testing** portrait and landscape
- [ ] **Touch gesture testing** on touch devices
- [ ] **Performance testing** on slower mobile networks

### Accessibility Phase
- [ ] **Touch accessibility** verified on mobile
- [ ] **Keyboard navigation** works on all screen sizes
- [ ] **Screen reader testing** on mobile devices
- [ ] **Zoom testing** up to 200% on mobile
- [ ] **Motion sensitivity** preferences respected

---

This responsive design guide ensures the PRIMA Partner Dashboard provides an optimal user experience across all devices while maintaining design consistency and performance standards.
