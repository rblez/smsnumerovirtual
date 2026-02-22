# SMS Número Virtual

Plataforma de envío de SMS internacionales. Servicio simple y directo sin suscripciones.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase)

## Características

- **Cobertura Global**: Envía SMS a más de 200 países
- **Sin Suscripción**: Compra coins cuando los necesites
- **Envío Instantáneo**: Entrega en segundos
- **Historial Completo**: Registro de todos tus envíos
- **Soporte Personal**: Contacto directo por Telegram

## Tecnologías

- **Framework**: Next.js 16 con App Router
- **Lenguaje**: TypeScript 5.7
- **Estilos**: Tailwind CSS 4 + CSS Variables
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Animaciones**: Framer Motion
- **Despliegue**: Vercel

## Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── (routes)/           # Públicas
│   │   ├── page.tsx        # Landing
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── ...
│   ├── (dashboard)/        # Protegidas
│   │   ├── dashboard/page.tsx
│   │   ├── account/page.tsx
│   │   └── ...
│   ├── api/                # API Routes
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes base
│   │   └── ...
│   └── globals.css         # Estilos globales
├── lib/                    # Utilidades
│   └── supabase.ts         # Cliente Supabase
├── types/                  # Tipos TypeScript
│   └── database.ts         # Tipos de Supabase
├── public/                 # Archivos estáticos
│   └── isotipo.png         # Logo
├── docs/                   # Documentación
├── scripts/                # Scripts de utilidad
└── .windsurf/             # Configuración del proyecto
```

## Configuración Local

### 1. Clonar repositorio

```bash
git clone <repo-url>
cd smsnumerovirtual
```

### 2. Instalar dependencias

```bash
npm install
# o
pnpm install
```

### 3. Variables de entorno

Copia `.env.example` a `.env.local` y completa:

```bash
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### 4. Base de datos

Ejecuta las migraciones en Supabase SQL Editor:

```sql
-- Ver archivo migrations/001_initial_schema.sql
```

### 5. Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## Despliegue en Vercel

### 1. Preparar proyecto

```bash
# Verificar build local
npm run build
```

### 2. Configurar Vercel

1. Crear proyecto en [vercel.com](https://vercel.com)
2. Conectar repositorio Git
3. Configurar variables de entorno en Settings → Environment Variables
4. Deploy

### Variables de entorno requeridas en Vercel

| Variable | Valor | Tipo |
|----------|-------|------|
| NEXT_PUBLIC_SUPABASE_URL | https://tu-proyecto.supabase.co | Public |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJ... | Public |
| SUPABASE_SERVICE_ROLE_KEY | eyJ... | Secret |

## Comandos útiles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Build
npm run build        # Build de producción
npm run start        # Servidor de producción

# Lint
npm run lint         # ESLint

# Types
npx tsc --noEmit     # Verificar tipos
```

## Guía de Desarrollo

### Convenciones

- **Componentes**: PascalCase, en `app/components/`
- **Páginas**: `page.tsx` en carpetas con kebab-case
- **Estilos**: Tailwind + CSS variables para colores del brand
- **Colores**: 
  - Primary: `#E8E1D4` (beige)
  - Secondary: `#2E2E2E` (dark gray)

### Ejemplo de componente

```tsx
// app/components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn-${variant}`}>
      {children}
    </button>
  );
}
```

## Documentación

- [PLAN.md](./PLAN.md) - Plan de desarrollo y roadmap
- [docs/](./docs/) - Documentación adicional

## Soporte

Contacto: [Telegram](https://t.me/pedrobardaji)

## Licencia

MIT License - Ver [LICENSE](./LICENSE)
