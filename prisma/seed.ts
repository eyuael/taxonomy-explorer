import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const prisma = new PrismaClient();

async function loadCSV(filename: string) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename)
  const filePath = path.join(__dirname, 'data', filename);
  const fileContent = fs.readFileSync(filePath);
  return parse(fileContent, { columns: true, skipEmptyLines: true });
}

async function main() {
  // Clear existing data
  await prisma.$transaction([
    prisma.taxonomicSubspecies.deleteMany(),
    prisma.taxonomicSpecies.deleteMany(),
    prisma.taxonomicGenus.deleteMany(),
    prisma.taxonomicFamily.deleteMany(),
    prisma.taxonomicOrder.deleteMany(),
    prisma.geographicRegion.deleteMany(),
  ]);

  // Load data in hierarchical order
  const orders = await loadCSV('orders.csv');
  const families = await loadCSV('families.csv');
  const genera = await loadCSV('genera.csv');
  const species = await loadCSV('species.csv');
  const subspecies = await loadCSV('subspecies.csv');
  const regions = await loadCSV('geographic_regions.csv');
  const speciesRegions = await loadCSV('species_regions.csv');

  // Insert data
  for (const item of orders) {
    await prisma.taxonomicOrder.create({ data: item });
  }
  
  for (const item of families) {
    await prisma.taxonomicFamily.create({ data: item });
  }

  for (const item of genera) {
    await prisma.taxonomicGenus.create({ data: item });
  }

  for (const item of species) {
    await prisma.taxonomicSpecies.create({ data: item });
  }

  for (const item of subspecies) {
    await prisma.taxonomicSubspecies.create({ data: item });
  }

  for (const item of regions) {
    await prisma.geographicRegion.create({ data: item });
  }

  for (const relation of speciesRegions) {
    await prisma.taxonomicSpecies.update({
      where: { id: relation.speciesId },
      data: {
        geographicRegions: {
          connect: { id: relation.regionId }
        }
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });