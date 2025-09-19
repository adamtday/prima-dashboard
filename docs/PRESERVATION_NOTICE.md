# 🚨 DESIGN SYSTEM PRESERVATION NOTICE

## Critical Notice for Development

**The current design system and design tokens MUST be preserved without modification.**

### ✅ What is Already Established (DO NOT CHANGE)

#### 1. Design Tokens (`src/app/globals.css`)
- **Color System**: Complete OKLCH color space implementation
- **Typography**: Noto Sans, Noto Serif, IBM Plex Mono font stack
- **Shadows**: Comprehensive shadow system with HSL values
- **Spacing**: Base spacing system using 0.25rem units
- **Border Radius**: 0.5rem default radius

#### 2. Component Foundation (`components.json`)
- **shadcn/ui**: "new-york" style configuration
- **CSS Variables**: Enabled and properly configured
- **Aliases**: Component path aliases established
- **Icon Library**: Lucide React integration

#### 3. Tailwind Integration (`@theme inline`)
- **Color Mapping**: All design tokens mapped to Tailwind utilities
- **Radius System**: Calculated radius variants
- **Font Families**: Typography system integration
- **Shadow System**: Complete shadow utility mapping

### 🛡️ What Must Be Preserved

#### Color Values (OKLCH Format)
```css
/* These exact values must not be changed */
--primary: oklch(0.5137 0.2376 283.0929);
--background: oklch(0.9730 0.0133 286.1503);
--foreground: oklch(0.2864 0.0785 280.2318);
/* ... all other OKLCH values */
```

#### Typography System
```css
/* Font stack must remain as specified */
--font-sans: 'Noto Sans', ui-sans-serif, sans-serif, system-ui;
--font-serif: 'Noto Serif', ui-serif, serif;
--font-mono: 'IBM Plex Mono', ui-monospace, monospace;
```

#### Shadow System
```css
/* Shadow values must remain consistent */
--shadow-sm: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 0px 1px 2px -1px hsl(240 42.1875% 25.0980% / 0.12);
/* ... all other shadow definitions */
```

### ✅ What Can Be Added (New Components Only)

#### New PRIMA Components
- Create new components that USE existing tokens
- Build upon shadcn/ui foundation
- Follow established patterns and conventions

#### Example of Correct New Component Usage
```tsx
// ✅ CORRECT - Uses existing design tokens
export function KPICard({ title, value }: KPICardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  )
}

// ❌ WRONG - Modifies existing tokens or adds conflicting styles
export function KPICard({ title, value }: KPICardProps) {
  return (
    <div style={{ 
      backgroundColor: '#f5f5ff',  // Hardcoded color
      color: '#242450',            // Hardcoded color
      borderRadius: '12px'         // Different from established radius
    }}>
      {/* Component content */}
    </div>
  )
}
```

### 🎯 Implementation Guidelines

#### For PRIMA Module Development
1. **Use Existing Utilities**: Leverage established Tailwind classes
2. **Extend, Don't Replace**: Build upon existing component patterns
3. **Maintain Consistency**: Follow established naming and structure conventions
4. **Test Integration**: Ensure new components work with dark/light themes

#### Acceptable Additions
- New component variants using existing tokens
- Additional utility classes that reference existing CSS variables
- Business logic and data integration
- Responsive design implementations using existing breakpoints

#### Prohibited Changes
- Modifying any CSS variable values in `globals.css`
- Changing font families or typography scale
- Altering shadow, spacing, or radius systems
- Adding conflicting color definitions
- Changing theme structure or switching mechanisms

### 🔍 Verification Checklist

Before any component implementation:
- [ ] Does it use existing design tokens exclusively?
- [ ] Does it follow established shadcn/ui patterns?
- [ ] Does it work correctly in both light and dark themes?
- [ ] Does it maintain accessibility standards?
- [ ] Does it integrate with existing navigation and layout?

### 📚 Reference Documentation

- [Current Design Tokens](./design/tokens.md) - Exact values to use
- [Component Guidelines](./design/components.md) - Usage patterns
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Development approach

### ⚠️ Warning Signs

If you see any of these in development, STOP and review:
- Hardcoded color values (hex, rgb, hsl)
- Custom CSS that bypasses design tokens
- Font family modifications
- Shadow or radius value changes
- Theme-breaking implementations

### 🎯 Remember

The goal is to build PRIMA-specific functionality on top of your excellent existing design foundation, not to replace or modify it. The current system provides a sophisticated, accessible, and consistent base that should be preserved and extended.

---

**This preservation notice ensures the integrity and consistency of your established design system while enabling the development of new PRIMA Partner Dashboard functionality.**
