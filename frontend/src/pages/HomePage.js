import React from "react";

function HomePage({ onNavigate }) {
  return (
    <div className="page">
      <div className="home-hero">
        <div className="hero-tag">⬡ Surveillance Industrielle Intelligente</div>
        <h1>SafetyVision : Sécurité par l'IA</h1>
        <p>
          Plateforme de détection automatique des Équipements de Protection Individuelle (EPI). 
          Utilisant le deep learning pour garantir la sécurité sur les sites à risques.
        </p>
        <div className="hero-stats">
          <div className="hstat"><span className="hstat-val c-accent">Model 1</span><span className="hstat-key">Détection Casque</span></div>
          <div className="hstat"><span className="hstat-val c-belt">Model 2</span><span className="hstat-key">Détection Ceinture</span></div>
          <div className="hstat"><span className="hstat-val c-success">Inférence</span><span className="hstat-key">Temps Réel</span></div>
        </div>
      </div>

      <div className="info-grid-2">
        <div className="icard">
          <div className="icard-head"><div className="icard-icon blue">🪖</div><h3>Modèle 1 : Casque de Sécurité</h3></div>
          <p>
            <b>Objectif :</b> Vérifier le port du casque homologué. <br/>
            <b>Impact :</b> Réduction immédiate des accidents graves sur les zones de construction. 
            L'IA identifie les zones à risques sans casque.
          </p>
        </div>
        <div className="icard">
          <div className="icard-head"><div className="icard-icon amber">🦺</div><h3>Modèle 2 : Ceinture de Sécurité</h3></div>
          <p>
            <b>Objectif :</b> Détecter le port de la ceinture ou du harnais anti-chute.<br/>
            <b>Impact :</b> Sécurisation des travaux en hauteur et conformité des conducteurs d'engins industriels.
          </p>
        </div>
      </div>

      <div className="pipeline">
        <div className="section-title">Nouveauté : Traitement par Lot (ZIP)<small>Gagnez du temps</small></div>
        <p style={{ color: 'var(--text-2)', fontSize: '0.85rem' }}>
          Vous pouvez désormais envoyer jusqu'à 10 images compressées en un ZIP. 
          Notre API traite chaque image et vous renvoie un dossier ZIP contenant tous les résultats annotés.
        </p>
      </div>

      <button className="btn-run" style={{ maxWidth: 300 }} onClick={() => onNavigate("detection")}>
        Démarrer l'Analyse YOLOv8
      </button>
    </div>
  );
}

export default HomePage;