# Pricing Configuration Module

The Pricing module enables venue admins to configure Prime and Non-Prime pricing structures with live impact calculations and real-time preview of revenue changes.

## 🎯 Module Purpose

**Primary Goal**: Provide venue administrators with intuitive tools to optimize pricing strategies through real-time calculations and impact projections.

**Key Value**: Simplified revenue optimization with immediate feedback on pricing decisions across single venues or entire portfolios.

## 📊 Core Features

### Pricing Configuration Forms
1. **Non-Prime Pricing** - Per-diner base pricing with platform fee configuration
2. **Prime Pricing** - Base pricing for 2 diners plus additional per-person rates
3. **Platform Fees** - Configurable platform fee percentages for both pricing models
4. **Minimums & Limits** - Booking amount and party size constraints
5. **Discount Rules** - Optional early bird, loyalty, and group discounts

### Live Calculation Engine
1. **Scenario Preview** - Real-time examples for 2, 4, 6, 8+ person parties
2. **Impact Projection** - Monthly revenue and commission impact calculations
3. **Comparison View** - Before/after pricing comparison with percentage changes
4. **Break-even Analysis** - Platform fee break-even points and profitability metrics

### Multi-Venue Support
1. **Venue Selection** - Configure pricing for specific venues or apply portfolio-wide
2. **Template System** - Copy successful pricing strategies between venues
3. **Bulk Updates** - Apply pricing changes across multiple venues simultaneously
4. **Performance Comparison** - Compare pricing effectiveness across venue portfolio

## 🎨 UI Specifications

### Layout Structure
```tsx
<div className="space-y-8">
  <PricingHeader />
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
    <div className="xl:col-span-2">
      <PricingConfigurationPanel />
    </div>
    <div>
      <PricingPreviewPanel />
    </div>
  </div>
  <PricingImpactAnalysis />
</div>
```

### Configuration Panel Design
```tsx
interface PricingConfigurationProps {
  venueId: string
  currentPricing: VenuePricing
  onPricingChange: (pricing: VenuePricingUpdate) => void
  isLoading: boolean
}

<Card className="p-6">
  <CardHeader>
    <CardTitle>Pricing Configuration</CardTitle>
    <CardDescription>
      Configure your venue's pricing structure for both Prime and Non-Prime bookings
    </CardDescription>
  </CardHeader>
  <CardContent>
    <Tabs defaultValue="non-prime">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="non-prime">Non-Prime Pricing</TabsTrigger>
        <TabsTrigger value="prime">Prime Pricing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="non-prime">
        <NonPrimePricingForm />
      </TabsContent>
      
      <TabsContent value="prime">
        <PrimePricingForm />
      </TabsContent>
    </Tabs>
    
    <Separator className="my-6" />
    
    <PlatformFeesSection />
    <MinimumsAndLimitsSection />
    <DiscountRulesSection />
  </CardContent>
  
  <CardFooter className="flex justify-between">
    <Button variant="outline" onClick={resetToDefaults}>
      Reset to Defaults
    </Button>
    <div className="flex gap-3">
      <Button variant="outline" onClick={previewChanges}>
        Preview Impact
      </Button>
      <Button onClick={savePricing} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  </CardFooter>
</Card>
```

### Live Preview Panel
```tsx
interface PricingPreviewProps {
  pricing: VenuePricingUpdate
  examples: PricingExample[]
  isCalculating: boolean
}

<Card className="sticky top-6">
  <CardHeader>
    <CardTitle>Live Preview</CardTitle>
    <CardDescription>
      See how your pricing changes affect different party sizes
    </CardDescription>
  </CardHeader>
  <CardContent>
    {isCalculating ? (
      <div className="space-y-4">
        {[2, 4, 6, 8].map(size => (
          <Skeleton key={size} className="h-16 w-full" />
        ))}
      </div>
    ) : (
      <div className="space-y-4">
        {examples.map(example => (
          <PricingExampleCard 
            key={example.scenario}
            example={example}
            showComparison={true}
          />
        ))}
      </div>
    )}
  </CardContent>
</Card>
```

