# Testing Strategy

Comprehensive testing strategy for the PRIMA Partner Dashboard prototype, ensuring code quality, user experience validation, and business logic accuracy across all modules.

## 🎯 Testing Philosophy

**Primary Goal**: Deliver a reliable, bug-free prototype that accurately demonstrates PRIMA's capabilities to stakeholders.

**Quality Standards**: 
- **Unit Test Coverage**: >85% for business logic and utilities
- **Component Test Coverage**: >80% for UI components
- **Integration Test Coverage**: >90% for critical user journeys
- **E2E Test Coverage**: 100% of demo scenarios

## 🧪 Testing Pyramid

### Unit Tests (Foundation Layer)
**Purpose**: Test individual functions, utilities, and business logic
**Tools**: Jest, Testing Library
**Coverage Target**: >85%

```typescript
// Example: Pricing calculation tests
describe('Pricing Calculations', () => {
  test('calculates prime pricing correctly', () => {
    const result = calculatePrimePricing(4, {
      baseFor2: 80,
      additionalPerPerson: 30,
      platformFeePercent: 0.1
    })
    
    expect(result.total).toBe(154) // (80 + 60) * 1.1
  })
})
```

### Component Tests (Integration Layer)
**Purpose**: Test React components with realistic props and state
**Tools**: React Testing Library, Jest, MSW
**Coverage Target**: >80%

```typescript
// Example: Component interaction tests
describe('PricingForm', () => {
  test('updates preview when pricing changes', async () => {
    render(<PricingForm venueId="venue-1" />)
    
    const perDinerInput = screen.getByLabelText('Per Diner Amount')
    await user.type(perDinerInput, '30')
    
    await waitFor(() => {
      expect(screen.getByText('$120.00')).toBeInTheDocument()
    })
  })
})
```

### Integration Tests (System Layer)
**Purpose**: Test feature workflows across multiple components
**Tools**: React Testing Library, MSW, Jest
**Coverage Target**: >90% for critical paths

```typescript
// Example: Multi-component workflow
describe('Booking Management Workflow', () => {
  test('updates booking status and reflects in overview', async () => {
    render(<App />)
    
    // Navigate to bookings
    await user.click(screen.getByText('Bookings'))
    
    // Update booking status
    const confirmButton = screen.getByText('Confirm')
    await user.click(confirmButton)
    
    // Check overview reflects change
    await user.click(screen.getByText('Overview'))
    await waitFor(() => {
      expect(screen.getByText('Updated metrics')).toBeInTheDocument()
    })
  })
})
```

### End-to-End Tests (Acceptance Layer)
**Purpose**: Test complete user journeys across the entire application
**Tools**: Playwright
**Coverage Target**: 100% of demo scenarios

```typescript
// Example: Complete user journey
test('venue admin can adjust pricing and see impact', async ({ page }) => {
  await page.goto('/pricing')
  
  // Adjust prime pricing
  await page.fill('[data-testid="prime-base"]', '90')
  
  // Verify live calculation
  await expect(page.locator('[data-testid="preview-total"]')).toContainText('$162.00')
  
  // Save changes
  await page.click('[data-testid="save-pricing"]')
  
  // Verify success
  await expect(page.locator('.toast')).toContainText('Pricing updated successfully')
})
```

## 🛠️ Testing Tools & Setup

### Core Testing Stack
```json
{
  "dependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "msw": "^2.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!src/mocks/**/*',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
}
```

### Testing Library Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'
import { setupServer } from 'msw/node'
import { handlers } from '../lib/mocks/handlers'

