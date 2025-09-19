# Design Tokens

Complete specification of the existing design tokens as implemented in your PRIMA Partner Dashboard. **These tokens should NOT be modified** - they represent your current, established design system.

## 🎨 Color Tokens (Current Implementation)

### Light Theme Colors
```css
:root {
  /* Background Colors - OKLCH Color Space */
  --background: oklch(0.9730 0.0133 286.1503);
  --foreground: oklch(0.2864 0.0785 280.2318);
  
  /* Surface Colors */
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
  
  /* Border & Input Colors */
  --border: oklch(0.9042 0.0299 285.7872);
  --input: oklch(0.9042 0.0299 285.7872);
  --ring: oklch(0.5137 0.2376 283.0929);
}
```

### Dark Theme Colors
```css
.dark {
  /* Background Colors */
  --background: oklch(0.1844 0.0383 281.9748);
  --foreground: oklch(0.9089 0.0367 285.6477);
  
  /* Surface Colors */
  --card: oklch(0.2173 0.0538 280.9468);
  --card-foreground: oklch(0.9089 0.0367 285.6477);
  --popover: oklch(0.2173 0.0538 280.9468);
  --popover-foreground: oklch(0.9089 0.0367 285.6477);
  
  /* Brand Colors */
  --primary: oklch(0.7162 0.1597 290.3962);
  --primary-foreground: oklch(0.1844 0.0383 281.9748);
  --secondary: oklch(0.2959 0.1005 279.8426);
  --secondary-foreground: oklch(0.8367 0.0849 285.9111);
  
  /* Neutral Colors */
  --muted: oklch(0.2547 0.0867 278.2918);
  --muted-foreground: oklch(0.7019 0.0640 284.6311);
  --accent: oklch(0.3143 0.1156 277.4334);
  --accent-foreground: oklch(0.9089 0.0367 285.6477);
  
  /* Border & Input Colors */
  --border: oklch(0.3088 0.0841 280.2819);
  --input: oklch(0.3088 0.0841 280.2819);
  --ring: oklch(0.7162 0.1597 290.3962);
}
```

### Chart Colors (Current Implementation)
```css
:root {
  /* Light Theme Chart Colors */
  --chart-1: oklch(0.5137 0.2376 283.0929);
  --chart-2: oklch(0.6990 0.1685 288.6576);
  --chart-3: oklch(0.5464 0.2522 273.7324);
  --chart-4: oklch(0.6275 0.2057 281.1907);
  --chart-5: oklch(0.4272 0.2319 273.2320);
}

.dark {
  /* Dark Theme Chart Colors */
  --chart-1: oklch(0.7162 0.1597 290.3962);
  --chart-2: oklch(0.6138 0.1461 273.3596);
  --chart-3: oklch(0.7512 0.1369 245.3085);
  --chart-4: oklch(0.7637 0.1217 185.4995);
  --chart-5: oklch(0.7546 0.1831 346.8124);
}
```

