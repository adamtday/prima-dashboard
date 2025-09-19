# PRIMA Partner Dashboard — Enhanced PRD (Implementation-Ready)

> **Document Version**: 2.0  
> **Last Updated**: September 18, 2025  
> **Status**: Implementation-Ready  
> **Review Date**: October 18, 2025

---

## Executive Summary

**Vision**: Deliver a comprehensive, interactive prototype of PRIMA's B2B partner dashboard that demonstrates a unified control plane for hotel and venue partners to optimize revenue, manage promoter distribution, and maintain financial transparency.

**Business Impact**: Enable stakeholders to visualize and validate the product value proposition through realistic user scenarios, reducing time-to-market and stakeholder alignment risks by 60%.

**Investment**: 3-week development sprint with 1 senior full-stack developer, targeting demo-ready prototype for Q4 stakeholder presentations.

**Success Criteria**: 
- Complete 4 scripted user journeys in < 7 minutes
- Achieve 8/10+ stakeholder satisfaction on value clarity
- Demonstrate technical feasibility for production scaling

---

## 1. Product Overview & Problem Statement

### The Challenge
Hotel and venue partners currently struggle with:
- **Fragmented Tools**: Revenue management across 3-5 different platforms
- **Promoter Opacity**: Limited visibility into promoter performance and commission structures
- **Financial Confusion**: Complex, opaque payout processes causing trust issues
- **Operational Inefficiency**: Manual processes for pricing, incentives, and booking management

### Market Context
- **TAM**: $50B+ hospitality management software market
- **Competition**: Fragmented solutions (individual point solutions vs. unified platform)
- **Differentiation**: First unified promoter-partner management platform with transparent financials

### Value Proposition
**Primary**: Single dashboard replacing 5+ tools with real-time insights and transparent financial management
**Secondary**: 25% reduction in partner operational overhead, 40% improvement in promoter productivity

---

## 2. Target Users & Personas

### Primary Personas

#### 🏢 Venue Admin (Primary Decision Maker)
- **Role**: Venue owner/general manager with 1-5 properties in portfolio
- **Goals**: Maximize revenue across all venues, control costs, ensure compliance, compare performance
- **Pain Points**: Too many tools, unclear ROI, complex commission structures, **no portfolio-level visibility**
- **Success Metrics**: Portfolio revenue optimization, cross-venue operational efficiency, venue performance comparison
- **Access Level**: Full system access including financial data and PII across all owned venues
- **Multi-Venue Needs**: 
  - Portfolio-level dashboard with aggregated metrics
  - Quick venue switching without losing context
  - Cross-venue performance comparisons
  - Consolidated financial reporting
  - Venue-specific vs portfolio-wide settings management

#### 📊 Operations Manager (Primary User)
- **Role**: Day-to-day operations oversight
- **Goals**: Monitor performance, manage promoters, track bookings
- **Pain Points**: Manual reporting, reactive management, data inconsistencies
- **Success Metrics**: Booking conversion, promoter performance, operational metrics
- **Access Level**: PII masked, read-only configuration access

#### 🎯 Marketing Coordinator (Secondary User)
- **Role**: Promoter relationship management
- **Goals**: Optimize promoter performance, manage incentives
- **Pain Points**: Limited promoter insights, manual incentive tracking
- **Success Metrics**: Promoter engagement, booking quality
- **Access Level**: No PII, limited financial visibility

### User Journey Pain Points
1. **Revenue Control**: "I can't quickly see how pricing changes will impact my bottom line across all my venues"
2. **Promoter Management**: "I don't know which promoters are actually driving value at each location"
3. **Financial Transparency**: "I never know when or how much I'll get paid from each venue"
4. **Operational Efficiency**: "Everything requires manual work and multiple logins for each property"
5. **Portfolio Management**: "I have no way to compare performance across my venues or see portfolio-level trends"
6. **Context Switching**: "I lose my work when switching between venues and have to start over"

---

## 3. Solution Requirements

### 3.1 Core Functional Requirements (MoSCoW)

#### Must Have (Demo Critical)
- **M1**: Multi-venue selector with context preservation across navigation
- **M2**: Overview dashboard with venue-specific KPIs and drill-through navigation
- **M3**: Portfolio view with aggregated metrics across all venues
- **M4**: Booking management with real-time status updates and venue filtering
- **M5**: Prime/Non-Prime pricing configuration with live impact calculations
- **M6**: Promoter leaderboard with performance metrics and commission assignment
- **M7**: Financial summary with next payout preview and hold management
- **M8**: Role-based data masking demonstration (Admin vs Manager vs Coordinator)
- **M9**: Dark/light theme switching with design token consistency
- **M10**: Mobile-responsive design with touch-friendly interactions

