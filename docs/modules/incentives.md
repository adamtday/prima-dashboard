# Incentives Programs Module

Comprehensive incentive program management for motivating promoters and driving performance through structured reward systems.

## 🎯 Module Overview

### Purpose
The Incentives module enables Venue Admins to create, manage, and track incentive programs that motivate promoters to achieve specific performance goals. This module supports various incentive types including booking quotas, revenue targets, and special event bonuses.

### Key Features
- **Program Creation**: Design flexible incentive programs with multiple reward structures
- **Progress Tracking**: Real-time monitoring of promoter progress toward goals
- **Auto-Awarding**: Automated bonus distribution when goals are achieved
- **Historical Analytics**: Performance analysis and program effectiveness tracking
- **Template Library**: Pre-built incentive program templates for quick setup

### Business Value
- **Performance Motivation**: Drive promoter engagement through clear reward structures
- **Revenue Growth**: Align promoter incentives with venue revenue goals
- **Retention**: Keep top-performing promoters engaged with competitive programs
- **Scalability**: Manage incentive programs across multiple promoters efficiently

## 👤 User Personas & Roles

### Venue Admin
- **Access**: Full CRUD operations on incentive programs
- **Capabilities**: Create programs, set budgets, approve bonuses, analyze performance
- **Data Visibility**: All promoter performance data and program metrics

### Venue Manager  
- **Access**: View and limited edit operations
- **Capabilities**: Monitor program progress, approve standard bonuses
- **Data Visibility**: Program summaries and team performance data

### Venue Coordinator
- **Access**: View-only access to active programs
- **Capabilities**: Track promoter progress, view upcoming bonuses
- **Data Visibility**: Active program status and individual performance

## 🎪 User Stories & Demo Scenarios

### Epic: Incentive Program Management

#### Story 1: Create Monthly Booking Bonus Program
**As a** Venue Admin  
**I want to** create a monthly booking bonus program for my top promoters  
**So that** I can motivate increased booking activity during slow periods

**Acceptance Criteria:**
- [ ] Create new incentive program with name, description, and duration
- [ ] Set booking quantity thresholds (e.g., 20 bookings = $500 bonus)
- [ ] Define eligibility criteria (e.g., promoter tier, minimum history)
- [ ] Set program budget and individual bonus limits
- [ ] Choose between individual and team-based goals
- [ ] Schedule program activation and end dates
- [ ] Preview bonus calculation examples before activation

**Demo Flow:**
1. Navigate to Incentives → Create Program
2. Select "Monthly Booking Bonus" template
3. Configure thresholds: 15 bookings = $300, 25 bookings = $500
4. Set eligibility: VIP tier promoters only
5. Set budget: $5,000 total program budget
6. Preview: Show example calculations for sample promoter
7. Activate program for current month

#### Story 2: Track Promoter Progress Toward Goals
**As a** Venue Manager  
**I want to** monitor promoter progress toward incentive goals in real-time  
**So that** I can provide coaching and encouragement to help them succeed

**Acceptance Criteria:**
- [ ] View active programs dashboard with enrollment counts
- [ ] See individual promoter progress bars and current standings
- [ ] Filter by program type, promoter tier, or completion status
- [ ] Receive notifications when promoters reach milestones
- [ ] Access detailed progress breakdown with timestamps
- [ ] Export progress reports for sharing with promoters
- [ ] View projected bonus amounts based on current performance

**Demo Flow:**
1. Navigate to Incentives → Active Programs
2. Select "Monthly Booking Bonus" program
3. View promoter leaderboard with progress bars
4. Click on promoter to see detailed breakdown
5. Show real-time update as mock booking is added
6. Export progress report for team meeting

#### Story 3: Automated Bonus Award Processing
**As a** Venue Admin  
**I want** bonuses to be automatically calculated and awarded when goals are met  
**So that** promoters receive timely recognition without manual processing delays

**Acceptance Criteria:**
- [ ] System automatically detects when promoter reaches goal
- [ ] Bonus amount calculated based on program rules
- [ ] Automatic notification sent to promoter about bonus earned
- [ ] Bonus added to next scheduled payout automatically
- [ ] Admin notification sent for high-value bonus awards
- [ ] Audit trail created for all automatic bonus awards
- [ ] Manual override capability for exceptional circumstances

