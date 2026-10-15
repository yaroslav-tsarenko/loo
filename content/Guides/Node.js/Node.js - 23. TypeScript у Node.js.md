# Node.js - 23. TypeScript у Node.js

## Навіщо TypeScript

TypeScript додає static typing, кращий refactoring, explicit contracts і менше runtime-помилок у великих Node.js codebases.

## tsconfig базово

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "types": ["node"]
  }
}
```

## Запуск

Варіанти:

- compile через `tsc`, потім `node dist/index.js`;
- runtime loader/dev runner для development;
- bundler для serverless/edge scenarios.

## Типи Node.js

```bash
npm install -D typescript @types/node
```

## ESM + TypeScript

Для ESM у Node.js важливо узгодити:

- `"type": "module"`;
- `module: "NodeNext"`;
- file extensions/import paths;
- test runner і tooling.

## Senior-порада

TypeScript не замінює runtime validation. Дані з HTTP, DB, queue, env vars і third-party APIs треба валідувати runtime-схемами.

## Джерела

- [TypeScript - NodeNext](https://www.typescriptlang.org/docs/)
- [Modules: TypeScript](https://nodejs.org/docs/latest/api/typescript.html)
