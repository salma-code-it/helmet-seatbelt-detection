# SafetyVision - PPE Detection Using Deep Learning

## Table of Contents
- Overview
- Technical Architecture
- Backend (FastAPI + YOLOv8)
- Frontend (React)
- Installation & Deployment
- API Endpoints
- Key Features

---

## Overview

**SafetyVision** is an intelligent industrial monitoring platform that uses **deep learning** for the automatic detection of Personal Protective Equipment (PPE), including safety helmets and safety belts/fall-arrest harnesses.

### Business Objectives
- Reduce workplace accidents on construction and industrial sites
- Ensure real-time regulatory compliance
- Enable predictive risk analysis
- Support batch processing for operational efficiency

---

## Technical Architecture

The application consists of:
- A **React Frontend** with pages for Home, Detection, History, and Analytics.
- A **FastAPI Backend** exposing image and video processing endpoints.
- **YOLOv8 models** for helmet and safety-belt detection.
- OpenCV and FFmpeg for annotation and video processing.

---

## Backend Structure

backend/
├── main.py              # FastAPI entry point + CORS configuration
├── requirements.txt     # Python dependencies
├── app/
│   ├── routes/
│   │   ├── image.py     # ZIP batch-processing endpoint
│   │   └── video.py     # Video streaming endpoint
│   └── services/
│       └── detection.py # YOLOv8 + OpenCV detection logic
└── models/
    ├── best_casque.pt   # Helmet detection model
    └── best_ceinture.pt # Safety belt detection model

---

## Detection Models

| Model | Classes | Confidence Threshold |
|--------|---------|---------------------|
| best_casque.pt | helmet, no_helmet | 0.5 |
| best_ceinture.pt | seatbelt, no_seatbelt | 0.5 |

### Detection Logic

#### Image Processing
detect_image_to_bytes(image_bytes, model_type="helmet")

Returns:
- image_bytes
- ok
- fail
- no_detection

#### Video Processing
detect_video(video_path, model_type="helmet")

Returns:
- H.264 encoded output video

### Technical Features
- No-detection management with orange warning labels
- Automatic annotation using OpenCV
- FFmpeg H.264 video conversion for browser compatibility
- In-memory ZIP streaming using BytesIO

---

# Frontend (React)

## Main Components

| Component | Purpose |
|-----------|----------|
| App.js | Routing and global state management |
| Sidebar.js | Navigation and live statistics |
| HomePage.js | Landing page |
| DetectionPage.js | Detection interface |
| Upload.js | Upload logic and API communication |
| FrameGallery.js | Video frame extraction |
| HistoryPage.js | Detection history |
| AnalyticsPage.js | Analytics dashboard |

## State Management

The application centralizes:
- Navigation state
- Detection statistics
- Historical results
- LocalStorage persistence

---

## Design System

Main colors:
- Helmet: Cyan
- Belt: Orange
- Success: Green
- Danger: Red

Typography:
- Rajdhani
- DM Sans

---

# Installation & Deployment

## Requirements

- Python 3.8+
- Node.js 16+
- FFmpeg
- YOLOv8 model files

## Backend Setup

1. Create a virtual environment
2. Install dependencies
3. Run FastAPI with Uvicorn

## Frontend Setup

1. Navigate to the frontend folder
2. Install dependencies with npm
3. Start the React application

---

# API Endpoints

## Image Batch Processing

POST /image/upload-zip

Features:
- Accepts ZIP archives containing images
- Supports helmet and belt detection
- Returns an annotated ZIP archive

Response headers:
- X-Total-OK
- X-Total-Fail
- X-Total-No-Det

## Video Processing

POST /video/upload

Features:
- Accepts MP4 files
- Performs frame-by-frame detection
- Returns an annotated H.264 video

---

# Key Features

| Feature | Description |
|----------|-------------|
| Real-Time Detection | YOLOv8 inference under 100 ms per image |
| Batch Processing | ZIP-to-ZIP workflow |
| Intelligent Analytics | KPIs, charts, and AI recommendations |
| Local Persistence | History stored in LocalStorage |
| Frame Extraction | Key-frame extraction from videos |
| Responsive Design | Mobile-first interface |

---

# Application Pages

## Home Page
- Hero section
- Model presentation
- Call-to-action buttons

## Detection Page
- Model selection
- File upload
- Detection results visualization

## History Page
- Detection history table
- Date, model, type, total, OK, FAIL columns

## Analytics Page
- KPI cards
- Risk curves
- Error distribution charts
- Reliability comparison
- AI recommendations

---

# UI/UX Features

## Interactive Sidebar
- Smooth navigation
- Real-time statistics
- Color indicators

## Results Visualization
- Responsive image grid
- Video player with extracted frames
- Colored annotations

## User Feedback
- Loading spinner
- Error alerts
- Status badges

---

# Security & Performance

- CORS configured for localhost:3000
- Exposed response headers
- In-memory streaming
- Optimized FFmpeg H.264 encoding

---

# Technologies Used

## Backend
- FastAPI
- Ultralytics YOLOv8
- OpenCV
- NumPy
- FFmpeg

## Frontend
- React
- Recharts
- JSZip
- CSS3

---

# Development Notes

## Special Cases
- No detection → orange annotation
- CORS headers required
- Mandatory video conversion

## Future Improvements
- Real-time IP camera support (RTSP)
- SMS and email alerts
- Multi-site dashboard
- PDF export
