# Settings Module

Comprehensive configuration management for venue preferences, system settings, integrations, and customization options across the PRIMA Partner Dashboard.

## 🎯 Module Overview

### Purpose
The Settings module provides centralized configuration management for venue-specific preferences, system-wide settings, theme customization, and integration configurations. This module ensures consistent user experience while supporting diverse operational requirements across different venues.

### Key Features
- **Theme Management**: Light/dark mode, custom branding, and UI customization
- **Venue Configuration**: Operational settings, business rules, and preferences
- **Integration Hub**: Third-party service connections and API configurations
- **Notification Settings**: Email, SMS, and in-app notification preferences
- **Data Export/Import**: Backup, restore, and migration capabilities

### Business Value
- **Brand Consistency**: Maintain venue branding across all dashboard interfaces
- **Operational Efficiency**: Configure system behavior to match business processes
- **Integration Flexibility**: Connect with existing venue management systems
- **User Experience**: Personalized interface and notification preferences

## 👤 User Personas & Roles

### Venue Admin
- **Access**: Full settings configuration for owned venues
- **Capabilities**: Configure all venue settings, manage integrations, customize themes
- **Settings Scope**: Venue-wide defaults, team preferences, system configurations

### Venue Manager
- **Access**: Operational settings and team preference management
- **Capabilities**: Configure booking rules, notification settings, basic customization
- **Settings Scope**: Operational parameters within established guidelines

### System Administrator
- **Access**: Global system settings and multi-venue configuration
- **Capabilities**: System-wide defaults, integration management, security settings
- **Settings Scope**: Platform-wide configuration and venue template management

### Individual Users
- **Access**: Personal preferences and interface customization
- **Capabilities**: Theme selection, notification preferences, language settings
- **Settings Scope**: Personal user experience customization

## 🎪 User Stories & Demo Scenarios

### Epic: Theme and Branding Configuration

#### Story 1: Venue-Specific Theme Customization
**As a** Venue Admin  
**I want to** customize the dashboard theme to match my venue's branding  
**So that** the system feels integrated with our brand identity

**Acceptance Criteria:**
- [ ] Upload custom logo and configure brand colors
- [ ] Choose from light/dark theme options with custom accent colors
- [ ] Preview theme changes in real-time across all modules
- [ ] Configure theme preferences for different user roles
- [ ] Export theme configuration for use across multiple venues
- [ ] Reset to default theme with confirmation
- [ ] Ensure accessibility compliance with custom color schemes

