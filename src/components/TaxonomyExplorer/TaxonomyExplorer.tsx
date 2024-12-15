// src/components/TaxonomyExplorer/TaxonomyExplorer.tsx
"use client"
import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TaxonomicNode } from '@/types/taxonomy';
import { ZoomableCanvas } from './ZoomableCanvas';
import { NodeDetails } from './NodeDetails';
import { SearchBar } from '@/components/layout/taxonomy/ui/SearchBar';
import { LoadingSpinner } from '@/components/layout/taxonomy/ui/LoadingSpinner';
import { Alert } from '@/components/layout/taxonomy/ui/Alert';

interface TaxonomyExplorerProps {
  initialOrderId?: string;
}

export const TaxonomyExplorer: React.FC<TaxonomyExplorerProps> = ({ initialOrderId }) => {
  // State management for the visualization
  const [selectedNode, setSelectedNode] = useState<TaxonomicNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewportCenter, setViewportCenter] = useState({ x: 0, y: 0 });
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Fetch taxonomy data using React Query
  const { data: taxonomyData, isLoading, error } = useQuery({
    queryKey: ['taxonomy', initialOrderId],
    queryFn: async () => {
      const response = await fetch(`/api/taxonomy/${initialOrderId || 'orders'}`);
      if (!response.ok) throw new Error('Failed to fetch taxonomy data');
      return response.json();
    },
  });

  // Handle node expansion/collapse
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Handle node selection
  const handleNodeClick = useCallback((node: TaxonomicNode) => {
    setSelectedNode(node);
    toggleNode(node.id);
  }, [toggleNode]);

  // Calculate node positions and relationships
  const calculateLayout = useCallback(() => {
    if (!taxonomyData) return null;

    const layout = new Map();
    const processNode = (node: TaxonomicNode, level: number, index: number) => {
      // Calculate position based on level and index
      const angle = (index * 2 * Math.PI) / (level * 4 + 1);
      const radius = level * 200;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      layout.set(node.id, { x, y, level });

      // Process children if node is expanded
      if (expandedNodes.has(node.id) && node.children) {
        node.children.forEach((child, childIndex) => {
          processNode(child, level + 1, childIndex);
        });
      }
    };

    processNode(taxonomyData, 0, 0);
    return layout;
  }, [taxonomyData, expandedNodes]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Alert variant="error">
        <p>Error loading taxonomy data. Please try again later.</p>
      </Alert>
    );
  }

  const nodeLayout = calculateLayout();

  return (
    <div className="flex h-screen">
      <div className="w-3/4 relative">
        <SearchBar 
          onSearch={(query: string) => {
            // Implement search functionality
          }} 
        />
        <ZoomableCanvas
          nodes={nodeLayout || new Map()}
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          viewportCenter={viewportCenter}
          onViewportChange={setViewportCenter}
        />
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button 
            onClick={() => setZoomLevel(z => z * 1.2)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Zoom In
          </button>
          <button 
            onClick={() => setZoomLevel(z => z / 1.2)}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Zoom Out
          </button>
        </div>
      </div>
      
      <div className="w-1/4 border-l border-gray-200">
        {selectedNode && (
          <NodeDetails
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
};