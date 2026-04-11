import React from "react";

function Sidebar({ active, onNavigate, stats }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🪖</div>
        <div className="logo-text">
          <div className="logo-name">Safety<span>Vision</span></div>
          <div className="logo-sub">EPI Protection</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-section-label">Navigation</div>
        <button className={`nav-item ${active === "home" ? "active" : ""}`} onClick={() => onNavigate("home")}>
          <span className="nav-icon">⌂</span> Accueil
        </button>
        <button className={`nav-item ${active === "detection" ? "active" : ""}`} onClick={() => onNavigate("detection")}>
          <span className="nav-icon">◎</span> Détection
        </button>
        {/* ✅ NOUVEAU BOUTON HISTORIQUE */}
        <button className={`nav-item ${active === "history" ? "active" : ""}`} onClick={() => onNavigate("history")}>
          <span className="nav-icon">📋</span> Historique
        </button>
        <button className={`nav-item ${active === "analytics" ? "active" : ""}`} onClick={() => onNavigate("analytics")}>
          <span className="nav-icon">📊</span> Analytics
        </button>
      </div>

      {/* Rapports EPI (inchangé) */}
      <div className="sidebar-section" style={{ marginTop: 'auto' }}>
        <div className="sidebar-section-label">Rapports EPI</div>
        <div className="sidebar-stats-container">
          <div className="sb-stat-item"><span className="sb-stat-label">TOTAL</span><span className="sb-stat-value">{stats.total}</span></div>
          <div className="sb-stat-item conforme"><span className="sb-stat-label">CONFORMES</span><span className="sb-stat-value">{stats.ok}</span></div>
          <div className="sb-stat-item infraction"><span className="sb-stat-label">INFRACTIONS</span><span className="sb-stat-value">{stats.fail}</span></div>
          <div className="sb-stat-item orange"><span className="sb-stat-label">SANS DÉTECTION</span><span className="sb-stat-value">{stats.no_detection}</span></div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;