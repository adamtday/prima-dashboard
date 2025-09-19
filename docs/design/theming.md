# Theming Guide

Comprehensive guide to implementing and customizing themes in the PRIMA Partner Dashboard while preserving the established OKLCH color system.

## 🎨 Theme System Overview

The PRIMA Partner Dashboard uses a sophisticated theming system built on CSS custom properties with OKLCH color space for optimal color consistency and accessibility.

### Key Principles
- **Preserve Existing Tokens**: The established OKLCH values must not be modified
- **System Integration**: Seamless light/dark mode switching
- **Accessibility First**: WCAG 2.1 AA compliance maintained across themes
- **Performance**: Efficient theme switching with minimal layout shifts

## 🌗 Light and Dark Themes

### Light Theme (Default)
```css
:root {
  /* Background & Surface Colors */
  --background: oklch(0.9730 0.0133 286.1503);
  --foreground: oklch(0.2864 0.0785 280.2318);
  --card: oklch(1.0000 0 0);
  --card-foreground: oklch(0.2864 0.0785 280.2318);
  --popover: oklch(1.0000 0 0);
  --popover-foreground: oklch(0.2864 0.0785 280.2318);
  
  /* Brand Colors */
  --primary: oklch(0.5137 0.2376 283.0929);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9174 0.0435 292.6901);
  --secondary-foreground: oklch(0.3916 0.1427 284.7922);
  
  /* Neutral Colors */
  --muted: oklch(0.9532 0.0187 286.0394);
  --muted-foreground: oklch(0.5272 0.0657 283.9213);
  --accent: oklch(0.9221 0.0373 262.1410);
  --accent-foreground: oklch(0.2864 0.0785 280.2318);
  
  /* Semantic Colors */
  --destructive: oklch(0.6861 0.2061 14.9941);
  --destructive-foreground: oklch(1.0000 0 0);
  
  /* Border & Input */
  --border: oklch(0.9042 0.0299 285.7872);
  --input: oklch(0.9042 0.0299 285.7872);
  --ring: oklch(0.5137 0.2376 283.0929);
}
```

### Dark Theme
```css
.dark {
  /* Background & Surface Colors */
  --background: oklch(0.1844 0.0383 281.9748);
  --foreground: oklch(0.9089 0.0367 285.6477);
  --card: oklch(0.2173 0.0538 280.9468);
  --card-foreground: oklch(0.9089 0.0367 285.6477);
  --popover: oklch(0.2173 0.0538 280.9468);
  --popover-foreground: oklch(0.9089 0.0367 285.6477);
  
  /* Brand Colors - Adjusted for dark mode */
  --primary: oklch(0.7162 0.1597 290.3962);
  --primary-foreground: oklch(0.1844 0.0383 281.9748);
  --secondary: oklch(0.2959 0.1005 279.8426);
  --secondary-foreground: oklch(0.8367 0.0849 285.9111);
  
  /* Neutral Colors */
  --muted: oklch(0.2547 0.0867 278.2918);
  --muted-foreground: oklch(0.7019 0.0640 284.6311);
  --accent: oklch(0.3143 0.1156 277.4334);
  --accent-foreground: oklch(0.9089 0.0367 285.6477);
  
  /* Semantic Colors */
  --destructive: oklch(0.6861 0.2061 14.9941);
  --destructive-foreground: oklch(1.0000 0 0);
  
  /* Border & Input */
  --border: oklch(0.3088 0.0841 280.2819);
  --input: oklch(0.3088 0.0841 280.2819);
  --ring: oklch(0.7162 0.1597 290.3962);
}
```

## 🎛️ Theme Provider Implementation

### Theme Context
```tsx
// lib/theme/theme-context.tsx
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'prima-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
```

### Theme Toggle Component
```tsx
// components/theme-switch.tsx
import { Monitor, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/lib/theme/theme-context'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="flex items-center gap-2"
        >
          <Monitor className="h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## 🎨 Chart & Data Visualization Theming

### Chart Color Palette
```css
:root {
  /* Light theme chart colors */
  --chart-1: oklch(0.5137 0.2376 283.0929);   /* Primary purple */
  --chart-2: oklch(0.6990 0.1685 288.6576);   /* Light purple */
  --chart-3: oklch(0.5464 0.2522 273.7324);   /* Blue purple */
  --chart-4: oklch(0.6275 0.2057 281.1907);   /* Medium purple */
  --chart-5: oklch(0.4272 0.2319 273.2320);   /* Dark purple */
}

