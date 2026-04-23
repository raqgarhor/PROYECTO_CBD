import React from 'react';

const DashboardStats = ({ stats }) => {
  return (
    <section className="stats-grid">
      <div className="stat-card">
        <span className="stat-kicker">Tecnologías</span>
        <strong>{stats.technologies}</strong>
        <small>Total de tecnologías modeladas</small>
      </div>

      <div className="stat-card">
        <span className="stat-kicker">Temas</span>
        <strong>{stats.themes}</strong>
        <small>Áreas temáticas del curso</small>
      </div>

      <div className="stat-card">
        <span className="stat-kicker">Integraciones</span>
        <strong>{stats.integrations}</strong>
        <small>Relaciones entre tecnologías</small>
      </div>

      <div className="stat-card">
        <span className="stat-kicker">Relaciones</span>
        <strong>{stats.relations}</strong>
        <small>Total de enlaces del ecosistema</small>
      </div>
    </section>
  );
};

export default DashboardStats;