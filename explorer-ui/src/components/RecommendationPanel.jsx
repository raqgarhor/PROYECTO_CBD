import React, { useState } from 'react';
import '../styles/ToolPanel.css';

const themes = [
  { id: '01', label: 'Minería de Datos' },
  { id: '02', label: 'NoSQL' },
  { id: '03', label: 'SIG / GIS' },
  { id: '04', label: 'Ingeniería Inversa' },
  { id: '05', label: 'Blockchain' },
  { id: '06', label: 'Data Warehouse' },
  { id: '07', label: 'Bases de Datos Móviles' },
  { id: '08', label: 'La Web Semántica' },
  { id: '09', label: 'Big Data' },
  { id: '10', label: 'BBDD Distribuidas' }
];

const RecommendationPanel = ({ onLoadRecommendations, onReset, recommendations = [] }) => {
  const [selectedTheme, setSelectedTheme] = useState('');

  return (
    <div className="tool-panel">
      <div className="panel-header">
        <h3>Recomendaciones</h3>
        <span>Explora stacks por tema</span>
      </div>

      <label className="filter-label">Tema</label>
      <select
        className="filter-select"
        value={selectedTheme}
        onChange={(e) => setSelectedTheme(e.target.value)}
      >
        <option value="">Selecciona un tema</option>
        {themes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.label}
          </option>
        ))}
      </select>

      <div className="tool-actions">
        <button
          className="primary-btn"
          onClick={() => selectedTheme && onLoadRecommendations(selectedTheme)}
          disabled={!selectedTheme}
        >
          Ver recomendaciones
        </button>
        <button className="secondary-btn" onClick={onReset}>
          Reset
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="analytics-section" style={{ marginTop: '0.8rem' }}>
          <h4>Top recomendadas</h4>
          <div className="analytics-list">
            {recommendations.slice(0, 5).map((item) => (
              <div key={item.id} className="analytics-item">
                <div>
                  <strong>{item.nombre}</strong>
                  <small>{item.categoria}</small>
                  <small>{(item.razones || []).slice(0, 2).join(' · ')}</small>
                </div>
                <span>{Number(item.score || 0).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPanel;