# End-to-End Testing Guide

Comprehensive guide for end-to-end testing of the PRIMA Partner Dashboard using Playwright, focusing on complete user journeys and demo scenarios validation.

## 🎯 E2E Testing Purpose

**Primary Goal**: Validate complete user journeys and ensure all demo scenarios work flawlessly for stakeholder presentations.

**Coverage Requirement**: 100% of demo scenarios must have E2E test coverage
**Browser Support**: Chrome, Firefox, Safari, Mobile Chrome

## 🛠️ Playwright Setup & Configuration

### Installation & Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.0.0"
  }
}
```

### Configuration File

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Test execution settings
  timeout: 30 * 1000, // 30 seconds per test
  expect: {
    timeout: 5 * 1000, // 5 seconds for assertions
  },
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  
  // Global test settings
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10 * 1000,
    navigationTimeout: 15 * 1000,
  },

  // Browser projects
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
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14'] },
    },
  ],

  // Development server
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

## 🎪 Demo Scenario Tests

### Demo Scenario 1: Multi-Venue Portfolio Management

```typescript
// e2e/demo-scenarios/multi-venue-portfolio.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Demo Scenario 1: Multi-Venue Portfolio Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as multi-venue admin
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@primavenues.com')
    await page.fill('[data-testid="password"]', 'demo123')
    await page.click('[data-testid="login-button"]')
    
    // Wait for dashboard to load
    await expect(page.locator('[data-testid="venue-selector"]')).toBeVisible()
  })

  test('displays portfolio overview with aggregated metrics', async ({ page }) => {
    // Verify venue selector shows all venues
    const venueSelector = page.locator('[data-testid="venue-selector"]')
    await expect(venueSelector).toContainText('All Venues')
    
    // Check aggregated KPI cards
    await expect(page.locator('[data-testid="total-revenue"]')).toContainText('$')
    await expect(page.locator('[data-testid="total-diners"]')).toContainText('diners')
    await expect(page.locator('[data-testid="total-bookings"]')).toContainText('bookings')
    
    // Verify venue breakdown chart
    await expect(page.locator('[data-testid="venue-breakdown-chart"]')).toBeVisible()
    
    // Check that all 4 venues are represented
    const venueCards = page.locator('[data-testid="venue-performance-card"]')
    await expect(venueCards).toHaveCount(4)
  })

  test('switches between venues and preserves context', async ({ page }) => {
    // Start with all venues view
    await expect(page.locator('[data-testid="venue-selector"]')).toContainText('All Venues')
    
    // Switch to specific venue
    await page.selectOption('[data-testid="venue-selector"]', 'venue-prima-downtown')
    await expect(page.locator('[data-testid="current-venue-name"]')).toContainText('Prima Downtown')
    
    // Navigate to bookings and verify venue context
    await page.click('[data-testid="nav-bookings"]')
    await expect(page.locator('[data-testid="bookings-venue-filter"]')).toContainText('Prima Downtown')
    
    // Navigate to pricing and verify context preserved
    await page.click('[data-testid="nav-pricing"]')
    await expect(page.locator('[data-testid="pricing-venue-header"]')).toContainText('Prima Downtown')
    
    // Return to overview and verify context still preserved
    await page.click('[data-testid="nav-overview"]')
    await expect(page.locator('[data-testid="current-venue-name"]')).toContainText('Prima Downtown')
  })

  test('compares performance across venues', async ({ page }) => {
    // Navigate to portfolio comparison view
    await page.click('[data-testid="portfolio-comparison"]')
    
    // Verify comparison table loads
    await expect(page.locator('[data-testid="venue-comparison-table"]')).toBeVisible()
    
    // Check that all venues are listed
    const venueRows = page.locator('[data-testid="venue-comparison-row"]')
    await expect(venueRows).toHaveCount(4)
    
    // Verify sortable columns
    await page.click('[data-testid="sort-by-revenue"]')
    await expect(page.locator('[data-testid="venue-comparison-row"]').first()).toContainText('Prima Hotel') // Highest revenue
    
    await page.click('[data-testid="sort-by-bookings"]')
    await expect(page.locator('[data-testid="venue-comparison-row"]').first()).toContainText('Prima Bistro') // Most bookings
    
    // Test filtering by venue type
    await page.selectOption('[data-testid="venue-type-filter"]', 'RESTAURANT')
    await expect(venueRows).toHaveCount(2) // Only restaurants
  })

  test('manages venue-specific vs portfolio-wide settings', async ({ page }) => {
    // Navigate to settings
    await page.click('[data-testid="nav-settings"]')
    
    // Verify venue-specific settings tab
    await page.click('[data-testid="venue-settings-tab"]')
    await expect(page.locator('[data-testid="venue-selector-settings"]')).toBeVisible()
    
    // Select specific venue for settings
    await page.selectOption('[data-testid="venue-selector-settings"]', 'venue-prima-downtown')
    await expect(page.locator('[data-testid="venue-specific-settings"]')).toBeVisible()
    
    // Verify portfolio-wide settings tab
    await page.click('[data-testid="portfolio-settings-tab"]')
    await expect(page.locator('[data-testid="portfolio-wide-settings"]')).toBeVisible()
    await expect(page.locator('[data-testid="venue-selector-settings"]')).not.toBeVisible()
  })
})
```

### Demo Scenario 2: Revenue Control Through Pricing

```typescript
// e2e/demo-scenarios/revenue-control.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Demo Scenario 2: Revenue Control Through Pricing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@primavenues.com')
    await page.fill('[data-testid="password"]', 'demo123')
    await page.click('[data-testid="login-button"]')
    
    // Navigate directly to pricing module
    await page.click('[data-testid="nav-pricing"]')
    await expect(page.locator('[data-testid="pricing-configuration"]')).toBeVisible()
  })

  test('adjusts prime pricing and sees live impact calculations', async ({ page }) => {
    // Record current prime base pricing
    const currentPricing = await page.locator('[data-testid="prime-base-for-2"]').inputValue()
    const currentValue = parseFloat(currentPricing)
    
    // Increase prime pricing by $10
    const newValue = currentValue + 10
    await page.fill('[data-testid="prime-base-for-2"]', newValue.toString())
    
    // Verify live preview updates immediately
    await expect(page.locator('[data-testid="preview-2-diners-total"]')).toContainText(`$${(newValue * 1.1).toFixed(2)}`) // With 10% platform fee
    
    // Check 4-diner calculation
    const fourDinerTotal = newValue + (2 * 30) // Base + 2 additional at $30 each
    const fourDinerWithFee = fourDinerTotal * 1.1
    await expect(page.locator('[data-testid="preview-4-diners-total"]')).toContainText(`$${fourDinerWithFee.toFixed(2)}`)
    
    // Verify impact analysis shows projected changes
    await expect(page.locator('[data-testid="revenue-impact-percentage"]')).toContainText('%')
    await expect(page.locator('[data-testid="monthly-revenue-projection"]')).toContainText('$')
  })

  test('saves pricing changes and verifies persistence', async ({ page }) => {
    // Adjust non-prime pricing
    await page.fill('[data-testid="non-prime-per-diner"]', '28')
    
    // Adjust prime pricing
    await page.fill('[data-testid="prime-base-for-2"]', '85')
    await page.fill('[data-testid="prime-additional-per-person"]', '32')
    
    // Save changes
    await page.click('[data-testid="save-pricing"]')
    
    // Verify success message
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Pricing updated successfully')
    
    // Refresh page and verify changes persist
    await page.reload()
    await expect(page.locator('[data-testid="non-prime-per-diner"]')).toHaveValue('28')
    await expect(page.locator('[data-testid="prime-base-for-2"]')).toHaveValue('85')
    await expect(page.locator('[data-testid="prime-additional-per-person"]')).toHaveValue('32')
  })

  test('demonstrates impact on overview dashboard metrics', async ({ page }) => {
    // Note current overview metrics
    await page.click('[data-testid="nav-overview"]')
    const originalRevenue = await page.locator('[data-testid="total-revenue-value"]').textContent()
    
    // Return to pricing and make significant increase
    await page.click('[data-testid="nav-pricing"]')
    await page.fill('[data-testid="prime-base-for-2"]', '100') // Significant increase
    await page.click('[data-testid="save-pricing"]')
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible()
    
    // Return to overview and verify projected impact
    await page.click('[data-testid="nav-overview"]')
    
    // Look for updated projections or indicators
    await expect(page.locator('[data-testid="revenue-projection-indicator"]')).toBeVisible()
    
    // Note: In real implementation, this might show projected impact rather than immediate change
    // since pricing changes affect future bookings
  })

  test('compares pricing across multiple venues', async ({ page }) => {
    // Switch to multi-venue pricing view
    await page.click('[data-testid="multi-venue-pricing"]')
    
    // Verify pricing comparison table
    await expect(page.locator('[data-testid="venue-pricing-comparison"]')).toBeVisible()
    
    // Check that all venues show current pricing
    const venueRows = page.locator('[data-testid="venue-pricing-row"]')
    await expect(venueRows).toHaveCount(4)
    
    // Verify copy pricing functionality
    await page.click('[data-testid="copy-pricing-from-venue-1"]')
    await page.selectOption('[data-testid="copy-to-venues"]', ['venue-2', 'venue-3'])
    await page.click('[data-testid="confirm-copy-pricing"]')
    
    // Verify success message and updated pricing
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Pricing copied successfully')
  })
})
```

### Demo Scenario 3: Promoter Performance Management

```typescript
// e2e/demo-scenarios/promoter-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Demo Scenario 3: Promoter Performance Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@primavenues.com')
    await page.fill('[data-testid="password"]', 'demo123')
    await page.click('[data-testid="login-button"]')
    
    await page.click('[data-testid="nav-promoters"]')
    await expect(page.locator('[data-testid="promoter-leaderboard"]')).toBeVisible()
  })

  test('displays promoter leaderboard with performance metrics', async ({ page }) => {
    // Verify leaderboard loads with promoters
    const promoterRows = page.locator('[data-testid="promoter-row"]')
    await expect(promoterRows).toHaveCount.greaterThan(0)
    
    // Check ranking indicators
    await expect(page.locator('[data-testid="promoter-rank-1"]')).toContainText('#1')
    
    // Verify key metrics are displayed
    await expect(page.locator('[data-testid="promoter-bookings"]').first()).toContainText('bookings')
    await expect(page.locator('[data-testid="promoter-revenue"]').first()).toContainText('$')
    await expect(page.locator('[data-testid="promoter-conversion"]').first()).toContainText('%')
    
    // Test sorting functionality
    await page.click('[data-testid="sort-by-revenue"]')
    await expect(page.locator('[data-testid="promoter-row"]').first()).toContainText('$') // Highest revenue first
    
    await page.click('[data-testid="sort-by-conversion"]')
    await expect(page.locator('[data-testid="promoter-row"]').first()).toContainText('%') // Highest conversion first
  })

  test('manages promoter commission tiers', async ({ page }) => {
    // Open top promoter details
    await page.click('[data-testid="promoter-row"]').first()
    await expect(page.locator('[data-testid="promoter-details-panel"]')).toBeVisible()
    
    // View current commission tier
    const currentTier = await page.locator('[data-testid="current-commission-tier"]').textContent()
    
    // Change commission tier
    await page.click('[data-testid="edit-commission-tier"]')
    await page.selectOption('[data-testid="commission-tier-select"]', 'PREMIUM')
    await page.click('[data-testid="confirm-tier-change"]')
    
    // Verify confirmation dialog
    await expect(page.locator('[data-testid="tier-change-confirmation"]')).toContainText('Change promoter to PREMIUM tier')
    await page.click('[data-testid="confirm-tier-change-dialog"]')
    
    // Verify success message and updated tier
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Commission tier updated successfully')
    await expect(page.locator('[data-testid="current-commission-tier"]')).toContainText('PREMIUM')
    
    // Close details and verify leaderboard reflects change
    await page.click('[data-testid="close-promoter-details"]')
    await expect(page.locator('[data-testid="tier-badge-premium"]').first()).toBeVisible()
  })

  test('analyzes promoter performance trends', async ({ page }) => {
    // Open promoter analytics
    await page.click('[data-testid="promoter-row"]').first()
    await page.click('[data-testid="performance-analytics-tab"]')
    
    // Verify performance charts load
    await expect(page.locator('[data-testid="booking-trend-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="revenue-trend-chart"]')).toBeVisible()
    await expect(page.locator('[data-testid="conversion-trend-chart"]')).toBeVisible()
    
    // Check timeframe filters
    await page.click('[data-testid="timeframe-last-3-months"]')
    await expect(page.locator('[data-testid="chart-loading"]')).toBeVisible()
    await expect(page.locator('[data-testid="chart-loading"]')).not.toBeVisible()
    
    // Verify guest acquisition metrics
    await expect(page.locator('[data-testid="new-guests-count"]')).toContainText('new guests')
    await expect(page.locator('[data-testid="repeat-guests-count"]')).toContainText('repeat guests')
    await expect(page.locator('[data-testid="guest-retention-rate"]')).toContainText('%')
  })

  test('searches and filters promoters', async ({ page }) => {
    // Test search functionality
    await page.fill('[data-testid="promoter-search"]', 'john')
    await expect(page.locator('[data-testid="promoter-row"]')).toHaveCount.greaterThan(0)
    
    // Verify search results contain "john"
    const searchResults = page.locator('[data-testid="promoter-name"]')
    const count = await searchResults.count()
    
    for (let i = 0; i < count; i++) {
      const text = await searchResults.nth(i).textContent()
      expect(text?.toLowerCase()).toContain('john')
    }
    
    // Clear search
    await page.fill('[data-testid="promoter-search"]', '')
    
    // Test tier filter
    await page.selectOption('[data-testid="tier-filter"]', 'VIP')
    const vipPromoters = page.locator('[data-testid="tier-badge-vip"]')
    const vipCount = await vipPromoters.count()
    const totalRows = await page.locator('[data-testid="promoter-row"]').count()
    expect(vipCount).toBe(totalRows)
    
    // Test status filter
    await page.selectOption('[data-testid="tier-filter"]', 'all')
    await page.selectOption('[data-testid="status-filter"]', 'ACTIVE')
    await expect(page.locator('[data-testid="promoter-row"]')).toHaveCount.greaterThan(0)
  })
})
```

### Demo Scenario 4: Financial Oversight and Payouts

```typescript
// e2e/demo-scenarios/financial-oversight.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Demo Scenario 4: Financial Oversight and Payouts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@primavenues.com')
    await page.fill('[data-testid="password"]', 'demo123')
    await page.click('[data-testid="login-button"]')
    
    await page.click('[data-testid="nav-finance"]')
    await expect(page.locator('[data-testid="financial-overview"]')).toBeVisible()
  })

  test('displays comprehensive financial overview', async ({ page }) => {
    // Verify financial KPI cards
    await expect(page.locator('[data-testid="total-revenue-card"]')).toContainText('Total Revenue')
    await expect(page.locator('[data-testid="commission-expenses-card"]')).toContainText('Commission Expenses')
    await expect(page.locator('[data-testid="net-profit-card"]')).toContainText('Net Profit')
    await expect(page.locator('[data-testid="profit-margin-card"]')).toContainText('Profit Margin')
    
    // Check that all cards show monetary values
    await expect(page.locator('[data-testid="total-revenue-value"]')).toContainText('$')
    await expect(page.locator('[data-testid="commission-expenses-value"]')).toContainText('$')
    await expect(page.locator('[data-testid="net-profit-value"]')).toContainText('$')
    await expect(page.locator('[data-testid="profit-margin-value"]')).toContainText('%')
    
    // Verify trend indicators
    await expect(page.locator('[data-testid="revenue-trend-indicator"]')).toBeVisible()
    await expect(page.locator('[data-testid="commission-trend-indicator"]')).toBeVisible()
  })

  test('manages payout approval workflow', async ({ page }) => {
    // Navigate to payout management
    await page.click('[data-testid="payout-management-tab"]')
    await expect(page.locator('[data-testid="upcoming-payouts"]')).toBeVisible()
    
    // Find pending payouts
    const pendingPayouts = page.locator('[data-testid="payout-status-pending"]')
    const pendingCount = await pendingPayouts.count()
    
    if (pendingCount > 0) {
      // Select first pending payout
      await page.click('[data-testid="payout-row"]').first()
      
      // Approve payout
      await page.click('[data-testid="approve-payout"]')
      
      // Verify approval confirmation dialog
      await expect(page.locator('[data-testid="approve-payout-dialog"]')).toContainText('Approve payout')
      await page.click('[data-testid="confirm-approve-payout"]')
      
      // Verify success message
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Payout approved successfully')
      
      // Verify status change
      await expect(page.locator('[data-testid="payout-status-approved"]')).toBeVisible()
    }
  })

  test('creates and manages payout holds', async ({ page }) => {
    await page.click('[data-testid="payout-management-tab"]')
    
    // Find a payout to put on hold
    const payoutRow = page.locator('[data-testid="payout-row"]').first()
    await payoutRow.click()
    
    // Create hold
    await page.click('[data-testid="create-hold"]')
    
    // Fill hold details
    await page.fill('[data-testid="hold-reason"]', 'Disputed transaction under review')
    await page.fill('[data-testid="hold-amount"]', '150.00')
    await page.click('[data-testid="hold-until-date"]')
    
    // Select future date (next week)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    await page.fill('[data-testid="hold-until-date"]', nextWeek.toISOString().split('T')[0])
    
    // Create hold
    await page.click('[data-testid="confirm-create-hold"]')
    
    // Verify success and hold applied
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Hold created successfully')
    await expect(page.locator('[data-testid="hold-amount-indicator"]')).toContainText('$150.00')
    
    // Navigate to holds management
    await page.click('[data-testid="holds-tab"]')
    await expect(page.locator('[data-testid="hold-entry"]')).toContainText('Disputed transaction under review')
  })

  test('exports financial reports', async ({ page }) => {
    // Test export functionality
    await page.click('[data-testid="export-reports"]')
    
    // Configure export options
    await page.selectOption('[data-testid="export-type"]', 'revenue')
    await page.selectOption('[data-testid="export-format"]', 'csv')
    await page.selectOption('[data-testid="date-range"]', 'last-30-days')
    
    // Start export
    const downloadPromise = page.waitForEvent('download')
    await page.click('[data-testid="start-export"]')
    
    // Verify download starts
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/revenue.*\.csv/)
    
    // Verify success message
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Export completed successfully')
  })

  test('analyzes commission breakdown by tier', async ({ page }) => {
    // Navigate to commission analysis
    await page.click('[data-testid="commission-analysis-tab"]')
    
    // Verify commission breakdown chart
    await expect(page.locator('[data-testid="commission-by-tier-chart"]')).toBeVisible()
    
    // Check tier breakdown data
    await expect(page.locator('[data-testid="standard-tier-commissions"]')).toContainText('$')
    await expect(page.locator('[data-testid="premium-tier-commissions"]')).toContainText('$')
    await expect(page.locator('[data-testid="vip-tier-commissions"]')).toContainText('$')
    
    // Verify top earners section
    await expect(page.locator('[data-testid="top-commission-earners"]')).toBeVisible()
    const topEarners = page.locator('[data-testid="top-earner-row"]')
    await expect(topEarners).toHaveCount.greaterThan(0)
    
    // Test time period filter
    await page.selectOption('[data-testid="commission-period"]', 'last-quarter')
    await expect(page.locator('[data-testid="chart-loading"]')).toBeVisible()
    await expect(page.locator('[data-testid="chart-loading"]')).not.toBeVisible()
  })
})
```

### Demo Scenario 5: Loss Management Through Booking Updates

```typescript
// e2e/demo-scenarios/loss-management.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Demo Scenario 5: Loss Management Through Booking Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@primavenues.com')
    await page.fill('[data-testid="password"]', 'demo123')
    await page.click('[data-testid="login-button"]')
    
    await page.click('[data-testid="nav-bookings"]')
    await expect(page.locator('[data-testid="bookings-table"]')).toBeVisible()
  })

  test('marks confirmed booking as no-show and tracks impact', async ({ page }) => {
    // Find a confirmed booking
    const confirmedBooking = page.locator('[data-testid="booking-status-confirmed"]').first()
    await expect(confirmedBooking).toBeVisible()
    
    // Get booking details before change
    const bookingRow = confirmedBooking.locator('..') // Parent row
    const originalRevenue = await bookingRow.locator('[data-testid="booking-fee"]').textContent()
    const promoterName = await bookingRow.locator('[data-testid="promoter-name"]').textContent()
    
    // Open booking actions
    await bookingRow.click()
    await page.click('[data-testid="mark-no-show"]')
    
    // Fill no-show form
    await page.fill('[data-testid="no-show-reason"]', 'Guest did not arrive, no communication')
    await page.fill('[data-testid="no-show-notes"]', 'Attempted to contact guest via phone with no response')
    
    // Confirm no-show
    await page.click('[data-testid="confirm-no-show"]')
    
    // Verify confirmation dialog
    await expect(page.locator('[data-testid="no-show-confirmation"]')).toContainText('Mark as No-Show')
    await page.click('[data-testid="confirm-no-show-dialog"]')
    
    // Verify status change
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Booking marked as no-show')
    await expect(bookingRow.locator('[data-testid="booking-status"]')).toContainText('NO_SHOW')
    
    // Verify revenue impact indicator
    await expect(bookingRow.locator('[data-testid="revenue-lost-indicator"]')).toBeVisible()
  })

  test('cancels booking and processes refund', async ({ page }) => {
    // Find a confirmed booking for cancellation
    const confirmedBooking = page.locator('[data-testid="booking-status-confirmed"]').first()
    const bookingRow = confirmedBooking.locator('..')
    
    // Initiate cancellation
    await bookingRow.click()
    await page.click('[data-testid="cancel-booking"]')
    
    // Select cancellation reason
    await page.selectOption('[data-testid="cancellation-reason"]', 'guest-request')
    await page.fill('[data-testid="cancellation-notes"]', 'Guest requested cancellation due to illness')
    
    // Configure refund
    await page.check('[data-testid="process-refund"]')
    await page.selectOption('[data-testid="refund-amount"]', 'full')
    
    // Confirm cancellation
    await page.click('[data-testid="confirm-cancellation"]')
    
    // Verify cancellation processed
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Booking cancelled successfully')
    await expect(bookingRow.locator('[data-testid="booking-status"]')).toContainText('CANCELLED')
    
    // Verify refund indicator
    await expect(bookingRow.locator('[data-testid="refund-processed-indicator"]')).toBeVisible()
  })

  test('verifies impact on overview dashboard metrics', async ({ page }) => {
    // Record initial metrics
    await page.click('[data-testid="nav-overview"]')
    const initialBookings = await page.locator('[data-testid="total-bookings-value"]').textContent()
    const initialRevenue = await page.locator('[data-testid="total-revenue-value"]').textContent()
    const initialNoShows = await page.locator('[data-testid="no-show-count"]').textContent()
    
    // Return to bookings and mark one as no-show
    await page.click('[data-testid="nav-bookings"]')
    const confirmedBooking = page.locator('[data-testid="booking-status-confirmed"]').first()
    const bookingRow = confirmedBooking.locator('..')
    
    await bookingRow.click()
    await page.click('[data-testid="mark-no-show"]')
    await page.fill('[data-testid="no-show-reason"]', 'Guest no-show')
    await page.click('[data-testid="confirm-no-show"]')
    await page.click('[data-testid="confirm-no-show-dialog"]')
    
    // Return to overview and verify updated metrics
    await page.click('[data-testid="nav-overview"]')
    
    // Wait for metrics to update (may take a moment)
    await page.waitForTimeout(2000)
    
    // Verify no-show count increased
    const updatedNoShows = await page.locator('[data-testid="no-show-count"]').textContent()
    expect(parseInt(updatedNoShows || '0')).toBeGreaterThan(parseInt(initialNoShows || '0'))
    
    // Verify revenue impact or indicator
    await expect(page.locator('[data-testid="revenue-change-indicator"]')).toBeVisible()
  })

  test('tracks promoter performance impact from booking changes', async ({ page }) => {
    // Find booking with promoter
    const promoterBooking = page.locator('[data-testid="promoter-booking"]').first()
    const promoterName = await promoterBooking.locator('[data-testid="promoter-name"]').textContent()
    
    // Mark booking as no-show
    await promoterBooking.click()
    await page.click('[data-testid="mark-no-show"]')
    await page.fill('[data-testid="no-show-reason"]', 'Guest no-show')
    await page.click('[data-testid="confirm-no-show"]')
    await page.click('[data-testid="confirm-no-show-dialog"]')
    
    // Navigate to promoters and verify impact
    await page.click('[data-testid="nav-promoters"]')
    
    // Find the affected promoter
    await page.fill('[data-testid="promoter-search"]', promoterName || '')
    const promoterRow = page.locator('[data-testid="promoter-row"]').first()
    
    // Open promoter details
    await promoterRow.click()
    
    // Verify no-show rate updated
    await expect(page.locator('[data-testid="no-show-rate"]')).toBeVisible()
    await expect(page.locator('[data-testid="recent-activity"]')).toContainText('no-show')
    
    // Check performance trend impact
    await page.click('[data-testid="performance-analytics-tab"]')
    await expect(page.locator('[data-testid="performance-alert"]')).toBeVisible()
  })

  test('bulk updates booking statuses', async ({ page }) => {
    // Select multiple confirmed bookings
    const checkboxes = page.locator('[data-testid="booking-checkbox"]')
    await checkboxes.nth(0).check()
    await checkboxes.nth(1).check()
    await checkboxes.nth(2).check()
    
    // Verify bulk actions appear
    await expect(page.locator('[data-testid="bulk-actions"]')).toBeVisible()
    await expect(page.locator('[data-testid="selected-count"]')).toContainText('3 selected')
    
    // Perform bulk no-show marking
    await page.click('[data-testid="bulk-mark-no-show"]')
    await page.fill('[data-testid="bulk-no-show-reason"]', 'Mass no-show event')
    await page.click('[data-testid="confirm-bulk-no-show"]')
    
    // Verify bulk operation success
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('3 bookings marked as no-show')
    
    // Verify all selected bookings now show no-show status
    const updatedRows = page.locator('[data-testid="booking-status-no-show"]')
    await expect(updatedRows).toHaveCount.greaterThanOrEqual(3)
  })
})
```

## 🔧 Test Utilities & Helpers

### Authentication Helper

```typescript
// e2e/utils/auth.ts
import { Page } from '@playwright/test'

