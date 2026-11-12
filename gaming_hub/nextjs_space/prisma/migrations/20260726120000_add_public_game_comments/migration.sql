CREATE TABLE "PublicGameComment" (
    "id" TEXT NOT NULL,
    "gameId" VARCHAR(64) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "content" VARCHAR(1000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicGameComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PublicGameComment_gameId_createdAt_idx"
ON "PublicGameComment"("gameId", "createdAt");
