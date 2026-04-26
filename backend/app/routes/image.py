from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import StreamingResponse
import io
import zipfile
from app.services.detection import detect_image_to_bytes

router = APIRouter()

@router.post("/upload-zip")
async def upload_zip_images(file: UploadFile = File(...), model: str = Form("helmet")):
    zip_data = await file.read()
    input_zip = zipfile.ZipFile(io.BytesIO(zip_data))
    output_buffer = io.BytesIO()
    
    total_ok = 0
    total_fail = 0
    total_no_det = 0 

    with zipfile.ZipFile(output_buffer, "w") as output_zip:
        for file_name in input_zip.namelist():
            if file_name.lower().endswith(('.png', '.jpg', '.jpeg')) and not file_name.startswith('__'):
                with input_zip.open(file_name) as image_file:
                    result = detect_image_to_bytes(image_file.read(), model)
                    total_ok += result["ok"]
                    total_fail += result["fail"]
                    total_no_det += result["no_detection"]
                    output_zip.writestr(f"det_{file_name}", result["image_bytes"])

    output_buffer.seek(0)
    return StreamingResponse(
        output_buffer,
        media_type="application/zip",
        headers={
            "Content-Disposition": "attachment; filename=results.zip",
            "X-Total-OK": str(total_ok),
            "X-Total-Fail": str(total_fail),
            "X-Total-No-Det": str(total_no_det),
            "Access-Control-Expose-Headers": "X-Total-OK, X-Total-Fail, X-Total-No-Det"
        } 
    )