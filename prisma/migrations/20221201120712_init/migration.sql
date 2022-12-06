-- CreateTable
CREATE TABLE "Seat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "busy" BOOLEAN NOT NULL,

    CONSTRAINT "Seat_pkey" PRIMARY KEY ("id")
);
