from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import Response, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from gulagcleaner.clean import clean_pdf_bytes
import io
import os

app = FastAPI(title="Gulag Cleaner Web")

# Enable CORS just in case, though we will serve static mainly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/clean")
async def clean_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    try:
        content = await file.read()
        
        # Use gulagcleaner to clean the PDF
        result = clean_pdf_bytes(content)
        
        if not result["success"]:
            raise HTTPException(status_code=500, detail=f"Cleaning failed: {result.get('error', 'Unknown error')}")
        
        cleaned_content = result["return_bytes"]
        
        return Response(
            content=cleaned_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=cleaned_{file.filename}"
            }
        )
            
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount the frontend directory to serve static files
# We mount it at the root "/" so index.html is served automatically
frontend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    print(f"Warning: Frontend directory not found at {frontend_path}")
