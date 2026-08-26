# Fantasy Liga Chilena

Un Fantasy de fútbol para la Liga de Primera chilena, con la misma mecánica
de armar equipo, presupuesto y capitán que el Fantasy que ya conoces — pero
con un giro: **las notas de cada jugador las ponen a mano streamers de
confianza** después de cada fecha, en vez de calcularse automáticamente con
estadísticas.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + PostgreSQL
- [NextAuth v5](https://authjs.dev) (credenciales, roles USER / STREAMER / ADMIN)

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
4. Dale "Deploy".
5. Una vez desplegado, corre las migraciones y el seed **una sola vez**
   contra esa base de datos en la nube, desde tu computador:
   ```bash
   DATABASE_URL="el-connection-string-de-neon" npx prisma migrate deploy
   DATABASE_URL="el-connection-string-de-neon" npx prisma db seed
   ```
6. Si vas a usarla en serio, cambia las contraseñas de las cuentas demo
   (o bórralas) antes de compartir el link con tus streamers.

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
