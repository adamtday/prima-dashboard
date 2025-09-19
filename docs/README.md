# PRIMA Partner Dashboard Documentation

This documentation serves as the comprehensive knowledge base for developing the PRIMA Partner Dashboard prototype using Next.js 15, React 19, TypeScript, RTK Query, MSW, Tailwind, and shadcn/ui.

## 📁 Documentation Structure

```
docs/
├── README.md                    # This file - overview and navigation
├── prd-improved.md              # Enhanced Product Requirements Document
├── RFCs/                        # Implementation RFC framework (sequential build plan)
├── architecture/                # Technical architecture and patterns
├── modules/                     # Detailed module specifications
├── data/                       # Data models, API contracts, and mock data
├── development/                # Development guides and workflows
├── design/                     # Design system and theming
└── testing/                    # Testing strategies and QA guidelines
```

## 🎯 Project Overview

**Vision**: Deliver an interactive, implementation-faithful prototype of PRIMA's B2B dashboard that gives hotel and venue partners a single control plane to drive revenue, manage distribution (promoters), and keep finance transparent.

**Stack**: Next.js 15 (App Router), React 19, TypeScript, RTK Query, MSW, Tailwind, shadcn/ui, TanStack Table, PWA

## 🏗️ Core Modules

1. **Overview** - KPI dashboard with drill-through capabilities
2. **Bookings** - Comprehensive booking management with status controls
3. **Pricing** - Prime/Non-Prime pricing configuration with live calculations
4. **Promoters** - Leaderboard, performance tracking, and commission management
5. **Incentives** - Create and manage promoter incentive programs
6. **Commissions** - Tiered commission structure and assignment management
7. **Finance & Payouts** - Financial overview, payout management, and holds
8. **Team/RBAC** - Role-based access control and user management preview
9. **Settings** - Theme management and configuration

## 🚀 Quick Start

### For Implementation

2. **Current Phase**: Check which RFC to implement next and its dependencies
3. **Technical Foundation**: Review [Architecture Overview](./architecture/README.md)
4. **Design Compliance**: Use [Design System](./design/README.md) for UI consistency

### For Understanding
1. Check [Module Specifications](./modules/README.md) for feature requirements
2. Reference [Data Models](./data/README.md) for API contracts and mock data
3. Follow [Development Guidelines](./development/README.md) for coding standards
4. Review [Testing Strategy](./testing/strategy.md) for quality assurance

## 📋 Implementation Approach

**Sequential RFC Implementation**: Follow the [RFC Framework](./RFCs/RFCS.md) for systematic development

**Phase-Based Delivery**:

- **Core Features (RFCs 004-006)**: Overview, Bookings, Pricing  
- **Operations (RFCs 007-008)**: Promoters, Finance
- **Advanced (RFCs 009-012)**: Incentives, Commissions, RBAC, PWA

**Critical Dependencies**: Each RFC builds upon all previous implementations - no parallel work possible.

## 🎪 Demo Scenarios

The prototype should demonstrate these core user journeys:

1. **Revenue Control**: Adjust Prime pricing and see projected earnings
2. **Demand Activation**: Create promoter incentives to drive bookings  
3. **Loss Management**: Mark no-shows/cancellations to maintain accuracy
4. **Commission Strategy**: Configure promoter commission tiers and preview impact
5. **RBAC Preview**: Show role-based data masking and permissions

## 📚 Key Resources

### Implementation Planning
- **[RFC Implementation Framework](./RFCs/RFCS.md)** - Sequential build plan with dependencies

- **[Enhanced PRD](./prd-improved.md)** - Complete Product Requirements Document
- [Individual RFCs](./RFCs/) - Detailed specifications for each implementation phase

### Technical References

- [Technical Architecture](./architecture/technical-stack.md)
- [Routing Strategy](./architecture/routing-ia.md)
- [State Management](./architecture/state-management.md)

- [Module Specifications](./modules/)
- [API Contracts](./data/api-contracts.md)
- [Mock Data Strategy](./data/msw-setup.md)

### Development Standards

- [Design Tokens](./design/tokens.md)
- [Development Workflow](./development/workflow.md)
- [Testing Strategy](./testing/strategy.md)

---

Last updated: September 18, 2025
