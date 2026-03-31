# Brass Armada Admin

## Supabase (setup rápido)

1. En Supabase → SQL Editor, ejecuta el script:
   - [setup.sql](file:///c:/Users/timba/Documents/Development/brassarmada/apps/admin/supabase/setup.sql)

2. Crea el primer usuario (Supabase → Authentication → Users) con email/password.

3. Asigna rol admin al primer usuario:

```sql
update public.users
set role = 'admin'
where email = 'TU_CORREO';
```

4. Variables de entorno (local/Vercel):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

Opcional:
   - `VITE_ADMIN_TEST_EMAIL`
   - `VITE_ADMIN_TEST_PASSWORD`

## Crear usuario admin (automático)

Requiere la key secreta `service_role` (NO usar `VITE_`, no se debe exponer en frontend).

Desde `apps/admin`:

```bash
set SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
set ADMIN_EMAIL=admin@brassarmada.com.mx
set ADMIN_PASSWORD=UnaPasswordSegura
node scripts/create-admin-user.mjs
```

## Gestor de usuarios (Super Admin)

La pantalla `/users` crea/edita/elimina usuarios vía Edge Function:

- [admin-users](file:///c:/Users/timba/Documents/Development/brassarmada/apps/admin/supabase/functions/admin-users/index.ts)

Deploy (Supabase CLI):

```bash
supabase functions deploy admin-users
```

## Prueba de conexión

Desde `apps/admin`:

```bash
node scripts/supabase-connection-test.mjs
```

## Prueba de login (manual)

Desde `apps/admin`:

```bash
node scripts/login-test.mjs
```
