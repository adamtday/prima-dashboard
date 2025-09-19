# Bookings Management

The Bookings module provides comprehensive booking management capabilities, including status controls, filtering, bulk operations, and detailed booking information management.

## 🎯 Module Purpose

**Primary Goal**: Enable partners to efficiently manage all venue bookings with real-time status updates, comprehensive filtering, and seamless integration with promoter and financial systems.

**Key Value**: Centralized booking operations with optimistic updates, role-based permissions, and export capabilities.

## 📊 Core Features

### Booking Table
Advanced data table with comprehensive functionality:

1. **Status Management** - Update booking status with optimistic UI updates
2. **Advanced Filtering** - Multi-dimensional filtering by status, date, promoter, source
3. **Bulk Operations** - Select multiple bookings for batch status updates
4. **Sorting & Pagination** - Client and server-side sorting with virtual scrolling
5. **Export Capabilities** - CSV/Excel export with role-based data masking

### Status Controls
Real-time booking status management:
- **CONFIRMED** → **NO_SHOW** / **CANCELLED**
- **PENDING** → **CONFIRMED** / **CANCELLED** 
- Undo capability for recent status changes (10-second window)
- Audit trail for all status modifications

### Overlays & Visualizations
Interactive data overlays:
1. **Revenue Overlay** - Visual revenue indicators per booking
2. **Booking Density** - Time-based booking concentration
3. **No-Show Percentage** - Historical no-show rate tracking
4. **Cancellation Patterns** - Cancellation timing analysis

## 🎨 UI Specifications

### Layout Structure
```tsx
<div className="space-y-6">
  <BookingsHeader />
  <BookingsFilters />
  <BookingsTabs>
    <TabsContent value="overview">
      <BookingsOverlay />
      <BookingsTable />
    </TabsContent>
    <TabsContent value="calendar">
      <BookingsCalendar />
    </TabsContent>
    <TabsContent value="analytics">
      <BookingsAnalytics />
    </TabsContent>
  </BookingsTabs>
</div>
```

### Table Configuration
```typescript
interface BookingTableColumn {
  id: string
  header: string
  accessorKey: string
  cell?: (info: any) => React.ReactNode
  sortable?: boolean
  filterable?: boolean
  exportable?: boolean
  roleAccess?: UserRole[]
}

const bookingColumns: BookingTableColumn[] = [
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    sortable: true,
    filterable: true,
  },
  {
    id: 'guestName',
    header: 'Guest',
    accessorKey: 'guestName',
    cell: ({ row }) => <MaskedField value={row.original.guestName} />,
    roleAccess: ['ADMIN'],
  },
  {
    id: 'diners',
    header: 'Diners',
    accessorKey: 'diners',
    sortable: true,
  },
  {
    id: 'bookingTime',
    header: 'Time',
    accessorKey: 'bookingTime',
    cell: ({ row }) => formatTime(row.original.bookingTime),
    sortable: true,
  },
  {
    id: 'promoter',
    header: 'Promoter',
    accessorKey: 'promoter.name',
    cell: ({ row }) => <PromoterLink promoter={row.original.promoter} />,
    filterable: true,
  },
  {
    id: 'revenue',
    header: 'Revenue',
    accessorKey: 'fee',
    cell: ({ row }) => <CurrencyDisplay amount={row.original.fee} />,
    sortable: true,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <BookingActions booking={row.original} />,
    exportable: false,
  },
]
```

### Filter Panel
```tsx
interface BookingsFilters {
  status: BookingStatus[]
  dateRange: { from: Date; to: Date }
  promoters: string[]
  source: BookingSource[]
  diners: { min: number; max: number }
  revenue: { min: number; max: number }
}

<FiltersPanel>
  <StatusFilter />
  <DateRangeFilter />
  <PromoterFilter />
  <SourceFilter />
  <DinersRangeFilter />
  <RevenueRangeFilter />
  <FilterActions>
    <ClearFilters />
    <SaveView />
    <ExportFiltered />
  </FilterActions>
</FiltersPanel>
```

## 📈 Data Requirements

### Booking Data Model
```typescript
interface Booking {
  id: string
  venueId: string
  promoterId?: string
  guestName: string
  guestEmail: string
  guestPhone: string
  diners: number
  bookingTime: Date
  createdAt: Date
  updatedAt: Date
  status: BookingStatus
  source: BookingSource
  type: 'PRIME' | 'NON_PRIME'
  fee: number
  platformFee: number
  notes?: string
  metadata: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }
}

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW'
type BookingSource = 'DIRECT' | 'PROMOTER' | 'PARTNER' | 'WALK_IN'
```