**Demo Flow:**
1. Monitor active program with promoter at 24/25 bookings
2. Process one more booking to trigger 25-booking bonus
3. Show automatic bonus calculation and award
4. Display notification sent to promoter
5. Verify bonus appears in Finance module payout queue
6. Show audit log entry for the automatic award

#### Story 4: Program Performance Analytics
**As a** Venue Admin  
**I want to** analyze the effectiveness of my incentive programs  
**So that** I can optimize future programs for better ROI

**Acceptance Criteria:**
- [ ] View program performance dashboard with key metrics
- [ ] Compare program ROI: bonus costs vs. additional revenue generated
- [ ] Analyze participation rates and completion percentages
- [ ] Track promoter performance before, during, and after programs
- [ ] Generate comparative reports across multiple programs
- [ ] Identify most effective program types and structures
- [ ] Export comprehensive analytics for leadership review

**Demo Flow:**
1. Navigate to Incentives → Analytics
2. Select completed "Q1 Booking Bonus" program
3. Show ROI calculation: $15K bonuses vs. $85K additional revenue
4. Display participation rate: 85% of eligible promoters enrolled
5. Show completion rate: 60% achieved at least one bonus tier
6. Compare with previous quarter's program performance

## 🏗️ Technical Architecture

### Data Models

```typescript
interface IncentiveProgram {
  id: string;
  venueId: string;
  name: string;
  description: string;
  type: 'booking_quota' | 'revenue_target' | 'event_bonus' | 'team_challenge';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  
  // Program Configuration
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  
  // Eligibility
  eligibilityRules: {
    promoterTiers: PromoterTier[];
    minimumBookings?: number;
    minimumRevenue?: number;
    venueRestrictions?: string[];
  };
  
  // Reward Structure
  tiers: IncentiveTier[];
  
  // Analytics
  enrollment: number;
  totalAwarded: number;
  performance: ProgramPerformance;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface IncentiveTier {
  id: string;
  name: string;
  requirement: {
    metric: 'bookings' | 'revenue' | 'events' | 'custom';
    threshold: number;
    period: 'daily' | 'weekly' | 'monthly' | 'program_duration';
  };
  reward: {
    type: 'fixed_bonus' | 'percentage' | 'tiered_bonus';
    amount: number;
    cap?: number;
  };
  isRepeatable: boolean;
}

interface PromoterIncentive {
  id: string;
  programId: string;
  promoterId: string;
  venueId: string;
  
  // Enrollment
  enrolledAt: string;
  status: 'enrolled' | 'progressing' | 'achieved' | 'dropped_out';
  
  // Progress Tracking
  currentProgress: {
    metric: string;
    current: number;
    target: number;
    percentage: number;
    lastUpdated: string;
  };
  
  // Achievements
  tiersAchieved: AchievedTier[];
  totalEarned: number;
  
  // Analytics
  progressHistory: ProgressSnapshot[];
  performanceImpact: PerformanceImpact;
}

interface AchievedTier {
  tierId: string;
  achievedAt: string;
  bonusAmount: number;
  status: 'pending' | 'approved' | 'paid';
  payoutId?: string;
}
```

### API Endpoints

```typescript
// Program Management
GET    /api/venues/:venueId/incentives/programs
POST   /api/venues/:venueId/incentives/programs
GET    /api/venues/:venueId/incentives/programs/:programId
PUT    /api/venues/:venueId/incentives/programs/:programId
DELETE /api/venues/:venueId/incentives/programs/:programId

// Program Operations
POST   /api/venues/:venueId/incentives/programs/:programId/activate
POST   /api/venues/:venueId/incentives/programs/:programId/pause
POST   /api/venues/:venueId/incentives/programs/:programId/complete

// Promoter Enrollment
GET    /api/venues/:venueId/incentives/programs/:programId/enrollments
POST   /api/venues/:venueId/incentives/programs/:programId/enrollments
DELETE /api/venues/:venueId/incentives/programs/:programId/enrollments/:promoterId

// Progress Tracking
GET    /api/venues/:venueId/incentives/promoters/:promoterId/progress
POST   /api/venues/:venueId/incentives/progress/update

// Analytics
GET    /api/venues/:venueId/incentives/analytics/programs
GET    /api/venues/:venueId/incentives/analytics/promoters
GET    /api/venues/:venueId/incentives/analytics/roi
```

