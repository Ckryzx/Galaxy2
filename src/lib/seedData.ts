import { PrismaClient, Position, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createFantasyTeamWithDefaultSquad } from "@/lib/defaultSquad";

type PlayerSeed = { name: string; position: Position; price: number };

type ClubSeed = {
  name: string;
  shortName: string;
  colorHex: string;
  roster: PlayerSeed[];
};

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
  },
  {
    name: "Huachipato",
    shortName: "HUA",
    colorHex: "#002d62",
    roster: [
      { name: "Sebastián Mella", position: Position.GK, price: 6.7 },
      { name: "Christian Bravo", position: Position.GK, price: 6.5 },
      { name: "Rodrigo Odriozola", position: Position.GK, price: 4.6 },
      { name: "Ignacio Cruzat", position: Position.GK, price: 4.5 },
      { name: "Cristián Toro", position: Position.DEF, price: 6.5 },
      { name: "Nicolás Vargas", position: Position.DEF, price: 5.6 },
      { name: "Rafael Caroca", position: Position.DEF, price: 4.9 },
      { name: "Benjamín Mellado", position: Position.DEF, price: 4.6 },
      { name: "Lucas Velásquez", position: Position.DEF, price: 6.9 },
      { name: "José Ignacio Castro", position: Position.DEF, price: 5.7 },
      { name: "Maicol León", position: Position.DEF, price: 6.2 },
      { name: "Guillermo Guaiquil", position: Position.DEF, price: 5.4 },
      { name: "Carlos Herrera", position: Position.MID, price: 5.7 },
      { name: "Claudio Sepúlveda", position: Position.MID, price: 5.6 },
      { name: "Ezequiel Cañete", position: Position.MID, price: 6.6 },
      { name: "Javier Cárcamo", position: Position.MID, price: 5.7 },
      { name: "Kevin Altez", position: Position.MID, price: 6.0 },
      { name: "Mario Briceño", position: Position.MID, price: 7.0 },
      { name: "Cris Martínez", position: Position.MID, price: 6.6 },
      { name: "Harold Antiñirre", position: Position.MID, price: 5.9 },
      { name: "Juan Ignacio Figueroa", position: Position.MID, price: 6.7 },
      { name: "Claudio Torres", position: Position.MID, price: 6.0 },
      { name: "Maximiliano Rodríguez", position: Position.FWD, price: 7.0 },
      { name: "Sergio Núñez", position: Position.FWD, price: 6.9 },
      { name: "Lionel Altamirano", position: Position.FWD, price: 6.9 },
      { name: "Luciano Arriagada", position: Position.FWD, price: 4.5 },
    ],
  },
  {
    name: "Cobresal",
    shortName: "COB",
    colorHex: "#e30613",
    roster: [
      { name: "Alejandro Santander", position: Position.GK, price: 5.1 },
      { name: "Matías Olguín", position: Position.GK, price: 5.1 },
      { name: "José Tiznado", position: Position.DEF, price: 6.5 },
      { name: "Christian Moreno", position: Position.DEF, price: 6.0 },
      { name: "Franco Bechtholdt", position: Position.DEF, price: 5.6 },
      { name: "Benjamín Villarroel", position: Position.DEF, price: 4.5 },
      { name: "Antonio Castillo", position: Position.DEF, price: 6.0 },
      { name: "Rodrigo Sandoval", position: Position.DEF, price: 5.9 },
      { name: "Aaron Astudillo", position: Position.DEF, price: 6.2 },
      { name: "Guillermo Pacheco", position: Position.DEF, price: 4.9 },
      { name: "Víctor Campos", position: Position.DEF, price: 4.5 },
      { name: "Juan Fuentes", position: Position.MID, price: 6.2 },
      { name: "Oliver Ramis", position: Position.MID, price: 4.5 },
      { name: "Esteban Valencia", position: Position.MID, price: 6.2 },
      { name: "Felipe Villagrán", position: Position.MID, price: 5.7 },
      { name: "Benjamín Valenzuela", position: Position.MID, price: 5.4 },
      { name: "Bryan Carvallo", position: Position.MID, price: 6.6 },
      { name: "Matías Contreras", position: Position.MID, price: 4.5 },
      { name: "Janpol Morales", position: Position.MID, price: 5.9 },
      { name: "Benjamín Moreno", position: Position.MID, price: 4.9 },
      { name: "Benjamín Ramírez", position: Position.MID, price: 4.5 },
      { name: "Julián Brea", position: Position.MID, price: 6.9 },
      { name: "César Yanis", position: Position.MID, price: 6.7 },
      { name: "Renato Huerta", position: Position.MID, price: 5.7 },
      { name: "Steffan Pino", position: Position.FWD, price: 6.7 },
      { name: "Franco Frías", position: Position.FWD, price: 6.7 },
      { name: "Sergio Carrasco", position: Position.FWD, price: 4.9 },
      { name: "Martín Espinoza Pino", position: Position.FWD, price: 4.5 },
    ],
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
  },
  {
    name: "Deportes Concepción",
    shortName: "DCO",
    colorHex: "#e30613",
    roster: [
      { name: "Nicolás Araya", position: Position.GK, price: 5.7 },
      { name: "César", position: Position.GK, price: 4.9 },
      { name: "Nery Veloso", position: Position.GK, price: 4.5 },
      { name: "Norman Rodríguez", position: Position.DEF, price: 6.7 },
      { name: "Diego Carrasco", position: Position.DEF, price: 6.0 },
      { name: "Fausto Grillo", position: Position.DEF, price: 5.6 },
      { name: "Brayan Véjar", position: Position.DEF, price: 6.2 },
      { name: "Cristián Riquelme", position: Position.DEF, price: 6.0 },
      { name: "Dilan Varas", position: Position.DEF, price: 4.5 },
      { name: "Ariel Cáceres", position: Position.DEF, price: 5.9 },
      { name: "Fernando Martínez", position: Position.MID, price: 5.9 },
      { name: "Yonatan Rodríguez", position: Position.MID, price: 5.6 },
      { name: "Sebastián Martínez", position: Position.MID, price: 4.6 },
      { name: "Misael Dávila", position: Position.MID, price: 5.7 },
      { name: "Fabrizio Manzo", position: Position.MID, price: 5.1 },
      { name: "Mario Sandoval", position: Position.MID, price: 5.1 },
      { name: "Jorge Henríquez", position: Position.MID, price: 6.0 },
      { name: "Leenhan Romero", position: Position.MID, price: 4.6 },
      { name: "Ethan Espinoza", position: Position.MID, price: 6.9 },
      { name: "Joaquín Montecinos", position: Position.MID, price: 6.5 },
      { name: "Aldrix Jara", position: Position.MID, price: 6.5 },
      { name: "Matías Cavalleri", position: Position.MID, price: 5.4 },
      { name: "Bastián Escobar", position: Position.MID, price: 5.1 },
      { name: "Fernando Romero", position: Position.FWD, price: 6.5 },
      { name: "Diego Acosta", position: Position.FWD, price: 6.0 },
      { name: "Carlos Escobar", position: Position.FWD, price: 4.6 },
      { name: "Joaquín Larrivey", position: Position.FWD, price: 4.5 },
    ],
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
  },
  {
    name: "Unión La Calera",
    shortName: "ULC",
    colorHex: "#00539f",
    roster: [
      { name: "Nicolás Avellaneda", position: Position.GK, price: 5.9 },
      { name: "Nelson Espinoza", position: Position.GK, price: 5.4 },
      { name: "Daniel Gutiérrez", position: Position.DEF, price: 7.0 },
      { name: "Rodrigo Cáseres", position: Position.DEF, price: 6.9 },
      { name: "Juan Salomoni", position: Position.DEF, price: 6.9 },
      { name: "Nicolás Palma", position: Position.DEF, price: 6.4 },
      { name: "Vicente Lavín", position: Position.DEF, price: 6.0 },
      { name: "Alexander Pastene", position: Position.DEF, price: 4.6 },
      { name: "Cristián Gutiérrez", position: Position.DEF, price: 6.0 },
      { name: "Michael Maturana", position: Position.DEF, price: 4.6 },
      { name: "Valentino Torrente", position: Position.DEF, price: 4.5 },
      { name: "Christopher Díaz", position: Position.DEF, price: 6.7 },
      { name: "Javier Saldías", position: Position.DEF, price: 5.7 },
      { name: "Camilo Moya", position: Position.MID, price: 6.7 },
      { name: "Yerko Leiva", position: Position.MID, price: 6.6 },
      { name: "Rodrigo Pérez", position: Position.MID, price: 6.5 },
      { name: "Joaquín Soto", position: Position.MID, price: 6.5 },
      { name: "Yonathan Andía", position: Position.MID, price: 4.9 },
      { name: "Benjamín Argandoña", position: Position.MID, price: 4.5 },
      { name: "Carlo Villanueva", position: Position.MID, price: 6.7 },
      { name: "Joan Cruz", position: Position.MID, price: 6.2 },
      { name: "Axel Encinas", position: Position.MID, price: 6.0 },
      { name: "Martín Hiriart", position: Position.MID, price: 4.9 },
      { name: "Kevin Méndez", position: Position.MID, price: 7.0 },
      { name: "Bayron Oyarzo", position: Position.MID, price: 6.7 },
      { name: "Nicolás Ferreyra", position: Position.FWD, price: 6.5 },
      { name: "Francisco Pozzo", position: Position.FWD, price: 6.2 },
      { name: "Matías Campos López", position: Position.FWD, price: 5.3 },
      { name: "Sebastián Sáez", position: Position.FWD, price: 4.5 },
    ],
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
  },
];