### API Endpoints
```typescript
// GET /api/bookings
interface GetBookingsRequest {
  venueId?: string
  status?: BookingStatus[]
  from?: string
  to?: string
  promoterIds?: string[]
  source?: BookingSource[]
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
}

interface GetBookingsResponse {
  items: Booking[]
  total: number
  page: number
  size: number
  hasNext: boolean
  filters: {
    appliedFilters: Record<string, any>
    availablePromoteurs: { id: string; name: string }[]
  }
}

// PATCH /api/bookings/:id
interface UpdateBookingRequest {
  status?: BookingStatus
  notes?: string
}

// POST /api/bookings/bulk-update
interface BulkUpdateRequest {
  bookingIds: string[]
  updates: UpdateBookingRequest
}
```

## 🔄 Interactions & Behaviors

### Status Management
```typescript
const useBookingStatusUpdate = () => {
  const [updateBooking] = useUpdateBookingMutation()
  const [recentActions, setRecentActions] = useState<StatusAction[]>([])
  
  const updateStatus = async (bookingId: string, status: BookingStatus) => {
    const action: StatusAction = {
      id: Date.now().toString(),
      bookingId,
      previousStatus: getCurrentStatus(bookingId),
      newStatus: status,
      timestamp: new Date(),
    }
    
    // Add to undo queue
    setRecentActions(prev => [action, ...prev.slice(0, 4)])
    
    try {
      await updateBooking({ id: bookingId, status }).unwrap()
      toast.success(`Booking marked as ${status.toLowerCase()}`)
    } catch (error) {
      toast.error('Failed to update booking status')
    }
  }
  
  const undoStatusChange = async (action: StatusAction) => {
    await updateBooking({ 
      id: action.bookingId, 
      status: action.previousStatus 
    }).unwrap()
    
    setRecentActions(prev => prev.filter(a => a.id !== action.id))
    toast.success('Status change undone')
  }
  
  return { updateStatus, undoStatusChange, recentActions }
}
```

### Bulk Operations
```typescript
const useBulkBookingOperations = () => {
  const [selectedBookings, setSelectedBookings] = useState<string[]>([])
  const [bulkUpdate] = useBulkUpdateBookingsMutation()
  
  const selectAll = (bookings: Booking[]) => {
    setSelectedBookings(bookings.map(b => b.id))
  }
  
  const selectNone = () => {
    setSelectedBookings([])
  }
  
  const bulkUpdateStatus = async (status: BookingStatus) => {
    if (selectedBookings.length === 0) return
    
    await bulkUpdate({
      bookingIds: selectedBookings,
      updates: { status }
    }).unwrap()
    
    toast.success(`Updated ${selectedBookings.length} bookings`)
    setSelectedBookings([])
  }
  
  return {
    selectedBookings,
    selectAll,
    selectNone,
    bulkUpdateStatus,
    selectedCount: selectedBookings.length,
  }
}
```

### Advanced Filtering
```typescript
const useBookingsFilters = () => {
  const [filters, setFilters] = useState<BookingsFilters>({
    status: [],
    dateRange: { from: startOfMonth(new Date()), to: new Date() },
    promoters: [],
    source: [],
    diners: { min: 1, max: 20 },
    revenue: { min: 0, max: 1000 },
  })
  
  const applyFilter = (key: keyof BookingsFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }
  
  const clearFilters = () => {
    setFilters(initialFilters)
  }
  
  const saveView = (name: string) => {
    const view = { name, filters }
    // Save to user preferences
    saveUserView('bookings', view)
    toast.success(`View "${name}" saved`)
  }
  
  return { filters, applyFilter, clearFilters, saveView }
}
```

## 📱 Responsive Design

### Mobile Layout (< 768px)
```tsx
<div className="space-y-4">
  {/* Compact filters */}
  <MobileFilters />
  
  {/* Card-based booking list */}
  <div className="space-y-3">
    {bookings.map(booking => (
      <BookingCard key={booking.id} booking={booking} />
    ))}
  </div>
  
  {/* Sticky bulk actions */}
  {selectedCount > 0 && (
    <MobileBulkActions selectedCount={selectedCount} />
  )}
</div>
```

### Tablet Layout (768px - 1024px)
```tsx
<div className="space-y-6">
  {/* Collapsible filters sidebar */}
  <div className="flex gap-6">
    <aside className="w-64">
      <FiltersPanel />
    </aside>
    <main className="flex-1">
      <BookingsTable />
    </main>
  </div>
</div>
```