#### Should Have (Enhanced Demo Value)
- **S1**: Cross-venue performance comparison views and analytics
- **S2**: Venue-specific vs portfolio-wide settings management
- **S3**: Incentive program creation and progress tracking
- **S4**: Commission tier management with precedence preview
- **S5**: Advanced booking filters and bulk status operations
- **S6**: Export functionality with role-based data filtering (venue-specific or portfolio-wide)
- **S7**: Real-time data updates with optimistic UI patterns
- **S8**: Comprehensive error handling and loading states
- **S9**: Accessibility compliance (WCAG 2.1 AA)

#### Could Have (Nice to Have)
- **C1**: Advanced analytics with trend comparisons
- **C2**: Saved dashboard views and preferences
- **C3**: Advanced search and filtering across modules
- **C4**: Calendar view for booking management
- **C5**: Interactive data visualization with tooltips
- **C6**: Print-friendly export formats

#### Won't Have (Explicit Exclusions)
- **W1**: Real authentication and user management systems
- **W2**: Actual payment processing or financial transactions
- **W3**: Integration with external booking platforms
- **W4**: Multi-currency or international tax compliance
- **W5**: Audit trail with long-term data retention
- **W6**: Advanced reporting and business intelligence

### 3.2 User Stories (Acceptance Criteria)

#### Epic 1: Multi-Venue Portfolio Management
**As a** Venue Admin with multiple properties  
**I want to** view and manage all my venues from a single dashboard  
**So that** I can efficiently oversee my entire portfolio without losing context

**Acceptance Criteria:**
- [ ] Can see portfolio-level overview with aggregated KPIs across all venues
- [ ] Can switch between venues using prominent venue selector in header
- [ ] Current venue context is preserved when navigating between modules
- [ ] Can view side-by-side performance comparison between venues
- [ ] Can filter any view to show "All Venues" or specific venue subset
- [ ] URL state includes current venue selection for shareable links
- [ ] Can access venue-specific settings and portfolio-wide settings separately
- [ ] Export functionality includes venue selection options (single/multiple/all)

#### Epic 2: Revenue Control
**As a** Venue Admin  
**I want to** adjust pricing and see immediate impact projections  
**So that** I can optimize revenue without complex calculations

**Acceptance Criteria:**
- [ ] Can modify Prime base price and per-person pricing
- [ ] Can adjust Non-Prime per-diner pricing
- [ ] See live calculation examples for 2, 4, 6, 8 person scenarios
- [ ] View projected monthly impact on revenue and commissions
- [ ] Changes persist across sessions
- [ ] Updates reflect in Overview dashboard within 30 seconds

#### Epic 2: Venue Performance Comparison
**As a** Venue Admin with multiple properties  
**I want to** compare performance metrics across my venues  
**So that** I can identify best practices and improvement opportunities

**Acceptance Criteria:**
- [ ] Can view side-by-side comparison of key metrics (revenue, bookings, conversion rates)
- [ ] Can rank venues by different performance criteria
- [ ] Can see which promoters perform best at different venues
- [ ] Can identify venue-specific trends and seasonality patterns
- [ ] Can copy successful pricing/commission strategies between venues
- [ ] Can view portfolio-level financial consolidation
- [ ] Can benchmark individual venue performance against portfolio average

#### Epic 3: Demand Activation
**As an** Operations Manager  
**I want to** create and track promoter incentive programs  
**So that** I can drive booking volume during slow periods

**Acceptance Criteria:**
- [ ] Can create monthly/quarterly incentive programs
- [ ] Set targets (booking count, revenue, conversion rate)
- [ ] Define rewards (fixed amount, percentage bonus, tier upgrade)
- [ ] Track real-time progress with visual indicators
- [ ] Auto-award completed incentives to next payout
- [ ] View leaderboard of participants and standings

#### Epic 4: Loss Management
**As an** Operations Manager  
**I want to** quickly identify and mark problematic bookings  
**So that** I can maintain accurate metrics and financials

