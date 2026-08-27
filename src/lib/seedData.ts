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
    roster: [
      { name: "Vicente Bernedo", position: Position.GK, price: 8.0 },
      { name: "Darío Melo", position: Position.GK, price: 5.1 },
      { name: "Daniel González", position: Position.DEF, price: 9.6 },
      { name: "Juan Ignacio Díaz", position: Position.DEF, price: 7.5 },
      { name: "Branco Ampuero", position: Position.DEF, price: 7.0 },
      { name: "Tomás Asta-Buruaga", position: Position.DEF, price: 6.7 },
      { name: "Agustín García Basso", position: Position.DEF, price: 6.2 },
      { name: "Ignacio Pérez", position: Position.DEF, price: 4.9 },
      { name: "Nicolás L'Huillier", position: Position.DEF, price: 5.7 },
      { name: "Eugenio Mena", position: Position.DEF, price: 5.3 },
      { name: "Sebastián Arancibia", position: Position.DEF, price: 8.5 },
      { name: "Bernardo Cerezo", position: Position.DEF, price: 6.7 },
      { name: "Jhojan Valencia", position: Position.MID, price: 9.0 },
      { name: "Alfred Canales", position: Position.MID, price: 7.4 },
      { name: "Agustín Farías", position: Position.MID, price: 4.6 },
      { name: "Gary Medel", position: Position.MID, price: 4.5 },
      { name: "Jimmy Martínez", position: Position.MID, price: 7.7 },
      { name: "Fernando Zuqui", position: Position.MID, price: 6.2 },
      { name: "Matías Palavecino", position: Position.MID, price: 8.5 },
      { name: "Juan Francisco Rossel", position: Position.MID, price: 6.9 },
      { name: "Martin Gómez", position: Position.MID, price: 4.6 },
      { name: "Justo Giani", position: Position.MID, price: 12.2 },
      { name: "Clemente Montes", position: Position.MID, price: 9.6 },
      { name: "Cristian Cuevas", position: Position.MID, price: 7.7 },
      { name: "Diego Corral", position: Position.MID, price: 7.0 },
      { name: "Diego Valencia", position: Position.FWD, price: 7.0 },
      { name: "Fernando Zampedri", position: Position.FWD, price: 7.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "Palestino",
    shortName: "PAL",
    colorHex: "#000000",
    roster: [
      { name: "Sebastián Pérez", position: Position.GK, price: 5.9 },
      { name: "Sebastián Salas", position: Position.GK, price: 5.1 },
      { name: "Antonio Ceza", position: Position.DEF, price: 7.0 },
      { name: "Enzo Roco", position: Position.DEF, price: 6.2 },
      { name: "José Bizama", position: Position.DEF, price: 5.7 },
      { name: "Fernando Meza", position: Position.DEF, price: 4.6 },
      { name: "Dilan Zúñiga", position: Position.DEF, price: 7.7 },
      { name: "Jason León", position: Position.DEF, price: 7.4 },
      { name: "Ian Garguez", position: Position.DEF, price: 9.0 },
      { name: "Vicente Espinoza", position: Position.DEF, price: 6.7 },
      { name: "Simón Pinto", position: Position.DEF, price: 4.5 },
      { name: "Dylan Glaby", position: Position.MID, price: 6.9 },
      { name: "Francisco Montes", position: Position.MID, price: 6.5 },
      { name: "Ariel Martínez", position: Position.MID, price: 6.0 },
      { name: "Nicolás Meza", position: Position.MID, price: 5.7 },
      { name: "Sebastián Gallegos", position: Position.MID, price: 5.4 },
      { name: "Joe Abrigo", position: Position.MID, price: 7.5 },
      { name: "Marcelo Eggel", position: Position.MID, price: 7.0 },
      { name: "César Munder", position: Position.MID, price: 8.0 },
      { name: "Martín Araya", position: Position.MID, price: 6.2 },
      { name: "Jonathan Benítez", position: Position.MID, price: 5.9 },
      { name: "Dilan Salgado", position: Position.MID, price: 5.7 },
      { name: "Ian Alegría", position: Position.MID, price: 4.6 },
      { name: "Bryan Carrasco", position: Position.MID, price: 5.4 },
      { name: "Nelson Da Silva", position: Position.FWD, price: 7.4 },
      { name: "Gonzalo Tapia", position: Position.FWD, price: 6.7 },
      { name: "Ronnie Fernández", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
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
    roster: [
      { name: "Esteban Kirkman", position: Position.GK, price: 5.3 },
      { name: "Ignacio González", position: Position.GK, price: 5.1 },
      { name: "Isaac Esquenazi", position: Position.GK, price: 4.5 },
      { name: "Hugo Magallanes", position: Position.DEF, price: 6.7 },
      { name: "Valentín Vidal", position: Position.DEF, price: 6.7 },
      { name: "Diego Oyarzún", position: Position.DEF, price: 5.9 },
      { name: "Vicente Vega", position: Position.DEF, price: 5.3 },
      { name: "Ramiro González", position: Position.DEF, price: 5.1 },
      { name: "Vicente Fernández", position: Position.DEF, price: 6.7 },
      { name: "Nicolás Baeza", position: Position.DEF, price: 6.0 },
      { name: "Lucas Soto", position: Position.DEF, price: 7.5 },
      { name: "Cristopher Barrera", position: Position.DEF, price: 5.7 },
      { name: "Martín Guzmán", position: Position.DEF, price: 5.3 },
      { name: "Óscar Opazo", position: Position.DEF, price: 4.9 },
      { name: "Benjamín Berríos", position: Position.MID, price: 7.4 },
      { name: "Gustavo Charrupí", position: Position.MID, price: 7.2 },
      { name: "Joaquín Moya", position: Position.MID, price: 6.2 },
      { name: "Andrés Arroyo", position: Position.MID, price: 9.0 },
      { name: "Amaro León", position: Position.MID, price: 4.5 },
      { name: "Emiliano Ramos", position: Position.MID, price: 6.9 },
      { name: "Braian Martínez", position: Position.MID, price: 6.9 },
      { name: "Josué Ovalle", position: Position.MID, price: 9.6 },
      { name: "Julián Alfaro", position: Position.MID, price: 6.5 },
      { name: "Alan Medina", position: Position.MID, price: 9.2 },
      { name: "Sebastián Sosa", position: Position.FWD, price: 6.5 },
      { name: "Nicolás Montiel", position: Position.FWD, price: 5.6 },
      { name: "Cristian Palacios", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "Audax Italiano",
    shortName: "AUD",
    colorHex: "#0f8a3c",
    roster: [
      { name: "Tomás Ahumada", position: Position.GK, price: 8.5 },
      { name: "Pedro Garrido", position: Position.GK, price: 4.6 },
      { name: "Enzo Ferrario", position: Position.DEF, price: 8.0 },
      { name: "Daniel Piña", position: Position.DEF, price: 6.9 },
      { name: "Marcelo Ortiz", position: Position.DEF, price: 5.9 },
      { name: "Cristóbal Muñoz", position: Position.DEF, price: 5.4 },
      { name: "Diego Monreal", position: Position.DEF, price: 4.9 },
      { name: "Felipe Salomoni", position: Position.DEF, price: 7.0 },
      { name: "Oliver Rojas", position: Position.DEF, price: 7.0 },
      { name: "Raimundo Rebolledo", position: Position.DEF, price: 5.7 },
      { name: "Martín Jiménez", position: Position.DEF, price: 5.1 },
      { name: "Vicente Zenteno", position: Position.MID, price: 5.9 },
      { name: "Bryan Soto", position: Position.MID, price: 5.7 },
      { name: "Mario Sandoval", position: Position.MID, price: 5.4 },
      { name: "Marco Collao", position: Position.MID, price: 7.7 },
      { name: "Nicolás Orellana", position: Position.MID, price: 6.5 },
      { name: "Federico Mateos", position: Position.MID, price: 6.2 },
      { name: "Nicolás Aedo", position: Position.MID, price: 6.2 },
      { name: "César Pinares", position: Position.MID, price: 6.0 },
      { name: "Favian Loyola", position: Position.MID, price: 5.7 },
      { name: "Michael Vadulli", position: Position.MID, price: 7.8 },
      { name: "Rodrigo Cabral", position: Position.MID, price: 6.9 },
      { name: "Giovani Chiaverano", position: Position.MID, price: 7.4 },
      { name: "Ariel Uribe", position: Position.MID, price: 7.4 },
      { name: "Paolo Guajardo", position: Position.MID, price: 6.7 },
      { name: "Damián Pizarro", position: Position.FWD, price: 10.6 },
      { name: "Diego Coelho", position: Position.FWD, price: 7.4 },
      { name: "Franco Troyansky", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "O'Higgins",
    shortName: "OHI",
    colorHex: "#00953b",
    roster: [
      { name: "Omar Carabalí", position: Position.GK, price: 8.5 },
      { name: "Jorge Peña", position: Position.GK, price: 6.7 },
      { name: "Diego Carreño", position: Position.GK, price: 4.9 },
      { name: "Tomás Avilés", position: Position.DEF, price: 11.4 },
      { name: "Alan Robledo", position: Position.DEF, price: 7.8 },
      { name: "Miguel Brizuela", position: Position.DEF, price: 7.7 },
      { name: "Nicolás Garrido", position: Position.DEF, price: 6.7 },
      { name: "José Tomás Movillo", position: Position.DEF, price: 4.5 },
      { name: "Leandro Díaz", position: Position.DEF, price: 6.9 },
      { name: "Luis Pavez Muñoz", position: Position.DEF, price: 6.7 },
      { name: "Felipe Faúndez", position: Position.DEF, price: 8.0 },
      { name: "Benjamín Rojas", position: Position.DEF, price: 6.2 },
      { name: "Cristián Morales", position: Position.DEF, price: 5.3 },
      { name: "Felipe Ogaz", position: Position.MID, price: 7.7 },
      { name: "Gabriel Pinto", position: Position.MID, price: 5.4 },
      { name: "Juan Leiva", position: Position.MID, price: 6.9 },
      { name: "Bryan Rabello", position: Position.MID, price: 6.9 },
      { name: "Martín Maturana", position: Position.MID, price: 6.6 },
      { name: "Santiago Toloza", position: Position.MID, price: 6.5 },
      { name: "Bastián Yáñez", position: Position.MID, price: 6.7 },
      { name: "Rodrigo Godoy", position: Position.MID, price: 6.2 },
      { name: "Ignacio Schor", position: Position.MID, price: 7.4 },
      { name: "Joaquín Tapia", position: Position.MID, price: 6.0 },
      { name: "Walter Bou", position: Position.FWD, price: 7.8 },
      { name: "Thiago Vecino", position: Position.FWD, price: 7.4 },
      { name: "Arnaldo Castillo", position: Position.FWD, price: 6.9 },
      { name: "David Fernández", position: Position.FWD, price: 6.1 },
      { name: "Esteban Moreira", position: Position.FWD, price: 5.4 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
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
    roster: [
      { name: "Gonzalo Flores", position: Position.GK, price: 6.0 },
      { name: "Diego Sánchez", position: Position.GK, price: 4.6 },
      { name: "Cristóbal Dorador", position: Position.GK, price: 4.5 },
      { name: "Benjamín Gazzolo", position: Position.DEF, price: 7.7 },
      { name: "Elvis Hernández", position: Position.DEF, price: 6.7 },
      { name: "Manuel Fernández", position: Position.DEF, price: 4.6 },
      { name: "Joshua Arancibia", position: Position.DEF, price: 4.5 },
      { name: "Sebastián Cabrera", position: Position.DEF, price: 7.8 },
      { name: "Juan Cornejo", position: Position.DEF, price: 5.1 },
      { name: "Francisco Salinas", position: Position.DEF, price: 10.2 },
      { name: "Lukas Soza", position: Position.DEF, price: 5.4 },
      { name: "Sebastián Galani", position: Position.MID, price: 9.0 },
      { name: "Salvador Cordero", position: Position.MID, price: 6.5 },
      { name: "Alejandro Camargo", position: Position.MID, price: 4.9 },
      { name: "Matías Zepeda", position: Position.MID, price: 6.7 },
      { name: "Guido Vadalá", position: Position.MID, price: 7.4 },
      { name: "Pablo Rodríguez", position: Position.MID, price: 6.0 },
      { name: "Benjamín Chandía", position: Position.MID, price: 9.6 },
      { name: "Martín Mundaca", position: Position.MID, price: 7.5 },
      { name: "Matías Alvarado", position: Position.MID, price: 5.4 },
      { name: "Cristián Zavala", position: Position.MID, price: 9.0 },
      { name: "Alejandro Azócar", position: Position.MID, price: 8.0 },
      { name: "Luis Riveros", position: Position.MID, price: 6.9 },
      { name: "Dixon Pereira", position: Position.MID, price: 4.5 },
      { name: "Nicolás Johansen", position: Position.FWD, price: 8.0 },
      { name: "Facundo Pons", position: Position.FWD, price: 6.6 },
      { name: "Lucas Pratto", position: Position.FWD, price: 4.9 },
      { name: "Rodrigo Holgado", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "Ñublense",
    shortName: "NUB",
    colorHex: "#d2001c",
    roster: [
      { name: "Nicola Pérez", position: Position.GK, price: 5.7 },
      { name: "Hernán Muñoz", position: Position.GK, price: 4.5 },
      { name: "Osvaldo Bosso", position: Position.DEF, price: 6.2 },
      { name: "Pablo Calderón", position: Position.DEF, price: 6.2 },
      { name: "Sebastián Valencia", position: Position.DEF, price: 6.1 },
      { name: "Felipe Campos", position: Position.DEF, price: 6.0 },
      { name: "Carlos Salomón", position: Position.DEF, price: 5.4 },
      { name: "Jovany Campusano", position: Position.DEF, price: 6.2 },
      { name: "Diego Sanhueza", position: Position.DEF, price: 7.0 },
      { name: "Joaquín González", position: Position.DEF, price: 5.1 },
      { name: "Diego Céspedes", position: Position.MID, price: 7.0 },
      { name: "Lorenzo Reyes", position: Position.MID, price: 5.7 },
      { name: "Manuel Rivera", position: Position.MID, price: 7.0 },
      { name: "Daniel Saavedra", position: Position.MID, price: 5.4 },
      { name: "León Mansilla", position: Position.MID, price: 4.5 },
      { name: "Matías Plaza", position: Position.MID, price: 7.5 },
      { name: "Ignacio Tapia", position: Position.MID, price: 6.2 },
      { name: "Lucas Molina", position: Position.MID, price: 6.2 },
      { name: "Giovanny Ávalos", position: Position.MID, price: 6.0 },
      { name: "Alex Valdés", position: Position.MID, price: 5.9 },
      { name: "Gabriel Graciani", position: Position.MID, price: 7.0 },
      { name: "Fernando Ovelar", position: Position.MID, price: 6.7 },
      { name: "Ignacio Jeraldino", position: Position.FWD, price: 7.0 },
      { name: "Esteban Calderón", position: Position.FWD, price: 6.7 },
      { name: "Franco Rami", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "Universidad de Concepción",
    shortName: "UDC",
    colorHex: "#4b1e78",
    roster: [
      { name: "José Sanhueza", position: Position.GK, price: 5.9 },
      { name: "Jorge Broun", position: Position.GK, price: 5.1 },
      { name: "Diego Matamala", position: Position.GK, price: 4.5 },
      { name: "Miguel Barbieri", position: Position.DEF, price: 6.5 },
      { name: "David Retamal", position: Position.DEF, price: 6.5 },
      { name: "Bastián Ubal", position: Position.DEF, price: 6.5 },
      { name: "Moisés González", position: Position.DEF, price: 6.5 },
      { name: "Esteban Páez", position: Position.DEF, price: 5.1 },
      { name: "Osvaldo González", position: Position.DEF, price: 4.5 },
      { name: "Antonio Díaz", position: Position.DEF, price: 6.7 },
      { name: "Yerco Oyanedel", position: Position.DEF, price: 6.7 },
      { name: "Patricio Romero", position: Position.DEF, price: 5.4 },
      { name: "Jorge Espejo", position: Position.DEF, price: 7.4 },
      { name: "Benjamín Sáez", position: Position.DEF, price: 4.6 },
      { name: "Cristhofer Mesías", position: Position.MID, price: 7.0 },
      { name: "Bryan Ogaz", position: Position.MID, price: 6.5 },
      { name: "Francisco Herrera", position: Position.MID, price: 4.6 },
      { name: "Facundo Mater", position: Position.MID, price: 7.7 },
      { name: "Jeison Fuentealba", position: Position.MID, price: 7.7 },
      { name: "Luis Rojas", position: Position.MID, price: 6.2 },
      { name: "Pablo Parra", position: Position.MID, price: 6.0 },
      { name: "Iam González", position: Position.MID, price: 6.5 },
      { name: "Harol Salgado", position: Position.MID, price: 6.0 },
      { name: "Rodrigo Olivares", position: Position.MID, price: 5.6 },
      { name: "Cristóbal Zambrano", position: Position.MID, price: 4.5 },
      { name: "Daniel Barrea", position: Position.FWD, price: 7.0 },
      { name: "Rogelio Funes Mori", position: Position.FWD, price: 6.7 },
      { name: "Cecilio Waterman", position: Position.FWD, price: 6.0 },
      { name: "Diego Sabando", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
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
    roster: [
      { name: "Matías Bórquez", position: Position.GK, price: 6.7 },
      { name: "Claudio González", position: Position.GK, price: 4.6 },
      { name: "Martin Smith", position: Position.GK, price: 4.5 },
      { name: "Axel Alfonzo", position: Position.DEF, price: 7.7 },
      { name: "Augusto Aguirre", position: Position.DEF, price: 7.5 },
      { name: "Alfonso Parot", position: Position.DEF, price: 5.1 },
      { name: "Benjamín Molina", position: Position.DEF, price: 4.5 },
      { name: "Marcelo Flores", position: Position.DEF, price: 6.5 },
      { name: "Javier Rojas", position: Position.DEF, price: 5.7 },
      { name: "Yerko González", position: Position.DEF, price: 6.9 },
      { name: "Dylan Escobar", position: Position.DEF, price: 6.9 },
      { name: "Carlos Morales", position: Position.DEF, price: 6.0 },
      { name: "Misael Llantén", position: Position.MID, price: 6.7 },
      { name: "Ramón Martínez", position: Position.MID, price: 6.2 },
      { name: "Tiago Hernández", position: Position.MID, price: 6.2 },
      { name: "César Fuentes", position: Position.MID, price: 5.7 },
      { name: "Hugo Martínez", position: Position.MID, price: 7.0 },
      { name: "Flavio Moya", position: Position.MID, price: 6.9 },
      { name: "Leonardo Valencia", position: Position.MID, price: 6.0 },
      { name: "Vicente Cárcamo", position: Position.MID, price: 4.5 },
      { name: "Jean Meneses", position: Position.MID, price: 9.0 },
      { name: "Daniel Castro", position: Position.MID, price: 7.7 },
      { name: "Vicente Álvarez", position: Position.MID, price: 7.4 },
      { name: "Marcos Arturia", position: Position.FWD, price: 5.4 },
      { name: "Gonzalo Sosa", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
  },
  {
    name: "Deportes La Serena",
    shortName: "DLS",
    colorHex: "#00a0e3",
    roster: [
      { name: "Federico Lanzillotta", position: Position.GK, price: 5.7 },
      { name: "Ignacio Sáez", position: Position.GK, price: 5.7 },
      { name: "Eryin Sanhueza", position: Position.GK, price: 5.4 },
      { name: "José Tapia", position: Position.GK, price: 4.6 },
      { name: "Matías Pérez", position: Position.DEF, price: 7.0 },
      { name: "Andrés Zanini", position: Position.DEF, price: 6.5 },
      { name: "Lucas Alarcón", position: Position.DEF, price: 6.2 },
      { name: "Ian Rasso", position: Position.DEF, price: 4.9 },
      { name: "Fernando Dinamarca", position: Position.DEF, price: 6.5 },
      { name: "Yahir Salazar", position: Position.DEF, price: 5.9 },
      { name: "Rafael Delgado", position: Position.DEF, price: 5.1 },
      { name: "Joaquín Gutiérrez", position: Position.DEF, price: 7.0 },
      { name: "Bruno Gutiérrez", position: Position.DEF, price: 6.7 },
      { name: "Matías Pinto", position: Position.DEF, price: 5.7 },
      { name: "Sebastián Díaz", position: Position.MID, price: 6.7 },
      { name: "Francis Mac Allister", position: Position.MID, price: 6.5 },
      { name: "Gonzalo Escalante", position: Position.MID, price: 6.9 },
      { name: "Matías Marín", position: Position.MID, price: 6.6 },
      { name: "Felipe Chamorro", position: Position.MID, price: 7.7 },
      { name: "Joan Orellana", position: Position.MID, price: 4.9 },
      { name: "Jeisson Vargas", position: Position.MID, price: 7.8 },
      { name: "Alexander Oroz", position: Position.MID, price: 5.7 },
      { name: "Cristóbal Sepúlveda", position: Position.MID, price: 4.5 },
      { name: "Bastián Contreras", position: Position.MID, price: 4.9 },
      { name: "Bastián Sandoval", position: Position.MID, price: 4.5 },
      { name: "Diego Rubio", position: Position.FWD, price: 7.5 },
      { name: "Ángelo Henríquez", position: Position.FWD, price: 6.2 },
      { name: "Nicolás Stefanelli", position: Position.FWD, price: 6.0 },
      { name: "Fabricio Díaz", position: Position.FWD, price: 4.9 },
      { name: "Gonzalo Figueroa", position: Position.FWD, price: 4.5 },
    ],
    stars: [],
    fillerCount: { GK: 0, DEF: 0, MID: 0, FWD: 0 },
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
