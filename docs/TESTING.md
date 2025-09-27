# Testing Guide

This document outlines the testing strategy and guidelines for the FindFreebie application.

## Testing Strategy

### Unit Testing
- **Purpose**: Test individual functions and components in isolation
- **Tools**: Jest, React Testing Library
- **Location**: `__tests__` directories next to components
- **Coverage Goal**: 80%+

### Integration Testing
- **Purpose**: Test interactions between components
- **Tools**: React Testing Library
- **Location**: `__tests__/integration/`

### End-to-End (E2E) Testing
- **Purpose**: Test complete user flows
- **Tools**: Detox
- **Location**: `e2e/`

### Manual Testing
- **Purpose**: Verify UI/UX and edge cases
- **Process**: Test on multiple devices and OS versions

## Setup

### Prerequisites
- Node.js v16+
- npm or yarn
- Xcode (for iOS testing)
- Android Studio (for Android testing)

### Installation

1. Install dependencies:
   ```bash
   npm install --save-dev jest @testing-library/react-native @testing-library/jest-native @testing-library/react-hooks
   ```

2. Add test scripts to `package.json`:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "test:e2e": "detox test -c ios.sim.debug"
     }
   }
   ```

## Writing Tests

### Component Tests

Example test for a simple component:

```typescript
// components/__tests__/LoadingIndicator.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingIndicator from '../LoadingIndicator';

describe('LoadingIndicator', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<LoadingIndicator />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('applies custom size', () => {
    const { getByTestId } = render(<LoadingIndicator size="large" />);
    const indicator = getByTestId('loading-indicator');
    // Add appropriate assertions
  });
});
```

### Hook Tests

Example test for a custom hook:

```typescript
// hooks/__tests__/useAuth.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '../useAuth';

describe('useAuth', () => {
  it('returns initial auth state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
  });
});
```

### Mocking

#### API Calls

```typescript
// __mocks__/@react-navigation/native.ts
export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
});

// In your test file
jest.mock('@react-navigation/native');
```

#### Native Modules

```typescript
// __mocks__/react-native-maps/MapView.tsx
import React from 'react';
import { View } from 'react-native';

export const Marker = (props: any) => <View testID="mock-marker" {...props} />;
export const Callout = (props: any) => <View testID="mock-callout" {...props} />;

export default function MapView(props: any) {
  return <View testID="mock-map-view" {...props} />;
}
```

## E2E Testing with Detox

### Setup

1. Install Detox:
   ```bash
   npm install -g detox-cli
   npm install --save-dev detox
   ```

2. Initialize Detox:
   ```bash
   detox init
   ```

### Writing E2E Tests

Example test:

```javascript
// e2e/firstTest.spec.js
describe('App', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });
});
```

## Test Coverage

Generate coverage report:
```bash
npm test -- --coverage
```

## CI/CD Integration

Add this to your GitHub Actions workflow:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16.x'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Best Practices

1. **Naming Conventions**
   - Test files: `ComponentName.test.tsx`
   - Test descriptions: Use `describe` blocks for components and `it` for test cases

2. **Test Organization**
   - Group related tests with `describe`
   - Use `beforeEach` for common setup
   - Keep tests independent

3. **Assertions**
   - Test one thing per test case
   - Use specific matchers
   - Test edge cases

4. **Performance**
   - Mock expensive operations
   - Use `act()` for state updates
   - Avoid unnecessary renders

## Common Test Patterns

### Testing Navigation

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native');

it('navigates to details on item press', () => {
  const mockNavigate = jest.fn();
  (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  
  const { getByTestId } = render(<ItemList />);
  fireEvent.press(getByTestId('item-1'));
  
  expect(mockNavigate).toHaveBeenCalledWith('ItemDetails', { id: '1' });
});
```

### Testing Async Code

```typescript
it('loads items on mount', async () => {
  const mockItems = [{ id: '1', title: 'Test Item' }];
  (api.getItems as jest.Mock).mockResolvedValue(mockItems);
  
  const { findByText } = render(<ItemList />);
  
  // Wait for the items to be loaded
  const itemElement = await findByText('Test Item');
  expect(itemElement).toBeTruthy();
});
```

## Debugging Tests

1. **Debug Logs**:
   ```bash
   DEBUG=* npm test
   ```

2. **Debug in VS Code**:
   Add this to `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "node",
         "request": "launch",
         "name": "Jest Current File",
         "program": "${workspaceFolder}/node_modules/.bin/jest",
         "args": ["${fileBasename}", "--config", "jest.config.js"],
         "console": "integratedTerminal",
         "internalConsoleOptions": "neverOpen"
       }
     ]
   }
   ```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Detox Documentation](https://wix.github.io/Detox/)
- [React Native Testing](https://reactnative.dev/docs/testing)