// Setup MSW server
export const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
```

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

## 📋 Test Categories & Requirements

### Module-Specific Test Requirements

#### Overview Dashboard Tests
```typescript
describe('Overview Module', () => {
  // Unit tests
  test('calculates KPI metrics correctly')
  test('formats currency and percentages properly')
  test('determines trend directions accurately')
  
  // Component tests
  test('renders KPI cards with correct data')
  test('updates charts when venue selection changes')
  test('handles loading states gracefully')
  
  // Integration tests
  test('venue switching preserves context across navigation')
  test('drill-through links navigate to correct modules')
  test('real-time updates reflect in dashboard metrics')
})
```

#### Bookings Management Tests
```typescript
describe('Bookings Module', () => {
  // Unit tests
  test('validates booking status transitions')
  test('calculates booking totals and fees correctly')
  test('filters bookings by date range and status')
  
  // Component tests
  test('booking table displays correct data')
  test('status update modals work properly')
  test('bulk actions select correct bookings')
  
  // Integration tests
  test('booking status changes update overview metrics')
  test('no-show marking affects promoter statistics')
  test('cancellation workflow includes confirmation dialogs')
})
```

#### Pricing Configuration Tests
```typescript
describe('Pricing Module', () => {
  // Unit tests
  test('calculates prime and non-prime pricing accurately')
  test('applies platform fees correctly')
  test('validates minimum and maximum constraints')
  
  // Component tests
  test('live preview updates as pricing changes')
  test('form validation prevents invalid inputs')
  test('save/reset functionality works correctly')
  
  // Integration tests
  test('pricing changes affect booking calculations')
  test('multi-venue pricing updates work correctly')
  test('impact analysis shows accurate projections')
})
```

#### Financial Management Tests
```typescript
describe('Finance Module', () => {
  // Unit tests
  test('calculates commission amounts correctly')
  test('determines payout schedules accurately')
  test('applies hold amounts to payouts properly')
  
  // Component tests
  test('financial overview cards display correct metrics')
  test('payout approval workflow functions correctly')
  test('hold management interface works properly')
  
  // Integration tests
  test('commission calculations match booking data')
  test('payout approvals update transaction records')
  test('hold releases adjust payout amounts correctly')
})
```

#### Promoter Management Tests
```typescript
describe('Promoters Module', () => {
  // Unit tests
  test('calculates promoter performance metrics')
  test('sorts leaderboard correctly by different criteria')
  test('determines tier eligibility accurately')
  
  // Component tests
  test('leaderboard displays promoter rankings')
  test('promoter detail panels show complete information')
  test('tier assignment updates work correctly')
  
  // Integration tests
  test('promoter performance reflects booking data')
  test('commission tier changes affect calculations')
  test('promoter actions update across all modules')
})
```

### Cross-Module Integration Tests
```typescript
describe('Cross-Module Integration', () => {
  test('venue switching preserves context across all modules')
  test('booking updates propagate to overview and finance modules')
  test('pricing changes affect booking calculations and projections')
  test('promoter tier changes update commission calculations')
  test('payout approvals reflect in financial summaries')
})
```

## 🎭 Test Data Management

### Mock Data Strategy
```typescript
// Test data factories
export const createMockVenue = (overrides?: Partial<Venue>): Venue => ({
  id: 'venue-test-1',
  name: 'Test Venue',
  type: 'RESTAURANT',
  tier: 'HIGH_END',
  ...overrides,
})

export const createMockBooking = (overrides?: Partial<Booking>): Booking => ({
  id: 'booking-test-1',
  venueId: 'venue-test-1',
  diners: 4,
  status: 'CONFIRMED',
  fee: 120,
  ...overrides,
})

