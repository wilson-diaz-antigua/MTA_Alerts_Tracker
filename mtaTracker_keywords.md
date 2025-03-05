
# React and TypeScript Keywords in mtaTracker.tsx

## React Features

### Import Statements
```tsx
import { createContext, useCallback, useState } from 'react';
import objects from '../../util/subwayLineColors.json';
import TimelineItem from '../components/TimelineItem';
import terminal from '../constants/terminalDirections';
import useMTAData from '../hooks/useMTAData';
import * as ArrayUtils from '../utils/arrayUtils';
```
- **Use case**: Imports core React functionality and custom components/utilities
- **Purpose**: Foundation for React component development

### Hooks

#### useState
```tsx
const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
const [filtLines, setFiltLines] = useState<string>('broadway');
const [service, setService] = useState<string>('x');
const [direction, setDirection] = useState<string>('Both Directions');
```
- **Use case**: Adds reactive state to functional components
- **Example**: Manages UI state for filters and accordion
- **Purpose**: Enables UI to respond to user interactions

#### useCallback
```tsx
const processAlertData = useCallback((): StopData[] => {
  if (!data || !Array.isArray(data)) return [];
  
  // Filter by service line
  const filteredItems = data.filter((x) =>
    service === 'x'
      ? objects.serviceByLines[filtLines].includes(x.stop[0])
      : service.includes(x.stop[0])
  );
  
  // More processing...
}, [data, service, filtLines, direction]);
```
- **Use case**: Memoizes functions to prevent unnecessary re-renders
- **Example**: Optimizes data filtering that depends on specific inputs
- **Purpose**: Performance optimization for data processing functions

#### Custom Hooks
```tsx
const { data, loading } = useMTAData();
```
- **Use case**: Extracts and shares reusable logic
- **Example**: Centralizes MTA API data fetching
- **Purpose**: Keeps component code clean by separating concerns

### Context API

#### createContext
```tsx
interface AccordionContextType {
  accordionOpen: boolean | null;
  setAccordionOpen: (open: boolean) => void;
}

export const AccordionContext = createContext<AccordionContextType>({
  accordionOpen: null,
  setAccordionOpen: () => {},
});
```
- **Use case**: Creates a shared state container
- **Example**: Manages accordion open/closed state across components
- **Purpose**: Allows data sharing without prop drilling

#### Context.Provider
```tsx
<AccordionContext.Provider value={accordionContextValue}>
  <div className='bg-zinc-600'>
    <FilterControls
      filtLines={filtLines}
      setFiltLines={setFiltLines}
      service={service}
      setService={setService}
      direction={direction}
      setDirection={setDirection}
      objects={objects}
    />
  </div>
  
  {/* More JSX... */}
</AccordionContext.Provider>
```
- **Use case**: Makes context available to child components
- **Example**: Wraps components that need access to accordion state
- **Purpose**: Establishes context boundaries in component tree

## TypeScript Features

### Interfaces

```tsx
interface Alert {
  route: string;
  heading: string;
  alert_type: string;
  direction?: string;
}

interface StopData {
  stop: string[];
  alerts: Alert[];
}

interface ProcessedAlert {
  service: string[];
  heading: string[];
  type: string[];
}
```
- **Use case**: Defines shape of objects for type checking
- **Example**: Ensures alert data has required properties
- **Purpose**: Provides compile-time safety for data structures

### Type Annotations

```tsx
const processAlertData = useCallback((): StopData[] => {
  // Function implementation...
}, [data, service, filtLines, direction]);

const renderTimelineItems = (): JSX.Element[] => 
  alertData.map((item, index) => {
    // Mapping implementation...
  });
```
- **Use case**: Explicit return type declarations
- **Example**: Ensures functions return expected data types (StopData[] or JSX.Element[])
- **Purpose**: Self-documenting code and compiler validation

### Optional Properties

```tsx
interface Alert {
  route: string;
  heading: string;
  alert_type: string;
  direction?: string;  // Optional property
}
```
- **Use case**: Fields that might not always exist
- **Example**: Some alerts might not have direction information
- **Purpose**: Models real-world data with missing fields

### Generic Type Parameters

