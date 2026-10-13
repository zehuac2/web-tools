---
name: react
description: >
  Guide React component file structure. Use when you create or review React
  component files. Define component props, declarations, display names, and
  exports consistently.
---

# React

## Component files

- Put at most one component in each component file.
- Define component props in an interface.
- Declare components with `FC`.
- Set `displayName` on every component.
- Use a default export for each component.

```ts
import { FC } from 'react';

export interface FooProps {}

const Foo: FC<FooProps> = () => {
  return <div></div>;
};

Foo.displayName = 'Foo';

export default Foo;
```
