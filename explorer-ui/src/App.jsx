import React, { useEffect, useState } from 'react';
import './App.css';
import GraphViewer from './components/GraphViewer';
import SearchBar from './components/SearchBar';
import InfoPanel from './components/InfoPanel';
import FilterPanel from './components/FilterPanel';
import DashboardStats from './components/DashboardStats';
import PathFinderPanel from './components/PathFinderPanel';
import RecommendationPanel from './components/RecommendationPanel';
import AnalyticsPanel from './components/AnalyticsPanel';

const API_URL = 'http://localhost:8080/api/graph';

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
      setGraphData(result);
      setActiveMode('recommendations');
    } catch (error) {
      console.error(error);
      alert('No se pudieron cargar las recomendaciones');
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
          className={activeMode === 'explore' ? 'mode-btn active' : 'mode-btn'}
          onClick={resetGraph}
        >
          Explorar
        </button>
        <button
          className={activeMode === 'path' ? 'mode-btn active' : 'mode-btn'}
          onClick={() => setActiveMode('path')}
        >
          Caminos
        </button>
        <button
          className={activeMode === 'recommendations' ? 'mode-btn active' : 'mode-btn'}
          onClick={() => setActiveMode('recommendations')}
        >
          Recomendaciones
        </button>
        <button
          className={activeMode === 'analytics' ? 'mode-btn active' : 'mode-btn'}
          onClick={() => setActiveMode('analytics')}
        >
          Analytics
        </button>
      </div>

      <main className="layout">
        <aside className="left-column">
          <FilterPanel
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onlyBridgeNodes={onlyBridgeNodes}
            onToggleBridgeNodes={setOnlyBridgeNodes}
          />

          <PathFinderPanel
            nodes={baseGraphData.nodes}
            onFindPath={handlePathLoaded}
            onReset={resetGraph}
          />

          <RecommendationPanel
            onLoadRecommendations={handleRecommendationsLoaded}
            onReset={resetGraph}
          />
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