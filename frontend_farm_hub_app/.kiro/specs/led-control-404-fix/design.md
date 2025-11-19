# Design Document

## Overview

This design addresses the 404 errors in the LED control system by implementing proper error handling, fixing missing imports, and providing graceful degradation when backend services are unavailable. The solution focuses on improving user experience while maintaining system reliability.

## Architecture

### Error Handling Strategy

- **Centralized Error Handler**: Create a utility function to handle different types of API errors
- **Graceful Degradation**: Provide mock responses when endpoints are unavailable
- **User Feedback**: Clear, actionable error messages for different scenarios

### Component Structure

```
LED Control System
├── Error Handler Utility
├── API Service Layer
├── UI Components (with proper imports)
└── Mock Data Provider
```

## Components and Interfaces

### 1. API Error Handler (`utils/apiErrorHandler.js`)

```javascript
// Centralized error handling for API requests
export const handleApiError = (error, context) => {
  // Returns structured error response with user-friendly messages
};

export const isEndpointAvailable = async (url) => {
  // Checks if endpoint exists before making requests
};
```

### 2. Enhanced LED Control Component

- **Proper Imports**: Add missing Alert and ActivityIndicator imports to fanControl.jsx
- **Error Boundaries**: Wrap API calls with try-catch blocks that use the error handler
- **Fallback UI**: Show appropriate messages when features are unavailable

### 3. API Service Layer (`services/ledService.js`)

```javascript
// Abstracted API calls with built-in error handling
export const ledService = {
  setMode: async (mode) => {
    /* ... */
  },
  toggleLed: async (action) => {
    /* ... */
  },
  setIlluminance: async (value) => {
    /* ... */
  },
};
```

## Data Models

### Error Response Structure

```javascript
{
  success: boolean,
  error: {
    type: 'NETWORK_ERROR' | 'ENDPOINT_NOT_FOUND' | 'SERVER_ERROR',
    message: string,
    userMessage: string,
    canRetry: boolean
  },
  data: any | null
}
```

### API Endpoint Status

```javascript
{
  endpoint: string,
  available: boolean,
  lastChecked: timestamp,
  mockAvailable: boolean
}
```

## Error Handling

### Error Categories

1. **Network Errors**: Server unreachable

   - User Message: "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요."
   - Action: Retry button, offline mode suggestion

2. **404 Endpoint Errors**: Feature not implemented

   - User Message: "이 기능은 아직 개발 중입니다. 곧 사용할 수 있습니다."
   - Action: Hide feature or show "Coming Soon" status

3. **Server Errors**: 5xx responses
   - User Message: "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
   - Action: Retry button with exponential backoff

### Error Recovery Strategies

- **Automatic Retry**: For transient network errors (max 3 attempts)
- **Mock Mode**: Provide simulated responses for testing
- **Graceful Degradation**: Disable unavailable features without breaking the app

## Testing Strategy

### Unit Tests

- Error handler utility functions
- API service layer methods
- Component error states

### Integration Tests

- End-to-end error scenarios
- Network failure simulation
- Backend unavailability testing

### Manual Testing Scenarios

1. **Server Offline**: Test app behavior when Python server is down
2. **Missing Endpoints**: Test 404 handling for unimplemented features
3. **Network Issues**: Test intermittent connectivity problems
4. **Import Validation**: Verify all components render without import errors

## Implementation Approach

### Phase 1: Fix Immediate Issues

1. Add missing imports (Alert, ActivityIndicator) to fanControl.jsx
2. Implement basic error handling in existing API calls
3. Add user-friendly error messages

### Phase 2: Enhanced Error Handling

1. Create centralized error handler utility
2. Implement API service layer
3. Add endpoint availability checking

### Phase 3: Graceful Degradation

1. Add mock data providers
2. Implement offline mode indicators
3. Add retry mechanisms

## Design Decisions

### Why Centralized Error Handling?

- **Consistency**: Same error handling logic across all components
- **Maintainability**: Single place to update error handling behavior
- **User Experience**: Consistent error messages and recovery options

### Why API Service Layer?

- **Abstraction**: Hide complex error handling from UI components
- **Reusability**: Same service can be used by multiple components
- **Testing**: Easier to mock and test API interactions

### Why Mock Responses?

- **Development**: Allow frontend development without complete backend
- **Testing**: Reliable test scenarios without external dependencies
- **Demonstration**: Show app functionality even when backend is unavailable
