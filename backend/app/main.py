from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import image, video

app = FastAPI()

# Autoriser React frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Total-OK", "X-Total-Fail", "X-Total-No-Det"]
)

app.include_router(image.router, prefix="/image", tags=["Image"])
app.include_router(video.router, prefix="/video", tags=["Video"])