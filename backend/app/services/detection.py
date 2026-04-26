from ultralytics import YOLO
import cv2
import subprocess
import os
import numpy as np
import base64

# Charger les modèles
model_helmet = YOLO("app/models/best_casque.pt")
model_belt   = YOLO("app/models/best_ceinture.pt")

def detect_image_to_bytes(image_bytes, model_type="helmet"):
    model = model_helmet if model_type == "helmet" else model_belt
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model.predict(image, conf=0.5)

    count_ok = 0
    count_fail = 0
    count_no_detection = 0

    result = results[0] 

    if len(result.boxes) == 0:
        count_no_detection = 1
        cv2.putText(image, "AUCUNE DETECTION", (20, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 165, 255), 2)
    else:
        for box in result.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])  # Récupérer la confiance
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            
            label = ("helmet" if cls == 0 else "no_helmet") if model_type == "helmet" else ("no_seatbelt" if cls == 0 else "seatbelt")

            if "no" in label:
                count_fail += 1
                color = (0, 0, 255)
            else:
                count_ok += 1
                color = (0, 255, 0)

            # --- DESSIN ---
            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            
            # Positionnement intelligent pour ne pas sortir de l'image
            y_text = y1 if y1 > 50 else y1 + 50
            
            # Label
            cv2.putText(image, label, (x1, y_text - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
            # Confiance (affichée juste au-dessus du label)
            cv2.putText(image, f"Conf: {conf:.2f}", (x1, y_text - 35), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    _, buffer = cv2.imencode('.jpg', image)
    
    return {
        "image_bytes": buffer.tobytes(),
        "ok": count_ok,
        "fail": count_fail,
        "no_detection": count_no_detection
    }

## Video

def detect_video(video_path, model_type="helmet"):
    # Sélection du modèle
    if model_type == "helmet":
        model = model_helmet
    else:
        model = model_belt

    cap = cv2.VideoCapture(video_path)

    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps    = cap.get(cv2.CAP_PROP_FPS) or 20.0

    out = cv2.VideoWriter("output_raw.mp4",
                          cv2.VideoWriter_fourcc(*'mp4v'),
                          fps, (width, height))

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Prédiction sur la frame
        results = model.predict(frame, conf=0.5, verbose=False)

        for result in results:
            for box in result.boxes:
                # 1. Récupérer coordonnées, classe et CONFIANCE
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])
                conf = float(box.conf[0]) # <--- Confiance ajoutée

                # 2. Déterminer la couleur via le label
                if model_type == "helmet":
                    label = "helmet" if cls == 0 else "no_helmet"
                else:
                    label = "no_seatbelt" if cls == 0 else "seatbelt"

                color = (0, 255, 0) if "no" not in label else (0, 0, 255)

                # 3. Dessiner le rectangle
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

                # 4. Afficher UNIQUEMENT la confiance en haut de la box
                # Sécurité : si y1 est trop proche du bord haut de la vidéo
                conf_y = y1 - 10 if y1 > 30 else y1 + 25
                
                # On affiche uniquement le chiffre (ex: 0.85)
                cv2.putText(frame, f"{conf:.2f}", (x1, conf_y),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        out.write(frame)

    cap.release()
    out.release()

    # Conversion ffmpeg (libx264 pour compatibilité navigateur)
    subprocess.run([
        "ffmpeg", "-y", # -y pour écraser si le fichier existe
        "-i", "output_raw.mp4",
        "-vcodec", "libx264",
        "-crf", "23",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "output.mp4"
    ], check=True)

    return "output.mp4"