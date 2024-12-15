// src/components/TaxonomyExplorer/ZoomableCanvas.tsx

import React, { useRef, useEffect } from 'react';
import { TaxonomicNode } from '@/types/taxonomy';

interface ZoomableCanvasProps {
  nodes: Map<string, { x: number; y: number; level: number }>;
  onNodeClick: (node: TaxonomicNode) => void;
  selectedNode: TaxonomicNode | null;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
  viewportCenter: { x: number; y: number };
  onViewportChange: (center: { x: number; y: number }) => void;
}

export const ZoomableCanvas: React.FC<ZoomableCanvasProps> = ({
  nodes,
  onNodeClick,
  selectedNode,
  zoomLevel,
  onZoomChange,
  viewportCenter,
  onViewportChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-viewportCenter.x, -viewportCenter.y);

    // Draw connections
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    nodes.forEach((nodePos, nodeId) => {
      const parentId = nodeId.split('-').slice(0, -1).join('-');
      if (nodes.has(parentId)) {
        const parentPos = nodes.get(parentId)!;
        ctx.moveTo(nodePos.x, nodePos.y);
        ctx.lineTo(parentPos.x, parentPos.y);
      }
    });
    ctx.stroke();

    // Draw nodes
    nodes.forEach((nodePos, nodeId) => {
      ctx.beginPath();
      ctx.fillStyle = selectedNode?.id === nodeId ? '#4299e1' : '#2d3748';
      ctx.arc(nodePos.x, nodePos.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw labels
      ctx.fillStyle = '#2d3748';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(nodeId, nodePos.x, nodePos.y + 25);
    });

    ctx.restore();
  }, [nodes, selectedNode, zoomLevel, viewportCenter]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentPos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    const dx = (currentPos.x - dragStartRef.current.x) / zoomLevel;
    const dy = (currentPos.y - dragStartRef.current.y) / zoomLevel;

    onViewportChange({
      x: viewportCenter.x - dx,
      y: viewportCenter.y - dy,
    });

    dragStartRef.current = currentPos;
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    onZoomChange(zoomLevel * delta);
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      className="cursor-grab active:cursor-grabbing"
    />
  );
};