### Sidebar Colors (Current Implementation)
```css
:root {
  /* Light Theme Sidebar */
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
  /* Dark Theme Sidebar */
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

### Additional Tokens (Current Implementation)
```css
:root {
  /* Border Radius */
  --radius: 0.5rem;
  
  /* Typography */
  --font-sans: 'Noto Sans', ui-sans-serif, sans-serif, system-ui;
  --font-serif: 'Noto Serif', ui-serif, serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
  
  /* Shadow System */
  --shadow-color: #25255b;
  --shadow-opacity: 0.12;
  --shadow-blur: 10px;
  --shadow-spread: 0px;
  --shadow-offset-x: 0px;
  --shadow-offset-y: 4px;
  
  /* Predefined Shadow Values */
  --shadow-2xs: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.06);
  --shadow-xs: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.06);
  --shadow-sm: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 0px 1px 2px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 0px 1px 2px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-md: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 0px 2px 4px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-lg: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 0px 4px 6px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-xl: 0px 8px 10px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-2xl: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.30);
  
  /* Spacing & Typography */
  --letter-spacing: 0em;
  --spacing: 0.25rem;
  --tracking-normal: 0em;
}
```

## 📝 Typography Tokens

### Font Families
```css
:root {
  --font-sans: 'Noto Sans', ui-sans-serif, sans-serif, system-ui;
  --font-serif: 'Noto Serif', ui-serif, serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
```

### Font Sizes
```css
:root {
  /* Display Sizes */
  --text-display-2xl: 4.5rem;         /* 72px */
  --text-display-xl: 3.75rem;         /* 60px */
  --text-display-lg: 3rem;            /* 48px */
  
  /* Heading Sizes */
  --text-heading-xl: 2.25rem;         /* 36px */
  --text-heading-lg: 1.875rem;        /* 30px */
  --text-heading-md: 1.5rem;          /* 24px */
  --text-heading-sm: 1.25rem;         /* 20px */
  --text-heading-xs: 1.125rem;        /* 18px */
  
  /* Body Sizes */
  --text-body-xl: 1.25rem;            /* 20px */
  --text-body-lg: 1.125rem;           /* 18px */
  --text-body: 1rem;                  /* 16px */
  --text-body-sm: 0.875rem;           /* 14px */
  --text-body-xs: 0.75rem;            /* 12px */
  
  /* Special Sizes */
  --text-caption: 0.75rem;            /* 12px */
  --text-overline: 0.75rem;           /* 12px */
}
```

### Line Heights
```css
:root {
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* Contextual Line Heights */
  --leading-display: 1.1;             /* For large display text */
  --leading-heading: 1.3;             /* For headings */
  --leading-body: 1.6;                /* For body text */
  --leading-caption: 1.4;             /* For small text */
}
```

### Font Weights
```css
:root {
  --font-weight-thin: 100;
  --font-weight-extralight: 200;
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
  --font-weight-black: 900;
}
```

## 📏 Spacing Tokens

### Base Spacing Scale
```css
:root {
  /* Base unit: 0.25rem (4px) */
  --space-px: 1px;
  --space-0: 0;
  --space-0-5: 0.125rem;              /* 2px */
  --space-1: 0.25rem;                 /* 4px */
  --space-1-5: 0.375rem;              /* 6px */
  --space-2: 0.5rem;                  /* 8px */
  --space-2-5: 0.625rem;              /* 10px */
  --space-3: 0.75rem;                 /* 12px */
  --space-3-5: 0.875rem;              /* 14px */
  --space-4: 1rem;                    /* 16px */
  --space-5: 1.25rem;                 /* 20px */
  --space-6: 1.5rem;                  /* 24px */
  --space-7: 1.75rem;                 /* 28px */
  --space-8: 2rem;                    /* 32px */
  --space-9: 2.25rem;                 /* 36px */
  --space-10: 2.5rem;                 /* 40px */
  --space-11: 2.75rem;                /* 44px */
  --space-12: 3rem;                   /* 48px */
  --space-14: 3.5rem;                 /* 56px */
  --space-16: 4rem;                   /* 64px */
  --space-20: 5rem;                   /* 80px */
  --space-24: 6rem;                   /* 96px */
  --space-28: 7rem;                   /* 112px */
  --space-32: 8rem;                   /* 128px */
  --space-36: 9rem;                   /* 144px */
  --space-40: 10rem;                  /* 160px */
  --space-44: 11rem;                  /* 176px */
  --space-48: 12rem;                  /* 192px */
  --space-52: 13rem;                  /* 208px */
  --space-56: 14rem;                  /* 224px */
  --space-60: 15rem;                  /* 240px */
  --space-64: 16rem;                  /* 256px */
  --space-72: 18rem;                  /* 288px */
  --space-80: 20rem;                  /* 320px */
  --space-96: 24rem;                  /* 384px */
}
```

### Semantic Spacing
```css
:root {
  /* Component-specific spacing */
  --space-button-sm: var(--space-2);
  --space-button: var(--space-3);
  --space-button-lg: var(--space-4);
  
  --space-card-sm: var(--space-3);
  --space-card: var(--space-4);
  --space-card-lg: var(--space-6);
  
  --space-section-sm: var(--space-6);
  --space-section: var(--space-8);
  --space-section-lg: var(--space-12);
  
  --space-page-sm: var(--space-4);
  --space-page: var(--space-6);
  --space-page-lg: var(--space-8);
}
```

## 🌗 Border & Radius Tokens

### Border Radius
```css
:root {
  --radius: 0.5rem;                   /* 8px - Default radius */
  --radius-none: 0;
  --radius-sm: 0.25rem;               /* 4px */
  --radius-md: 0.375rem;              /* 6px */
  --radius-lg: 0.5rem;                /* 8px */
  --radius-xl: 0.75rem;               /* 12px */
  --radius-2xl: 1rem;                 /* 16px */
  --radius-3xl: 1.5rem;               /* 24px */
  --radius-full: 9999px;              /* Fully rounded */
}
```

### Border Widths
```css
:root {
  --border-width-0: 0;
  --border-width: 1px;                /* Default border */
  --border-width-2: 2px;
  --border-width-4: 4px;
  --border-width-8: 8px;
}
```

## 🏗️ Shadow Tokens

### Box Shadows
```css
:root {
  /* Shadow definitions using HSL with opacity */
  --shadow-2xs: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.06);
  --shadow-xs: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.06);
  --shadow-sm: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 
               0px 1px 2px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 
            0px 1px 2px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-md: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 
               0px 2px 4px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-lg: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.12), 
               0px 4px 6px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-xl: 0px 8px 10px -1px hsl(240 42.1875% 25.0980% / 0.12);
  --shadow-2xl: 0px 4px 10px 0px hsl(240 42.1875% 25.0980% / 0.30);
}
```

### Usage Guidelines
```css
/* Component shadow usage */
.card {
  box-shadow: var(--shadow-sm);      /* Default card shadow */
}

