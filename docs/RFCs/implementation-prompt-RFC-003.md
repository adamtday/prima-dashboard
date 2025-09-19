# Implementation Prompt - RFC-003: Layout Shell & Multi-Venue Navigation

## Overview
You are implementing RFC-003 (Layout Shell & Multi-Venue Navigation) for the PRIMA Partner Dashboard. This RFC focuses on creating the PRIMA layout structure with multi-venue navigation and venue context switching and builds upon all previously completed RFCs (001-002).

## Context
This is part of a sequential implementation plan where each RFC builds upon the previous ones. You MUST ensure that your implementation:
1. Integrates seamlessly with all existing functionality from previous RFCs
2. Follows the established patterns and conventions from earlier implementations
3. Uses the existing design system (OKLCH color space) without modifications
4. Maintains compatibility with the overall application architecture

## Pre-Implementation Checklist
Before starting implementation, verify that you have:
- [ ] Read and understood the complete RFC-003 specification
- [ ] Reviewed all previously implemented RFCs (001-002) for context
- [ ] Confirmed understanding of the existing codebase structure
- [ ] Identified any existing components or utilities that can be reused
- [ ] Planned the implementation approach to minimize breaking changes

## Implementation Requirements

### Technical Constraints
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript in strict mode
- **UI Library**: shadcn/ui components (preserve existing design tokens)
- **State Management**: RTK Query for server state, React Context for UI state
- **Styling**: Tailwind CSS with existing design token system
- **Testing**: Jest + Testing Library for unit tests, Playwright for E2E
- **Mocking**: MSW (Mock Service Worker) for API simulation

### Code Quality Standards
- All TypeScript types must be properly defined
- Components must be accessible (WCAG 2.1 AA)
- All user interactions must have loading and error states
- Mobile-first responsive design required
- All functions and components must be properly tested
- Follow established naming conventions from previous RFCs

### Performance Requirements
- Page load times must be under 2 seconds
- User interactions must respond within 200ms
- Tables must handle 1000+ rows efficiently
- Images must be optimized and use appropriate loading strategies
- Bundle size impact should be minimized

### Design System Compliance
- MUST use existing OKLCH color tokens from globals.css
- MUST NOT modify existing design tokens or create new ones
- MUST use existing shadcn/ui components and patterns
- MUST follow established spacing and typography scales
- MUST support both light and dark themes

## Implementation Process

### Phase 1: Planning and Setup
1. **File Structure**: Create necessary directories and files following established patterns
2. **Type Definitions**: Define TypeScript interfaces and types for new features
3. **Component Architecture**: Plan component hierarchy and data flow
4. **API Contracts**: Define API endpoints and data structures for MSW handlers

### Phase 2: Core Implementation
1. **Data Layer**: Implement RTK Query endpoints and MSW handlers
2. **Components**: Build UI components following design system guidelines
3. **Business Logic**: Implement core functionality with proper error handling
4. **Integration**: Connect components to data layer and existing state management

### Phase 3: Testing and Validation
1. **Unit Tests**: Write comprehensive tests for all new functions and components
2. **Integration Tests**: Test component interactions and data flow
3. **Accessibility Testing**: Verify WCAG compliance and keyboard navigation
4. **Cross-browser Testing**: Ensure compatibility across target browsers

### Phase 4: Documentation and Cleanup
1. **Code Documentation**: Add JSDoc comments for complex functions
2. **Type Safety**: Ensure all TypeScript errors are resolved
3. **Performance Optimization**: Optimize for loading times and responsiveness
4. **Final Testing**: Run full test suite and fix any regressions

## Success Criteria
Your implementation will be considered complete when:
- [ ] All requirements from RFC-003 are fully implemented
- [ ] All existing functionality from previous RFCs continues to work
- [ ] All automated tests pass (unit, integration, E2E)
- [ ] Application loads and runs without errors
- [ ] Design system integrity is maintained
- [ ] Performance benchmarks are met
- [ ] Accessibility standards are satisfied
- [ ] Code follows established patterns and conventions

## Common Pitfalls to Avoid
- Do not modify existing design tokens or color values
- Do not introduce breaking changes to existing components
- Do not skip accessibility considerations
- Do not hardcode values that should be configurable
- Do not ignore error handling and loading states
- Do not implement features beyond the scope of this RFC
- Do not deviate from established file and naming conventions

## Integration Points
When implementing this RFC, pay special attention to:
- How new features integrate with existing navigation and layout
- How new data flows through the existing state management system
- How new components interact with existing UI patterns
- How new API endpoints fit into the existing MSW handler structure
- How new routes integrate with the existing routing structure

## Testing Strategy
Your implementation must include:
- Unit tests for all new utility functions
- Component tests for all new UI components
- Integration tests for new user flows
- API tests for new MSW handlers
- Accessibility tests for new interfaces
- Performance tests for new features that might impact load times

## Submission Guidelines
When submitting your implementation:
1. Ensure all files are properly formatted and linted
2. Include comprehensive commit messages describing changes
3. Verify that the application builds and runs without errors
4. Run the full test suite and ensure all tests pass
5. Test the implementation manually to verify functionality
6. Document any notable implementation decisions or trade-offs

## Support Resources
- RFC-003 specification document (primary reference)
- Previous RFC implementations for patterns and examples
- Design system documentation in docs/design/
- Architecture documentation in docs/architecture/
- Existing codebase for patterns and conventions
- Testing strategy documentation in docs/testing/

Remember: This implementation will serve as the foundation for future RFCs, so maintainability and code quality are critical.
