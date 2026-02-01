from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
import os

app = FastAPI(title="TG Auditor Pro API")

# Разрешаем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статические файлы
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/locales", StaticFiles(directory="locales"), name="locales")

# Модели данных
class Channel(BaseModel):
    id: str
    name: str
    members_count: int
    is_member: bool

class AnalysisRequest(BaseModel):
    channel_ids: List[str]

class AnalysisResponse(BaseModel):
    task_id: str
    status: str
    progress: Optional[Dict] = None

# Эндпоинты
@app.get("/")
async def read_root():
    return {"message": "TG Auditor Pro API"}

@app.get("/api/channels")
async def get_channels(user_id: str, limit: int = 100, offset: int = 0):
    """
    Получить каналы пользователя
    В реальности здесь будет запрос к Telegram API
    """
    # Заглушка - возвращаем тестовые данные
    channels = []
    for i in range(offset, min(offset + limit, 100)):
        channels.append({
            "id": f"channel_{i}",
            "name": f"Канал {i}",
            "members_count": 1000 + i * 100,
            "is_member": True
        })
    
    return {
        "channels": channels,
        "total": 100,
        "has_more": offset + len(channels) < 100
    }

@app.post("/api/analyze")
async def analyze_channels(request: AnalysisRequest):
    """
    Запустить анализ каналов
    """
    task_id = f"task_{len(request.channel_ids)}_{hash(tuple(request.channel_ids))}"
    
    return AnalysisResponse(
        task_id=task_id,
        status="queued",
        progress={"current": 0, "total": len(request.channel_ids)}
    )

@app.get("/api/analyze/{task_id}")
async def get_analysis_progress(task_id: str):
    """
    Получить прогресс анализа
    """
    # Заглушка
    return {
        "task_id": task_id,
        "status": "processing",
        "progress": {"current": 5, "total": 10}
    }

@app.post("/api/channels/{channel_id}/leave")
async def leave_channel(channel_id: str, user_id: str):
    """
    Выйти из канала
    """
    # В реальности вызов Telegram API
    return {"success": True, "message": f"Left channel {channel_id}"}

@app.post("/api/channels/{channel_id}/block")
async def block_channel(channel_id: str, user_id: str):
    """
    Заблокировать канал
    """
    return {"success": True, "message": f"Blocked channel {channel_id}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
