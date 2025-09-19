# Commissions Management Module

Advanced commission structure configuration and assignment management for optimizing promoter compensation and venue profitability.

## 🎯 Module Overview

### Purpose
The Commissions module enables Venue Admins to create sophisticated commission structures, assign promoters to appropriate tiers, and preview the financial impact of commission changes. This module provides the flexibility to reward high-performing promoters while maintaining profitable margins.

### Key Features
- **Tiered Commission Structure**: Create multiple commission levels with different rates and requirements
- **Smart Assignment System**: Automatically assign promoters based on performance criteria
- **Impact Preview**: Calculate margin impact before implementing commission changes
- **Performance-Based Tiers**: Dynamic tier assignment based on ongoing performance metrics
- **Revenue Protection**: Built-in safeguards to maintain venue profitability

### Business Value
- **Promoter Motivation**: Competitive commission structures attract and retain top talent
- **Performance Optimization**: Reward high performers while maintaining cost control
- **Margin Management**: Transparent view of commission impact on venue profitability
- **Scalable Growth**: Commission structures that support business expansion

## 👤 User Personas & Roles

### Venue Admin
- **Access**: Full commission structure creation, modification, and assignment control
- **Capabilities**: Set commission rates, create tiers, assign promoters, analyze impact
- **Data Visibility**: All commission data, margin calculations, and financial projections

### Venue Manager
- **Access**: Limited commission assignment and monitoring capabilities
- **Capabilities**: Assign promoters to existing tiers, monitor commission costs
- **Data Visibility**: Current commission structures and assignment status

### Venue Coordinator
- **Access**: View-only access to commission information
- **Capabilities**: View promoter commission tiers and current rates
- **Data Visibility**: Basic commission structure and promoter assignments

## 🎪 User Stories & Demo Scenarios

### Epic: Commission Structure Management

#### Story 1: Create Performance-Based Commission Tiers
**As a** Venue Admin  
**I want to** create multiple commission tiers based on promoter performance levels  
**So that** I can reward high performers while maintaining appropriate margins

**Acceptance Criteria:**
- [ ] Create commission tiers with names, rates, and qualification criteria
- [ ] Set different commission percentages for different performance levels
- [ ] Define minimum booking or revenue thresholds for each tier
- [ ] Configure automatic tier progression rules
- [ ] Set tier-specific benefits beyond just commission rates
- [ ] Preview financial impact across all current promoters
- [ ] Save and activate new commission structure

**Demo Flow:**
1. Navigate to Commissions → Tier Management
2. Create "VIP" tier: 15% commission, requires 50+ monthly bookings
3. Create "Professional" tier: 12% commission, requires 25+ monthly bookings  
4. Create "Standard" tier: 8% commission, no minimum requirements
5. Set automatic progression: 3 consecutive months at threshold = tier upgrade
6. Preview impact: Show current vs. projected commission costs
7. Activate new structure for next pay period

#### Story 2: Smart Promoter Assignment to Tiers
**As a** Venue Manager  
**I want to** automatically assign promoters to appropriate commission tiers based on their performance  
**So that** tier assignments are fair and based on objective criteria

**Acceptance Criteria:**
- [ ] View all promoters with current tier assignments
- [ ] See qualification status for each tier (qualified/not qualified/pending)
- [ ] Manually override automatic assignments when justified
- [ ] Bulk assign multiple promoters to new tiers
- [ ] Set effective dates for tier changes
- [ ] Generate assignment change notifications for affected promoters
- [ ] Maintain audit trail of all assignment changes

**Demo Flow:**
1. Navigate to Commissions → Promoter Assignments
2. View promoter list with performance metrics and current tiers
3. Identify promoter eligible for VIP tier upgrade (55 monthly bookings)
4. Apply automatic upgrade with next pay period effective date
5. Show promoter notification preview
6. Bulk assign 5 new promoters to Standard tier
7. Export assignment changes for HR communication

#### Story 3: Commission Impact Analysis
**As a** Venue Admin  
**I want to** preview the financial impact of commission changes before implementing them  
**So that** I can ensure changes align with profitability targets

