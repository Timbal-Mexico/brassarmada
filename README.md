# Brassarmada Monorepo

Monorepo para brassarmada.com.mx y app.brassarmada.com.mx

## Estructura

```
brassarmada/
├── apps/
│   ├── web/           # brassarmada.com.mx
│   └── admin/         # app.brassarmada.com.mx
├── packages/
│   ├── ui/            # Componentes compartidos
│   ├── types/         # Tipos de TypeScript
│   └── supabase/     # Cliente Supabase
└── turbo.json
```

## Primeros Pasos

### 1. Instalar dependencias

```bash
bun install
```

### 2. Configurar variables de entorno

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

Agregar tus credenciales de Supabase en ambos archivos.

### 3. Ejecutar localmente

```bash
# Ambos proyectos
bun dev

# Solo web
bun dev --filter=web

# Solo admin
bun dev --filter=admin
```

## Deployment en Vercel

### 1. Crear 2 proyectos en Vercel

**Proyecto 1 (Web):**
- Repository: tu-repo
- Root Directory: `apps/web`
- Domain: `brassarmada.com.mx`

**Proyecto 2 (Admin):**
- Repository: tu-repo
- Root Directory: `apps/admin`
- Domain: `app.brassarmada.com.mx`

### 2. Configurar variables de entorno

En cada proyecto de Vercel, agregar:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 3. Deploy

Vercel detectará cambios automáticamente y solo rebuildá el proyecto que cambió.

## Scripts

```bash
bun dev          # Dev de todos los proyectos
bun build        # Build de todos
bun lint         # Lint de todos
bun test         # Tests de todos
bun clean        # Limpiar caches
```

## Agregar nuevos componentes UI compartidos

1. Agregar a `packages/ui/src/` con el componente
2. Exportar en `packages/ui/src/index.ts`
3. Usar en apps con `import { Button } from "@brassarmada/ui/button"`

## Agregar nuevos tipos

1. Crear archivo en `packages/types/src/` (ej: `event.ts`)
2. Exportar en `packages/types/src/index.ts`
3. Usar en apps con `import type { Artist } from "@brassarmada/types"`
