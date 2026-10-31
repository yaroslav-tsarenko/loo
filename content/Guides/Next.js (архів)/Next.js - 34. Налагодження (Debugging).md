# Налагодження (Debugging) в Next.js

> Документація на основі Next.js 16.2.6 (App Router)
> Пов'язано: [[Next.js - 01. Встановлення]], [[Next.js - 19. Змінні середовища]]

## VS Code

Створіть `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev -- --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithEdge",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

Відкрийте Debug панель (`Ctrl+Shift+D` / `⇧+⌘+D`), виберіть конфігурацію та натисніть `F5`.

> Для Firefox: встановіть розширення [Firefox Debugger](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug).

## JetBrains WebStorm

1. Edit Configurations → JavaScript Debug
2. URL: `http://localhost:3000`
3. Запустіть конфігурацію — браузер відкриється автоматично

## Browser DevTools

### Клієнтський код

1. Запустіть `next dev`
2. Відкрийте DevTools (`Ctrl+Shift+J` / `⌥+⌘+I`)
3. Вкладка **Sources** (Chrome) або **Debugger** (Firefox)
4. Додайте `debugger` у код або шукайте файли через `Ctrl+P` / `⌘+P`

Шляхи починаються з `webpack://_N_E/./`.

### Серверний код

Запустіть з прапорцем `--inspect`:

```bash
pnpm dev --inspect
```

Вивід:

```
Debugger listening on ws://127.0.0.1:9229/...
```

**Chrome:**
1. Відкрийте `chrome://inspect`
2. Знайдіть Next.js у **Remote Target**
3. Натисніть **inspect**

**Firefox:**
1. Відкрийте `about:debugging`
2. **This Firefox** → знайдіть Next.js
3. Натисніть **Inspect**

### React Developer Tools

Встановіть розширення [React Developer Tools](https://react.dev/learn/react-developer-tools) для:
- Інспекції компонентів
- Редагування пропсів та стану
- Виявлення проблем продуктивності

### Інспекція помилок сервера

Next.js показує іконку Node.js під індикатором версії на error overlay. Натисніть — DevTools URL скопіюється в буфер.

## Windows

Вимкніть Windows Defender — він перевіряє кожен прочитаний файл, що значно уповільнює Fast Refresh.

## Корисні посилання

- [Node.js debugging в VS Code](https://code.visualstudio.com/docs/nodejs/nodejs-debugging)
- [Chrome DevTools: Debug JavaScript](https://developers.google.com/web/tools/chrome-devtools/javascript)
- [Firefox DevTools: Debugger](https://firefox-source-docs.mozilla.org/devtools-user/debugger/)
