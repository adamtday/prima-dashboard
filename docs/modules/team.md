# Team & RBAC Module

Role-based access control and user management system for secure, hierarchical access to PRIMA Partner Dashboard functionality and data.

## 🎯 Module Overview

### Purpose
The Team & RBAC module provides comprehensive user management and role-based access control for the PRIMA Partner Dashboard. This module ensures appropriate data visibility, functional access, and audit capabilities while supporting multi-venue organizations with complex permission requirements.

### Key Features
- **Role-Based Access Control**: Predefined and custom roles with granular permissions
- **Multi-Venue User Management**: Users can have different roles across multiple venues
- **Data Masking & Filtering**: Automatic data protection based on user permissions
- **Audit Trail**: Comprehensive logging of user actions and permission changes
- **Team Hierarchy**: Support for organizational structures and reporting relationships

### Business Value
- **Security Compliance**: Meet industry standards for data protection and access control
- **Operational Efficiency**: Appropriate access levels reduce training and error risks
- **Scalable Growth**: Support expanding teams and complex organizational structures
- **Regulatory Compliance**: Audit trails and access controls for regulatory requirements

## 👤 User Personas & Roles

### System Administrator (Super Admin)
- **Access**: Complete system access across all venues and functions
- **Capabilities**: User management, role configuration, system settings, audit review
- **Data Visibility**: All data including sensitive financial and personal information

### Venue Admin (Primary Decision Maker)
- **Access**: Full access to owned venues with user management capabilities
- **Capabilities**: Manage venue team, configure roles, access all venue data
- **Data Visibility**: Complete venue data including PII and financial information

### Venue Manager (Operations Lead)
- **Access**: Operational access with limited administrative functions
- **Capabilities**: View reports, manage bookings, monitor performance, limited user management
- **Data Visibility**: Operational data with masked sensitive information

### Venue Coordinator (Day-to-Day Operations)
- **Access**: Task-focused access for daily operational needs
- **Capabilities**: Process bookings, update status, view assigned promoter data
- **Data Visibility**: Limited to assigned tasks and anonymized data

### Finance Manager (Financial Oversight)
- **Access**: Financial data access across multiple venues
- **Capabilities**: View financial reports, manage payouts, configure financial settings
- **Data Visibility**: Financial data with limited operational visibility

### Read-Only User (Stakeholder/Auditor)
- **Access**: View-only access to reports and dashboards
- **Capabilities**: Export reports, view analytics, no modification capabilities
- **Data Visibility**: Aggregated data only, no individual-level information

## 🎪 User Stories & Demo Scenarios

### Epic: Role-Based Access Control Implementation

#### Story 1: Configure Custom Role with Granular Permissions
**As a** Venue Admin  
**I want to** create custom roles with specific permissions for my team  
**So that** each team member has appropriate access to perform their duties

**Acceptance Criteria:**
- [ ] Create custom role with name, description, and permission set
- [ ] Select granular permissions across all PRIMA modules
- [ ] Configure data visibility levels (full, masked, aggregated, none)
- [ ] Set functional restrictions (read-only, limited edit, full control)
- [ ] Preview role capabilities before assignment
- [ ] Save role template for reuse across venues
- [ ] Assign role to existing users

**Demo Flow:**
1. Navigate to Team → Role Management
2. Create "Assistant Manager" role
3. Grant permissions: Full bookings access, read-only financial data, no promoter PII
4. Configure data masking: Show booking counts but mask guest names
5. Preview role: Show what Assistant Manager would see in each module
6. Save role and assign to team member
7. Demonstrate role-based data filtering in action

#### Story 2: Multi-Venue User Management
**As a** System Administrator  
**I want to** manage users who work across multiple venues with different roles  
**So that** the same person can have appropriate access levels at each location

**Acceptance Criteria:**
- [ ] Assign user to multiple venues with different roles per venue
- [ ] Switch venue context and see role-appropriate data and functionality
- [ ] Prevent privilege escalation across venue boundaries
- [ ] Maintain audit trail of cross-venue activities
- [ ] Configure default venue and role for user login
- [ ] Handle role conflicts and precedence rules
- [ ] Support temporary role assignments with expiration dates

