# oxlint `react/only-export-components` with `allowConstantExport: true` does not detect non-component `export const`

## Problem

When `allowConstantExport: true` is set, oxlint's `react/only-export-components` permits **all** `export const` declarations without checking whether the exported value is actually a React component.

`eslint-plugin-react-refresh` correctly checks whether the value is a component and reports an error when it is not.

## Reproduction

```bash
npm ci

# oxlint: should-error.tsx is NOT reported (bug)
npx oxlint -c oxlint.config.json should-error.tsx

# eslint: should-error.tsx IS reported (correct)
npx eslint -c eslint.config.mjs should-error.tsx
```

### Expected

`should-error.tsx` should report an error because:
- `export const Route = createFileRoute(...)({...})` is not a React component (it's a function call returning a plain object)
- `function RouteComponent()` is a non-exported component in the same file

### Actual

oxlint reports no error on `should-error.tsx`. ESLint correctly reports it.

## Versions

- oxlint: 1.56.0
- eslint: 10.0.3
- eslint-plugin-react-refresh: 0.5.2

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

`createFileRoute()` returns a Route object, not a React component. When the component is defined inline in the same file, changes to non-component properties (like `loader`) won't trigger HMR correctly. The lint rule should warn about this.

See: https://github.com/ArnaudBarre/eslint-plugin-react-refresh/releases/tag/v0.5.0

## CI

This repo includes a [GitHub Actions workflow](.github/workflows/lint.yml) that runs both ESLint and oxlint on the same files to demonstrate the difference.