// Test scenarios
export const mockScenarios = {
  newVenueAdmin: {
    venues: [createMockVenue()],
    bookings: [],
    promoters: [],
  },
  
  establishedVenue: {
    venues: [createMockVenue()],
    bookings: Array.from({ length: 50 }, (_, i) => createMockBooking({ id: `booking-${i}` })),
    promoters: Array.from({ length: 10 }, (_, i) => createMockPromoter({ id: `promoter-${i}` })),
  },
  
  multiVenuePortfolio: {
    venues: Array.from({ length: 4 }, (_, i) => createMockVenue({ id: `venue-${i}` })),
    bookings: Array.from({ length: 200 }, (_, i) => createMockBooking({ id: `booking-${i}` })),
    promoters: Array.from({ length: 25 }, (_, i) => createMockPromoter({ id: `promoter-${i}` })),
  },
}
```

### Test Environment Configuration
```typescript
// Different test environments
export const testConfigs = {
  development: {
    apiDelay: 100,
    errorRate: 0,
    dataSize: 'small',
  },
  
  staging: {
    apiDelay: 300,
    errorRate: 0.05,
    dataSize: 'realistic',
  },
  
  performance: {
    apiDelay: 50,
    errorRate: 0,
    dataSize: 'large',
  },
}
```

## 🚀 Demo Scenario Testing

### Critical Demo Scenarios
Each demo scenario must have comprehensive E2E test coverage:

#### 1. Multi-Venue Portfolio Management
```typescript
test('venue admin manages multi-venue portfolio', async ({ page }) => {
  // Login as venue admin with 4 venues
  await page.goto('/login')
  await loginAsUser(page, 'venue-admin-multi')
  
  // Verify portfolio overview shows aggregated metrics
  await expect(page.locator('[data-testid="total-venues"]')).toContainText('4')
  await expect(page.locator('[data-testid="portfolio-revenue"]')).toBeVisible()
  
  // Switch between venues and verify context preservation
  await page.selectOption('[data-testid="venue-selector"]', 'venue-2')
  await expect(page.locator('[data-testid="venue-name"]')).toContainText('Prima Bistro')
  
  // Navigate to bookings and verify venue-specific data
  await page.click('[data-testid="nav-bookings"]')
  await expect(page.locator('[data-testid="bookings-title"]')).toContainText('Prima Bistro')
  
  // Return to overview and verify aggregated view
  await page.selectOption('[data-testid="venue-selector"]', 'all-venues')
  await page.click('[data-testid="nav-overview"]')
  await expect(page.locator('[data-testid="aggregated-view"]')).toBeVisible()
})
```

#### 2. Revenue Control Through Pricing
```typescript
test('venue admin adjusts pricing and sees revenue impact', async ({ page }) => {
  await page.goto('/pricing')
  
  // Note current prime base pricing
  const currentPricing = await page.locator('[data-testid="prime-base"]').inputValue()
  
  // Adjust prime pricing
  await page.fill('[data-testid="prime-base"]', '90')
  
  // Verify live preview updates
  await expect(page.locator('[data-testid="preview-4-diners"]')).toContainText('$162.00')
  
  // Check impact analysis
  await expect(page.locator('[data-testid="revenue-impact"]')).toContainText('+12.5%')
  
  // Save changes
  await page.click('[data-testid="save-pricing"]')
  await expect(page.locator('.toast-success')).toBeVisible()
  
  // Verify changes persist across page refresh
  await page.reload()
  await expect(page.locator('[data-testid="prime-base"]')).toHaveValue('90')
})
```

#### 3. Promoter Performance Management
```typescript
test('venue admin manages promoter performance and commissions', async ({ page }) => {
  await page.goto('/promoters')
  
  // Verify leaderboard displays top performers
  await expect(page.locator('[data-testid="promoter-rank-1"]')).toBeVisible()
  
  // Open top promoter details
  await page.click('[data-testid="promoter-rank-1"]')
  
  // Verify performance metrics
  await expect(page.locator('[data-testid="conversion-rate"]')).toBeVisible()
  await expect(page.locator('[data-testid="total-bookings"]')).toBeVisible()
  
  // Update commission tier
  await page.selectOption('[data-testid="commission-tier"]', 'PREMIUM')
  await page.click('[data-testid="confirm-tier-change"]')
  await expect(page.locator('.toast-success')).toBeVisible()
  
  // Verify tier change reflects in leaderboard
  await page.click('[data-testid="close-details"]')
  await expect(page.locator('[data-testid="tier-badge-premium"]')).toBeVisible()
})
```

#### 4. Financial Oversight and Payouts
```typescript
test('venue admin manages financial oversight and payouts', async ({ page }) => {
  await page.goto('/finance')
  
  // Verify financial overview metrics
  await expect(page.locator('[data-testid="total-revenue"]')).toBeVisible()
  await expect(page.locator('[data-testid="commission-expenses"]')).toBeVisible()
  
  // Check next payout details
  await expect(page.locator('[data-testid="next-payout-amount"]')).toBeVisible()
  
  // Navigate to payout management
  await page.click('[data-testid="manage-payouts"]')
  
  // Approve a payout
  await page.click('[data-testid="approve-payout-1"]')
  await page.click('[data-testid="confirm-approval"]')
  await expect(page.locator('.toast-success')).toBeVisible()
  
  // Verify payout status updated
  await expect(page.locator('[data-testid="payout-status-approved"]')).toBeVisible()
})
```

#### 5. Loss Management Through Booking Updates
```typescript
test('venue admin manages losses through booking status updates', async ({ page }) => {
  await page.goto('/bookings')
  
  // Find a confirmed booking
  const confirmedBooking = page.locator('[data-testid="booking-status-confirmed"]').first()
  await confirmedBooking.click()
  
  // Mark as no-show
  await page.click('[data-testid="mark-no-show"]')
  await page.fill('[data-testid="no-show-reason"]', 'Guest did not arrive')
  await page.click('[data-testid="confirm-no-show"]')
  
  // Verify status update
  await expect(page.locator('[data-testid="booking-status-no-show"]')).toBeVisible()
  
  // Check impact on overview metrics
  await page.click('[data-testid="nav-overview"]')
  await expect(page.locator('[data-testid="no-show-count"]')).toContainText('1')
  
  // Verify promoter metrics updated
  await page.click('[data-testid="nav-promoters"]')
  await expect(page.locator('[data-testid="updated-no-show-rate"]')).toBeVisible()
})
```

## 📊 Performance Testing

### Load Testing Requirements
```typescript
// Performance benchmarks
export const performanceBenchmarks = {
  pageLoad: {
    overview: 2000, // 2 seconds
    bookings: 3000, // 3 seconds (large datasets)
    pricing: 1500, // 1.5 seconds
    promoters: 2500, // 2.5 seconds
    finance: 2000, // 2 seconds
  },
  
  interactions: {
    venueSwitch: 500, // 500ms
    search: 300, // 300ms
    livePricing: 200, // 200ms
    sortLeaderboard: 400, // 400ms
  },
  
  apiRequests: {
    getBookings: 1000, // 1 second
    updateBooking: 500, // 500ms
    calculatePricing: 300, // 300ms
    approvePayouts: 2000, // 2 seconds
  },
}
```

### Performance Test Implementation
```typescript
// Performance monitoring
test('overview dashboard loads within performance budget', async ({ page }) => {
  const startTime = Date.now()
  
  await page.goto('/overview')
  await expect(page.locator('[data-testid="kpi-cards"]')).toBeVisible()
  
  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(performanceBenchmarks.pageLoad.overview)
})