### Responsive Design
```tsx
// Mobile layout (< 768px)
<div className="space-y-6">
  <PricingHeader />
  <PricingConfigurationPanel className="w-full" />
  <PricingPreviewPanel className="w-full" />
  <PricingImpactAnalysis />
</div>

// Tablet layout (768px - 1024px)  
<div className="space-y-8">
  <PricingHeader />
  <div className="space-y-6">
    <PricingConfigurationPanel />
    <PricingPreviewPanel />
  </div>
  <PricingImpactAnalysis />
</div>
```

## 📈 Data Requirements

### Pricing Data Model
```typescript
interface VenuePricingUpdate {
  venueId: string
  nonPrime: {
    perDiner: number
    platformFeePercent: number
  }
  prime: {
    baseFor2: number
    additionalPerPerson: number
    platformFeePercent: number
  }
  minimums: {
    bookingAmount: number
    partySize: number
  }
  maximums?: {
    partySize: number
  }
  discounts?: {
    earlyBird?: number
    repeatCustomer?: number
    group?: number
  }
}

interface PricingExample {
  scenario: string
  diners: number
  type: 'PRIME' | 'NON_PRIME'
  calculation: {
    base: number
    additional: number
    subtotal: number
    platformFee: number
    total: number
  }
  comparison?: {
    previousTotal: number
    difference: number
    percentChange: number
  }
}

interface PricingImpact {
  monthlyProjection: {
    revenueChange: number
    bookingImpact: number
    commissionImpact: number
    profitabilityChange: number
  }
  breakEvenAnalysis: {
    primeBookingsNeeded: number
    revenueThreshold: number
    timeToBreakEven: string
  }
  riskAssessment: {
    priceIncrease: number
    demandElasticity: number
    competitivePosition: 'BELOW' | 'COMPETITIVE' | 'PREMIUM'
  }
}
```

### API Integration
```typescript
// Real-time calculation endpoint
const { data: examples, isLoading } = useCalculatePricingExamplesQuery({
  venueId,
  pricing: currentPricing,
  scenarios: [
    { diners: 2, type: 'PRIME' },
    { diners: 2, type: 'NON_PRIME' },
    { diners: 4, type: 'PRIME' },
    { diners: 4, type: 'NON_PRIME' },
    { diners: 6, type: 'PRIME' },
    { diners: 8, type: 'PRIME' },
  ]
}, {
  // Recalculate whenever pricing changes
  skip: !currentPricing,
  // No caching for live calculations
  refetchOnMountOrArgChange: true,
})

// Impact analysis endpoint
const { data: impact } = usePricingImpactAnalysisQuery({
  venueId,
  currentPricing,
  proposedPricing,
}, {
  skip: !proposedPricing || isEqual(currentPricing, proposedPricing),
})
```

## 🔄 Interactions & Behaviors

### Live Calculation Engine
```typescript
const useLivePricingCalculation = (initialPricing: VenuePricing) => {
  const [pricing, setPricing] = useState(initialPricing)
  const [examples, setExamples] = useState<PricingExample[]>([])
  
  // Debounce calculations to avoid excessive API calls
  const debouncedCalculation = useMemo(
    () => debounce(async (newPricing: VenuePricingUpdate) => {
      const result = await calculatePricingExamples({
        venueId: newPricing.venueId,
        pricing: newPricing,
        scenarios: DEFAULT_SCENARIOS,
      })
      setExamples(result.examples)
    }, 300),
    []
  )
  
  const updatePricing = useCallback((updates: Partial<VenuePricingUpdate>) => {
    const newPricing = { ...pricing, ...updates }
    setPricing(newPricing)
    debouncedCalculation(newPricing)
  }, [pricing, debouncedCalculation])
  
  return {
    pricing,
    examples,
    updatePricing,
    isCalculating: examples.length === 0,
  }
}
```

