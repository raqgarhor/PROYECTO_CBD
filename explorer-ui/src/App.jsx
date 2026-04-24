import React, { useEffect, useState } from 'react';
import './App.css';
import GraphViewer from './components/GraphViewer';
import SearchBar from './components/SearchBar';
import InfoPanel from './components/InfoPanel';
import FilterPanel from './components/FilterPanel';
import DashboardStats from './components/DashboardStats';
import PathFinderPanel from './components/PathFinderPanel';
import RecommendationPanel from './components/RecommendationPanel';
import ComplementaPanel from './components/ComplementaPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import CreateTechnologyPanel from './components/CreateTechnologyPanel';

const API_URL = 'http://localhost:8080/api/graph';
const API_TECH_URL = 'http://localhost:8080/api/tecnologias';

const CollapsiblePanel = ({ title, subtitle, defaultOpen = false, children }) => (
  <details className="left-accordion" open={defaultOpen}>
    <summary>
      <span>{title}</span>
      {subtitle && <small>{subtitle}</small>}
    </summary>
    <div className="left-accordion-body">{children}</div>
  </details>
);

function App() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [baseGraphData, setBaseGraphData] = useState({ nodes: [], edges: [] });
  const [stats, setStats] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [onlyBridgeNodes, setOnlyBridgeNodes] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [activeMode, setActiveMode] = useState('explore');
  const [activeTab, setActiveTab] = useState('explorar');
  const [recommendationItems, setRecommendationItems] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [graphRes, statsRes, analyticsRes] = await Promise.all([
        fetch(API_URL),
        fetch(`${API_URL}/stats`),
        fetch(`${API_URL}/analytics`)
      ]);

      if (!graphRes.ok || !statsRes.ok || !analyticsRes.ok) {
        throw new Error('No se pudieron cargar los datos');
      }

      const graphJson = await graphRes.json();
      const statsJson = await statsRes.json();
      const analyticsJson = await analyticsRes.json();

      setGraphData(graphJson);
      setBaseGraphData(graphJson);
      setStats(statsJson);
      setAnalytics(analyticsJson);
    } catch (error) {
      console.error(error);
    }
  };

  const resetGraph = () => {
    setGraphData(baseGraphData);
    setActiveMode('explore');
    setActiveTab('explorar');
    setRecommendationItems([]);
  };

  const handleNodeSelect = async (nodeData) => {
    if (!nodeData) {
      setSelectedNode(null);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/node/${encodeURIComponent(nodeData.id)}`);
      if (!response.ok) {
        throw new Error('No se pudieron cargar los detalles');
      }
      const details = await response.json();
      setSelectedNode(details);
    } catch (error) {
      console.error(error);
      setSelectedNode(nodeData);
    }
  };

  const handlePathLoaded = async (from, to) => {
    try {
      const response = await fetch(
        `${API_URL}/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      if (!response.ok) {
        throw new Error('No se pudo calcular el camino');
      }
      const result = await response.json();
      setGraphData(result.graph);
      setActiveMode('path');
    } catch (error) {
      console.error(error);
      alert('No se encontró un camino entre esos nodos');
    }
  };

  const handleRecommendationsLoaded = async (temaId) => {
    try {
      const response = await fetch(
        `${API_URL}/recommendations?temaId=${encodeURIComponent(temaId)}`
      );
      if (!response.ok) {
        throw new Error('No se pudieron cargar recomendaciones');
      }
      const result = await response.json();
      setGraphData(result.graph || { nodes: [], edges: [] });
      setRecommendationItems(result.recommendations || []);
      setActiveMode('recommendations');
      setActiveTab('recomendar');
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar las recomendaciones');
    }
  };

  const applyComplementaFilters = (graph, filters = {}) => {
    const nodes = Array.isArray(graph?.nodes) ? graph.nodes : [];
    const edges = Array.isArray(graph?.edges) ? graph.edges : [];
    const category = filters.category || 'all';
    const techId = filters.techId || '';

    const getNodeData = (node) => node?.data ?? node;
    const getEdgeData = (edge) => edge?.data ?? edge;

    let allowedIds = new Set(
      nodes
        .map((node) => getNodeData(node)?.id)
        .filter(Boolean)
    );

    if (category !== 'all') {
      const byCategory = new Set(
        nodes
          .filter((node) => getNodeData(node)?.category === category)
          .map((node) => getNodeData(node)?.id)
          .filter(Boolean)
      );
      allowedIds = new Set([...allowedIds].filter((id) => byCategory.has(id)));
    }

    if (techId) {
      const neighborhood = new Set([techId]);
      edges.forEach((edge) => {
        const data = getEdgeData(edge);
        const source = data?.source;
        const target = data?.target;
        if (source === techId && target) {
          neighborhood.add(target);
        }
        if (target === techId && source) {
          neighborhood.add(source);
        }
      });
      allowedIds = new Set([...allowedIds].filter((id) => neighborhood.has(id)));
    }

    const filteredNodes = nodes.filter((node) => allowedIds.has(getNodeData(node)?.id));
    const filteredEdges = edges.filter((edge) => {
      const data = getEdgeData(edge);
      return allowedIds.has(data?.source) && allowedIds.has(data?.target);
    });

    return { nodes: filteredNodes, edges: filteredEdges };
  };

  const handleComplementaLoaded = async (filters = {}) => {
    try {
      const response = await fetch(`${API_URL}/complementa`);
      if (!response.ok) {
        throw new Error('No se pudo cargar el subgrafo de relaciones COMPLEMENTA');
      }
      const result = await response.json();
      setGraphData(applyComplementaFilters(result, filters));
      setActiveMode('complementa');
      setActiveTab('recomendar');
    } catch (error) {
      console.error(error);
      alert('No se pudo cargar el modo Complementa');
    }
  };

  const handleCreateTechnology = async (payload) => {
    try {
      const response = await fetch(`${API_TECH_URL}/crear-con-relaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.message || 'No se pudo crear la tecnología');
      }

      await loadInitialData();
      setActiveMode('explore');
      setActiveTab('gestionar');
      alert('Tecnología creada y grafo actualizado.');
      return true;
    } catch (error) {
      console.error(error);
      alert(error.message || 'Error al crear la tecnología');
      return false;
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand-box">
          <div className="brand-logo">✦</div>
          <div>
            <h1>TechGraph Explorer</h1>
            <p>Explora, conecta, descubre</p>
          </div>
        </div>

        <div className="topbar-search">
          <SearchBar onSearch={setSearchTerm} />
        </div>
      </header>

      {stats && <DashboardStats stats={stats} />}

      <div className="mode-bar">
        <button
          className={activeTab === 'explorar' ? 'mode-btn active' : 'mode-btn'}
          onClick={resetGraph}
        >
          Explorar
        </button>
        <button
          className={activeTab === 'recomendar' ? 'mode-btn active' : 'mode-btn'}
          onClick={() => setActiveTab('recomendar')}
        >
          Recomendar
        </button>
        <button
          className={activeTab === 'gestionar' ? 'mode-btn active' : 'mode-btn'}
          onClick={() => setActiveTab('gestionar')}
        >
          Gestionar
        </button>
      </div>

      <main className="layout">
        <aside className="left-column">
          {activeTab === 'explorar' && (
            <>
              <CollapsiblePanel title="Filtros" subtitle="Exploración visual" defaultOpen>
                <FilterPanel
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                  onlyBridgeNodes={onlyBridgeNodes}
                  onToggleBridgeNodes={setOnlyBridgeNodes}
                />
              </CollapsiblePanel>

              <CollapsiblePanel title="Camino más corto" subtitle="Explora conexiones" defaultOpen>
                <PathFinderPanel
                  nodes={baseGraphData.nodes}
                  onFindPath={handlePathLoaded}
                  onReset={resetGraph}
                />
              </CollapsiblePanel>
            </>
          )}

          {activeTab === 'recomendar' && (
            <>
              <CollapsiblePanel title="Recomendaciones" subtitle="Ranking por tema" defaultOpen>
                <RecommendationPanel
                  onLoadRecommendations={handleRecommendationsLoaded}
                  onReset={resetGraph}
                  recommendations={recommendationItems}
                />
              </CollapsiblePanel>

              <CollapsiblePanel title="Complementa" subtitle="Relaciones complementarias" defaultOpen>
                <ComplementaPanel
                  onLoadComplementa={handleComplementaLoaded}
                  onReset={resetGraph}
                  nodes={baseGraphData.nodes}
                  edges={baseGraphData.edges}
                />
              </CollapsiblePanel>
            </>
          )}

          {activeTab === 'gestionar' && (
            <CollapsiblePanel title="Nueva tecnología" subtitle="Alta y conexiones" defaultOpen>
              <CreateTechnologyPanel
                nodes={baseGraphData.nodes}
                onCreateTechnology={handleCreateTechnology}
              />
            </CollapsiblePanel>
          )}
        </aside>

        <section className="center-column">
          <GraphViewer
            graphData={graphData}
            onNodeSelect={handleNodeSelect}
            searchTerm={searchTerm}
            filterCategory={selectedFilter}
            onlyBridgeNodes={onlyBridgeNodes}
            highlightMode={activeMode}
          />
        </section>

        <aside className="right-column">
          <InfoPanel node={selectedNode} />
          <AnalyticsPanel analytics={analytics} />
        </aside>
      </main>
    </div>
  );
}

export default App;