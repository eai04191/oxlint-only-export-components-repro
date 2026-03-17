// This correctly errors: non-constant export + non-exported component
export function helper() {
    return 1;
}

export function MyComponent() {
    return <div>Hello</div>;
}
