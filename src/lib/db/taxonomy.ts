// src/lib/db/taxonomy.ts

import { PrismaClient } from '@prisma/client';
import { TaxonomicRank } from '../../types/taxonomy';

const prisma = new PrismaClient();

export class TaxonomyDataAccess {
  // Fetch complete taxonomy tree starting from an order
  async getTaxonomyTree(orderId: string) {
    return await prisma.taxonomicOrder.findUnique({
      where: { id: orderId },
      include: {
        families: {
          include: {
            genera: {
              include: {
                species: {
                  include: {
                    subspecies: true,
                    geographicRegions: true,
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  // Fetch children of a specific node
  async getChildren(nodeId: string, rank: TaxonomicRank) {
    switch (rank) {
      case TaxonomicRank.ORDER:
        return await prisma.taxonomicFamily.findMany({
          where: { orderId: nodeId }
        });
      case TaxonomicRank.FAMILY:
        return await prisma.taxonomicGenus.findMany({
          where: { familyId: nodeId }
        });
      case TaxonomicRank.GENUS:
        return await prisma.taxonomicSpecies.findMany({
          where: { genusId: nodeId }
        });
      case TaxonomicRank.SPECIES:
        return await prisma.taxonomicSubspecies.findMany({
          where: { speciesId: nodeId }
        });
      default:
        return [];
    }
  }

  // Search across all taxonomy levels
  async search(query: string) {
    const searchResults = await Promise.all([
      prisma.taxonomicOrder.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { scientificName: { contains: query, mode: 'insensitive' } }
          ]
        }
      }),
      prisma.taxonomicFamily.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { scientificName: { contains: query, mode: 'insensitive' } }
          ]
        }
      }),
      // Add similar queries for genus, species, and subspecies
    ]);

    return searchResults.flat();
  }

  // Get species by conservation status
  async getSpeciesByConservationStatus(status: string) {
    return await prisma.taxonomicSpecies.findMany({
      where: { conservationStatus: status },
      include: {
        genus: {
          include: {
            family: {
              include: {
                order: true
              }
            }
          }
        }
      }
    });
  }
}