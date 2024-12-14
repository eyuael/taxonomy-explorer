
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { TaxonomicNode } from '@/types/taxonomy';

interface TaxonomyMapProps {
  data: TaxonomicNode;
  onNodeClick: (node: TaxonomicNode) => void;
}

export const TaxonomyMap: React.FC<TaxonomyMapProps> = ({ data, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up the D3 mindmap layout
    const width = 1200;
    const height = 800;
    //const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    // Create hierarchical data structure
    const root = d3.hierarchy<TaxonomicNode>(data);
    
    // Create radial tree layout
    const treeLayout = d3.tree<TaxonomicNode>();

    // Apply the layout to our data
    const nodes = treeLayout(root);

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create links between nodes
    svg.selectAll('path')
      .data(nodes.links())
      .join('path')
      .attr('d', d3.linkRadial<d3.HierarchyPointLink<TaxonomicNode>, d3.HierarchyPointNode<TaxonomicNode>>()
        .angle(d => d.x)
        .radius(d => d.y))
      .attr('fill', 'none')
      .attr('stroke', '#ccc');

    // Create and style the nodes
    const node = svg.selectAll('g')
      .data(nodes.descendants())
      .join('g')
      .attr('transform', d => `
        translate(${d.y * Math.cos(d.x - Math.PI / 2)},
                ${d.y * Math.sin(d.x - Math.PI / 2)})
      `);

    // Add circles for nodes
    node.append('circle')
      .attr('r', 8)
      .attr('fill', d => d.children ? '#69b3a2' : '#404080')
      .style('cursor', 'pointer')
      .on('click', (event, d: d3.HierarchyPointNode<TaxonomicNode>) => {
        event.stopPropagation();
        onNodeClick(d.data);
      });

    // Add labels
    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr('text-anchor', d => d.x < Math.PI === !d.children ? 'start' : 'end')
      .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
      .text((d: d3.HierarchyPointNode<TaxonomicNode>) => d.data.name)
      .style('font-size', '12px')
      .style('font-family', 'sans-serif');

  }, [data, onNodeClick]);

  return (
    <div className="w-full h-full overflow-hidden">
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: '800px' }}
      />
    </div>
  );
};

export default TaxonomyMap;