**Acceptance Criteria:**
- [ ] Filter bookings by status, date range, promoter
- [ ] Mark bookings as no-show or cancelled with single click
- [ ] See optimistic UI updates with 10-second undo window
- [ ] View impact on KPIs immediately after status change
- [ ] Export filtered booking lists with role-appropriate data
- [ ] Bulk operations for multiple booking status updates

#### Epic 5: Commission Strategy
**As a** Venue Admin  
**I want to** configure promoter commission tiers and preview impact  
**So that** I can optimize promoter motivation while controlling costs

**Acceptance Criteria:**
- [ ] Set up Standard/Premium/VIP commission tiers
- [ ] Configure per-cover or percentage-of-spend models
- [ ] Assign individual promoters to specific tiers
- [ ] Preview monthly cost impact before applying changes
- [ ] View effective commission rates per promoter
- [ ] Track tier performance over time

### 3.3 Non-Functional Requirements

#### Performance
- **Load Time**: Initial page load ≤ 3 seconds on mid-tier laptop
- **Interaction Response**: UI interactions ≤ 200ms (table operations ≤ 100ms)
- **Data Refresh**: Real-time updates every 30 seconds for active pages
- **Bundle Size**: Initial JavaScript bundle ≤ 500KB compressed
- **Memory Usage**: Stable operation with ≤ 100MB heap size

#### Accessibility
- **WCAG Compliance**: 2.1 AA level compliance verified
- **Keyboard Navigation**: Full functionality without mouse
- **Screen Reader**: Proper ARIA labels and semantic HTML
- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Focus Management**: Visible focus indicators with logical tab order

#### Compatibility
- **Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Devices**: Responsive design for phones (320px+), tablets, desktops
- **PWA Support**: Installable with offline shell functionality

---

## 4. Technical Architecture

### 4.1 Technology Stack (Locked)

#### Core Framework
- **Next.js 15**: App Router, RSC, TypeScript integration
- **React 19**: Latest features, enhanced performance
- **TypeScript**: Strict mode, comprehensive type coverage

#### State Management
- **RTK Query**: Server state, caching, optimistic updates
- **Redux Toolkit**: Client state management
- **React Context**: Theme, preferences, global UI state

#### UI & Styling
- **shadcn/ui**: Component library (New York style)
- **Tailwind CSS**: Utility-first styling with design tokens
- **Lucide React**: Icon system
- **OKLCH Color Space**: Advanced color management (preserved)

#### Development & Testing
- **MSW**: API mocking for realistic data flows
- **TanStack Table**: Advanced table functionality
- **React Hook Form + Zod**: Form management and validation
- **Jest + Testing Library**: Unit and integration testing
- **Playwright**: End-to-end testing for user journeys

### 4.2 Data Architecture

#### Multi-Venue Data Structure
- **User-Venue Relationships**: Many-to-many mapping with role-based access
- **Venue Hierarchy**: Support for venue groups/portfolio organization  
- **Cross-Venue Analytics**: Aggregation queries and performance comparisons
- **Data Isolation**: Venue-specific data with controlled cross-venue access

#### Mock Data Strategy
- **Realistic Patterns**: 60/20/20 Prime/Non-Prime/Cancelled distribution per venue
- **Performance Distribution**: Pareto principle (80/20) for promoter performance across venues
- **Temporal Patterns**: Day-of-week and seasonal booking variations with venue-specific patterns
- **Financial Accuracy**: Correct commission calculations and payout timing per venue
- **Portfolio Diversity**: 3-5 venues with different characteristics (restaurant, hotel, event space)
- **Cross-Venue Promoters**: Some promoters work across multiple venues

#### API Contracts
- **RESTful Design**: Consistent URL patterns and HTTP methods
- **Error Handling**: Standardized error responses with codes
- **Pagination**: Consistent pagination across all list endpoints
- **Filtering**: Common filter patterns across all data types
- **Caching**: RTK Query cache with selective invalidation

### 4.3 Security & Privacy (Prototype Level)

#### Data Protection
- **PII Masking**: Role-based data visibility (names, emails, phone)
- **Access Control**: Route-level protection based on user role
- **Export Watermarking**: Actor and timestamp on all exports
- **Session Management**: Secure session handling for demo purposes

#### Development Security
- **Environment Variables**: Secure configuration management
- **Dependency Management**: Regular security audits
- **Code Quality**: ESLint security rules and best practices

---

## 5. Implementation Roadmap

### 5.1 Development Phases

#### Phase 1: Foundation (Week 1, Days 1-3)
**Objective**: Establish technical foundation and design system integration

