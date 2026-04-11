import React, { useState } from "react";
import Upload from "../components/Upload";

const MODELS = [
  { id: "helmet", icon: "🪖", label: "Modèle Casque", tags: ["helmet", "no_helmet"], imageUrl: "http://127.0.0.1:8000/image/upload-zip", videoUrl: "http://127.0.0.1:8000/video/upload" },
  { id: "belt", icon: "🦺", label: "Modèle Ceinture", tags: ["seatbelt", "no_seatbelt"], imageUrl: "http://127.0.0.1:8000/image/upload-zip", videoUrl: "http://127.0.0.1:8000/video/upload" },
];

function DetectionPage({ stats, setStats ,onAddHistory}) {
  const [selectedModel, setSelectedModel] = useState("helmet");
  const [selectedType, setSelectedType] = useState("image");

  const model = MODELS.find(m => m.id === selectedModel);
  const uploadUrl = selectedType === "image" ? model.imageUrl : model.videoUrl;

  return (
    <div className="page">
      <div className="det-header">
        <h2>Système de Détection EPI</h2>
        <p>Les rapports de sécurité sont mis à jour en direct dans la barre latérale.</p>
      </div>

      <div className="section-title">Étape 1 — Choisir le Modèle</div>
      <div className="selector-row">
        {MODELS.map(m => (
          <div key={m.id} 
               className={`model-card ${selectedModel === m.id ? (m.id === 'helmet' ? 'selected-helmet' : 'selected-belt') : ''}`}
               onClick={() => { setSelectedModel(m.id); setStats({ ok: 0, fail: 0, total: 0, no_detection: 0 }); }}>
            <div className="model-card-icon">{m.icon}</div>
            <h3>{m.label}</h3>
          </div>
        ))}
      </div>

      <div className="section-title">Étape 2 — Choisir le Format</div>
      <div className="type-row">
        <button className={`type-btn ${selectedType === 'image' ? 'active' : ''}`} onClick={() => setSelectedType('image')}>🖼 Batch d'Images (ZIP)</button>
        <button className={`type-btn ${selectedType === 'video' ? 'active' : ''}`} onClick={() => setSelectedType('video')}>🎬 Vidéo MP4</button>
      </div>

      <div className="upload-card">
        <Upload 
            url={uploadUrl} 
            type={selectedType} 
            model={selectedModel} 
            onStatsUpdate={setStats}
            onAddHistory={onAddHistory} // ✅ Ajouté 
        />
      </div>
    </div>
  );
}

export default DetectionPage;