### Form Validation & UX
```typescript
const pricingSchema = z.object({
  nonPrime: z.object({
    perDiner: z.number().min(0.01, 'Must be at least $0.01').max(500, 'Cannot exceed $500'),
    platformFeePercent: z.number().min(0, 'Cannot be negative').max(0.3, 'Cannot exceed 30%'),
  }),
  prime: z.object({
    baseFor2: z.number().min(0.01, 'Must be at least $0.01').max(1000, 'Cannot exceed $1,000'),
    additionalPerPerson: z.number().min(0, 'Cannot be negative').max(200, 'Cannot exceed $200'),
    platformFeePercent: z.number().min(0, 'Cannot be negative').max(0.3, 'Cannot exceed 30%'),
  }),
  minimums: z.object({
    bookingAmount: z.number().min(0, 'Cannot be negative').max(1000, 'Cannot exceed $1,000'),
    partySize: z.number().min(1, 'Must be at least 1').max(50, 'Cannot exceed 50'),
  }),
})

const usePricingForm = (initialData: VenuePricing) => {
  const form = useForm<VenuePricingUpdate>({
    resolver: zodResolver(pricingSchema),
    defaultValues: initialData,
    mode: 'onChange', // Validate on every change for live feedback
  })
  
  // Auto-save draft changes to local storage
  const watchedValues = form.watch()
  useEffect(() => {
    localStorage.setItem('pricing-draft', JSON.stringify(watchedValues))
  }, [watchedValues])
  
  return form
}
```

### Multi-Venue Management
```typescript
const useMultiVenuePricing = () => {
  const [selectedVenues, setSelectedVenues] = useState<string[]>([])
  const [bulkUpdateMode, setBulkUpdateMode] = useState(false)
  
  const applyToSelectedVenues = async (pricing: VenuePricingUpdate) => {
    const promises = selectedVenues.map(venueId => 
      updateVenuePricing({ venueId, pricing })
    )
    
    const results = await Promise.allSettled(promises)
    
    // Handle partial failures
    const successful = results.filter(r => r.status === 'fulfilled').length
    const failed = results.filter(r => r.status === 'rejected').length
    
    if (failed > 0) {
      toast.error(`Updated ${successful} venues, ${failed} failed`)
    } else {
      toast.success(`Pricing updated for ${successful} venues`)
    }
  }
  
  const copyPricingBetweenVenues = async (
    sourceVenueId: string, 
    targetVenueIds: string[]
  ) => {
    const sourcePricing = await getVenuePricing(sourceVenueId)
    
    const updates = targetVenueIds.map(venueId => ({
      venueId,
      pricing: { ...sourcePricing, venueId },
    }))
    
    await Promise.all(updates.map(update => updateVenuePricing(update)))
    
    toast.success(`Copied pricing from ${sourceVenueId} to ${targetVenueIds.length} venues`)
  }
  
  return {
    selectedVenues,
    setSelectedVenues,
    bulkUpdateMode,
    setBulkUpdateMode,
    applyToSelectedVenues,
    copyPricingBetweenVenues,
  }
}
```

## ⚡ Performance Optimization

### Calculation Caching
```typescript
// Cache frequently requested calculations
const calculationCache = new Map<string, PricingExample[]>()

const getCachedExamples = (pricing: VenuePricingUpdate): PricingExample[] | null => {
  const key = JSON.stringify(pricing)
  return calculationCache.get(key) || null
}

const setCachedExamples = (pricing: VenuePricingUpdate, examples: PricingExample[]) => {
  const key = JSON.stringify(pricing)
  calculationCache.set(key, examples)
  
  // Limit cache size
  if (calculationCache.size > 100) {
    const firstKey = calculationCache.keys().next().value
    calculationCache.delete(firstKey)
  }
}
```