**Acceptance Criteria:**
- [ ] Calculate current commission costs across all promoters
- [ ] Project commission costs under proposed new structure
- [ ] Show impact on venue margins and profitability
- [ ] Break down impact by promoter, tier, and time period
- [ ] Compare scenarios with different commission structures
- [ ] Generate executive summary for leadership review
- [ ] Export detailed financial projections

**Demo Flow:**
1. Navigate to Commissions → Impact Analysis
2. Select current commission structure as baseline
3. Load proposed new structure with higher VIP tier rates
4. Calculate impact: Current $25K/month vs. Projected $28K/month
5. Show margin impact: Revenue growth projected to offset cost increase
6. Break down by tier: VIP tier cost increase offset by new enrollments
7. Export analysis for CFO review

#### Story 4: Commission Precedence and Conflict Resolution
**As a** Venue Admin  
**I want to** define how commission structures interact with incentive programs and bonuses  
**So that** promoters understand their total compensation clearly

**Acceptance Criteria:**
- [ ] Configure commission precedence rules (base rate + bonuses vs. higher rate only)
- [ ] Handle conflicts between different commission programs
- [ ] Set caps on total commission payouts per promoter
- [ ] Define how commission interacts with incentive bonuses
- [ ] Create clear compensation calculation examples
- [ ] Validate that no configuration violates business rules
- [ ] Preview total compensation scenarios for sample promoters

**Demo Flow:**
1. Navigate to Commissions → Precedence Rules
2. Configure: "Commission tiers stack with incentive bonuses"
3. Set maximum commission cap: 20% of booking value
4. Show example: VIP promoter (15% tier + 3% bonus = 18% total)
5. Demonstrate cap enforcement: Bonus reduced to stay under 20%
6. Preview total compensation for top 10 promoters
7. Validate configuration with business rule checker

## 🏗️ Technical Architecture

### Data Models

```typescript
interface CommissionTier {
  id: string;
  venueId: string;
  name: string;
  description: string;
  
  // Commission Configuration
  commissionRate: number; // Percentage (e.g., 0.15 for 15%)
  commissionType: 'percentage' | 'fixed_amount' | 'tiered_percentage';
  
  // Qualification Criteria
  qualificationRules: {
    minimumBookings?: number;
    minimumRevenue?: number;
    minimumRating?: number;
    tenure?: number; // months
    customCriteria?: QualificationRule[];
  };
  
  // Tier Progression
  autoPromotion: {
    enabled: boolean;
    requirementPeriod: number; // months
    gracePeriod?: number; // months before demotion
  };
  
  // Benefits and Perks
  benefits: TierBenefit[];
  
  // Business Rules
  maxPromottersAllowed?: number;
  isActive: boolean;
  effectiveDate: string;
  expirationDate?: string;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface PromoterCommissionAssignment {
  id: string;
  promoterId: string;
  venueId: string;
  commissionTierId: string;
  
  // Assignment Details
  assignedAt: string;
  effectiveDate: string;
  assignedBy: string;
  assignmentReason: 'automatic' | 'manual' | 'promotion' | 'demotion';
  
  // Performance Tracking
  currentQualification: QualificationStatus;
  nextReviewDate: string;
  
  // Override Capabilities
  isOverride: boolean;
  overrideReason?: string;
  overrideExpiration?: string;
  
  // Commission Calculation
  customRate?: number; // Override tier rate if needed
  commissionCap?: number; // Individual cap if different from tier
  
  status: 'active' | 'pending' | 'suspended' | 'terminated';
}

interface CommissionCalculation {
  id: string;
  promoterId: string;
  bookingId: string;
  venueId: string;
  
  // Calculation Details
  baseCommissionRate: number;
  bookingValue: number;
  commissionAmount: number;
  
  // Adjustments
  incentiveBonuses: BonusAdjustment[];
  penaltiesOrDeductions: PenaltyAdjustment[];
  finalCommissionAmount: number;
  
  // Applied Rules
  tierUsed: string;
  rulesApplied: string[];
  capsApplied: CommissionCap[];
  
  calculatedAt: string;
  payoutPeriod: string;
  status: 'calculated' | 'approved' | 'paid' | 'disputed';
}

interface CommissionStructure {
  id: string;
  venueId: string;
  name: string;
  description: string;
  
  // Structure Configuration
  tiers: CommissionTier[];
  precedenceRules: PrecedenceRule[];
  globalSettings: {
    defaultTier: string;
    maxCommissionCap: number;
    reviewFrequency: 'monthly' | 'quarterly' | 'annually';
    gracePeriodDays: number;
  };
  
  // Analytics
  totalPromoters: number;
  averageCommissionRate: number;
  monthlyCost: number;
  
  isActive: boolean;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}
```

