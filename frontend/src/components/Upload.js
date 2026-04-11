import React, { useState, useRef } from "react";
import JSZip from "jszip";
import FrameGallery from "./FrameGallery"; 

function Upload({ url, type, model, onStatsUpdate, onAddHistory }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [annotatedImages, setAnnotatedImages] = useState([]);
  const [resultVideoUrl, setResultVideoUrl] = useState(null);
  const [zipBlob, setZipBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setAnnotatedImages([]);
    setResultVideoUrl(null);
    setZipBlob(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (type === "image") {
        const zipWriter = new JSZip();
        selectedFiles.forEach((f) => zipWriter.file(f.name, f));
        const blobZipInput = await zipWriter.generateAsync({ type: "blob" });
        
        formData.append("file", blobZipInput, "input.zip");
        formData.append("model", model);

        const res = await fetch(url, { method: "POST", body: formData });
        if (!res.ok) throw new Error("Erreur serveur lors de l'analyse.");

        const ok = parseInt(res.headers.get("X-Total-OK") || "0");
        const fail = parseInt(res.headers.get("X-Total-Fail") || "0");
        const noDet = parseInt(res.headers.get("X-Total-No-Det") || res.headers.get("x-total-no-det") || "0");

        onStatsUpdate({ ok, fail, no_detection: noDet, total: ok + fail });
        
        onAddHistory({
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: model === "helmet" ? "Casque" : "Ceinture",
          modelId: model,
          type: "Batch ZIP",
          total: ok + fail,
          ok: ok,
          fail: fail
        });

        const blob = await res.blob();
        setZipBlob(blob);
        const jszip = new JSZip();
        const contents = await jszip.loadAsync(blob);
        const previews = [];

        for (let name in contents.files) {
          if (!contents.files[name].dir) {
            const imgBlob = await contents.files[name].async("blob");
            previews.push({ name, url: URL.createObjectURL(imgBlob) });
          }
        }
        setAnnotatedImages(previews);

      } else {
        formData.append("file", selectedFiles[0]);
        const res = await fetch(`${url}?model=${model}`, { method: "POST", body: formData });
        
        if (!res.ok) throw new Error("Erreur lors de la détection vidéo.");

        const ok = parseInt(res.headers.get("X-Total-OK") || "0");
        const fail = parseInt(res.headers.get("X-Total-Fail") || "0");
        const noDet = parseInt(res.headers.get("X-Total-No-Det") || "0");

        onStatsUpdate({ ok, fail, no_detection: noDet, total: ok + fail });

        onAddHistory({ 
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: model === "helmet" ? "Casque" : "Ceinture",
          modelId: model,
          type: "Vidéo MP4", 
          ok: ok, 
          fail: fail 
        });

        const videoBlob = await res.blob();
        setResultVideoUrl(URL.createObjectURL(videoBlob));
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = () => {
    if (!zipBlob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = `results_${model}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="drop-zone" onClick={() => inputRef.current.click()}>
          <input
            ref={inputRef}
            type="file"
            accept={type === "image" ? "image/*" : "video/mp4"}
            multiple={type === "image"}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <span className="drop-icon">{type === "image" ? "📦" : "🎬"}</span>
          <h3>
            {selectedFiles.length > 0
              ? `${selectedFiles.length} fichier(s) sélectionné(s)`
              : `Cliquez pour choisir des ${type === "image" ? "images" : "vidéos"}`}
          </h3>
        </div>

        <button
          className={`btn-run ${loading ? "loading" : ""}`}
          onClick={handleUpload}
          disabled={loading || selectedFiles.length === 0}
        >
          {loading ? <div className="spinner" /> : "▶ LANCER LA DÉTECTION"}
        </button>
      </div>

      {error && <div className="alert-box">⚠ {error}</div>}

      {zipBlob && type === "image" && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button className="btn-sec" onClick={downloadZip}>
            📥 Télécharger les résultats (.zip)
          </button>
        </div>
      )}

      {/* ✅ GRILLE HARMONISÉE POUR IMAGES ET FRAMES VIDÉO */}
      <div className="frame-grid">
        {type === "image" ? (
          annotatedImages.map((img, idx) => (
            <div key={idx} className="result-card-wrapper">
              <img src={img.url} alt="res" />
              <div className="result-img-badge">{img.name.replace("annotated_", "")}</div>
            </div>
          ))
        ) : (
          resultVideoUrl && (
            <>
              <div className="result-panel" style={{ width: "100%", marginBottom: "20px" }}>
                <video controls className="result-media" src={resultVideoUrl} style={{ width: "100%" }} />
              </div>
              <div className="frame-gallery-wrap">
                 <h3 className="section-title">Analyse des séquences</h3>
                 <FrameGallery videoUrl={resultVideoUrl} frameCount={12} />
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default Upload;