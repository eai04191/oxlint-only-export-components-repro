# oxlint `react/only-export-components` with `allowConstantExport: true` does not detect non-component `export const`

## Problem

When `allowConstantExport: true` is set, `react/only-export-components` permits **all** `export const` declarations without checking whether the exported value is actually a React component.

This means patterns like TanStack Router's `createFileRoute()` — which returns a non-component object — are silently allowed, even when the file also contains a non-exported component function.

`eslint-plugin-react-refresh` correctly detects this case and reports an error.

## Reproduction

```bash
npx oxlint -c oxlint.config.json
```

### Expected

`should-error.tsx` should report an error because:
- `export const Route = createFileRoute(...)({...})` is not a React component
- `function RouteComponent()` is a non-exported component colocated in the same file

This is the exact pattern that `eslint-plugin-react-refresh` detects.

### Actual

`should-error.tsx` reports no error. Only `correctly-errors.tsx` is flagged.

## Config

```json
{
    "plugins": ["react"],
    "rules": {
        "react/only-export-components": ["error", { "allowConstantExport": true }]
    }
}
```

## Context

This matters for TanStack Router file-based routing, where route files typically have:
```tsx
export const Route = createFileRoute("/path")({
    component: MyComponent,
    loader: async () => { ... },
});

function MyComponent() { ... }
```

The `createFileRoute()` call returns a Route object, not a React component. When the component is defined inline in the same file, changes to non-component properties (like `loader`) won't trigger HMR correctly. The lint rule should warn about this so developers are aware of the HMR limitation.

See: https://github.com/ArnaudBarre/eslint-plugin-react-refresh/releases/tag/v0.5.0
