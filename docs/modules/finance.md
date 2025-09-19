# Finance & Payouts Module

The Finance module provides comprehensive financial oversight including revenue tracking, commission management, payout scheduling, and hold management for venue administrators.

## 🎯 Module Purpose

**Primary Goal**: Deliver complete financial transparency and control over venue revenue, promoter commissions, and payout processes.

**Key Value**: Clear financial reporting with automated commission calculations, payout scheduling, and hold management capabilities.

## 💰 Core Features

### Financial Overview Dashboard


1. **Revenue Summary Cards** - Total revenue, commission expenses, net profit, growth metrics
2. **Payout Overview** - Next scheduled payout, pending amounts, processing status
3. **Commission Breakdown** - Commission expenses by tier, top earning promoters
4. **Financial Trends** - Revenue and expense trends over time with forecasting


### Payout Management

1. **Payout Schedule** - Weekly/monthly payout calendar with amounts and status
2. **Payout Details** - Individual payout breakdowns with transaction lists
3. **Hold Management** - Create, manage, and release payout holds with reasons
4. **Batch Processing** - Approve multiple payouts simultaneously


### Commission Tracking

1. **Commission Summary** - Total commissions by period, tier, and promoter
2. **Rate Management** - View and modify commission rates by tier
3. **Performance Analytics** - Commission ROI and effectiveness metrics

4. **Reconciliation** - Match commissions to bookings and transactions

### Financial Reporting

1. **Revenue Reports** - Detailed revenue breakdowns by source, time, venue
2. **Commission Reports** - Commission expenses and promoter earnings
3. **Export Capabilities** - CSV/Excel exports with customizable date ranges
4. **Tax Reporting** - 1099 preparation and tax document generation


## 🎨 UI Specifications

### Layout Structure

```tsx
<div className="space-y-6">
  <FinanceHeader />
  <FinanceOverviewCards />
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <FinanceTabs />
    </div>
    <div>
      <NextPayoutCard />
      <RecentTransactionsCard />
    </div>

  </div>
</div>
```

### Financial Overview Cards

```tsx
interface FinanceOverviewProps {
  summary: FinanceSummary
  dateRange: { from: Date; to: Date }
  venueId?: string
}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
  <MetricCard
    title="Total Revenue"
    value={formatCurrency(summary.totalRevenue.current)}
    change={summary.totalRevenue.change}
    trend={summary.totalRevenue.trend}
    icon={DollarSign}
    className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
  />
  
  <MetricCard
    title="Commission Expenses"
    value={formatCurrency(summary.commissionExpenses.current)}
    change={summary.commissionExpenses.change}
    trend={summary.commissionExpenses.trend}
    icon={Users}
    className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
  />
  
  <MetricCard
    title="Net Profit"
    value={formatCurrency(summary.netProfit.current)}
    change={summary.netProfit.change}
    trend={summary.netProfit.trend}
    icon={TrendingUp}
    className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
  />
  
  <MetricCard
    title="Profit Margin"
    value={formatPercentage(summary.profitMargin.current)}
    change={summary.profitMargin.change}
    trend={summary.profitMargin.trend}
    icon={Percent}

    className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
  />
</div>
```

### Payout Management Interface

```tsx
interface PayoutManagementProps {
  payouts: Payout[]
  onPayoutAction: (payoutId: string, action: PayoutAction) => void
  onHoldCreate: (payoutId: string, hold: PayoutHoldRequest) => void
}

<Card>
  <CardHeader>
    <CardTitle>Payout Management</CardTitle>
    <CardDescription>
      Manage promoter payouts, holds, and processing
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming Payouts</TabsTrigger>
        <TabsTrigger value="processing">Processing</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="holds">Holds</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming">
        <PayoutTable 
          payouts={upcomingPayouts}
          actions={['approve', 'hold', 'edit']}
          onAction={onPayoutAction}
        />
      </TabsContent>
      
      <TabsContent value="processing">
        <PayoutTable 
          payouts={processingPayouts}
          actions={['view', 'track']}
          onAction={onPayoutAction}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <PayoutTable 
          payouts={completedPayouts}
          actions={['view', 'resend']}
          onAction={onPayoutAction}
        />
      </TabsContent>
      
      <TabsContent value="holds">
        <HoldManagementPanel 
          holds={payoutHolds}
          onHoldAction={onHoldAction}
        />

      </TabsContent>
    </Tabs>
  </CardContent>
</Card>
```

### Next Payout Summary

