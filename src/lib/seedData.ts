import { PrismaClient, Position, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createFantasyTeamWithDefaultSquad } from "@/lib/defaultSquad";

type PlayerSeed = { name: string; position: Position; price: number };

type ClubSeed = {
  name: string;
  shortName: string;
  colorHex: string;
  /** Plantel real (nombre/posición/precio), cuando ya lo tenemos confirmado. */
  roster?: PlayerSeed[];
  /** Mientras no tengamos el plantel real: algunos jugadores conocidos... */
  stars: PlayerSeed[];
  /** ...más relleno genérico para completar el resto del plantel. */
  fillerCount: { GK: number; DEF: number; MID: number; FWD: number };
};

const firstNames = [
  "Matías", "Sebastián", "Cristóbal", "Benjamín", "Vicente", "Joaquín", "Diego",
  "Felipe", "Ignacio", "Tomás", "Nicolás", "Gonzalo", "Rodrigo", "Francisco",
  "Maximiliano", "Bastián", "Martín", "Agustín", "Emilio", "Fabián", "Cristian",
  "Álvaro", "Jorge", "Pablo", "Andrés", "Esteban", "Rafael", "Marcelo", "Luciano",
  "Ángelo",
];

const lastNames = [
  "González", "Muñoz", "Rojas", "Díaz", "Fuentes", "Contreras", "Silva", "Pizarro",
  "Vergara", "Bravo", "Reyes", "Morales", "Espinoza", "Tapia", "Sepúlveda",
  "Carrasco", "Vásquez", "Riquelme", "Toro", "Cárdenas", "Vidal", "Sáez",
  "Órdenes", "Cornejo", "Aránguiz", "Zúñiga", "Lagos", "Ibáñez", "Pino", "Yáñez",
];