export async function loginAsUser(page: Page, userType: 'venue-admin' | 'manager' | 'coordinator') {
  const credentials = {
    'venue-admin': { email: 'admin@primavenues.com', password: 'demo123' },
    'manager': { email: 'manager@primavenues.com', password: 'demo123' },
    'coordinator': { email: 'coordinator@primavenues.com', password: 'demo123' },
  }

  const { email, password } = credentials[userType]

  await page.goto('/login')
  await page.fill('[data-testid="email"]', email)
  await page.fill('[data-testid="password"]', password)
  await page.click('[data-testid="login-button"]')
  
  // Wait for redirect to dashboard
  await page.waitForURL('/overview')
}

export async function logout(page: Page) {
  await page.click('[data-testid="user-menu"]')
  await page.click('[data-testid="logout"]')
  await page.waitForURL('/login')
}
```

### Data Setup Helpers

```typescript
// e2e/utils/data-setup.ts
import { Page } from '@playwright/test'

export async function setupTestScenario(page: Page, scenario: 'empty' | 'basic' | 'comprehensive') {
  await page.goto('/test-setup')
  await page.selectOption('[data-testid="scenario-selector"]', scenario)
  await page.click('[data-testid="load-scenario"]')
  await page.waitForSelector('[data-testid="scenario-loaded"]')
}

