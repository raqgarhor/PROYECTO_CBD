import React, { useMemo } from 'react';
import '../styles/FilterPanel.css';

const FilterPanel = ({
  onFilterChange,
  selectedFilter,
  onlyBridgeNodes,
  onToggleBridgeNodes,
  nodes = []
}) => {
  const categories = useMemo(() => {
    const data = (nodes || []).map((node) => node?.data ?? node);
    const categoriasList = ['all', ...new Set(
      data
        .filter((item) => item?.category !== 'Tema' && item?.category)
        .map((item) => item.category)
    )].sort();
    return categoriasList;
  }, [nodes]);
  return (
    <div className="filter-panel">
      <div className="panel-header">
        <h3>Filtros</h3>
        <span>Exploración visual</span>
      </div>

      <label className="filter-label">Por categoría</label>
      <select
        className="filter-select"
        value={selectedFilter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === 'all' ? 'Todas las categorías' : category}
          </option>
        ))}
      </select>

      <label className="toggle-row">
        <input
          type="checkbox"
          checked={onlyBridgeNodes}
          onChange={(e) => onToggleBridgeNodes(e.target.checked)}
        />
        Mostrar solo tecnologías puente
      </label>

      <div className="filter-help">
        Resalta áreas del ecosistema y detecta tecnologías transversales con más conexiones.
      </div>
    </div>
  );
};

export default FilterPanel;