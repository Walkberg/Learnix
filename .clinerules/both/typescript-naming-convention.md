---
description: APPLY TypeScript naming conventions WHEN writing code (files, variables, functions etc)
globs: **/*.ts, **/*/.tsx
alwaysApply: false
---

Classes and Interfaces:
- Use PascalCase for names
- Use nouns or noun phrases

Functions and Methods:
- Use camelCase for names
- Use verbs for actions
- Use nouns for value-returning
- Prefix booleans with is, has, should
- No anemic models

Strict Types:
- Type everything explicitly
- Never use `any` or `unknown`
- Avoid `as` for type conversion
- Use type guards for assertions
- Use generics for reusable functions

Interfaces and Types:
- Use `interface` for extensible objects
- Use `type` for unions and primitives

Nullability:
- Avoid `null` and `undefined` in returns

Enumerations:
- Prefer string literal unions to enums
- Use const enums if needed
- Define enum values explicitly

Lint & Error:
- Catch errors as `unknown | Error`

Generics:
- Use descriptive type parameter names