from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import shutil
from app.services.detection import detect_video

router = APIRouter()
@router.post("/upload")
async def upload_video(file: UploadFile = File(...), model: str = "helmet"):
    file_path = "temp.mp4"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result_path = detect_video(file_path, model)

    return FileResponse(
        result_path,
        media_type="video/mp4",
        filename="result.mp4"
    )