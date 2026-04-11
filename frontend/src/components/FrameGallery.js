import React, { useEffect, useRef, useState } from "react";

function FrameGallery({ videoUrl, frameCount = 12 }) {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoUrl) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    video.src = videoUrl;

    video.onloadedmetadata = () => {
      const timestamps = Array.from({ length: frameCount }, (_, i) => (video.duration / (frameCount + 1)) * (i + 1));
      const captured = [];
      let idx = 0;

      const capture = () => {
        if (idx >= timestamps.length) { setFrames(captured); setLoading(false); return; }
        video.currentTime = timestamps[idx];
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        captured.push({ id: idx, dataUrl: canvas.toDataURL("image/jpeg") });
        idx++; capture();
      };
      capture();
    };
  }, [videoUrl, frameCount]);

  return (
  <div className="frame-gallery-wrap">
    {/* Une seule balise vidéo avec les attributs nécessaires */}
    <video 
      ref={videoRef} 
      style={{ display: "none" }} 
      muted 
      playsInline 
      crossOrigin="anonymous" 
    />
    <canvas ref={canvasRef} style={{ display: "none" }} />
    
    <div className="frame-gallery-title">
      <span>🎞 Frames Extraites</span>
      <span className="frame-count-badge">{frames.length} images</span>
    </div>

    <div className="frame-grid">
      {frames.map((f, index) => (
        <div key={f.id} className="frame-thumb" onClick={() => setSelected(f)}>
          <img src={f.dataUrl} alt={`frame-${index}`} />
          <div className="frame-num">#{index + 1}</div>
        </div>
      ))}
    </div>

    {selected && (
      <div className="frame-modal-overlay" onClick={() => setSelected(null)}>
        <div className="frame-modal" onClick={e => e.stopPropagation()}>
          <div className="frame-modal-top">
            <h4>Vue détaillée</h4>
            <button className="frame-modal-close">×</button>
          </div>
          <img src={selected.dataUrl} alt="full" />
        </div>
      </div>
    )}
  </div>
);
}

export default FrameGallery;