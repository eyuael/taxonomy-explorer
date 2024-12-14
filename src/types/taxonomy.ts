import { z } from "zod";

export interface TaxonomicNode {
    id: string;
    name: string;
    scientificName: string;
    rank: TaxonomicRank;
    description?: string;
    imageUrl?: string;
    children?: TaxonomicNode[];
    parent?: string;
    conservationStatus?: ConservationStatus;
    geographicDistribution?: string[];
  }
  
  export enum TaxonomicRank {
    ORDER = 'ORDER',
    FAMILY = 'FAMILY',
    GENUS = 'GENUS',
    SPECIES = 'SPECIES',
    SUBSPECIES = 'SUBSPECIES'
  }
  
  export enum ConservationStatus {
    EXTINCT = 'EX',
    EXTINCT_IN_WILD = 'EW',
    CRITICALLY_ENDANGERED = 'CR',
    ENDANGERED = 'EN',
    VULNERABLE = 'VU',
    NEAR_THREATENED = 'NT',
    LEAST_CONCERN = 'LC',
    DATA_DEFICIENT = 'DD'
  }
  
  // Zod schema for runtime type validation
  
  export const taxonomicNodeSchema: z.ZodType<TaxonomicNode> = z.object({
    id: z.string(),
    name: z.string(),
    scientificName: z.string(),
    rank: z.nativeEnum(TaxonomicRank),
    description: z.string().optional(),
    imageUrl: z.string().url().optional(),
    children: z.lazy(() => taxonomicNodeSchema.array()).optional(),
    parent: z.string().optional(),
    conservationStatus: z.nativeEnum(ConservationStatus).optional(),
    geographicDistribution: z.array(z.string()).optional()
  });
  //