```tsx
interface NextPayoutCardProps {
  nextPayout: NextPayoutSummary
  onPayoutAction: (action: string) => void
}

<Card className="sticky top-6">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Calendar className="h-5 w-5" />
      Next Payout
    </CardTitle>
    <CardDescription>
      Scheduled for {formatDate(nextPayout.scheduledDate)}
    </CardDescription>
  </CardHeader>
  
  <CardContent>
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-primary">
          {formatCurrency(nextPayout.totalAmount)}
        </div>
        <div className="text-sm text-muted-foreground">
          {nextPayout.recipientCount} recipients
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Commissions</span>
          <span>{formatCurrency(nextPayout.breakdown.commissions)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Incentives</span>
          <span>{formatCurrency(nextPayout.breakdown.incentives)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Adjustments</span>
          <span>{formatCurrency(nextPayout.breakdown.adjustments)}</span>
        </div>
        <div className="flex justify-between text-sm text-destructive">
          <span>Holds</span>
          <span>-{formatCurrency(nextPayout.breakdown.holds)}</span>
        </div>
      </div>
      
      {nextPayout.holds.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Holds</h4>
            {nextPayout.holds.map(hold => (
              <div key={hold.id} className="flex justify-between text-xs">
                <span className="truncate">{hold.reason}</span>
                <span>{formatCurrency(hold.amount)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </CardContent>
  
  <CardFooter className="flex gap-2">
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => onPayoutAction('preview')}
      className="flex-1"
    >
      Preview
    </Button>
    <Button 
      size="sm" 
      onClick={() => onPayoutAction('approve')}
      className="flex-1"

    >
      Approve
    </Button>
  </CardFooter>
</Card>
```

### Responsive Design

```tsx
// Mobile layout (< 768px)
<div className="space-y-4">
  <FinanceOverviewCards className="grid-cols-2" />
  <NextPayoutCard />
  <FinanceTabs />
</div>

// Tablet layout (768px - 1024px)
<div className="space-y-6">
  <FinanceOverviewCards className="grid-cols-4" />
  <div className="space-y-6">

    <NextPayoutCard />
    <FinanceTabs />
  </div>
</div>
```

## 📈 Data Requirements

### Financial Data Models

```typescript
interface FinanceSummary {
  venueId?: string
  period: { from: Date; to: Date }
  
  revenue: {
    total: number
    prime: number
    nonPrime: number
    platform: number
    growth: number
  }
  
  commissions: {
    total: number
    paid: number
    pending: number
    held: number
    byTier: Record<CommissionTier, number>
  }
  
  profit: {
    gross: number
    net: number
    margin: number
    growth: number
  }
  
  nextPayout: NextPayoutSummary
  transactions: RecentTransaction[]
}

interface NextPayoutSummary {
  scheduledDate: Date
  totalAmount: number
  recipientCount: number
  breakdown: {
    commissions: number
    incentives: number
    adjustments: number
    holds: number
  }
  holds: PayoutHold[]
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'PROCESSING'
}

interface PayoutHold {
  id: string
  promoterId: string
  promoterName: string
  amount: number
  reason: string
  holdUntil?: Date
  createdBy: string
  createdAt: Date

}

interface PayoutAction {
  action: 'approve' | 'hold' | 'release' | 'edit' | 'cancel'
  payoutId: string
  data?: any
}
```

### Commission Calculations

```typescript
interface CommissionCalculation {
  bookingId: string
  promoterId: string
  tier: CommissionTier
  model: CommissionModel
  rate: number
  baseAmount: number
  calculatedAmount: number
  appliedAt: Date
}

interface CommissionSummary {
  period: { from: Date; to: Date }
  totalCommissions: number
  averageCommission: number
  commissionsByTier: Record<CommissionTier, {
    count: number
    total: number
    average: number
    promoters: number
  }>
  topEarners: {
    promoterId: string
    promoterName: string
    totalCommissions: number
    bookingCount: number
    averageCommission: number
  }[]

  roi: {
    commissionSpend: number
    generatedRevenue: number
    roi: number
  }
}
```

## 🔄 Interactions & Behaviors

### Payout Approval Workflow

