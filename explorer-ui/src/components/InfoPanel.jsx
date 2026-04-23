import React from 'react';
import '../styles/InfoPanel.css';

const InfoPanel = ({ node }) => {
  if (!node) {
    return (
      <div className="info-panel empty">
        <h3>Detalles del nodo</h3>
        <p>Selecciona una tecnología o un tema en el grafo para ver sus relaciones.</p>
      </div>
    );
  }

  return (
    <div className="info-panel">
      <div className="info-header">
        <div>
          <h3>{node.label}</h3>
          <span className="category-badge">{node.category}</span>
        </div>
      </div>

      <div className="info-block">
        <span className="info-label">Tipo</span>
        <strong>{node.type}</strong>
      </div>

      <div className="info-block">
        <span className="info-label">Conectividad</span>
        <strong>{node.connections}</strong>
      </div>

      <div className="info-block">
        <span className="info-label">Importancia</span>
        <div className="importance-bar">
          <div
            className="importance-fill"
            style={{ width: `${Math.round((node.importance || 0) * 100)}%` }}
          />
        </div>
        <small>{Math.round((node.importance || 0) * 100)}%</small>
      </div>

      <div className="info-block">
        <span className="info-label">Temas relacionados</span>
        <div className="pill-list">
          {(node.relatedThemes || []).length === 0 ? (
            <span className="muted">Sin temas relacionados</span>
          ) : (
            node.relatedThemes.map((theme) => (
              <span key={theme} className="pill">{theme}</span>
            ))
          )}
        </div>
      </div>

      <div className="info-block">
        <span className="info-label">Tecnologías integradas</span>
        <div className="pill-list">
          {(node.integratedTechnologies || []).length === 0 ? (
            <span className="muted">Sin integraciones registradas</span>
          ) : (
            node.integratedTechnologies.map((tech) => (
              <span key={tech} className="pill">{tech}</span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;