const clubs: ClubSeed[] = [
  {
    name: "Colo-Colo",
    shortName: "CCO",
    colorHex: "#1a1a1a",
    roster: [
      { name: "Vozinha", position: Position.GK, price: 7.0 },
      { name: "Gabriel Maureira", position: Position.GK, price: 6.5 },
      { name: "Fernando de Paul", position: Position.GK, price: 6.0 },
      { name: "Eduardo Villanueva", position: Position.GK, price: 4.5 },
      { name: "Iván Román", position: Position.DEF, price: 9.6 },
      { name: "Jonathan Villagra", position: Position.DEF, price: 8.5 },
      { name: "Joaquín Sosa", position: Position.DEF, price: 8.2 },
      { name: "Javier Méndez", position: Position.DEF, price: 6.5 },
      { name: "Miguel Toledo", position: Position.DEF, price: 4.5 },
      { name: "Diego Ulloa", position: Position.DEF, price: 7.8 },
      { name: "Erick Wiemberg", position: Position.DEF, price: 6.5 },
      { name: "Jeyson Rojas", position: Position.DEF, price: 7.0 },
      { name: "Matías Fernández", position: Position.DEF, price: 6.2 },
      { name: "Víctor Méndez", position: Position.MID, price: 9.6 },
      { name: "Tomás Alarcón", position: Position.MID, price: 7.7 },
      { name: "Álvaro Madrid", position: Position.MID, price: 7.4 },
      { name: "Arturo Vidal", position: Position.MID, price: 5.6 },
      { name: "Bastián Silva", position: Position.MID, price: 5.4 },
      { name: "Claudio Aquino", position: Position.MID, price: 7.0 },
      { name: "Lautaro Pastrán", position: Position.MID, price: 7.4 },
      { name: "Leandro Hernández", position: Position.MID, price: 7.0 },
      { name: "Francisco Marchant", position: Position.MID, price: 7.7 },
      { name: "Marcos Bolados", position: Position.MID, price: 6.1 },
      { name: "Maximiliano Romero", position: Position.FWD, price: 11.4 },
      { name: "Javier Correa", position: Position.FWD, price: 7.8 },
      { name: "Yastin Cuevas", position: Position.FWD, price: 6.7 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "Universidad de Chile",
    shortName: "UCH",
    colorHex: "#0033a0",
    roster: [
      { name: "Gabriel Castellón", position: Position.GK, price: 7.0 },
      { name: "Cristopher Toselli", position: Position.GK, price: 4.6 },
      { name: "Igor Lichnovsky", position: Position.DEF, price: 8.0 },
      { name: "Nicolás Ramírez", position: Position.DEF, price: 8.0 },
      { name: "Bianneider Tamayo", position: Position.DEF, price: 6.6 },
      { name: "Matías Zaldivia", position: Position.DEF, price: 6.5 },
      { name: "Marcelo Morales", position: Position.DEF, price: 9.6 },
      { name: "Diego Vargas", position: Position.DEF, price: 5.7 },
      { name: "Fabián Hormazábal", position: Position.DEF, price: 10.2 },
      { name: "Nicolás Fernández", position: Position.DEF, price: 6.7 },
      { name: "Tobías Reinhart", position: Position.MID, price: 7.7 },
      { name: "Marcelo Díaz", position: Position.MID, price: 4.5 },
      { name: "Israel Poblete", position: Position.MID, price: 7.8 },
      { name: "Lucas Barrera", position: Position.MID, price: 6.7 },
      { name: "Charles Aránguiz", position: Position.MID, price: 6.2 },
      { name: "Elías Rojas", position: Position.MID, price: 4.5 },
      { name: "Lucas Assadi", position: Position.MID, price: 11.4 },
      { name: "Javier Altamirano", position: Position.MID, price: 10.6 },
      { name: "Agustín Arce", position: Position.MID, price: 8.5 },
      { name: "Ignacio Vásquez", position: Position.MID, price: 7.7 },
      { name: "Maximiliano Guerrero", position: Position.MID, price: 8.5 },
      { name: "Gonzalo Reyna", position: Position.MID, price: 5.1 },
      { name: "Juan Martín Lucero", position: Position.FWD, price: 7.0 },
      { name: "Octavio Rivero", position: Position.FWD, price: 6.5 },
      { name: "Eduardo Vargas", position: Position.FWD, price: 5.6 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "Universidad Católica",
    shortName: "UC",
    colorHex: "#004c97",
    stars: [
      { name: "Fernando Zampedri", position: Position.FWD, price: 9.5 },
      { name: "Diego Valencia", position: Position.MID, price: 8.0 },
      { name: "Gary Medel", position: Position.DEF, price: 7.5 },
      { name: "Matías Dituro", position: Position.GK, price: 6.5 },
    ],
    fillerCount: { GK: 1, DEF: 6, MID: 5, FWD: 3 },
  },
  {
    name: "Palestino",
    shortName: "PAL",
    colorHex: "#000000",
    stars: [
      { name: "Bruno Barticciotto", position: Position.FWD, price: 6.5 },
      { name: "Agustín Farías", position: Position.MID, price: 5.5 },
    ],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 3 },
  },
  {
    name: "Huachipato",
    shortName: "HUA",
    colorHex: "#002d62",
    stars: [{ name: "Cristián Zavala", position: Position.MID, price: 5.5 }],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Cobresal",
    shortName: "COB",
    colorHex: "#e30613",
    stars: [{ name: "Sebastián Vegas", position: Position.DEF, price: 6.0 }],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Everton",
    shortName: "EVE",
    colorHex: "#ffd400",
    stars: [{ name: "Andrés Vilches", position: Position.FWD, price: 5.5 }],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Audax Italiano",
    shortName: "AUD",
    colorHex: "#0f8a3c",
    stars: [{ name: "Osvaldo González", position: Position.MID, price: 5.0 }],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "O'Higgins",
    shortName: "OHI",
    colorHex: "#00953b",
    stars: [{ name: "Nicolás Guerra", position: Position.FWD, price: 5.5 }],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Unión Española",
    shortName: "UES",
    colorHex: "#e30613",
    stars: [{ name: "Cristopher Toselli", position: Position.GK, price: 6.0 }],
    fillerCount: { GK: 1, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Coquimbo Unido",
    shortName: "CQB",
    colorHex: "#800080",
    stars: [{ name: "Sebastián Vegas Jr.", position: Position.MID, price: 5.5 }],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Ñublense",
    shortName: "NUB",
    colorHex: "#d2001c",
    stars: [{ name: "Andrés Ferrari", position: Position.DEF, price: 5.0 }],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Deportes Iquique",
    shortName: "DIQ",
    colorHex: "#4b1e78",
    stars: [],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Unión La Calera",
    shortName: "ULC",
    colorHex: "#00539f",
    stars: [],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Deportes Limache",
    shortName: "DLI",
    colorHex: "#c8102e",
    stars: [],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
  {
    name: "Deportes La Serena",
    shortName: "DLS",
    colorHex: "#00a0e3",
    stars: [],
    fillerCount: { GK: 2, DEF: 6, MID: 6, FWD: 4 },
  },
];

function priceForFiller(position: Position): number {
  const base: Record<Position, number> = {
    GK: 4.5,
    DEF: 4.5,
    MID: 4.5,
    FWD: 4.5,
  };
  const jitter = Math.round(Math.random() * 15) / 10;
  return Math.round((base[position] + jitter) * 10) / 10;
}

export async function runSeed(prisma: PrismaClient): Promise<void> {
  let nameCursor = 0;
  function nextGenericName(): string {
    const first = firstNames[nameCursor % firstNames.length];
    const last = lastNames[(nameCursor * 7 + 3) % lastNames.length];
    nameCursor += 1;
    return `${first} ${last}`;
  }

  await prisma.leagueMember.deleteMany();
  await prisma.league.deleteMany();
  await prisma.teamGameweekScore.deleteMany();
  await prisma.squadPlayer.deleteMany();
  await prisma.fantasyTeam.deleteMany();
  await prisma.playerRating.deleteMany();
  await prisma.gameweek.deleteMany();
  await prisma.player.deleteMany();
  await prisma.club.deleteMany();
  await prisma.user.deleteMany();

  for (const club of clubs) {
    const createdClub = await prisma.club.create({
      data: { name: club.name, shortName: club.shortName, colorHex: club.colorHex },
    });

    if (club.roster) {
      for (const player of club.roster) {
        await prisma.player.create({
          data: {
            name: player.name,
            position: player.position,
            price: player.price,
            clubId: createdClub.id,
          },
        });
      }
      continue;
    }

    for (const star of club.stars) {
      await prisma.player.create({
        data: {
          name: star.name,
          position: star.position,
          price: star.price,
          clubId: createdClub.id,
        },
      });
    }

    const positions: [Position, number][] = [
      [Position.GK, club.fillerCount.GK],
      [Position.DEF, club.fillerCount.DEF],
      [Position.MID, club.fillerCount.MID],
      [Position.FWD, club.fillerCount.FWD],
    ];

    for (const [position, count] of positions) {
      for (let i = 0; i < count; i += 1) {
        await prisma.player.create({
          data: {
            name: nextGenericName(),
            position,
            price: priceForFiller(position),
            clubId: createdClub.id,
          },
        });
      }
    }
  }

  const now = new Date();
  for (let i = 1; i <= 30; i += 1) {
    const deadline = new Date(now.getTime() + (i - 1) * 7 * 24 * 60 * 60 * 1000);
    await prisma.gameweek.create({
      data: {
        number: i,
        deadline,
        status: i === 1 ? "IN_PROGRESS" : "UPCOMING",
      },
    });
  }

  const adminPasswordHash = await bcrypt.hash("admin1234", 10);
  const streamerPasswordHash = await bcrypt.hash("streamer1234", 10);
  const userPasswordHash = await bcrypt.hash("usuario1234", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@fantasyliga.cl",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: "Streamer Demo",
      email: "streamer@fantasyliga.cl",
      passwordHash: streamerPasswordHash,
      role: Role.STREAMER,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: "Usuario Demo",
      email: "usuario@fantasyliga.cl",
      passwordHash: userPasswordHash,
      role: Role.USER,
    },
  });
  await createFantasyTeamWithDefaultSquad(prisma, demoUser.id, "Equipo Demo");
}
