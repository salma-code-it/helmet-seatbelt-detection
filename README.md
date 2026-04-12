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
