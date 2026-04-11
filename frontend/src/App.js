import React, { useState, useEffect } from "react"; // ✅ Ajout de useEffect
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import DetectionPage from "./pages/DetectionPage";
import HistoryPage from "./pages/HistoryPage"; 
import AnalyticsPage from "./pages/AnalyticsPage";

function App() {
  const [page, setPage] = useState("home");
  const [stats, setStats] = useState({ ok: 0, fail: 0, total: 0 });

  // ✅ Initialisation : Charge l'historique depuis le localStorage au démarrage
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("safety_vision_history");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Persistance : Sauvegarde automatique dès que l'historique change
  useEffect(() => {
    localStorage.setItem("safety_vision_history", JSON.stringify(history));
  }, [history]);

  const addHistoryItem = (newItem) => {
  const time = new Date().toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  setHistory(prev => {
    const updated = [{ ...newItem, time }, ...prev];
    return updated; // ✅ Supprime .slice(0, 50) pour garder TOUT l'historique
  });
};

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage onNavigate={setPage} />;
      case "detection":
        return <DetectionPage stats={stats} setStats={setStats} onAddHistory={addHistoryItem} />;
      case "history":
        return <HistoryPage history={history} />; 
      // Dans ton switch renderPage() :
      case "analytics": 
        return <AnalyticsPage history={history} />;
      default:
        return <HomePage onNavigate={setPage} />;
    }
  };

  return (
    <div className="app-layout">
      {/* ✅ Passage de 'history' à la Sidebar pour l'affichage latéral */}
      <Sidebar 
        active={page} 
        onNavigate={setPage} 
        stats={stats} 
        history={history} 
      />
      
      <div className="main-area">
        <header className="topbar">
          <div className="topbar-title">
            <span>SafetyVision /</span> {page.toUpperCase()}
          </div>
          <div className="topbar-badge">YOLOv8 Online</div>
        </header>
        
        <main className="content-area">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;