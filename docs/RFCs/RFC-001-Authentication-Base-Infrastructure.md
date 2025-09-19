# RFC-001: Authentication & Base Infrastructure

## Summary

Establish the foundational authentication system and base infrastructure for the PRIMA Partner Dashboard. This RFC implements user authentication, session management, route protection, and establishes core patterns that all subsequent RFCs will build upon.

## Features Addressed

- **M8**: Role-based data masking demonstration (Admin vs Manager vs Coordinator)
- User authentication flow with role-based access
- Session state management with user context
- Route protection for PRIMA modules
- Base infrastructure patterns for subsequent RFCs

## Technical Approach

### Authentication Strategy
- **Mock Authentication**: Realistic auth flow without real backend
- **Role-Based Access**: Three user roles with different permissions
- **Session Management**: Client-side session with user context
- **Route Protection**: HOCs and middleware for protected routes

### Architecture Considerations
- Built on existing shadcn/ui components and OKLCH design tokens
- Uses React Context for user state management
- Integrates with existing layout structure
- Provides patterns for subsequent RTK Query integration

## Dependencies
- **Builds Upon**: Existing Next.js 15 + shadcn/ui foundation
- **Enables**: RFC-002 (Data Layer), RFC-003 (Layout Shell)

## Complexity: Low
- Straightforward authentication patterns
- Leverages existing UI components
- Well-established React Context patterns

## Detailed Requirements

### 1. User Authentication System

#### User Roles & Permissions
```typescript
interface UserRole {
  id: 'ADMIN' | 'MANAGER' | 'COORDINATOR'
  name: string
  permissions: Permission[]
  dataAccess: DataAccessLevel
}

const USER_ROLES: UserRole[] = [
  {
    id: 'ADMIN',
    name: 'Venue Admin',
    permissions: ['READ_ALL', 'WRITE_ALL', 'EXPORT_ALL', 'MANAGE_USERS'],
    dataAccess: 'FULL' // Access to PII and financial data
  },
  {
    id: 'MANAGER', 
    name: 'Operations Manager',
    permissions: ['READ_OPERATIONAL', 'WRITE_OPERATIONAL', 'EXPORT_MASKED'],
    dataAccess: 'MASKED' // PII masked, limited financial access
  },
  {
    id: 'COORDINATOR',
    name: 'Marketing Coordinator', 
    permissions: ['READ_LIMITED', 'EXPORT_LIMITED'],
    dataAccess: 'LIMITED' // No PII, no financial data
  }
]
```

#### Mock User Accounts
```typescript
const DEMO_USERS = [
  {
    id: 'user_admin_001',
    email: 'admin@primavenues.com',
    password: 'demo123', // For demo only
    firstName: 'Sarah',
    lastName: 'Chen',
    role: 'ADMIN',
    venueAccess: ['venue_prima_downtown', 'venue_prima_bistro', 'venue_prima_hotel', 'venue_prima_events']
  },
  {
    id: 'user_manager_001', 
    email: 'manager@primavenues.com',
    password: 'demo123',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    role: 'MANAGER',
    venueAccess: ['venue_prima_downtown', 'venue_prima_bistro']
  },
  {
    id: 'user_coordinator_001',
    email: 'coordinator@primavenues.com', 
    password: 'demo123',
    firstName: 'Jessica',
    lastName: 'Kim',
    role: 'COORDINATOR',
    venueAccess: ['venue_prima_downtown']
  }
]
```

### 2. Authentication Context Provider