test('venue switching completes within budget', async ({ page }) => {
  await page.goto('/overview')
  
  const startTime = Date.now()
  await page.selectOption('[data-testid="venue-selector"]', 'venue-2')
  await expect(page.locator('[data-testid="venue-specific-data"]')).toBeVisible()
  
  const switchTime = Date.now() - startTime
  expect(switchTime).toBeLessThan(performanceBenchmarks.interactions.venueSwitch)
})
```

## 🔍 Accessibility Testing

### A11y Test Requirements
```typescript
// Accessibility testing with axe-playwright
import { injectAxe, checkA11y } from 'axe-playwright'

test('overview page is accessible', async ({ page }) => {
  await page.goto('/overview')
  await injectAxe(page)
  
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true },
  })
})

// Keyboard navigation testing
test('pricing form is keyboard navigable', async ({ page }) => {
  await page.goto('/pricing')
  
  // Tab through form elements
  await page.keyboard.press('Tab')
  await expect(page.locator('[data-testid="non-prime-input"]')).toBeFocused()
  
  await page.keyboard.press('Tab')
  await expect(page.locator('[data-testid="prime-base-input"]')).toBeFocused()
  
  // Test form submission with Enter
  await page.keyboard.press('Enter')
  await expect(page.locator('.toast-success')).toBeVisible()
})
```

## 📈 Test Reporting & CI Integration

### Coverage Reporting
```typescript
// Coverage thresholds by module
const coverageTargets = {
  'src/components/overview/': { statements: 90, branches: 85 },
  'src/components/bookings/': { statements: 85, branches: 80 },
  'src/components/pricing/': { statements: 90, branches: 85 },
  'src/components/promoters/': { statements: 85, branches: 80 },
  'src/components/finance/': { statements: 90, branches: 85 },
  'src/lib/': { statements: 95, branches: 90 },
  'src/hooks/': { statements: 90, branches: 85 },
}
```

### CI Pipeline Integration
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
```

## ✅ Testing Checklist

### Pre-Development
- [ ] Test environment setup completed
- [ ] Mock data and scenarios defined
- [ ] Testing utilities and helpers created
- [ ] Performance benchmarks established

### During Development
- [ ] Unit tests written for all business logic
- [ ] Component tests cover user interactions
- [ ] Integration tests validate workflows
- [ ] Performance tests verify speed requirements

### Pre-Release
- [ ] All demo scenarios have E2E test coverage
- [ ] Accessibility requirements validated
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness tested
- [ ] Error scenarios and edge cases covered

### Quality Gates
- [ ] Code coverage thresholds met
- [ ] All tests pass in CI pipeline
- [ ] Performance benchmarks satisfied
- [ ] Accessibility standards achieved
- [ ] Manual QA approval received

---

This comprehensive testing strategy ensures the PRIMA Partner Dashboard prototype meets the highest quality standards while providing robust validation of all demo scenarios and user journeys.
