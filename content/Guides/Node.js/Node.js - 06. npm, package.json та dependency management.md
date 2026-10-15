# Node.js - 06. npm, package.json та dependency management

## package.json

```json
{
  "name": "api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js",
    "test": "node --test"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

## dependencies vs devDependencies

- `dependencies` потрібні runtime-коду.
- `devDependencies` потрібні для розробки, тестів, build tooling.

## package-lock.json

Lockfile фіксує dependency tree. У CI краще використовувати:

```bash
npm ci
```

а не `npm install`, щоб збірка була відтворюваною.

## Semantic versioning

- `^1.2.3` - дозволяє minor/patch updates;
- `~1.2.3` - дозволяє patch updates;
- `1.2.3` - точна версія.

## Supply chain ризики

- typosquatting;
- compromised packages;
- postinstall scripts;
- dependency confusion;
- abandoned packages;
- transitive vulnerabilities.

## Практики

- перевіряти lockfile у PR;
- використовувати `npm audit`, SCA tools;
- мінімізувати dependencies;
- не тягнути library для 5 рядків коду;
- pin versions для критичних production dependency;
- використовувати private registry/scopes, якщо потрібно.

## Джерела

- [npm Docs](https://docs.npmjs.com/)
- [Node.js Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
