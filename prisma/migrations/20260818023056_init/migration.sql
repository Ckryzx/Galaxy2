-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "colorHex" TEXT NOT NULL DEFAULT '#1f2937'
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "clubId" TEXT NOT NULL,
    CONSTRAINT "Player_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Gameweek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "deadline" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UPCOMING'
);

-- CreateTable
CREATE TABLE "PlayerRating" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "playerId" TEXT NOT NULL,
    "gameweekId" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "note" TEXT,
    "ratedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlayerRating_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerRating_gameweekId_fkey" FOREIGN KEY ("gameweekId") REFERENCES "Gameweek" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlayerRating_ratedById_fkey" FOREIGN KEY ("ratedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FantasyTeam" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "budget" REAL NOT NULL DEFAULT 100,
    "userId" TEXT NOT NULL,
    CONSTRAINT "FantasyTeam_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SquadPlayer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fantasyTeamId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "isStarting" BOOLEAN NOT NULL DEFAULT true,
    "isCaptain" BOOLEAN NOT NULL DEFAULT false,
    "isViceCaptain" BOOLEAN NOT NULL DEFAULT false,
    "slotOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SquadPlayer_fantasyTeamId_fkey" FOREIGN KEY ("fantasyTeamId") REFERENCES "FantasyTeam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SquadPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamGameweekScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fantasyTeamId" TEXT NOT NULL,
    "gameweekId" TEXT NOT NULL,
    "points" REAL NOT NULL,
    "computedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TeamGameweekScore_fantasyTeamId_fkey" FOREIGN KEY ("fantasyTeamId") REFERENCES "FantasyTeam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TeamGameweekScore_gameweekId_fkey" FOREIGN KEY ("gameweekId") REFERENCES "Gameweek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "League_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeagueMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leagueId" TEXT NOT NULL,
    "fantasyTeamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeagueMember_leagueId_fkey" FOREIGN KEY ("leagueId") REFERENCES "League" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeagueMember_fantasyTeamId_fkey" FOREIGN KEY ("fantasyTeamId") REFERENCES "FantasyTeam" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LeagueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Gameweek_number_key" ON "Gameweek"("number");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerRating_playerId_gameweekId_key" ON "PlayerRating"("playerId", "gameweekId");

-- CreateIndex
CREATE UNIQUE INDEX "FantasyTeam_userId_key" ON "FantasyTeam"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SquadPlayer_fantasyTeamId_playerId_key" ON "SquadPlayer"("fantasyTeamId", "playerId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamGameweekScore_fantasyTeamId_gameweekId_key" ON "TeamGameweekScore"("fantasyTeamId", "gameweekId");

-- CreateIndex
CREATE UNIQUE INDEX "League_code_key" ON "League"("code");

-- CreateIndex
CREATE UNIQUE INDEX "LeagueMember_leagueId_fantasyTeamId_key" ON "LeagueMember"("leagueId", "fantasyTeamId");