.card:hover {
  box-shadow: var(--shadow-md);      /* Hover elevation */
}

.modal {
  box-shadow: var(--shadow-2xl);     /* Modal overlay shadow */
}

.dropdown {
  box-shadow: var(--shadow-lg);      /* Dropdown shadow */
}
```

## 📐 Layout Tokens

### Container Sizes
```css
:root {
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
}
```

### Grid Systems
```css
:root {
  /* Grid gaps */
  --grid-gap-sm: var(--space-2);
  --grid-gap: var(--space-4);
  --grid-gap-lg: var(--space-6);
  --grid-gap-xl: var(--space-8);
  
  /* Column counts */
  --grid-cols-1: repeat(1, minmax(0, 1fr));
  --grid-cols-2: repeat(2, minmax(0, 1fr));
  --grid-cols-3: repeat(3, minmax(0, 1fr));
  --grid-cols-4: repeat(4, minmax(0, 1fr));
  --grid-cols-12: repeat(12, minmax(0, 1fr));
}
```

## 🎭 Animation Tokens

### Timing Functions
```css
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Custom easing for UI */
  --ease-ui: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Duration Tokens
```css
:root {
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
  
  /* Semantic durations */
  --duration-fast: var(--duration-150);
  --duration-normal: var(--duration-300);
  --duration-slow: var(--duration-500);
}
```

## 🎯 Z-Index Tokens

### Layering System
```css
:root {
  --z-auto: auto;
  --z-0: 0;
  --z-10: 10;
  --z-20: 20;
  --z-30: 30;
  --z-40: 40;
  --z-50: 50;
  
  /* Semantic z-indexes */
  --z-dropdown: var(--z-50);
  --z-sticky: var(--z-40);
  --z-fixed: var(--z-30);
  --z-modal-backdrop: var(--z-40);
  --z-modal: var(--z-50);
  --z-popover: var(--z-50);
  --z-tooltip: var(--z-50);
  --z-toast: var(--z-50);
}
```

## 🔧 Usage Guidelines

### Token Implementation
```css
/* ✅ Good - Using design tokens */
.component {
  color: hsl(var(--foreground));
  background-color: hsl(var(--card));
  border: var(--border-width) solid hsl(var(--border));
  border-radius: var(--radius);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: var(--leading-body);
}

/* ❌ Avoid - Hard-coded values */
.component {
  color: #242450;
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

### Tailwind Integration
```typescript
// tailwind.config.js - Token integration
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... all other color tokens
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
    },
  },
}
```

---

These design tokens provide a comprehensive foundation for consistent styling throughout the PRIMA Partner Dashboard, ensuring maintainability, accessibility, and design coherence across all components and themes.