### RTK Query Hooks

```typescript
// Program Management Hooks
export const useIncentiveProgramsQuery = (venueId: string) => { /* ... */ };
export const useCreateIncentiveProgramMutation = () => { /* ... */ };
export const useUpdateIncentiveProgramMutation = () => { /* ... */ };
export const useActivateIncentiveProgramMutation = () => { /* ... */ };

// Progress Tracking Hooks
export const usePromoterProgressQuery = (venueId: string, promoterId: string) => { /* ... */ };
export const useUpdateProgressMutation = () => { /* ... */ };
export const useProgramEnrollmentsQuery = (venueId: string, programId: string) => { /* ... */ };

// Analytics Hooks
export const useIncentiveAnalyticsQuery = (venueId: string, timeRange?: DateRange) => { /* ... */ };
export const useProgramROIQuery = (venueId: string, programId: string) => { /* ... */ };
```

## 🎨 UI/UX Design Specifications

### Main Dashboard Layout

```typescript
// Route: /incentives
export default function IncentivesPage() {
  return (
    <div className="incentives-layout">
      <IncentivesHeader />
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProgramFilterSidebar />
        </div>
        <div className="lg:col-span-3">
          <IncentivesTabs />
        </div>
      </div>
    </div>
  );
}
```

### Component Specifications

#### IncentiveProgramCard
```typescript
interface IncentiveProgramCardProps {
  program: IncentiveProgram;
  onEdit: (program: IncentiveProgram) => void;
  onViewProgress: (programId: string) => void;
  onAnalytics: (programId: string) => void;
}

// Features:
// - Program status badge with color coding
// - Quick stats: enrollment, completion rate, budget utilization
// - Progress indicator for program timeline
// - Action buttons: Edit, View Progress, Analytics
// - Responsive card layout with mobile optimization
```

#### PromoterProgressTable
```typescript
interface PromoterProgressTableProps {
  programId: string;
  promoters: PromoterIncentive[];
  onPromoterClick: (promoterId: string) => void;
  sortBy: 'progress' | 'earned' | 'name' | 'tier';
  filterBy: ProgressFilter;
}

// Features:
// - Sortable columns: Name, Progress, Earned, Tier, Status
// - Progress bars with percentage and visual indicators
// - Filter by completion status, tier, progress range
// - Real-time updates when progress changes
// - Export functionality for sharing reports
```

#### IncentiveProgramBuilder
```typescript
interface IncentiveProgramBuilderProps {
  program?: IncentiveProgram;
  onSave: (program: IncentiveProgram) => void;
  onCancel: () => void;
  templates: ProgramTemplate[];
}

// Features:
// - Step-by-step wizard: Basic Info → Eligibility → Tiers → Preview
// - Template selection with pre-filled common programs
// - Dynamic tier configuration with drag-and-drop reordering
// - Budget calculator with ROI projections
// - Validation with clear error messaging
// - Preview mode showing example calculations
```

### Mobile Responsiveness

#### Breakpoint Specifications
- **Mobile (< 768px)**: Stacked card layout, simplified navigation
- **Tablet (768px - 1024px)**: 2-column grid, collapsible sidebar
- **Desktop (> 1024px)**: Full 4-column layout with expanded features

#### Mobile-Specific Features
- **Swipe Actions**: Quick actions on program cards
- **Bottom Sheet Navigation**: Mobile-friendly program creation flow
- **Touch-Optimized Progress Bars**: Larger touch targets for interaction
- **Simplified Analytics**: Key metrics only, with option to expand

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('IncentiveProgram', () => {
  it('calculates bonus correctly for booking quota program', () => {
    // Test tier-based bonus calculations
  });
  
  it('validates eligibility rules correctly', () => {
    // Test promoter eligibility checking
  });
  
  it('handles budget constraints properly', () => {
    // Test budget limit enforcement
  });
});

