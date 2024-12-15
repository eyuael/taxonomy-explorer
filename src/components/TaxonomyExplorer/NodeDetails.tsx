// src/components/TaxonomyExplorer/NodeDetails.tsx

import React from 'react';
import { TaxonomicNode } from '@/types/taxonomy';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/layout/taxonomy/ui/card';

interface NodeDetailsProps {
  node: TaxonomicNode;
  onClose: () => void;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({ node, onClose }) => {
  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center">
          <CardTitle>{node.name}</CardTitle>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Scientific Name</h3>
            <p className="italic">{node.scientificName}</p>
          </div>

          {node.description && (
            <div>
              <h3 className="font-semibold">Description</h3>
              <p>{node.description}</p>
            </div>
          )}

          {node.conservationStatus && (
            <div>
              <h3 className="font-semibold">Conservation Status</h3>
              <p>{node.conservationStatus}</p>
            </div>
          )}

          {node.geographicDistribution && (
            <div>
              <h3 className="font-semibold">Geographic Distribution</h3>
              <p>{node.geographicDistribution.join(', ')}</p>
            </div>
          )}

          {node.children && node.children.length > 0 && (
            <div>
              <h3 className="font-semibold">Contains</h3>
              <ul className="list-disc pl-5">
                {node.children.map(child => (
                  <li key={child.id}>{child.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};