# PostgreSQL - 02. Встановлення та локальний старт

## Варіанти встановлення

Найпрактичніші варіанти для розробки:

- Docker;
- Homebrew на macOS;
- офіційні packages для Linux;
- managed PostgreSQL у cloud для staging/production.

## Docker quick start

```bash
docker run --name local-postgres \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=app_db \
  -p 5432:5432 \
  -d postgres:18
```

Підключення:

```bash
psql postgresql://app:secret@localhost:5432/app_db
```

## Docker Compose

```yaml
services:
  postgres:
    image: postgres:18
    container_name: local-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Базова перевірка

```sql
SELECT version();
SELECT current_database();
SELECT current_user;
```

## Production-нюанси

- Не використовуй прості паролі.
- Не відкривай 5432 в інтернет без firewall/VPN/private network.
- Для production краще managed PostgreSQL або добре налаштований self-hosting.
- Для Docker у production треба окремо думати про backups, WAL, storage, monitoring, upgrades.

## Джерела

- [Getting Started](https://www.postgresql.org/docs/18/tutorial-start.html)
- [Server Setup and Operation](https://www.postgresql.org/docs/18/runtime.html)