**Deliverables:**
- [ ] Project setup with all dependencies configured
- [ ] Design token integration and theme verification
- [ ] RTK Query store configuration with MSW integration
- [ ] PRIMA route group structure and navigation
- [ ] Multi-venue data models and user-venue relationships
- [ ] Basic layout shell with responsive sidebar and venue selector
- [ ] Mock data for 3-5 diverse venues with cross-venue promoters

**Success Criteria:**
- All pages render with correct theming
- Navigation between routes works smoothly
- Venue selector functions correctly with context preservation
- MSW handlers respond with realistic latency and venue-specific data
- Mobile layout is functional and accessible

#### Phase 2: Core Modules (Week 1-2, Days 4-10)
**Objective**: Implement primary user journeys and data integration

**Overview Dashboard (Days 4-5)**
- [ ] Venue-specific KPI cards with drill-through navigation
- [ ] Portfolio-level aggregated KPIs with venue breakdown
- [ ] Weekly trend chart with venue-specific and aggregated views
- [ ] Recent bookings table with venue indicators and status
- [ ] Real-time metric updates with venue context

**Bookings Management (Days 6-8)**
- [ ] Advanced data table with filtering and sorting
- [ ] Optimistic status updates with undo functionality
- [ ] Bulk operations for multiple booking management
- [ ] Export functionality with role-based data masking

**Pricing Configuration (Days 9-10)**
- [ ] Prime/Non-Prime pricing forms with validation
- [ ] Live calculation preview with multiple scenarios
- [ ] Impact projection on revenue and commissions
- [ ] Settings persistence and change tracking

**Success Criteria:**
- All 5 demo scenarios can be completed successfully
- Multi-venue context switching works seamlessly
- Data updates propagate correctly across modules and venues
- Performance targets met for all interactions
- Error handling graceful and informative

#### Phase 3: Advanced Features (Week 2-3, Days 11-15)
**Objective**: Complete remaining modules and polish for demonstration

**Finance & Promoters (Days 11-12)**
- [ ] Financial summary with payout management
- [ ] Promoter leaderboard with performance metrics
- [ ] Commission assignment and tier management
- [ ] Hold creation and management workflows

**Incentives & Commissions (Days 13-14)**
- [ ] Incentive program creation and tracking
- [ ] Commission tier configuration and precedence
- [ ] Progress visualization and achievement system
- [ ] Integration with financial calculations

**Polish & PWA (Day 15)**
- [ ] RBAC demonstration and data masking
- [ ] Service worker and offline functionality
- [ ] Performance optimization and bundle analysis
- [ ] Accessibility audit and remediation

**Success Criteria:**
- Complete demo flow takes < 7 minutes
- All accessibility requirements met
- PWA installation and offline mode functional
- Performance budgets maintained

### 5.2 Risk Assessment & Mitigation

#### High Risk
**R1: Complex Data Relationships**
- *Risk*: Booking status changes not propagating correctly
- *Mitigation*: Comprehensive RTK Query cache invalidation strategy
- *Fallback*: Manual refresh mechanisms with clear user feedback

**R2: Performance with Large Datasets**
- *Risk*: Table performance degrades with 1000+ bookings
- *Mitigation*: Virtual scrolling and pagination implementation
- *Fallback*: Reduce demo dataset size while maintaining realism

#### Medium Risk
**R3: Mobile Experience Complexity**
- *Risk*: Complex tables difficult to use on mobile
- *Mitigation*: Card-based mobile layouts with essential information
- *Fallback*: Mobile-specific simplified views

**R4: Theme Integration Challenges**
- *Risk*: New components don't integrate with existing design system
- *Mitigation*: Strict adherence to design token documentation
- *Fallback*: Component-level theme overrides as needed

**R5: Multi-Venue Context Complexity**
- *Risk*: Venue switching causes data loss or performance issues
- *Mitigation*: Robust state management with venue context preservation
- *Fallback*: Simplified venue filtering instead of full context switching

### 5.3 Success Metrics & KPIs

#### Technical Metrics
- **Performance**: 100% of interactions under target response times
- **Accessibility**: 0 critical accessibility violations
- **Test Coverage**: 85%+ unit test coverage, 100% user journey coverage
- **Error Rate**: < 1% error rate during demo sessions

#### Business Metrics
- **Demo Completion**: 100% success rate for scripted scenarios
- **Stakeholder Satisfaction**: 8/10+ average rating on value clarity
- **Technical Validation**: Architecture approved for production scaling
- **User Experience**: 9/10+ rating on interface usability