#### User Context Implementation
```typescript
// src/lib/auth/auth-context.tsx
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => void
  switchRole: (roleId: string) => void // For demo role switching
  hasPermission: (permission: Permission) => boolean
  getDataAccessLevel: () => DataAccessLevel
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('prima_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<AuthResult> => {
    // Mock authentication logic
    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    
    if (user) {
      const authUser: User = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        venueAccess: user.venueAccess,
        loginTime: new Date().toISOString()
      }
      
      setUser(authUser)
      localStorage.setItem('prima_user', JSON.stringify(authUser))
      
      return { success: true, user: authUser }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('prima_user')
  }

  const switchRole = (roleId: string) => {
    // Demo feature: allow role switching to demonstrate RBAC
    if (user && ['ADMIN', 'MANAGER', 'COORDINATOR'].includes(roleId)) {
      const newUser = { ...user, role: roleId as UserRole['id'] }
      setUser(newUser)
      localStorage.setItem('prima_user', JSON.stringify(newUser))
    }
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    const role = USER_ROLES.find(r => r.id === user.role)
    return role?.permissions.includes(permission) || false
  }

  const getDataAccessLevel = (): DataAccessLevel => {
    if (!user) return 'NONE'
    const role = USER_ROLES.find(r => r.id === user.role)
    return role?.dataAccess || 'NONE'
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      switchRole,
      hasPermission,
      getDataAccessLevel,
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 3. Login Page Implementation

#### Login Form Component
```typescript
// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const DEMO_ACCOUNTS = [
  { email: 'admin@primavenues.com', role: 'Venue Admin', description: 'Full access to all venues and data' },
  { email: 'manager@primavenues.com', role: 'Operations Manager', description: 'Operational access with PII masking' },
  { email: 'coordinator@primavenues.com', role: 'Marketing Coordinator', description: 'Limited access, no financial data' }
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      router.push('/overview')
    } else {
      setError(result.error || 'Login failed')
    }
    
    setIsLoading(false)
  }

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('demo123')
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome to PRIMA</CardTitle>
            <CardDescription className="text-center">
              Partner Dashboard Demo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
              </div>
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => handleDemoLogin(account.email)}
                >
                  <div className="text-left">
                    <div className="font-medium">{account.role}</div>
                    <div className="text-xs text-muted-foreground">{account.description}</div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="text-xs text-center text-muted-foreground">
              All demo accounts use password: <code className="bg-muted px-1 rounded">demo123</code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

### 4. Route Protection

#### Authentication Middleware
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is accessing PRIMA routes
  if (request.nextUrl.pathname.startsWith('/overview') ||
      request.nextUrl.pathname.startsWith('/bookings') ||
      request.nextUrl.pathname.startsWith('/pricing') ||
      request.nextUrl.pathname.startsWith('/promoters') ||
      request.nextUrl.pathname.startsWith('/finance') ||
      request.nextUrl.pathname.startsWith('/incentives') ||
      request.nextUrl.pathname.startsWith('/commissions') ||
      request.nextUrl.pathname.startsWith('/team') ||
      request.nextUrl.pathname.startsWith('/settings')) {
    
    // In a real app, this would check server-side session
    // For demo, we'll rely on client-side checks
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
```

#### Protected Route HOC
```typescript
// src/lib/auth/protected-route.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './auth-context'
import { Skeleton } from '@/components/ui/skeleton'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: Permission
  fallback?: React.ReactNode
}

export function ProtectedRoute({ 
  children, 
  requiredPermission,
  fallback = <div>Access denied</div>
}: ProtectedRouteProps) {
  const { isAuthenticated, hasPermission, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
```

### 5. User Profile & Role Switching

#### User Profile Component
```typescript
// src/components/auth/user-profile.tsx
'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { LogOut, User, Shield } from 'lucide-react'

export function UserProfile() {
  const { user, logout, switchRole } = useAuth()

  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/default.png" alt={user.firstName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <Badge variant="secondary" className="w-fit">
              {user.role.replace('_', ' ')}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Demo Role Switching
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => switchRole('ADMIN')}>
          <Shield className="mr-2 h-4 w-4" />
          Venue Admin
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchRole('MANAGER')}>
          <User className="mr-2 h-4 w-4" />
          Operations Manager
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchRole('COORDINATOR')}>
          <User className="mr-2 h-4 w-4" />
          Marketing Coordinator
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## API Contracts

### Authentication Types
```typescript
// src/types/auth.ts
export type Permission = 
  | 'READ_ALL' | 'WRITE_ALL' | 'EXPORT_ALL' | 'MANAGE_USERS'
  | 'READ_OPERATIONAL' | 'WRITE_OPERATIONAL' | 'EXPORT_MASKED'
  | 'READ_LIMITED' | 'EXPORT_LIMITED'

export type DataAccessLevel = 'FULL' | 'MASKED' | 'LIMITED' | 'NONE'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'MANAGER' | 'COORDINATOR'
  venueAccess: string[]
  loginTime: string
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}
```

## Data Models

### User Data Structure
```typescript
interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole['id']
  venueAccess: string[]
  preferences: {
    theme: 'light' | 'dark' | 'system'
    defaultVenue?: string
    language: string
  }
  metadata: {
    lastLogin: string
    loginCount: number
    createdAt: string
  }
}
```

## State Management

### Authentication State Pattern
```typescript
// Integration ready for RTK Query in RFC-002
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as User | null,
    isAuthenticated: false,
    isLoading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
    },
    loginSuccess: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },
    loginFailure: (state) => {
      state.isLoading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
    },
    switchRole: (state, action) => {
      if (state.user) {
        state.user.role = action.payload
      }
    }
  }
})
```

## Error Handling

