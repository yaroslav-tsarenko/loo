# PostgreSQL - 16. Roles, privileges, RLS та security

## Roles

У PostgreSQL користувачі і групи представлені через roles.

```sql
CREATE ROLE app_user LOGIN PASSWORD 'strong-password';
CREATE ROLE readonly;
GRANT readonly TO app_user;
```

## Privileges

```sql
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
```

## Default privileges

```sql
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
```

## Row Level Security

RLS дозволяє обмежувати доступ до рядків.

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON invoices
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

У застосунку:

```sql
SET app.tenant_id = '00000000-0000-0000-0000-000000000001';
```

## search_path

`search_path` може бути security-ризиком, якщо функції або типи шукаються в небезпечних схемах. У production краще явно задавати schema або контролювати search_path.

## Senior security checklist

- окрема role для app;
- мінімальні privileges;
- немає superuser для застосунку;
- SSL/TLS для remote connections;
- strong password/SCRAM або managed auth;
- RLS для multi-tenant, якщо підходить архітектурно;
- audit/logging для критичних дій;
- регулярні patch updates.

## Джерела

- [Database Roles](https://www.postgresql.org/docs/18/user-manag.html)
- [Privileges](https://www.postgresql.org/docs/18/ddl-priv.html)
- [Row Security Policies](https://www.postgresql.org/docs/18/ddl-rowsecurity.html)
- [Client Authentication](https://www.postgresql.org/docs/18/client-authentication.html)
