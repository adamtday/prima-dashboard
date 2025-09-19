# Design System Documentation

Comprehensive design system guidelines, component usage, and theming documentation for the PRIMA Partner Dashboard.

## 📁 Design Documentation

- [Design Tokens](./tokens.md) - Color palette, typography, spacing, and CSS variables ✅
- [Component Library](./components.md) - Component specifications and usage guidelines ✅
- [Theming Guide](./theming.md) - Light/dark theme implementation and customization ✅
- [Accessibility Guidelines](./accessibility.md) - WCAG compliance and inclusive design practices ✅
- [Responsive Design](./responsive.md) - Breakpoints, layouts, and mobile-first approach ✅
- [Icon System](./icons.md) - Icon usage, sizing, and accessibility (Future)

## 🎨 Design Philosophy

### Core Principles

1. **Consistency** - Unified visual language across all components and modules
2. **Accessibility** - WCAG 2.1 AA compliance with inclusive design practices
3. **Performance** - Optimized rendering with minimal visual complexity
4. **Scalability** - Design tokens and components that scale across contexts
5. **User-Centered** - Clear hierarchy and intuitive interactions

### Visual Language

**Modern Professional**: Clean, sophisticated interface that conveys trust and efficiency
**Data-Driven**: Clear information hierarchy with emphasis on actionable insights
**Responsive**: Seamless experience across desktop, tablet, and mobile devices
**Accessible**: High contrast, clear typography, and keyboard-friendly interactions

## 🎯 Color System (Current Implementation)

### Primary Palette
Your established design system uses sophisticated OKLCH color space values that should be preserved:

```css
:root {
  /* Primary Brand Colors - DO NOT MODIFY */
  --primary: oklch(0.5137 0.2376 283.0929);
  --primary-foreground: oklch(1.0000 0 0);
  
  /* Secondary Accent */
  --secondary: oklch(0.9174 0.0435 292.6901);
  --secondary-foreground: oklch(0.3916 0.1427 284.7922);
  
  /* Neutral Foundation */
  --background: oklch(0.9730 0.0133 286.1503);
  --foreground: oklch(0.2864 0.0785 280.2318);
  --muted: oklch(0.9532 0.0187 286.0394);
  --muted-foreground: oklch(0.5272 0.0657 283.9213);
}
```

**Important**: These values use OKLCH color space for optimal color consistency and should not be modified.

### Semantic Colors
```css
:root {
  /* Status Colors */
  --success: rgb(34, 197, 94);           /* Green */
  --warning: rgb(245, 158, 11);          /* Amber */  
  --destructive: rgb(255, 84, 112);      /* Red */
  --info: rgb(59, 130, 246);             /* Blue */
  
  /* Chart Colors */
  --chart-1: rgb(95, 62, 231);           /* Primary Purple */
  --chart-2: rgb(156, 137, 255);         /* Light Purple */
  --chart-3: rgb(77, 79, 255);           /* Blue Purple */
  --chart-4: rgb(120, 112, 255);         /* Medium Purple */
  --chart-5: rgb(51, 41, 202);           /* Dark Purple */
}
```

### Dark Theme Palette
```css
.dark {
  /* Adjusted for dark mode readability */
  --background: rgb(16, 16, 35);
  --foreground: rgb(222, 222, 249);
  --primary: rgb(164, 143, 255);         /* Lighter for contrast */
  --card: rgb(22, 22, 50);
  --border: rgb(41, 41, 89);
}
```

## 📐 Typography System

### Font Stack
```css
:root {
  --font-sans: 'Noto Sans', ui-sans-serif, sans-serif, system-ui;
  --font-serif: 'Noto Serif', ui-serif, serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
```

### Type Scale
```typescript
interface TypographyScale {
  // Display (Hero/Landing)
  'display-2xl': { size: '4.5rem', lineHeight: '1.1', weight: '800' }
  'display-xl': { size: '3.75rem', lineHeight: '1.2', weight: '700' }
  'display-lg': { size: '3rem', lineHeight: '1.2', weight: '700' }
  
  // Headings (Page Titles, Section Headers)
  'heading-xl': { size: '2.25rem', lineHeight: '1.3', weight: '600' }
  'heading-lg': { size: '1.875rem', lineHeight: '1.3', weight: '600' }
  'heading-md': { size: '1.5rem', lineHeight: '1.4', weight: '600' }
  'heading-sm': { size: '1.25rem', lineHeight: '1.4', weight: '600' }
  
  // Body Text
  'body-lg': { size: '1.125rem', lineHeight: '1.6', weight: '400' }
  'body': { size: '1rem', lineHeight: '1.6', weight: '400' }
  'body-sm': { size: '0.875rem', lineHeight: '1.5', weight: '400' }
  
  // Labels & Captions
  'label': { size: '0.875rem', lineHeight: '1.4', weight: '500' }
  'caption': { size: '0.75rem', lineHeight: '1.4', weight: '400' }
  'overline': { size: '0.75rem', lineHeight: '1.4', weight: '600', transform: 'uppercase' }
}
```

### Usage Guidelines
```typescript
// ✅ Good - Semantic usage
<h1 className="text-heading-xl font-semibold">Overview Dashboard</h1>
<p className="text-body text-muted-foreground">Last updated 5 minutes ago</p>
<span className="text-label font-medium">Total Revenue</span>

// ❌ Avoid - Hard-coded styles
<h1 className="text-4xl font-bold">Title</h1>
```