describe('PromoterProgress', () => {
  it('updates progress accurately when bookings change', () => {
    // Test real-time progress updates
  });
  
  it('triggers bonus awards at correct thresholds', () => {
    // Test automatic bonus awarding
  });
});
```

### Integration Tests
```typescript
describe('Incentives API Integration', () => {
  it('creates program and enrolls promoters successfully', async () => {
    // Test full program creation and enrollment flow
  });
  
  it('processes booking events and updates progress', async () => {
    // Test event-driven progress updates
  });
  
  it('generates accurate analytics reports', async () => {
    // Test analytics calculation accuracy
  });
});
```

### E2E Test Scenarios
```typescript
describe('Incentive Program Demo Flow', () => {
  it('completes full program creation and management cycle', async () => {
    // 1. Create monthly booking bonus program
    // 2. Enroll promoters and track progress
    // 3. Process bookings to trigger bonuses
    // 4. Verify automatic awards and notifications
    // 5. Generate and export analytics report
  });
});
```

## 📊 Performance Requirements

### Load Time Targets
- **Program Dashboard**: < 1.5s initial load
- **Progress Updates**: < 200ms real-time updates
- **Analytics Report**: < 3s complex calculations
- **Program Creation**: < 500ms form transitions

### Scalability Considerations
- **Concurrent Programs**: Support 50+ active programs per venue
- **Promoter Enrollment**: Handle 1000+ promoters per program
- **Progress Updates**: Process 10,000+ daily progress events
- **Analytics Queries**: Sub-second response for 12-month data ranges

### Caching Strategy
```typescript
// RTK Query cache configuration
const incentivesApi = createApi({
  reducerPath: 'incentivesApi',
  baseQuery: fetchBaseQuery({ /* ... */ }),
  tagTypes: ['Program', 'Progress', 'Analytics'],
  endpoints: (builder) => ({
    getPrograms: builder.query({
      providesTags: ['Program'],
      keepUnusedDataFor: 300, // 5 minutes
    }),
    getProgress: builder.query({
      providesTags: ['Progress'],
      keepUnusedDataFor: 60, // 1 minute - more frequent updates
    }),
  }),
});
```

## 🔗 Module Integration

### Overview Dashboard Integration
- **KPI Contribution**: Active programs count, total bonuses awarded, program ROI
- **Drill-Through**: Click incentive metrics to open Incentives module
- **Shared Filters**: Date range and venue selection sync

### Promoters Module Integration
- **Performance Enhancement**: Show active incentive progress in promoter profiles
- **Leaderboard Integration**: Include incentive earnings in performance calculations
- **Cross-Navigation**: Easy navigation between promoter performance and incentive progress

### Finance Module Integration
- **Bonus Payouts**: Automatic integration with payout processing
- **Budget Tracking**: Real-time budget utilization monitoring
- **Financial Reporting**: Include incentive costs in financial summaries

### Bookings Module Integration
- **Progress Triggers**: Booking status changes trigger incentive progress updates
- **Promoter Context**: Show relevant incentive information in booking details
- **Performance Impact**: Track booking behavior changes during active programs

## 🚀 Implementation Notes

### Phase 1: Foundation (MVP)
- [ ] Basic program creation with fixed bonus tiers
- [ ] Simple progress tracking for booking quotas
- [ ] Manual bonus approval and awarding
- [ ] Basic reporting dashboard

### Phase 2: Automation
- [ ] Automatic bonus calculations and awards
- [ ] Real-time progress updates via webhooks
- [ ] Email notifications for achievements
- [ ] Advanced program templates

### Phase 3: Analytics & Optimization
- [ ] Comprehensive ROI analytics
- [ ] A/B testing for program effectiveness
- [ ] Machine learning recommendations for optimal program design
- [ ] Integration with external marketing tools

### Development Priorities
1. **Data Models**: Establish robust program and progress data structures
2. **Progress Engine**: Build reliable progress tracking and bonus calculation system
3. **UI Components**: Create intuitive program management interface
4. **Integration Layer**: Connect with existing Promoters and Finance modules
5. **Analytics Engine**: Develop comprehensive reporting capabilities

---

The Incentives module serves as a powerful tool for driving promoter engagement and venue performance through structured reward systems. Focus on creating an intuitive experience that makes complex incentive management feel simple and effective.