```typescript
const usePayoutApproval = () => {
  const [approvePayouts] = useApprovePayoutsMutation()
  const [createHold] = useCreatePayoutHoldMutation()
  
  const handleBulkApproval = async (payoutIds: string[]) => {
    const confirmation = await showConfirmDialog({
      title: 'Approve Payouts',
      message: `Approve ${payoutIds.length} payouts totaling ${totalAmount}?`,
      confirmText: 'Approve All',
      variant: 'default',
    })
    
    if (!confirmation) return
    
    try {
      await approvePayouts({ payoutIds }).unwrap()
      toast.success(`Approved ${payoutIds.length} payouts`)
    } catch (error) {
      toast.error('Failed to approve payouts')
    }
  }
  
  const handlePayoutHold = async (payoutId: string) => {
    const holdData = await showHoldDialog({ payoutId })
    
    if (!holdData) return
    
    try {
      await createHold({
        payoutId,
        amount: holdData.amount,
        reason: holdData.reason,
        holdUntil: holdData.holdUntil,
      }).unwrap()
      
      toast.success('Hold created successfully')
    } catch (error) {

      toast.error('Failed to create hold')
    }
  }
  
  return {
    handleBulkApproval,
    handlePayoutHold,
  }
}
```

### Financial Metrics Calculation

```typescript
const useFinancialMetrics = (venueId?: string, dateRange?: DateRange) => {
  const { data: transactions } = useGetTransactionsQuery({
    venueId,
    from: dateRange?.from,
    to: dateRange?.to,
  })
  
  const { data: payouts } = useGetPayoutsQuery({
    venueId,
    from: dateRange?.from,
    to: dateRange?.to,
  })
  
  const metrics = useMemo(() => {
    if (!transactions || !payouts) return null
    
    const revenue = transactions
      .filter(t => t.type === 'BOOKING_FEE')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const commissions = transactions
      .filter(t => t.type === 'PROMOTER_COMMISSION')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const platformFees = transactions
      .filter(t => t.type === 'PLATFORM_FEE')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const netProfit = revenue - commissions - platformFees
    const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
    
    return {

      revenue,
      commissions,
      platformFees,
      netProfit,
      profitMargin,
    }
  }, [transactions, payouts])
  
  return metrics
}
```

### Hold Management

```typescript
const useHoldManagement = () => {
  const [releaseHold] = useReleasePayoutHoldMutation()
  const [updateHold] = useUpdatePayoutHoldMutation()
  
  const handleHoldRelease = async (holdId: string, reason?: string) => {
    const confirmation = await showConfirmDialog({
      title: 'Release Hold',
      message: 'Are you sure you want to release this hold?',
      confirmText: 'Release Hold',
    })
    
    if (!confirmation) return
    
    try {
      await releaseHold({ holdId, reason }).unwrap()
      toast.success('Hold released successfully')
    } catch (error) {
      toast.error('Failed to release hold')
    }
  }
  
  const handleHoldUpdate = async (
    holdId: string, 
    updates: Partial<PayoutHold>
  ) => {
    try {
      await updateHold({ holdId, updates }).unwrap()
      toast.success('Hold updated successfully')
    } catch (error) {

      toast.error('Failed to update hold')
    }
  }
  
  return {
    handleHoldRelease,
    handleHoldUpdate,
  }
}
```

## 📊 Financial Reporting

### Export Functionality

```typescript
interface FinanceExportOptions {
  type: 'revenue' | 'commissions' | 'payouts' | 'transactions'
  format: 'csv' | 'excel' | 'pdf'
  dateRange: { from: Date; to: Date }
  venueId?: string
  includeDetails: boolean
}

const useFinanceExport = () => {
  const [exportFinanceData] = useExportFinanceDataMutation()
  
  const handleExport = async (options: FinanceExportOptions) => {
    try {
      const result = await exportFinanceData(options).unwrap()
      
      // Download the file
      const blob = new Blob([result.data], { 
        type: result.mimeType 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url

      a.download = result.filename
      a.click()
      URL.revokeObjectURL(url)
      
      toast.success('Export completed successfully')
    } catch (error) {
      toast.error('Export failed')
    }
  }
  
  return { handleExport }
}
```

### Tax Reporting