## 📏 Spacing System

### Space Scale
Based on 4px baseline grid for consistent rhythm:

```typescript
interface SpacingScale {
  'px': '1px',
  '0': '0',
  '0.5': '0.125rem',    // 2px
  '1': '0.25rem',       // 4px
  '1.5': '0.375rem',    // 6px
  '2': '0.5rem',        // 8px
  '2.5': '0.625rem',    // 10px
  '3': '0.75rem',       // 12px
  '3.5': '0.875rem',    // 14px
  '4': '1rem',          // 16px
  '5': '1.25rem',       // 20px
  '6': '1.5rem',        // 24px
  '7': '1.75rem',       // 28px
  '8': '2rem',          // 32px
  '10': '2.5rem',       // 40px
  '12': '3rem',         // 48px
  '16': '4rem',         // 64px
  '20': '5rem',         // 80px
  '24': '6rem',         // 96px
}
```

### Layout Patterns
```typescript
// Container spacing
const containerPatterns = {
  // Page containers
  page: 'p-6 md:p-8 lg:p-12',
  
  // Card/component spacing  
  card: 'p-4 md:p-6',
  cardCompact: 'p-3 md:p-4',
  
  // Stack spacing
  stackTight: 'space-y-2',
  stackDefault: 'space-y-4', 
  stackLoose: 'space-y-6',
  
  // Grid gaps
  gridTight: 'gap-2 md:gap-3',
  gridDefault: 'gap-4 md:gap-6',
  gridLoose: 'gap-6 md:gap-8',
}
```

## 🎛️ Component Architecture

### Component Hierarchy
```
Design System Components
├── Primitives (shadcn/ui)
│   ├── Button, Input, Card, etc.
│   └── Accessible, unstyled base
├── Composite Components  
│   ├── KPICard, DataTable, FilterPanel
│   └── Business logic + styling
└── Layout Components
    ├── Header, Sidebar, Navigation
    └── Page structure and flow
```

### Variant System
Using `class-variance-authority` for systematic component variants:

```typescript
// Example: Button variants
const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80", 
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## 📱 Responsive Design

### Breakpoint System
```typescript
const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet portrait
  lg: '1024px',   // Tablet landscape / Small desktop
  xl: '1280px',   // Desktop
  '2xl': '1536px' // Large desktop
}
```

### Layout Patterns
```typescript
// Responsive grid patterns
const gridPatterns = {
  // KPI cards
  kpiGrid: 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4',
  
  // Main content areas
  contentGrid: 'grid grid-cols-1 lg:grid-cols-3 gap-6',
  
  // Sidebar layouts
  sidebarLayout: 'flex flex-col lg:flex-row gap-6',
}

// Mobile-first responsive utilities
const responsivePatterns = {
  // Hide on mobile, show on larger screens
  desktopOnly: 'hidden lg:block',
  
  // Show on mobile, hide on larger screens  
  mobileOnly: 'block lg:hidden',
  
  // Responsive text sizing
  responsiveText: 'text-sm md:text-base lg:text-lg',
}
```

## 🎨 Component Usage Examples

### KPI Card
```tsx
<KPICard
  title="Total Bookings"
  value={342}
  change={{ value: 14.8, type: 'increase' }}
  className="hover:shadow-md transition-shadow"
  onDrillThrough={() => router.push('/prima/bookings')}
/>
```

### Data Table
```tsx
<DataTable
  columns={bookingColumns}
  data={bookings}
  filtering={true}
  sorting={true}
  pagination={{ pageSize: 50 }}
  className="border rounded-md"
/>
```

### Status Badge
```tsx
<StatusBadge
  status="CONFIRMED"
  variant="success"
  size="sm"
  className="font-medium"
/>
```

## 🌗 Theme Implementation

### Theme Provider Setup
```tsx
// Theme context and provider
export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }
    
    root.classList.add(theme)
  }, [theme])
  
  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}
```

### Theme Toggle Component
```tsx
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order

### Implementation Guidelines
```tsx
// ✅ Good - Accessible component
<button
  className="btn btn-primary"
  aria-label="View booking details"
  aria-describedby="booking-123-summary"
  onKeyDown={handleKeyDown}
>
  View Details
</button>

// ✅ Good - Semantic HTML
<main>
  <h1>Overview Dashboard</h1>
  <section aria-labelledby="kpi-heading">
    <h2 id="kpi-heading">Key Performance Indicators</h2>
    {/* KPI content */}
  </section>
</main>
```

## 📊 Design Token Usage

### CSS Custom Properties
All design tokens are implemented as CSS custom properties for maximum flexibility:

```css
/* Component using design tokens */
.kpi-card {
  background: hsl(var(--card));
  color: hsl(var(--card-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
}

.kpi-card:hover {
  box-shadow: var(--shadow-md);
}
```

### Tailwind Integration
Design tokens integrate seamlessly with Tailwind utilities:

```tsx
// Using token-based utilities
<div className="bg-card text-card-foreground border rounded-lg p-4 shadow-sm hover:shadow-md">
  <h3 className="text-heading-sm font-semibold text-foreground">
    Total Revenue
  </h3>
  <p className="text-body-lg font-bold text-primary">
    $24,847
  </p>
  <span className="text-caption text-muted-foreground">
    +12.3% from last month
  </span>
</div>
```

---

This design system provides a comprehensive foundation for building consistent, accessible, and maintainable UI components throughout the PRIMA Partner Dashboard.
