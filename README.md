# 🪖 SafetyVision - Détection EPI par Deep Learning

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-111F68?style=for-the-badge&logo=yolo&logoColor=white)](https://ultralytics.com/)
[![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org/)

## 📋 Table des matières
- [Vue d'ensemble](#vue-densemble)
- [Architecture technique](#architecture-technique)
- [Backend (FastAPI + YOLOv8)](#backend-fastapi--yolov8)
- [Frontend (React)](#frontend-react)
- [Installation & Déploiement](#installation--déploiement)
- [API Endpoints](#api-endpoints)
- [Fonctionnalités clés](#fonctionnalités-clés)

---

## 🎯 Vue d'ensemble

**SafetyVision** est une plateforme intelligente de surveillance industrielle utilisant le **deep learning** pour la détection automatique des Équipements de Protection Individuelle (EPI) : casques de sécurité et ceintures/harnais anti-chute.

### Objectifs métier
- ✅ Réduction des accidents sur les chantiers
- ✅ Conformité réglementaire en temps réel
- ✅ Analyse prédictive des risques
- ✅ Traitement par lot pour l'efficacité opérationnelle

---

## 🏗️ Architecture technique
```text
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Home    │ │Detection │ │ History  │ │Analytics │       │
│  │   Page   │ │   Page   │ │   Page   │ │   Page   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│         │            │            │            │            │
│         └────────────┴────────────┴────────────┘            │
│                         │                                   │
│                    ┌────┴────┐                              │
│                    │ App.js  │ ← State global (stats,       │
│                    │ Router  │   history, localStorage)     │
│                    └────┬────┘                              │
│                         │                                   │
│              ┌──────────┼──────────┐                        │
│              │          │          │                        │
│         ┌────┴───┐ ┌────┴───┐ ┌────┴──────┐                │
│         │Sidebar │ │ Upload │ │Frame      │                │
│         │        │ │  .js   │ │Gallery    │                │
│         └────────┘ └────────┘ └───────────┘                │
└────────────────────────┬────────────────────────────────────┘
                         │
                   HTTP/REST + CORS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                 CORS Middleware                      │  │
│  │ Origins: localhost:3000, 127.0.0.1:3000             │  │
│  └───────────────────────────────────────────────────────┘  │
│                         │                                   │
│         ┌───────────────┴───────────────┐                   │
│         │                               │                   │
│    ┌────┴────┐                    ┌─────┴────┐             │
│    │ /image  │                    │ /video   │             │
│    │ router  │                    │ router   │             │
│    └────┬────┘                    └─────┬────┘             │
│         │                               │                   │
│  ┌──────┴────────────────────────┐ ┌────┴────────────────┐ │
│  │ POST /upload-zip             │ │ POST /upload        │ │
│  │ • Accepte ZIP (images)       │ │ • Accepte MP4       │ │
│  │ • Traitement batch           │ │ • Stream vidéo      │ │
│  │ • Retourne ZIP annoté        │ │ • FFmpeg encoding   │ │
│  │ • Headers: X-Total-OK, etc.  │ │ • Output H.264      │ │
│  └──────────────────────────────┘ └──────────────────────┘ │
│                         │                                   │
│         ┌───────────────┴───────────────┐                   │
│         │      detection.py (YOLOv8)    │                   │
│         │  ┌─────────────────────────┐  │                   │
│         │  │ Model Casque           │  │                   │
│         │  │ best_casque.pt         │  │                   │
│         │  │ Classes: helmet(0),    │  │                   │
│         │  │ no_helmet(1)           │  │                   │
│         │  └─────────────────────────┘  │                   │
│         │  ┌─────────────────────────┐  │                   │
│         │  │ Model Ceinture         │  │                   │
│         │  │ best_ceinture.pt       │  │                   │
│         │  │ Classes: seatbelt(0),  │  │                   │
│         │  │ no_seatbelt(1)         │  │                   │
│         │  └─────────────────────────┘  │                   │
│         └───────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend (FastAPI + YOLOv8)

### Structure des fichiers
backend/
├── main.py              # Point d'entrée FastAPI + CORS
├── requirements.txt     # Dépendances Python
├── app/
│   ├── routes/
│   │   ├── image.py     # Endpoint ZIP batch processing
│   │   └── video.py     # Endpoint vidéo streaming
│   └── services/
│       └── detection.py # Logique YOLOv8 + OpenCV
└── models/
├── best_casque.pt   # Modèle casque (YOLOv8)
└── best_ceinture.pt # Modèle ceinture (YOLOv8)

### Modèles de détection

| Modèle | Classes | Confiance | Couleurs |
|--------|---------|-----------|----------|
| `best_casque.pt` | `helmet` (0), `no_helmet` (1) | 0.5 | 🟢 Vert (OK), 🔴 Rouge (FAIL) |
| `best_ceinture.pt` | `seatbelt` (0), `no_seatbelt` (1) | 0.5 | 🟢 Vert (OK), 🔴 Rouge (FAIL) |

### Logique de détection (`detection.py`)

```python
# Fonction clé pour images
detect_image_to_bytes(image_bytes, model_type="helmet")
# Retourne: {image_bytes, ok, fail, no_detection}

# Fonction clé pour vidéos  
detect_video(video_path, model_type="helmet")
# Retourne: "output.mp4" (H.264 encoded via FFmpeg)
Features techniques:
✅ Gestion "Sans Détection" : Si aucun objet détecté, affichage "AUCUNE DETECTION" en orange
✅ Annotation automatique : Bounding boxes + labels avec OpenCV
✅ Encodage vidéo : Conversion FFmpeg H.264 pour compatibilité navigateur
✅ Streaming ZIP : Traitement mémoire (BytesIO) sans écriture disque intermédiaire
⚛️ Frontend (React)
Structure des composants
| Composant          | Fonction                | Props clés                              |
| ------------------ | ----------------------- | --------------------------------------- |
| `App.js`           | Router + State global   | `page`, `stats`, `history`              |
| `Sidebar.js`       | Navigation + Stats live | `active`, `stats`, `onNavigate`         |
| `HomePage.js`      | Landing page marketing  | `onNavigate`                            |
| `DetectionPage.js` | Interface détection     | `stats`, `setStats`, `onAddHistory`     |
| `Upload.js`        | Logique upload + API    | `url`, `type`, `model`, `onStatsUpdate` |
| `FrameGallery.js`  | Extraction frames vidéo | `videoUrl`, `frameCount`                |
| `HistoryPage.js`   | Tableau historique      | `history`                               |
| `AnalyticsPage.js` | Dashboard dataviz       | `history`                               |

State Management
// App.js - State centralisé
const [page, setPage] = useState("home");
const [stats, setStats] = useState({ ok: 0, fail: 0, total: 0, no_detection: 0 });
const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem("safety_vision_history");
  return saved ? JSON.parse(saved) : [];
});

// Persistance automatique
useEffect(() => {
  localStorage.setItem("safety_vision_history", JSON.stringify(history));
}, [history]);
Design System (CSS Variables)
:root {
  --helmet: #00d4ff;      /* Cyan - Casque */
  --belt: #f59e0b;        /* Orange - Ceinture */
  --danger: #ff4757;      /* Rouge - Infraction */
  --success: #00e676;     /* Vert - Conforme */
  --accent: #00d4ff;      /* Accent principal */
  
  --bg-0: #080b10;        /* Fond principal */
  --bg-1: #0d1117;        /* Sidebar */
  --font-display: 'Rajdhani', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}
🚀 Installation & Déploiement
Prérequis
Python 3.8+
Node.js 16+
FFmpeg (pour encodage vidéo)
Modèles YOLOv8 (best_casque.pt, best_ceinture.pt)
Backend
# 1. Environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Dépendances
pip install -r requirements.txt

# 3. Lancement
uvicorn main:app --reload --host 0.0.0.0 --port 8000
Frontend
cd frontend
npm install
npm start  # Développement sur localhost:3000
📡 API Endpoints
Images (Batch Processing)
POST /image/upload-zip
Content-Type: multipart/form-data

file: <ZIP avec images .jpg/.png>
model: "helmet" | "belt"

Response:
  Body: <ZIP avec images annotées>
  Headers:
    X-Total-OK: <int>
    X-Total-Fail: <int>  
    X-Total-No-Det: <int>
Vidéo (Streaming)
POST /video/upload?model=helmet
Content-Type: multipart/form-data

file: <vidéo .mp4>

Response:
  Body: <vidéo annotée .mp4 (H.264)>
⭐ Fonctionnalités clés
| Feature                   | Description                                 | Tech Stack               |
| ------------------------- | ------------------------------------------- | ------------------------ |
| **Détection Temps Réel**  | Inférence YOLOv8 < 100ms/image              | PyTorch, CUDA            |
| **Traitement par Lot**    | ZIP → ZIP, jusqu'à 10 images                | JSZip, StreamingResponse |
| **Analytics Intelligent** | Courbes de danger, KPIs, recommandations IA | Recharts                 |
| **Persistance Locale**    | Historique sauvegardé dans localStorage     | React Hooks              |
| **Extraction Frames**     | 12 frames clés par vidéo pour analyse       | Canvas API, HTML5 Video  |
| **Responsive Design**     | Mobile-first, sidebar collapsible           | CSS Grid, Flexbox        |

📊 Pages de l'application
🏠 HomePage
Hero section avec statistiques clés
Présentation des deux modèles (Casque & Ceinture)
Call-to-action vers la détection
🔍 DetectionPage
Sélection du modèle (Casque/Ceinture)
Choix du format (Images ZIP ou Vidéo MP4)
Zone de drop/upload
Visualisation des résultats annotés
📋 HistoryPage
Tableau historique des analyses
Colonnes : Date/Heure, Modèle, Type, Total, OK, FAIL
Persistance localStorage
📈 AnalyticsPage
KPI Cards : Score global, Alerte critique
Courbe de Danger : Évolution des infractions (AreaChart)
Répartition des Risques : PieChart des erreurs par équipement
Comparatif de Fiabilité : Barres de progression par équipement
Recommandation IA : Conseil contextuel basé sur les données
🎨 UI/UX Features
Sidebar Interactive
Navigation fluide entre les pages
Stats EPI en temps réel (TOTAL, CONFORMES, INFRACTIONS, SANS DÉTECTION)
Indicateurs de statut avec couleurs thématiques
Visualisation des Résultats
Images : Grille responsive (3-4 images par ligne)
Vidéo : Player HTML5 + galerie de frames extraites
Annotations : Bounding boxes colorées (Vert=OK, Rouge=FAIL, Orange=Sans détection)
Feedback Utilisateur
Spinner de chargement pendant l'analyse
Alertes d'erreur stylisées
Badges de statut sur les résultats
🔒 Sécurité & Performance
CORS configuré pour localhost:3000
Headers exposés : X-Total-OK, X-Total-Fail, X-Total-No-Det
Streaming mémoire : Pas d'écriture disque temporaire
FFmpeg : Encodage optimisé H.264 pour compatibilité web
🛠️ Technologies utilisées
Backend
FastAPI 0.104.1 - Framework web async
Ultralytics 8.0.196 - YOLOv8 pour la détection
OpenCV 4.8.1.78 - Traitement d'images
NumPy 1.26.4 - Manipulation de tableaux
FFmpeg - Encodage vidéo
Frontend
React 18+ - UI library
Recharts - Visualisation de données
JSZip - Compression/décompression ZIP côté client
CSS3 - Variables, Grid, Flexbox, Animations
📝 Notes de développement
Gestion des cas particuliers
Aucune détection : Image annotée "AUCUNE DETECTION" en orange
Headers CORS : Access-Control-Expose-Headers crucial pour le frontend
Vidéo raw : Conversion FFmpeg obligatoire pour la compatibilité navigateur
Améliorations futures
[ ] Intégration caméras IP temps réel (RTSP)
[ ] Alertes SMS/email pour infractions critiques
[ ] Dashboard multi-sites
[ ] Export rapports PDF