### API Endpoints

```typescript
// Commission Structure Management
GET    /api/venues/:venueId/commissions/structures
POST   /api/venues/:venueId/commissions/structures
GET    /api/venues/:venueId/commissions/structures/:structureId
PUT    /api/venues/:venueId/commissions/structures/:structureId
DELETE /api/venues/:venueId/commissions/structures/:structureId

// Tier Management
GET    /api/venues/:venueId/commissions/tiers
POST   /api/venues/:venueId/commissions/tiers
GET    /api/venues/:venueId/commissions/tiers/:tierId
PUT    /api/venues/:venueId/commissions/tiers/:tierId
DELETE /api/venues/:venueId/commissions/tiers/:tierId

// Promoter Assignments
GET    /api/venues/:venueId/commissions/assignments
POST   /api/venues/:venueId/commissions/assignments
PUT    /api/venues/:venueId/commissions/assignments/:assignmentId
GET    /api/venues/:venueId/commissions/promoters/:promoterId/assignment

// Assignment Operations
POST   /api/venues/:venueId/commissions/assignments/bulk
POST   /api/venues/:venueId/commissions/assignments/auto-assign
POST   /api/venues/:venueId/commissions/assignments/promote/:promoterId
POST   /api/venues/:venueId/commissions/assignments/override/:assignmentId

// Impact Analysis
GET    /api/venues/:venueId/commissions/impact/preview
POST   /api/venues/:venueId/commissions/impact/calculate
GET    /api/venues/:venueId/commissions/analytics/costs
GET    /api/venues/:venueId/commissions/analytics/performance

// Commission Calculations
GET    /api/venues/:venueId/commissions/calculations
POST   /api/venues/:venueId/commissions/calculations/recalculate
GET    /api/venues/:venueId/commissions/calculations/promoter/:promoterId
```

### RTK Query Hooks

```typescript
// Structure Management Hooks
export const useCommissionStructuresQuery = (venueId: string) => { /* ... */ };
export const useCreateCommissionStructureMutation = () => { /* ... */ };
export const useUpdateCommissionStructureMutation = () => { /* ... */ };

// Tier Management Hooks
export const useCommissionTiersQuery = (venueId: string) => { /* ... */ };
export const useCreateCommissionTierMutation = () => { /* ... */ };
export const useUpdateCommissionTierMutation = () => { /* ... */ };

// Assignment Hooks
export const usePromoterAssignmentsQuery = (venueId: string) => { /* ... */ };
export const useBulkAssignPromotersMutation = () => { /* ... */ };
export const useAutoAssignPromotersMutation = () => { /* ... */ };
export const usePromotePromoterMutation = () => { /* ... */ };

// Analytics Hooks
export const useCommissionImpactQuery = (venueId: string, scenario: CommissionScenario) => { /* ... */ };
export const useCommissionAnalyticsQuery = (venueId: string, timeRange: DateRange) => { /* ... */ };
export const useCommissionCostsQuery = (venueId: string, period: string) => { /* ... */ };
```

## 🎨 UI/UX Design Specifications

### Main Commission Dashboard

```typescript
// Route: /commissions
export default function CommissionsPage() {
  return (
    <div className="commissions-layout">
      <CommissionsHeader />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <CommissionNavigationSidebar />
        </div>
        <div className="lg:col-span-4">
          <CommissionsTabs />
        </div>
      </div>
    </div>
  );
}
```

### Component Specifications