### Authentication Errors
```typescript
const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to access this resource',
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.'
}

const handleAuthError = (error: AuthError) => {
  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      toast.error(AUTH_ERRORS.INVALID_CREDENTIALS)
      break
    case 'SESSION_EXPIRED':
      toast.error(AUTH_ERRORS.SESSION_EXPIRED)
      // Redirect to login
      break
    default:
      toast.error(AUTH_ERRORS.UNKNOWN_ERROR)
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
// src/lib/auth/__tests__/auth-context.test.tsx
describe('AuthContext', () => {
  test('login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    
    const loginResult = await result.current.login('admin@primavenues.com', 'demo123')
    
    expect(loginResult.success).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user?.role).toBe('ADMIN')
  })

  test('login with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    
    const loginResult = await result.current.login('invalid@email.com', 'wrong')
    
    expect(loginResult.success).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
  })

  test('role switching functionality', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    
    // Login first
    act(() => {
      result.current.login('admin@primavenues.com', 'demo123')
    })
    
    // Switch role
    act(() => {
      result.current.switchRole('MANAGER')
    })
    
    expect(result.current.user?.role).toBe('MANAGER')
  })

  test('permission checking', () => {
    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider })
    
    act(() => {
      result.current.login('manager@primavenues.com', 'demo123')
    })
    
    expect(result.current.hasPermission('READ_OPERATIONAL')).toBe(true)
    expect(result.current.hasPermission('MANAGE_USERS')).toBe(false)
  })
})
```

### Integration Tests
```typescript
// src/app/(auth)/login/__tests__/login.test.tsx
describe('Login Page', () => {
  test('successful login redirects to overview', async () => {
    render(<LoginPage />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@primavenues.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'demo123' }
    })
    
    fireEvent.click(screen.getByText('Sign In'))
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/overview')
    })
  })

  test('demo account buttons populate form', () => {
    render(<LoginPage />)
    
    fireEvent.click(screen.getByText('Venue Admin'))
    
    expect(screen.getByDisplayValue('admin@primavenues.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('demo123')).toBeInTheDocument()
  })
})
```

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Auth components loaded only when needed
- **Session Persistence**: Efficient localStorage usage
- **Context Optimization**: Memoized context values to prevent unnecessary re-renders
- **Route Guards**: Efficient route protection without blocking UI

### Bundle Impact
- **Additional Size**: ~15KB for authentication logic
- **Dependencies**: No additional external dependencies
- **Tree Shaking**: All auth utilities are tree-shakeable

## Security Considerations

### Demo Security
- **No Real Secrets**: All passwords are demo-only
- **Client-Side Only**: No real server-side authentication
- **Safe Defaults**: All demo accounts have safe, obvious credentials
- **Clear Labeling**: All demo features clearly marked

### Production Readiness Patterns
- **JWT Ready**: Context structure ready for JWT integration
- **Role-Based**: Proper RBAC foundation
- **Session Management**: Patterns ready for secure session handling
- **Error Handling**: Comprehensive error handling framework

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Keyboard Navigation**: Full keyboard access for all auth flows
- **Screen Reader**: Proper ARIA labels and form associations
- **Focus Management**: Logical focus flow and visible focus indicators
- **Color Contrast**: All text meets contrast requirements
- **Error Messaging**: Accessible error announcements

### Implementation
```typescript
// Accessible form structure
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      required
      aria-describedby={error ? "login-error" : undefined}
    />
  </div>
  
  {error && (
    <Alert variant="destructive" role="alert" id="login-error">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}
</form>
```

## Acceptance Criteria

### Core Functionality
- [ ] Login page with email/password authentication
- [ ] Demo account quick-login buttons
- [ ] Role-based user context with permissions
- [ ] Route protection for PRIMA modules
- [ ] User profile dropdown with role switching
- [ ] Session persistence across browser refreshes
- [ ] Logout functionality clearing session data

### Demo Features
- [ ] Three distinct user roles with different access levels
- [ ] Role switching functionality for RBAC demonstration
- [ ] Clear visual indicators of current user and role
- [ ] Demo account information prominently displayed
- [ ] Seamless transitions between authentication states

### Integration Ready
- [ ] Auth context ready for RTK Query integration
- [ ] User state available throughout application
- [ ] Permission checking utilities implemented
- [ ] Data access level determination
- [ ] Error handling patterns established

### Quality Standards
- [ ] All TypeScript types properly defined
- [ ] Comprehensive unit and integration tests
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] Mobile-responsive login experience
- [ ] Existing design system preserved (OKLCH tokens)
- [ ] No breaking changes to existing functionality

---

This RFC establishes the authentication foundation that all subsequent RFCs will build upon, providing user context, role-based access control, and demo-ready features while maintaining design system integrity.