**Demo Flow:**
1. Navigate to Team → User Management
2. Select existing user "Sarah Johnson"
3. Add venues: Venue A (Manager), Venue B (Coordinator), Venue C (Finance)
4. Demonstrate venue switching: Show different permissions at each venue
5. Show data isolation: Cannot see Venue A data when in Venue B context
6. Display audit trail: Track Sarah's activities across all venues

#### Story 3: Data Masking and Privacy Protection
**As a** Venue Admin  
**I want** sensitive data to be automatically masked for users without appropriate permissions  
**So that** privacy is protected while maintaining operational functionality

**Acceptance Criteria:**
- [ ] Automatically mask PII (names, emails, phone numbers) for restricted users
- [ ] Show aggregated data where individual data is restricted
- [ ] Mask financial amounts while showing trends and percentages
- [ ] Maintain functionality while protecting sensitive information
- [ ] Configure masking rules per data type and user role
- [ ] Provide clear indicators when data is masked
- [ ] Support partial masking (e.g., show first name only)

**Demo Flow:**
1. Login as Venue Coordinator (limited permissions)
2. Navigate to Bookings: Show "Guest #1234" instead of actual names
3. View Promoters: Show performance metrics without contact information
4. Access Finance: Show percentages and trends, mask actual amounts
5. Switch to Manager role: Show progressively more detailed information
6. Switch to Admin role: Show complete unmasked data

#### Story 4: Team Activity Audit and Compliance
**As a** Venue Admin  
**I want to** monitor team member activities and maintain compliance records  
**So that** I can ensure proper use of the system and meet regulatory requirements

**Acceptance Criteria:**
- [ ] Log all user actions with timestamps and details
- [ ] Track data access patterns and permission usage
- [ ] Generate compliance reports for audit purposes
- [ ] Monitor for unusual access patterns or potential security issues
- [ ] Export audit logs in standard formats
- [ ] Configure alert thresholds for suspicious activities
- [ ] Maintain tamper-proof audit records

**Demo Flow:**
1. Navigate to Team → Audit Logs
2. Filter activities: Show last 7 days for all users
3. Highlight key events: Login attempts, data exports, permission changes
4. Display security alerts: Multiple failed login attempts detected
5. Generate compliance report: Export 30-day activity summary
6. Show data access patterns: Which modules are used most frequently

## 🏗️ Technical Architecture

### Data Models

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending_invitation';
  
  // Authentication
  lastLoginAt?: string;
  loginAttempts: number;
  passwordChangedAt: string;
  mustChangePassword: boolean;
  
  // Profile
  avatar?: string;
  timezone: string;
  language: string;
  preferences: UserPreferences;
  
  // System Information
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: 'system' | 'custom';
  
  // Permission Configuration
  permissions: Permission[];
  dataAccess: DataAccessConfig;
  functionalAccess: FunctionalAccessConfig;
  
  // Scope and Restrictions
  scope: 'system' | 'venue' | 'department';
  restrictions: RoleRestriction[];
  
  // Metadata
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  venueId?: string; // null for system roles
}

interface UserVenueRole {
  id: string;
  userId: string;
  venueId: string;
  roleId: string;
  
  // Assignment Details
  assignedAt: string;
  assignedBy: string;
  expiresAt?: string;
  isTemporary: boolean;
  
  // Status and Overrides
  status: 'active' | 'suspended' | 'expired';
  overrides: PermissionOverride[];
  
  // Context
  isDefault: boolean; // Default venue for user
  lastAccessedAt?: string;
}

interface Permission {
  id: string;
  module: 'overview' | 'bookings' | 'pricing' | 'promoters' | 'incentives' | 'commissions' | 'finance' | 'team' | 'settings';
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'approve';
  scope: 'own' | 'team' | 'venue' | 'all';
  conditions?: PermissionCondition[];
}

