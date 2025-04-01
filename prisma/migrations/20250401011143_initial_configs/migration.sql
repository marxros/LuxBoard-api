-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "referenceMonth" TIMESTAMP(3) NOT NULL,
    "energiaEletricaKwh" DOUBLE PRECISION NOT NULL,
    "energiaEletricaValor" DOUBLE PRECISION NOT NULL,
    "energiaSceeKwh" DOUBLE PRECISION NOT NULL,
    "energiaSceeValor" DOUBLE PRECISION NOT NULL,
    "energiaCompensadaKwh" DOUBLE PRECISION NOT NULL,
    "energiaCompensadaValor" DOUBLE PRECISION NOT NULL,
    "contribIlumPublicaValor" DOUBLE PRECISION NOT NULL,
    "consumoTotal" DOUBLE PRECISION NOT NULL,
    "valorTotalSemGD" DOUBLE PRECISION NOT NULL,
    "economiaGD" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