export type SyncResult = {
  clubsCreated: number;
  clubsUpdated: number;
  playersCreated: number;
  playersUpdated: number;
  staleClubsRemoved: number;
  staleClubsSkipped: number;
};

/**
 * Crea o actualiza clubes/jugadores con la data de `clubs` SIN borrar
 * usuarios, equipos, ligas ni notas — a diferencia de runSeed(). Pensado
 * para actualizar los planteles en producción cuando ya hay gente jugando.
 */
export async function syncClubsAndPlayers(prisma: PrismaClient): Promise<SyncResult> {
  const result: SyncResult = {
    clubsCreated: 0,
    clubsUpdated: 0,
    playersCreated: 0,
    playersUpdated: 0,
    staleClubsRemoved: 0,
    staleClubsSkipped: 0,
  };

  for (const club of clubs) {
    const existingClub = await prisma.club.findUnique({ where: { name: club.name } });
    const dbClub = existingClub
      ? await prisma.club.update({
          where: { id: existingClub.id },
          data: { shortName: club.shortName, colorHex: club.colorHex },
        })
      : await prisma.club.create({
          data: { name: club.name, shortName: club.shortName, colorHex: club.colorHex },
        });

    if (existingClub) result.clubsUpdated += 1;
    else result.clubsCreated += 1;

    for (const player of club.roster) {
      const existingPlayer = await prisma.player.findFirst({
        where: { clubId: dbClub.id, name: player.name },
      });

      if (existingPlayer) {
        await prisma.player.update({
          where: { id: existingPlayer.id },
          data: { position: player.position, price: player.price },
        });
        result.playersUpdated += 1;
      } else {
        await prisma.player.create({
          data: {
            name: player.name,
            position: player.position,
            price: player.price,
            clubId: dbClub.id,
          },
        });
        result.playersCreated += 1;
      }
    }
  }

  const currentNames = clubs.map((c) => c.name);
  const staleClubs = await prisma.club.findMany({ where: { name: { notIn: currentNames } } });

  for (const staleClub of staleClubs) {
    const players = await prisma.player.findMany({ where: { clubId: staleClub.id } });
    const squadUsageCounts = await Promise.all(
      players.map((p) => prisma.squadPlayer.count({ where: { playerId: p.id } })),
    );
    const isSafeToRemove = squadUsageCounts.every((count) => count === 0);

    if (isSafeToRemove) {
      await prisma.player.deleteMany({ where: { clubId: staleClub.id } });
      await prisma.club.delete({ where: { id: staleClub.id } });
      result.staleClubsRemoved += 1;
    } else {
      result.staleClubsSkipped += 1;
    }
  }

  return result;
}

export async function runSeed(prisma: PrismaClient): Promise<void> {
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
