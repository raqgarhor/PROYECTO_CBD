import React, { useState } from 'react';
import '../styles/ToolPanel.css';

const DescriptionRecommendationPanel = ({ onLoadRecommendations, onReset, recommendations = [], loading = false }) => {
  const [description, setDescription] = useState('');

  const handleSearch = async () => {
    if (description.trim()) {
      onLoadRecommendations(description);
      setDescription('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="tool-panel">
      <div className="panel-header">
        <h3>Recomendaciones por Descripción</h3>
        <span>Describe tu proyecto</span>
      </div>

      <label className="filter-label">Descripción del Proyecto</label>
      <textarea
        className="filter-textarea"
        placeholder="Ej: Necesito un backend escalable para procesar datos en tiempo real con muchas relaciones complejas..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyPress={handleKeyPress}
        rows="4"
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          resize: 'vertical'
        }}
      />

      <div className="tool-actions">
        <button
          className="primary-btn"
          onClick={handleSearch}
          disabled={!description.trim() || loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Buscando...' : 'Buscar Tecnologías'}
        </button>
        <button className="secondary-btn" onClick={onReset}>
          Limpiar
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="analytics-section" style={{ marginTop: '0.8rem' }}>
          <h4>Tecnologías Recomendadas</h4>
          <div className="analytics-list">
            {recommendations.slice(0, 10).map((item) => (
              <div key={item.id} className="analytics-item">
                <div>
                  <strong>{item.nombre}</strong>
                  <small>{item.categoria}</small>
                  <small style={{ color: '#666' }}>
                    {(item.razones || []).slice(0, 2).join(' • ')}
                  </small>
                </div>
                <span style={{ fontWeight: 'bold', color: '#0066cc' }}>
                  {Number(item.score || 0).toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DescriptionRecommendationPanel;