#### CommissionTierBuilder
```typescript
interface CommissionTierBuilderProps {
  tier?: CommissionTier;
  onSave: (tier: CommissionTier) => void;
  onCancel: () => void;
  existingTiers: CommissionTier[];
}

// Features:
// - Step-by-step tier creation: Basic Info → Commission Rates → Qualification → Benefits
// - Dynamic commission rate calculator with margin impact preview
// - Qualification criteria builder with drag-and-drop rules
// - Visual tier hierarchy display
// - Rate comparison with existing tiers
// - Business rule validation (e.g., no gaps in tier progression)
```

#### PromoterAssignmentTable
```typescript
interface PromoterAssignmentTableProps {
  promoters: PromoterWithAssignment[];
  tiers: CommissionTier[];
  onAssign: (promoterId: string, tierId: string) => void;
  onBulkAssign: (promoterIds: string[], tierId: string) => void;
  sortBy: 'name' | 'tier' | 'performance' | 'qualification';
  filterBy: AssignmentFilter;
}

// Features:
// - Sortable columns: Name, Current Tier, Performance Metrics, Qualification Status
// - Visual qualification indicators (qualified/not qualified/pending)
// - Bulk selection with multi-tier assignment
// - Filter by tier, qualification status, performance level
// - Assignment preview with impact calculation
// - Export capability for HR communications
```

#### CommissionImpactCalculator
```typescript
interface CommissionImpactCalculatorProps {
  currentStructure: CommissionStructure;
  proposedStructure: CommissionStructure;
  timeframe: 'monthly' | 'quarterly' | 'annually';
  onScenarioChange: (scenario: ImpactScenario) => void;
}

// Features:
// - Side-by-side comparison of current vs. proposed structures
// - Interactive sliders for adjusting commission rates
// - Real-time cost calculation with margin impact
// - Scenario modeling with different growth assumptions
// - Break-even analysis for commission increases
// - Executive summary with key metrics and recommendations
```

#### TierQualificationWidget
```typescript
interface TierQualificationWidgetProps {
  promoterId: string;
  currentTier: CommissionTier;
  availableTiers: CommissionTier[];
  onPromote: (tierId: string) => void;
  onOverride: (tierId: string, reason: string) => void;
}

// Features:
// - Current tier status with qualification progress
// - Next tier requirements with progress indicators
// - Manual override capability with reason requirement
// - Historical tier progression timeline
// - Performance trend analysis
// - Automatic promotion eligibility alerts
```

### Mobile Responsiveness

#### Breakpoint Specifications
- **Mobile (< 768px)**: Stacked layout, simplified tier comparison
- **Tablet (768px - 1024px)**: 2-column layout, condensed assignment table
- **Desktop (> 1024px)**: Full 5-column layout with expanded analytics

#### Mobile-Specific Features
- **Swipe Navigation**: Navigate between tier configurations
- **Touch-Friendly Controls**: Large buttons for tier assignment
- **Simplified Calculator**: Key impact metrics only
- **Progressive Disclosure**: Show details on demand to reduce clutter

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('CommissionCalculator', () => {
  it('calculates commission correctly for different tier rates', () => {
    // Test tier-based commission calculations
  });
  
  it('applies commission caps correctly', () => {
    // Test cap enforcement logic
  });
  
  it('handles precedence rules for multiple bonuses', () => {
    // Test complex compensation scenarios
  });
});

