## React-Specific Keywords and Concepts

### `import` / `export`
```javascript
import PropTypes from 'prop-types';
// ...more imports
export default TimelineItem;
```
- **Purpose**: Module system for sharing code between files
- **Use case**: Importing dependencies and exporting the TimelineItem component

### `useContext`
```javascript
const context = useContext(AccordionContext);
```
- **Purpose**: React Hook to consume values from a context provider
- **Use case**: Accessing the accordion state to manage which timeline item is expanded

### `JSX`
```javascript
return (
  <div className="content mb-10">
    {/* More JSX elements */}
  </div>
);
```
- **Purpose**: JavaScript syntax extension for defining UI components
- **Use case**: Declarative definition of the component's structure and appearance

### `PropTypes`
```javascript
TimelineItem.propTypes = {
  index: PropTypes.number,
  // ...more prop types
};
```
- **Purpose**: Runtime type-checking for component props
- **Use case**: Validating the data types of props passed to TimelineItem

## JavaScript Features

### Arrow Functions (`=>`)
```javascript
const toggleAccordion = () => {
  setAccordionOpen(isOpen ? null : index);
};
```
- **Purpose**: Concise function syntax with lexical `this` binding
- **Use case**: Event handlers and callback functions

### Destructuring Assignment
```javascript
const { accordionOpen, setAccordionOpen } = context;
```
- **Purpose**: Extract values from objects/arrays into distinct variables
- **Use case**: Cleaner access to props and context values

### Optional Chaining (`?.`)
```javascript
services={alerts?.service || []}
```
- **Purpose**: Safely access nested properties without causing errors
- **Use case**: Accessing properties that might be undefined

### Nullish Coalescing/Logical OR (`||`)
```javascript
<span>{customTitle || 'Special Item'}</span>
```
- **Purpose**: Provide fallback values
- **Use case**: Setting default values when props are undefined

### Template Literals
```javascript
className={`content ${accordionOpen ? 'mb-0' : 'mb-10'}`}
```
- **Purpose**: String interpolation with embedded expressions
- **Use case**: Creating dynamic class names based on component state

### Conditional (Ternary) Operator
```javascript
isOpen ? "ml-2 inline-block..." : ""
```
- **Purpose**: Compact conditional expressions
- **Use case**: Conditionally applying styles or returning values

### Array Methods (`map`, `filter`)
```javascript
{ensureArray(alerts.type).map((type, i) => (
  <div key={i}>{type}</div>
))}
```
- **Purpose**: Transform/filter array data
- **Use case**: Rendering lists of UI elements and data processing

### Spread Operator (`...`)
```javascript
[...new Map(alertData.map((item) => [item?.heading || '', item])).values()]
```
- **Purpose**: Expand iterables into individual elements
- **Use case**: Creating arrays from Map values and spreading props

### Logical AND (`&&`) for Conditional Rendering
```javascript
{alerts?.type && (
  <div className='text-sm text-slate-600'>
    {/* rendering logic */}
  </div>
)}
```
- **Purpose**: Conditionally render elements only when condition is true
- **Use case**: Only showing alert types when they exist