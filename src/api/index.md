# API Reference

Comprehensive API documentation for Kist projects.

## Overview

This section contains detailed API documentation for all Kist projects. Each project has its own API reference with complete type definitions, method signatures, and usage examples.

## Project APIs

Select a project to view its API documentation:

:::tip
API documentation is automatically generated from TypeScript definitions and JSDoc comments in each project's source code.
:::

## Structure

API documentation typically includes:

### Classes
Complete class documentation with:
- Constructor parameters
- Properties
- Methods
- Type definitions
- Usage examples

### Functions
Function documentation with:
- Parameters
- Return types
- Overloads
- Examples

### Types & Interfaces
TypeScript definitions including:
- Type aliases
- Interfaces
- Enums
- Generics

### Constants
Exported constants and configuration values.

## How to Read API Docs

### Type Notation

```typescript
function example(param: string): Promise<number>
```

- `param: string` - Parameter name and type
- `Promise<number>` - Return type

### Optional Parameters

```typescript
function example(required: string, optional?: number)
```

The `?` indicates an optional parameter.

### Type Unions

```typescript
type Status = 'pending' | 'completed' | 'failed'
```

The `|` indicates a union of possible values.

## Contributing

Help improve our API documentation:
- Report unclear documentation
- Suggest better examples
- Fix typos or errors
- Add missing information

See our [contributing guide](/contributing) for details.

---

:::info
For project-specific API documentation, navigate to the individual project pages in the [Projects](/projects/) section.
:::
