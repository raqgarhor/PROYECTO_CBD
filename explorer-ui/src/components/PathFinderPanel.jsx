import React, { useMemo, useState } from 'react';
import '../styles/ToolPanel.css';

const PathFinderPanel = ({ nodes = [], onFindPath, onReset }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const nodeOptions = useMemo(() => {
    return (nodes || [])
      .map((node) => ({
        id: node.data?.id ?? node.id,
        label: node.data?.label ?? node.label
      }))
      .filter((node) => node.label)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [nodes]);

  return (
    <div className="tool-panel">
      <div className="panel-header">
        <h3>Camino más corto</h3>
        <span>Analiza conexiones entre tecnologías</span>
      </div>

      <label className="filter-label">Origen</label>
      <select
        className="filter-select"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      >
        <option value="">Selecciona origen</option>
        {nodeOptions.map((node) => (
          <option key={node.id} value={node.id}>
            {node.label}
          </option>
        ))}
      </select>

      <label className="filter-label">Destino</label>
      <select
        className="filter-select"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      >
        <option value="">Selecciona destino</option>
        {nodeOptions.map((node) => (
          <option key={node.id} value={node.id}>
            {node.label}
          </option>
        ))}
      </select>

      <div className="tool-actions">
        <button
          className="primary-btn"
          onClick={() => from && to && onFindPath(from, to)}
          disabled={!from || !to}
        >
          Buscar camino
        </button>
        <button className="secondary-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default PathFinderPanel;