interface DataAccessConfig {
  piiAccess: 'none' | 'masked' | 'partial' | 'full';
  financialAccess: 'none' | 'aggregated' | 'summary' | 'detailed';
  exportPermissions: ExportPermission[];
  dataRetentionAccess: boolean;
  auditLogAccess: 'none' | 'own' | 'team' | 'all';
}

interface AuditLogEntry {
  id: string;
  userId: string;
  venueId?: string;
  
  // Action Details
  action: string;
  module: string;
  resourceId?: string;
  resourceType?: string;
  
  // Context
  userAgent: string;
  ipAddress: string;
  sessionId: string;
  
  // Data
  beforeData?: any;
  afterData?: any;
  metadata: Record<string, any>;
  
  // Timing
  timestamp: string;
  duration?: number;
  
  // Classification
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'modification' | 'export' | 'system';
}
```

### API Endpoints

```typescript
// User Management
GET    /api/users
POST   /api/users
GET    /api/users/:userId
PUT    /api/users/:userId
DELETE /api/users/:userId
POST   /api/users/:userId/invite
POST   /api/users/:userId/suspend
POST   /api/users/:userId/reactivate

// Role Management
GET    /api/roles
POST   /api/roles
GET    /api/roles/:roleId
PUT    /api/roles/:roleId
DELETE /api/roles/:roleId
POST   /api/roles/:roleId/clone

// User-Venue-Role Assignments
GET    /api/users/:userId/venues
POST   /api/users/:userId/venues
PUT    /api/users/:userId/venues/:venueId
DELETE /api/users/:userId/venues/:venueId
GET    /api/venues/:venueId/users
POST   /api/venues/:venueId/users/:userId/assign-role

// Permission Management
GET    /api/permissions
GET    /api/users/:userId/permissions
GET    /api/roles/:roleId/permissions
POST   /api/users/:userId/permissions/override
DELETE /api/users/:userId/permissions/override/:overrideId

// Audit and Compliance
GET    /api/audit/logs
GET    /api/audit/users/:userId/activity
GET    /api/audit/venues/:venueId/activity
POST   /api/audit/reports/generate
GET    /api/audit/reports/:reportId

// Security
POST   /api/auth/check-permissions
GET    /api/auth/user-context
POST   /api/auth/switch-venue
GET    /api/security/alerts
POST   /api/security/alerts/:alertId/acknowledge
```

### RTK Query Hooks

```typescript
// User Management Hooks
export const useUsersQuery = (filters?: UserFilter) => { /* ... */ };
export const useUserQuery = (userId: string) => { /* ... */ };
export const useCreateUserMutation = () => { /* ... */ };
export const useUpdateUserMutation = () => { /* ... */ };
export const useInviteUserMutation = () => { /* ... */ };

// Role Management Hooks
export const useRolesQuery = (venueId?: string) => { /* ... */ };
export const useRoleQuery = (roleId: string) => { /* ... */ };
export const useCreateRoleMutation = () => { /* ... */ };
export const useUpdateRoleMutation = () => { /* ... */ };

// Assignment Hooks
export const useUserVenuesQuery = (userId: string) => { /* ... */ };
export const useVenueUsersQuery = (venueId: string) => { /* ... */ };
export const useAssignRoleMutation = () => { /* ... */ };
export const useRemoveRoleAssignmentMutation = () => { /* ... */ };

// Audit Hooks
export const useAuditLogsQuery = (filters: AuditFilter) => { /* ... */ };
export const useUserActivityQuery = (userId: string, timeRange: DateRange) => { /* ... */ };
export const useGenerateAuditReportMutation = () => { /* ... */ };

