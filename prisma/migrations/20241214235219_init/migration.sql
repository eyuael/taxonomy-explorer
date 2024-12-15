-- CreateTable
CREATE TABLE "TaxonomicOrder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxonomicOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxonomicFamily" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxonomicFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxonomicGenus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "familyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxonomicGenus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxonomicSpecies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "conservationStatus" TEXT,
    "genusId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxonomicSpecies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxonomicSubspecies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "conservationStatus" TEXT,
    "speciesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxonomicSubspecies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicRegion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GeographicRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GeographicRegionToTaxonomicSpecies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GeographicRegionToTaxonomicSpecies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GeographicRegionToTaxonomicSubspecies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GeographicRegionToTaxonomicSubspecies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomicOrder_scientificName_key" ON "TaxonomicOrder"("scientificName");

-- CreateIndex
CREATE INDEX "TaxonomicOrder_scientificName_idx" ON "TaxonomicOrder"("scientificName");

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomicFamily_scientificName_key" ON "TaxonomicFamily"("scientificName");

-- CreateIndex
CREATE INDEX "TaxonomicFamily_orderId_idx" ON "TaxonomicFamily"("orderId");

-- CreateIndex
CREATE INDEX "TaxonomicFamily_scientificName_idx" ON "TaxonomicFamily"("scientificName");

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomicGenus_scientificName_key" ON "TaxonomicGenus"("scientificName");

-- CreateIndex
CREATE INDEX "TaxonomicGenus_familyId_idx" ON "TaxonomicGenus"("familyId");

-- CreateIndex
CREATE INDEX "TaxonomicGenus_scientificName_idx" ON "TaxonomicGenus"("scientificName");

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomicSpecies_scientificName_key" ON "TaxonomicSpecies"("scientificName");

-- CreateIndex
CREATE INDEX "TaxonomicSpecies_genusId_idx" ON "TaxonomicSpecies"("genusId");

-- CreateIndex
CREATE INDEX "TaxonomicSpecies_scientificName_idx" ON "TaxonomicSpecies"("scientificName");

-- CreateIndex
CREATE UNIQUE INDEX "TaxonomicSubspecies_scientificName_key" ON "TaxonomicSubspecies"("scientificName");

-- CreateIndex
CREATE INDEX "TaxonomicSubspecies_speciesId_idx" ON "TaxonomicSubspecies"("speciesId");

-- CreateIndex
CREATE INDEX "TaxonomicSubspecies_scientificName_idx" ON "TaxonomicSubspecies"("scientificName");

-- CreateIndex
CREATE INDEX "_GeographicRegionToTaxonomicSpecies_B_index" ON "_GeographicRegionToTaxonomicSpecies"("B");

-- CreateIndex
CREATE INDEX "_GeographicRegionToTaxonomicSubspecies_B_index" ON "_GeographicRegionToTaxonomicSubspecies"("B");

-- AddForeignKey
ALTER TABLE "TaxonomicFamily" ADD CONSTRAINT "TaxonomicFamily_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "TaxonomicOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomicGenus" ADD CONSTRAINT "TaxonomicGenus_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "TaxonomicFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomicSpecies" ADD CONSTRAINT "TaxonomicSpecies_genusId_fkey" FOREIGN KEY ("genusId") REFERENCES "TaxonomicGenus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxonomicSubspecies" ADD CONSTRAINT "TaxonomicSubspecies_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "TaxonomicSpecies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeographicRegionToTaxonomicSpecies" ADD CONSTRAINT "_GeographicRegionToTaxonomicSpecies_A_fkey" FOREIGN KEY ("A") REFERENCES "GeographicRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeographicRegionToTaxonomicSpecies" ADD CONSTRAINT "_GeographicRegionToTaxonomicSpecies_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxonomicSpecies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeographicRegionToTaxonomicSubspecies" ADD CONSTRAINT "_GeographicRegionToTaxonomicSubspecies_A_fkey" FOREIGN KEY ("A") REFERENCES "GeographicRegion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GeographicRegionToTaxonomicSubspecies" ADD CONSTRAINT "_GeographicRegionToTaxonomicSubspecies_B_fkey" FOREIGN KEY ("B") REFERENCES "TaxonomicSubspecies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
