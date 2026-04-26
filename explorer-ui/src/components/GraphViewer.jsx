import React, { useEffect, useMemo, useRef } from 'react';
import cytoscape from 'cytoscape';
import '../styles/GraphViewer.css';

const CATEGORY_COLORS = {
  Tema: '#8b5cf6',
  Backend: '#06b6d4',
  Grafos: '#22c55e',
  Blockchain: '#f97316',
  Documental: '#3b82f6',
  'Clave-Valor': '#38bdf8',
  Columnar: '#2563eb',
  'SGBD espacial': '#14b8a6',
  'Herramienta SIG': '#2dd4bf',
  'SIG SaaS': '#10b981',
  'SIG DaaS': '#34d399',
  'Modelado de datos': '#94a3b8',
  'Plataforma blockchain': '#fb923c',
  BaaS: '#fdba74',
  'Máquina virtual': '#f59e0b',
  'ETL libre': '#eab308',
  'ETL propietario': '#facc15',
  'SGBD móvil': '#ec4899',
  'Componente SQL Anywhere': '#f472b6',
  'Motor embebido móvil': '#fb7185',
  'Sincronización móvil': '#f43f5e',
  'Base de datos orientada a objetos': '#d946ef',
  'NoSQL en la nube': '#c084fc',
  'Base de datos embebida': '#f9a8d4',
  GIS: '#14b8a6',
  Móvil: '#ec4899',
  Tech: '#64748b'
};