// Security Hooks
export const useCheckPermissionsQuery = (permission: string) => { /* ... */ };
export const useUserContextQuery = () => { /* ... */ };
export const useSwitchVenueMutation = () => { /* ... */ };
```

## 🎨 UI/UX Design Specifications

### Main Team Dashboard

```typescript
// Route: /team
export default function TeamPage() {
  return (
    <div className="team-layout">
      <TeamHeader />
      <div className="grid lg:grid-cols-6 gap-6">
        <div className="lg:col-span-1">
          <TeamNavigationSidebar />
        </div>
        <div className="lg:col-span-5">
          <TeamManagementTabs />
        </div>
      </div>
    </div>
  );
}
```

### Component Specifications

#### UserManagementTable
```typescript
interface UserManagementTableProps {
  users: UserWithRoles[];
  onEditUser: (user: User) => void;
  onAssignRole: (userId: string, venueId: string, roleId: string) => void;
  onSuspendUser: (userId: string) => void;
  sortBy: 'name' | 'role' | 'lastLogin' | 'status';
  filterBy: UserFilter;
}

// Features:
// - Sortable columns: Name, Email, Roles, Last Login, Status
// - Role badges showing venue-specific assignments
// - Quick actions: Edit, Suspend, View Activity, Reset Password
// - Bulk operations: Assign roles, send notifications, export
// - Filter by role, venue, status, last login date
// - Responsive design with mobile-friendly actions
```

#### RolePermissionMatrix
```typescript
interface RolePermissionMatrixProps {
  role: Role;
  availablePermissions: Permission[];
  onPermissionToggle: (permissionId: string, enabled: boolean) => void;
  onSave: (role: Role) => void;
  isEditing: boolean;
}

// Features:
// - Matrix view: Modules vs. Actions with checkboxes
// - Permission grouping by category (Create, Read, Update, Delete, Export)
// - Visual indicators for inherited vs. explicit permissions
// - Permission templates for quick setup
// - Conflict detection and resolution
// - Permission impact preview
```

#### DataMaskingPreview
```typescript
interface DataMaskingPreviewProps {
  role: Role;
  sampleData: any;
  modules: string[];
  onMaskingRuleChange: (rule: MaskingRule) => void;
}

// Features:
// - Side-by-side view: Original data vs. Masked data
// - Interactive masking configuration
// - Real-time preview updates
// - Module-specific masking examples
// - Export preview with watermarking
// - Compliance indicators
```

#### AuditLogViewer
```typescript
interface AuditLogViewerProps {
  logs: AuditLogEntry[];
  filters: AuditFilter;
  onFilterChange: (filters: AuditFilter) => void;
  onExportLogs: (format: 'csv' | 'json' | 'pdf') => void;
}

// Features:
// - Chronological log display with expandable details
// - Advanced filtering: User, action, module, date range, severity
// - Search functionality across all log fields
// - Color-coded severity levels
// - Export capabilities with multiple formats
// - Real-time log streaming option
```

### Mobile Responsiveness

#### Breakpoint Specifications
- **Mobile (< 768px)**: Stacked layout, simplified user management
- **Tablet (768px - 1024px)**: 2-column layout, condensed permission matrix
- **Desktop (> 1024px)**: Full 6-column layout with expanded audit tools

#### Mobile-Specific Features
- **Touch-Friendly Controls**: Large buttons for role assignment
- **Swipe Actions**: Quick user management actions
- **Simplified Permissions**: Grouped permission toggles
- **Progressive Disclosure**: Show details on demand

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('PermissionEngine', () => {
  it('evaluates permissions correctly for different roles', () => {
    // Test permission checking logic
  });
  
  it('applies data masking rules appropriately', () => {
    // Test data masking functionality
  });
  
  it('handles role inheritance and overrides correctly', () => {
    // Test complex permission scenarios
  });
});

describe('AuditLogger', () => {
  it('logs user actions with correct details', () => {
    // Test audit log creation
  });
  
  it('maintains tamper-proof audit records', () => {
    // Test audit log integrity
  });
});
```

### Integration Tests
```typescript
describe('RBAC Integration', () => {
  it('enforces permissions across all modules', async () => {
    // Test permission enforcement in different modules
  });
  
  it('maintains data isolation between venues', async () => {
    // Test multi-venue data separation
  });
  
  it('generates accurate audit reports', async () => {
    // Test audit report generation
  });
});
```

