from fastapi import APIRouter, Depends

from app.auth.deps import CurrentUser, get_current_user
from app.dashboard import service

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def get_summary(current_user: CurrentUser = Depends(get_current_user)):
    return service.get_summary(current_user.store_id)


@router.get("/recent-activity")
def get_recent_activity(current_user: CurrentUser = Depends(get_current_user), limit: int = 10):
    return service.get_recent_activity(current_user.store_id, limit)