export async function createTestBooking(page: Page, options: {
  venue?: string
  promoter?: string
  diners?: number
  status?: string
}) {
  await page.goto('/bookings/create-test')
  
  if (options.venue) {
    await page.selectOption('[data-testid="venue-select"]', options.venue)
  }
  
  if (options.promoter) {
    await page.selectOption('[data-testid="promoter-select"]', options.promoter)
  }
  
  if (options.diners) {
    await page.fill('[data-testid="diners-input"]', options.diners.toString())
  }
  
  if (options.status) {
    await page.selectOption('[data-testid="status-select"]', options.status)
  }
  
  await page.click('[data-testid="create-booking"]')
  await page.waitForSelector('[data-testid="booking-created"]')
}
```

### Navigation Helpers

```typescript
// e2e/utils/navigation.ts
import { Page, expect } from '@playwright/test'

export async function navigateToModule(page: Page, module: string) {
  await page.click(`[data-testid="nav-${module}"]`)
  await expect(page.locator(`[data-testid="${module}-page"]`)).toBeVisible()
}

export async function switchVenue(page: Page, venueId: string) {
  await page.selectOption('[data-testid="venue-selector"]', venueId)
  await page.waitForSelector('[data-testid="venue-context-updated"]')
}

export async function waitForDataLoad(page: Page) {
  // Wait for loading indicators to disappear
  await page.waitForSelector('[data-testid="loading"]', { state: 'hidden' })
  await page.waitForSelector('[data-testid="skeleton"]', { state: 'hidden' })
}
```

## 📊 Performance & Accessibility Testing

### Performance Tests

```typescript
// e2e/performance/core-vitals.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Core Web Vitals', () => {
  test('overview page meets performance budgets', async ({ page }) => {
    // Navigate to overview
    const startTime = Date.now()
    await page.goto('/overview')
    
    // Wait for content to load
    await expect(page.locator('[data-testid="kpi-cards"]')).toBeVisible()
    const loadTime = Date.now() - startTime
    
    // Performance budget: 2 seconds
    expect(loadTime).toBeLessThan(2000)
    
    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    expect(lcp).toBeLessThan(2500) // 2.5 seconds LCP budget
  })
})
```

### Accessibility Tests

```typescript
// e2e/accessibility/a11y.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('overview page is accessible', async ({ page }) => {
    await page.goto('/overview')
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
  
  test('pricing form is keyboard navigable', async ({ page }) => {
    await page.goto('/pricing')
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="non-prime-per-diner"]')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="prime-base-for-2"]')).toBeFocused()
    
    // Test form submission with Enter
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-testid="save-pricing"]')).toBeFocused()
  })
})
```

## ✅ E2E Testing Checklist

### Setup & Configuration

- [ ] Playwright installed and configured
- [ ] Test data scenarios defined
- [ ] Authentication helpers implemented
- [ ] Navigation utilities created

### Demo Scenario Coverage

- [ ] Multi-venue portfolio management
- [ ] Revenue control through pricing
- [ ] Promoter performance management
- [ ] Financial oversight and payouts
- [ ] Loss management through booking updates

### Cross-Browser Testing

- [ ] Chrome/Chromium tests passing
- [ ] Firefox tests passing
- [ ] Safari/WebKit tests passing
- [ ] Mobile Chrome tests passing
- [ ] Mobile Safari tests passing

### Performance & Accessibility

- [ ] Core Web Vitals within budgets
- [ ] Accessibility compliance verified
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility

### CI/CD Integration

- [ ] Tests run in CI pipeline
- [ ] Test reports generated
- [ ] Failed test artifacts captured
- [ ] Performance monitoring active

---

This E2E testing guide ensures comprehensive validation of all demo scenarios and user journeys, providing confidence that the PRIMA Partner Dashboard will perform flawlessly during stakeholder presentations.
