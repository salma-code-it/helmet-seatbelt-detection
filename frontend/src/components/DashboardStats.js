import React from "react";

function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-value">{stats.total || 0}</span>
        <span className="stat-label">Total Détectés</span>
      </div>
      <div className="stat-card">
        <span className="stat-value" style={{ color: 'var(--success)' }}>
          {stats.ok || 0}
        </span>
        <span className="stat-label">Conformes (OK)</span>
      </div>
      <div className="stat-card">
        <span className="stat-value" style={{ color: 'var(--danger)' }}>
          {stats.fail || 0}
        </span>
        <span className="stat-label">Infractions (FAIL)</span>
      </div>

<div className="stat-card orange">
    <h3>{stats.no_detection}</h3>
    <p>SANS DÉTECTION</p>
</div>
    </div>
  );
}

export default DashboardStats;