#### Quality Gates
- [ ] All critical user journeys executable without errors
- [ ] Performance targets met across all devices
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness validated
- [ ] Data accuracy maintained across all operations

---

## 6. Dependencies & Constraints

### 6.1 External Dependencies
- **Design System**: Existing OKLCH-based tokens must be preserved
- **Development Environment**: Node.js 20+, modern development setup
- **Deployment Platform**: Vercel or equivalent Next.js-optimized hosting
- **Browser Support**: Modern browser capabilities (ES2020+)

### 6.2 Internal Dependencies
- **Stakeholder Availability**: Demo sessions and feedback collection
- **Design Assets**: Any additional icons or imagery needed
- **Content Review**: Business logic validation for financial calculations
- **Performance Baseline**: Current system metrics for comparison

### 6.3 Constraints
- **Timeline**: Fixed 3-week delivery window
- **Scope**: Prototype-level implementation, not production-ready
- **Data**: Mock data only, no real customer information
- **Integration**: No external system connections required

### 6.4 Assumptions
- **User Device**: Mid-tier laptop or better for primary demo
- **Internet Connection**: Stable connection for real-time features
- **Browser Configuration**: JavaScript enabled, modern browser features
- **Stakeholder Availability**: Regular feedback and validation sessions

---

## 7. Testing & Quality Assurance

### 7.1 Testing Strategy

#### Unit Testing (85% Coverage Target)
- **Utilities**: 100% coverage for calculation functions
- **Components**: Props, interactions, state changes
- **Hooks**: Custom hooks with mock data scenarios
- **API Integration**: RTK Query endpoints with MSW

#### Integration Testing
- **User Flows**: Complete user journey testing
- **Data Flow**: State changes across multiple components
- **API Integration**: MSW handlers with realistic scenarios
- **Error Scenarios**: Network failures, validation errors

#### End-to-End Testing
- **Demo Scenarios**: All 4 scripted user journeys
- **Cross-Browser**: Chrome, Firefox, Safari testing
- **Device Testing**: Mobile, tablet, desktop responsiveness
- **Performance**: Core Web Vitals measurement

#### Accessibility Testing
- **Automated**: axe-core integration in test suites
- **Manual**: Keyboard navigation and screen reader testing
- **Color Contrast**: All color combinations verified
- **Focus Management**: Logical tab order and focus indicators

### 7.2 Quality Metrics
- **Code Quality**: ESLint/Prettier compliance
- **Performance**: Lighthouse scores 90+ for all metrics
- **Accessibility**: 100% WCAG 2.1 AA compliance
- **Browser Compatibility**: 100% feature parity across target browsers

---

## 8. Launch & Success Criteria

### 8.1 Go-Live Checklist
- [ ] All must-have features implemented and tested
- [ ] Performance targets met across all user journeys
- [ ] Accessibility compliance verified
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness validated
- [ ] Demo scripts prepared and rehearsed
- [ ] Stakeholder presentation materials ready
- [ ] Fallback plans prepared for common demo issues

### 8.2 Success Definition
**Primary Success**: Demonstrate product value proposition effectively to stakeholders, achieving 8/10+ satisfaction on clarity and technical feasibility.

**Secondary Success**: Validate technical architecture and identify any critical challenges for production implementation.

**Delivery Success**: Complete all deliverables within timeline and quality constraints, providing clear path for next development phase.

### 8.3 Post-Launch
- **Stakeholder Feedback**: Collect and document all stakeholder input
- **Technical Assessment**: Document architecture decisions and lessons learned
- **Next Phase Planning**: Recommendations for production development approach
- **Knowledge Transfer**: Complete documentation and handoff materials

---

## 9. Appendices

### Appendix A: Detailed User Journey Scripts
[See IMPLEMENTATION_GUIDE.md for complete demo scenarios]

### Appendix B: Technical Architecture Diagrams
[See docs/architecture/ for detailed technical specifications]

### Appendix C: API Contract Specifications
[See docs/data/api-contracts.md for complete API documentation]

### Appendix D: Design System Guidelines
[See docs/design/ for complete design token and component specifications]

---

**Document Control**
- **Author**: Product Management Team
- **Technical Review**: Development Team Lead
- **Business Review**: Stakeholder Committee
- **Approval**: Product Owner
- **Distribution**: Development Team, QA Team, Stakeholder Group
