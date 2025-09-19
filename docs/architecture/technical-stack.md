# Technical Stack

Complete overview of the technology stack, dependencies, and version requirements for the PRIMA Partner Dashboard.

## 🎯 Core Technologies

### Frontend Framework
- **Next.js 15** - App Router, RSC, optimized builds
- **React 19** - Latest features, improved performance
- **TypeScript 5.x** - Strict mode, enhanced type safety

### State Management
- **RTK Query** - Server state, caching, data fetching
- **Redux Toolkit** - Client state management
- **React Context** - Theme, user preferences, global UI state

### UI & Styling
- **shadcn/ui** - Accessible, customizable component library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Consistent iconography
- **CSS Variables** - Design token system

### Data & Tables
- **TanStack Table** - Advanced table functionality, virtualization
- **React Hook Form** - Form state management
- **Zod** - Schema validation

### Development & Mocking
- **MSW (Mock Service Worker)** - API mocking for development
- **TypeScript** - Type safety and developer experience
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting

## 📦 Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@reduxjs/toolkit": "^2.0.0",
    "react-redux": "^9.0.0",
    "@tanstack/react-table": "^8.0.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "tailwindcss": "^3.4.0",
    "lucide-react": "^0.300.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  }
}
```

### Development Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "msw": "^2.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## 🔧 Configuration Files

### Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['localhost'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
        ],
      },
    ]
  },
}

export default nextConfig
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
const { fontFamily } = require("tailwindcss/defaultTheme")

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        serif: ["var(--font-serif)", ...fontFamily.serif],
        mono: ["var(--font-mono)", ...fontFamily.mono],
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🛠️ Development Tools

### Code Quality
- **ESLint** with Next.js and TypeScript rules
- **Prettier** for consistent code formatting
- **TypeScript** strict mode for enhanced type checking
- **Husky** for pre-commit hooks (optional)

### Development Experience
- **Next.js Dev Server** with fast refresh
- **TypeScript Language Server** for IDE support
- **MSW Browser Integration** for API mocking
- **React Developer Tools** for debugging

### Performance Monitoring
- **Next.js Built-in Analytics** for Core Web Vitals
- **React Profiler** for component performance
- **Bundle Analyzer** for build optimization
- **Lighthouse** for accessibility and performance audits

## 🎯 Version Requirements

### Node.js
- **Required**: Node.js 20.x or higher
- **Recommended**: Node.js 20.10+ LTS

### Package Manager
- **Primary**: pnpm (for faster installs and better workspace support)
- **Alternative**: npm 10.x or yarn 4.x

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **PWA**: Service Worker support required

### Development Environment
- **TypeScript**: 5.3+
- **ESLint**: 8.x
- **Prettier**: 3.x
- **MSW**: 2.x

## 🚀 Build & Deployment

### Build Process
1. **Type Checking** - TypeScript compilation
2. **Linting** - ESLint validation
3. **Building** - Next.js production build
4. **Testing** - Unit and integration tests
5. **Bundle Analysis** - Size and performance review

### Deployment Targets
- **Primary**: Vercel (optimized for Next.js)
- **Alternative**: Netlify, Railway, or any Node.js hosting
- **PWA**: Service worker registration and caching

### Environment Variables
```bash
# .env.local (development)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_MSW_ENABLED=true
NODE_ENV=development

# .env.production
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_MSW_ENABLED=false
NODE_ENV=production
```

---

This technical stack provides a robust foundation for building the PRIMA Partner Dashboard with modern web technologies, comprehensive type safety, and excellent developer experience.