.dark {
  /* Dark theme chart colors - optimized for visibility */
  --chart-1: oklch(0.7162 0.1597 290.3962);   /* Lighter primary */
  --chart-2: oklch(0.6138 0.1461 273.3596);   /* Adjusted purple */
  --chart-3: oklch(0.7512 0.1369 245.3085);   /* Blue accent */
  --chart-4: oklch(0.7637 0.1217 185.4995);   /* Teal accent */
  --chart-5: oklch(0.7546 0.1831 346.8124);   /* Pink accent */
}
```

### Chart Theme Implementation
```tsx
// components/charts/chart-container.tsx
import { useTheme } from '@/lib/theme/theme-context'

export function ChartContainer({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  
  const chartTheme = {
    light: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      grid: 'hsl(var(--border))',
      tooltip: {
        background: 'hsl(var(--popover))',
        border: 'hsl(var(--border))',
        text: 'hsl(var(--popover-foreground))',
      }
    },
    dark: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      grid: 'hsl(var(--border))',
      tooltip: {
        background: 'hsl(var(--popover))',
        border: 'hsl(var(--border))',
        text: 'hsl(var(--popover-foreground))',
      }
    }
  }
  
  return (
    <div className="chart-container" data-theme={theme}>
      {children}
    </div>
  )
}
```

## 🔧 Sidebar Theme Integration

### Sidebar-Specific Tokens
```css
:root {
  /* Sidebar colors for light theme */
  --sidebar: oklch(0.9532 0.0187 286.0394);
  --sidebar-background: var(--background);
  --sidebar-foreground: oklch(0.2864 0.0785 280.2318);
  --sidebar-primary: oklch(0.5137 0.2376 283.0929);
  --sidebar-primary-foreground: oklch(1.0000 0 0);
  --sidebar-accent: oklch(0.9221 0.0373 262.1410);
  --sidebar-accent-foreground: oklch(0.2864 0.0785 280.2318);
  --sidebar-border: oklch(0.9042 0.0299 285.7872);
  --sidebar-ring: oklch(0.5137 0.2376 283.0929);
}