### Desktop Layout (> 1024px)
```tsx
<div className="space-y-6">
  {/* Full filters panel */}
  <FiltersPanel />
  
  {/* Data overlays */}
  <BookingsOverlays />
  
  {/* Full-featured table */}
  <BookingsTable />
  
  {/* Bottom pagination and export */}
  <TableFooter />
</div>
```

## ⚡ Performance Optimization

### Virtual Scrolling
```typescript
const VirtualizedBookingsTable = () => {
  const rowVirtualizer = useVirtualizer({
    count: bookings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // 60px per row
    overscan: 10,
  })
  
  return (
    <div ref={parentRef} className="h-96 overflow-auto">
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => (
          <BookingRow
            key={virtualRow.index}
            booking={bookings[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

### Optimistic Updates
```typescript
const optimisticUpdateConfig = {
  updateBooking: {
    onQueryStarted: async ({ id, ...update }, { dispatch, queryFulfilled }) => {
      // Optimistic update
      const patchResult = dispatch(
        bookingsApi.util.updateQueryData('getBookings', {}, (draft) => {
          const booking = draft.items.find(b => b.id === id)
          if (booking) {
            Object.assign(booking, update)
          }
        })
      )
      
      try {
        await queryFulfilled
      } catch {
        // Revert on error
        patchResult.undo()
      }
    },
  },
}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
describe('Bookings Table', () => {
  test('renders booking data correctly', () => {
    const mockBookings = [
      { id: '1', guestName: 'John Doe', diners: 4, status: 'CONFIRMED' }
    ]
    
    render(<BookingsTable bookings={mockBookings} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('CONFIRMED')).toBeInTheDocument()
  })
  
  test('handles status updates', async () => {
    const mockUpdate = jest.fn()
    render(<BookingsTable onUpdateStatus={mockUpdate} />)
    
    const statusButton = screen.getByRole('button', { name: /change status/i })
    fireEvent.click(statusButton)
    
    const noShowOption = screen.getByText('No Show')
    fireEvent.click(noShowOption)
    
    expect(mockUpdate).toHaveBeenCalledWith('1', 'NO_SHOW')
  })
})
```

### Integration Tests
```typescript
describe('Bookings Integration', () => {
  test('filters and sorts bookings correctly', async () => {
    render(<BookingsPage />)
    
    // Apply status filter
    const statusFilter = screen.getByLabelText('Status Filter')
    fireEvent.change(statusFilter, { target: { value: 'CONFIRMED' } })
    
    // Wait for API call
    await waitFor(() => {
      expect(screen.getAllByText('CONFIRMED')).toHaveLength(5)
    })
    
    // Apply sort
    const sortButton = screen.getByText('Sort by Date')
    fireEvent.click(sortButton)
    
    // Verify order
    const dates = screen.getAllByTestId('booking-date')
    expect(dates[0]).toHaveTextContent('2025-01-15')
    expect(dates[1]).toHaveTextContent('2025-01-14')
  })
})
```

## 📋 Acceptance Criteria

### Core Functionality
- [ ] Table displays all bookings with correct data and formatting
- [ ] Status updates work with optimistic UI and error handling
- [ ] Bulk operations support multi-select and batch updates
- [ ] Filtering works across all supported dimensions
- [ ] Sorting works for all sortable columns
- [ ] Pagination handles large datasets efficiently

### Data Integration
- [ ] Real-time updates reflect booking changes immediately
- [ ] Status changes propagate to Overview and Finance modules
- [ ] Role-based data masking applies consistently
- [ ] Export includes proper watermarking and role filtering

### User Experience
- [ ] Mobile layout is fully functional and touch-friendly
- [ ] Loading states display during data operations
- [ ] Error states provide clear feedback and recovery options
- [ ] Undo functionality works for recent status changes
- [ ] Keyboard navigation supports all table operations

### Performance
- [ ] Virtual scrolling handles 1000+ bookings smoothly
- [ ] Filter operations complete in < 200ms
- [ ] Optimistic updates feel instantaneous
- [ ] Memory usage remains stable during extended use

## 🔧 Implementation Priority

### Phase 1 (Critical)
1. Basic table with status management
2. Core filtering (status, date, promoter)
3. Optimistic status updates
4. Mobile-responsive layout

### Phase 2 (Important)
5. Bulk operations and multi-select
6. Advanced filtering and sorting
7. Export functionality with role masking
8. Undo/redo for status changes

### Phase 3 (Enhancement)
9. Virtual scrolling for performance
10. Advanced overlays and visualizations
11. Saved views and preferences
12. Calendar view integration

---

The Bookings module serves as the operational heart of the PRIMA Partner Dashboard, handling the majority of day-to-day venue management tasks with efficiency and precision.
