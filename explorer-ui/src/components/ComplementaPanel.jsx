import React, { useMemo, useState } from 'react';
import '../styles/ToolPanel.css';

const ComplementaPanel = ({ onLoadComplementa, onReset, nodes = [], edges = [] }) => {
  const [selectedTech, setSelectedTech] = useState('');

  const complementaIds = useMemo(() => {
    const ids = new Set();
    (edges || []).forEach((edge) => {
      const data = edge?.data ?? edge;
      if (data?.type !== 'COMPLEMENTA') {
        return;
      }
      if (data?.source) {
        ids.add(data.source);
      }
      if (data?.target) {
        ids.add(data.target);
      }
    });
    return ids;
  }, [edges]);

  const techOptions = useMemo(() => {
    return (nodes || [])
      .map((node) => {
        const data = node?.data ?? node;
        return {
          id: data?.id,
          label: data?.label,
          category: data?.category
        };
      })
      .filter((node) =>
        node.id &&
        node.label &&
        node.category !== 'Tema' &&
        complementaIds.has(node.id)
      )
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [nodes, complementaIds]);

  const handleLoad = () => {
    onLoadComplementa({
      techId: selectedTech
    });
  };

  const handleReset = () => {
    setSelectedTech('');
    onReset();
  };

  return (
    <div className="tool-panel">
      <div className="panel-header">
        <h3>Complementa</h3>
        <span>Explora relaciones complementarias</span>
      </div>

      <label className="filter-label">Tecnología foco</label>
      <select
        className="filter-select"
        value={selectedTech}
        onChange={(e) => setSelectedTech(e.target.value)}
      >
        <option value="">Todas</option>
        {techOptions.map((tech) => (
          <option key={tech.id} value={tech.id}>
            {tech.label}
          </option>
        ))}
      </select>

      <div className="tool-actions">
        <button className="primary-btn" onClick={handleLoad}>
          Ver complementarias
        </button>
        <button className="secondary-btn" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ComplementaPanel;
