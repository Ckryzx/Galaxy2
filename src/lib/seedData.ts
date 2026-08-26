import { PrismaClient, Position, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

type ClubSeed = {
  name: string;
  shortName: string;
  colorHex: string;
  stars: { name: string; position: Position; price: number }[];
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
    stars: [
      { name: "Vicente Pizarro", position: Position.MID, price: 9.5 },
      { name: "Javier Correa", position: Position.FWD, price: 9.0 },
      { name: "Fernando De Paul", position: Position.GK, price: 6.0 },
      { name: "Erick Wiemberg", position: Position.DEF, price: 6.5 },
    ],
    fillerCount: { GK: 1, DEF: 6, MID: 5, FWD: 3 },
  },
  {
    name: "Universidad de Chile",
    shortName: "UCH",
    colorHex: "#0033a0",
    stars: [
      { name: "Charles Aránguiz", position: Position.MID, price: 9.0 },
      { name: "Lucas Assadi", position: Position.MID, price: 8.5 },
      { name: "Marcelo Cortés", position: Position.FWD, price: 7.5 },
      { name: "Gonzalo Tapia", position: Position.FWD, price: 7.0 },
    ],
    fillerCount: { GK: 1, DEF: 6, MID: 5, FWD: 3 },
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

  await prisma.user.create({
    data: {
      name: "Usuario Demo",
      email: "usuario@fantasyliga.cl",
      passwordHash: userPasswordHash,
      role: Role.USER,
      fantasyTeam: {
        create: { name: "Equipo Demo" },
      },
    },
  });
}
