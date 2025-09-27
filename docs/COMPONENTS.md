# Component Library

This document provides documentation for the reusable UI components in the FindFreebie application.

## Component Index

### Core Components

#### MapView
- **Location**: `/components/MapView.tsx`
- **Description**: Interactive map for displaying and selecting locations
- **Props**:
  - `location`: Current location coordinates
  - `viewOnly`: Boolean to disable map interaction
  - `onLocationChange`: Callback when location changes
- **Usage**:
  ```tsx
  <MapView 
    location={{ latitude: 37.78825, longitude: -122.4324 }}
    viewOnly={false}
    onLocationChange={(location) => console.log(location)}
  />
  ```

#### ItemCard
- **Location**: `/components/ItemCard.tsx`
- **Description**: Card component for displaying item previews in lists
- **Props**:
  - `item`: Item object with title, image, etc.
  - `onPress`: Callback when card is pressed
  - `showDistance`: Boolean to show/hide distance

### Form Components

#### CustomPicker
- **Location**: `/components/CustomPicker.tsx`
- **Description**: Custom dropdown picker for forms
- **Props**:
  - `items`: Array of {label, value} objects
  - `selectedValue`: Currently selected value
  - `onValueChange`: Callback when selection changes
  - `placeholder`: Placeholder text

#### DateTimePickerModal
- **Location**: `/components/DateTimePickerModal.tsx`
- **Description**: Modal for date and time selection
- **Props**:
  - `isVisible`: Boolean to control visibility
  - `onConfirm`: Callback with selected date/time
  - `onCancel`: Callback when cancelled

### Layout Components

#### ScreenContainer
- **Location**: `/components/ScreenContainer.tsx`
- **Description**: Wrapper component for screens with consistent styling
- **Props**:
  - `children`: Child components
  - `scrollable`: Boolean to enable/disable scrolling
  - `style`: Additional styles

### Utility Components

#### LoadingIndicator
- **Location**: `/components/LoadingIndicator.tsx`
- **Description**: Animated loading spinner
- **Props**:
  - `size`: 'small' | 'large' (default: 'small')
  - `color`: Color of the spinner

## Styling Guidelines

### Theme

All styling should use the theme variables defined in `/constants/theme.ts`:

```typescript
export const COLORS = {
  primary: '#6200EE',
  accent: '#03DAC6',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  error: '#B00020',
  text: '#000000',
  textMuted: '#757575',
  border: '#E0E0E0',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
```

### Best Practices

1. **Component Structure**
   - Keep components small and focused on a single responsibility
   - Use TypeScript interfaces for props
   - Document all required and optional props

2. **Styling**
   - Use StyleSheet for all styles
   - Reuse common styles using StyleSheet.compose
   - Avoid inline styles when possible

3. **Performance**
   - Memoize expensive calculations
   - Use React.memo for pure components
   - Implement proper cleanup in useEffect

## Accessibility

All components should be accessible by default:

- Use `accessible` and `accessibilityLabel` props
- Ensure sufficient color contrast
- Support dynamic type for text scaling
- Add proper keyboard navigation

## Testing

Components should include unit tests in the `__tests__` directory:

```
components/
  __tests__/
    MapView.test.tsx
    ItemCard.test.tsx
  MapView.tsx
  ItemCard.tsx
```

## Storybook

The project includes Storybook for component development. Run `npm run storybook` to start the Storybook server.

## Component Naming Conventions

- Use PascalCase for component file names (e.g., `MyComponent.tsx`)
- Prefix related components with a common name (e.g., `MapView`, `MapMarker`)
- Keep test files next to components with `.test.tsx` extension

## Versioning

Components should be versioned using semantic versioning when they reach a stable state. Update the version in the component's JSDoc:

```typescript
/**
 * @version 1.0.0
 */
```