### Optimistic Updates
```typescript
const usePricingMutation = () => {
  const [updateVenuePricing] = useUpdateVenuePricingMutation()
  
  const optimisticUpdate = async (pricing: VenuePricingUpdate) => {
    // Immediately update the UI
    const optimisticResult = generateOptimisticExamples(pricing)
    setExamples(optimisticResult)
    
    try {
      // Perform the actual update
      const result = await updateVenuePricing(pricing).unwrap()
      
      // Update with server response
      setExamples(result.examples)
      
      toast.success('Pricing updated successfully')
    } catch (error) {
      // Revert optimistic update on error
      setExamples(previousExamples)
      toast.error('Failed to update pricing')
    }
  }
  
  return { optimisticUpdate }
}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Pricing Calculations', () => {
  test('calculates non-prime pricing correctly', () => {
    const pricing = {
      nonPrime: { perDiner: 25, platformFeePercent: 0.1 },
    }
    
    const result = calculateNonPrimePricing(4, pricing)
    
    expect(result.base).toBe(100) // 4 * $25
    expect(result.platformFee).toBe(10) // 10% of $100
    expect(result.total).toBe(110)
  })
  
  test('calculates prime pricing correctly', () => {
    const pricing = {
      prime: { 
        baseFor2: 80, 
        additionalPerPerson: 30,
        platformFeePercent: 0.1 
      },
    }
    
    const result = calculatePrimePricing(4, pricing)
    
    expect(result.base).toBe(80) // Base for 2
    expect(result.additional).toBe(60) // 2 additional * $30
    expect(result.subtotal).toBe(140)
    expect(result.platformFee).toBe(14) // 10% of $140
    expect(result.total).toBe(154)
  })
})
```

### Integration Tests
```typescript
describe('Pricing Module Integration', () => {
  test('updates pricing and recalculates examples', async () => {
    render(<PricingModule venueId="venue-1" />)
    
    // Change non-prime per-diner pricing
    const perDinerInput = screen.getByLabelText('Per Diner Amount')
    await user.type(perDinerInput, '30')
    
    // Verify live calculation updates
    await waitFor(() => {
      expect(screen.getByText('$120.00')).toBeInTheDocument() // 4 diners * $30
    })
    
    // Save changes
    const saveButton = screen.getByText('Save Changes')
    await user.click(saveButton)
    
    // Verify success message
    await waitFor(() => {
      expect(screen.getByText('Pricing updated successfully')).toBeInTheDocument()
    })
  })
})
```

## 📋 Acceptance Criteria

### Core Functionality
- [ ] Non-Prime and Prime pricing forms with validation
- [ ] Live calculation preview for 2, 4, 6, 8 person scenarios
- [ ] Platform fee configuration with percentage validation
- [ ] Minimum booking amount and party size settings
- [ ] Real-time impact analysis with revenue projections
- [ ] Save/reset functionality with confirmation dialogs

### Multi-Venue Support
- [ ] Venue selector with current venue indication
- [ ] Bulk pricing updates across multiple venues
- [ ] Copy pricing templates between venues
- [ ] Portfolio-wide pricing comparison views

### User Experience
- [ ] Form validation with helpful error messages
- [ ] Auto-save drafts to prevent data loss
- [ ] Loading states during calculations and saves
- [ ] Mobile-responsive layout with touch-friendly inputs
- [ ] Keyboard navigation support for all form elements

### Data Integration
- [ ] Changes persist across sessions and page refreshes
- [ ] Updates propagate to Overview and Finance modules within 30 seconds
- [ ] Historical pricing changes tracked for audit purposes
- [ ] Integration with commission calculations for impact analysis

### Performance
- [ ] Live calculations complete within 300ms
- [ ] Form interactions remain responsive during calculations
- [ ] Optimistic UI updates for immediate feedback
- [ ] Efficient caching of frequently calculated scenarios

## 🔧 Implementation Priority

### Phase 1 (Critical - Days 9-10)
1. Basic pricing forms with validation
2. Live calculation engine for examples
3. Save/load pricing configurations
4. Mobile-responsive layout

### Phase 2 (Enhanced Demo Value)
5. Impact analysis and projections
6. Multi-venue pricing management
7. Pricing template copying
8. Historical change tracking

### Phase 3 (Polish)
9. Advanced discount rules
10. Bulk update workflows
11. Performance optimizations
12. Comprehensive error handling

---

The Pricing module serves as a critical revenue optimization tool, providing venue administrators with the insights and controls needed to maximize profitability while maintaining competitive positioning.
