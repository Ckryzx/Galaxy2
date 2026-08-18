# Fantasy Liga Chilena

Un Fantasy de fútbol para la Liga de Primera chilena, con la misma mecánica
de armar equipo, presupuesto y capitán que el Fantasy que ya conoces — pero
con un giro: **las notas de cada jugador las ponen a mano streamers de
confianza** después de cada fecha, en vez de calcularse automáticamente con
estadísticas.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma](https://www.prisma.io) + SQLite
- [NextAuth v5](https://authjs.dev) (credenciales, roles USER / STREAMER / ADMIN)

## Primeros pasos

```bash
npm install
cp .env.example .env   # ajusta AUTH_SECRET si quieres
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

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