### E2E Test Scenarios
```typescript
describe('Team Management Demo Flow', () => {
  it('completes full RBAC setup and demonstration', async () => {
    // 1. Create custom role with specific permissions
    // 2. Assign user to multiple venues with different roles
    // 3. Demonstrate data masking across modules
    // 4. Generate and review audit reports
    // 5. Handle security alerts and compliance checks
  });
});
```

## 📊 Performance Requirements

### Load Time Targets
- **Team Dashboard**: < 2s initial load with user and role data
- **Permission Changes**: < 300ms for role assignment updates
- **Audit Log Queries**: < 1.5s for 30-day log retrieval
- **User Context Switch**: < 200ms venue switching

### Scalability Considerations
- **User Base**: Support 1000+ users across multiple venues
- **Role Complexity**: Handle 100+ custom roles with complex permissions
- **Audit Volume**: Process 100,000+ daily audit events
- **Permission Checks**: Sub-10ms permission evaluation

### Caching Strategy
```typescript
// RTK Query cache configuration
const teamApi = createApi({
  reducerPath: 'teamApi',
  baseQuery: fetchBaseQuery({ /* ... */ }),
  tagTypes: ['User', 'Role', 'Assignment', 'AuditLog'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      providesTags: ['User'],
      keepUnusedDataFor: 600, // 10 minutes - stable data
    }),
    getUserPermissions: builder.query({
      providesTags: ['Assignment'],
      keepUnusedDataFor: 300, // 5 minutes - permission cache
    }),
    getAuditLogs: builder.query({
      providesTags: ['AuditLog'],
      keepUnusedDataFor: 60, // 1 minute - fresh audit data
    }),
  }),
});
```

## 🔗 Module Integration

### Global Security Layer
- **Permission Enforcement**: Every module checks permissions before data access
- **Data Masking**: Automatic data protection across all modules
- **Audit Logging**: Comprehensive tracking of all user actions
- **Context Management**: Venue and role context maintained across navigation

### Authentication Integration
- **SSO Support**: Integration with enterprise authentication systems
- **Session Management**: Secure session handling with automatic timeouts
- **Multi-Factor Authentication**: Support for enhanced security requirements
- **Password Policies**: Configurable password complexity and rotation

### Compliance Integration
- **GDPR Compliance**: Data protection and right-to-be-forgotten support
- **SOC 2 Requirements**: Audit logging and access control compliance
- **Industry Standards**: Healthcare, finance, and hospitality compliance support
- **Data Retention**: Automatic data lifecycle management

## 🚀 Implementation Notes

### Phase 1: Foundation (MVP)
- [ ] Basic user management with predefined roles
- [ ] Simple permission checking and data masking
- [ ] Essential audit logging for compliance
- [ ] Multi-venue user assignments

### Phase 2: Advanced RBAC
- [ ] Custom role creation with granular permissions
- [ ] Advanced data masking and filtering
- [ ] Comprehensive audit reporting and analytics
- [ ] Security monitoring and alerting

### Phase 3: Enterprise Features
- [ ] SSO integration and enterprise authentication
- [ ] Advanced compliance reporting and automation
- [ ] Machine learning-powered security anomaly detection
- [ ] API access control and rate limiting

### Development Priorities
1. **Permission Engine**: Build robust permission checking system
2. **User Management**: Create intuitive user and role management interface
3. **Data Masking**: Implement automatic data protection across modules
4. **Audit System**: Develop comprehensive audit logging and reporting
5. **Integration Layer**: Connect RBAC with all other modules

### Security Considerations
- **Zero Trust Architecture**: Verify every request and user action
- **Principle of Least Privilege**: Grant minimum necessary permissions
- **Defense in Depth**: Multiple security layers throughout the application
- **Regular Security Reviews**: Automated and manual security assessments

---

The Team & RBAC module serves as the security foundation for the entire PRIMA Partner Dashboard, ensuring appropriate access control while maintaining usability and compliance. Focus on creating a system that is both secure and user-friendly, with clear visibility into permissions and activities.
