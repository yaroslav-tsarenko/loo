# Node.js - 02. Встановлення, версії та LTS

## Версії

У Node.js є current і LTS release lines.

- **Current** - нові фічі, швидший рух, не завжди найкращий вибір для production.
- **Active LTS** - рекомендований варіант для більшості production-проєктів.
- **Maintenance LTS** - стабільна гілка з security/bug fixes.
- **EOL** - не використовувати для production.

## Встановлення через nvm

```bash
nvm install --lts
nvm use --lts
node -v
npm -v
```

## Встановлення конкретної версії

```bash
nvm install 24
nvm use 24
```

## package.json engines

```json
{
  "engines": {
    "node": ">=22 <27"
  }
}
```

## .nvmrc

```text
24
```

## Production-порада

Локально можна експериментувати з current, але production треба прив'язувати до конкретної major/minor політики. CI, Docker image, staging і production мають використовувати передбачувану версію Node.js.

## Джерела

- [Previous Releases](https://nodejs.org/en/about/previous-releases)
- [Node.js Downloads](https://nodejs.org/en/download)