**Demo Flow:**
1. Navigate to Settings → Theme & Branding
2. Upload venue logo (Hotel Grand Vista)
3. Configure brand colors: Primary blue (#1E40AF), secondary gold (#F59E0B)
4. Switch between light/dark themes with custom colors
5. Preview changes across Overview, Bookings, and Finance modules
6. Save and apply theme venue-wide
7. Show mobile responsiveness with custom branding

#### Story 2: User Interface Personalization
**As a** Venue Manager  
**I want to** personalize my dashboard layout and preferences  
**So that** I can work more efficiently with my preferred setup

**Acceptance Criteria:**
- [ ] Configure default landing page and module order
- [ ] Set preferred date/time formats and timezone
- [ ] Choose default data table settings (rows per page, columns)
- [ ] Configure dashboard widget preferences and layout
- [ ] Set preferred currency and number formatting
- [ ] Save multiple layout presets for different use cases
- [ ] Reset to venue defaults when needed

**Demo Flow:**
1. Navigate to Settings → Personal Preferences
2. Set default landing page to Bookings module
3. Configure timezone: Pacific Time (PT)
4. Set date format: MM/DD/YYYY
5. Configure dashboard: Show revenue widgets, hide weather
6. Save as "Operations Manager" preset
7. Demonstrate switching between presets

### Epic: Operational Configuration

#### Story 3: Venue Business Rules Configuration
**As a** Venue Admin  
**I want to** configure business rules and operational parameters  
**So that** the system operates according to our venue policies

**Acceptance Criteria:**
- [ ] Configure booking lead times and cancellation policies
- [ ] Set commission calculation rules and payment schedules
- [ ] Define promoter tier qualification requirements
- [ ] Configure automatic status update rules
- [ ] Set venue capacity limits and overbooking policies
- [ ] Define escalation rules for high-value bookings
- [ ] Configure working hours and blackout dates

**Demo Flow:**
1. Navigate to Settings → Venue Configuration
2. Set booking policies: 24-hour minimum lead time, 72-hour cancellation
3. Configure commission: Payment on 15th of each month
4. Set capacity limits: 200 guests maximum, 10% overbooking allowed
5. Define high-value booking threshold: $5,000+ requires admin approval
6. Set working hours: 9 AM - 11 PM daily
7. Preview impact on booking form and promoter dashboard

#### Story 4: Integration Management
**As a** Venue Admin  
**I want to** connect external systems to the PRIMA dashboard  
**So that** data flows seamlessly between our tools

**Acceptance Criteria:**
- [ ] Configure API connections to property management systems
- [ ] Set up email marketing platform integration
- [ ] Connect payment processing services
- [ ] Configure CRM system data synchronization
- [ ] Set up webhook endpoints for real-time updates
- [ ] Test integration connections and data flow
- [ ] Monitor integration health and error rates

**Demo Flow:**
1. Navigate to Settings → Integrations
2. Connect to "VenueManager Pro" PMS system
3. Configure data sync: Import guest data, export booking confirmations
4. Set up Mailchimp integration for promoter communications
5. Test webhook endpoint for real-time booking updates
6. Monitor integration dashboard: Show successful sync status
7. Demonstrate data flow from PMS to PRIMA dashboard

### Epic: Notification and Communication Settings

#### Story 5: Multi-Channel Notification Configuration
**As a** Venue Manager  
**I want to** configure when and how I receive notifications  
**So that** I stay informed without being overwhelmed

**Acceptance Criteria:**
- [ ] Configure email notification preferences by category
- [ ] Set up SMS alerts for urgent situations
- [ ] Configure in-app notification settings and frequency
- [ ] Set quiet hours and do-not-disturb periods
- [ ] Configure escalation rules for unread notifications
- [ ] Set team notification delegation rules
- [ ] Test notification delivery across all channels

**Demo Flow:**
1. Navigate to Settings → Notifications
2. Configure email: High-value bookings, daily summaries, urgent alerts
3. Set up SMS: Emergency situations only (no-shows for VIP events)
4. Configure in-app: Real-time booking updates, team messages
5. Set quiet hours: 10 PM - 8 AM, no non-urgent notifications
6. Test notification delivery with sample events
7. Show notification center with categorized messages

## 🏗️ Technical Architecture

### Data Models

```typescript
interface VenueSettings {
  id: string;
  venueId: string;
  category: 'general' | 'branding' | 'operations' | 'integrations' | 'notifications';
  
  // General Settings
  general: {
    timezone: string;
    defaultCurrency: string;
    dateFormat: string;
    timeFormat: '12h' | '24h';
    language: string;
    workingHours: WorkingHours;
    blackoutDates: string[];
  };
  
  // Branding Settings
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    theme: 'light' | 'dark' | 'auto';
    fontFamily?: string;
    customCSS?: string;
  };
  
  // Operational Settings
  operations: {
    bookingRules: BookingRules;
    commissionRules: CommissionRules;
    capacitySettings: CapacitySettings;
    escalationRules: EscalationRule[];
    autoStatusUpdate: boolean;
    overbookingPolicy: OverbookingPolicy;
  };
  
  // Integration Settings
  integrations: {
    pms: PMSIntegration;
    crm: CRMIntegration;
    email: EmailIntegration;
    payment: PaymentIntegration;
    webhooks: WebhookConfig[];
    apiKeys: APIKeyConfig[];
  };
  
  // Notification Settings
  notifications: {
    email: NotificationConfig;
    sms: NotificationConfig;
    inApp: NotificationConfig;
    quietHours: QuietHours;
    escalationRules: NotificationEscalation[];
  };
  
  // Metadata
  lastUpdated: string;
  updatedBy: string;
  version: number;
}

interface UserSettings {
  id: string;
  userId: string;
  venueId?: string; // null for global user settings
  
  // Personal Preferences
  preferences: {
    theme: 'light' | 'dark' | 'auto' | 'venue_default';
    language: string;
    timezone?: string; // override venue default
    dateFormat?: string;
    defaultLandingPage: string;
    layoutPresets: LayoutPreset[];
    activePreset: string;
  };
  
  // Dashboard Configuration
  dashboard: {
    widgetLayout: DashboardWidget[];
    defaultFilters: Record<string, any>;
    tableSettings: TableSettings;
    chartPreferences: ChartPreferences;
  };
  
  // Notification Preferences
  notifications: {
    email: UserNotificationConfig;
    sms: UserNotificationConfig;
    inApp: UserNotificationConfig;
    quietHours?: QuietHours; // override venue default
  };
  
  // Accessibility Settings
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reduceMotion: boolean;
    screenReaderOptimized: boolean;
  };
  
  lastUpdated: string;
}

interface IntegrationConnection {
  id: string;
  venueId: string;
  type: 'pms' | 'crm' | 'email' | 'payment' | 'webhook' | 'custom';
  name: string;
  provider: string;
  
  // Configuration
  config: {
    endpoint?: string;
    apiKey?: string;
    credentials?: EncryptedCredentials;
    parameters: Record<string, any>;
    syncSettings: SyncSettings;
  };
  
  // Status and Health
  status: 'active' | 'inactive' | 'error' | 'testing';
  lastSync?: string;
  lastError?: string;
  healthCheck: {
    isHealthy: boolean;
    lastCheck: string;
    errorCount: number;
    responseTime: number;
  };
  
  // Data Mapping
  fieldMappings: FieldMapping[];
  transformRules: TransformRule[];
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface SettingsTemplate {
  id: string;
  name: string;
  description: string;
  category: 'venue_type' | 'region' | 'size' | 'custom';
  
  // Template Configuration
  settings: Partial<VenueSettings>;
  applicableVenueTypes: string[];
  
  // Metadata
  isPublic: boolean;
  isSystem: boolean;
  usage: number;
  rating: number;
  
  createdAt: string;
  createdBy: string;
}
```

### API Endpoints

```typescript
// Settings Management
GET    /api/venues/:venueId/settings
PUT    /api/venues/:venueId/settings
GET    /api/venues/:venueId/settings/:category
PUT    /api/venues/:venueId/settings/:category

// User Settings
GET    /api/users/:userId/settings
PUT    /api/users/:userId/settings
GET    /api/users/:userId/settings/venues/:venueId
PUT    /api/users/:userId/settings/venues/:venueId

// Theme Management
GET    /api/venues/:venueId/themes/current
PUT    /api/venues/:venueId/themes/current
POST   /api/venues/:venueId/themes/preview
GET    /api/themes/templates
POST   /api/venues/:venueId/themes/export
POST   /api/venues/:venueId/themes/import

// Integration Management
GET    /api/venues/:venueId/integrations
POST   /api/venues/:venueId/integrations
GET    /api/venues/:venueId/integrations/:integrationId
PUT    /api/venues/:venueId/integrations/:integrationId
DELETE /api/venues/:venueId/integrations/:integrationId
POST   /api/venues/:venueId/integrations/:integrationId/test
GET    /api/venues/:venueId/integrations/:integrationId/health

// Settings Templates
GET    /api/settings/templates
GET    /api/settings/templates/:templateId
POST   /api/settings/templates
PUT    /api/settings/templates/:templateId
POST   /api/venues/:venueId/settings/apply-template/:templateId

// Configuration Export/Import
POST   /api/venues/:venueId/settings/export
POST   /api/venues/:venueId/settings/import
GET    /api/venues/:venueId/settings/backup
POST   /api/venues/:venueId/settings/restore/:backupId
```

### RTK Query Hooks

```typescript
// Settings Management Hooks
export const useVenueSettingsQuery = (venueId: string) => { /* ... */ };
export const useUpdateVenueSettingsMutation = () => { /* ... */ };
export const useUserSettingsQuery = (userId: string, venueId?: string) => { /* ... */ };
export const useUpdateUserSettingsMutation = () => { /* ... */ };

// Theme Management Hooks
export const useCurrentThemeQuery = (venueId: string) => { /* ... */ };
export const useUpdateThemeMutation = () => { /* ... */ };
export const usePreviewThemeMutation = () => { /* ... */ };
export const useThemeTemplatesQuery = () => { /* ... */ };

// Integration Hooks
export const useIntegrationsQuery = (venueId: string) => { /* ... */ };
export const useCreateIntegrationMutation = () => { /* ... */ };
export const useUpdateIntegrationMutation = () => { /* ... */ };
export const useTestIntegrationMutation = () => { /* ... */ };
export const useIntegrationHealthQuery = (venueId: string, integrationId: string) => { /* ... */ };

// Template Hooks
export const useSettingsTemplatesQuery = () => { /* ... */ };
export const useApplyTemplateMutation = () => { /* ... */ };
export const useExportSettingsMutation = () => { /* ... */ };
export const useImportSettingsMutation = () => { /* ... */ };
```

## 🎨 UI/UX Design Specifications

### Main Settings Dashboard

```typescript
// Route: /settings
export default function SettingsPage() {
  return (
    <div className="settings-layout">
      <SettingsHeader />
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-1">
          <SettingsNavigationSidebar />
        </div>
        <div className="lg:col-span-4">
          <SettingsContent />
        </div>
      </div>
    </div>
  );
}
```

### Component Specifications

#### ThemeCustomizer
```typescript
interface ThemeCustomizerProps {
  currentTheme: ThemeConfig;
  onThemeChange: (theme: ThemeConfig) => void;
  onPreview: (theme: ThemeConfig) => void;
  onSave: (theme: ThemeConfig) => void;
  onReset: () => void;
}

// Features:
// - Real-time color picker with accessibility validation
// - Logo upload with automatic resizing and optimization
// - Live preview pane showing theme across different modules
// - Accessibility checker for color contrast ratios
// - Theme template gallery with one-click application
// - Export/import theme configuration
```

#### IntegrationManager
```typescript
interface IntegrationManagerProps {
  integrations: IntegrationConnection[];
  availableIntegrations: IntegrationTemplate[];
  onConnect: (integration: IntegrationTemplate) => void;
  onDisconnect: (integrationId: string) => void;
  onTest: (integrationId: string) => void;
  onConfigure: (integrationId: string) => void;
}

// Features:
// - Integration cards with status indicators and health metrics
// - Quick setup wizard for popular integrations
// - Configuration form with field validation and testing
// - Health monitoring dashboard with error logs
// - Data sync status and mapping configuration
// - Webhook testing and debugging tools
```

#### NotificationCenter
```typescript
interface NotificationCenterProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  onTestNotification: (channel: NotificationChannel, type: string) => void;
  templates: NotificationTemplate[];
}

// Features:
// - Channel-specific configuration (Email, SMS, In-App)
// - Notification type toggles with custom frequency settings
// - Template editor for customizing notification content
// - Test functionality with preview and delivery confirmation
// - Quiet hours configuration with timezone support
// - Escalation rules for critical notifications
```

#### SettingsSearchAndFilter
```typescript
interface SettingsSearchAndFilterProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  onQuickAction: (action: string) => void;
  categories: SettingsCategory[];
}

// Features:
// - Global settings search with instant results
// - Category filtering with breadcrumb navigation
// - Quick actions: Reset to defaults, Export all, Import backup
// - Recent changes timeline with undo capability
// - Bookmark frequently used settings
// - Settings comparison between venues
```

### Mobile Responsiveness

#### Breakpoint Specifications
- **Mobile (< 768px)**: Stacked layout, accordion-style settings groups
- **Tablet (768px - 1024px)**: 2-column layout, collapsible navigation
- **Desktop (> 1024px)**: Full 5-column layout with expanded preview panes

#### Mobile-Specific Features
- **Touch-Optimized Controls**: Large color pickers, easy toggle switches
- **Swipe Navigation**: Navigate between settings categories
- **Simplified Integration Setup**: Step-by-step mobile-friendly wizards
- **Quick Settings Panel**: Frequently used settings in accessible drawer

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('ThemeEngine', () => {
  it('applies theme correctly across all components', () => {
    // Test theme application and CSS variable updates
  });
  
  it('validates accessibility requirements for custom colors', () => {
    // Test color contrast and accessibility validation
  });
  
  it('handles theme persistence and restoration', () => {
    // Test theme saving and loading
  });
});

describe('IntegrationManager', () => {
  it('establishes connections with external services', () => {
    // Test integration connection setup
  });
  
  it('handles connection failures gracefully', () => {
    // Test error handling and retry logic
  });
  
  it('validates and transforms data correctly', () => {
    // Test data mapping and transformation
  });
});
```

### Integration Tests
```typescript
describe('Settings Integration', () => {
  it('applies venue settings across all modules', async () => {
    // Test settings propagation to other modules
  });
  
  it('syncs user preferences across sessions', async () => {
    // Test user settings persistence
  });
  
  it('maintains integration health and monitoring', async () => {
    // Test integration monitoring and alerting
  });
});
```

### E2E Test Scenarios
```typescript
describe('Settings Configuration Demo Flow', () => {
  it('completes full venue setup and customization', async () => {
    // 1. Configure venue branding and theme
    // 2. Set up operational business rules
    // 3. Connect external integrations
    // 4. Configure notification preferences
    // 5. Test and validate all settings
  });
});
```

## 📊 Performance Requirements

### Load Time Targets
- **Settings Dashboard**: < 1.5s initial load with all categories
- **Theme Preview**: < 200ms real-time theme updates
- **Integration Health Check**: < 500ms connection testing
- **Settings Search**: < 100ms instant search results

### Scalability Considerations
- **Settings Volume**: Support 500+ configurable settings per venue
- **Integration Connections**: Handle 50+ simultaneous integrations
- **Theme Variants**: Support unlimited custom theme configurations
- **User Preferences**: Scale to 10,000+ users with individual settings

### Caching Strategy
```typescript
// RTK Query cache configuration
const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: fetchBaseQuery({ /* ... */ }),
  tagTypes: ['VenueSettings', 'UserSettings', 'Integration', 'Theme'],
  endpoints: (builder) => ({
    getVenueSettings: builder.query({
      providesTags: ['VenueSettings'],
      keepUnusedDataFor: 1800, // 30 minutes - stable settings
    }),
    getUserSettings: builder.query({
      providesTags: ['UserSettings'],
      keepUnusedDataFor: 900, // 15 minutes - user preferences
    }),
    getIntegrations: builder.query({
      providesTags: ['Integration'],
      keepUnusedDataFor: 300, // 5 minutes - integration status
    }),
  }),
});
```

## 🔗 Module Integration

### Global Settings Application
- **Theme Engine**: Apply venue branding across all modules automatically
- **Business Rules**: Enforce operational settings in relevant modules
- **User Preferences**: Apply personal settings globally across user session
- **Integration Data**: Sync external data across all relevant modules

### Cross-Module Settings Sync
- **Booking Module**: Apply booking rules, lead times, and capacity limits
- **Finance Module**: Use commission calculation rules and payment schedules
- **Promoters Module**: Apply tier qualification rules and performance metrics
- **Team Module**: Enforce notification preferences and access controls

### Real-Time Settings Propagation
```typescript
// Settings change notification system
const useSettingsSync = () => {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const settingsSubscription = settingsEventEmitter.on('settingsChanged', (changes) => {
      // Propagate settings changes to relevant modules
      dispatch(updateGlobalSettings(changes));
      
      // Refresh affected module data
      if (changes.includes('bookingRules')) {
        dispatch(bookingsApi.util.invalidateTags(['Booking']));
      }
      
      if (changes.includes('theme')) {
        document.documentElement.style.setProperty('--primary', changes.theme.primaryColor);
      }
    });
    
    return () => settingsSubscription.unsubscribe();
  }, [dispatch]);
};
```

## 🚀 Implementation Notes

### Phase 1: Foundation (MVP)
- [ ] Basic venue settings configuration
- [ ] Light/dark theme switching
- [ ] User preference management
- [ ] Essential notification settings

### Phase 2: Customization & Integration
- [ ] Custom theme creation with branding
- [ ] External integration setup and management
- [ ] Advanced notification configuration
- [ ] Settings templates and presets

### Phase 3: Advanced Features
- [ ] Dynamic settings with conditional logic
- [ ] Advanced integration monitoring and analytics
- [ ] AI-powered settings recommendations
- [ ] Multi-venue settings synchronization

### Development Priorities
1. **Settings Engine**: Build robust settings storage and retrieval system
2. **Theme System**: Implement dynamic theming with CSS custom properties
3. **Integration Framework**: Create flexible integration management system
4. **User Interface**: Design intuitive settings management interface
5. **Sync Mechanism**: Develop real-time settings propagation across modules

### Technical Considerations
- **Security**: Encrypt sensitive integration credentials and API keys
- **Validation**: Comprehensive validation for all settings to prevent system issues
- **Backup**: Automatic settings backup before major changes
- **Rollback**: Ability to revert settings changes if issues occur
- **Audit**: Track all settings changes for compliance and troubleshooting

---

The Settings module serves as the control center for venue customization and system configuration, enabling venues to tailor the PRIMA Partner Dashboard to their specific needs while maintaining consistency and reliability. Focus on creating an intuitive interface that makes complex configuration feel simple and accessible.
