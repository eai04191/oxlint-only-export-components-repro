// This should error: `Route` is not a React component (it's the return value of
// createFileRoute()), and `RouteComponent` is a non-exported component.
// eslint-plugin-react-refresh correctly reports this as an error.
// oxlint does NOT report this because `allowConstantExport: true` permits all
// `export const` declarations, without checking whether the value is actually
// a React component.

function createFileRoute(_path: string) {
    return (_opts: Record<string, unknown>) => ({ _path });
}

export const Route = createFileRoute("/example")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello</div>;
}