describe('TierQualification', () => {
  it('determines qualification status accurately', () => {
    // Test qualification rule evaluation
  });
  
  it('handles automatic promotion correctly', () => {
    // Test auto-promotion logic
  });
});
```

### Integration Tests
```typescript
describe('Commission Assignment Flow', () => {
  it('assigns promoter to tier and updates compensation', async () => {
    // Test full assignment workflow
  });
  
  it('processes booking and calculates commission correctly', async () => {
    // Test booking event to commission calculation
  });
  
  it('generates accurate impact analysis reports', async () => {
    // Test analysis calculation accuracy
  });
});
```

### E2E Test Scenarios
```typescript
describe('Commission Management Demo Flow', () => {
  it('completes full commission structure setup and management', async () => {
    // 1. Create tiered commission structure
    // 2. Assign promoters to appropriate tiers
    // 3. Process bookings and verify commission calculations
    // 4. Analyze impact and adjust structure
    // 5. Promote qualified promoter to higher tier
  });
});
```

## 📊 Performance Requirements

### Load Time Targets
- **Commission Dashboard**: < 1.8s initial load with all tier data
- **Impact Calculator**: < 300ms for real-time rate adjustments
- **Assignment Table**: < 2s for 1000+ promoter view
- **Tier Builder**: < 400ms for form transitions

### Scalability Considerations
- **Commission Structures**: Support 20+ concurrent tier structures
- **Promoter Assignments**: Handle 5000+ promoter assignments
- **Calculation Engine**: Process 50,000+ monthly commission calculations
- **Impact Analysis**: Sub-second response for complex scenario modeling

### Caching Strategy
```typescript
// RTK Query cache configuration
const commissionsApi = createApi({
  reducerPath: 'commissionsApi',
  baseQuery: fetchBaseQuery({ /* ... */ }),
  tagTypes: ['Structure', 'Tier', 'Assignment', 'Calculation'],
  endpoints: (builder) => ({
    getStructures: builder.query({
      providesTags: ['Structure'],
      keepUnusedDataFor: 600, // 10 minutes - stable data
    }),
    getAssignments: builder.query({
      providesTags: ['Assignment'],
      keepUnusedDataFor: 300, // 5 minutes - moderately dynamic
    }),
    calculateImpact: builder.query({
      providesTags: ['Calculation'],
      keepUnusedDataFor: 60, // 1 minute - frequently changing
    }),
  }),
});
```

## 🔗 Module Integration

### Overview Dashboard Integration
- **KPI Contribution**: Average commission rate, total commission costs, tier distribution
- **Drill-Through**: Click commission metrics to open Commissions module
- **Alert System**: High-impact commission changes trigger dashboard alerts

### Promoters Module Integration
- **Profile Enhancement**: Show commission tier and qualification status in promoter profiles
- **Performance Correlation**: Link performance metrics to tier eligibility
- **Assignment History**: Display tier progression timeline in promoter details

### Finance Module Integration
- **Payout Integration**: Commission calculations feed into payout processing
- **Cost Tracking**: Commission expenses integrated into financial reporting
- **Budget Management**: Commission budgets and variance tracking

### Incentives Module Integration
- **Compensation Stacking**: Define how commission tiers interact with incentive bonuses
- **Conflict Resolution**: Handle scenarios where incentive and commission rules conflict
- **Total Compensation**: Unified view of all promoter compensation elements

## 🚀 Implementation Notes

### Phase 1: Foundation (MVP)
- [ ] Basic tier creation with percentage-based commission rates
- [ ] Manual promoter assignment to tiers
- [ ] Simple commission calculation engine
- [ ] Basic impact preview functionality

### Phase 2: Automation & Intelligence
- [ ] Automatic tier assignment based on performance criteria
- [ ] Advanced commission calculation with multiple rate types
- [ ] Comprehensive impact analysis with scenario modeling
- [ ] Integration with existing booking and payout systems

### Phase 3: Advanced Features
- [ ] Machine learning-powered tier optimization recommendations
- [ ] Dynamic commission rates based on market conditions
- [ ] Advanced conflict resolution for complex compensation scenarios
- [ ] Predictive analytics for commission cost forecasting

### Development Priorities
1. **Commission Engine**: Build robust calculation system with support for complex rules
2. **Tier Management**: Create intuitive tier configuration interface
3. **Assignment System**: Develop smart assignment logic with manual override capability
4. **Impact Analysis**: Build comprehensive scenario modeling and projection tools
5. **Integration Layer**: Connect with Promoters, Finance, and Incentives modules

### Key Technical Considerations
- **Precision**: Use decimal.js or similar for accurate financial calculations
- **Auditing**: Comprehensive audit trail for all commission changes
- **Validation**: Strong business rule validation to prevent configuration errors
- **Performance**: Efficient calculation engine for high-volume scenarios

---

The Commissions module provides sophisticated tools for managing promoter compensation while maintaining venue profitability. Focus on creating transparent, fair, and motivating commission structures that drive performance and business growth.
