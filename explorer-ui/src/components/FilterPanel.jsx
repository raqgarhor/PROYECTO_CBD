import React from 'react';
import '../styles/FilterPanel.css';

const categories = [
  'all',
  'Tema',
  'Backend',
  'Grafos',
  'Blockchain',
  'Documental',
  'Clave-Valor',
  'Columnar',
  'SGBD espacial',
  'Herramienta SIG',
  'SIG SaaS',
  'SIG DaaS',
  'Modelado de datos',
  'Plataforma blockchain',
  'BaaS',
  'Máquina virtual',
  'ETL libre',
  'ETL propietario',
  'SGBD móvil',
  'Componente SQL Anywhere',
  'Motor embebido móvil',
  'Sincronización móvil',
  'Base de datos orientada a objetos',
  'NoSQL en la nube',
  'Base de datos embebida'
];

const FilterPanel = ({
  onFilterChange,
  selectedFilter,
  onlyBridgeNodes,
  onToggleBridgeNodes
}) => {
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