.dark {
  /* Sidebar colors for dark theme */
  --sidebar: oklch(0.2173 0.0538 280.9468);
  --sidebar-foreground: oklch(0.9089 0.0367 285.6477);
  --sidebar-primary: oklch(0.7162 0.1597 290.3962);
  --sidebar-primary-foreground: oklch(0.1844 0.0383 281.9748);
  --sidebar-accent: oklch(0.3143 0.1156 277.4334);
  --sidebar-accent-foreground: oklch(0.9089 0.0367 285.6477);
  --sidebar-border: oklch(0.3088 0.0841 280.2819);
  --sidebar-ring: oklch(0.7162 0.1597 290.3962);
}
```

## 🎨 Status and Semantic Color Theming

### Status Colors Implementation
```tsx
// lib/theme/status-colors.ts
export const statusColors = {
  light: {
    success: {
      background: 'rgb(34, 197, 94)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(240, 253, 244)',
      mutedForeground: 'rgb(22, 163, 74)',
    },
    warning: {
      background: 'rgb(245, 158, 11)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(254, 252, 232)',
      mutedForeground: 'rgb(180, 83, 9)',
    },
    error: {
      background: 'rgb(239, 68, 68)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(254, 242, 242)',
      mutedForeground: 'rgb(185, 28, 28)',
    },
    info: {
      background: 'rgb(59, 130, 246)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(239, 246, 255)',
      mutedForeground: 'rgb(37, 99, 235)',
    }
  },
  dark: {
    success: {
      background: 'rgb(34, 197, 94)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(20, 83, 45)',
      mutedForeground: 'rgb(134, 239, 172)',
    },
    warning: {
      background: 'rgb(245, 158, 11)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(120, 53, 15)',
      mutedForeground: 'rgb(253, 224, 71)',
    },
    error: {
      background: 'rgb(239, 68, 68)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(127, 29, 29)',
      mutedForeground: 'rgb(252, 165, 165)',
    },
    info: {
      background: 'rgb(59, 130, 246)',
      foreground: 'rgb(255, 255, 255)',
      muted: 'rgb(30, 58, 138)',
      mutedForeground: 'rgb(147, 197, 253)',
    }
  }
} as const
```

## 🌅 Theme Transitions and Animations

### Smooth Theme Transitions
```css
/* Global transition for theme changes */
* {
  transition: 
    background-color 200ms ease-in-out,
    border-color 200ms ease-in-out,
    color 200ms ease-in-out,
    fill 200ms ease-in-out,
    stroke 200ms ease-in-out,
    box-shadow 200ms ease-in-out;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* Theme-aware focus rings */
.focus-visible:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### Loading State During Theme Switch
```tsx
// components/theme-loading.tsx
export function ThemeLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Switching theme...</span>
      </div>
    </div>
  )
}
```

## 📱 Responsive Theme Considerations

### Mobile Theme Optimizations
```css
/* Mobile-specific theme adjustments */
@media (max-width: 768px) {
  :root {
    /* Slightly larger hit targets on mobile */
    --touch-target-min: 44px;
    
    /* Adjusted spacing for mobile */
    --mobile-padding: 1rem;
    --mobile-gap: 0.75rem;
  }
  
  .dark {
    /* Increased contrast for mobile readability */
    --foreground: oklch(0.95 0.02 286);
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --border: oklch(0.8 0.05 286);
  }
  
  .dark {
    --border: oklch(0.4 0.1 286);
    --foreground: oklch(1 0 0);
  }
}
```

## 🔍 Theme Testing and Validation

### Theme Testing Utilities
```tsx
// lib/theme/theme-test-utils.tsx
export function ThemeTestWrapper({ 
  theme = 'light', 
  children 
}: { 
  theme?: 'light' | 'dark'
  children: React.ReactNode 
}) {
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])
  
  return <>{children}</>
}

// Test contrast ratios
export function validateContrastRatio(
  foreground: string, 
  background: string
): { ratio: number; passes: boolean } {
  // Implementation to check WCAG contrast requirements
  const ratio = calculateContrastRatio(foreground, background)
  return {
    ratio,
    passes: ratio >= 4.5 // WCAG AA requirement
  }
}
```

### Theme Validation Checklist
- [ ] All text meets WCAG 2.1 AA contrast requirements (4.5:1)
- [ ] Interactive elements are clearly distinguishable
- [ ] Focus indicators are visible in both themes
- [ ] Status colors convey meaning beyond color alone
- [ ] Charts and data visualizations remain readable
- [ ] Theme transitions are smooth and don't cause layout shifts
- [ ] System theme detection works correctly
- [ ] Theme preference persists across sessions

## 🎯 Best Practices

### Component Theme Integration
```tsx
// ✅ Good - Use semantic tokens
function StatusBadge({ status }: { status: string }) {
  return (
    <div className="bg-card text-card-foreground border rounded-md px-2 py-1">
      {status}
    </div>
  )
}

// ❌ Avoid - Hard-coded colors
function StatusBadge({ status }: { status: string }) {
  return (
    <div className="bg-white text-gray-900 border-gray-200 rounded-md px-2 py-1">
      {status}
    </div>
  )
}
```

### Performance Considerations
- Use CSS custom properties for instant theme switching
- Avoid inline styles that can't benefit from theme tokens
- Minimize the number of DOM classes changed during theme switches
- Preload critical theme-related resources

### Accessibility Guidelines
- Maintain sufficient contrast ratios across all themes
- Use semantic color names rather than descriptive ones
- Provide alternative indicators beyond color for important information
- Test with high contrast mode and reduced motion preferences

---

This theming guide ensures consistent, accessible, and performant theme implementation throughout the PRIMA Partner Dashboard while preserving the established design token system.