const GraphViewer = ({
  graphData,
  onNodeSelect,
  searchTerm,
  filterCategory,
  onlyBridgeNodes,
  highlightMode
}) => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const isFirstLoadRef = useRef(true);
  const selectedNodeRef = useRef(null);
  const selectedNodeIdRef = useRef(null);
  const onNodeSelectRef = useRef(onNodeSelect);

  useEffect(() => {
    onNodeSelectRef.current = onNodeSelect;
  }, [onNodeSelect]);

  const elements = useMemo(() => {
    const nodes = (graphData.nodes || []).map((node) => ({
      data: {
        id: node.data?.id ?? node.id,
        label: node.data?.label ?? node.label,
        category: node.data?.category ?? node.category ?? 'Tech',
        connections: node.data?.connections ?? node.connections ?? 0,
        importance: node.data?.importance ?? node.importance ?? 0,
        isPuente: node.data?.isPuente ?? node.isPuente ?? false
      }
    }));

    const edges = (graphData.edges || []).map((edge) => ({
      data: {
        id: edge.data?.id ?? edge.id,
        source: edge.data?.source ?? edge.source,
        target: edge.data?.target ?? edge.target,
        type: edge.data?.type ?? edge.type,
        weight: nodeOrDefault(edge.data?.weight ?? edge.weight, 1)
      }
    }));

    return [...nodes, ...edges];
  }, [graphData]);

  function nodeOrDefault(value, fallback) {
    return value ?? fallback;
  }

  useEffect(() => {
    if (!containerRef.current) return;

    if (cyRef.current) {
      if (selectedNodeRef.current) {
        selectedNodeIdRef.current = selectedNodeRef.current.id();
      }

      cyRef.current.destroy();
      cyRef.current = null;
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements,
      layout: {
        name: 'cose',
        animate: isFirstLoadRef.current ? 'end' : false,
        animationDuration: 800,
        fit: true,
        padding: 48,
        nodeRepulsion: 1200000,
        idealEdgeLength: 160,
        edgeElasticity: 90,
        gravity: 0.15,
        numIter: 1800,
        randomize: true
      },
      minZoom: 0.05,
      maxZoom: 2.5,
      wheelSensitivity: 0.18,
      style: [
        {
          selector: 'node',
          style: {
            label: 'data(label)',
            'text-wrap': 'wrap',
            'text-max-width': 96,
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 11,
            'font-weight': 700,
            color: '#e5eefc',
            'background-color': ele => CATEGORY_COLORS[ele.data('category')] || '#64748b',
            width: 'mapData(connections, 1, 12, 34, 78)',
            height: 'mapData(connections, 1, 12, 34, 78)',
            'border-width': 2,
            'border-color': '#e2e8f033',
            'overlay-opacity': 0,
            'shadow-blur': 18,
            'shadow-color': '#020617',
            'shadow-opacity': 0.45,
            'shadow-offset-x': 0,
            'shadow-offset-y': 10
          }
        },
        {
          selector: 'node[isPuente = true]',
          style: {
            'border-width': 4,
            'border-color': '#f8fafc'
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': 6,
            'border-color': '#fbbf24',
            'shadow-blur': 35,
            'shadow-color': '#fbbf24',
            'shadow-opacity': 0.9,
            'shadow-offset-x': 0,
            'shadow-offset-y': 0
          }
        },
        {
          selector: 'node.node-kept-selected',
          style: {
            'border-width': 6,
            'border-color': '#fbbf24',
            'shadow-blur': 35,
            'shadow-color': '#fbbf24',
            'shadow-opacity': 0.9,
            'shadow-offset-x': 0,
            'shadow-offset-y': 0
          }
        },
        {
          selector: 'node.faded',
          style: {
            opacity: 0.12
          }
        },
        {
          selector: 'edge',
          style: {
            'curve-style': 'bezier',
            width: 'mapData(weight, 1, 2, 2, 4)',
            'line-color': '#7dd3fc55',
            'target-arrow-color': '#7dd3fc55',
            'target-arrow-shape': 'triangle',
            opacity: 0.7
          }
        },
        {
          selector: 'edge.faded',
          style: {
            opacity: 0.05
          }
        },
        {
          selector: 'edge.highlighted',
          style: {
            opacity: 1,
            width: 4,
            'line-color': '#93c5fd',
            'target-arrow-color': '#93c5fd'
          }
        }
      ]
    });

    cy.on('tap', 'node', (event) => {
      event.stopPropagation();

      const node = event.target;

      if (selectedNodeRef.current) {
        selectedNodeRef.current.removeClass('node-kept-selected');
      }

      node.addClass('node-kept-selected');
      selectedNodeRef.current = node;
      selectedNodeIdRef.current = node.id();

      const zoomLevel = 1.5;
      const pos = node.position();

      cy.animate({
        zoom: zoomLevel,
        pan: {
          x: cy.width() / 2 - pos.x * zoomLevel,
          y: cy.height() / 2 - pos.y * zoomLevel
        },
        duration: 400,
        easing: 'ease-in-out'
      });

      onNodeSelectRef.current(node.data());
    });

    cy.on('tap', (event) => {
      if (event.target === cy) {
        if (selectedNodeRef.current) {
          selectedNodeRef.current.removeClass('node-kept-selected');
          selectedNodeRef.current = null;
          selectedNodeIdRef.current = null;
        }

        cy.elements().removeClass('faded highlighted');
        onNodeSelect(null);
      }
    });

    cyRef.current = cy;

    setTimeout(() => {
      cy.resize();

      if (selectedNodeIdRef.current) {
        const nodeToSelect = cy.getElementById(selectedNodeIdRef.current);

        if (nodeToSelect && nodeToSelect.length > 0) {
          nodeToSelect.addClass('node-kept-selected');
          selectedNodeRef.current = nodeToSelect;
        }
      }

      isFirstLoadRef.current = false;
    }, 120);

    return () => {
      cy.destroy();
    };
  }, [elements]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const term = searchTerm.trim().toLowerCase();

    const hasSearchFilter =
      term ||
      filterCategory !== 'all' ||
      onlyBridgeNodes ||
      highlightMode === 'analytics';

    if (!hasSearchFilter) {
      cy.elements().removeClass('faded highlighted');
      cy.animate({
        fit: {
          eles: cy.elements(),
          padding: 70
        },
        duration: 400,
        easing: 'ease-in-out'
      });
      return;
    }

    let matchedNodes = cy.nodes();

    if (term) {
      matchedNodes = matchedNodes.filter((node) =>
        String(node.data('label')).toLowerCase().includes(term) ||
        String(node.data('category')).toLowerCase().includes(term)
      );
    }

    if (filterCategory !== 'all') {
      matchedNodes = matchedNodes.filter(
        (node) => node.data('category') === filterCategory
      );
    }

    if (onlyBridgeNodes) {
      matchedNodes = matchedNodes.filter(
        (node) => node.data('isPuente') === true
      );
    }

    if (highlightMode === 'analytics') {
      matchedNodes = matchedNodes.filter(
        (node) => node.data('isPuente') === true || node.data('connections') >= 4
      );
    }

    cy.elements().removeClass('highlighted').addClass('faded');

    matchedNodes.forEach((node) => {
      node.removeClass('faded');
      node.connectedEdges().removeClass('faded').addClass('highlighted');
      node.neighborhood().removeClass('faded');
    });

    if (matchedNodes.length > 0) {
      setTimeout(() => {
        const elesToFit = matchedNodes.union(matchedNodes.connectedEdges());

        cy.animate({
          fit: {
            eles: elesToFit,
            padding: 90
          },
          duration: 500,
          easing: 'ease-in-out'
        });
      }, 100);
    }
  }, [searchTerm, filterCategory, onlyBridgeNodes, highlightMode]);

  return (
    <div className="graph-viewer">
      <div ref={containerRef} className="cytoscape-container" />
      <div className="graph-overlay">
        Arrastra para mover · Scroll para zoom · Click en un nodo para ver detalles
      </div>
    </div>
  );
};

export default GraphViewer;