```tsx
const [accordionOpen, setAccordionOpen] = useState<boolean>(false);
const [filtLines, setFiltLines] = useState<string>('broadway');

export const AccordionContext = createContext<AccordionContextType>({
  accordionOpen: null,
  setAccordionOpen: () => {},
});
```
- **Use case**: Type-safe generics
- **Example**: Ensures state and context maintain proper types
- **Purpose**: Prevents type errors during state management

### Return Type Annotations

```tsx
function MtaTracker(): JSX.Element {
  // Component implementation...
}
```
- **Use case**: Explicit component return types
- **Example**: Ensures component returns valid JSX
- **Purpose**: Clear contract for component output

## JSX Features

### Component Composition

```tsx
<AccordionContext.Provider value={accordionContextValue}>
  <TimelineItem
    index={index}
    alerts={alerts}
    className={objects.serviceColors}
    stop={item}
    filtLines={filtLines}
  />
</AccordionContext.Provider>
```
- **Use case**: Building complex UIs from smaller pieces
- **Example**: Timeline items built from filtered data
- **Purpose**: Modular, maintainable component architecture

### Conditional Rendering

```tsx
{loading ? (
  <LoadingSkeleton />
) : (
  <div className='relative'>
    <section>{renderTimelineItems().slice(0, 5)}</section>
    
    {alertData.length > 6 && (
      <section>
        <TimelineItem
          customIcon={customIcon}
          index={-2}
          customTitle={`${alertData.length - 6} more stations affected`}
          isSpecial={true}
          alerts={{
            type: [
              `Total of ${alertData.length} stations have alerts`,
            ],
          }}
        />
      </section>
    )}
    
    <section>{renderTimelineItems().slice(-1)}</section>
    <EndMarker linecolors={filtLines} objects={objects} />
  </div>
)}
```
- **Use case**: Displays different content based on state
- **Example**: Shows skeleton during loading, conditional section for extra stations
- **Purpose**: Improves UX with loading states and dynamic content

### Dynamic Classes

```tsx
<div
  className={`${
    loading ? 'animate-pulse' : ''
  } content relative before:${objects.lineColors[filtLines]}`}
>
  {/* content... */}
</div>
```
- **Use case**: Conditional styling based on component state
- **Example**: Adds animation only during loading, dynamic line colors
- **Purpose**: Visual feedback for dynamic states

## Modern JavaScript Features

### Array Methods

```tsx
return filteredItems
  .map((stops) => ({
    stop: stops.stop,
    alert: stops.alerts.filter((alert) =>
      directionTerms
        ? directionTerms.includes(
            alert.direction
              ? alert.direction.toLowerCase()
              : alert.direction
          )
        : alert
    ),
  }))
  .filter((item) => item.alert.length);
  
alertData.map((item, index) => {
  const alerts: ProcessedAlert = {
    service: ArrayUtils.uniqueValues(item.alert, (service) => service.route),
    // More properties...
  };
  // Return JSX...
});
```
- **Use case**: Declarative data transformation
- **Example**: Filtering alerts by direction, converting data objects to React components
- **Purpose**: Clean data processing without imperative loops

### Destructuring

```tsx
const { data, loading } = useMTAData();

const alerts: ProcessedAlert = {
  service: ArrayUtils.uniqueValues(item.alert, (service) => service.route),
  heading: ArrayUtils.uniqueValues(item.alert, (service) => service.heading),
  type: ArrayUtils.uniqueValues(item.alert, (service) => service.alert_type),
};
```
- **Use case**: Extract values from objects concisely
- **Example**: Pulling specific properties from hook result and creating new objects
- **Purpose**: Cleaner syntax for accessing and restructuring object properties

### Optional Chaining

```tsx
directionTerms.includes(
  alert.direction
    ? alert.direction.toLowerCase()
    : alert.direction
)
```
- **Use case**: Safely handle properties that might not exist
- **Example**: Handling optional direction property
- **Purpose**: Prevents null/undefined errors

### Namespace Imports

```tsx
import * as ArrayUtils from '../utils/arrayUtils';

// Used later as:
ArrayUtils.uniqueValues(item.alert, (service) => service.route)
```
- **Use case**: Group related exports under a namespace
- **Example**: Consolidates array utility functions
- **Purpose**: Organizes imports to avoid naming collisions
```

