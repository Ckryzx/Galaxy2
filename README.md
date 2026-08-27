# Fantasy Liga Chilena

Un Fantasy de fútbol para la Liga de Primera chilena, con la misma mecánica
de armar equipo, presupuesto y capitán que el Fantasy que ya conoces — pero
con un giro: **las notas de cada jugador las ponen a mano streamers de
confianza** después de cada fecha, en vez de calcularse automáticamente con
estadísticas.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + PostgreSQL
- [NextAuth v5](https://authjs.dev) (credenciales + Google, roles USER / STREAMER / ADMIN)

## Primeros pasos (local)

Necesitas una base de datos PostgreSQL corriendo (local o en la nube, ver
más abajo).

```bash
npm install
cp .env.example .env   # completa DATABASE_URL y AUTH_SECRET
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Desplegar en Vercel (con base de datos en la nube)

1. Crea una base de datos Postgres gratis en [Neon](https://neon.tech) o
   [Vercel Postgres](https://vercel.com/storage/postgres) (ambos tienen
   plan gratuito). Copia el connection string que te dan.
2. En [vercel.com](https://vercel.com), "Add New Project" → importa el
   repo `Ckryzx/Galaxy2` (rama con el código de la app).
3. En las variables de entorno del proyecto agrega:
   - `DATABASE_URL`: el connection string de Neon/Vercel Postgres.
   - `AUTH_SECRET`: un valor random (puedes generarlo con `openssl rand -base64 32`).
   - `SEED_SECRET`: otro valor random, para poder poblar la base una vez
     (ver paso 5).
4. Dale "Deploy". El build corre `prisma migrate deploy` automáticamente,
   así que las tablas quedan creadas solas — no necesitas correr
   migraciones a mano ni conectarte tú a la base de datos.
5. Una vez desplegado, siembra los clubes/jugadores/usuarios demo con un
   solo request a tu propio dominio de Vercel (reemplaza la URL y el
   secreto):
   ```bash
   curl -X POST https://tu-proyecto.vercel.app/api/admin/seed \
     -H "x-seed-secret: el-valor-que-pusiste-en-SEED_SECRET"
   ```
   Esto corre en los servidores de Vercel, así que funciona aunque tu
   red/ISP bloquee conexiones directas a la base de datos (un problema
   común al intentar correr `prisma db seed` desde una PC casera).
6. Si vas a usarla en serio, cambia las contraseñas de las cuentas demo
   (o bórralas) antes de compartir el link con tus streamers.

## Actualizar clubes/jugadores sin borrar usuarios

`POST /api/admin/seed` **borra todo** (usuarios, equipos, ligas, notas) y
vuelve a poblar desde cero — solo úsalo la primera vez, o si quieres
resetear todo a propósito.

Para actualizar los planteles (fichajes, precios) sin perder las cuentas
que ya se registraron, usa en cambio:

```bash
curl -X POST https://tu-proyecto.vercel.app/api/admin/sync-players \
  -H "x-seed-secret: el-valor-que-pusiste-en-SEED_SECRET"
```

Esto crea o actualiza clubes/jugadores según lo que haya en
`src/lib/seedData.ts`, y borra clubes que ya no estén en esa lista (por
ejemplo, un descenso) — pero solo si ninguno de sus jugadores está en la
plantilla de algún usuario, para no romper equipos existentes. Usuarios,
equipos, ligas y notas quedan intactos.

## Iniciar sesión con Google

1. Ve a [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Crea un proyecto (o usa uno existente) y dale a **"Create Credentials" →
   "OAuth client ID"**.
3. Si te pide configurar la "OAuth consent screen" primero, elige tipo
   **External**, completa el nombre de la app y tu correo, y guarda (no
   necesitas mandarla a revisión para uso propio/con amigos, solo agrega
   tu correo y el de tus streamers como "Test users" en esa pantalla).
4. Tipo de aplicación: **Web application**.
5. En **"Authorized redirect URIs"** agrega, exactamente:
   - Para producción: `https://tu-dominio.vercel.app/api/auth/callback/google`
   - Para desarrollo local: `http://localhost:3000/api/auth/callback/google`
6. Crea las credenciales y copia el **Client ID** y **Client Secret**.
7. Agrégalos como variables de entorno (`GOOGLE_CLIENT_ID`,
   `GOOGLE_CLIENT_SECRET`) tanto en tu `.env` local como en Vercel, y
   vuelve a desplegar.

Con eso, el botón "Continuar con Google" en login/registro va a funcionar.
Si alguien entra por primera vez con Google, se le crea la cuenta y su
equipo por defecto automáticamente, igual que con registro normal.

## Usuarios de ejemplo (creados por el seed)

| Rol      | Correo                     | Contraseña     |
| -------- | --------------------------- | -------------- |
| Admin    | admin@fantasyliga.cl        | admin1234      |
| Streamer | streamer@fantasyliga.cl     | streamer1234   |
| Usuario  | usuario@fantasyliga.cl      | usuario1234    |

## Cómo funciona

1. **Arma tu plantilla**: 15 jugadores (2 arqueros, 5 defensas, 5
   mediocampistas, 3 delanteros) con 100M de presupuesto y máximo 3
   jugadores por club.
2. **Define tu once titular**: formación válida, capitán (puntos x2) y
   vicecapitán (respaldo si el capitán no fue calificado esa fecha).
3. **Los streamers califican**: en el Panel Streamer (roles `STREAMER` o
   `ADMIN`), después de cada fecha, le ponen una nota de 0 a 10 a cada
   jugador que jugó.
4. **Se calculan los puntajes**: al "Finalizar jornada", se recalculan los
   puntos de todos los equipos según su alineación titular vigente.
5. **Compite**: ranking global y ligas privadas con código de invitación.

## Comandos útiles

```bash
npm run dev            # servidor de desarrollo
npm run build           # build de producción
npx prisma studio        # explorar la base de datos
npx prisma db seed       # volver a poblar clubes/jugadores/usuarios demo
```
