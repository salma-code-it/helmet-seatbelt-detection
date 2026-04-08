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

    #results[0] contient les détections pour l'image actuelle
    result = results[0] 

    # ✅ VERIFICATION SI VIDE
    if len(result.boxes) == 0:
        count_no_detection = 1
        cv2.putText(image, "AUCUNE DETECTION", (20, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 165, 255), 2)
    else:
        # ✅ SI NON VIDE, ON COMPTE LES OBJETS
        for box in result.boxes:
            cls = int(box.cls[0])
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            
            label = ("helmet" if cls == 0 else "no_helmet") if model_type == "helmet" else ("no_seatbelt" if cls == 0 else "seatbelt")

            if "no" in label:
                count_fail += 1
                color = (0, 0, 255)
            else:
                count_ok += 1
                color = (0, 255, 0)

            cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
            cv2.putText(image, label, (x1, y1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    _, buffer = cv2.imencode('.jpg', image)
    
    return {
        "image_bytes": buffer.tobytes(),
        "ok": count_ok,
        "fail": count_fail,
        "no_detection": count_no_detection
    }

## Video
def detect_video(video_path, model_type="helmet"):

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

        results = model.predict(frame, conf=0.5)

        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])

                if model_type == "helmet":
                    label = "helmet" if cls == 0 else "no_helmet"
                else:
                    label = "no_seatbelt" if cls == 0 else "seatbelt"

                color = (0, 255, 0) if "no" not in label else (0, 0, 255)

                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, label, (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

        out.write(frame)

    cap.release()
    out.release()

    # conversion ffmpeg inchangée
    subprocess.run([
        "ffmpeg",
        "-i", "output_raw.mp4",
        "-vcodec", "libx264",
        "-crf", "23",
        "-preset", "fast",
        "-pix_fmt", "yuv420p",
        "output.mp4"
    ], check=True)

    return "output.mp4"