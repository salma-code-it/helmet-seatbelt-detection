import React from "react";

function HistoryPage({ history }) {
  return (
    <div className="page">
      <div className="det-header">
        <h2>Historique des Détections</h2>
        <p>Consultez l'ensemble des analyses effectuées durant cette session.</p>
      </div>

      <div className="upload-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date & Heure</th>
              <th>Modèle</th>
              <th>Type</th>
              <th>Total</th>
              <th>OK</th>
              <th>FAIL</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-3)' }}>
                  Aucune donnée disponible pour le moment.
                </td>
              </tr>
            ) : (
              history.map((item, index) => (
                <tr key={index}>
                  <td>{item.date} <span style={{ color: 'var(--text-3)', fontSize: '0.7rem' }}>{item.time}</span></td>
                  <td><span className={`meta-tag ${item.modelId}`}>{item.model}</span></td>
                  <td>{item.type}</td>
                  <td style={{ fontWeight: 'bold' }}>{item.total}</td>
                  <td style={{ color: 'var(--success)' }}>{item.ok}</td>
                  <td style={{ color: 'var(--danger)' }}>{item.fail}</td>
                  <td>
                    <span className="result-badge" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                      Terminé
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoryPage;