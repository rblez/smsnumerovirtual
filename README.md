# SMS Número Virtual

Aplicación web para envío de SMS internacional con sistema de créditos y panel de administración.

## Stack Tecnológico

- **Framework**: Next.js 16.1.6 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth)
- **Email**: Resend API
- **SMS**: Innoverit API
- **Animaciones**: Framer Motion

## Estructura del Proyecto

```
app/
├── api/                  # API Routes
│   ├── auth/            # Autenticación (registro, login, reset-password)
│   ├── admin/           # Panel admin (usuarios, créditos, tarifas)
│   ├── send-sms/        # Envío de SMS
│   └── sms/history/     # Historial de mensajes
├── components/          # Componentes reutilizables
├── hooks/              # Custom React hooks
├── lib/                # Utilidades (email, supabase)
├── ~[id]/              # Dashboard de usuario
├── admin/              # Panel de administración
├── login/              # Inicio de sesión
├── register/           # Registro de usuarios
├── forgot-password/    # Recuperación de contraseña
├── reset-password/     # Nueva contraseña
├── account/            # Configuración de cuenta
├── history/            # Historial de SMS
├── rates/              # Tarifas por país
├── home/               # Landing page
└── page.tsx            # Página principal

emails/                 # Templates HTML de email
├── password-reset.html
├── welcome.html
└── coins-added.html

lib/
├── email.ts             # Servicio de email con Resend
└── supabase.ts          # Clientes Supabase

migrations/              # Migraciones SQL de Supabase
scripts/                 # Scripts de utilidad
types/                   # Tipos TypeScript generados
```

## Características Principales

### Usuarios
- Registro con ID personalizado (formato: waesdrtfg)
- Autenticación con email/contraseña
- Recuperación de contraseña vía email
- Sistema de créditos para enviar SMS

### Dashboard
- Selector de país con banderas y códigos de área
- Input de teléfono con formato internacional
- Envío de SMS con costo en créditos
- Historial de mensajes enviados

### Panel Admin
- Gestión de usuarios
- Agregar créditos manualmente
- Configurar tarifas por país
- Ver balance de API Innoverit

### Email Service
- Templates HTML personalizados
- Password reset
- Welcome email
- Notificación de créditos agregados

## Variables de Entorno

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend Email
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=

# Innoverit SMS
INNOVERIT_API_KEY=
```

## Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build producción
pnpm build

# Lint
pnpm lint

# Generar tipos de Supabase
pnpm generate-types
```

## Base de Datos (Supabase)

### Tablas Principales

**profiles**
- `id`: UUID (PK, FK auth.users)
- `full_name`: string
- `credits_balance`: numeric
- `custom_id`: string (único, para URLs públicas)
- `created_at`, `updated_at`: timestamp

**sms_history**
- `id`: UUID (PK)
- `user_id`: UUID (FK profiles)
- `phone_number`: string
- `message`: string
- `country`, `operator`: string
- `cost`: numeric
- `status`: 'pending' | 'sent' | 'delivered' | 'failed'
- `created_at`: timestamp

**sms_rates**
- `id`: UUID (PK)
- `country`: string
- `country_code`: string
- `dial_code`: string
- `operator`: string
- `api_cost`, `sale_price`, `coins_cost`: numeric
- `updated_at`: timestamp

**credit_purchases**
- `id`: UUID (PK)
- `user_id`: UUID (FK profiles)
- `amount`: numeric
- `package_name`: string
- `payment_method`: string
- `status`: 'pending' | 'completed' | 'cancelled'
- `created_at`: timestamp

## Flujos de Autenticación

### Registro
1. Usuario completa formulario
2. Se genera `custom_id` aleatorio
3. Se crea usuario en `auth.users`
4. Se inserta perfil en `profiles` con `custom_id`
5. Se envía email de bienvenida
6. Redirección a dashboard con `custom_id`

### Login
1. Usuario ingresa credenciales
2. Supabase Auth valida
3. Se obtiene `custom_id` del perfil
4. Redirección a `/~/{custom_id}`

### Password Reset
1. Usuario solicita en `/forgot-password`
2. API genera token de recuperación
3. Se envía email con enlace
4. Usuario accede a `/reset-password?token=xxx`
5. API verifica token y actualiza contraseña

## API Routes

### Auth
- `POST /api/auth/register` - Crear cuenta
- `POST /api/auth/reset-password` - Solicitar reset
- `POST /api/auth/update-password` - Confirmar nuevo password

### Admin
- `GET /api/admin/users` - Listar usuarios
- `POST /api/admin/add-credits` - Agregar créditos
- `GET /api/admin/innoverit/balance` - Balance SMS
- `GET /api/admin/innoverit/rates` - Tarifas SMS

### SMS
- `POST /api/send-sms` - Enviar mensaje
- `GET /api/sms/history` - Historial

## Configuración de Email (Resend)

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio `smsnumerovirtual.com`
3. Agregar DNS records:
   - TXT `resend._domainkey` (DKIM)
   - MX `send` (feedback)
   - TXT `send` (SPF)
   - TXT `_dmarc` (DMARC)
4. Obtener API key y configurar en `RESEND_API_KEY`

## Deploy

### Vercel (Recomendado)
1. Conectar repositorio Git
2. Configurar variables de entorno
3. Deploy automático en push

### Requisitos
- Node.js 20+
- pnpm 10+

## Licencia

Proyecto privado. Todos los derechos reservados.
