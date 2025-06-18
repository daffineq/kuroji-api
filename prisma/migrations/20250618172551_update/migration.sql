-- CreateTable
CREATE TABLE "UpdateQueue" (
    "id" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,
    "malId" INTEGER,
    "priority" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpdateQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateHistory" (
    "id" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,
    "malId" INTEGER,
    "providers" TEXT[],
    "success" BOOLEAN NOT NULL,
    "duration" INTEGER,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "errors" TEXT[],
    "triggeredBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpdateHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpdateQueue_animeId_key" ON "UpdateQueue"("animeId");

-- CreateIndex
CREATE INDEX "UpdateQueue_priority_addedAt_idx" ON "UpdateQueue"("priority", "addedAt");

-- CreateIndex
CREATE INDEX "UpdateQueue_animeId_idx" ON "UpdateQueue"("animeId");

-- CreateIndex
CREATE INDEX "UpdateHistory_animeId_createdAt_idx" ON "UpdateHistory"("animeId", "createdAt");

-- CreateIndex
CREATE INDEX "UpdateHistory_success_createdAt_idx" ON "UpdateHistory"("success", "createdAt");