```typescript
interface TaxReport {
  year: number
  venueId?: string
  form1099Data: {
    promoterId: string
    promoterName: string
    totalCommissions: number
    address: Address
    taxId: string
  }[]
  summary: {
    totalCommissionsPaid: number
    totalRecipients: number
    reportingThreshold: number
  }
}

const useTaxReporting = (year: number) => {
  const { data: taxReport } = useGetTaxReportQuery({ year })
  
  const generate1099s = async () => {
    try {
      const result = await generateTaxForms({ 
        year, 
        form: '1099-NEC' 
      }).unwrap()
      
      // Handle generated forms

      toast.success('1099 forms generated successfully')
    } catch (error) {
      toast.error('Failed to generate tax forms')
    }
  }
  
  return {
    taxReport,
    generate1099s,
  }
}
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
describe('Financial Calculations', () => {
  test('calculates profit margin correctly', () => {
    const revenue = 10000
    const commissions = 1500
    const platformFees = 1000
    
    const netProfit = revenue - commissions - platformFees
    const profitMargin = (netProfit / revenue) * 100
    
    expect(netProfit).toBe(7500)
    expect(profitMargin).toBe(75)
  })
  
  test('calculates commission totals by tier', () => {

    const commissions = [
      { tier: 'STANDARD', amount: 100 },
      { tier: 'STANDARD', amount: 150 },
      { tier: 'PREMIUM', amount: 200 },
      { tier: 'VIP', amount: 300 },
    ]
    
    const totals = calculateCommissionsByTier(commissions)
    
    expect(totals.STANDARD).toBe(250)
    expect(totals.PREMIUM).toBe(200)
    expect(totals.VIP).toBe(300)
  })
})
```

### Integration Tests

```typescript
describe('Finance Module Integration', () => {
  test('approves payout and updates status', async () => {
    render(<FinanceModule venueId="venue-1" />)
    
    // Find pending payout
    const payoutRow = screen.getByText('$1,250.00')
    const approveButton = within(payoutRow.closest('tr')!).getByText('Approve')
    
    await user.click(approveButton)
    
    // Confirm approval
    const confirmButton = screen.getByText('Approve All')
    await user.click(confirmButton)
    
    // Verify status update
    await waitFor(() => {
      expect(screen.getByText('Approved')).toBeInTheDocument()
    })
  })
  
  test('creates payout hold', async () => {
    render(<FinanceModule venueId="venue-1" />)
    
    // Open hold dialog
    const holdButton = screen.getByText('Hold')
    await user.click(holdButton)
    
    // Fill hold form
    const reasonInput = screen.getByLabelText('Hold Reason')
    await user.type(reasonInput, 'Dispute pending')
    

    const amountInput = screen.getByLabelText('Hold Amount')
    await user.type(amountInput, '500')
    
    // Submit hold
    const createHoldButton = screen.getByText('Create Hold')
    await user.click(createHoldButton)
    

    // Verify hold created
    await waitFor(() => {
      expect(screen.getByText('Hold created successfully')).toBeInTheDocument()
    })
  })
})

```

## 📋 Acceptance Criteria

### Core Functionality


- [ ] Financial overview cards with revenue, commission, and profit metrics
- [ ] Next payout summary with breakdown and scheduled date
- [ ] Payout table with approval, hold, and tracking capabilities
- [ ] Commission tracking with tier-based breakdowns
- [ ] Hold management with create, update, and release functions


### Data Integration

- [ ] Real-time financial calculations based on booking and transaction data
- [ ] Commission calculations match defined rate structures
- [ ] Payout amounts reconcile with transaction records
- [ ] Multi-venue financial aggregation and breakdown

### User Experience


- [ ] Intuitive payout approval workflow with bulk operations
- [ ] Clear financial metrics with trend indicators
- [ ] Responsive design for mobile and tablet viewing
- [ ] Export functionality for financial reports and tax documents


### Business Logic

- [ ] Accurate commission calculations across all tier types
- [ ] Proper hold amount deductions from payout totals
- [ ] Automated payout scheduling based on configured intervals
- [ ] Tax reporting compliance with 1099 generation


### Performance

- [ ] Financial calculations complete within 500ms
- [ ] Large transaction datasets load without performance degradation
- [ ] Export operations complete within reasonable timeframes
- [ ] Real-time updates reflect across all financial views

## 🔧 Implementation Priority

### Phase 1 (Critical - Days 11-12)

1. Financial overview cards and metrics
2. Next payout summary and details
3. Basic payout approval workflow
4. Commission tracking and calculations

### Phase 2 (Enhanced Demo Value)

5. Hold management functionality
6. Bulk payout operations
7. Financial trend analysis
8. Export capabilities

### Phase 3 (Advanced Features)

9. Tax reporting and 1099 generation
10. Advanced financial analytics
11. Automated reconciliation tools
12. Custom reporting dashboards

---

The Finance module provides essential financial oversight and control, enabling venue administrators to maintain transparency, manage cash flow, and ensure accurate promoter compensation.
